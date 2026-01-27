# Laravel Backend Integration Guide

This guide will help you set up orders, payments, and invoices in your Laravel MySQL database.

## Database Structure

### 1. Create Migrations

Run these commands in your Laravel project:

```bash
php artisan make:migration create_orders_table
php artisan make:migration create_order_items_table
php artisan make:migration create_payments_table
php artisan make:migration create_invoices_table
```

### 2. Order Migration

**database/migrations/xxxx_xx_xx_create_orders_table.php**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // e.g., ORD-2024-001
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->string('customer_email');
            $table->string('customer_phone');

            // Shipping Information
            $table->string('shipping_first_name');
            $table->string('shipping_last_name');
            $table->string('shipping_address');
            $table->string('shipping_city');
            $table->string('shipping_state');
            $table->string('shipping_postal_code');
            $table->string('shipping_country')->default('US');

            // Order Totals
            $table->decimal('subtotal', 12, 2)->default(0);
            $table->decimal('tax_amount', 12, 2)->default(0);
            $table->decimal('shipping_cost', 12, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);

            // Promo Code
            $table->string('promo_code')->nullable();

            // Status
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();

            $table->timestamps();
            $table->index('order_number');
            $table->index('status');
            $table->index('customer_email');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
```

### 3. Order Items Migration

**database/migrations/xxxx_xx_xx_create_order_items_table.php**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->foreignId('product_id')->constrained('products')->onDelete('restrict');
            $table->string('product_name');
            $table->decimal('unit_price', 12, 2);
            $table->integer('quantity');
            $table->decimal('total_price', 12, 2); // unit_price * quantity
            $table->string('selected_color')->nullable(); // for color variations
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
```

### 4. Payments Migration

