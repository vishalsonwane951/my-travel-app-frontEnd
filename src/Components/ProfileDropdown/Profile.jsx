import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext.jsx";
import api from "../../utils/api";

/* ─── Tab definitions ──────────────────────────────────────────────── */
const TABS = [
  { id: "overview", label: "Overview", icon: "👤" },
  { id: "bookings", label: "My Bookings", icon: "✈️" },
  { id: "enquiries", label: "Enquiries", icon: "📋" },
  { id: "saved", label: "Saved", icon: "❤️" },
  { id: "settings", label: "Settings", icon: "⚙️" },
];

/* ─── Helpers ──────────────────────────────────────────────────────── */
const fmt = (d) => {
  if (!d) return "N/A";
  const date = new Date(d);
  return isNaN(date)
    ? "N/A"
    : date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const statusStyle = (s) => {
  switch ((s || "").toLowerCase()) {
    case "confirmed":
      return { bg: "#dcfce7", color: "#166534", dot: "#22c55e" };
    case "pending":
      return { bg: "#fef9c3", color: "#854d0e", dot: "#eab308" };
    case "responded":
      return { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" };
    case "closed":
      return { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" };
    case "cancelled":
      return { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" };
    default:
      return { bg: "#f3f4f6", color: "#374151", dot: "#9ca3af" };
  }
};

/* ─── Shared style tokens ──────────────────────────────────────────── */
const SS = {
  sectionTitle: {
    fontSize: "0.67rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: 12,
    marginTop: 0,
    paddingBottom: 6,
    borderBottom: "1px solid #f1f5f9",
  },
  infoCard: {
    background: "#f8fafc",
    border: "1px solid #f1f5f9",
    borderRadius: 10,
    padding: "10px 14px",
  },
  infoLabel: {
    fontSize: "0.63rem",
    color: "#94a3b8",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.07em",
    marginBottom: 4,
  },
  infoVal: {
    fontSize: "0.87rem",
    color: "#0f172a",
    fontWeight: 500,
    wordBreak: "break-word",
  },
  formLabel: {
    fontSize: "0.71rem",
    fontWeight: 600,
    color: "#475569",
    display: "block",
    marginBottom: 4,
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1.5px solid #e2e8f0",
    fontSize: "0.83rem",
    fontFamily: "'Sora',sans-serif",
    outline: "none",
    boxSizing: "border-box",
  },
};

const btn = (bg, extra = {}) => ({
  padding: "7px 18px",
  borderRadius: 50,
  border: "none",
  background: bg,
  color: "white",
  fontWeight: 600,
  fontSize: "0.77rem",
  cursor: "pointer",
  fontFamily: "'Sora',sans-serif",
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  flexShrink: 0,
  ...extra,
});

/* ─── Badge ──────────────────────────────────────────────────────────── */
const Badge = ({ status }) => {
  const s = statusStyle(status);
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        background: s.bg,
        color: s.color,
        fontSize: "0.68rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        flexShrink: 0,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      {status || "Unknown"}
    </span>
  );
};

/* ─── Spinner ─────────────────────────────────────────────────────────── */
const Spin = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: 220,
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: "50%",
        border: "3px solid #f1f5f9",
        borderTop: "3px solid #3D52A0",
        animation: "prof-spin 0.8s linear infinite",
      }}
    />
  </div>
);

/* ─── Empty ───────────────────────────────────────────────────────────── */
const Empty = ({ icon, title, sub, action, onAction }) => (
  <div style={{ textAlign: "center", padding: "48px 20px" }}>
    <div style={{ fontSize: "3rem", marginBottom: 14 }}>{icon}</div>
    <div
      style={{
        fontSize: "0.98rem",
        fontWeight: 600,
        color: "#0f172a",
        marginBottom: 6,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontSize: "0.81rem",
        color: "#94a3b8",
        marginBottom: action ? 20 : 0,
      }}
    >
      {sub}
    </div>
    {action && (
      <button
        onClick={onAction}
        style={btn("linear-gradient(135deg,#3D52A0,#6475C7)")}
      >
        {action}
      </button>
    )}
  </div>
);

/* ══════════════════════════════════════════════════════════════════════
   TAB: OVERVIEW
══════════════════════════════════════════════════════════════════════ */
export const OverviewTab = ({ user, stats, onTabChange }) => {
  const fields = [
    { label: "Full Name", val: user?.name || "Not set" },
    { label: "Email", val: user?.email || "Not set" },
    { label: "Phone", val: user?.phone || "Not added" },
    { label: "City", val: user?.city || "Not added" },
    { label: "Nationality", val: user?.nationality || "Indian" },
    { label: "Member Since", val: fmt(user?.createdAt) },
  ];
  const quick = [
    {
      icon: "✈️",
      label: "My Bookings",
      sub: `${stats.bookings} confirmed`,
      tab: "bookings",
    },
    {
      icon: "📋",
      label: "Enquiries",
      sub: `${stats.enquiries} total`,
      tab: "enquiries",
    },
    {
      icon: "❤️",
      label: "Saved",
      sub: `${stats.saved} packages`,
      tab: "saved",
    },
    { icon: "⚙️", label: "Settings", sub: "Manage account", tab: "settings" },
  ];
  return (
    <div>
      <p style={SS.sectionTitle}>Personal Information</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
          marginBottom: 28,
        }}
      >
        {fields.map((f, i) => (
          <div key={i} style={SS.infoCard}>
            <div style={SS.infoLabel}>{f.label}</div>
            <div style={SS.infoVal}>{f.val}</div>
          </div>
        ))}
      </div>
      <p style={SS.sectionTitle}>Quick Access</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
        }}
      >
        {quick.map((q, i) => (
          <button
            key={i}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onTabChange(q.tab);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              borderRadius: 12,
              border: "1.5px solid #e8edf5",
              background: "#fafbff",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "'Sora',sans-serif",
              transition: "all 0.18s",
              width: "100%",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#eef2ff";
              e.currentTarget.style.borderColor = "#c7d2fe";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fafbff";
              e.currentTarget.style.borderColor = "#e8edf5";
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "#eef2ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                flexShrink: 0,
              }}
            >
              {q.icon}
            </div>
            <div>
              <div
                style={{
                  fontSize: "0.87rem",
                  fontWeight: 600,
                  color: "#0f172a",
                }}
              >
                {q.label}
              </div>
              <div
                style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 2 }}
              >
                {q.sub}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   TAB: MY TRIPS
