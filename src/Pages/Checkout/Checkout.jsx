import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCurrency } from "../../Context/CurrencyContext.jsx";
import RazorpayCheckout from "../../Components/Payment/RazorpayCheckout.jsx";
import "./Checkout.css";

const checkoutApi = axios.create({ baseURL: "http://localhost:5000/api", withCredentials: true });
checkoutApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const Checkout = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  const { format } = useCurrency();

  const [pkg, setPkg] = useState(null);
  const [addOnCatalog, setAddOnCatalog] = useState([]);
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [travelers, setTravelers] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [quote, setQuote] = useState(null);
  const [quoteLoading, setQuoteLoading] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponMsg, setCouponMsg] = useState("");
  const [giftCardCode, setGiftCardCode] = useState("");
  const [giftCardBalance, setGiftCardBalance] = useState(null);
  const [redeemPoints, setRedeemPoints] = useState(0);
  const [loyalty, setLoyalty] = useState(null);

  const [bookingType, setBookingType] = useState("individual");
  const [companyName, setCompanyName] = useState("");
  const [groupSize, setGroupSize] = useState("");

  const [contact, setContact] = useState({ fullName: "", email: "", mobile: "" });
  const [booking, setBooking] = useState(null);
  const [step, setStep] = useState(1); // 1: configure, 2: pay
  const [error, setError] = useState("");

  useEffect(() => {
    checkoutApi.get(`/packages/${packageId}`).then((r) => setPkg(r.data)).catch(() => {});
    checkoutApi.get("/addons").then((r) => setAddOnCatalog(r.data.addOns)).catch(() => {});
    const token = localStorage.getItem("token");
    if (token) {
      checkoutApi.get("/loyalty/me").then((r) => setLoyalty(r.data.loyalty)).catch(() => {});
    }
  }, [packageId]);

  const refreshQuote = async () => {
    setQuoteLoading(true);
    try {
      const { data } = await checkoutApi.post("/checkout/quote", {
        packageId, travelDate, travelers, addOnIds: selectedAddOns,
      });
      setQuote(data.quote);
    } catch (err) {
      setError(err.response?.data?.message || "Could not fetch a price quote.");
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => { if (pkg) refreshQuote(); /* eslint-disable-next-line */ }, [pkg, travelers, travelDate, selectedAddOns]);

  const toggleAddOn = (id) => {
    setSelectedAddOns((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const checkGiftCard = async () => {
    setError("");
    try {
      const { data } = await checkoutApi.post("/gift-cards/check", { code: giftCardCode });
      setGiftCardBalance(data.balance);
    } catch (err) {
      setGiftCardBalance(null);
      setError(err.response?.data?.message || "Invalid gift card.");
    }
  };

  const applyCoupon = async () => {
    setCouponMsg(couponCode ? "Coupon will be validated when you confirm your booking." : "");
  };

  const confirmBooking = async () => {
    setError("");
    if (!contact.fullName || !contact.email || !contact.mobile) {
      setError("Please fill in your name, email and mobile number.");
      return;
    }
    try {
      const { data } = await checkoutApi.post("/checkout/book", {
        packageId, travelDate, travelers, addOnIds: selectedAddOns,
        ...contact,
        couponCode: couponCode || undefined,
        giftCardCode: giftCardCode || undefined,
        loyaltyPointsToRedeem: Number(redeemPoints) || 0,
        bookingType, companyName, groupSize,
      });
      setBooking(data.booking);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create the booking.");
    }
  };

  if (!pkg) return <div style={{ padding: 60, textAlign: "center" }}>Loading package…</div>;

  return (
    <div className="checkout-page">
      <div className="checkout-main">
        <h2>{pkg.title}</h2>
        <p className="checkout-sub">{pkg.location}</p>

        {step === 1 && (
          <>
            <div className="checkout-section">
              <h3>Trip Details</h3>
              <div className="checkout-row">
                <label>Travel Date</label>
                <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} />
              </div>
              <div className="checkout-row">
                <label>Travelers</label>
                <input type="number" min={1} value={travelers} onChange={(e) => setTravelers(Number(e.target.value))} />
              </div>
              <div className="checkout-row">
                <label>Booking Type</label>
                <select value={bookingType} onChange={(e) => setBookingType(e.target.value)}>
                  <option value="individual">Individual</option>
                  <option value="group">Group</option>
                  <option value="corporate">Corporate</option>
                </select>
              </div>
              {bookingType !== "individual" && (
                <>
                  <div className="checkout-row"><label>Company / Group Name</label><input value={companyName} onChange={(e) => setCompanyName(e.target.value)} /></div>
                  {bookingType === "group" && <div className="checkout-row"><label>Group Size</label><input type="number" value={groupSize} onChange={(e) => setGroupSize(e.target.value)} /></div>}
                </>
              )}
            </div>

            <div className="checkout-section">
              <h3>Add-ons</h3>
              {addOnCatalog.length === 0 && <p style={{ color: "#888" }}>No add-ons available right now.</p>}
              {addOnCatalog.map((a) => (
                <label key={a._id} className="checkout-addon-row">
                  <input type="checkbox" checked={selectedAddOns.includes(a._id)} onChange={() => toggleAddOn(a._id)} />
                  <span>{a.name} — {format(a.price)} {a.priceUnit === "per_person" ? "/ person" : "/ booking"}</span>
                </label>
              ))}
            </div>

            <div className="checkout-section">
              <h3>Coupon & Gift Card</h3>
              <div className="checkout-row">
                <input placeholder="Coupon code" value={couponCode} onChange={(e) => setCouponCode(e.target.value.toUpperCase())} onBlur={applyCoupon} />
              </div>
              {couponMsg && <p className="checkout-hint">{couponMsg}</p>}
              <div className="checkout-row">
                <input placeholder="Gift card code" value={giftCardCode} onChange={(e) => setGiftCardCode(e.target.value.toUpperCase())} />
                <button type="button" onClick={checkGiftCard}>Check</button>
              </div>
              {giftCardBalance !== null && <p className="checkout-hint">Gift card balance: {format(giftCardBalance)}</p>}

              {loyalty && loyalty.points > 0 && (
                <div className="checkout-row">
                  <label>Redeem loyalty points (you have {loyalty.points}, 1 pt = ₹1)</label>
                  <input type="number" min={0} max={loyalty.points} value={redeemPoints} onChange={(e) => setRedeemPoints(e.target.value)} />
                </div>
              )}
            </div>

            <div className="checkout-section">
              <h3>Contact Details</h3>
              <div className="checkout-row"><label>Full Name</label><input value={contact.fullName} onChange={(e) => setContact({ ...contact, fullName: e.target.value })} /></div>
              <div className="checkout-row"><label>Email</label><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} /></div>
              <div className="checkout-row"><label>Mobile</label><input value={contact.mobile} onChange={(e) => setContact({ ...contact, mobile: e.target.value })} /></div>
            </div>

            {error && <div className="checkout-error">{error}</div>}
            <button className="checkout-cta" onClick={confirmBooking}>Continue to Payment</button>
          </>
        )}

        {step === 2 && booking && (
          <div className="checkout-section">
            <h3>Confirm & Pay</h3>
            <p>Booking created — <strong>{format(booking.finalAmount)}</strong> due.</p>
            <RazorpayCheckout
              bookingId={booking._id}
              amount={booking.finalAmount}
              type="full"
              customerName={contact.fullName}
              customerEmail={contact.email}
              customerPhone={contact.mobile}
              onSuccess={() => navigate(`/my-trip/${booking._id}`)}
            />
          </div>
        )}
      </div>

      {quote && (
        <div className="checkout-summary">
          <h3>Price Summary</h3>
          {quote.breakdown.map((b, i) => (
            <div key={i} className="checkout-summary-row">
              <span>{b.label}</span>
              <span>{b.multiplier > 0 ? `+${Math.round(b.multiplier * 100)}%` : b.multiplier < 0 ? `${Math.round(b.multiplier * 100)}%` : "—"}</span>
            </div>
          ))}
          <div className="checkout-summary-row"><span>Per person</span><span>{format(quote.perPersonPrice)}</span></div>
          <div className="checkout-summary-row"><span>Travelers × {quote.travelers}</span><span>{format(quote.totalPrice)}</span></div>
          {quote.addOnsTotal > 0 && <div className="checkout-summary-row"><span>Add-ons</span><span>{format(quote.addOnsTotal)}</span></div>}
          <hr />
          <div className="checkout-summary-row total"><span>Estimated Total</span><span>{format(quote.grandTotal)}</span></div>
          {quoteLoading && <p style={{ fontSize: 12, color: "#888" }}>Updating…</p>}
          {typeof quote.seatsLeft === "number" && quote.seatsLeft <= 8 && (
            <p className="checkout-urgency">Only {quote.seatsLeft} seats left at this price.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkout;
