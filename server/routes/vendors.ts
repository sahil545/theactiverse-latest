import { RequestHandler } from "express";
import { requestQueue } from "../utils/request-queue";
import { fetchWithTimeout } from "../utils/fetch-with-timeout";

const LARAVEL_API_URL = "https://ecommerce.standtogetherhelp.com/api";

// Simple in-memory cache with TTL
const vendorsCache = new Map<
  string,
  { data: any; timestamp: number }
>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCacheKey(...args: any[]): string {
  return JSON.stringify(args);
}

function getCachedData(key: string): any | null {
  const cached = vendorsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  vendorsCache.delete(key);
  return null;
}

function setCachedData(key: string, data: any): void {
  vendorsCache.set(key, { data, timestamp: Date.now() });
}

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

interface VendorsResponse {
  status: boolean;
  data: Vendor[];
}

export const handleGetVendors: RequestHandler = async (req, res) => {
  try {
    const cacheKey = getCacheKey("vendors");

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Use request queue to prevent rate limiting
    try {
      const data: VendorsResponse = await requestQueue.enqueue(
        "vendors",
        async () => {
          const response = await fetchWithTimeout(`${LARAVEL_API_URL}/users`, { timeout: 10000 });

          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }

          return response.json();
        }
      );

      if (data.status && Array.isArray(data.data)) {
        const vendors = data.data.filter(
          (user: Vendor) => user.role === "vendor" && user.status === 1,
        );
        const responseData = { status: true, data: vendors };
        // Cache successful response
        setCachedData(cacheKey, responseData);
        return res.json(responseData);
      }
    } catch (error) {
      // If API fails, return empty data gracefully
      console.warn("Laravel API error, returning empty vendors:", error);
    }

    res.json({ status: false, data: [] });
  } catch (error) {
    console.error("Error in handleGetVendors:", error);
    res.json({
      status: false,
      data: [],
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
