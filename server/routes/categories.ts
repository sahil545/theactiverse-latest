import { RequestHandler } from "express";
import { requestQueue } from "../utils/request-queue";
import { fetchWithTimeout } from "../utils/fetch-with-timeout";

const LARAVEL_API_URL = "https://admin.theactiverse.com/api";

// Simple in-memory cache with TTL
const categoriesCache = new Map<
  string,
  { data: any; timestamp: number }
>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCacheKey(...args: any[]): string {
  return JSON.stringify(args);
}

function getCachedData(key: string): any | null {
  const cached = categoriesCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  categoriesCache.delete(key);
  return null;
}

function setCachedData(key: string, data: any): void {
  categoriesCache.set(key, { data, timestamp: Date.now() });
}

export interface Category {
  id: number;
  category_name: string;
  category_slug: string;
  category_image?: string;
  category_description?: string;
}

interface CategoriesResponse {
  status: boolean;
  data: Category[];
}

export const handleGetCategories: RequestHandler = async (req, res) => {
  try {
    const cacheKey = getCacheKey("categories");

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Use request queue to prevent rate limiting
    try {
      const data: CategoriesResponse = await requestQueue.enqueue(
        "categories",
        async () => {
          const response = await fetchWithTimeout(`${LARAVEL_API_URL}/categories`, { timeout: 10000 });

          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }

          return response.json();
        }
      );

      if (data.status && Array.isArray(data.data)) {
        const responseData = { status: true, data: data.data };
        // Cache successful response
        setCachedData(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      // If API fails, return empty data gracefully
      console.warn("Laravel API error, returning empty categories:", error);
    }

    res.json({ status: false, data: [] });
  } catch (error) {
    console.error("Error in handleGetCategories:", error);
    res.json({
      status: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetSubCategories: RequestHandler = async (req, res) => {
  try {
    const cacheKey = getCacheKey("sub-categories");

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Use request queue to prevent rate limiting
    try {
      const data: SubCategoriesResponse = await requestQueue.enqueue(
        "sub-categories",
        async () => {
          const response = await fetchWithTimeout(`${LARAVEL_API_URL}/sub-categories`, { timeout: 10000 });

          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }

          return response.json();
        }
      );

      if (data.status && Array.isArray(data.data)) {
        const responseData = { status: true, data: data.data };
        // Cache successful response
        setCachedData(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      // If API fails, return empty data gracefully
      console.warn("Laravel API error, returning empty sub-categories:", error);
    }

    res.json({ status: false, data: [] });
  } catch (error) {
    console.error("Error in handleGetSubCategories:", error);
    res.json({
      status: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export interface SubCategory {
  sub_category_id: number;
  sub_category_name: string;
  sub_category_image: string;
  sub_category_slug: string;
  category_id: number;
  created_at: string;
  products?: any[];
}

interface SubCategoriesResponse {
  status: boolean;
  data: SubCategory[];
}

export interface CategoryWithProducts {
  category_id: number;
  category_name: string;
  category_image: string;
  category_slug: string;
  sub_categories: SubCategory[];
}

interface CategoryWithProductsResponse {
  status: boolean;
  data: CategoryWithProducts;
}

export const handleGetCategoryWithProducts: RequestHandler = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const cacheKey = getCacheKey("category-with-products", categoryId);

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Use request queue to prevent rate limiting
    try {
      const data: CategoryWithProductsResponse = await requestQueue.enqueue(
        `category-with-products-${categoryId}`,
        async () => {
          const response = await fetchWithTimeout(
            `${LARAVEL_API_URL}/categories-with-products/${categoryId}`,
            { timeout: 10000 }
          );

          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }

          return response.json();
        }
      );

      if (data.status && data.data) {
        const responseData = { status: true, data: data.data };
        // Cache successful response
        setCachedData(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      // If API fails, return empty data gracefully
      console.warn(
        "Laravel API error, returning empty category with products:",
        error
      );
    }

    res.json({ status: false, data: null });
  } catch (error) {
    console.error("Error in handleGetCategoryWithProducts:", error);
    res.json({
      status: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
