import React, { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { getProductRatings } from "@/lib/ratingsApi";

interface VendorRatingDisplayProps {
  productId: number;
  vendorName?: string;
}

export default function VendorRatingDisplay({
  productId,
  vendorName,
}: VendorRatingDisplayProps) {
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRatingStats = async () => {
      try {
        const data = await getProductRatings(productId);
        if (data && data.ratings) {
          // Handle both response formats
          let average = 0;
          let total = 0;

          if (data.data && data.data.statistics) {
            average = data.data.statistics.average_rating;
            total = data.data.statistics.total_ratings;
          } else if (data.average_rating !== undefined && data.rating_count !== undefined) {
            average = parseFloat(data.average_rating as string) || 0;
            total = data.rating_count || 0;
          }

          setAverageRating(average);
          setTotalRatings(total);
        }
      } catch (error) {
        console.warn("Error loading vendor rating:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRatingStats();
  }, [productId]);

  if (loading || totalRatings === 0) {
    return null;
  }

  const renderStars = () => {
    return (
      <div className="flex items-center gap-1.5">
        {/* Stars */}
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

        {/* Rating Text */}
        <span className="text-sm font-semibold text-slate-700">
          {averageRating.toFixed(1)}
        </span>

        {/* Review Count */}
        <span className="text-sm text-slate-600">
          ({totalRatings} {totalRatings === 1 ? "review" : "reviews"})
        </span>
      </div>
    );
  };

  return renderStars();
}
