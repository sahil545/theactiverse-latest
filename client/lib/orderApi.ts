// Order API endpoints for Laravel backend
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "https://your-laravel-backend.com/api";

export interface OrderData {
  customer_email: string;
  customer_phone: string;
  shipping_first_name: string;
  shipping_last_name: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country?: string;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  promo_code?: string | null;
  items: OrderItemData[];
}

export interface OrderItemData {
  product_id: number;
  product_name: string;
  unit_price: number;
  quantity: number;
  total_price: number;
  selected_color?: string | null;
}

export interface PaymentData {
  order_id: number;
  payment_method: string;
  amount: number;
  transaction_id?: string;
  card_last_four?: string;
  card_brand?: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  order: {
    id: number;
    order_number: string;
    total_amount: number;
    status: string;
    items: OrderItemData[];
  };
}

// Get auth token (adjust based on your auth implementation)
function getAuthToken(): string | null {
  return (
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken")
  );
}

/**
 * Create an order in the Laravel backend
 */
export async function createOrder(
  orderData: OrderData,
): Promise<OrderResponse> {
  const response = await fetch(`${BACKEND_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create order");
  }

  return response.json();
}

/**
 * Record a payment in the Laravel backend
 */
export async function recordPayment(paymentData: PaymentData): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/payments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to record payment");
  }

  return response.json();
}

/**
 * Generate an invoice for an order
 */
export async function generateInvoice(orderId: number): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/orders/${orderId}/invoice`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to generate invoice");
  }

  return response.json();
}

/**
 * Get order details
 */
export async function getOrder(orderId: number): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/orders/${orderId}`, {
    headers: {
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch order");
  }

  return response.json();
}

/**
 * Get all orders for current user
 */
export async function getUserOrders(): Promise<any[]> {
  const response = await fetch(`${BACKEND_URL}/orders`, {
    headers: {
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const data = await response.json();
  return data.data || data; // Handle pagination
}

/**
 * Get payment details for an order
 */
export async function getOrderPayments(orderId: number): Promise<any[]> {
  const response = await fetch(`${BACKEND_URL}/orders/${orderId}/payments`, {
    headers: {
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch payments");
  }

  return response.json();
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
  orderId: number,
  status: string,
): Promise<any> {
  const response = await fetch(`${BACKEND_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(getAuthToken() && { Authorization: `Bearer ${getAuthToken()}` }),
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error("Failed to update order");
  }

  return response.json();
}
