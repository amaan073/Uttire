import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import privateAxios from "../../api/privateAxios";
import LoadingScreen from "../../components/ui/LoadingScreen";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import ErrorState from "../../components/ui/ErrorState";

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // <-- new error state

  // default tab title
  useDocumentTitle(
    order?.orderNumber ? `Order #${order?.orderNumber}` : "Order Success"
  );

  const fetchOrder = async () => {
    try {
      const { data } = await privateAxios.get(`/orders/${orderId}`);
      setOrder(data);
      setError(null);
    } catch (error) {
      console.error(error);

      if (error?.code === "OFFLINE_ERROR" || error?.code === "NETWORK_ERROR") {
        setError("Couldn't reach server. Check your connection and try again.");
      } else if (error?.response?.status === 401) {
        setError("Unauthorized access.");
      } else if (error?.response?.status === 404) {
        setError("Order not found.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} retry={fetchOrder} />;

  // Estimate delivery: 7 days after creation
  const estimatedDelivery = new Date(order?.createdAt);
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

  // Success state
  return (
    <div
      className="container d-flex justify-content-center align-items-center text-center py-5"
      style={{ minHeight: "calc(var(--safe-height) - 83px)" }}
    >
      <div
        className="border rounded-4 bg-white shadow-sm p-3 p-sm-5 text-center"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <CheckCircleIcon sx={{ color: "rgb(42 158 90)", fontSize: 80 }} />
        <h2 className="fw-bold my-3">Order Placed Successfully!</h2>
        <p className="text-muted mb-4">
          Thank you for your purchase. We’re preparing your order.
        </p>

        {/* Minimal Order Info */}
        <div className="text-center bg-light rounded-3 p-3 mb-4">
          <div>
            <b>Order ID:</b>{" "}
            <span className="me-1 fw-semibold">
              #{order?.orderNumber ?? "N/A"}
            </span>
            <span className="small text-muted">({order?._id ?? "N/A"})</span>
          </div>
          <div>
            <b>Estimated Delivery:</b> {estimatedDelivery?.toDateString()}
          </div>
        </div>

        <Link to="/shop" className="btn btn-primary w-100 fw-semibold">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
