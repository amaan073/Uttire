import { useEffect, useState } from "react";
import publicAxios from "../api/publicAxios";
import Dropdown from "react-bootstrap/Dropdown";
import StarRating from "./ui/StarRating";

// eslint-disable-next-line react/prop-types
const ReviewsList = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("recent"); // recent | highest | lowest
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // fetch reviews
  const fetchReviews = async (reset = false) => {
    try {
      setLoading(true);
      const { data } = await publicAxios.get(
        `/products/${productId}/reviews?page=${reset ? 1 : page}&limit=5&sort=${filter}`
      );

      // to reset the list if filter changes
      if (reset) {
        setReviews(data.reviews);
      } else {
        setReviews((prev) => [...prev, ...data.reviews]);
      }

      setHasMore(data.hasMore);
      setPage((prev) => (reset ? 2 : prev + 1)); // after filter chagnge (reset is true) the page value is set to 2 so next time load more gets second page when clicked
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("Failed to load reviews. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // fetch when filter changes
  useEffect(() => {
    fetchReviews(true); // reset on filter change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, productId]);

  return (
    <div>
      {/* Error Feedback */}
      {error && (
        <div className="alert alert-danger">
          Failed to load reviews. Please try again later.
        </div>
      )}

      {/* Filter - only if not error AND reviews exist */}
      {!error && reviews.length > 0 && (
        <div className="d-flex align-items-center gap-2 mb-4">
          <strong>Sort by:</strong>
          <Dropdown>
            <Dropdown.Toggle variant="outline-dark" size="sm">
              {filter === "recent"
                ? "Most Recent"
                : filter === "highest"
                  ? "Highest Rating"
                  : "Lowest Rating"}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => setFilter("recent")}>
                Most Recent
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("highest")}>
                Highest Rating
              </Dropdown.Item>
              <Dropdown.Item onClick={() => setFilter("lowest")}>
                Lowest Rating
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      )}

      {/* Review items */}
      <div className="mt-3">
        {/* Loading state */}
        {loading && reviews.length === 0 && !error && (
          <p className="text-muted">Loading reviews...</p>
        )}

        {/* No reviews */}
        {reviews.length === 0 && !loading && !error && (
          <p className="text-muted">No reviews yet.</p>
        )}

        {/* Review list */}
        {!error &&
          reviews.map((r) => (
            <div key={r._id} className="border-bottom pb-3 mb-3">
              <div className="d-flex align-items-center gap-2 mb-1">
                <StarRating rating={r.rating} />
                <b>{r.name}</b>
                <span className="text-muted small">
                  • {new Date(r.date).toLocaleDateString()}
                </span>
              </div>
              <p className="mb-0">{r.comment}</p>
            </div>
          ))}
      </div>

      {/* Load More - only if reviews exist, no error, and has more */}
      {hasMore && !error && reviews.length > 0 && (
        <div className="text-center">
          <button
            className="btn btn-link text-decoration-none"
            onClick={() => fetchReviews()}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load more reviews →"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
