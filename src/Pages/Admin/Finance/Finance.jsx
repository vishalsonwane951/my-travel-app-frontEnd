import React, { useEffect, useState } from "react";
import adminApi from "../../../Services/adminApi.js";
import "../../../Components/Admin/Admin.css";

const TABS = ["Overview", "Invoices", "Expenses", "Commissions"];
const EXPENSE_CATEGORIES = ["operations", "marketing", "salaries", "commissions", "vendor", "refunds", "misc"];

const Finance = () => {
  const [tab, setTab] = useState("Overview");
  const [pnl, setPnl] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [expenseForm, setExpenseForm] = useState({ category: "operations", description: "", amount: "", vendor: "" });

  const loadOverview = async () => setPnl((await adminApi.get("/finance/reports/pnl")).data.pnl);
  const loadInvoices = async () => setInvoices((await adminApi.get("/finance/invoices")).data.invoices);
  const loadExpenses = async () => setExpenses((await adminApi.get("/finance/expenses")).data.expenses);
  const loadCommissions = async () => setCommissions((await adminApi.get("/finance/commissions")).data.commissions);

  useEffect(() => {
    if (tab === "Overview") loadOverview();
    if (tab === "Invoices") loadInvoices();
    if (tab === "Expenses") loadExpenses();
    if (tab === "Commissions") loadCommissions();
  }, [tab]);

  const submitExpense = async (e) => {
    e.preventDefault();
    await adminApi.post("/finance/expenses", { ...expenseForm, amount: Number(expenseForm.amount) });
    setExpenseForm({ category: "operations", description: "", amount: "", vendor: "" });
    loadExpenses();
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense entry?")) return;
    await adminApi.delete(`/finance/expenses/${id}`);
    loadExpenses();
  };

  const updateCommission = async (id, status) => {
    await adminApi.put(`/finance/commissions/${id}/status`, { status });
    loadCommissions();
  };

  const exportCsv = async (type) => {
    const { data } = await adminApi.get("/finance/export/csv", { params: { type }, responseType: "blob" });
    const url = URL.createObjectURL(new Blob([data]));
    const a = document.createElement("a");
    a.href = url; a.download = `${type}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h2>Financial & Accounting</h2>

      <div className="admin-tabs">
        {TABS.map((t) => (
          <div key={t} className={`admin-tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>

      {tab === "Overview" && pnl && (
        <div>
          <div className="admin-grid admin-kpi-grid">
            <div className="admin-kpi-card"><div className="admin-kpi-label">Revenue (this month)</div><div className="admin-kpi-value">₹{pnl.revenue.toLocaleString("en-IN")}</div></div>
            <div className="admin-kpi-card"><div className="admin-kpi-label">Expenses (this month)</div><div className="admin-kpi-value">₹{pnl.expenses.toLocaleString("en-IN")}</div></div>
            <div className="admin-kpi-card"><div className="admin-kpi-label">Net Profit</div><div className="admin-kpi-value">₹{pnl.netProfit.toLocaleString("en-IN")}</div></div>
          </div>
          <div className="admin-card">
            <h3>Expenses by Category</h3>
            {pnl.expenseByCategory.length === 0 && <p style={{ color: "#888" }}>No expenses recorded this month.</p>}
            {pnl.expenseByCategory.map((c) => (
              <div key={c.category} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f1f1" }}>
                <span style={{ textTransform: "capitalize" }}>{c.category}</span><strong>₹{c.total.toLocaleString("en-IN")}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "Invoices" && (
        <div className="admin-card admin-table-wrap">
          <div className="admin-toolbar" style={{ justifyContent: "flex-end" }}>
            <button className="admin-btn secondary" onClick={() => exportCsv("invoices")}>Export CSV</button>
          </div>
          <table className="admin-table">
            <thead><tr><th>Invoice #</th><th>Customer</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>PDF</th></tr></thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.invoiceNumber}</td>
                  <td>{inv.customer?.name}</td>
                  <td>₹{inv.total.toLocaleString("en-IN")}</td>
                  <td>₹{inv.amountPaid.toLocaleString("en-IN")}</td>
                  <td>₹{inv.balanceDue.toLocaleString("en-IN")}</td>
                  <td><span className={`admin-badge badge-${inv.status}`}>{inv.status}</span></td>
                  <td>{inv.pdfUrl ? <a href={`http://localhost:5000${inv.pdfUrl}`} target="_blank" rel="noreferrer">View</a> : "—"}</td>
                </tr>
              ))}
              {invoices.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#888" }}>No invoices yet. Invoices are created from a booking's payment page.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Expenses" && (
        <div>
          <div className="admin-card" style={{ marginBottom: 16 }}>
            <h3>Record Expense</h3>
            <form onSubmit={submitExpense} style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div className="admin-form-row">
                <label>Category</label>
                <select className="admin-select" value={expenseForm.category} onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}>
                  {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="admin-form-row">
                <label>Description</label>
                <input className="admin-input" required value={expenseForm.description} onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })} />
              </div>
              <div className="admin-form-row">
                <label>Amount (₹)</label>
                <input className="admin-input" type="number" min="0" required value={expenseForm.amount} onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })} />
              </div>
              <div className="admin-form-row">
                <label>Vendor (optional)</label>
                <input className="admin-input" value={expenseForm.vendor} onChange={(e) => setExpenseForm({ ...expenseForm, vendor: e.target.value })} />
              </div>
              <button className="admin-btn" type="submit">Add</button>
            </form>
          </div>

          <div className="admin-card admin-table-wrap">
            <div className="admin-toolbar" style={{ justifyContent: "flex-end" }}>
              <button className="admin-btn secondary" onClick={() => exportCsv("expenses")}>Export CSV</button>
            </div>
            <table className="admin-table">
              <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Vendor</th><th>Amount</th><th></th></tr></thead>
              <tbody>
                {expenses.map((e) => (
                  <tr key={e._id}>
                    <td>{new Date(e.date).toLocaleDateString("en-IN")}</td>
                    <td style={{ textTransform: "capitalize" }}>{e.category}</td>
                    <td>{e.description}</td>
                    <td>{e.vendor || "—"}</td>
                    <td>₹{e.amount.toLocaleString("en-IN")}</td>
                    <td><button className="admin-btn danger" onClick={() => deleteExpense(e._id)}>Delete</button></td>
                  </tr>
                ))}
                {expenses.length === 0 && <tr><td colSpan={6} style={{ textAlign: "center", color: "#888" }}>No expenses recorded yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "Commissions" && (
        <div className="admin-card admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Agent</th><th>Booking</th><th>Amount</th><th>Rate</th><th>Commission</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {commissions.map((c) => (
                <tr key={c._id}>
                  <td>{c.agent?.name}</td>
                  <td>{c.booking?.bookingId || c.booking?.destination}</td>
                  <td>₹{c.bookingAmount.toLocaleString("en-IN")}</td>
                  <td>{c.commissionRate}%</td>
                  <td>₹{c.commissionAmount.toLocaleString("en-IN")}</td>
                  <td><span className={`admin-badge badge-${c.status}`}>{c.status}</span></td>
                  <td style={{ display: "flex", gap: 6 }}>
                    {c.status === "pending" && <button className="admin-btn secondary" onClick={() => updateCommission(c._id, "approved")}>Approve</button>}
                    {c.status === "approved" && <button className="admin-btn" onClick={() => updateCommission(c._id, "paid")}>Mark Paid</button>}
                  </td>
                </tr>
              ))}
              {commissions.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "#888" }}>No commissions recorded yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Finance;
