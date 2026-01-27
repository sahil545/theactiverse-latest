// Example of how to integrate Checkout.tsx with Laravel backend

import { useEffect } from "react";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import {
  createOrder,
  recordPayment,
  generateInvoice,
  OrderData,
} from "@/lib/orderApi";

// In your Checkout component, update the payment success handler:

export default function CheckoutExample() {
  const { cart, clearCart } = useCart();

  // Example form data structure (from your existing form)
  const formData = {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    phone: "+1234567890",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    postalCode: "10001",
  };

  const subtotal = 100;
  const taxAmount = 5;
  const shippingCost = 5;
  const discount = 10;
  const finalTotal = subtotal + taxAmount + shippingCost - discount;

  /**
   * Handle successful payment from Stripe/payment form
   * This function:
   * 1. Creates an order in Laravel
   * 2. Records the payment
   * 3. Generates an invoice
   * 4. Clears the cart
   */
  const handlePaymentSuccess = async (paymentIntentId: string) => {
    try {
      // Validate form data
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.phone ||
        !formData.address ||
        !formData.city ||
        !formData.state ||
        !formData.postalCode
      ) {
        toast.error("Please fill in all shipping information");
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading("Processing your order...");

      // Step 1: Create order in Laravel backend
      console.log("Creating order...");
      const orderData: OrderData = {
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_first_name: formData.firstName,
        shipping_last_name: formData.lastName,
        shipping_address: formData.address,
        shipping_city: formData.city,
        shipping_state: formData.state,
        shipping_postal_code: formData.postalCode,
        shipping_country: "US",
        subtotal: Number(subtotal.toFixed(2)),
        tax_amount: Number(taxAmount.toFixed(2)),
        shipping_cost: Number(shippingCost.toFixed(2)),
        discount_amount: Number(discount.toFixed(2)),
        total_amount: Number(finalTotal.toFixed(2)),
        promo_code: null, // If you have promo code, set it here
        items: cart.map((item) => ({
          product_id: item.product_id,
          product_name: item.product_name,
          unit_price: item.product_price,
          quantity: item.quantity,
          total_price: Number((item.product_price * item.quantity).toFixed(2)),
          selected_color: item.selectedColor || null,
        })),
      };

      const orderResponse = await createOrder(orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create order");
      }

      toast.dismiss(loadingToast);
      toast.loading("Recording payment...");

      // Step 2: Record payment in Laravel backend
      console.log("Recording payment...");
      const orderId = orderResponse.order.id;

      await recordPayment({
        order_id: orderId,
        payment_method: "stripe", // or whatever payment method you used
        amount: Number(finalTotal.toFixed(2)),
        transaction_id: paymentIntentId,
        card_last_four: "4242", // Extract from your payment form
        card_brand: "visa", // Extract from your payment form
      });

      toast.dismiss(loadingToast);
      toast.loading("Generating invoice...");

      // Step 3: Generate invoice
      console.log("Generating invoice...");
      await generateInvoice(orderId);

      // Step 4: Clear cart and show success
      toast.dismiss(loadingToast);
      clearCart();
      toast.success("Order placed successfully!");

      // Show order confirmation
      console.log("Order created successfully:", {
        orderId: orderId,
        orderNumber: orderResponse.order.order_number,
        totalAmount: orderResponse.order.total_amount,
      });

      // Redirect to order confirmation page (you can create this)
      // window.location.href = `/order-confirmation/${orderId}`;

      // Or show confirmation modal
      // setOrderPlaced(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to process order",
      );
      console.error("Order processing error:", error);
    }
  };

  return (
    <div>
      {/* Your existing checkout JSX */}
      {/* When payment is successful, call: */}
      {/* handlePaymentSuccess(paymentIntentId) */}
    </div>
  );
}

// ============================================================================
// ENVIRONMENT VARIABLES YOU NEED TO SET
// ============================================================================
// In your .env file (React frontend):
// VITE_BACKEND_URL=https://your-laravel-backend.com/api

// In your Laravel .env file:
// APP_URL=https://your-laravel-backend.com
// DB_CONNECTION=mysql
// DB_HOST=localhost
// DB_PORT=3306
// DB_DATABASE=ecommerce
// DB_USERNAME=root
// DB_PASSWORD=password

// ============================================================================
// CORS CONFIGURATION (Laravel)
// ============================================================================
// In your Laravel config/cors.php, allow requests from your frontend:
//
// 'allowed_origins' => [
//     'https://your-frontend-domain.com',
//     'http://localhost:3000', // for development
// ],

// ============================================================================
// AUTHENTICATION (Optional - if you have user authentication)
// ============================================================================
// If you're using Laravel Sanctum or JWT for authentication:
//
// 1. Install Laravel Sanctum:
//    php artisan install:api
//
// 2. Authenticate users from React using:
//    POST /api/login - authenticate and get token
//    POST /api/logout - logout
//    GET /api/user - get authenticated user
//
// 3. Store token in localStorage:
//    localStorage.setItem('authToken', response.token);
//
// 4. The orderApi.ts already includes token in headers automatically

// ============================================================================
// TESTING WITH POSTMAN
// ============================================================================
// You can test the APIs manually before integrating with React:
//
// 1. Create Order:
//    POST /api/orders
//    Headers: Content-Type: application/json
//    Body: {
//      "customer_email": "test@example.com",
//      "customer_phone": "+1234567890",
//      "shipping_first_name": "John",
//      "shipping_last_name": "Doe",
//      "shipping_address": "123 Main St",
//      "shipping_city": "New York",
//      "shipping_state": "NY",
//      "shipping_postal_code": "10001",
//      "shipping_country": "US",
//      "subtotal": 100,
//      "tax_amount": 5,
//      "shipping_cost": 5,
//      "discount_amount": 10,
//      "total_amount": 100,
//      "items": [
//        {
//          "product_id": 1,
//          "product_name": "T-Shirt",
//          "unit_price": 20,
//          "quantity": 2,
//          "total_price": 40,
//          "selected_color": "Red"
//        }
//      ]
//    }
//
// 2. Record Payment:
//    POST /api/payments
//    Headers: Content-Type: application/json
//    Body: {
//      "order_id": 1,
//      "payment_method": "stripe",
//      "amount": 100,
//      "transaction_id": "pi_1234567890",
//      "card_last_four": "4242",
//      "card_brand": "visa"
//    }
//
// 3. Generate Invoice:
//    GET /api/orders/1/invoice
//
// 4. Get Order Details:
//    GET /api/orders/1
//
// 5. Get Order Payments:
//    GET /api/orders/1/payments

// ============================================================================
// DATABASE QUERIES FOR ADMIN DASHBOARD
// ============================================================================
// Get all orders:
//   SELECT * FROM orders ORDER BY created_at DESC
//
// Get today's revenue:
//   SELECT SUM(total_amount) as revenue FROM orders WHERE DATE(created_at) = CURDATE()
//
// Get order with items:
//   SELECT o.*, oi.* FROM orders o
//   LEFT JOIN order_items oi ON o.id = oi.order_id
//   WHERE o.id = ?
//
// Get payment history:
//   SELECT * FROM payments WHERE order_id = ? ORDER BY created_at DESC
//
// Get invoice:
//   SELECT * FROM invoices WHERE order_id = ?
