# Laravel User Authentication API Setup

This document provides complete instructions for setting up user authentication endpoints in your Laravel backend.

## Prerequisites

- Laravel 10+ project
- MySQL database
- Composer installed

## Step 1: Create Authentication Migration

Laravel comes with a built-in `users` table migration. If you haven't run migrations yet, do:

```bash
php artisan migrate
```

If you need to customize the users table, create a new migration:

```bash
php artisan make:migration add_fields_to_users_table --table=users
```

Add these fields to the migration if not already present:

```php
public function up(): void
{
    Schema::table('users', function (Blueprint $table) {
        if (!Schema::hasColumn('users', 'phone_number')) {
            $table->string('phone_number')->nullable();
        }
        if (!Schema::hasColumn('users', 'photo')) {
            $table->string('photo')->nullable();
        }
        if (!Schema::hasColumn('users', 'role')) {
            $table->string('role')->default('customer'); // customer, vendor, admin
        }
    });
}

public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        $table->dropColumn(['phone_number', 'photo', 'role']);
    });
}
```

Run the migration:

```bash
php artisan migrate
```

## Step 2: Create User Model

The User model should already exist at `app/Models/User.php`. Update it if needed:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone_number',
        'photo',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
```

## Step 3: Install Laravel Sanctum

Laravel Sanctum provides simple token-based API authentication:

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

## Step 4: Create Authentication Controller

Create the controller:

```bash
php artisan make:controller AuthController
```

Add this code to `app/Http/Controllers/AuthController.php`:

```php
<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login user and return token
     */
    public function login(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            $user = User::where('email', $validated['email'])->first();

            if (!$user || !Hash::check($validated['password'], $user->password)) {
                return response()->json([
                    'status' => false,
                    'message' => 'Invalid credentials',
                ], 401);
            }

            // Generate token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Login successful',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone_number,
                    'photo' => $user->photo,
                    'role' => $user->role,
                ],
            ], 200);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Login failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Register a new user
     */
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:8|confirmed',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'customer',
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => true,
                'message' => 'Registration successful',
                'token' => $token,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->phone_number,
                    'photo' => $user->photo,
                    'role' => $user->role,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Registration failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Logout user
     */
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'status' => true,
                'message' => 'Logged out successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Logout failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get current user profile
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'status' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone_number,
                'photo' => $user->photo,
                'role' => $user->role,
                'created_at' => $user->created_at,
            ],
        ], 200);
    }
}
```

## Step 5: Create API Routes

Add these routes to `routes/api.php`:

```php
<?php

use App\Http\Controllers\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public auth routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
});
```

## Step 6: Update Middleware Configuration

Add Sanctum middleware to `app/Http/Middleware/Authenticate.php` if not already present:

```php
protected $guards = [
    'api' => 'sanctum',
];
```

## Step 7: Configure CORS

Update `config/cors.php` to allow your frontend domain:

```php
'allowed_origins' => [
    'https://your-frontend-domain.com',
    'http://localhost:3000', // for development
    'http://localhost:5173', // Vite default port
],

'allowed_methods' => ['*'],

'allowed_headers' => ['*'],

'exposed_headers' => ['Authorization'],

'max_age' => 0,

'supports_credentials' => true,
```

## Step 8: Test the API Endpoints

### Test Login Endpoint

```bash
curl -X POST https://ecommerce.standtogetherhelp.com/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Response:**
```json
{
  "status": true,
  "message": "Login successful",
  "token": "1|abc123...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "+1234567890",
    "photo": null,
    "role": "customer"
  }
}
```

### Test Register Endpoint

```bash
curl -X POST https://ecommerce.standtogetherhelp.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Test Profile Endpoint (Protected)

```bash
curl -X GET https://ecommerce.standtogetherhelp.com/api/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Frontend Integration

The frontend is already configured to use these endpoints:

1. **Login**: User clicks "Login" button → Modal opens → Sends POST to `/api/login`
2. **Token Storage**: Token saved in localStorage with key `authToken`
3. **User Data**: User info saved in localStorage with key `user`
4. **Logout**: Click logout button → Tokens removed → User logged out

## Environment Variables

Make sure your `.env` file has:

```env
APP_URL=https://ecommerce.standtogetherhelp.com
DB_CONNECTION=mysql
DB_HOST=your-db-host
DB_PORT=3306
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

SANCTUM_STATEFUL_DOMAINS=ecommerce.standtogetherhelp.com,localhost:3000,localhost:5173
SESSION_DOMAIN=.ecommerce.standtogetherhelp.com
```

## Troubleshooting

### "Undefined column: 'api_token'"
Solution: You don't need `api_token` column, Sanctum uses tokens table.

### CORS errors
Solution: Update `config/cors.php` and include your frontend domain.

### "Unauthenticated" on protected routes
Solution: Make sure to send `Authorization: Bearer YOUR_TOKEN` header.

### Token not working
Solution: Verify `config/sanctum.php` has correct middleware setup and run migrations.

## Production Considerations

1. Always use HTTPS in production
2. Set `SESSION_SECURE_COOKIES=true` in `.env`
3. Regenerate session IDs on login
4. Implement rate limiting on auth endpoints
5. Use strong password requirements
6. Log all authentication attempts

## Additional Resources

- [Laravel Sanctum Documentation](https://laravel.com/docs/sanctum)
- [Laravel Authentication](https://laravel.com/docs/authentication)
- [CORS Configuration](https://laravel.com/docs/cors)

---

**Last Updated:** 2024
**Status:** Ready for Implementation
