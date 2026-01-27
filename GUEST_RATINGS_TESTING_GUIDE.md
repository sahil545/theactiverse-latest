# Guest Ratings Testing Guide

## What Changed

Your backend and frontend now support **guest ratings** - users don't need to be logged in to rate and comment on products!

---

## Backend Changes Required

You need to update your Laravel backend with the changes from `LARAVEL_GUEST_RATINGS_UPDATE.md`:

### 1. Update the `createOrUpdateRating` method in `RatingController.php`
   - Supports both authenticated users (with token) and guest users (with email & name)
   - Guest ratings are tracked by email address
   - If same guest email rates again, it updates their previous rating

### 2. Update the `getUserRating` method 
   - Now accepts `guest_email` query parameter for guest users
   - Example: `/api/products/1/my-rating?guest_email=test@example.com`

### 3. Update routes in `routes/api.php`
   - Remove `auth:sanctum` middleware from the rating creation endpoint
   - This allows both authenticated and guest users to submit

### Steps to Apply Backend Changes:

```bash
# 1. Open your Laravel project
cd /path/to/your/laravel/project

# 2. Update the RatingController.php with the new code from LARAVEL_GUEST_RATINGS_UPDATE.md
# File: app/Http/Controllers/RatingController.php

# 3. Update routes/api.php with the new routes from LARAVEL_GUEST_RATINGS_UPDATE.md

# 4. Clear cache (important!)
php artisan cache:clear
php artisan route:clear
php artisan config:clear
```

---

## Frontend Changes (Already Done ✅)

The frontend has been updated to:
- ✅ Accept guest email & name in the rating form
- ✅ Validate email format
- ✅ Submit ratings without authentication
- ✅ Show guest name on ratings (instead of "Anonymous")
- ✅ Allow guests to update their ratings using email

---

## Testing Guest Ratings

### Test 1: Submit a Guest Rating via API

```bash
curl -X POST "https://ecommerce.standtogetherhelp.com/api/products/1/ratings" \
  -H "Content-Type: application/json" \
  -d '{
    "guest_email": "tester@example.com",
    "guest_name": "Test User",
    "rating": 5,
    "comment": "This is a great product! I recommend it to everyone."
  }'
```

**Expected Response:**
```json
{
  "status": true,
  "data": {
    "id": 1,
    "product_id": 1,
    "user_id": null,
    "guest_email": "tester@example.com",
    "guest_name": "Test User",
    "rating": 5,
    "comment": "This is a great product! I recommend it to everyone.",
    "helpful_count": 0,
    "is_approved": true,
    "created_at": "2024-01-20T10:30:00Z"
  },
  "message": "Rating created successfully"
}
```

### Test 2: View Guest Rating in Frontend

1. Open your website to a product page
2. Scroll down to the ratings section
3. Click "Add Your Rating" button
4. **Fill in:**
   - Full Name: `Test User`
   - Email: `tester@example.com`
   - Rating: Select 5 stars
   - Comment: `Great product!`
5. Click "Submit Rating"
6. Your rating should appear immediately in the reviews section
7. Your name should display as "Test User" (not "Anonymous")

### Test 3: Update Guest Rating

1. Go to the same product (without logging in)
2. Scroll to ratings section
3. Click "Add Your Rating" again
4. Use the **same email**: `tester@example.com`
5. Change the rating or comment
6. Click "Submit Rating"
7. It should update your previous rating instead of creating a new one

### Test 4: View All Ratings for a Product

```bash
curl -X GET "https://ecommerce.standtogetherhelp.com/api/products/1/ratings"
```

**Expected Response:**
```json
{
  "status": true,
  "data": {
    "ratings": [
      {
        "id": 1,
        "product_id": 1,
        "user_id": null,
        "rating": 5,
        "comment": "Great product!",
        "user": null,
        "guest_name": "Test User",
        "guest_email": "tester@example.com",
        "created_at": "2024-01-20T10:30:00Z"
      }
    ],
    "statistics": {
      "total_ratings": 1,
      "average_rating": 5,
      "rating_distribution": {
        "5": 1,
        "4": 0,
        "3": 0,
        "2": 0,
        "1": 0
      }
    }
  }
}
```

### Test 5: Verify in Database

```sql
-- Check all guest ratings
SELECT * FROM product_ratings WHERE user_id IS NULL;

-- Should see:
-- - guest_email: tester@example.com
-- - guest_name: Test User
-- - rating: 5
-- - comment: Great product!
-- - is_approved: 1
```

---

## Frontend Testing Checklist

