import { useEffect, useState } from "react";
import privateAxios from "../../api/privateAxios"; // your axios instance
import ChartCard from "../../components/ui/ChartCard";
import DemoTooltip from "../../components/ui/DemoTooltip";
import "../../components/ui/admin.css";
import { Button, Spinner } from "react-bootstrap";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(true);

  // 🔹 Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await privateAxios.get("/admin/dashboard");
        setStats(res.data.stats);
        setRecentOrders(res.data.recentOrders);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div
        className="min-vh-100 d-flex flex-column justify-content-center align-items-center"
        style={{ marginTop: "-83px" }}
      >
        <div className="d-flex justify-content-center align-items-center py-5">
          <Spinner animation="border" variant="primary" role="status" />
          <span className="ms-3 fs-5 text-muted">Loading dashboard...</span>
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
      {/* Page title */}
      <h1 className="display-5 mb-4" style={{ fontWeight: "500" }}>
        Admin Dashboard
      </h1>

      {/* Summary cards */}
      <div className="d-flex justify-content-center gap-3 flex-wrap my-3">
        <div className="border bg-white p-3 rounded-4 flex-grow-1 px-4 shadow-sm">
          <h5 className="p-0 m-0 text-muted">Total Orders</h5>
          <h2 className="m-0 mt-2">{stats.totalOrders}</h2>
        </div>

        <div className="border bg-white p-3 rounded-4 flex-grow-1 px-4 shadow-sm">
          <h5 className="p-0 m-0 text-muted">Total Products</h5>
          <h2 className="m-0 mt-2">{stats.totalProducts}</h2>
        </div>

        <div className="border bg-white p-3 rounded-4 flex-grow-1 px-4 shadow-sm">
          <h5 className="p-0 m-0 text-muted">Total Revenue</h5>
          <h2 className="m-0 mt-2">${stats.totalRevenue.toLocaleString()}</h2>
        </div>
      </div>

      {/* Chart Section */}
      <DemoTooltip>
        <div className="mb-4">
          <h2 className="border border-bottom-0 m-0 pt-4 px-4 pb-2 bg-white rounded-top-4">
            Revenue Overview
          </h2>
          <ChartCard />
        </div>
      </DemoTooltip>

      {/* Recent Orders */}
      <div className="mb-4 bg-white-rounded-top-4">
        <h2 className="border border-bottom-0 m-0 p-4 pb-3 bg-white rounded-top-4 overflow-auto">
          Recent Orders
        </h2>

        <div className="table-responsive border border-top-0 rounded-bottom-4">
          <table
            className="table align-middle mb-0 pb-0"
            style={{ minWidth: "850px" }}
          >
            <thead className="bg-light">
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order.orderNumber}</td>
                    <td>{order.customer.name}</td>
                    <td>${order.totals.total.toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          order.status === "delivered"
                            ? "success"
                            : order.status === "processing"
                              ? "warning text-dark"
                              : order.status === "cancelled"
                                ? "danger"
                                : "secondary"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("en-GB")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted py-3">
                    No recent orders
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
