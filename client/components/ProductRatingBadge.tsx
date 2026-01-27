import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getProductRatings } from "@/lib/ratingsApi";

interface ProductRatingBadgeProps {
  productId: number;
  compact?: boolean;
}

// Cache for rating data to prevent excessive API calls
const ratingCache = new Map<number, { average: number; total: number; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export default function ProductRatingBadge({
  productId,
  compact = false,
}: ProductRatingBadgeProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRatingStats = async () => {
      try {
        // Check cache first
        const cached = ratingCache.get(productId);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setAverageRating(cached.average);
          setTotalRatings(cached.total);
          setLoading(false);
          return;
        }

        const data = await getProductRatings(productId);
        if (data && data.ratings) {
          // Handle both old and new response formats
          let average = 0;
          let total = 0;

          if (data.data && data.data.statistics) {
            // New format with nested data.statistics
            average = data.data.statistics.average_rating;
            total = data.data.statistics.total_ratings;
          } else if (data.average_rating !== undefined && data.rating_count !== undefined) {
            // New format with top-level fields
            average = parseFloat(data.average_rating as string) || 0;
            total = data.rating_count || 0;
          }

          if (total > 0) {
            setAverageRating(average);
            setTotalRatings(total);

            // Cache the result
            ratingCache.set(productId, {
              average,
              total,
              timestamp: Date.now(),
            });
          }
        } else {
          console.warn("No rating statistics available for product:", productId);
        }
      } catch (error) {
        // Silently fail and don't show rating badge if API error
        console.warn("Rating badge unavailable:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRatingStats();
  }, [productId]);

  if (loading || totalRatings === 0) {
    return null;
  }

  // Always show all 5 stars with rating and count
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.round(averageRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-slate-300"
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-slate-900">
        {averageRating.toFixed(1)}
      </span>
      <span className="text-xs text-slate-600">({totalRatings})</span>
    </div>
  );
}
