const API_BASE_URL = "/api";

export interface Vendor {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  photo: string | null;
  role: string;
  username: string;
  status: number;
  phone_number: string | null;
  address: string | null;
  social_id: string | null;
  social_type: string | null;
  created_at: string;
  updated_at: string;
  vendor_id: number;
  shop_name: string;
  shop_description: string | null;
}

export interface Category {
  id?: number;
  category_name?: string;
  category_slug?: string;
  category_image?: string;
  category_description?: string;
}

export interface SubCategory {
  sub_category_id: number;
  sub_category_name: string;
  sub_category_image: string;
  sub_category_slug: string;
  category_id: number;
  created_at: string;
}

export interface Product {
  product_id: number;
  product_name: string;
  product_code: string;
  product_tags: string;
  product_colors: string;
  product_sizes?: string;
  product_short_description: string;
  product_long_description: string | null;
  product_slug: string;
  product_price: number;
  product_thumbnail: string;
  product_status: string;
  sub_category_id: number;
  brand_id: number;
  vendor_id: number;
  product_quantity: number;
  gallery_images?: string[];
}

export async function getVendors(): Promise<Vendor[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/vendors`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status && Array.isArray(data.data)) {
      // Filter to only include vendors with role="vendor"
      return data.data.filter((vendor: Vendor) => vendor.role === "vendor");
    }
    return [];
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return [];
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getSubCategories(): Promise<SubCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/sub-categories`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching sub-categories:", error);
    return [];
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status && Array.isArray(data.data)) {
      return data.data;
    }
    return [];
  } catch (error) {
    console.error("Error fetching products:", error);
    // Return empty array as fallback
    return [];
  }
}

export function getProductImageUrl(imageUrl: string): string {
  // If it's already a full URL, return as-is
  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }
  // Otherwise construct the full URL (fallback for filename-only cases)
  return `https://ecommerce.standtogetherhelp.com/storage/products/${imageUrl}`;
}

export interface SubCategory {
  sub_category_id: number;
  sub_category_name: string;
  sub_category_image: string;
  sub_category_slug: string;
  products: Product[];
}

export interface CategoryWithProducts {
  category_id: number;
  category_name: string;
  category_image: string;
  category_slug: string;
  sub_categories: SubCategory[];
}

export async function getCategoryWithProducts(
  categoryId: number,
): Promise<CategoryWithProducts | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/categories-with-products/${categoryId}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (data.status && data.data) {
      return data.data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching category with products:", error);
    return null;
  }
}
