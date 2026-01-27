# Product Ratings & Reviews System - Laravel Backend Setup

## Overview

This guide provides complete setup instructions for adding a product ratings and reviews system to your Laravel backend.

## Files to Create

### 1. Database Migrations

Create two migrations for the ratings table:

```bash
php artisan make:migration create_product_ratings_table
```

**database/migrations/YYYY_MM_DD_create_product_ratings_table.php:**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_ratings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('product_id')->index();
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->string('guest_email')->nullable();
            $table->string('guest_name')->nullable();
            $table->integer('rating')->min(1)->max(5);
            $table->text('comment')->nullable();
            $table->integer('helpful_count')->default(0);
            $table->boolean('is_approved')->default(true);
            $table->timestamps();
            
            $table->foreign('product_id')->references('product_id')->on('products')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Ensure one rating per user per product
            $table->unique(['product_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_ratings');
    }
};
```

### 2. Laravel Models

Create the ProductRating model:

**app/Models/ProductRating.php:**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductRating extends Model
{
    protected $table = 'product_ratings';
    protected $primaryKey = 'id';

    protected $fillable = [
        'product_id',
        'user_id',
        'guest_email',
        'guest_name',
        'rating',
        'comment',
        'helpful_count',
        'is_approved',
    ];

    protected $casts = [
        'rating' => 'integer',
        'helpful_count' => 'integer',
        'is_approved' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    // Helper methods
    public function getAverageRating()
    {
        return self::byProduct($this->product_id)->approved()->avg('rating') ?? 0;
    }

    public function getRatingCount()
    {
        return self::byProduct($this->product_id)->approved()->count();
    }
}
```

Update your **app/Models/Product.php** to add the relationship:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    // ... existing code ...

    public function ratings(): HasMany
    {
        return $this->hasMany(ProductRating::class, 'product_id', 'product_id');
    }

    public function getAverageRatingAttribute()
    {
        return $this->ratings()->where('is_approved', true)->avg('rating') ?? 0;
    }

    public function getRatingCountAttribute()
    {
        return $this->ratings()->where('is_approved', true)->count();
    }
}
```

### 3. Laravel Controller

Create the RatingController:

**app/Http/Controllers/RatingController.php:**

```php
<?php

namespace App\Http\Controllers;

