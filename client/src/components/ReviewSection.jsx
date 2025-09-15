/* eslint-disable react/prop-types */
import { useContext, useEffect, useState } from "react";
import { Star } from "lucide-react";
import publicAxios from "../api/publicAxios";
import AuthContext from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ReviewSection = ({ productId, product, refetchProduct }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({ rating: 0, comment: "" });
  const [loading, setLoading] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false); // checks if user has already reviewed

  // ✅ check review from product prop
  useEffect(() => {
    if (user && product?.reviews) {
      const found = product.reviews.some((r) => r.userId === user._id);
      setAlreadyReviewed(found);
    }
  }, [user, product]);

  // ================= Logged-in user submission =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating < 1) return; // rating is required

    setLoading(true);

    try {
      const payload = {
        userId: user._id, // from auth context
        name: user.name,
        rating: formData.rating,
        comment: formData.comment || "",
      };

      await publicAxios.post(`/products/${productId}/reviews`, payload);

      toast.success("Review submitted successfully!");

      setFormVisible(false);
      setFormData({ rating: 0, comment: "" });

      // ✅ refetch product in parent
      if (typeof refetchProduct === "function") {
        await refetchProduct();
      }
    } catch (error) {
      toast.error("Failed to submit review. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ================= Non-logged-in user =================
  if (!user) {
    return (
      <div className="mb-4">
        <button
          className="btn btn-outline-primary rounded-pill px-4"
          onClick={() => {
            toast.info("Please log in to write a review.");
            navigate("/login", {
              state: {
                from: { pathname: `/products/${productId}#reviews` },
              },
            });
          }}
        >
          Write a Review
        </button>
      </div>
    );
  }

  // ================= Logged-in user =================
  return (
    <div className="mb-4">
      {alreadyReviewed ? (
        <div className="alert alert-info rounded-pill px-4 py-2 fw-semibold">
          ✅ You’ve already submitted a review for this product.
        </div>
      ) : !formVisible ? (
        <button
          className="btn btn-primary rounded-pill px-4"
          onClick={() => setFormVisible(true)}
        >
          Write a Review
        </button>
      ) : (
        <form
          className="border rounded-4 p-4 shadow-sm bg-light"
          style={{ maxWidth: "500px" }}
          onSubmit={handleSubmit}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Write a Review</h5>
            <button
              className="btn btn-sm btn-outline-secondary rounded-circle"
              onClick={(e) => {
                e.preventDefault();
                setFormVisible(false);
              }}
            >
              ✕
            </button>
          </div>

          {/* Rating */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Rating</label>
            <div className="d-flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={28}
                  className={`cursor-pointer ${
                    formData.rating >= star ? "text-warning" : "text-muted"
                  }`}
                  fill={formData.rating >= star ? "currentColor" : "none"}
                  onClick={() => setFormData({ ...formData, rating: star })}
                />
              ))}
            </div>
          </div>

          {/* Comment (optional) */}
          <div className="mb-3">
            <label className="form-label fw-semibold">
              Your Review (optional)
            </label>
            <textarea
              rows={4}
              className="form-control"
              placeholder="Share your thoughts..."
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill"
            disabled={!formData.rating || loading}
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewSection;
