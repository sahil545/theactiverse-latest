import { RequestHandler } from "express";
import { requestQueue } from "../utils/request-queue";

const LARAVEL_API_URL = "https://ecommerce.standtogetherhelp.com/api";

// Simple in-memory cache with TTL
const productsCache = new Map<
  string,
  { data: any; timestamp: number }
>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCacheKey(...args: any[]): string {
  return JSON.stringify(args);
}

function getCachedData(key: string): any | null {
  const cached = productsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  productsCache.delete(key);
  return null;
}

function setCachedData(key: string, data: any): void {
  productsCache.set(key, { data, timestamp: Date.now() });
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

interface ProductsResponse {
  status: boolean;
  data: Product[];
}

export const handleGetProducts: RequestHandler = async (req, res) => {
  try {
    const cacheKey = getCacheKey("products");

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Use request queue to prevent rate limiting
    try {
      const data: ProductsResponse = await requestQueue.enqueue(
        "products",
        async () => {
          const response = await fetch(`${LARAVEL_API_URL}/products`);

          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }

          return response.json();
        }
      );

      if (data.status && Array.isArray(data.data)) {
        const activeProducts = data.data.filter(
          (product) => product.product_status === "1",
        );
        const responseData = { status: true, data: activeProducts };
        // Cache successful response
        setCachedData(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      // If API fails, return empty data gracefully
      console.warn("Laravel API error, returning empty products:", error);
    }

    res.json({ status: false, data: [] });
  } catch (error) {
    console.error("Error in handleGetProducts:", error);
    res.json({
      status: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
