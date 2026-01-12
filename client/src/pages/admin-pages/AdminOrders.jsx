// src/pages/admin/AdminOrders.jsx
import { useEffect, useRef, useState } from "react";
import privateAxios from "../../api/privateAxios";
import { Spinner, Button, Modal, Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import ChangeStatusModal from "../../components/ChangeStatusModal";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import LoadingScreen from "../../components/ui/LoadingScreen";
import ErrorState from "../../components/ui/ErrorState";
import Image from "../../components/ui/Image";

const formatDate = (iso) => {
  try {
    const d = new Date(iso);
    return d.toLocaleString(); // use browser locale; adjust if you prefer fixed format
  } catch {
    return iso;
  }
};

// eslint-disable-next-line react/prop-types
const StatusBadge = ({ status }) => {
  const map = {
    pending: "secondary",
    processing: "info",
    shipped: "warning",
    delivered: "success",
    cancelled: "danger",
  };
  const variant = map[status] || "secondary";
  return (
    <Badge bg={variant} className="text-capitalize">
      {status}
    </Badge>
  );
};

const AdminOrders = () => {
  const isOnline = useOnlineStatus();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingMoreError, setLoadingMoreError] = useState(false);
  const [cursor, setCursor] = useState(null);

  const isFetchingRef = useRef(false);

  // Change status modal state
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [orderToChange, setOrderToChange] = useState(null);
  const [statusChangeLoading, setStatusChangeLoading] = useState(false);
  const [statusChangeError, setStatusChangeError] = useState("");

  const fetchOrders = async () => {
    setError("");
    setLoading(true);
    try {
      isFetchingRef.current = true;
      const data = await fetchPage(null);
      setOrders(data?.orders || []);
      setHasMore(Boolean(data?.hasMore));
      setCursor(data?.nextCursor || null);
    } catch (err) {
      console.error("Failed to load orders:", err);
      if (err.code === "OFFLINE_ERROR" || err.code === "NETWORK_ERROR") {
        setError("Couldn't reach server. Check your connection and try again.");
      } else {
        setError("Failed to load orders.");
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch helper (cursor pagination)
  const fetchPage = async (cursorToUse = null) => {
    const params = new URLSearchParams();
    params.append("limit", 8);
    if (cursorToUse) params.append("cursor", cursorToUse);
    const { data } = await privateAxios.get(
      `/admin/orders?${params.toString()}`
    );
    return data; // expected: { orders, hasMore, nextCursor }
  };

  // Load more (infinite scroll)
  const loadMore = async () => {
    if (!hasMore || isFetchingRef.current) return;
    setLoadingMore(true);
    setLoadingMoreError(false);
    isFetchingRef.current = true;
    try {
      const data = await fetchPage(cursor);
      const fetched = data?.orders || [];
      // merge (no dedupe code here because cursor approach avoids duplicates)
      setOrders((prev) => [...prev, ...fetched]);
      setHasMore(Boolean(data?.hasMore));
      setCursor(data?.nextCursor || null);
    } catch (err) {
      console.error("Failed loading more orders:", err);
      setLoadingMoreError(true);
    } finally {
      isFetchingRef.current = false;
      setLoadingMore(false);
    }
  };

  // scroll listener
  useEffect(() => {
    const onScroll = () => {
      if (loading || loadingMore || !hasMore || loadingMoreError) return;
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 120) {
        loadMore();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, loadingMore, hasMore, loadingMoreError, cursor]);

  // open change status modal
  const openChangeStatus = (order) => {
    setOrderToChange(order);
    setStatusChangeError("");
    setShowChangeModal(true);
  };

  // change status API call (optimistic update)
  const handleConfirmChangeStatus = async (orderId, newStatus) => {
    if (!orderId) return;
    setStatusChangeError("");
    setStatusChangeLoading(true);

    // optimistic update locally
    const prev = orders;
    setOrders((arr) =>
      arr?.map((o) => (o?._id === orderId ? { ...o, status: newStatus } : o))
    );

    try {
      // endpoint assumed. adjust path if your backend differs.
      const { data: updatedOrder } = await privateAxios.put(
        `/admin/order/${orderId}/status`,
        { status: newStatus }
      );

      // replace with canonical server response if returned
      setOrders((arr) =>
        arr?.map((o) => (o?._id === orderId ? updatedOrder : o))
      );
      toast.success("Order status updated");
      setShowChangeModal(false);
      setOrderToChange(null);
    } catch (err) {
      console.error("Failed to update status:", err);

      // rollback
      setOrders(prev);

      if (err?.code === "OFFLINE_ERROR") {
        toast.error("You are offline. Please check your internet connection.");
      } else if (err?.code === "NETWORK_ERROR") {
        toast.error("Network error. Please try again.");
      } else {
        setStatusChangeError("Failed to update status. Try again.");
      }
    } finally {
      setStatusChangeLoading(false);
    }
  };

  // quick view: expand items in a modal
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const openDetails = (order) => {
    setOrderDetails(order);
    setShowDetailsModal(true);
  };

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} retry={fetchOrders} />;
  if (!loading && orders.length === 0) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
        style={{ marginTop: "-83px" }}
      >
        <i
          className="bi bi-receipt text-secondary mb-3"
          style={{ fontSize: "4rem", opacity: 0.85 }}
        ></i>
        <h4 className="fw-semibold mb-2">No orders yet</h4>
        <p className="text-muted mb-3">There are no orders to display.</p>
      </div>
    );
  }

  return (
    <div className="container-xxl py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="display-6">Orders</h1>
      </div>

      <div className="table-responsive border">
        <table className="table align-middle">
          <thead className="bg-light">
            <tr>
              <th className="text-nowrap">Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Placed</th>
              <th>Status</th>
              <th style={{ minWidth: 180 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((o) => (
                <tr key={o?._id}>
                  <td className="fw-medium">
                    #{o?.orderNumber || o?._id?.slice(-6).toUpperCase()}
                  </td>
                  <td>
                    <div className="fw-semibold">{o?.user?.name || "-"}</div>
                    <div className="text-muted small">
                      {o?.user?.email || ""}
                    </div>
                  </td>
                  <td>{Array.isArray(o?.items) ? o?.items?.length : "-"}</td>
                  <td>${Number(o?.totals?.total || 0).toFixed(2)}</td>
                  <td>{formatDate(o?.createdAt)}</td>
                  <td>
                    <StatusBadge status={o?.status} />
                  </td>
                  <td className="d-flex justify-content-end align-items-center gap-2 flex-wrap">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => openDetails(o)}
                    >
                      View
                    </Button>
                    <Button
                      variant="warning"
                      size="sm"
                      disabled={!isOnline}
                      className="text-nowrap"
                      onClick={() => openChangeStatus(o)}
                    >
                      Update status
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-3 text-muted">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {loadingMore && (
        <div className="text-center py-4">
          <Spinner animation="border" role="status" />
        </div>
      )}

      {loadingMoreError && (
        <div className="text-center text-danger mt-2">
          Failed to load more orders.{" "}
          <button className="btn btn-link btn-sm" onClick={loadMore}>
            Retry
          </button>
        </div>
      )}

      {/* Change status modal */}
      <ChangeStatusModal
        show={showChangeModal}
        onHide={() => {
          setShowChangeModal(false);
          setOrderToChange(null);
          setStatusChangeError("");
        }}
        order={orderToChange}
        onConfirm={handleConfirmChangeStatus}
        loading={statusChangeLoading}
        backendError={statusChangeError}
      />

      {/* Details modal */}
      <Modal
        show={showDetailsModal}
        onHide={() => {
          setShowDetailsModal(false);
          setOrderDetails(null);
        }}
        size="lg"
        style={{ marginTop: "60px", paddingBottom: "50px" }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Order Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!orderDetails ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
            </div>
          ) : (
            <>
              {/* --- Basic order info --- */}
              <div className="mb-3">
                <strong>Order:</strong> #
                {orderDetails?.orderNumber || orderDetails?._id}
                <div className="text-muted small">
                  Placed on {formatDate(orderDetails?.createdAt)}
                </div>
                <p>
                  <strong>Estimated Delivery:</strong>{" "}
                  {new Date(orderDetails?.estimatedDelivery).toLocaleDateString(
                    "en-IN",
                    { dateStyle: "medium" }
                  )}
                </p>
              </div>

              {/* --- Customer info --- */}
              <div className="mb-3">
                <strong>Customer Information</strong>
                <div className="mt-2">
                  <div className="fw-semibold">
                    {orderDetails?.customer?.name}
                  </div>
                  <div className="text-muted small">
                    {orderDetails?.customer?.email}
                  </div>
                  <div className="text-muted small">
                    📞 {orderDetails?.customer?.phone}
                  </div>
                  <div className="mt-1">
                    <div>
                      {orderDetails?.customer?.address},{" "}
                      {orderDetails?.customer?.city},{" "}
                      {orderDetails?.customer?.state},{" "}
                      {orderDetails?.customer?.country} -{" "}
                      {orderDetails?.customer?.zip}
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Payment & delivery info --- */}
              <div className="mb-3">
                <strong>Payment & Delivery</strong>
                <div className="mt-2">
                  <div>
                    💳 <strong>Payment:</strong> {orderDetails?.paymentMethod}
                  </div>
                  <div>
                    🚚 <strong>Delivery:</strong> {orderDetails?.delivery}
                  </div>
                </div>
              </div>

              {/* --- Items list --- */}
              <div className="mb-4">
                <strong>Items</strong>
                <div className="list-group mt-2">
                  {Array.isArray(orderDetails?.items) &&
                  orderDetails?.items?.length > 0 ? (
                    orderDetails?.items?.map((it, idx) => (
                      <div
                        key={idx}
                        className="list-group-item d-flex align-items-center justify-content-between"
                      >
                        <div className="d-flex align-items-center">
                          {/* ✅ Product image */}
                          <Image
                            src={it?.product?.image}
                            alt={it?.product?.name}
                            style={{ width: "60px", height: "60px" }}
                            className="rounded-3 me-3"
                          />

                          {/* ✅ Product info */}
                          <div>
                            <div className="fw-semibold">
                              {it?.product?.name || "Unnamed Product"}
                            </div>
                            {it?.size && (
                              <div className="small text-muted">
                                Size: {it?.size}
                              </div>
                            )}
                            {it?.discount > 0 && (
                              <div className="small text-success">
                                Discount: {it?.discount}%
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ✅ Quantity and pricing */}
                        <div className="text-end">
                          <div>
                            {it?.quantity} × ${Number(it?.price)?.toFixed(2)}
                          </div>
                          <div className="fw-semibold">
                            $
                            {Number(
                              it?.quantity *
                                it?.price *
                                (1 - it?.discount / 100)
                            ).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted p-3">No items found</div>
                  )}
                </div>
              </div>

              {/* --- Totals & Status --- */}
              <div className="border-top pt-3 d-flex justify-content-between flex-wrap">
                <div>
                  <strong>Order Summary</strong>
                  <div className="mt-2">
                    <div>
                      Subtotal: $
                      {Number(orderDetails?.totals?.subtotal || 0).toFixed(2)}
                    </div>
                    <div>
                      Shipping: $
                      {Number(orderDetails?.totals?.shipping || 0).toFixed(2)}
                    </div>
                    <div className="fw-bold h5 mt-1">
                      Total: $
                      {Number(orderDetails?.totals?.total || 0).toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="text-end">
                  <strong>Status</strong>
                  <div className="mt-2">
                    <StatusBadge status={orderDetails?.status} />
                  </div>
                </div>
              </div>
            </>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminOrders;
