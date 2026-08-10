import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [growth, setGrowth] = useState([]);
  const [performance, setPerformance] = useState([]);
  const [repeatRate, setRepeatRate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [s, g, p, r] = await Promise.all([
        adminApi.get("/reports/summary"),
        adminApi.get("/reports/customer-growth"),
        adminApi.get("/reports/package-performance"),
        adminApi.get("/reports/repeat-customers"),
      ]);
      setSummary(s.data.summary);
      setGrowth(g.data.growth.map((x) => ({ label: `${x._id.m}/${x._id.y}`, newCustomers: x.newCustomers })));
      setPerformance(p.data.performance);
      setRepeatRate(r.data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="admin-loading">Loading reports…</div>;

  return (
    <div>
      <h2>Reports & Business Intelligence</h2>
      <div className="admin-grid admin-kpi-grid">
        <div className="admin-kpi-card"><div className="admin-kpi-label">Total Revenue</div><div className="admin-kpi-value">₹{summary.totalRevenue.toLocaleString("en-IN")}</div></div>
        <div className="admin-kpi-card"><div className="admin-kpi-label">Total Bookings</div><div className="admin-kpi-value">{summary.totalBookings}</div></div>
        <div className="admin-kpi-card"><div className="admin-kpi-label">Total Customers</div><div className="admin-kpi-value">{summary.totalCustomers}</div></div>
        <div className="admin-kpi-card"><div className="admin-kpi-label">Repeat Customer Rate</div><div className="admin-kpi-value">{repeatRate.repeatCustomerRate}%</div></div>
      </div>

      <div className="admin-card" style={{ marginBottom: 18 }}>
        <h3>New Customer Growth</h3>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={growth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" /><YAxis /><Tooltip />
            <Line type="monotone" dataKey="newCustomers" stroke="#4f7cff" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="admin-card admin-table-wrap">
        <h3>Package Performance</h3>
        <table className="admin-table">
          <thead><tr><th>Package</th><th>Bookings</th><th>Revenue</th></tr></thead>
          <tbody>
            {performance.map((p, i) => (
              <tr key={i}><td>{p._id || "Unspecified"}</td><td>{p.bookings}</td><td>₹{p.revenue.toLocaleString("en-IN")}</td></tr>
            ))}
            {performance.length === 0 && <tr><td colSpan={3} style={{ textAlign: "center", color: "#888" }}>No confirmed bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
