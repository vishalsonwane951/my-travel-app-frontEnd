// components/Footer/Footer.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebookF, FaInstagram, FaTwitter, FaYoutube,
  FaGooglePay, FaCcVisa, FaAmazonPay, FaPhoneAlt,
  FaEnvelope, FaMapMarkerAlt, FaArrowRight, FaPaypal,
  FaCcMastercard, FaWhatsapp, FaHeart
} from "react-icons/fa";

const useLiveStats = () => {
  const [stats, setStats] = useState({ bookings: 247, online: 38 });
  useEffect(() => {
    const t = setInterval(() => {
      setStats(prev => ({
        bookings: prev.bookings + Math.floor(Math.random() * 2),
        online: Math.max(20, prev.online + Math.floor((Math.random() - 0.45) * 5)),
      }));
    }, 7000);
    return () => clearInterval(t);
  }, []);
  return stats;
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [emailError, setEmailError] = useState("");
  const stats = useLiveStats();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setSubscribed(true);
    setEmail("");
  };

  const TOUR_LINKS = [
    { label: "Custom Tours",    path: "/tourcard/custom-tour" },
    { label: "Adventure Tours", path: "/tourcard/adventure-tour" },
    { label: "Family Tours",    path: "/tourcard/family-tour" },
    { label: "Honeymoon Tours", path: "/tourcard/honeymoon-tour" },
    { label: "Luxury Tours",    path: "/tourcard/luxury-tour" },
    { label: "Pilgrimage Tours",path: "/tourcard/pilgrimage-tour" },
    { label: "Weekend Getaways",path: "/tourcard/weekend-getaway" },
    { label: "Group Tours",     path: "/tourcard/group-tour" },
    { label: "City Tours",      path: "/tourcard/city-tour" },
  ];

  const DEST_LINKS = [
    { label: "🏖️ Goa",         path: "/goa" },
    { label: "🌴 Kerala",       path: "/kerala" },
    { label: "🏜️ Rajasthan",   path: "/rajasthan" },
    { label: "🏔️ Himachal",    path: "/himachal" },
    { label: "🌆 Dubai",        path: "/dubai" },
    { label: "🏝️ Maldives",    path: "/maldives" },
    { label: "🐘 Thailand",     path: "/thailand" },
    { label: "🌺 Bali",         path: "/bali" },
  ];

  const QUICK_LINKS = [
    { label: "About Us",       path: "/#about-us" },
    { label: "Our Services",   path: "/services" },
    { label: "Career",         path: "/career" },
    { label: "Blog",           path: "/blog" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms",          path: "/terms" },
    { label: "Cancellation",   path: "/cancellation" },
    { label: "Sitemap",        path: "/sitemap" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@500;600;700&display=swap');
        :root {
          --font-body: 'DM Sans', sans-serif;
          --font-display: 'Cormorant Garamond', serif;
          --navy: #10102a;
          --navy-mid: #1a1a3e;
          --indigo: #3D52A0;
          --gold: #C9A84C;
          --gold-light: #F0D080;
          --ease: cubic-bezier(0.4,0,0.2,1);
        }

        /* ── Live strip ── */
        .ftr-live-strip {
          background: linear-gradient(90deg, var(--navy) 0%, var(--indigo) 50%, var(--navy) 100%);
          background-size: 200% 100%;
          animation: ftr-shimmer 8s linear infinite;
          padding: 0.6rem 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2.5rem;
          flex-wrap: wrap;
        }
        @keyframes ftr-shimmer { 0%{background-position:0%} 100%{background-position:200%} }
        .ftr-live-item {
          display: flex; align-items: center; gap: 7px;
          color: rgba(255,255,255,0.85);
          font-size: 0.8rem;
          font-family: var(--font-body);
        }
        .ftr-live-dot {
          width: 7px; height: 7px;
          background: #4CAF50;
          border-radius: 50%;
          box-shadow: 0 0 0 3px rgba(76,175,80,0.2);
          animation: ftr-pulse 2s infinite;
          flex-shrink: 0;
        }
        @keyframes ftr-pulse { 0%,100%{box-shadow:0 0 0 3px rgba(76,175,80,0.2)} 50%{box-shadow:0 0 0 6px rgba(76,175,80,0.08)} }

        /* ── Main footer ── */
        .ftr-main {
          background: var(--navy);
          padding: 5rem 2rem 2rem;
          font-family: var(--font-body);
        }
        .ftr-inner {
          max-width: 1300px;
          margin: 0 auto;
        }

        /* Top row */
        .ftr-top {
          display: grid;
          grid-template-columns: 1.4fr 1fr 1fr 1fr;
          gap: 3rem;
          margin-bottom: 4rem;
        }

        /* Brand column */
        .ftr-brand-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; margin-bottom: 1.25rem;
        }
        .ftr-brand-logo img { height: 42px; filter: brightness(0) invert(1); }
        .ftr-brand-name {
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 700; color: white;
        }
        .ftr-brand-name .accent { color: var(--gold); }
        .ftr-brand-tagline {
          font-size: 0.88rem; color: rgba(255,255,255,0.5);
          line-height: 1.7; margin-bottom: 1.5rem; max-width: 320px;
        }
        .ftr-socials { display: flex; gap: 10px; margin-bottom: 1.75rem; }
        .ftr-social-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.6);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.25s var(--ease);
        }
        .ftr-social-btn:hover {
          background: var(--gold);
          border-color: var(--gold);
          color: var(--navy);
          transform: translateY(-2px);
        }

        /* Contact items in brand */
        .ftr-contact-list { display: flex; flex-direction: column; gap: 10px; }
        .ftr-contact-item {
          display: flex; align-items: center; gap: 10px;
          font-size: 0.84rem; color: rgba(255,255,255,0.55);
          text-decoration: none; transition: color 0.2s;
        }
        .ftr-contact-item:hover { color: var(--gold-light); }
        .ftr-contact-icon {
          width: 28px; height: 28px;
          border-radius: 8px;
          background: rgba(255,255,255,0.07);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.75rem;
          flex-shrink: 0;
          color: var(--gold);
        }

        /* Link columns */
        .ftr-col-title {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.25rem;
          display: flex; align-items: center; gap: 6px;
        }
        .ftr-col-title::after {
          content: '';
          flex: 1; height: 1px;
          background: rgba(201,168,76,0.25);
        }
        .ftr-col-links { list-style: none; display: flex; flex-direction: column; gap: 8px; }
        .ftr-col-link {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem;
          color: rgba(255,255,255,0.5);
          text-decoration: none;
          transition: all 0.2s var(--ease);
          padding: 2px 0;
        }
        .ftr-col-link:hover {
          color: rgba(255,255,255,0.9);
          transform: translateX(4px);
        }
        .ftr-link-dot {
          width: 4px; height: 4px; border-radius: 50%;
          background: var(--indigo); flex-shrink: 0;
          transition: background 0.2s;
        }
        .ftr-col-link:hover .ftr-link-dot { background: var(--gold); }

        /* Newsletter section */
        .ftr-newsletter {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 2.5rem;
          margin-bottom: 3rem;
        }
        .ftr-newsletter-inner {
          display: flex;
          align-items: center;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .ftr-newsletter-left { flex: 1; min-width: 240px; }
        .ftr-newsletter-title {
          font-family: var(--font-display);
          font-size: 1.5rem; font-weight: 700; color: white;
          margin-bottom: 0.5rem;
        }
        .ftr-newsletter-sub { font-size: 0.85rem; color: rgba(255,255,255,0.5); line-height: 1.6; }
        .ftr-newsletter-right { flex: 1; min-width: 300px; }
        .ftr-form { display: flex; flex-direction: column; gap: 8px; }
        .ftr-email-row {
          display: flex;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 12px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .ftr-email-row:focus-within { border-color: var(--gold); }
        .ftr-email-input {
          flex: 1; padding: 0.8rem 1.25rem;
          background: transparent; border: none; outline: none;
          color: white;
          font-size: 0.88rem; font-family: var(--font-body);
          placeholder-color: rgba(255,255,255,0.4);
        }
        .ftr-email-input::placeholder { color: rgba(255,255,255,0.35); }
        .ftr-email-btn {
          padding: 0 1.5rem;
          background: var(--gold);
          border: none; cursor: pointer;
          color: var(--navy);
          font-weight: 700; font-size: 0.85rem;
          font-family: var(--font-body);
          display: flex; align-items: center; gap: 6px;
          transition: background 0.2s;
        }
        .ftr-email-btn:hover { background: var(--gold-light); }
        .ftr-error { font-size: 0.78rem; color: #FF6B6B; }
        .ftr-success {
          display: flex; align-items: center; gap: 8px;
          background: rgba(76,175,80,0.12);
          border: 1px solid rgba(76,175,80,0.25);
          border-radius: 10px;
          padding: 0.7rem 1rem;
          font-size: 0.85rem; color: #81C784;
          font-family: var(--font-body);
        }

        /* Payments */
        .ftr-payments {
          display: flex; align-items: center; gap: 0.5rem;
          margin-top: 0.75rem; flex-wrap: wrap;
        }
        .ftr-payments-label { font-size: 0.75rem; color: rgba(255,255,255,0.35); }
        .ftr-payment-icon {
          font-size: 1.4rem;
          color: rgba(255,255,255,0.45);
          transition: color 0.2s;
        }
        .ftr-payment-icon:hover { color: rgba(255,255,255,0.8); }

        /* Divider */
        .ftr-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin: 0 0 2rem;
        }

        /* Bottom bar */
        .ftr-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .ftr-copyright {
          font-size: 0.82rem;
          color: rgba(255,255,255,0.35);
        }
        .ftr-copyright strong { color: rgba(255,255,255,0.6); }
        .ftr-made-with {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.78rem; color: rgba(255,255,255,0.3);
        }
        .ftr-made-with svg { color: #FF6B6B; animation: ftr-heartbeat 1.5s infinite; }
        @keyframes ftr-heartbeat { 0%,100%{transform:scale(1)} 50%{transform:scale(1.2)} }
        .ftr-bottom-links {
          display: flex; gap: 1.5rem; flex-wrap: wrap;
        }
        .ftr-bottom-link {
          font-size: 0.78rem; color: rgba(255,255,255,0.3);
          text-decoration: none; transition: color 0.2s;
        }
        .ftr-bottom-link:hover { color: var(--gold); }

        @media (max-width: 1024px) {
          .ftr-top { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 640px) {
          .ftr-top { grid-template-columns: 1fr; gap: 2rem; }
          .ftr-newsletter-inner { flex-direction: column; gap: 1.5rem; }
          .ftr-bottom { flex-direction: column; text-align: center; }
          .ftr-live-strip { gap: 1rem; font-size: 0.75rem; }
        }
      `}</style>

      {/* ── Live Stats Strip ── */}
      <div className="ftr-live-strip">
        <div className="ftr-live-item">
          <span className="ftr-live-dot" />
          <span><strong style={{ color: 'white' }}>{stats.online}</strong> travelers browsing right now</span>
        </div>
        <div className="ftr-live-item">
          <span>🎉</span>
          <span><strong style={{ color: 'white' }}>{stats.bookings}</strong> bookings made today</span>
        </div>
        <div className="ftr-live-item">
          <span>⭐</span>
          <span>Rated <strong style={{ color: 'white' }}>4.9/5</strong> by 10,000+ travelers</span>
        </div>
        <div className="ftr-live-item">
          <span>🔒</span>
          <span>100% Secure & Insured Travel</span>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <footer className="ftr-main" id="footer">
        <div className="ftr-inner">
          {/* Top grid */}
          <div className="ftr-top">
            {/* Brand */}
            <div>
              <Link to="/" className="ftr-brand-logo">
                <img src="/logo.png" alt="DesiVDesi" />
                <span className="ftr-brand-name">Desi<span className="accent">V</span>Desi</span>
              </Link>
              <p className="ftr-brand-tagline">
                Crafting unforgettable journeys across India's hidden gems and the world's most iconic destinations since 2009.
              </p>
              <div className="ftr-socials">
                {[
                  { icon: <FaFacebookF />, href: "#", label: "Facebook" },
                  { icon: <FaInstagram />, href: "#", label: "Instagram" },
                  { icon: <FaTwitter />, href: "#", label: "Twitter" },
                  { icon: <FaYoutube />, href: "#", label: "YouTube" },
                  { icon: <FaWhatsapp />, href: "https://wa.me/917888251550", label: "WhatsApp" },
                ].map(s => (
                  <a key={s.label} href={s.href} className="ftr-social-btn" target="_blank" rel="noreferrer" aria-label={s.label}>
                    {s.icon}
                  </a>
                ))}
              </div>
              <div className="ftr-contact-list">
                <a href="tel:+917888251550" className="ftr-contact-item">
                  <span className="ftr-contact-icon"><FaPhoneAlt /></span>
                  +91 78882 51550
                </a>
                <a href="https://wa.me/917888251550" className="ftr-contact-item">
                  <span className="ftr-contact-icon"><FaWhatsapp /></span>
                  WhatsApp Support
                </a>
                <a href="mailto:tours.desivdesi@gmail.com" className="ftr-contact-item">
                  <span className="ftr-contact-icon"><FaEnvelope /></span>
                  tours.desivdesi@gmail.com
                </a>
                <div className="ftr-contact-item">
                  <span className="ftr-contact-icon"><FaMapMarkerAlt /></span>
                  123 Travel St, Mumbai 400001
                </div>
              </div>
            </div>

            {/* Tour Types */}
            <div>
              <div className="ftr-col-title">Tour Packages</div>
              <ul className="ftr-col-links">
                {TOUR_LINKS.map(l => (
                  <li key={l.label}>
                    <Link to={l.path} className="ftr-col-link">
                      <span className="ftr-link-dot" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Destinations */}
            <div>
              <div className="ftr-col-title">Destinations</div>
              <ul className="ftr-col-links">
                {DEST_LINKS.map(l => (
                  <li key={l.label}>
                    <Link to={l.path} className="ftr-col-link">
                      <span className="ftr-link-dot" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <div className="ftr-col-title">Quick Links</div>
              <ul className="ftr-col-links">
                {QUICK_LINKS.map(l => (
                  <li key={l.label}>
                    <Link to={l.path} className="ftr-col-link">
                      <span className="ftr-link-dot" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          {/* <div className="ftr-newsletter">
            <div className="ftr-newsletter-inner">
              <div className="ftr-newsletter-left">
                <h3 className="ftr-newsletter-title">Get Exclusive Travel Deals 🎁</h3>
                <p className="ftr-newsletter-sub">
                  Subscribe and receive early access to flash sales, hidden deals, and personalized destination picks — straight to your inbox.
                </p>
              </div>
              <div className="ftr-newsletter-right">
                {subscribed ? (
                  <div className="ftr-success">
                    <span>✅</span>
                    <span>You're subscribed! Watch your inbox for amazing deals.</span>
                  </div>
                ) : (
                  <form className="ftr-form" onSubmit={handleSubscribe}>
                    <div className="ftr-email-row">
                      <input
                        type="email"
                        className="ftr-email-input"
                        placeholder="Your email address..."
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                      />
                      <button type="submit" className="ftr-email-btn">
                        Subscribe <FaArrowRight size={11} />
                      </button>
                    </div>
                    {emailError && <span className="ftr-error">{emailError}</span>}
                  </form>
                )}
                <div className="ftr-payments">
                  <span className="ftr-payments-label">We accept:</span>
                  {[FaGooglePay, FaCcVisa, FaCcMastercard, FaAmazonPay, FaPaypal].map((Icon, i) => (
                    <Icon key={i} className="ftr-payment-icon" />
                  ))}
                </div>
              </div>
            </div>
          </div> */}

          <div className="ftr-divider" />

          {/* Bottom */}
          <div className="ftr-bottom">
            <p className="ftr-copyright">
              © {new Date().getFullYear()} <strong>Desi V Desi Travel</strong>. All rights reserved.
            </p>
            <div className="ftr-made-with">
              Made with <FaHeart size={11} /> in India
            </div>
            <div className="ftr-bottom-links">
              <Link to="/privacy-policy" className="ftr-bottom-link">Privacy Policy</Link>
              <Link to="/terms" className="ftr-bottom-link">Terms</Link>
              <Link to="/cookies" className="ftr-bottom-link">Cookies</Link>
              <Link to="/sitemap" className="ftr-bottom-link">Sitemap</Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;