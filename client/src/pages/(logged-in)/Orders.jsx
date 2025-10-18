import { useEffect, useState, useRef } from "react";
import privateAxios from "../../api/privateAxios";
import Spinner from "react-bootstrap/Spinner";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Modal } from "react-bootstrap";
import { ShoppingBagIcon } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false); // for scroll loading
  const [loadingMoreError, setLoadingMoreError] = useState(false); // scroll loading error
  const [stats, setStats] = useState({ totalOrders: 0, totalSpent: 0 });

  const [cancelingOrderId, setCancelingOrderId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    // Initial fetch
    fetchOrders(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async (pageNumber) => {
    try {
      // reset errors
      if (pageNumber === 1) {
        setError(null); // initial fetch error
      } else {
        setLoadingMoreError(false); // infinite scroll error
      }

      if (pageNumber === 1)
        setLoading(true); // initial loader
      else setLoadingMore(true); // loader for more items

      const { data } = await privateAxios.get(
        `/orders?page=${pageNumber}&limit=5`
      ); // limit per page

      if (pageNumber === 1) {
        setOrders(data.orders || []);
        setStats({
          totalOrders: data.totalOrders || 0,
          totalSpent: data.totalSpent || 0,
        });
      } else {
        setOrders((prev) => [...prev, ...(data.orders || [])]);
      }

      setHasMore(pageNumber < data.totalPages);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      if (pageNumber === 1) {
        setError(
          err.response?.data?.message ||
            "Something went wrong while fetching orders."
        );
      } else {
        setLoadingMoreError(true);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!hasMore || loadingMore || loading || loadingMoreError) return;

      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 50) {
        // near bottom
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, loading]);

  // Fetch new page whenever page state changes
  useEffect(() => {
    if (page === 1 || !hasMore) return;
    fetchOrders(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const confirmCancel = (orderId) => {
    setCancelingOrderId(orderId);
    setShowModal(true);
  };

  const handleCancel = async () => {
    setShowModal(false);
    if (!cancelingOrderId) return;

    try {
      await privateAxios.put(`/orders/${cancelingOrderId}/cancel`);

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === cancelingOrderId
            ? { ...order, status: "cancelled" }
            : order
        )
      );

      toast.success("Order cancelled Successfully!");
    } catch (err) {
      const errorCode = err.response?.data?.code;
      if (errorCode === "ALREADY_CANCELLED") {
        toast.info("Order was already cancelled.");
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === cancelingOrderId
              ? { ...order, status: "cancelled" }
              : order
          )
        );
        return;
      }

      console.error(err);
      toast.error("Failed to cancel order!");
    } finally {
      setCancelingOrderId(null);
    }
  };

  if (loading)
    return (
      <div
        className="min-vh-100 d-flex justify-content-center align-items-center"
        style={{ marginTop: "-83px" }}
      >
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  if (error) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
        style={{ marginTop: "-83px" }}
      >
        <i
          className="bi bi-exclamation-triangle text-danger mb-3"
          style={{ fontSize: "3rem" }}
        ></i>
        <h5 className="fw-semibold mb-2">Unable to fetch orders</h5>
        <p className="text-muted mb-4">
          Something went wrong. Please try again.
        </p>
        <Button variant="primary" onClick={() => fetchOrders(1)}>
          Retry
        </Button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center"
        style={{ marginTop: "-83px" }}
      >
        <i
          className="bi bi-box-seam text-secondary mb-3"
          style={{ fontSize: "5.5rem", opacity: 0.8 }}
        ></i>
        <h5 className="fw-semibold text-muted">No orders yet</h5>
        <div className="btn btn-primary mt-4">
          <Link
            to="/shop"
            style={{ all: "unset" }}
            className="d-flex align-items-center gap-1"
          >
            <ShoppingBagIcon />
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container py-5 pb-3"
      style={{
        minHeight: "calc(var(--safe-height) - 83px)",
        maxWidth: "800px",
      }}
      ref={containerRef}
    >
      {/* HEADER + STATS */}
      <div className="d-sm-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 ">
        <h1 className="fw-semibold mb-sm-0 mb-3 display-5 text-center text-sm-start">
          Your Orders
        </h1>
        <div className="d-flex gap-3 justify-content-center justify-content-sm-start">
          <div
            className="card shadow-sm border-0"
            style={{ minWidth: "140px" }}
          >
            <div className="card-body py-2 text-center">
              <p className="text-muted mb-1 small">Total Orders</p>
              <h5 className="fw-bold mb-0">{stats.totalOrders}</h5>
            </div>
          </div>
          <div
            className="card shadow-sm border-0"
            style={{ minWidth: "140px" }}
          >
            <div className="card-body py-2 text-center">
              <p className="text-muted mb-1 small">Total Spent</p>
              <h5 className="fw-bold mb-0">${stats.totalSpent.toFixed(2)}</h5>
            </div>
          </div>
        </div>
      </div>
      {/* ORDERS LIST */}

      <div className="d-flex flex-column gap-4">
        {orders.map((order) => (
          <div key={order._id} className="card border shadow-sm">
            <div className="card-header bg-white border-0 p-3 pb-0">
              {/* ORDER HEADER */}
              <div className="d-flex justify-content-between flex-wrap align-items-center">
                <div>
                  <div className="d-flex align-items-center gap-2 mb-0 mb-sm-2">
                    <h5 className="fw-semibold m-0">
                      Order #{order.orderNumber}
                    </h5>
                    <span
                      className={`badge rounded-pill text-capitalize ${
                        order.status === "delivered"
                          ? "bg-success-subtle text-success"
                          : order.status === "pending"
                            ? "bg-warning-subtle text-warning"
                            : order.status === "processing"
                              ? "bg-info-subtle text-info"
                              : order.status === "shipped"
                                ? "bg-primary-subtle text-primary"
                                : order.status === "cancelled"
                                  ? "bg-danger-subtle text-danger"
                                  : "bg-secondary-subtle text-secondary"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-muted small mb-1 d-none d-md-block">
                    <small>ID: {order._id}</small>
                  </p>
                  <p className="text-muted small mb-0 d-none d-md-block">
                    {new Date(order.createdAt).toLocaleDateString()} •{" "}
                    {order.paymentMethod.toUpperCase()} •{" "}
                    <span className="text-capitalize">
                      {order.delivery} delivery (+
                      {order.delivery === "express" ? 10 : 5}$)
                    </span>
                  </p>
                </div>

                <div className="text-end">
                  <div className="fw-bold fs-5 text-dark">
                    ${order.totals?.total.toFixed(2)}
                  </div>
                  {(() => {
                    const estimatedDelivery = new Date(order.createdAt);
                    const daysToAdd = order.delivery === "express" ? 4 : 7;
                    estimatedDelivery.setDate(
                      estimatedDelivery.getDate() + daysToAdd
                    );
                    return (
                      <p className="text-muted small mb-1 d-none d-md-block">
                        Estimated delivery:{" "}
                        <span className="fw-semibold">
                          {estimatedDelivery.toLocaleDateString()}
                        </span>
                      </p>
                    );
                  })()}

                  {["pending", "processing"].includes(order.status) && (
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => confirmCancel(order._id)}
                      disabled={cancelingOrderId == order._id}
                    >
                      {cancelingOrderId == order._id ? (
                        <div
                          style={{ width: "87px", height: "21px" }}
                          className="d-flex align-items-center justify-content-center"
                        >
                          <Spinner animation="border" size="sm" cl="true" />
                        </div>
                      ) : (
                        "Cancel Order"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* ORDER ITEMS */}
            <div className="card-body">
              {order.items.map((item) => {
                const discountedPrice =
                  item.price - (item.price * item.discount) / 100;
                return (
                  <div
                    key={item._id}
                    className="d-flex align-items-center bg-light p-3 rounded-3 shadow-sm cursor-pointer mt-3"
                    onClick={() => navigate(`/products/${item.product._id}`)}
                  >
                    <div className="me-3">
                      <img
                        src={`http://localhost:5000/public${item.product.image}`}
                        alt={item.product.name}
                        className="rounded img_ol"
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div className="flex-grow-1 ol_product">
                      <h6 className="fw-semibold mb-1">{item.product.name}</h6>
                      <p className="text-muted small mb-1">
                        Color: {item.product.color} • Size: {item.size}
                      </p>
                      <p className="text-muted small mb-0">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-end">
                      <div
                        className="text-success fw-bold"
                        style={{ fontSize: "1.05em" }}
                      >
                        ${(discountedPrice * item.quantity).toFixed(2)}
                      </div>
                      <p className="small">
                        ({item.quantity} × ${discountedPrice.toFixed(2)})
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Show spinner at bottom while loading more */}

      <div
        className={`text-center pt-4 pb-0 ${loadingMore ? "" : "invisible"}`}
      >
        <Spinner animation="border" role="status" variant="primary" />
      </div>
      {/* Infinite scroll error */}
      {loadingMoreError && (
        <div
          className="text-center text-danger mb-3"
          style={{ marginTop: "-20px" }}
        >
          Failed to load more orders.{" "}
          <button
            className="btn btn-link btn-sm"
            onClick={() => {
              setLoadingMoreError(false); // reset the error so scroll works again
              fetchOrders(page);
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* CONFIRM CANCEL MODAL */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCancelingOrderId(null);
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to cancel this order?</Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setCancelingOrderId(null);
            }}
          >
            Close
          </Button>
          <Button variant="danger" onClick={handleCancel}>
            Confirm Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
