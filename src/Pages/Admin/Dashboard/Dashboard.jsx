import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend,
} from "recharts";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const Dashboard = () => {
  const [overview, setOverview] = useState(null);
  const [trend, setTrend] = useState([]);
  const [funnel, setFunnel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [ov, tr, fn] = await Promise.all([
          adminApi.get("/dashboard/overview"),
          adminApi.get("/dashboard/trend?months=6"),
          adminApi.get("/dashboard/funnel"),
        ]);
        setOverview(ov.data.overview);
        setTrend(tr.data.trend);
        setFunnel(fn.data.funnel);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="admin-loading">Loading dashboard…</div>;
  if (error) return <div className="admin-error">{error}</div>;

  const kpis = [
    { label: "Total Revenue", value: `₹${(overview.totalRevenue || 0).toLocaleString("en-IN")}` },
    { label: "Total Bookings", value: overview.totalBookings },
    { label: "Confirmed Bookings", value: overview.confirmedBookings },
    { label: "Active Packages", value: overview.activePackages },
  ];

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="admin-grid admin-kpi-grid">
        {kpis.map((k) => (
          <div className="admin-kpi-card" key={k.label}>
            <div className="admin-kpi-label">{k.label}</div>
            <div className="admin-kpi-value">{k.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
        <div className="admin-card">
          <h3>Revenue & Bookings (last 6 months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#4f7cff" name="Revenue (₹)" />
              <Line yAxisId="right" type="monotone" dataKey="bookings" stroke="#1a7a37" name="Bookings" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="admin-card">
          <h3>Top Destinations</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {overview.topDestinations.length === 0 && <li style={{ color: "#888" }}>No bookings yet.</li>}
            {overview.topDestinations.map((d) => (
              <li key={d.destination} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #f1f1f1" }}>
                <span>{d.destination}</span>
                <strong>{d.bookings}</strong>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="admin-card" style={{ marginTop: 18 }}>
        <h3>Conversion Funnel</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={funnel} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis type="category" dataKey="stage" width={100} />
            <Tooltip />
            <Bar dataKey="count" fill="#4f7cff" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