**database/migrations/xxxx_xx_xx_create_payments_table.php**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('payment_method'); // stripe, paypal, credit_card, etc.
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['pending', 'processing', 'completed', 'failed', 'refunded'])->default('pending');

            // Payment Gateway Reference
            $table->string('transaction_id')->nullable(); // Stripe payment intent ID
            $table->string('gateway_response')->nullable(); // JSON response from payment gateway

            // Card Details (encrypted)
            $table->string('card_last_four')->nullable();
            $table->string('card_brand')->nullable(); // visa, mastercard, etc.

            // Metadata
            $table->text('notes')->nullable();
            $table->timestamp('processed_at')->nullable();

            $table->timestamps();
            $table->index('transaction_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
```

### 5. Invoices Migration

**database/migrations/xxxx_xx_xx_create_invoices_table.php**

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('invoice_number')->unique(); // e.g., INV-2024-001

            // Invoice Details
            $table->text('invoice_data')->nullable(); // JSON with line items, totals, etc.

            // Status
            $table->enum('status', ['draft', 'sent', 'viewed', 'paid', 'cancelled'])->default('draft');

            // Dates
            $table->date('invoice_date');
            $table->date('due_date')->nullable();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('viewed_at')->nullable();
            $table->timestamp('paid_at')->nullable();

            // File Path (if storing PDF)
            $table->string('pdf_path')->nullable();

            $table->timestamps();
            $table->index('invoice_number');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
```

## Eloquent Models

### Order Model

**app/Models/Order.php**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    protected $fillable = [
        'order_number',
        'user_id',
        'customer_email',
        'customer_phone',
        'shipping_first_name',
        'shipping_last_name',
        'shipping_address',
        'shipping_city',
        'shipping_state',
        'shipping_postal_code',
        'shipping_country',
        'subtotal',
        'tax_amount',
        'shipping_cost',
        'discount_amount',
        'total_amount',
        'promo_code',
        'status',
        'notes',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payment(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function invoice(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'delivered');
    }
}
```

### OrderItem Model

**app/Models/OrderItem.php**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id',
        'product_id',
        'product_name',
        'unit_price',
        'quantity',
        'total_price',
        'selected_color',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
```

### Payment Model

**app/Models/Payment.php**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'order_id',
        'payment_method',
        'amount',
        'status',
        'transaction_id',
        'gateway_response',
        'card_last_four',
        'card_brand',
        'notes',
        'processed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'gateway_response' => 'json',
        'processed_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
```

### Invoice Model

**app/Models/Invoice.php**

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'order_id',
        'invoice_number',
        'invoice_data',
        'status',
        'invoice_date',
        'due_date',
        'sent_at',
        'viewed_at',
        'paid_at',
        'pdf_path',
    ];

    protected $casts = [
        'invoice_data' => 'json',
        'invoice_date' => 'date',
        'due_date' => 'date',
        'sent_at' => 'datetime',
        'viewed_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
```

## API Routes

**routes/api.php**

```php
<?php

use App\Http\Controllers\OrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\InvoiceController;
use Illuminate\Support\Facades\Route;

Route::middleware('api')->group(function () {
    // Orders
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);

    // Payments
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/orders/{order}/payments', [PaymentController::class, 'orderPayments']);

    // Invoices
    Route::get('/orders/{order}/invoice', [InvoiceController::class, 'generate']);
    Route::get('/invoices/{invoice}', [InvoiceController::class, 'show']);
});
```

## Controllers

### OrderController

**app/Http/Controllers/OrderController.php**

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_email' => 'required|email',
            'customer_phone' => 'required|string',
            'shipping_first_name' => 'required|string',
            'shipping_last_name' => 'required|string',
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string',
            'shipping_state' => 'required|string',
            'shipping_postal_code' => 'required|string',
            'shipping_country' => 'required|string',
            'subtotal' => 'required|numeric',
            'tax_amount' => 'required|numeric',
            'shipping_cost' => 'required|numeric',
            'discount_amount' => 'required|numeric',
            'total_amount' => 'required|numeric',
            'promo_code' => 'nullable|string',
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer',
            'items.*.product_name' => 'required|string',
            'items.*.unit_price' => 'required|numeric',
            'items.*.quantity' => 'required|integer',
            'items.*.total_price' => 'required|numeric',
            'items.*.selected_color' => 'nullable|string',
        ]);

        // Generate unique order number
        $orderNumber = 'ORD-' . date('Y') . '-' . str_pad(Order::count() + 1, 5, '0', STR_PAD_LEFT);

        // Create order
        $order = Order::create([
            'order_number' => $orderNumber,
            'user_id' => auth()->id(),
            'customer_email' => $validated['customer_email'],
            'customer_phone' => $validated['customer_phone'],
            'shipping_first_name' => $validated['shipping_first_name'],
            'shipping_last_name' => $validated['shipping_last_name'],
            'shipping_address' => $validated['shipping_address'],
            'shipping_city' => $validated['shipping_city'],
            'shipping_state' => $validated['shipping_state'],
            'shipping_postal_code' => $validated['shipping_postal_code'],
            'shipping_country' => $validated['shipping_country'] ?? 'US',
            'subtotal' => $validated['subtotal'],
            'tax_amount' => $validated['tax_amount'],
            'shipping_cost' => $validated['shipping_cost'],
            'discount_amount' => $validated['discount_amount'],
            'total_amount' => $validated['total_amount'],
            'promo_code' => $validated['promo_code'],
            'status' => 'pending',
        ]);

        // Create order items
        foreach ($validated['items'] as $item) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $item['product_id'],
                'product_name' => $item['product_name'],
                'unit_price' => $item['unit_price'],
                'quantity' => $item['quantity'],
                'total_price' => $item['total_price'],
                'selected_color' => $item['selected_color'] ?? null,
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Order created successfully',
            'order' => $order->load('items'),
        ], 201);
    }

    public function show(Order $order)
    {
        return response()->json($order->load('items', 'payment', 'invoice'));
    }

    public function index(Request $request)
    {
        $query = Order::query();

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('email')) {
            $query->where('customer_email', $request->email);
        }

        $orders = $query->with('items')->paginate(20);
        return response()->json($orders);
    }

    public function update(Request $request, Order $order)
    {
        $order->update($request->validate([
            'status' => 'nullable|in:pending,confirmed,processing,shipped,delivered,cancelled',
            'notes' => 'nullable|string',
        ]));

        return response()->json($order);
    }
}
```

### PaymentController

**app/Http/Controllers/PaymentController.php**

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'payment_method' => 'required|string',
            'amount' => 'required|numeric',
            'transaction_id' => 'nullable|string',
            'card_last_four' => 'nullable|string',
            'card_brand' => 'nullable|string',
        ]);

        $order = Order::findOrFail($validated['order_id']);

        $payment = Payment::create([
            'order_id' => $order->id,
            'payment_method' => $validated['payment_method'],
            'amount' => $validated['amount'],
            'transaction_id' => $validated['transaction_id'],
            'card_last_four' => $validated['card_last_four'],
            'card_brand' => $validated['card_brand'],
            'status' => 'completed',
            'processed_at' => now(),
        ]);

        // Update order status
        $order->update(['status' => 'confirmed']);

        return response()->json([
            'success' => true,
            'message' => 'Payment recorded successfully',
            'payment' => $payment,
        ], 201);
    }

    public function orderPayments(Order $order)
    {
        return response()->json($order->payment);
    }
}
```

