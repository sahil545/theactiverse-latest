# Allow Guest Ratings & Comments - Laravel Backend Update

## Overview
This guide shows how to update your existing Laravel backend to allow guest users (not authenticated) to submit ratings and comments.

---

## STEP 1: Update RatingController

### File Location:
`app/Http/Controllers/RatingController.php`

### Replace the `createOrUpdateRating` method:

Find this method in your RatingController:
```php
public function createOrUpdateRating(Request $request, $productId): JsonResponse
```

And replace it with this updated version that supports both authenticated and guest ratings:

```php
/**
 * Create or update a rating (supports both authenticated and guest users)
 * POST /api/products/{productId}/ratings
 */
public function createOrUpdateRating(Request $request, $productId): JsonResponse
{
    try {
        // Check if product exists
        $product = Product::where('product_id', $productId)->firstOrFail();

        // Get authenticated user
        $userId = auth()->id();
        
        // Validate request based on user type
        if ($userId) {
            // Authenticated user - only needs rating and comment
            $validated = $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
            ]);

            // Create or update rating for authenticated user
            $rating = ProductRating::updateOrCreate(
                [
                    'product_id' => $productId,
                    'user_id' => $userId,
                ],
                [
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'] ?? null,
                    'is_approved' => true,
                    'guest_email' => null,
                    'guest_name' => null,
                ]
            );

            return response()->json([
                'status' => true,
                'data' => $rating,
                'message' => $rating->wasRecentlyCreated ? 'Rating created successfully' : 'Rating updated successfully',
            ]);
        } else {
            // Guest user - needs email, name, rating, and comment
            $validated = $request->validate([
                'guest_email' => 'required|email|max:255',
                'guest_name' => 'required|string|max:255',
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
            ]);

            // Check if guest already rated (by email)
            $existingRating = ProductRating::where('product_id', $productId)
                ->where('guest_email', $validated['guest_email'])
                ->first();

            if ($existingRating) {
                // Update existing guest rating
                $existingRating->update([
                    'guest_name' => $validated['guest_name'],
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'] ?? null,
                    'is_approved' => true,
                ]);
                $rating = $existingRating;
                $isNew = false;
            } else {
                // Create new guest rating
                $rating = ProductRating::create([
                    'product_id' => $productId,
                    'user_id' => null,
                    'guest_email' => $validated['guest_email'],
                    'guest_name' => $validated['guest_name'],
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'] ?? null,
                    'is_approved' => true,
                ]);
                $isNew = true;
            }

            return response()->json([
                'status' => true,
                'data' => $rating,
                'message' => $isNew ? 'Rating created successfully' : 'Rating updated successfully',
            ]);
        }
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'status' => false,
            'message' => 'Product not found',
        ], 404);
    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'status' => false,
            'message' => 'Validation error',
            'errors' => $e->errors(),
        ], 422);
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Error creating/updating rating: ' . $e->getMessage(),
        ], 500);
    }
}
```

### Update the Routes

Update `routes/api.php`:

```php
// Rating Routes
Route::prefix('products/{productId}')->group(function () {
    // Get all ratings for a product (public - no auth needed)
    Route::get('ratings', [RatingController::class, 'getProductRatings']);
    
    // Get user's rating for a product (optional auth - works for both guest and authenticated)
    Route::get('my-rating', [RatingController::class, 'getUserRating']);
});

// Create/update rating (works for both authenticated and guest users - NO auth required)
Route::post('products/{productId}/ratings', [RatingController::class, 'createOrUpdateRating']);

// Delete rating (requires auth)
Route::delete('ratings/{ratingId}', [RatingController::class, 'deleteRating'])
    ->middleware('auth:sanctum');
```

---

## STEP 2: Update getUserRating Method

Also update this method in your RatingController to support guests:

```php
/**
 * Get user's rating for a product (authenticated or guest)
 * GET /api/products/{productId}/my-rating
 */
public function getUserRating($productId): JsonResponse
{
    try {
        $userId = auth()->id();
        $guestEmail = request()->query('guest_email');

        if ($userId) {
            // Get authenticated user's rating
            $rating = ProductRating::where('product_id', $productId)
                ->where('user_id', $userId)
                ->first();

            return response()->json([
                'status' => true,
                'data' => $rating,
                'message' => 'User rating retrieved',
            ]);
        } elseif ($guestEmail) {
            // Get guest's rating by email
            $rating = ProductRating::where('product_id', $productId)
                ->where('guest_email', $guestEmail)
                ->first();

            return response()->json([
                'status' => true,
                'data' => $rating,
                'message' => 'Guest rating retrieved',
            ]);
        } else {
            return response()->json([
                'status' => true,
                'data' => null,
                'message' => 'No user identified',
            ]);
        }
    } catch (\Exception $e) {
        return response()->json([
            'status' => false,
            'message' => 'Error fetching rating: ' . $e->getMessage(),
        ], 500);
    }
}
```

---

## STEP 3: Test Guest Ratings with cURL

### Test: Create a Guest Rating
```bash
curl -X POST "https://admin.theactiverse.com/api/products/1/ratings" \
  -H "Content-Type: application/json" \
  -d '{
    "guest_email": "test@example.com",
    "guest_name": "John Doe",
    "rating": 5,
    "comment": "Great product! Highly recommended for everyone."
  }'
```

### Test: Get Guest Rating
```bash
curl -X GET "https://admin.theactiverse.com/api/products/1/my-rating?guest_email=test@example.com" \
  -H "Content-Type: application/json"
```

### Expected Response:
```json
{
  "status": true,
  "data": {
    "id": 1,
    "product_id": 1,
    "user_id": null,
    "guest_email": "test@example.com",
    "guest_name": "John Doe",
    "rating": 5,
    "comment": "Great product! Highly recommended for everyone.",
    "helpful_count": 0,
    "is_approved": true,
    "created_at": "2024-01-20T10:30:00Z",
    "updated_at": "2024-01-20T10:30:00Z"
  },
  "message": "Rating created successfully"
}
```

---

## How It Works Now

### For Authenticated Users:
- No guest_email or guest_name required
- Submit rating directly with just `rating` and optional `comment`
- Backend uses their `user_id` from authentication

### For Guest Users:
- Must provide `guest_email` and `guest_name`
- Can provide `rating` and optional `comment`
- Backend stores their email to track if they already rated
- If same guest email rates again, it updates their previous rating

---

## Database Check

### See all ratings (including guest):
```sql
SELECT 
  id,
  product_id,
  user_id,
  guest_email,
  guest_name,
  rating,
  comment,
  is_approved,
  created_at
FROM product_ratings
ORDER BY created_at DESC;
```

### See only guest ratings:
```sql
SELECT * FROM product_ratings WHERE user_id IS NULL;
```

### See authenticated user ratings:
```sql
SELECT * FROM product_ratings WHERE user_id IS NOT NULL;
```

---

## Summary

Now your backend supports:
✅ Authenticated users submitting ratings (with user_id)
✅ Guest users submitting ratings (with email & name)
✅ Both can update their own ratings
✅ Only authenticated users can delete (for security)
✅ All ratings visible to everyone

The frontend will automatically work with this once deployed!
