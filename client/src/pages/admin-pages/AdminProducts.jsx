import { useEffect, useState } from "react";
import privateAxios from "../../api/privateAxios";
import { Spinner, Button } from "react-bootstrap";
import ImagePlaceholder from "../../assets/image.png"; // fallback if no image
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1); // <-- added for pagination
  const [hasMore, setHasMore] = useState(true); // <-- track if more pages exist
  const [loadingMore, setLoadingMore] = useState(false); // <-- spinner for next pages
  const [loadingMoreError, setLoadingMoreError] = useState(false); // <-- retry on scroll error

  const navigate = useNavigate();

  const fetchProducts = async (pageNumber) => {
    try {
      if (pageNumber === 1) setError("");
      else setLoadingMoreError(false);

      if (pageNumber === 1) setLoading(true);
      else setLoadingMore(true);

      const { data } = await privateAxios.get(
        `/admin/products?page=${pageNumber}&limit=10`
      );

      // expected backend response: { products, totalPages }
      if (pageNumber === 1) {
        setProducts(data.products || []);
      } else {
        setProducts((prev) => [...prev, ...(data.products || [])]);
      }

      setHasMore(pageNumber < data.totalPages);
    } catch (err) {
      console.error(err);
      if (pageNumber === 1) setError("Failed to load products.");
      else setLoadingMoreError(true);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchProducts(1);
  }, []);

  // ✅ Infinite scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !hasMore || loadingMoreError) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        // near bottom
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, loadingMore, hasMore, loadingMoreError]);

  // ✅ Fetch more when page changes
  useEffect(() => {
    if (page === 1 || !hasMore) return;
    fetchProducts(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: "-83px" }}
      >
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" role="status" />
          <span className="ms-3 fs-5 text-muted">Loading products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: "-83px" }}
      >
        <i
          className="bi bi-exclamation-triangle text-danger mb-3"
          style={{ fontSize: "3rem" }}
        ></i>
        <p className="text-danger fw-bold mb-3">{error}</p>
        <Button onClick={() => window.location.reload()} variant="primary">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="display-6">Products</h1>
        <Button
          variant="primary"
          onClick={() => navigate("/admin/products/new")}
        >
          + Add New Product
        </Button>
      </div>

      <div className="table-responsive">
        <table className="table align-middle">
          <thead className="bg-light">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <img
                      src={p.image || ImagePlaceholder}
                      width="48"
                      style={{ aspectRatio: "1/1" }}
                      className="rounded-3"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td>${p.price.toFixed(2)}</td>
                  <td>{p.stock}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => navigate(`/admin/products/${p._id}/edit`)}
                    >
                      Edit
                    </Button>
                    <Button variant="danger" size="sm">
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-3 text-muted">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* ✅ Spinner at bottom while loading more */}
      {loadingMore && (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
        </div>
      )}

      {/* ✅ Error while loading more */}
      {loadingMoreError && (
        <div className="text-center text-danger mt-2">
          Failed to load more products.{" "}
          <button
            className="btn btn-link btn-sm"
            onClick={() => {
              setLoadingMoreError(false);
              fetchProducts(page);
            }}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
