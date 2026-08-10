import React, { useState } from "react";
import axios from "axios";
import RazorpayCheckout from "../../Components/Payment/RazorpayCheckout.jsx";
import { useCurrency } from "../../Context/CurrencyContext.jsx";

const api = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const PRESET_AMOUNTS = [500, 1000, 2500, 5000, 10000];

const GiftCardPurchase = () => {
  const { format } = useCurrency();
  const [amount, setAmount] = useState(1000);
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [order, setOrder] = useState(null);
  const [purchased, setPurchased] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const startPurchase = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/gift-cards/purchase", {
        amount, recipientName, recipientEmail, message,
      });
      setOrder({ orderId: data.orderId, amount: data.amount, currency: data.currency, keyId: data.keyId });
    } catch (err) {
      setError(err.response?.data?.message || "Could not start the gift card purchase.");
    } finally {
      setLoading(false);
    }
  };

  if (purchased) {
    return (
      <div style={{ maxWidth: 480, margin: "60px auto", textAlign: "center", fontFamily: "Arial, sans-serif" }}>
        <h2>Gift Card Activated!</h2>
        <p>Value: {format(purchased.amount)}</p>
        {recipientEmail && <p style={{ color: "#888" }}>We've emailed the code to {recipientEmail}.</p>}
        {!recipientEmail && <p style={{ color: "#888" }}>Check your account's Gift Cards for the code.</p>}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 480, margin: "40px auto", padding: "0 20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Send a Desivdesi Gift Card</h2>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "14px 0" }}>
        {PRESET_AMOUNTS.map((a) => (
          <button key={a} onClick={() => setAmount(a)} style={{
            padding: "8px 16px", borderRadius: 20, border: amount === a ? "2px solid #4f7cff" : "1px solid #ddd",
            background: amount === a ? "#eef1fb" : "#fff", cursor: "pointer",
          }}>{format(a)}</button>
        ))}
      </div>
      <input type="number" min={100} value={amount} onChange={(e) => setAmount(Number(e.target.value))}
        style={{ width: "100%", padding: 10, border: "1px solid #dcdfe8", borderRadius: 6, marginBottom: 14 }} />

      <h4>Recipient (optional — leave blank to gift yourself)</h4>
      <input placeholder="Recipient name" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 8, border: "1px solid #dcdfe8", borderRadius: 6 }} />
      <input placeholder="Recipient email" value={recipientEmail} onChange={(e) => setRecipientEmail(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 8, border: "1px solid #dcdfe8", borderRadius: 6 }} />
      <textarea placeholder="Personal message" value={message} onChange={(e) => setMessage(e.target.value)} rows={2} style={{ width: "100%", padding: 10, marginBottom: 14, border: "1px solid #dcdfe8", borderRadius: 6 }} />

      <h4>Your Details</h4>
      <input placeholder="Your name" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 8, border: "1px solid #dcdfe8", borderRadius: 6 }} />
      <input placeholder="Your email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 8, border: "1px solid #dcdfe8", borderRadius: 6 }} />
      <input placeholder="Your phone" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} style={{ width: "100%", padding: 10, marginBottom: 14, border: "1px solid #dcdfe8", borderRadius: 6 }} />

      {error && <p style={{ color: "#a12626" }}>{error}</p>}

      {!order ? (
        <button onClick={startPurchase} disabled={loading} style={{ width: "100%", background: "#4f7cff", color: "#fff", border: "none", padding: 12, borderRadius: 8, cursor: "pointer" }}>
          {loading ? "Preparing…" : `Buy Gift Card — ${format(amount)}`}
        </button>
      ) : (
        <RazorpayCheckout
          prebuiltOrder={order}
          description="Desivdesi gift card purchase"
          customerName={buyerName}
          customerEmail={buyerEmail}
          customerPhone={buyerPhone}
          label={`Pay ${format(amount)}`}
          onSuccess={() => setPurchased({ amount })}
        />
      )}
    </div>
  );
};

export default GiftCardPurchase;
