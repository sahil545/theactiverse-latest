const API_BASE_URL = "/api";

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
 * Get all ratings for a product
 */
export async function getProductRatings(
  productId: number,
  page: number = 1
): Promise<RatingsResponse | null> {
  try {
    const response = await fetch(
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
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    // Validate response structure - accepts both old and new formats
    if (data && (data.status || data.success) && data.ratings) {
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
    const response = await fetch(
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

    const response = await fetch(
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

    const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}`, {
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

    return true;
  } catch (error) {
    console.error("Error deleting rating:", error);
    throw error;
  }
}
