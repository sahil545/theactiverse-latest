# Complete Product Ratings & Reviews System - Laravel Backend Setup

## Overview
This is a complete, copy-paste ready setup guide for adding product ratings and reviews to your Laravel backend.

---

## STEP 1: Create Database Migration

### Command:
```bash
cd /path/to/your/laravel/project
php artisan make:migration create_product_ratings_table
```

### File Location:
`database/migrations/YYYY_MM_DD_HHMMSS_create_product_ratings_table.php`

### Complete Code:
Copy and paste this entire content into your migration file:

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
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
            
            // Foreign key constraint
            $table->foreign('product_id')
                ->references('product_id')
                ->on('products')
                ->onDelete('cascade');
            
            // Foreign key constraint for users
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_ratings');
    }
};
```

### Run Migration:
```bash
php artisan migrate
```

---

## STEP 2: Create ProductRating Model

### Command:
```bash
php artisan make:model ProductRating
```

### File Location:
`app/Models/ProductRating.php`

### Complete Code:
Copy and paste this entire content:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductRating extends Model
{
    protected $table = 'product_ratings';
    protected $primaryKey = 'id';
    protected $keyType = 'int';
    public $incrementing = true;
    public $timestamps = true;

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

    /**
     * Relationship: Product Rating belongs to Product
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class, 'product_id', 'product_id');
    }

    /**
     * Relationship: Product Rating belongs to User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    /**
     * Scope: Get only approved ratings
     */
    public function scopeApproved($query)
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope: Get ratings by product
     */
    public function scopeByProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    /**
     * Scope: Get recent ratings first
     */
    public function scopeRecent($query)
    {
        return $query->orderBy('created_at', 'desc');
    }

    /**
     * Get average rating for a product
     */
    public static function getAverageRating($productId)
    {
        return self::byProduct($productId)
            ->approved()
            ->avg('rating') ?? 0;
    }

    /**
     * Get rating count for a product
     */
    public static function getRatingCount($productId)
    {
        return self::byProduct($productId)
            ->approved()
            ->count();
    }

    /**
     * Get rating distribution for a product
     */
    public static function getRatingDistribution($productId)
    {
        $allRatings = self::byProduct($productId)->approved()->get();
        
        return [
            '5' => $allRatings->where('rating', 5)->count(),
            '4' => $allRatings->where('rating', 4)->count(),
            '3' => $allRatings->where('rating', 3)->count(),
            '2' => $allRatings->where('rating', 2)->count(),
            '1' => $allRatings->where('rating', 1)->count(),
        ];
    }
}
```

---

## STEP 3: Update Product Model

### File Location:
`app/Models/Product.php`

### Add These Methods:
Find your Product model and add these relationships and methods:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    // ... your existing code ...

    /**
     * Relationship: Product has many ratings
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(ProductRating::class, 'product_id', 'product_id');
    }

    /**
     * Get average rating for this product
     */
    public function getAverageRatingAttribute()
    {
        return $this->ratings()
            ->where('is_approved', true)
            ->avg('rating') ?? 0;
    }

    /**
     * Get rating count for this product
     */
    public function getRatingCountAttribute()
    {
        return $this->ratings()
            ->where('is_approved', true)
            ->count();
    }
}
```

---

## STEP 4: Create RatingController

### Command:
```bash
php artisan make:controller RatingController
```

### File Location:
`app/Http/Controllers/RatingController.php`

### Complete Code:
Copy and paste this entire content:

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
     * GET /api/products/{productId}/ratings
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
            $allRatings = ProductRating::byProduct($productId)
                ->approved()
                ->get();
            
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
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Product not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching ratings: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create or update a rating
     * POST /api/products/{productId}/ratings
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

    /**
     * Delete a rating
     * DELETE /api/ratings/{ratingId}
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
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Rating not found',
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error deleting rating: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's rating for a product
     * GET /api/products/{productId}/my-rating
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

---

## STEP 5: Add API Routes

### File Location:
`routes/api.php`

### Add These Routes:
Copy and paste these routes at the end of your `routes/api.php` file:

```php
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RatingController;

// ... your existing routes ...

// Rating Routes
Route::prefix('products/{productId}')->group(function () {
    // Get all ratings for a product (public - no auth needed)
    Route::get('ratings', [RatingController::class, 'getProductRatings']);
    
    // Get user's rating for a product (requires auth)
    Route::get('my-rating', [RatingController::class, 'getUserRating'])
        ->middleware('auth:sanctum');
});

