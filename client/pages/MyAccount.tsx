import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { User, Package, LogOut, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Order {
  id: number;
  order_number: string;
  customer_email: string;
  customer_phone: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  subtotal: string;
  tax_amount: string;
  shipping_cost: string;
  discount_amount: string;
  total_amount: string;
  promo_code: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface CustomerData {
  customer: {
    id: number;
    name: string;
    email: string;
  };
  orders: Order[];
}

const ORDERS_PER_PAGE = 10;

export default function MyAccount() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user?.email) {
      navigate("/");
      toast.error("Please login to view your account");
    }
  }, [isAuthenticated, user, navigate]);

  // Fetch customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!user?.email) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://admin.theactiverse.com/api/customer-orders?email=${encodeURIComponent(
            user.email
          )}`
        );

        if (!response.ok) {
          throw new Error("Failed to load account details");
        }

        const data: CustomerData = await response.json();
        setCustomerData(data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load account details";
        setError(errorMessage);
        console.error("Error fetching customer data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [user?.email]);

  const handleLogout = () => {
    logout();
    navigate("/");
    toast.success("Logged out successfully");
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-40 bg-slate-200 rounded-lg"></div>
              <div className="space-y-4">
                <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                <div className="h-64 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!customerData) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900 mb-2">Unable to Load Account</h3>
                <p className="text-red-800">{error || "Failed to load your account details"}</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Pagination
  const totalPages = Math.ceil(customerData.orders.length / ORDERS_PER_PAGE);
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const paginatedOrders = customerData.orders.slice(startIndex, endIndex);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: string) => {
    return `$${parseFloat(price).toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-16 bg-gradient-to-r from-[#032088] to-[#0D47A1]">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-bold text-3xl md:text-4xl text-white mb-2">
                  My Account
                </h1>
                <p className="text-blue-100">Manage your profile and view your orders</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-2 bg-white text-[#032088] font-semibold rounded-lg hover:bg-blue-50 transition"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            {/* User Profile Card */}
            <div className="bg-white rounded-lg shadow-md border border-slate-200 p-8 mb-12">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#032088] to-[#0D47A1] rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                      {customerData.customer.name}
                    </h2>
                    <p className="text-slate-600 flex items-center gap-2">
                      <span className="text-sm">Email:</span>
                      <span className="font-semibold">{customerData.customer.email}</span>
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-[#032088]">
                    {customerData.orders.length}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Member Since</p>
                  <p className="text-lg font-semibold text-slate-900">Active</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Account Status</p>
                  <p className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
                    Active
                  </p>
                </div>
              </div>
            </div>

            {/* Orders Section */}
            <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-200">
                <div className="flex items-center gap-3 mb-2">
                  <Package className="w-6 h-6 text-[#032088]" />
                  <h3 className="text-2xl font-bold text-slate-900">Your Orders</h3>
                </div>
                <p className="text-slate-600">
                  {customerData.orders.length === 0
                    ? "You haven't placed any orders yet"
                    : `You have ${customerData.orders.length} order${
                        customerData.orders.length !== 1 ? "s" : ""
                      }`}
                </p>
              </div>

              {customerData.orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-slate-900 mb-2">
                    No Orders Yet
                  </h4>
                  <p className="text-slate-600 mb-6">
                    Start shopping to place your first order
                  </p>
                  <a
                    href="/shop"
                    className="inline-block px-6 py-3 bg-[#032088] text-white font-semibold rounded-lg hover:opacity-90 transition"
                  >
                    Continue Shopping
                  </a>
                </div>
              ) : (
                <>
                  {/* Orders Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                            Order ID
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                            Date
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                            Items
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                            Total
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedOrders.map((order, index) => (
                          <tr
                            key={order.id}
                            className={`border-b border-slate-200 hover:bg-slate-50 transition ${
                              index % 2 === 0 ? "bg-white" : "bg-slate-50"
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {order.order_number}
                                </p>
                                <p className="text-xs text-slate-500">ID: {order.id}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                              {formatDate(order.created_at)}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                              <div>
                                <p className="font-medium">
                                  {order.shipping_first_name} {order.shipping_last_name}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {order.shipping_city}, {order.shipping_state}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div>
                                <p className="font-semibold text-slate-900">
                                  {formatPrice(order.total_amount)}
                                </p>
                                <p className="text-xs text-slate-500">
                                  Subtotal: {formatPrice(order.subtotal)}
                                </p>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  order.status
                                )}`}
                              >
                                {order.status.charAt(0).toUpperCase() +
                                  order.status.slice(1)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-t border-slate-200">
                      <p className="text-sm text-slate-600">
                        Showing {startIndex + 1} to {Math.min(endIndex, customerData.orders.length)} of{" "}
                        {customerData.orders.length} orders
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous
                        </button>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                            (page) => (
                              <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-2 rounded-lg font-medium transition ${
                                  currentPage === page
                                    ? "bg-[#032088] text-white"
                                    : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {page}
                              </button>
                            )
                          )}
                        </div>
                        <button
                          onClick={() =>
                            setCurrentPage(Math.min(totalPages, currentPage + 1))
                          }
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                          Next
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