══════════════════════════════════════════════════════════════════════ */
export const BookingsTab = ({ user, token }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const tk = token || localStorage.getItem("token");
        const url = user?.isAdmin
          ? "/bookings/confirmed"
          : "/bookings/confirmed-user";
        const { data } = await api.get(url, {
          headers: { Authorization: `Bearer ${tk}` },
        });
        if (data.success) setBookings(data.bookings || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, token]);

  const handlePrint = (b) => {
    const win = window.open("", "_blank");
    win.document.write(`<!DOCTYPE html><html><head><title>Itinerary</title>
        <style>
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:'Segoe UI',sans-serif;padding:36px;color:#1a1a2e;background:#fff;line-height:1.6}
          .hdr{background:linear-gradient(135deg,#0f172a,#3D52A0);color:#fff;padding:28px 32px;border-radius:14px;margin-bottom:24px}
          .hdr h1{font-size:1.7rem;font-weight:700;margin-bottom:4px}
          .hdr p{opacity:0.6;font-size:0.83rem}
          .badge{display:inline-block;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.22);padding:4px 14px;border-radius:20px;font-size:0.74rem;font-weight:600;margin-top:10px;color:#C9A84C}
          .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:20px}
          .card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:12px 14px}
          .card label{font-size:0.64rem;text-transform:uppercase;letter-spacing:0.08em;color:#94a3b8;display:block;margin-bottom:4px;font-weight:700}
          .card span{font-weight:600;color:#0f172a;font-size:0.88rem}
          .footer{margin-top:28px;border-top:2px solid #f1f5f9;padding-top:18px;text-align:center;color:#94a3b8;font-size:0.75rem}
          .no-print{text-align:center;margin-top:20px}
          .print-btn{padding:10px 28px;background:#3D52A0;color:#fff;border:none;border-radius:8px;font-size:1rem;cursor:pointer}
          @media print{.no-print{display:none}}
        </style></head><body>
        <div class="hdr">
          <h1>DESIVDESI Tours &amp; Travel</h1>
          <p>Official Travel Itinerary · Ref: ${b.bookingId || b._id}</p>
          <div class="badge">✓ Confirmed Booking</div>
        </div>
        <div class="grid">
          <div class="card"><label>Passenger</label><span>${b.fullName}</span></div>
          <div class="card"><label>Email</label><span>${b.email}</span></div>
          <div class="card"><label>Mobile</label><span>${b.mobile}</span></div>
          <div class="card"><label>Destination</label><span>${b.destination || "N/A"}</span></div>
          <div class="card"><label>Package</label><span>${b.packageName || b.packageId || "N/A"}</span></div>
          <div class="card"><label>Start Date</label><span>${fmt(b.startDate)}</span></div>
          <div class="card"><label>Duration</label><span>${b.duration} Days</span></div>
          <div class="card"><label>Travelers</label><span>${b.adults || 0} Adults · ${b.children || 0} Children</span></div>
          <div class="card"><label>Quoted Price</label><span>₹${b.quotedPrice || "TBD"}</span></div>
          <div class="card"><label>Status</label><span style="color:#166534;font-weight:700">✓ CONFIRMED</span></div>
        </div>
        ${b.notes ? `<div class="card" style="margin-bottom:16px"><label>Special Requests</label><span>${b.notes}</span></div>` : ""}
        <div class="footer">
          <p>📞 +91 78882 51550 &nbsp;·&nbsp; ✉️ tours.desivdesi@gmail.com</p>
          <p style="margin-top:6px">Generated on ${new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          <p style="margin-top:4px">© ${new Date().getFullYear()} DesiVDesi Tours &amp; Travel. All rights reserved.</p>
        </div>
        <div class="no-print"><button class="print-btn" onclick="window.print()">🖨️ Print Itinerary</button></div>
        </body></html>`);
    win.document.close();
  };

  if (loading) return <Spin />;

  const filtered = bookings.filter((b) =>
    [b.packageName, b.destination, b.fullName, b.bookingId].some((v) =>
      (v || "").toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <div style={{ margin: "25px 25px 0px 25px" }}>
      {/* Page header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            My Bookings
          </h3>
          <p
            style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#94a3b8" }}
          >
            Your confirmed travel bookings
          </p>
        </div>
        <div
          style={{
            background: "#eef2ff",
            color: "#3D52A0",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: "0.74rem",
            fontWeight: 700,
          }}
        >
          {filtered.length} trip{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by destination, package, name…"
          style={{ ...SS.input, paddingLeft: 36 }}
          onFocus={(e) => (e.target.style.borderColor = "#3D52A0")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
      </div>

      {filtered.length === 0 ? (
        <Empty
          icon="✈️"
          title="No confirmed trips yet"
          sub="Your confirmed bookings will appear here once approved by our team"
        />
      ) : (
        filtered.map((b) => {
          const isOpen = expanded === b._id;
          return (
            <div
              key={b._id}
              style={{
                borderRadius: 14,
                border: "1.5px solid #e8edf5",
                marginBottom: 14,
                overflow: "hidden",
                background: "white",
                boxShadow: "0 2px 8px rgba(61,82,160,0.05)",
              }}
            >
              {/* Top */}
              <div
                style={{
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div
                  style={{
                    width: 46,
                    height: 46,
                    borderRadius: 12,
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                  }}
                >
                  ✈️
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.92rem",
                      color: "#0f172a",
                      marginBottom: 3,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {b.packageName || b.packageId || "Travel Package"}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    📍 {b.destination || "N/A"} &nbsp;·&nbsp; 🗓{" "}
                    {fmt(b.startDate)}
                  </div>
                </div>
                <Badge status="Confirmed" />
              </div>

              {/* Stats strip */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  borderTop: "1px solid #f1f5f9",
                  borderBottom: isOpen ? "1px solid #f1f5f9" : "none",
                  background: "#fafbff",
                }}
              >
                {[
                  { label: "Duration", val: `${b.duration || "?"} Days` },
                  {
                    label: "Travelers",
                    val: `${(b.adults || 0) + (b.children || 0)} pax`,
                  },
                  {
                    label: "Price",
                    val: b.quotedPrice
                      ? `₹${Number(b.quotedPrice).toLocaleString("en-IN")}`
                      : "TBD",
                  },
                ].map((x, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "10px 12px",
                      textAlign: "center",
                      borderRight: i < 2 ? "1px solid #f1f5f9" : "none",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.63rem",
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.07em",
                        marginBottom: 3,
                      }}
                    >
                      {x.label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.88rem",
                        fontWeight: 700,
                        color: "#0f172a",
                      }}
                    >
                      {x.val}
                    </div>
                  </div>
                ))}
              </div>

              {/* Expanded */}
              {isOpen && (
                <div
                  style={{
                    padding: "16px",
                    background: "#fafbff",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    {[
                      { label: "Booking ID", val: b.bookingId || b._id },
                      { label: "Confirmed On", val: fmt(b.updatedAt) },
                      { label: "Email", val: b.email },
                      { label: "Mobile", val: b.mobile },
                      { label: "Adults", val: b.adults ?? "—" },
                      { label: "Children", val: b.children ?? "—" },
                    ].map((x, i) => (
                      <div key={i} style={SS.infoCard}>
                        <div style={SS.infoLabel}>{x.label}</div>
                        <div style={{ ...SS.infoVal, fontSize: "0.82rem" }}>
                          {x.val}
                        </div>
                      </div>
                    ))}
                  </div>
                  {b.notes && (
                    <div
                      style={{
                        background: "#fffbeb",
                        border: "1px solid #fde68a",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontSize: "0.81rem",
                        color: "#78350f",
                      }}
                    >
                      📝 <strong>Note:</strong> {b.notes}
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div
                style={{
                  padding: "10px 16px",
                  background: "white",
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : b._id)}
                  style={btn("#3D52A0")}
                >
                  {isOpen ? "▲ Hide Details" : "▼ View Details"}
                </button>
                <button onClick={() => handlePrint(b)} style={btn("#0f172a")}>
                  🖨️ Print
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   TAB: ENQUIRIES
══════════════════════════════════════════════════════════════════════ */
export const EnquiriesTab = ({ user, token }) => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    packageName: "",
    destination: "",
    enquiryType: "Package Enquiry",
    message: "",
    startDate: "",
    duration: 1,
    adults: 1,
    children: 0,
    seniors: 0,
    budget: "",
    generatedBy: {
      fullName: user?.name || "",
      email: user?.email || "",
      phone: "",
    },
  });
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });

    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    (async () => {
      try {
        const tk = token || localStorage.getItem("token");
        console.log("token", tk);
        const url = user?.isAdmin ? "/bookings" : `/bookings/user/${user._id}`;
        const { data } = await api.get(url, {
          headers: { Authorization: `Bearer ${tk}` },
        });
        console.log("token", tk);
        if (data.success) setEnquiries(data.bookings || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("generatedBy.")) {
      const f = name.split(".")[1];
      setForm((p) => ({ ...p, generatedBy: { ...p.generatedBy, [f]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const validate = () => {
    const errs = {};
    if (!form.packageName.trim()) errs.packageName = "Required";
    if (!form.destination.trim()) errs.destination = "Required";
    if (!form.generatedBy.fullName.trim()) errs.fullName = "Required";
    if (!form.generatedBy.email.trim()) errs.email = "Required";
    if (!form.generatedBy.phone.trim()) errs.phone = "Required";
    if (!form.message.trim()) errs.message = "Required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const tk = token || localStorage.getItem("token");
      const payload = {
        ...form,
        userId: user._id,
        fullName: form.generatedBy.fullName,
        email: form.generatedBy.email,
        mobile: form.generatedBy.phone,
        Message: form.message,
        duration: Number(form.duration),
        adults: Number(form.adults),
        children: Number(form.children),
        seniors: Number(form.seniors),
        startDate: form.startDate
          ? new Date(form.startDate).toISOString()
          : null,
      };
      const res = await api.post("/bookings/create", payload, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      if (res.data.success) {
        setEnquiries((p) => [res.data.booking, ...p]);
        setShowForm(false);
        setForm({
          packageName: "",
          destination: "",
          enquiryType: "Package Enquiry",
          message: "",
          startDate: "",
          duration: 1,
          adults: 1,
          children: 0,
          seniors: 0,
          budget: "",
          generatedBy: {
            fullName: user?.name || "",
            email: user?.email || "",
            phone: "",
          },
        });
        setErrors({});
        showToast("Enquiry submitted successfully!");
      }
    } catch (e) {
      showToast("Failed to submit enquiry", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Spin />;

  const filtered = enquiries.filter((e) => {
    const q = search.toLowerCase();
    const matchSearch = [
      e.packageName,
      e.destination,
      e.fullName,
      e.bookingId,
    ].some((v) => (v || "").toLowerCase().includes(q));
    const matchFilter =
      filter === "all" || (e.status || "").toLowerCase() === filter;
    return matchSearch && matchFilter;
  });

  const eStats = {
    total: enquiries.length,
    pending: enquiries.filter(
      (e) => (e.status || "").toLowerCase() === "pending",
    ).length,
    confirmed: enquiries.filter(
      (e) => (e.status || "").toLowerCase() === "confirmed",
    ).length,
    responded: enquiries.filter(
      (e) => (e.status || "").toLowerCase() === "responded",
    ).length,
  };

  return (
    <div>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 9999,
            borderRadius: 12,
            padding: "12px 20px",
            color: "white",
            fontWeight: 600,
            fontSize: "0.83rem",
            background: toast.type === "error" ? "#ef4444" : "#22c55e",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            animation: "prof-slide-in 0.3s ease",
          }}
        >
          {toast.type === "error" ? "❌" : "✅"} {toast.msg}
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 16,
        }}
      >
        {[
          { label: "Total", val: eStats.total, color: "#3D52A0" },
          { label: "Pending", val: eStats.pending, color: "#d97706" },
          { label: "Responded", val: eStats.responded, color: "#0284c7" },
          { label: "Confirmed", val: eStats.confirmed, color: "#16a34a" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              background: "#fafbff",
              border: "1.5px solid #f1f5f9",
              borderRadius: 12,
              padding: "12px 8px",
              textAlign: "center",
            }}
          >
            <div
              style={{ fontSize: "1.3rem", fontWeight: 700, color: s.color }}
            >
              {s.val}
            </div>
            <div
              style={{
                fontSize: "0.63rem",
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginTop: 2,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative", flex: 1, minWidth: 140 }}>
          <span
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            }}
          >
            🔍
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries…"
            style={{ ...SS.input, paddingLeft: 32 }}
            onFocus={(e) => (e.target.style.borderColor = "#3D52A0")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1.5px solid #e2e8f0",
            fontSize: "0.81rem",
            fontFamily: "'Sora',sans-serif",
            outline: "none",
            background: "white",
            cursor: "pointer",
          }}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="responded">Responded</option>
          <option value="confirmed">Confirmed</option>
          <option value="closed">Closed</option>
        </select>
        <button
          onClick={() => setShowForm((v) => !v)}
          style={{
            ...btn(
              showForm ? "#f1f5f9" : "linear-gradient(135deg,#3D52A0,#6475C7)",
            ),
            color: showForm ? "#475569" : "white",
            borderRadius: 8,
            padding: "8px 14px",
          }}
        >
          {showForm ? "✕ Cancel" : "＋ New Enquiry"}
        </button>
      </div>

      {/* New Enquiry Form */}
      {showForm && (
        <div
          style={{
            background: "#fafbff",
            border: "1.5px solid #e2e8f0",
            borderRadius: 14,
            padding: "20px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontWeight: 700,
              color: "#0f172a",
              marginBottom: 16,
              fontSize: "0.93rem",
            }}
          >
            📝 Submit New Enquiry
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            {[
              {
                label: "Full Name *",
                name: "generatedBy.fullName",
                val: form.generatedBy.fullName,
                type: "text",
                err: errors.fullName,
              },
              {
                label: "Email *",
                name: "generatedBy.email",
                val: form.generatedBy.email,
                type: "email",
                err: errors.email,
              },
              {
                label: "Phone *",
                name: "generatedBy.phone",
                val: form.generatedBy.phone,
                type: "tel",
                err: errors.phone,
              },
              {
                label: "Destination *",
                name: "destination",
                val: form.destination,
                type: "text",
                err: errors.destination,
              },
            ].map((f, i) => (
              <div key={i}>
                <label style={SS.formLabel}>{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={f.val}
                  onChange={handleChange}
                  style={{
                    ...SS.input,
                    borderColor: f.err ? "#ef4444" : "#e2e8f0",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = f.err ? "#ef4444" : "#3D52A0")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = f.err ? "#ef4444" : "#e2e8f0")
                  }
                />
                {f.err && (
                  <span style={{ fontSize: "0.68rem", color: "#ef4444" }}>
                    {f.err}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label style={SS.formLabel}>Package *</label>
              <select
                name="packageName"
                value={form.packageName}
                onChange={handleChange}
                style={{
                  ...SS.input,
                  borderColor: errors.packageName ? "#ef4444" : "#e2e8f0",
                  background: "white",
                }}
              >
                <option value="">Select…</option>
                <option>CUSTOM</option>
                <option>FAMILY</option>
                <option>GROUP</option>
                <option>CITY</option>
                <option>ADVENTURE</option>
              </select>
              {errors.packageName && (
                <span style={{ fontSize: "0.68rem", color: "#ef4444" }}>
                  {errors.packageName}
                </span>
              )}
            </div>
            <div>
              <label style={SS.formLabel}>Enquiry Type</label>
              <select
                name="enquiryType"
                value={form.enquiryType}
                onChange={handleChange}
                style={{ ...SS.input, background: "white" }}
              >
                <option>Package Enquiry</option>
                <option>Custom Request</option>
                <option>Price Enquiry</option>
                <option>Availability Check</option>
                <option>General Query</option>
              </select>
            </div>
            <div>
              <label style={SS.formLabel}>Adults</label>
              <input
                type="number"
                name="adults"
                value={form.adults}
                min={1}
                max={20}
                onChange={handleChange}
                style={SS.input}
              />
            </div>
            <div>
              <label style={SS.formLabel}>Children</label>
              <input
                type="number"
                name="children"
                value={form.children}
                min={0}
                max={20}
                onChange={handleChange}
                style={SS.input}
              />
            </div>
            <div>
              <label style={SS.formLabel}>Seniors (60+)</label>
              <input
                type="number"
                name="seniors"
                value={form.seniors}
                min={0}
                max={20}
                onChange={handleChange}
                style={SS.input}
              />
            </div>
            <div>
              <label style={SS.formLabel}>Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={form.duration}
                min={1}
                onChange={handleChange}
                style={SS.input}
              />
            </div>
            <div>
              <label style={SS.formLabel}>Start Date</label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                style={SS.input}
              />
            </div>
            <div>
              <label style={SS.formLabel}>Budget (₹)</label>
              <input
                type="number"
                name="budget"
                value={form.budget}
                min={0}
                step={1000}
                onChange={handleChange}
                placeholder="50000"
                style={SS.input}
              />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={SS.formLabel}>Message *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your requirements…"
              style={{
                ...SS.input,
                resize: "vertical",
                borderColor: errors.message ? "#ef4444" : "#e2e8f0",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = errors.message
                  ? "#ef4444"
                  : "#3D52A0")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = errors.message
                  ? "#ef4444"
                  : "#e2e8f0")
              }
            />
            {errors.message && (
              <span style={{ fontSize: "0.68rem", color: "#ef4444" }}>
                {errors.message}
              </span>
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              onClick={() => {
                setShowForm(false);
                setErrors({});
              }}
              style={{
                padding: "8px 20px",
                borderRadius: 50,
                border: "1.5px solid #e2e8f0",
                background: "white",
                color: "#475569",
                fontWeight: 600,
                fontSize: "0.83rem",
                cursor: "pointer",
                fontFamily: "'Sora',sans-serif",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                ...btn(
                  submitting
                    ? "#94a3b8"
                    : "linear-gradient(135deg,#3D52A0,#6475C7)",
                ),
                padding: "8px 22px",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {submitting ? (
                <>
                  <div
                    style={{
                      width: 13,
                      height: 13,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      animation: "prof-spin 0.8s linear infinite",
                    }}
                  />
                  Submitting…
                </>
              ) : (
                "📤 Submit Enquiry"
              )}
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <Empty
          icon="📋"
          title="No enquiries found"
          sub="Submit your first enquiry to get started"
          action="＋ New Enquiry"
          onAction={() => setShowForm(true)}
        />
      ) : (
        filtered.map((enq) => {
          const isOpen = expanded === enq._id;
          return (
            <div
              key={enq._id}
              style={{
                borderRadius: 14,
                border: "1.5px solid #e8edf5",
                marginBottom: 12,
                overflow: "hidden",
                background: "white",
                boxShadow: "0 2px 8px rgba(61,82,160,0.04)",
              }}
            >
              <div
                style={{
                  padding: "13px 16px",
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    flexShrink: 0,
                    background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                  }}
                >
                  📦
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      color: "#0f172a",
                      marginBottom: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {enq.packageName || "Untitled Package"}
                  </div>
                  <div style={{ fontSize: "0.73rem", color: "#94a3b8" }}>
                    📍 {enq.destination} &nbsp;·&nbsp; {enq.enquiryType}{" "}
                    &nbsp;·&nbsp; {fmt(enq.createdAt)}
                  </div>
                </div>
                <Badge status={enq.status} />
              </div>

              {isOpen && (
                <div
                  style={{
                    borderTop: "1px solid #f1f5f9",
                    padding: "14px 16px",
                    background: "#fafbff",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: 10,
                      marginBottom: 12,
                    }}
                  >
                    {[
                      { label: "Booking ID", val: enq.bookingId || "N/A" },
                      { label: "Duration", val: `${enq.duration} days` },
                      {
                        label: "Travelers",
                        val: `${(enq.adults || 0) + (enq.children || 0) + (enq.seniors || 0)} pax`,
                      },
                      {
                        label: "Budget",
                        val: enq.budget
                          ? `₹${Number(enq.budget).toLocaleString("en-IN")}`
                          : "N/A",
                      },
                      { label: "Start Date", val: fmt(enq.startDate) },
                      { label: "Mobile", val: enq.mobile || "N/A" },
                    ].map((x, i) => (
                      <div key={i} style={SS.infoCard}>
                        <div style={SS.infoLabel}>{x.label}</div>
                        <div style={{ ...SS.infoVal, fontSize: "0.8rem" }}>
                          {x.val}
                        </div>
                      </div>
                    ))}
                  </div>
                  {enq.message && (
                    <div
                      style={{
                        background: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontSize: "0.81rem",
                        color: "#475569",
                        marginBottom: 10,
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ fontWeight: 700, color: "#0f172a" }}>
                        Message:{" "}
                      </span>
                      {enq.message}
                    </div>
                  )}
                  {enq.response && (
                    <div
                      style={{
                        background: "#eff6ff",
                        border: "1px solid #bfdbfe",
                        borderRadius: 10,
                        padding: "10px 14px",
                        fontSize: "0.81rem",
                        color: "#1e40af",
                        lineHeight: 1.6,
                      }}
                    >
                      <span style={{ fontWeight: 700 }}>Our Response: </span>
                      {enq.response}
                    </div>
                  )}
                  {enq.seniors > 0 && (
                    <div
                      style={{
                        marginTop: 10,
                        background: "#fffbeb",
                        border: "1px solid #fde68a",
                        borderRadius: 10,
                        padding: "9px 14px",
                        fontSize: "0.77rem",
                        color: "#92400e",
                      }}
                    >
                      👴 {enq.seniors} senior citizen
                      {enq.seniors > 1 ? "s" : ""} — special assistance may be
                      required
                    </div>
                  )}
                </div>
              )}

              <div
                style={{
                  padding: "10px 16px",
                  background: "white",
                  borderTop: "1px solid #f1f5f9",
                }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : enq._id)}
                  style={btn("#3D52A0")}
                >
                  {isOpen ? "▲ Hide Details" : "▼ View Details"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   TAB: SAVED PACKAGES
══════════════════════════════════════════════════════════════════════ */
export const SavedTab = ({ user, token }) => {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const tk = token || localStorage.getItem("token");
        const res = await api.get(`/favourites/${user._id}`, {
          headers: { Authorization: `Bearer ${tk}` },
        });
        setFavs(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setFavs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, token]);

  const handleRemove = async (id) => {
    try {
      const tk = token || localStorage.getItem("token");
      await api.delete(`/favourites/remove/${id}`, {
        headers: { Authorization: `Bearer ${tk}` },
      });
      setFavs((p) => p.filter((f) => f._id !== id && f.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <Spin />;

  const filtered = favs.filter((f) =>
    (f.title || f.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div style={{ margin: "25px 25px 0px 25px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 16,
          margin: 10,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 700,
              color: "#0f172a",
            }}
          >
            Saved Packages
          </h3>
          <p
            style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#94a3b8" }}
          >
            Your wishlist of travel packages
          </p>
        </div>
        <div
          style={{
            background: "#fff0f3",
            color: "#e11d48",
            borderRadius: 20,
            padding: "4px 14px",
            fontSize: "0.74rem",
            fontWeight: 700,
          }}
        >
          {filtered.length} saved
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: 16 }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search saved packages…"
          style={{ ...SS.input, paddingLeft: 36 }}
          onFocus={(e) => (e.target.style.borderColor = "#3D52A0")}
          onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
        />
      </div>

      {filtered.length === 0 ? (
        <Empty
          icon="❤️"
          title="No saved packages yet"
          sub="Tap the heart icon on any package to save it here"
        />
      ) : (
        filtered.map((pkg) => (
          <div
            key={pkg._id || pkg.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "14px 16px",
              borderRadius: 14,
              border: "1.5px solid #f1f5f9",
              background: "white",
              marginBottom: 12,
              transition: "box-shadow 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.boxShadow =
                "0 4px 16px rgba(61,82,160,0.08)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            {pkg.img ? (
              <img
                src={pkg.img}
                alt={pkg.title}
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 12,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : (
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 12,
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#eef2ff,#e0e7ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.6rem",
                }}
              >
                🌏
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: "0.92rem",
                  color: "#0f172a",
                  marginBottom: 3,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {pkg.title || pkg.name || "Package"}
              </div>
              <div
                style={{
                  fontSize: "0.73rem",
                  color: "#94a3b8",
                  marginBottom: 5,
                }}
              >
                {pkg.category || "Travel Package"}
                {pkg.rating ? ` · ⭐ ${pkg.rating}` : ""}
                {pkg.duration ? ` · ${pkg.duration} days` : ""}
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#3D52A0",
                }}
              >
                {pkg.price
                  ? `₹${Number(pkg.price).toLocaleString("en-IN")}`
                  : "Price on request"}
              </div>
            </div>
            <button
              onClick={() => handleRemove(pkg._id || pkg.id)}
              title="Remove"
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                flexShrink: 0,
                border: "1.5px solid #fee2e2",
                background: "#fff5f5",
                color: "#ef4444",
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fee2e2")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#fff5f5")
              }
            >
              ✕
            </button>
          </div>
        ))
      )}
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   TAB: SETTINGS
══════════════════════════════════════════════════════════════════════ */
export const SettingsTab = ({ user, logout, onClose }) => {
  const [toggles, setToggles] = useState({
    pushNotif: true,
    emailNews: true,
    smsAlerts: false,
  });
  const [saved, setSaved] = useState(false);

  const Toggle = ({ k }) => (
    <button
      onClick={() => setToggles((p) => ({ ...p, [k]: !p[k] }))}
      style={{
        width: 44,
        height: 24,
        borderRadius: 12,
        border: "none",
        cursor: "pointer",
        background: toggles[k] ? "#3D52A0" : "#e2e8f0",
        position: "relative",
        flexShrink: 0,
        transition: "background 0.2s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: toggles[k] ? "23px" : "3px",
          width: 18,
          height: 18,
          borderRadius: "50%",
          background: "white",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );

  return (
    <div style={{ margin: "25px 25px 0px 25px" }}>
      {/* Notifications */}
      <p style={SS.sectionTitle}>Notification Preferences</p>
      <div style={{ marginBottom: 28 }}>
        {[
          {
            k: "pushNotif",
            icon: "🔔",
            label: "Push Notifications",
            desc: "Deals, booking updates & offers",
          },
          {
            k: "emailNews",
            icon: "📧",
            label: "Email Newsletter",
            desc: "Weekly travel inspiration",
          },
          {
            k: "smsAlerts",
            icon: "📱",
            label: "SMS Alerts",
            desc: "Booking confirmations only",
          },
        ].map((s, i, arr) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 0",
              borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "#f0f4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1rem",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div>
                <div
                  style={{
                    fontSize: "0.87rem",
                    fontWeight: 500,
                    color: "#0f172a",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#94a3b8",
                    marginTop: 2,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            </div>
            <Toggle k={s.k} />
          </div>
        ))}
      </div>

      {/* Account */}
      <p style={SS.sectionTitle}>Account Settings</p>
      <div style={{ marginBottom: 28 }}>
        {[
          {
            icon: "🔒",
            label: "Change Password",
            desc: "Update your login password",
            action: () => alert("Coming soon"),
          },
          {
            icon: "📞",
            label: "Update Phone",
            desc: user?.phone || "Not added",
            action: () => alert("Coming soon"),
          },
          {
            icon: "📍",
            label: "Update City",
            desc: user?.city || "Not added",
            action: () => alert("Coming soon"),
          },
          {
            icon: "🌐",
            label: "Nationality",
            desc: user?.nationality || "Indian",
            action: () => alert("Coming soon"),
          },
        ].map((s, i, arr) => (
          <button
            key={i}
            onClick={s.action}
            style={{
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 0",
              background: "none",
              border: "none",
              borderBottom: i < arr.length - 1 ? "1px solid #f8fafc" : "none",
              cursor: "pointer",
              fontFamily: "'Sora',sans-serif",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "#f0f4ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.95rem",
                  flexShrink: 0,
                }}
              >
                {s.icon}
              </div>
              <div style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontSize: "0.87rem",
                    fontWeight: 500,
                    color: "#0f172a",
                  }}
                >
                  {s.label}
                </div>
                <div
                  style={{
                    fontSize: "0.72rem",
                    color: "#94a3b8",
                    marginTop: 2,
                  }}
                >
                  {s.desc}
                </div>
              </div>
            </div>
            <span style={{ color: "#94a3b8", fontSize: "1.1rem" }}>›</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 2500);
        }}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: 50,
          border: "none",
          marginBottom: 10,
          background: saved
            ? "#dcfce7"
            : "linear-gradient(135deg,#3D52A0,#6475C7)",
          color: saved ? "#166534" : "white",
          fontWeight: 600,
          fontSize: "0.87rem",
          cursor: "pointer",
          fontFamily: "'Sora',sans-serif",
          transition: "all 0.2s",
        }}
      >
        {saved ? "✓ Preferences Saved" : "Save Preferences"}
      </button>

      <button
        onClick={() => {
          logout?.();
          onClose?.();
        }}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: 50,
          border: "1.5px solid #fecdd3",
          background: "white",
          color: "#ef4444",
          fontWeight: 600,
          fontSize: "0.87rem",
          cursor: "pointer",
          fontFamily: "'Sora',sans-serif",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
        }}
      >
        🚪 Sign Out
      </button>

      <div
        style={{
          textAlign: "center",
          marginTop: 20,
          fontSize: "0.69rem",
          color: "#94a3b8",
        }}
      >
        DesiVDesi Tours &nbsp;·&nbsp;
        <Link
          to="/privacy"
          style={{ color: "#3D52A0", textDecoration: "none" }}
        >
          Privacy
        </Link>{" "}
        &nbsp;·&nbsp;
        <Link to="/terms" style={{ color: "#3D52A0", textDecoration: "none" }}>
          Terms
        </Link>{" "}
        &nbsp;·&nbsp;
        <Link
          to="/support"
          style={{ color: "#3D52A0", textDecoration: "none" }}
        >
          Support
        </Link>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════
   STATS HOOK
══════════════════════════════════════════════════════════════════════ */
export const useStats = (user, token) => {
  const [stats, setStats] = useState({ bookings: 0, enquiries: 0, saved: 0 });
  useEffect(() => {
    if (!user) return;
    const tk = token || localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${tk}` };
    Promise.allSettled([
      // api.get(user.isAdmin ? "/bookings/confirmed" : "/bookings/confirmed-user", { headers }),
      // api.get(user.isAdmin ? "/bookings" : `/bookings/user/${user._id}`, { headers }),
      api.get(`/favourites/${user._id}`, { headers }),
      console.log("useeId", user._id),
    ]).then(([b, e, f]) => {
      setStats({
        bookings:
          b.status === "fulfilled" && b.value.data.success
            ? (b.value.data.bookings || []).length
            : 0,
        enquiries:
          e.status === "fulfilled" && e.value.data.success
            ? (e.value.data.bookings || []).length
            : 0,
        saved:
          f.status === "fulfilled" && Array.isArray(f.value.data)
            ? f.value.data.length
            : 0,
      });
    });
  }, [user, token]);
  return stats;
};

/* ══════════════════════════════════════════════════════════════════════
   MAIN PROFILE COMPONENT
══════════════════════════════════════════════════════════════════════ */
export const Profile = ({ onClose }) => {
  const { user, logout, token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("overview");
  const stats = useStats(user, token);

  const displayName = user?.name || user?.email?.split("@")[0] || "Traveller";
  const displayEmail = user?.email || "";
  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const heroStats = [
    { label: "Trips", val: stats.bookings },
    { label: "Enquiries", val: stats.enquiries },
    { label: "Saved", val: stats.saved },
    { label: "Points", val: "2,840" },
  ];

  /* switch-based render guarantees React re-mounts on tab change */
  const renderTab = () => {
    switch (activeTab) {
      case "bookings":
        return <BookingsTab user={user} token={token} />;
      case "enquiries":
        return <EnquiriesTab user={user} token={token} />;
      case "saved":
        return (
          <div style={{ marginRight: "25px" }}>
            {" "}
            <SavedTab user={user} token={token} />
          </div>
        );
      case "settings":
        return <SettingsTab user={user} logout={logout} onClose={onClose} />;
      default:
        return (
          <OverviewTab user={user} stats={stats} onTabChange={setActiveTab} />
        );
    }
  };

  return (
    <>
      <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
                @keyframes prof-fade     { from{opacity:0}                                          to{opacity:1} }
                @keyframes prof-up       { from{transform:translateY(24px) scale(0.98);opacity:0}   to{transform:translateY(0) scale(1);opacity:1} }
                @keyframes prof-spin     { to{transform:rotate(360deg)} }
                @keyframes prof-slide-in { from{transform:translateX(20px);opacity:0}               to{transform:translateX(0);opacity:1} }
                .prof-scroll::-webkit-scrollbar        { width:4px }
                .prof-scroll::-webkit-scrollbar-thumb  { background:#e2e8f0; border-radius:2px }
                .prof-tabs::-webkit-scrollbar           { display:none }
            `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 3000,
          background: "rgba(7,12,28,0.72)",
          backdropFilter: "blur(12px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.25rem",
          animation: "prof-fade 0.25s ease",
          fontFamily: "'Sora',sans-serif",
        }}
      >
        {/* Modal */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 800,
            maxHeight: "92vh",
            background: "white",
            borderRadius: 24,
            boxShadow:
              "0 40px 80px rgba(15,23,42,0.22),0 8px 32px rgba(15,23,42,0.1)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "prof-up 0.32s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {/* Hero */}
          <div
            style={{
              background:
                "linear-gradient(135deg,#0f172a 0%,#1e3a5f 55%,#3D52A0 100%)",
              padding: "22px 26px 0",
              flexShrink: 0,
              position: "relative",
              borderBottom: "1px solid rgba(201,168,76,0.15)",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.04,
                pointerEvents: "none",
                backgroundImage:
                  "radial-gradient(circle,white 1px,transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                color: "white",
                fontSize: "1rem",
                cursor: "pointer",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                fontFamily: "'Sora',sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.22)";
                e.currentTarget.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                e.currentTarget.style.transform = "rotate(0deg)";
              }}
            >
              ✕
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 18,
                position: "relative",
                zIndex: 1,
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  flexShrink: 0,
                  background: "linear-gradient(135deg,#3D52A0,#6475C7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.4rem",
                  fontWeight: 600,
                  color: "white",
                  border: "3px solid rgba(201,168,76,0.45)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
                  overflow: "hidden",
                }}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={displayName}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  initials
                )}
              </div>
              <div style={{ paddingBottom: 6 }}>
                <div
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 600,
                    color: "white",
                    lineHeight: 1.2,
                  }}
                >
                  {displayName}
                </div>
                <div
                  style={{
                    fontSize: "0.74rem",
                    color: "rgba(255,255,255,0.5)",
                    marginTop: 3,
                  }}
                >
                  {displayEmail}
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 8,
                    background: "rgba(201,168,76,0.12)",
                    border: "1px solid rgba(201,168,76,0.3)",
                    borderRadius: 20,
                    padding: "3px 11px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.63rem",
                      color: "#C9A84C",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    ✦ Explorer Member
                  </span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4,1fr)",
                marginTop: 20,
                borderTop: "1px solid rgba(255,255,255,0.07)",
                position: "relative",
                zIndex: 1,
              }}
            >
              {heroStats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    padding: "12px 0",
                    textAlign: "center",
                    borderRight:
                      i < 3 ? "1px solid rgba(255,255,255,0.07)" : "none",
                  }}
                >
                  <div
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "white",
                    }}
                  >
                    {s.val}
                  </div>
                  <div
                    style={{
                      fontSize: "0.62rem",
                      color: "rgba(255,255,255,0.4)",
                      textTransform: "uppercase",
                      letterSpacing: "0.07em",
                      marginTop: 2,
                    }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tab bar */}
          <div
            className="prof-tabs"
            style={{
              display: "flex",
              padding: "0 20px",
              background: "white",
              borderBottom: "1px solid #f1f5f9",
              flexShrink: 0,
              overflowX: "auto",
            }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveTab(t.id);
                }}
                style={{
                  padding: "13px 16px",
                  fontSize: "0.83rem",
                  fontWeight: activeTab === t.id ? 600 : 500,
                  color: activeTab === t.id ? "#3D52A0" : "#94a3b8",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Sora',sans-serif",
                  whiteSpace: "nowrap",
                  transition: "color 0.18s",
                  outline: "none",
                  borderBottom:
                    activeTab === t.id
                      ? "2px solid #3D52A0"
                      : "2px solid transparent",
                }}
              >
                <span style={{ marginRight: 5 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* Body — minHeight:0 is critical for scroll inside flex column */}
          <div
            className="prof-scroll"
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              padding: "22px 26px",
            }}
          >
            {renderTab()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
