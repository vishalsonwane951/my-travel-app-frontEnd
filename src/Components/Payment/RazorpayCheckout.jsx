import React, { useState } from "react";
import { paymentApi } from "../../Services/adminApi.js";

// Drop-in Razorpay checkout button.
//
// Usage (booking payment — creates its own order internally):
//   <RazorpayCheckout
//     bookingId={booking._id}
//     amount={booking.quotedPrice}
//     type="full"                 // 'full' | 'advance' | 'emi_installment'
//     customerName={booking.fullName}
//     customerEmail={booking.email}
//     customerPhone={booking.mobile}
//     onSuccess={(payment) => { ...refresh booking status... }}
//   />
//
// Usage (any other purchase that already created its own order server-side,
// e.g. a gift card via POST /gift-cards/purchase):
//   <RazorpayCheckout
//     prebuiltOrder={{ orderId, amount, currency, keyId }}
//     description="Gift card purchase"
//     customerName={...} customerEmail={...} customerPhone={...}
//     onSuccess={...}
//   />
//
// Loads the Razorpay Checkout script on demand, creates a server-side order
// (unless prebuiltOrder is supplied), opens the Razorpay modal, and verifies
// the signature server-side on success — always against the same generic
// /api/payments/verify endpoint, which settles bookings or gift cards alike.
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const RazorpayCheckout = ({
  bookingId, amount, type = "full", emiPlan,
  prebuiltOrder, description,
  customerName, customerEmail, customerPhone,
  onSuccess, onError, label,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");
    setLoading(true);
    try {
      const scriptOk = await loadRazorpayScript();
      if (!scriptOk) throw new Error("Could not load the Razorpay checkout script. Check your connection.");

      const order = prebuiltOrder || (await paymentApi.post("/create-order", { bookingId, amount, type, emiPlan })).data;

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: "Desivdesi",
        description: description || (type === "advance" ? "Advance payment" : type === "emi_installment" ? "EMI installment" : "Trip payment"),
        prefill: { name: customerName, email: customerEmail, contact: customerPhone },
        theme: { color: "#4f7cff" },
        handler: async (response) => {
          try {
            const { data } = await paymentApi.post("/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            onSuccess?.(data.payment);
          } catch (err) {
            const msg = err.response?.data?.message || "Payment verification failed.";
            setError(msg);
            onError?.(msg);
          }
        },
        modal: { ondismiss: () => setLoading(false) },
      });

      rzp.on("payment.failed", (resp) => {
        const msg = resp.error?.description || "Payment failed.";
        setError(msg);
        onError?.(msg);
      });

      rzp.open();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Could not start payment.";
      setError(msg);
      onError?.(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handlePay} disabled={loading} style={{
        background: "#4f7cff", color: "#fff", border: "none", padding: "10px 20px",
        borderRadius: 6, cursor: loading ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 600,
      }}>
        {loading ? "Processing…" : label || `Pay ₹${amount}`}
      </button>
      {error && <div style={{ color: "#a12626", fontSize: 13, marginTop: 6 }}>{error}</div>}
    </div>
  );
};

export default RazorpayCheckout;