use App\Models\ProductRating;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RatingController extends Controller
{
    /**
     * Get all ratings for a product
     */
    public function getProductRatings($productId): JsonResponse
    {
        try {
            // Check if product exists
            $product = Product::where('product_id', $productId)->firstOrFail();

            // Get approved ratings with pagination
            $ratings = ProductRating::byProduct($productId)
                ->approved()
                ->with('user:id,name,photo')
                ->recent()
                ->paginate(10);

            // Get rating statistics
            $allRatings = ProductRating::byProduct($productId)->approved()->get();
            $totalRatings = $allRatings->count();
            $averageRating = $allRatings->avg('rating') ?? 0;

            // Rating distribution
            $ratingDistribution = [
                5 => $allRatings->where('rating', 5)->count(),
                4 => $allRatings->where('rating', 4)->count(),
                3 => $allRatings->where('rating', 3)->count(),
                2 => $allRatings->where('rating', 2)->count(),
                1 => $allRatings->where('rating', 1)->count(),
            ];

            return response()->json([
                'status' => true,
                'data' => [
                    'ratings' => $ratings->items(),
                    'pagination' => [
                        'current_page' => $ratings->currentPage(),
                        'last_page' => $ratings->lastPage(),
                        'total' => $ratings->total(),
                        'per_page' => $ratings->perPage(),
                    ],
                    'statistics' => [
                        'total_ratings' => $totalRatings,
                        'average_rating' => round($averageRating, 1),
                        'rating_distribution' => $ratingDistribution,
                    ],
                ],
                'message' => 'Product ratings retrieved successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching ratings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create or update a rating
     */
    public function createOrUpdateRating(Request $request, $productId): JsonResponse
    {
        try {
            // Validate request
            $validated = $request->validate([
                'rating' => 'required|integer|min:1|max:5',
                'comment' => 'nullable|string|max:1000',
            ]);

            // Check if product exists
            $product = Product::where('product_id', $productId)->firstOrFail();

            // Get authenticated user
            $userId = auth()->id();

            if (!$userId) {
                return response()->json([
                    'status' => false,
                    'message' => 'User must be authenticated to add a rating',
                ], 401);
            }

            // Create or update rating
            $rating = ProductRating::updateOrCreate(
                [
                    'product_id' => $productId,
                    'user_id' => $userId,
                ],
                [
                    'rating' => $validated['rating'],
                    'comment' => $validated['comment'] ?? null,
                    'is_approved' => true,
                ]
            );

            return response()->json([
                'status' => true,
                'data' => $rating,
                'message' => $rating->wasRecentlyCreated ? 'Rating created successfully' : 'Rating updated successfully',
            ]);
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

    /**
     * Delete a rating (only by owner or admin)
     */
    public function deleteRating($ratingId): JsonResponse
    {
        try {
            $rating = ProductRating::findOrFail($ratingId);

            // Check if user owns this rating
            if ($rating->user_id !== auth()->id()) {
                return response()->json([
                    'status' => false,
                    'message' => 'Unauthorized to delete this rating',
                ], 403);
            }

            $rating->delete();

            return response()->json([
                'status' => true,
                'message' => 'Rating deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error deleting rating: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's rating for a product
     */
    public function getUserRating($productId): JsonResponse
    {
        try {
            $userId = auth()->id();

            if (!$userId) {
                return response()->json([
                    'status' => true,
                    'data' => null,
                    'message' => 'User not authenticated',
                ]);
            }

            $rating = ProductRating::where('product_id', $productId)
                ->where('user_id', $userId)
                ->first();

            return response()->json([
                'status' => true,
                'data' => $rating,
                'message' => 'User rating retrieved',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching user rating: ' . $e->getMessage(),
            ], 500);
        }
    }
}
```

### 4. API Routes

Add to **routes/api.php:**

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RatingController;

// Rating routes
Route::prefix('products/{productId}')->group(function () {
    // Get all ratings for a product (public)
    Route::get('ratings', [RatingController::class, 'getProductRatings']);
    
    // Get user's rating for a product (authenticated)
    Route::get('my-rating', [RatingController::class, 'getUserRating'])->middleware('auth:sanctum');
});

// Create/update rating (authenticated)
Route::post('products/{productId}/ratings', [RatingController::class, 'createOrUpdateRating'])
    ->middleware('auth:sanctum');

// Delete rating (authenticated)
Route::delete('ratings/{ratingId}', [RatingController::class, 'deleteRating'])
    ->middleware('auth:sanctum');
```

### 5. Run Migration

```bash
php artisan migrate
```

## Testing the API

### 1. Get Product Ratings

```bash
curl -X GET "https://your-backend.com/api/products/1/ratings"
```

**Response:**
```json
{
  "status": true,
  "data": {
    "ratings": [
      {
        "id": 1,
        "product_id": 1,
        "user_id": 5,
        "rating": 5,
        "comment": "Great product!",
        "user": {
          "id": 5,
          "name": "John Doe",
          "photo": "..."
        },
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {...},
    "statistics": {
      "total_ratings": 10,
      "average_rating": 4.5,
      "rating_distribution": {
        "5": 6,
        "4": 3,
        "3": 1,
        "2": 0,
        "1": 0
      }
    }
  },
  "message": "Product ratings retrieved successfully"
}
```

### 2. Create Rating

```bash
curl -X POST "https://your-backend.com/api/products/1/ratings" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Excellent product, highly recommended!"
  }'
```

### 3. Get User's Rating

```bash
curl -X GET "https://your-backend.com/api/products/1/my-rating" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Delete Rating

```bash
curl -X DELETE "https://your-backend.com/api/ratings/1" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Next Steps

1. Copy migration file and run `php artisan migrate`
2. Update your Product model with the relationships
3. Create the RatingController and add routes
4. Test endpoints with Postman/curl
5. Implement frontend components (see RATINGS_FRONTEND_SETUP.md)

## Database Schema

```
product_ratings table:
- id: primary key
- product_id: foreign key to products
- user_id: foreign key to users (nullable for guest reviews)
- guest_email: for guest ratings
- guest_name: for guest ratings
- rating: 1-5 stars
- comment: optional review text
- helpful_count: count of helpful votes
- is_approved: for moderation
- created_at, updated_at: timestamps
```

## Security Notes

1. Validate rating values (1-5)
2. Ensure authentication for authenticated users
3. Allow only owner to delete their rating
4. Add rate limiting to prevent spam
5. Consider adding email verification before allowing ratings

## Advanced Features (Optional)

- Photo uploads in reviews
- Helpful/unhelpful voting
- Email notifications for reviews
- Review moderation queue
- Review search/filtering
- Duplicate prevention
