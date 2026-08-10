import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCurrency } from "../../Context/CurrencyContext.jsx";
import "./TripWallet.css";

const api = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const TripWallet = () => {
  const { bookingId } = useParams();
  const { format } = useCurrency();
  const [booking, setBooking] = useState(null);
  const [pkg, setPkg] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [bookingRes, paymentsRes] = await Promise.all([
          api.get(`/bookings/${bookingId}`),
          api.get(`/payments/booking/${bookingId}`),
        ]);
        setBooking(bookingRes.data.booking || bookingRes.data);
        setPayments(paymentsRes.data.payments || []);

        const pkgId = (bookingRes.data.booking || bookingRes.data).packageId;
        if (pkgId) {
          const pkgRes = await api.get(`/packages/${pkgId}`);
          setPkg(pkgRes.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Could not load this trip.");
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId]);

  if (loading) return <div style={{ padding: 60, textAlign: "center" }}>Loading your trip…</div>;
  if (error) return <div style={{ padding: 60, textAlign: "center", color: "#a12626" }}>{error}</div>;
  if (!booking) return null;

  const totalPaid = payments.filter((p) => p.status === "success").reduce((s, p) => s + p.amount, 0);
  const balanceDue = Math.max(0, (booking.finalAmount || booking.quotedPrice || 0) - totalPaid);

  return (
    <div className="wallet-page">
      <div className="wallet-header">
        <h2>{booking.packageName || booking.destination}</h2>
        <span className={`wallet-status wallet-status-${booking.status}`}>{booking.status}</span>
      </div>
      <p className="wallet-sub">
        {booking.destination} · {booking.adults || booking.groupSize || 1} traveler(s)
        {booking.startDate && <> · {new Date(booking.startDate).toLocaleDateString("en-IN")}</>}
      </p>

      <div className="wallet-grid">
        <div className="wallet-card">
          <h3>Payment Summary</h3>
          <div className="wallet-row"><span>Total Amount</span><span>{format(booking.finalAmount || booking.quotedPrice || 0)}</span></div>
          <div className="wallet-row"><span>Paid</span><span>{format(totalPaid)}</span></div>
          <div className="wallet-row total"><span>Balance Due</span><span>{format(balanceDue)}</span></div>
          {booking.addOnsTotal > 0 && <div className="wallet-row"><span>Add-ons included</span><span>{format(booking.addOnsTotal)}</span></div>}
          {booking.couponDiscount > 0 && <div className="wallet-row"><span>Coupon savings</span><span>-{format(booking.couponDiscount)}</span></div>}
        </div>

        <div className="wallet-card">
          <h3>Payment History</h3>
          {payments.length === 0 && <p style={{ color: "#888" }}>No payments recorded yet.</p>}
          {payments.map((p) => (
            <div key={p._id} className="wallet-row">
              <span>{new Date(p.createdAt).toLocaleDateString("en-IN")} · {p.type}</span>
              <span className={`wallet-pay-status wallet-pay-${p.status}`}>{format(p.amount)} — {p.status}</span>
            </div>
          ))}
        </div>
      </div>

      {booking.addOns?.length > 0 && (
        <div className="wallet-card" style={{ marginTop: 16 }}>
          <h3>Your Add-ons</h3>
          {booking.addOns.map((a, i) => (
            <div key={i} className="wallet-row"><span>{a.name} × {a.quantity}</span><span>{format(a.price * a.quantity)}</span></div>
          ))}
        </div>
      )}

      {pkg?.itinerary?.length > 0 && (
        <div className="wallet-card" style={{ marginTop: 16 }}>
          <h3>Day-wise Itinerary</h3>
          {pkg.itinerary.map((day, i) => (
            <div key={i} className="wallet-day">
              <div className="wallet-day-num">Day {day.day}</div>
              <div>
                <strong>{day.title}</strong>
                <p style={{ margin: "4px 0", color: "#555", fontSize: 13.5 }}>{day.description}</p>
                {day.meals && <span className="wallet-meals">🍽 {day.meals}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {booking.status === "pending" && (
        <div className="wallet-card wallet-cta" style={{ marginTop: 16 }}>
          <p>This trip isn't confirmed yet — complete payment to lock in your dates and price.</p>
        </div>
      )}
    </div>
  );
};

export default TripWallet;
