const API_BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : "/api";

// Simple cache for ratings requests to avoid duplicate calls
const ratingsCache = new Map<string, { data: RatingsResponse | null; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Exponential backoff retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

interface RateLimitError extends Error {
  statusCode: number;
  retryAfter?: number;
}

function isRateLimitError(error: unknown): error is RateLimitError {
  return (
    error instanceof Error &&
    'statusCode' in error &&
    (error.statusCode === 429 || error.statusCode === 503)
  );
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

/**
 * Helper function to make fetch request with exponential backoff retry
 */
async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<Response> {
  try {
    const response = await fetch(url, options);

    // If rate limited, implement exponential backoff
    if (response.status === 429 || response.status === 503) {
      if (retryCount < MAX_RETRIES) {
        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
        const retryAfter = response.headers.get('Retry-After');

        // Use Retry-After header if available, otherwise use exponential backoff
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : delay;

        console.warn(
          `Rate limited (status ${response.status}). Retrying after ${waitTime}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`
        );

        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchWithRetry(url, options, retryCount + 1);
      } else {
        const error: RateLimitError = new Error(
          `API rate limited - max retries exceeded (status ${response.status})`
        ) as RateLimitError;
        error.statusCode = response.status;
        throw error;
      }
    }

    return response;
  } catch (error) {
    // If it's a rate limit error and we haven't exhausted retries, retry
    if (isRateLimitError(error) && retryCount < MAX_RETRIES) {
      const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount);
      const waitTime = error.retryAfter ? error.retryAfter * 1000 : delay;

      console.warn(
        `Rate limit error. Retrying after ${waitTime}ms (attempt ${retryCount + 1}/${MAX_RETRIES})`
      );

      await new Promise(resolve => setTimeout(resolve, waitTime));
      return fetchWithRetry(url, options, retryCount + 1);
    }

    throw error;
  }
}

/**
 * Get all ratings for a product
 */
export async function getProductRatings(
  productId: number,
  page: number = 1
): Promise<RatingsResponse | null> {
  // Check cache first
  const cacheKey = `product-ratings-${productId}-page-${page}`;
  const cached = ratingsCache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log("Returning cached ratings for product", productId);
    return cached.data;
  }

  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/products/${productId}/ratings?page=${page}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      // Handle 404 gracefully - product may not exist or have ratings endpoint
      if (response.status === 404) {
        console.log(`Ratings not found for product ${productId}`);
        return null;
      }
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure - accepts both old and new formats
    if (data && (data.status || data.success) && data.ratings) {
      // Cache the successful response
      ratingsCache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } else {
      console.warn("Invalid ratings API response structure:", data);
      return null;
    }
  } catch (error) {
    console.error("Error fetching product ratings:", error);
    return null;
  }
}

/**
 * Get user's rating for a product
 */
export async function getUserRating(
  productId: number,
  token: string
): Promise<Rating | null> {
  try {
    const response = await fetchWithRetry(
      `${API_BASE_URL}/products/${productId}/my-rating`,
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
      if (response.status === 404) {
        return null;
      }
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return null;
  }
}

/**
 * Create or update a rating for a product (supports both authenticated and guest users)
 */
export async function createOrUpdateRating(
  productId: number,
  rating: number,
  comment: string | null,
  token?: string,
  guestEmail?: string,
  guestName?: string
): Promise<Rating | null> {
  try {
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const body: any = {
      rating,
      comment: comment || null,
    };

    // If authenticated user
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    // If guest user
    else if (guestEmail && guestName) {
      body.guest_email = guestEmail;
      body.guest_name = guestName;
    } else {
      throw new Error("Either authentication token or guest email/name is required");
    }

    const response = await fetchWithRetry(
      `${API_BASE_URL}/products/${productId}/ratings`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    // Clear cache for this product when rating is created/updated
    ratingsCache.delete(`product-ratings-${productId}-page-1`);
    return data.data;
  } catch (error) {
    console.error("Error creating/updating rating:", error);
    throw error;
  }
}

/**
 * Delete a rating
 */
export async function deleteRating(
  ratingId: number,
  token: string
): Promise<boolean> {
  try {
    if (!token) {
      throw new Error("Authentication token is required");
    }

    const response = await fetchWithRetry(`${API_BASE_URL}/ratings/${ratingId}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    // Clear all ratings cache when a rating is deleted
    ratingsCache.clear();
    return true;
  } catch (error) {
    console.error("Error deleting rating:", error);
    throw error;
  }
}