- [ ] Product detail page loads without errors
- [ ] "Add Your Rating" button is visible and clickable
- [ ] Form shows guest email & name fields (not authenticated users)
- [ ] Email validation works (shows error for invalid emails)
- [ ] Can submit rating with guest email & name
- [ ] Rating appears immediately after submission
- [ ] Guest name displays correctly on the review
- [ ] Can update rating using same email
- [ ] Rating badge shows on product cards with correct average
- [ ] All ratings visible on product detail page

---

## Common Issues & Solutions

### Issue: "Invalid email" error in frontend
**Solution:** Make sure you're entering a valid email format (e.g., `test@example.com`)

### Issue: "Rating updated successfully" but shows new rating instead of updating
**Solution:** 
1. Check that guest email is exactly the same (case-sensitive)
2. Verify in database that old rating has same guest_email
3. Make sure you updated the `createOrUpdateRating` method in RatingController

### Issue: Rating submission fails with "Validation error"
**Solution:**
1. Make sure guest_email and guest_name are provided in request body
2. Guest_email must be a valid email format
3. Rating must be between 1-5
4. Comment is optional

### Issue: Frontend shows "No authentication token" error
**Solution:**
1. The error message should not appear for guests
2. Check that routes in `routes/api.php` don't require `auth:sanctum` middleware on POST ratings endpoint
3. Clear Laravel cache: `php artisan route:clear`

### Issue: Database shows `user_id IS NOT NULL` for guest ratings
**Solution:**
1. Make sure you updated the controller to set `user_id` to null for guest ratings
2. Verify the line: `'user_id' => null,` in the guest rating creation

---

## How Guest Ratings Work

```
GUEST USER FLOW:
1. User visits product page (NOT logged in)
2. Clicks "Add Your Rating"
3. Form appears with:
   - Full Name field
   - Email field
   - Rating stars
   - Comment (optional)
4. User fills form and submits
5. Frontend sends to: POST /api/products/1/ratings
   {
     "guest_email": "...",
     "guest_name": "...",
     "rating": 5,
     "comment": "..."
   }
6. Backend creates record with user_id = null
7. If same guest_email submits again, it updates the record
8. Rating displays with guest_name instead of user name

AUTHENTICATED USER FLOW:
1. User logs in
2. Visits product page (logged in)
3. Clicks "Add Your Rating"
4. Form appears with just:
   - Rating stars
   - Comment (optional)
   - NO name/email fields
5. User fills and submits
6. Frontend sends to: POST /api/products/1/ratings
   {
     "rating": 5,
     "comment": "...",
     "Authorization": "Bearer {token}"
   }
7. Backend creates record with user_id = logged in user
8. If same user submits again, it updates their rating
9. Rating displays with user's name and photo
```

---

## Next Steps

1. **Apply backend changes** from `LARAVEL_GUEST_RATINGS_UPDATE.md`
2. **Clear Laravel cache:**
   ```bash
   php artisan cache:clear
   php artisan route:clear
   php artisan config:clear
   ```
3. **Test guest rating submission** using the frontend
4. **Verify in database** that guest ratings are saved
5. **Test with multiple emails** to ensure update logic works
6. **Test authenticated user ratings** to ensure they still work

---

## Troubleshooting Database

### Check if guest ratings table exists:
```sql
SHOW TABLES LIKE 'product_ratings';
DESCRIBE product_ratings;
```

### View all guest ratings:
```sql
SELECT id, product_id, guest_email, guest_name, rating, comment, created_at 
FROM product_ratings 
WHERE user_id IS NULL
ORDER BY created_at DESC;
```

### View all authenticated user ratings:
```sql
SELECT id, product_id, user_id, rating, comment, created_at 
FROM product_ratings 
WHERE user_id IS NOT NULL
ORDER BY created_at DESC;
```

### View combined statistics:
```sql
SELECT 
  product_id,
  COUNT(*) as total_ratings,
  ROUND(AVG(rating), 1) as average_rating,
  SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as five_star,
  SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as four_star,
  SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as three_star,
  SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as two_star,
  SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as one_star
FROM product_ratings
WHERE is_approved = 1
GROUP BY product_id;
```

---

## Summary

✅ **Guest ratings are now enabled!**

Users can:
- Rate products without logging in
- Leave comments about their experience
- Update their rating using the same email
- See all ratings from both guests and authenticated users

Frontend automatically shows:
- Rating badges on product cards
- Full rating summary on product detail pages
- Guest name on all reviews
- Average rating and rating distribution

**Ready to test? Follow the testing checklist above!**
