import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { getProductImageUrl } from "@/lib/api";
import StripePaymentForm from "@/components/StripePaymentForm";
import { toast } from "sonner";
 
interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface OrderData {
  orderNumber: string;
  orderDate: string;
  items: any[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  // Pre-fill form with logged-in user details
  useEffect(() => {
    if (user) {
      const names = user.name.split(" ");
      const firstName = names[0] || "";
      const lastName = names.slice(1).join(" ") || "";

      setFormData((prev) => ({
        ...prev,
        firstName,
        lastName,
        email: user.email || "",
      }));
    }
  }, [user]);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );
  const shippingCost = subtotal > 50 ? 0 : 5;
  const taxAmount = subtotal * 0.07;
  const total = subtotal + shippingCost + taxAmount;

  if (cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-2xl text-gray-600 mb-6">
              Your cart is empty. Please add items before checkout.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (orderPlaced && orderData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white">
          {/* Success Banner */}
          <section className="w-full bg-gradient-to-r from-green-50 to-emerald-50 py-12 md:py-16 border-b">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="font-mirza font-bold text-[42px] md:text-[52px] leading-[52px] md:leading-[62px] mb-4">
                Thank You for Your Order!
              </h1>
              <p className="font-jakarta font-medium text-[16px] text-[#7E7E7E] max-w-2xl mx-auto">
                Your order has been received and confirmed. We'll send you shipping details soon.
              </p>
            </div>
          </section>

          {/* Order Confirmation Content */}
          <section className="w-full py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4">
              {/* Order Status Card */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-[#F5F5F5] rounded-[15px] p-8">
                  <h2 className="font-jakarta font-bold text-[20px] mb-6">
                    Order Status
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="font-jakarta font-medium text-[14px] text-[#7E7E7E] mb-1">
                        Order Number
                      </p>
                      <p className="font-jakarta font-bold text-[18px] text-[#032088]">
                        {orderData.orderNumber}
                      </p>
                    </div>
                    <div>
                      <p className="font-jakarta font-medium text-[14px] text-[#7E7E7E] mb-1">
                        Order Date
                      </p>
                      <p className="font-jakarta font-bold text-[18px]">
                        {orderData.orderDate}
                      </p>
                    </div>
                    <div>
                      <p className="font-jakarta font-medium text-[14px] text-[#7E7E7E] mb-1">
                        Order Status
                      </p>
                      <p className="font-jakarta font-bold text-[18px]">
                        <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-[14px]">
                          Pending
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#F5F5F5] rounded-[15px] p-8">
                  <h2 className="font-jakarta font-bold text-[20px] mb-6">
                    Billing Address
                  </h2>
                  <div className="space-y-2 text-[15px] font-jakarta">
                    <p>
                      <span className="font-semibold">
                        {formData.firstName} {formData.lastName}
                      </span>
                    </p>
                    <p>{formData.address}</p>
                    <p>
                      {formData.city}, {formData.state} {formData.postalCode}
                    </p>
                    <p className="pt-2">
                      <span className="font-semibold">Email:</span>{" "}
                      {formData.email}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {formData.phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-[#F5F5F5] rounded-[15px] p-8 mb-12">
                <h2 className="font-jakarta font-bold text-[20px] mb-6">
                  Order Items ({orderData.items.length})
                </h2>
                <div className="space-y-0 border-b">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="py-6 border-t">
                      <div className="flex gap-6">
                        <div className="w-20 h-20 bg-white rounded-[10px] overflow-hidden flex-shrink-0">
                          <img
                            src={item.product_thumbnail}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-jakarta font-bold text-[16px] mb-2">
                            {item.product_name}
                          </h3>
                          <p className="font-jakarta text-[14px] text-[#7E7E7E] mb-3">
                            SKU: {item.product_id}
                          </p>
                          <div className="flex flex-wrap gap-6">
                            <div>
                              <p className="font-jakarta text-[13px] text-[#7E7E7E]">
                                Price
                              </p>
                              <p className="font-jakarta font-bold text-[16px]">
                                ${item.product_price.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })}
                              </p>
                            </div>
                            <div>
                              <p className="font-jakarta text-[13px] text-[#7E7E7E]">
                                Quantity
                              </p>
                              <p className="font-jakarta font-bold text-[16px]">
                                {item.quantity}
                              </p>
                            </div>
                            {item.selectedColor && (
                              <div>
                                <p className="font-jakarta text-[13px] text-[#7E7E7E]">
                                  Color
                                </p>
                                <p className="font-jakarta font-bold text-[16px]">
                                  {item.selectedColor}
                                </p>
                              </div>
                            )}
                            {item.selectedSize && (
                              <div>
                                <p className="font-jakarta text-[13px] text-[#7E7E7E]">
                                  Size
                                </p>
                                <p className="font-jakarta font-bold text-[16px]">
                                  {item.selectedSize}
                                </p>
                              </div>
                            )}

                            <div>
                              <p className="font-jakarta text-[13px] text-[#7E7E7E]">
                                Total
                              </p>
                              <p className="font-jakarta font-bold text-[16px] text-[#032088]">
                                ${(item.product_price * item.quantity).toLocaleString(
                                  "en-US",
                                  {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white border border-[#E0E0E0] rounded-[15px] p-8 mb-12">
                <h2 className="font-jakarta font-bold text-[20px] mb-6">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="font-jakarta font-medium text-[15px] text-[#7E7E7E]">
                      Subtotal
                    </span>
                    <span className="font-jakarta font-bold text-[16px]">
                      ${orderData.subtotal.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="font-jakarta font-medium text-[15px] text-[#7E7E7E]">
                      Shipping
                    </span>
                    <span className="font-jakarta font-bold text-[16px]">
                      {orderData.shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `$${orderData.shipping.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b">
                    <span className="font-jakarta font-medium text-[15px] text-[#7E7E7E]">
                      Tax
                    </span>
                    <span className="font-jakarta font-bold text-[16px]">
                      ${orderData.tax.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-4 bg-[#032088]/5 px-4 rounded-[10px]">
                    <span className="font-jakarta font-bold text-[18px]">
                      Total
                    </span>
                    <span className="font-jakarta font-bold text-[24px] text-[#032088]">
                      ${orderData.total.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Notes */}
              <div className="bg-[#EBD96B]/10 border border-[#EBD96B] rounded-[15px] p-6 mb-12">
                <h3 className="font-jakarta font-bold text-[16px] mb-3">
                  📧 Next Steps
                </h3>
                <ul className="space-y-2 font-jakarta text-[14px] text-[#7E7E7E]">
                  <li>✓ A confirmation email has been sent to {formData.email}</li>
                  <li>✓ Your order will be processed and shipped within 2-3 business days</li>
                  <li>✓ You'll receive tracking information via email once shipped</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-[#032088] text-white font-jakarta font-bold text-[16px] rounded-[10px] hover:opacity-90 transition text-center"
                >
                  Continue Shopping
                </Link>
                <Link
                  to="/"
                  className="px-8 py-4 border-2 border-[#032088] text-[#032088] font-jakarta font-bold text-[16px] rounded-[10px] hover:bg-[#032088]/5 transition text-center"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
      alert("Please fill in all address fields");
      return;
    }

    // Payment will be handled by the Stripe payment form
    // Just validate shipping address is complete
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cart
        </Link>

        <h1 className="text-4xl font-bold text-gray-900 mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="space-y-8">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>

                <input
                  type="text"
                  name="address"
                  placeholder="Street Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 mb-4"
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State/Province"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Payment Information
                </h2>

                <StripePaymentForm
                  amount={total}
                  onSubmit={(e) => {
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
                      toast.error(
                        "Please fill in all shipping information first",
                      );
                      return false;
                    }
                    return true;
                  }}
                  onPaymentSuccess={async (paymentIntentId) => {
                    console.log(
                      "=== CHECKOUT: Payment success callback triggered ===",
                    );
                    console.log("Payment Intent ID:", paymentIntentId);

                    try {
                      console.log("Checkout: Starting order processing");

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
                        discount_amount: 0,
                        total_amount: total,
                        promo_code: null,
                        items: cart.map((item) => ({
                          product_id: item.product_id,
                          product_name: item.product_name,
                          unit_price: item.product_price,
                          quantity: item.quantity,
                          total_price: item.product_price * item.quantity,
                          selected_color: item.selectedColor || null,
                          selected_size: item.selectedSize || null,
                          selected_gender: item.selectedGender || null,
                        })),
                      };

                      console.log("Sending order data:", orderData);

                      // Send order to backend
                      const response = await fetch(
                        "https://admin.theactiverse.com/api/orders",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(orderData),
                        },
                      );

                      console.log(
                        "Order API response status:",
                        response.status,
                      );

                      let orderResult;
                      const responseText = await response.text();
                      console.log("Order API response:", responseText);

                      if (!response.ok) {
                        // Try to extract error message from HTML or JSON
                        let errorMessage = `Failed to create order (${response.status})`;
                        
                        try {
                          // Try parsing as JSON first
                          orderResult = JSON.parse(responseText);
                          errorMessage = orderResult.message || orderResult.error || errorMessage;
                        } catch (e) {
                          // If not JSON, try extracting from HTML
                          if (responseText.includes("<!DOCTYPE")) {
                            // Extract error message from Laravel HTML error page
                            const messageMatch = responseText.match(/<h1[^>]*>([^<]+)<\/h1>/);
                            const detailMatch = responseText.match(/Exception<\/a>:\s*([^<]+)</);
                            
                            if (detailMatch && detailMatch[1]) {
                              errorMessage = detailMatch[1].trim();
                            } else if (messageMatch && messageMatch[1]) {
                              errorMessage = messageMatch[1].trim();
                            }
                          }
                        }
                        
                        throw new Error(errorMessage);
                      }

                      // Only try to parse as JSON if response is OK
                      try {
                        if (!responseText) {
                          throw new Error("Empty response from order API");
                        }
                        orderResult = JSON.parse(responseText);
                      } catch (parseError) {
                        throw new Error(
                          `Failed to parse order response: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
                        );
                      }

                      console.log("Order created:", orderResult);

                      // Record payment
                      const paymentData = {
                        order_id: orderResult.order.id,
                        payment_method: "stripe",
                        amount: total,
                        transaction_id: paymentIntentId,
                        card_last_four: "****",
                        card_brand: "card",
                      };

                      console.log("Sending payment data:", paymentData);

                      const paymentResponse = await fetch(
                        "https://admin.theactiverse.com/api/payments",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(paymentData),
                        },
                      );

                      console.log(
                        "Payment API response status:",
                        paymentResponse.status,
                      );

                      try {
                        const paymentText = await paymentResponse.text();
                        console.log("Payment API response:", paymentText);

                        if (!paymentResponse.ok) {
                          console.warn(
                            "Payment recording failed but continuing:",
                            paymentText,
                          );
                        } else {
                          try {
                            const paymentResult = JSON.parse(paymentText);
                            console.log("Payment recorded:", paymentResult);
                          } catch (parseError) {
                            console.warn(
                              "Failed to parse payment response:",
                              parseError,
                            );
                          }
                        }
                      } catch (paymentReadError) {
                        console.warn(
                          "Failed to read payment response body:",
                          paymentReadError,
                        );
                      }

                      // Generate invoice
                      console.log(
                        "Generating invoice for order:",
                        orderResult.order.id,
                      );
                      try {
                        const invoiceResponse = await fetch(
                          `https://admin.theactiverse.com/api/orders/${orderResult.order.id}/invoice`,
                          {
                            method: "GET",
                            headers: {
                              "Content-Type": "application/json",
                            },
                          },
                        );

                        console.log(
                          "Invoice API response status:",
                          invoiceResponse.status,
                        );

                        if (invoiceResponse.ok) {
                          try {
                            const invoiceText = await invoiceResponse.text();
                            console.log("Invoice generated successfully");
                          } catch (invoiceReadError) {
                            console.warn(
                              "Failed to read invoice response:",
                              invoiceReadError,
                            );
                          }
                        } else {
                          console.warn(
                            "Invoice generation failed but continuing with order",
                          );
                          // Consume the response body to avoid issues
                          await invoiceResponse.text().catch(() => {});
                        }
                      } catch (invoiceError) {
                        console.warn(
                          "Invoice generation error but continuing:",
                          invoiceError,
                        );
                      }

                      // Store order data for confirmation page
                      const orderNumber = `ORD-${Date.now()}`;
                      setOrderData({
                        orderNumber,
                        orderDate: new Date().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }),
                        items: cart,
                        subtotal,
                        tax: taxAmount,
                        shipping: shippingCost,
                        total,
                      });

                      clearCart();
                      toast.success("Order placed successfully!");
                      setOrderPlaced(true);
                    } catch (error) {
                      console.error(
                        "=== CHECKOUT: Error in payment success handler ===",
                      );
                      console.error("Error object:", error);
                      console.error(
                        "Error stack:",
                        error instanceof Error ? error.stack : "No stack trace",
                      );

                      const errorMessage =
                        error instanceof Error
                          ? error.message
                          : "Failed to process order. Please try again.";

                      console.error("Display message:", errorMessage);
                      toast.error(errorMessage);
                    }
                  }}
                  onPaymentError={(error) => {
                    toast.error("Payment failed: " + error);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              {/* Items List */}
              <div className="mb-6 pb-6 border-b border-gray-200 max-h-80 overflow-y-auto">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex gap-3 pb-4 border-b border-gray-100 last:border-b-0"
                    >
                      <img
                        src={getProductImageUrl(item.product_thumbnail)}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/64?text=No+Image";
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {item.product_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </p>
                        <p className="text-sm font-semibold text-blue-600">
                          $
                          {(item.product_price * item.quantity).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (7%)</span>
                  <span>${taxAmount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingCost}`
                    )}
                  </span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ${total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
