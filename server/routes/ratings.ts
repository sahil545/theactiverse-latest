import { RequestHandler } from "express";
import { requestQueue } from "../utils/request-queue";

const LARAVEL_API_URL = "https://ecommerce.standtogetherhelp.com/api";

// Simple in-memory cache with TTL
const ratingsCache = new Map<
  string,
  { data: any; timestamp: number }
>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCacheKey(...args: any[]): string {
  return JSON.stringify(args);
}

function getCachedData(key: string): any | null {
  const cached = ratingsCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  ratingsCache.delete(key);
  return null;
}

function setCachedData(key: string, data: any): void {
  ratingsCache.set(key, { data, timestamp: Date.now() });
}

export interface Rating {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string | null;
  helpful_count: number;
  is_approved: boolean;
  user?: {
    id: number;
    name: string;
    photo: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface RatingStatistics {
  total_ratings: number;
  average_rating: number;
  rating_distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface RatingsResponse {
  success?: boolean;
  status?: boolean;
  product_id?: string;
  average_rating?: string | number;
  rating_count?: number;
  ratings: Rating[];
  data?: {
    ratings: Rating[];
    pagination: {
      current_page: number;
      last_page: number;
      total: number;
      per_page: number;
    };
    statistics: RatingStatistics;
  };
  message?: string;
}

export const handleGetProductRatings: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = req.query.page || 1;

    const cacheKey = getCacheKey("ratings", productId, page);

    // Check cache first
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Use request queue to prevent rate limiting
    try {
      const data: RatingsResponse = await requestQueue.enqueue(
        `ratings-${productId}`,
        async () => {
          const response = await fetch(
            `${LARAVEL_API_URL}/products/${productId}/ratings?page=${page}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Laravel API responded with status ${response.status}`
            );
          }

          return response.json();
        }
      );

      if (data && (data.status || data.success)) {
        // Cache successful response
        setCachedData(cacheKey, data);
        return res.json(data);
      }
    } catch (error) {
      // If API fails, return empty ratings gracefully
      console.warn(
        "Laravel API error, returning empty ratings for product:",
        productId,
        error
      );
    }

    res.json({ status: false, ratings: [] });
  } catch (error) {
    console.error("Error in handleGetProductRatings:", error);
    res.json({
      status: false,
      ratings: [],
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleGetUserRating: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.params;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const response = await fetch(
      `${LARAVEL_API_URL}/products/${productId}/my-rating`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Laravel API responded with status ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching user rating from Laravel API:", error);
    res.status(500).json({
      status: false,
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleCreateOrUpdateRating: RequestHandler = async (req, res) => {
  try {
    const { productId } = req.params;
    const { rating, comment, guest_email, guest_name } = req.body;
    const token = req.headers.authorization?.replace("Bearer ", "");

    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const body: any = {
      rating,
      comment: comment || null,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    } else if (guest_email && guest_name) {
      body.guest_email = guest_email;
      body.guest_name = guest_name;
    } else {
      return res.status(400).json({
        status: false,
        message: "Either authentication token or guest email/name is required",
      });
    }

    const response = await fetch(
      `${LARAVEL_API_URL}/products/${productId}/ratings`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `API error: ${response.status}`
      );
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error creating/updating rating:", error);
    res.status(500).json({
      status: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const handleDeleteRating: RequestHandler = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Authentication required",
      });
    }

    const response = await fetch(`${LARAVEL_API_URL}/ratings/${ratingId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Laravel API responded with status ${response.status}`);
    }

    res.json({ status: true, message: "Rating deleted successfully" });
  } catch (error) {
    console.error("Error deleting rating:", error);
    res.status(500).json({
      status: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
