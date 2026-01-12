import { useEffect, useRef, useState } from "react";
import privateAxios from "../../api/privateAxios";
import { Spinner, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DeleteProductModal from "../../components/DeleteProductModal";
import { toast } from "react-toastify";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import LoadingScreen from "../../components/ui/LoadingScreen";
import ErrorState from "../../components/ui/ErrorState";
import Image from "../../components/ui/Image";

const AdminProducts = () => {
  const isOnline = useOnlineStatus();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingMoreError, setLoadingMoreError] = useState(false);

  // cursor for next page: send null for initial load, backend returns nextCursor
  const [cursor, setCursor] = useState(null);

  const isFetchingRef = useRef(false);
  const navigate = useNavigate();

  // Delete modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteBackendError, setDeleteBackendError] = useState("");

  // initial load function
  const fetchProducts = async () => {
    setError("");
    setLoading(true);
    try {
      isFetchingRef.current = true;
      const data = await fetchPage(null);
      setProducts(data?.products || []);
      setHasMore(Boolean(data?.hasMore));
      setCursor(data?.nextCursor || null);
    } catch (err) {
      console.error(err);
      if (err?.code === "OFFLINE_ERROR" || err?.code === "NETWORK_ERROR") {
        setError("Couldn't reach server. Check your connection and try again.");
      } else {
        setError("Failed to load products.");
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  // ---- Initial load ----
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Fetch helper ----
  const fetchPage = async (cursorToUse = null) => {
    const params = new URLSearchParams();
    params.append("limit", 10);
    if (cursorToUse) params.append("cursor", cursorToUse);
    const { data } = await privateAxios.get(
      `/admin/products?${params.toString()}`
    );
    return data; // expected: { products, hasMore, nextCursor }
  };

  // ---- Load more (on scroll) ----
  const loadMore = async () => {
    if (!hasMore || isFetchingRef.current) return;
    setLoadingMore(true);
    setLoadingMoreError(false);
    isFetchingRef.current = true;

    try {
      const data = await fetchPage(cursor);
      const fetched = data?.products || [];

      // merge without duplicates
      setProducts((prev) => [...prev, ...fetched]);

      setHasMore(Boolean(data?.hasMore));
      setCursor(data?.nextCursor || null);
    } catch (err) {
      console.error("Failed loading more:", err);
      setLoadingMoreError(true);
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  };

  // ---- Infinite scroll listener ----
  useEffect(() => {
    const onScroll = () => {
      if (loading || loadingMore || !hasMore || loadingMoreError) return;
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadingMore, hasMore, loadingMoreError, cursor]);

  // ---- Delete product (no replace, just remove locally) ----
  const handleDeleteProduct = async (productId) => {
    if (!productId) return;
    setDeleteBackendError("");
    setDeleteLoading(true);

    try {
      await privateAxios.delete(`/admin/product/${productId}`);
      // On success remove locally and show success modal
      setProducts((prev) => prev.filter((p) => p?._id !== productId));
      toast.success("Product deleted successfully");
      // close modal
      setShowDeleteModal(false);
    } catch (err) {
      console.error(err);
      if (err?.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (err?.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        setDeleteBackendError("Failed to delete product. Try again.");
      }
    } finally {
      setDeleteLoading(false);
    }
  };

  // ---- Helpers to open modal ----
  const confirmDelete = (product) => {
    setProductToDelete(product);
    setDeleteBackendError("");
    setShowDeleteModal(true);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} retry={fetchProducts} />;

  // FULL-PAGE Empty state when there are no products (after initial load)
  if (!loading && products?.length === 0) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
        style={{ marginTop: "-83px" }}
      >
        <i
          className="bi bi-box-seam text-secondary mb-3"
          style={{ fontSize: "4rem", opacity: 0.85 }}
        ></i>
        <h4 className="fw-semibold mb-2">No products yet</h4>
        <p className="text-muted mb-3">There are no products to display.</p>
        <div className="d-flex gap-2">
          <Button
            variant="primary"
            onClick={() => navigate("/admin/products/new")}
            disabled={!isOnline}
          >
            + Add Product
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-lg py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="display-6">Products</h1>
        <Button
          variant="primary"
          disabled={!isOnline}
          onClick={() => navigate("/admin/products/new")}
        >
          + Add New Product
        </Button>
      </div>

      <div className="table-responsive border">
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
            {products?.length > 0 ? (
              products?.map((p) => (
                <tr key={p?._id ?? Math.random()}>
                  <td>
                    <Image
                      src={p?.image}
                      alt={p?.name}
                      className="rounded-3 mx-auto"
                      style={{ width: "48px", height: "48px" }}
                    />
                  </td>
                  <td>{p?.name ?? "—"}</td>
                  <td>
                    {typeof p?.price === "number"
                      ? `$${p.price.toFixed(2)}`
                      : "—"}
                  </td>
                  <td>{p?.stock ?? "—"}</td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      disabled={!isOnline}
                      onClick={() =>
                        p?._id && navigate(`/admin/products/${p._id}/edit`)
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      disabled={!isOnline}
                      onClick={() => p && confirmDelete(p)}
                    >
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
          <button className="btn btn-link btn-sm" onClick={loadMore}>
            Retry
          </button>
        </div>
      )}

      {/* Delete product modal (UI only) - parent manages delete logic */}
      <DeleteProductModal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setProductToDelete(null);
          setDeleteBackendError("");
        }}
        product={productToDelete}
        onConfirm={handleDeleteProduct}
        loading={deleteLoading}
        backendError={deleteBackendError}
      />
    </div>
  );
};

export default AdminProducts;
