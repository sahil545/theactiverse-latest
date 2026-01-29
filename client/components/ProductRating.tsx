import React, { useState, useEffect } from "react";
import { Star, Trash2, Edit2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getProductRatings,
  getUserRating,
  createOrUpdateRating,
  deleteRating,
  Rating,
  RatingStatistics,
} from "@/lib/ratingsApi";
import { toast } from "sonner";

interface ProductRatingProps {
  productId: number;
}

export default function ProductRating({ productId }: ProductRatingProps) {
  const { user, isAuthenticated, getAuthToken } = useAuth();
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [statistics, setStatistics] = useState<RatingStatistics | null>(null);
  const [userRating, setUserRating] = useState<Rating | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  // Form states
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load ratings on mount or when product changes
  useEffect(() => {
    loadRatings();
  }, [productId]);

  // Load user's rating if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserRating();
    }
  }, [isAuthenticated, user, productId]);

  const loadRatings = async () => {
    setLoading(true);
    setError(null);
    setIsRetrying(false);
    try {
      const data = await getProductRatings(productId, currentPage);
      if (data && data.ratings) {
        setRatings(data.ratings);
        setError(null);

        // Handle both old and new response formats
        if (data.data && data.data.statistics) {
          // New format with nested data.statistics
          setStatistics(data.data.statistics);
        } else if (data.average_rating !== undefined && data.rating_count !== undefined) {
          // New format with top-level average_rating and rating_count
          const avgRating = parseFloat(data.average_rating as string) || 0;

          // Calculate rating distribution from ratings array
          const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
          data.ratings.forEach((rating) => {
            if (rating.rating >= 1 && rating.rating <= 5) {
              distribution[rating.rating as keyof typeof distribution]++;
            }
          });

          setStatistics({
            total_ratings: data.rating_count || 0,
            average_rating: avgRating,
            rating_distribution: distribution,
          });
        } else {
          setStatistics(null);
        }
      } else {
        console.warn("No ratings data available or API not responding correctly");
        setRatings([]);
        setStatistics(null);
        setError("Unable to load ratings at this time. Please try again later.");
      }
    } catch (error) {
      console.error("Error loading ratings:", error);
      setRatings([]);
      setStatistics(null);
      const errorMessage = error instanceof Error ? error.message : "Unable to load ratings";
      if (errorMessage.includes("rate limited") || errorMessage.includes("429")) {
        setError("The ratings service is temporarily overloaded. Retrying automatically...");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUserRating = async () => {
    try {
      const token = getAuthToken();
      if (token) {
        const rating = await getUserRating(productId, token);
        if (rating) {
          setUserRating(rating);
          setSelectedRating(rating.rating);
          setComment(rating.comment || "");
          setEditingId(rating.id);
        }
      }
    } catch (error) {
      console.error("Error loading user rating:", error);
    }
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    // Validate guest info if not authenticated
    if (!isAuthenticated) {
      if (!guestEmail || !guestName) {
        toast.error("Please enter your email and name");
        return;
      }
      // Simple email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(guestEmail)) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    setSubmitting(true);
    try {
      if (isAuthenticated) {
        const token = getAuthToken();
        if (!token) {
          throw new Error("No authentication token");
        }
        await createOrUpdateRating(productId, selectedRating, comment, token);
      } else {
        await createOrUpdateRating(
          productId,
          selectedRating,
          comment,
          undefined,
          guestEmail,
          guestName
        );
      }

      toast.success(
        editingId
          ? "Rating updated successfully"
          : "Rating added successfully"
      );

      // Reset form
      setSelectedRating(0);
      setComment("");
      setGuestEmail("");
      setGuestName("");
      setShowForm(false);
      setEditingId(null);

      // Reload ratings
      await loadRatings();
      await loadUserRating();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error saving rating");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteRating = async (ratingId: number) => {
    if (!confirm("Are you sure you want to delete this rating?")) return;

    try {
      const token = getAuthToken();
      if (!token) {
        throw new Error("No authentication token");
      }

      await deleteRating(ratingId, token);
      toast.success("Rating deleted successfully");

      // Reload ratings
      await loadRatings();
      await loadUserRating();

      // Reset form
      setSelectedRating(0);
      setComment("");
      setShowForm(false);
      setEditingId(null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error deleting rating");
    }
  };

  const renderStars = (rating: number, interactive = false, onRate?: (r: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => onRate && onRate(star)}
            disabled={!interactive}
            className={`transition-colors ${
              star <= rating
                ? "text-yellow-400"
                : "text-slate-300"
            } ${interactive ? "cursor-pointer hover:text-yellow-300" : ""}`}
          >
            <Star
              className={`w-5 h-5 ${star <= rating ? "fill-current" : ""}`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-200 rounded w-1/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-amber-800">{error}</p>
            <button
              onClick={() => {
                setIsRetrying(true);
                loadRatings();
              }}
              disabled={isRetrying}
              className="text-sm text-amber-700 font-medium hover:text-amber-900 transition mt-2 disabled:opacity-50"
            >
              {isRetrying ? "Retrying..." : "Try Again"}
            </button>
          </div>
        </div>
      )}

      {/* Rating Summary */}
      {statistics && statistics.total_ratings > 0 && (
        <div className="mb-8 pb-8 border-b border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Average Rating */}
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-slate-900 mb-2">
                  {statistics.average_rating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(statistics.average_rating))}
                </div>
                <p className="text-sm text-slate-600">
                  Based on {statistics.total_ratings} rating
                  {statistics.total_ratings !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = statistics.rating_distribution[rating as keyof typeof statistics.rating_distribution] || 0;
                const percentage = statistics.total_ratings > 0
                  ? (count / statistics.total_ratings) * 100
                  : 0;

                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-slate-700 w-8">
                      {rating}★
                    </span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-slate-600 w-8 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Rating Form */}
      <div className="mb-8">
        {userRating && isAuthenticated ? (
          <div className="bg-slate-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Your Rating</h3>
                <div className="mb-3">{renderStars(userRating.rating)}</div>
              </div>
              <button
                onClick={() => handleDeleteRating(userRating.id)}
                className="text-red-600 hover:text-red-700 transition"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            {userRating.comment && (
              <p className="text-slate-700 mb-4">{userRating.comment}</p>
            )}
            <p className="text-xs text-slate-500">
              Posted on {formatDate(userRating.created_at)}
            </p>
            <button
              onClick={() => setShowForm(!showForm)}
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition"
            >
              <Edit2 className="w-4 h-4" />
              Edit Rating
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full py-3 px-4 border-2 border-blue-300 rounded-lg font-semibold text-slate-900 hover:bg-blue-50 transition"
          >
            Add Your Rating
          </button>
        )}

        {showForm && (
          <form onSubmit={handleSubmitRating} className="mt-6 bg-slate-50 rounded-lg p-6">
            {/* Guest Info - Only show if not authenticated */}
            {!isAuthenticated && (
              <div className="mb-6 pb-6 border-b border-slate-200">
                <p className="text-sm font-semibold text-slate-900 mb-4">Your Information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="John Doe"
                      maxLength={255}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="john@example.com"
                      maxLength={255}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                How would you rate this product? *
              </label>
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= selectedRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {selectedRating > 0 && (
                <p className="text-sm text-slate-600 mt-2">
                  {selectedRating === 5 && "Excellent!"}
                  {selectedRating === 4 && "Good!"}
                  {selectedRating === 3 && "Average"}
                  {selectedRating === 2 && "Poor"}
                  {selectedRating === 1 && "Very Poor"}
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-900 mb-3">
                Share your experience (optional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell other customers about your experience..."
                maxLength={1000}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <p className="text-xs text-slate-500 mt-2">
                {comment.length}/1000 characters
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting || selectedRating === 0}
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting
                  ? "Submitting..."
                  : editingId
                    ? "Update Rating"
                    : "Submit Rating"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setSelectedRating(userRating?.rating || 0);
                  setComment(userRating?.comment || "");
                  setGuestEmail("");
                  setGuestName("");
                }}
                className="py-3 px-6 border border-slate-300 font-semibold rounded-lg hover:bg-slate-100 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Reviews List */}
      {ratings.length > 0 ? (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-slate-900">
            Customer Reviews
          </h3>

          {ratings.map((rating) => (
            <div key={rating.id} className="pb-6 border-b border-slate-200">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    {rating.user?.photo ? (
                      <img
                        src={rating.user.photo}
                        alt={rating.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-300"></div>
                    )}
                    <div>
                      <p className="font-semibold text-slate-900">
                        {rating.user?.name || "Anonymous"}
                      </p>
                      <p className="text-sm text-slate-600">
                        {formatDate(rating.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-1">
                    {renderStars(rating.rating)}
                  </div>
                </div>
                {user?.id === rating.user_id && (
                  <button
                    onClick={() => handleDeleteRating(rating.id)}
                    className="text-red-600 hover:text-red-700 transition"
                    title="Delete review"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              {rating.comment && (
                <p className="text-slate-700 leading-relaxed">
                  {rating.comment}
                </p>
              )}
            </div>
          ))}

          {/* Pagination */}
          {statistics && statistics.total_ratings > 10 && (
            <div className="flex justify-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50"
              >
                Previous
              </button>
              <p className="px-4 py-2 text-slate-600">Page {currentPage}</p>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600">No reviews yet. Be the first to review!</p>
        </div>
      )}
    </div>
  );
}