### InvoiceController

**app/Http/Controllers/InvoiceController.php**

```php
<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Invoice;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function generate(Order $order)
    {
        // Check if invoice already exists
        $invoice = Invoice::where('order_id', $order->id)->first();

        if (!$invoice) {
            $invoiceNumber = 'INV-' . date('Y') . '-' . str_pad(Invoice::count() + 1, 5, '0', STR_PAD_LEFT);

            $invoice = Invoice::create([
                'order_id' => $order->id,
                'invoice_number' => $invoiceNumber,
                'invoice_data' => $order->toArray(),
                'status' => 'sent',
                'invoice_date' => now(),
                'due_date' => now()->addDays(30),
                'sent_at' => now(),
            ]);
        }

        return response()->json($invoice);
    }

    public function show(Invoice $invoice)
    {
        return response()->json($invoice);
    }
}
```

## Frontend Integration (React)

Update your checkout page to send order data to Laravel backend:

**client/pages/Checkout.tsx** (Update the payment success handler)

```typescript
const handlePaymentSuccess = async (paymentIntentId: string) => {
  try {
    // Prepare order data
    const orderData = {
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_first_name: formData.firstName,
      shipping_last_name: formData.lastName,
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_state: formData.state,
      shipping_postal_code: formData.postalCode,
      shipping_country: "US",
      subtotal: subtotal,
      tax_amount: taxAmount,
      shipping_cost: shippingCost,
      discount_amount: discount,
      total_amount: finalTotal,
      promo_code: appliedPromo || null,
      items: cart.map((item) => ({
        product_id: item.product_id,
        product_name: item.product_name,
        unit_price: item.product_price,
        quantity: item.quantity,
        total_price: item.product_price * item.quantity,
        selected_color: item.selectedColor || null,
      })),
    };

    // Send order to backend
    const response = await fetch(
      "https://your-laravel-backend.com/api/orders",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // if using auth
        },
        body: JSON.stringify(orderData),
      },
    );

    if (!response.ok) throw new Error("Failed to create order");
    const orderResult = await response.json();

    // Record payment
    const paymentData = {
      order_id: orderResult.order.id,
      payment_method: "stripe",
      amount: finalTotal,
      transaction_id: paymentIntentId,
      card_last_four: "4242", // extract from card
      card_brand: "visa",
    };

    const paymentResponse = await fetch(
      "https://your-laravel-backend.com/api/payments",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify(paymentData),
      },
    );

    if (!paymentResponse.ok) throw new Error("Failed to record payment");

    // Generate invoice
    await fetch(
      `https://your-laravel-backend.com/api/orders/${orderResult.order.id}/invoice`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    );

    toast.success("Order placed successfully!");
    clearCart();
    setOrderPlaced(true);
  } catch (error) {
    console.error("Error processing order:", error);
    toast.error("Failed to process order. Please try again.");
  }
};
```

## Running Migrations

```bash
php artisan migrate
```

## Admin Dashboard

In your Laravel admin panel, you can display:

1. **Orders List**
   - Order number, date, customer, total, status
   - Filter by status, date range, customer

2. **Payments List**
   - Payment ID, order, amount, method, status
   - Transaction tracking

3. **Invoices List**
   - Invoice number, order, status, dates
   - Download PDF or resend

4. **Reports**
   - Revenue by period
   - Popular products
   - Customer insights

## Next Steps

1. Create the migrations and run them
2. Create the models and controllers
3. Update your React checkout to call these APIs
4. Build your Laravel admin dashboard to view orders
5. Add email notifications for orders
6. Generate PDF invoices

Would you like me to help implement any specific part of this?
