# Frontend to Laravel Backend Integration Summary

## Overview

This document explains how to connect your React e-commerce frontend to a Laravel MySQL backend for saving orders, payments, and invoices.

## Files Created

1. **LARAVEL_BACKEND_SETUP.md** - Complete Laravel backend setup guide
   - Database migrations
   - Eloquent models
   - API controllers
   - Database relationships

2. **client/lib/orderApi.ts** - React API helper functions
   - `createOrder()` - Create order in Laravel
   - `recordPayment()` - Save payment details
   - `generateInvoice()` - Generate invoice
   - `getOrder()`, `getUserOrders()` - Retrieve orders

3. **CHECKOUT_INTEGRATION_EXAMPLE.tsx** - Example of how to integrate

## Step-by-Step Implementation

### Step 1: Set Up Laravel Backend

```bash
cd /path/to/your/laravel/project

# Create migrations
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
php artisan make:migration create_payments_table
php artisan make:migration create_invoices_table

# Run migrations
php artisan migrate
```

Copy the migration code from `LARAVEL_BACKEND_SETUP.md` into the generated files.

### Step 2: Create Laravel Models

Create these model files in `app/Models/`:

- `Order.php`
- `OrderItem.php`
- `Payment.php`
- `Invoice.php`

Copy the code from `LARAVEL_BACKEND_SETUP.md`.

### Step 3: Create Laravel Controllers

Create these controller files in `app/Http/Controllers/`:

- `OrderController.php`
- `PaymentController.php`
- `InvoiceController.php`

Copy the code from `LARAVEL_BACKEND_SETUP.md`.

### Step 4: Add API Routes

Update `routes/api.php` with the routes from `LARAVEL_BACKEND_SETUP.md`.

### Step 5: Configure Environment

**Laravel .env:**

```env
APP_URL=https://your-laravel-backend.com
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

**React .env:**

```env
VITE_BACKEND_URL=https://your-laravel-backend.com/api
```

### Step 6: Configure CORS (Laravel)

If your frontend and backend are on different domains, enable CORS:

**Laravel config/cors.php:**

```php
'allowed_origins' => [
    'https://your-frontend-domain.com',
    'http://localhost:3000', // development
],

'allowed_methods' => ['GET', 'POST', 'PUT', 'DELETE'],

'allowed_headers' => ['*'],
```

### Step 7: Update React Checkout

In `client/pages/Checkout.tsx`, import and use the order API:

```typescript
import { createOrder, recordPayment, generateInvoice } from "@/lib/orderApi";
import { toast } from "sonner";

// In your payment success handler:
const handlePaymentSuccess = async (paymentIntentId: string) => {
  try {
    // 1. Create order
    const orderResponse = await createOrder({
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_first_name: formData.firstName,
      shipping_last_name: formData.lastName,
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_state: formData.state,
      shipping_postal_code: formData.postalCode,
      subtotal,
      tax_amount: taxAmount,
      shipping_cost: shippingCost,
      discount_amount: discount,
      total_amount: finalTotal,
      items: cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        unit_price: item.product_price,
        quantity: item.quantity,
        total_price: item.product_price * item.quantity,
        selected_color: item.selectedColor,
      })),
    });

    // 2. Record payment
    await recordPayment({
      order_id: orderResponse.order.id,
      payment_method: "stripe",
      amount: finalTotal,
      transaction_id: paymentIntentId,
    });

    // 3. Generate invoice
    await generateInvoice(orderResponse.order.id);

    // Clear cart and show success
    clearCart();
    toast.success("Order placed successfully!");
    setOrderPlaced(true);
  } catch (error) {
    toast.error(error.message);
  }
};
```

## Database Schema Overview

### orders table

```
id, order_number, user_id, customer_email, customer_phone,
shipping_first_name, shipping_last_name, shipping_address,
shipping_city, shipping_state, shipping_postal_code, shipping_country,
subtotal, tax_amount, shipping_cost, discount_amount, total_amount,
promo_code, status, notes, created_at, updated_at
```

### order_items table

```
id, order_id, product_id, product_name, unit_price,
quantity, total_price, selected_color, created_at, updated_at
```

### payments table

```
id, order_id, payment_method, amount, status,
transaction_id, gateway_response, card_last_four,
card_brand, notes, processed_at, created_at, updated_at
```

### invoices table

```
id, order_id, invoice_number, invoice_data,
status, invoice_date, due_date, sent_at,
viewed_at, paid_at, pdf_path, created_at, updated_at
```

## API Endpoints

### Orders

- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders (paginated)
- `GET /api/orders/{id}` - Get order details
- `PUT /api/orders/{id}` - Update order status

### Payments

- `POST /api/payments` - Record payment
- `GET /api/orders/{id}/payments` - Get order payments

### Invoices

- `GET /api/orders/{id}/invoice` - Generate invoice
- `GET /api/invoices/{id}` - Get invoice details

## Testing with Postman

**Test Order Creation:**

```
POST http://localhost:8000/api/orders
Content-Type: application/json

