import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/hooks/use-cart";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Package,
} from "lucide-react";
import { getProductImageUrl } from "@/lib/api";
import ColorSwatch from "@/components/ColorSwatch";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const [appliedPromo, setAppliedPromo] = useState<string>("");
  const [promoCode, setPromoCode] = useState("");

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product_price * item.quantity,
    0,
  );

  const shippingCost = subtotal > 50 ? 0 : 5;
  const taxRate = 0.05;
  const taxAmount = subtotal * taxRate;
  const total = subtotal + shippingCost + taxAmount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo("SAVE10");
      setPromoCode("");
    } else {
      alert("Invalid promo code");
    }
  };

  const getDiscount = () => {
    if (appliedPromo === "SAVE10") {
      return subtotal * 0.1;
    }
    return 0;
  };

  const discount = getDiscount();
  const finalTotal = total - discount;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Looks like you haven't added any items yet. Start exploring!
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="w-full sm:w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                      <img
                        src={getProductImageUrl(item.product_thumbnail)}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://via.placeholder.com/150?text=No+Image";
                        }}
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <Link
                          to={`/product/${item.product_id}`}
                          className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition mb-4"
                        >
                          {item.product_name}
                        </Link>
                        <div className="flex flex-col gap-2">
                          <p className="text-2xl font-bold text-blue-600">
                            ${item.product_price.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <div className="flex flex-col gap-2">
                            {item.selectedColor && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Color:</span>
                                <ColorSwatch
                                  colors={[item.selectedColor]}
                                  selectedColor={item.selectedColor}
                                  onColorSelect={() => {}}
                                  size="sm"
                                />
                                <span className="text-sm text-gray-700">
                                  {item.selectedColor}
                                </span>
                              </div>
                            )}
                            {item.selectedSize && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Size:</span>
                                <span className="text-sm font-semibold text-gray-700 px-2 py-1 bg-slate-100 rounded">
                                  {item.selectedSize}
                                </span>
                              </div>
                            )}
                            {item.selectedGender && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Gender:</span>
                                <span className="text-sm font-semibold text-gray-700 px-2 py-1 bg-slate-100 rounded">
                                  {item.selectedGender}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.product_id,
                                Math.max(1, item.quantity - 1),
                              )
                            }
                            className="p-2 hover:bg-gray-100 transition"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product_id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-gray-100 transition"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Subtotal and Remove */}
                        <div className="text-right">
                          <p className="text-sm text-gray-600 mb-2">Subtotal</p>
                          <p className="text-lg font-bold text-gray-900 mb-4">
                            $
                            {(
                              item.product_price * item.quantity
                            ).toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition"
                          >
                            <Trash2 className="w-4 h-4" />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ${subtotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-semibold">
                    ${taxAmount.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `$${shippingCost}`
                    )}
                  </span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedPromo})</span>
                    <span className="font-semibold">
                      -${discount.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between mb-4">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${finalTotal.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <p className="text-sm text-gray-500">
                    Free shipping on orders over $50
                  </p>
                )}
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Enter code (SAVE10)"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleApplyPromo}
                    className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-semibold"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {appliedPromo} applied (10% off)
                  </p>
                )}
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-blue-700 transition mb-4"
              >
                <Package className="w-5 h-5" />
                Proceed to Checkout
              </Link>

              <Link
                to="/shop"
                className="w-full flex items-center justify-center gap-2 border border-gray-300 text-gray-900 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