// Create/update rating (requires auth)
Route::post('products/{productId}/ratings', [RatingController::class, 'createOrUpdateRating'])
    ->middleware('auth:sanctum');

// Delete rating (requires auth)
Route::delete('ratings/{ratingId}', [RatingController::class, 'deleteRating'])
    ->middleware('auth:sanctum');
```

---

## STEP 6: Run All Commands

### In Your Laravel Project Terminal:

```bash
# Run the migration to create the table
php artisan migrate

# Clear cache to refresh routes
php artisan route:cache

# Or if you want to clear everything
php artisan cache:clear
php artisan route:clear
```

---

## STEP 7: Test the API with cURL

### Test 1: Get Product Ratings
```bash
curl -X GET "https://admin.theactiverse.com/api/products/1/ratings" \
  -H "Accept: application/json"
```

### Test 2: Create a Rating (requires authentication)
```bash
curl -X POST "https://admin.theactiverse.com/api/products/1/ratings" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rating": 5,
    "comment": "Great product!"
  }'
```

### Test 3: Get User's Rating
```bash
curl -X GET "https://admin.theactiverse.com/api/products/1/my-rating" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

### Test 4: Delete Rating
```bash
curl -X DELETE "https://admin.theactiverse.com/api/ratings/1" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN"
```

---

## STEP 8: Make Sure Authentication is Set Up

### Check Your Laravel Installation:

1. **Ensure Laravel Sanctum is installed:**
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

2. **Update User Model** (`app/Models/User.php`):
```php
<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // ... existing code ...
}
```

3. **Update Middleware** (`app/Http/Middleware/Authenticate.php`):
Make sure `'sanctum'` is included in your guards.

---

## STEP 9: Verify Database Table

### In Your Database:

```sql
-- Check if table was created
SHOW TABLES LIKE 'product_ratings';

-- Check table structure
DESCRIBE product_ratings;

-- Check some data
SELECT * FROM product_ratings;

-- Get statistics for a product
SELECT 
  product_id,
  COUNT(*) as total_ratings,
  AVG(rating) as average_rating,
  SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_stars,
  SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_stars,
  SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_stars,
  SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_stars,
  SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
FROM product_ratings
WHERE is_approved = 1
GROUP BY product_id;
```

---

## TROUBLESHOOTING

### Error: "Table 'product_ratings' doesn't exist"
```bash
php artisan migrate
```

### Error: "SQLSTATE[HY000]: General error: 1215 Cannot add foreign key constraint"
- Make sure the `products` table exists
- Make sure the `users` table exists
- Check that the column names match exactly

### Error: "Call to undefined method"
- Clear config cache: `php artisan config:clear`
- Clear route cache: `php artisan route:clear`

### Error: "Unauthenticated" when creating rating
- Make sure the frontend is sending the auth token
- Check that Laravel Sanctum is installed and configured
- Verify the token is valid in the Authorization header

### API returns empty statistics
- Wait for some ratings to be added first
- Make sure ratings have `is_approved = true` in the database

---

## Database Schema Reference

```sql
CREATE TABLE product_ratings (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  product_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NULLABLE,
  guest_email VARCHAR(255) NULLABLE,
  guest_name VARCHAR(255) NULLABLE,
  rating INT NOT NULL (1-5),
  comment LONGTEXT NULLABLE,
  helpful_count INT DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX product_id_idx (product_id),
  INDEX user_id_idx (user_id)
);
```

---

## Next Steps

1. ✅ Copy migration code and run `php artisan migrate`
2. ✅ Copy ProductRating model
3. ✅ Update Product model with relationships
4. ✅ Copy RatingController
5. ✅ Add routes to `routes/api.php`
6. ✅ Test API endpoints
7. ✅ Frontend will automatically work!

---

## Summary

That's it! The Laravel backend is now ready. Your React frontend will:
- ✅ Show rating badges on all product listings
- ✅ Display full ratings & reviews on product detail pages
- ✅ Allow authenticated users to add/edit/delete their reviews
- ✅ Cache results to avoid excessive API calls

**If you have any issues, check the Laravel logs:**
```bash
tail -f storage/logs/laravel.log
```
