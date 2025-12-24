import { useEffect, useState } from "react";
import privateAxios from "../../api/privateAxios"; // your axios instance
import ChartCard from "../../components/ui/ChartCard";
import DemoTooltip from "../../components/ui/DemoTooltip";
import "../../components/ui/admin.css";
import LoadingScreen from "../../components/ui/LoadingScreen";
import ErrorState from "../../components/ui/ErrorState";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await privateAxios.get("/admin/dashboard");
      setStats(res?.data?.stats || null);
      setRecentOrders(res?.data?.recentOrders || []);
    } catch (err) {
      console.error(err);
      if (err.code === "OFFLINE_ERROR" || err.code === "NETWORK_ERROR") {
        setError("Couldn't reach server. Check your connection and try again.");
      } else {
        setError("Failed to load dashboard data.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch dashboard data
  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} retry={fetchDashboardData} />;

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
          <h2 className="m-0 mt-2">{stats?.totalOrders ?? 0}</h2>
        </div>

        <div className="border bg-white p-3 rounded-4 flex-grow-1 px-4 shadow-sm">
          <h5 className="p-0 m-0 text-muted">Total Products</h5>
          <h2 className="m-0 mt-2">{stats?.totalProducts ?? 0}</h2>
        </div>

        <div className="border bg-white p-3 rounded-4 flex-grow-1 px-4 shadow-sm">
          <h5 className="p-0 m-0 text-muted">Total Revenue</h5>
          <h2 className="m-0 mt-2">
            $
            {Number(stats?.totalRevenue || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </h2>
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
                  <tr key={order?._id ?? order?.orderNumber}>
                    <td>#{order?.orderNumber ?? "—"}</td>
                    <td>{order?.customer?.name ?? "Unknown"}</td>
                    <td>${Number(order?.totals?.total || 0).toFixed(2)}</td>
                    <td>
                      <span
                        className={`badge bg-${
                          order?.status === "delivered"
                            ? "success"
                            : order?.status === "processing"
                              ? "warning text-dark"
                              : order?.status === "cancelled"
                                ? "danger"
                                : "secondary"
                        }`}
                      >
                        {order?.status ?? "unknown"}
                      </span>
                    </td>
                    <td>
                      {order?.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-GB")
                        : "—"}
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
