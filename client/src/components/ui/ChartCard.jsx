import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 2000 },
  { month: "Mar", revenue: 1800 },
  { month: "Apr", revenue: 2200 },
  { month: "May", revenue: 2700 },
  { month: "Jun", revenue: 2400 },
  { month: "Jul", revenue: 2900 },
  { month: "Aug", revenue: 2600 },
  { month: "Sep", revenue: 3000 },
  { month: "Oct", revenue: 2800 },
  { month: "Nov", revenue: 3200 },
  { month: "Dec", revenue: 3500 },
];

export default function RevenueLineChart() {
  return (
    <div
      className="p-3 border border-top-0 rounded-bottom-4"
      style={{ background: "#fff" }}
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={revenueData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3f51b5"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-muted mt-2" style={{ fontSize: "0.85rem" }}>
        Demo only – not real data
      </p>
    </div>
  );
}