{
  "customer_email": "test@example.com",
  "customer_phone": "+1234567890",
  "shipping_first_name": "John",
  "shipping_last_name": "Doe",
  "shipping_address": "123 Main St",
  "shipping_city": "New York",
  "shipping_state": "NY",
  "shipping_postal_code": "10001",
  "subtotal": 100,
  "tax_amount": 5,
  "shipping_cost": 0,
  "discount_amount": 0,
  "total_amount": 105,
  "items": [
    {
      "product_id": 1,
      "product_name": "T-Shirt",
      "unit_price": 20,
      "quantity": 5,
      "total_price": 100,
      "selected_color": "Red"
    }
  ]
}
```

## Laravel Admin Dashboard Features

Once data is in the database, your admin panel can display:

### Orders Management

```sql
-- Get all orders
SELECT * FROM orders ORDER BY created_at DESC;

-- Get today's orders
SELECT * FROM orders WHERE DATE(created_at) = CURDATE();

-- Get order with items
SELECT o.*, COUNT(oi.id) as item_count
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.id = ?
GROUP BY o.id;

-- Get pending orders
SELECT * FROM orders WHERE status = 'pending' ORDER BY created_at ASC;

-- Get total revenue
SELECT SUM(total_amount) as total_revenue FROM orders WHERE status = 'delivered';
```

### Payment Tracking

```sql
-- Get all payments
SELECT * FROM payments ORDER BY created_at DESC;

-- Get failed payments
SELECT * FROM payments WHERE status = 'failed';

-- Payment methods used
SELECT payment_method, COUNT(*) as count, SUM(amount) as total
FROM payments
GROUP BY payment_method;
```

### Invoice Management

```sql
-- Get unpaid invoices
SELECT * FROM invoices WHERE status != 'paid' ORDER BY due_date ASC;

-- Get overdue invoices
SELECT * FROM invoices WHERE due_date < NOW() AND status != 'paid';

-- Invoice statistics
SELECT status, COUNT(*) as count FROM invoices GROUP BY status;
```

## Security Considerations

1. **Validate all inputs** on the Laravel backend
2. **Use HTTPS** for all API calls
3. **Implement authentication** (Laravel Sanctum/JWT)
4. **Encrypt sensitive data** (card info)
5. **Rate limit** API endpoints
6. **Log all transactions** for audit
7. **Use CORS** properly to allow only your frontend domain

## Common Issues & Solutions

### Issue: CORS errors

**Solution:** Configure `config/cors.php` to allow your frontend domain

### Issue: 404 errors on API endpoints

**Solution:** Make sure routes are registered in `routes/api.php`

### Issue: Database connection errors

**Solution:** Check `.env` file database credentials and ensure MySQL is running

### Issue: Payment not recording

**Solution:** Ensure `payments` table and `Payment` model exist

### Issue: Orders not showing in admin

**Solution:** Run migrations: `php artisan migrate`

## Next Steps

1. ✅ Create database migrations
2. ✅ Create models and controllers
3. ✅ Set up API routes
4. ✅ Update React checkout to call APIs
5. 🔄 Create Laravel admin dashboard
6. 🔄 Add email notifications
7. 🔄 Generate PDF invoices
8. 🔄 Add order tracking
9. 🔄 Implement refunds
10. 🔄 Add reports & analytics

## Support

For questions or issues:

1. Check Laravel documentation: https://laravel.com/docs
2. Check your server logs: `storage/logs/laravel.log`
3. Test API endpoints with Postman before integrating with React
4. Use `php artisan tinker` to debug database operations

---

**Last Updated:** 2024
**Status:** Ready for Implementation
