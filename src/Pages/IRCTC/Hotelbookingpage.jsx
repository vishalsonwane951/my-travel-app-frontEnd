import React, { useState, useMemo } from "react";
import {
  Anchor,
  Compass,
  Sun,
  Waves,
  Users,
  Wifi,
  Coffee,
  Wind,
  Minus,
  Plus,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";

const ROOMS = [
  {
    code: "01",
    id: "harbor-single",
    name: "Harbor Single",
    icon: Anchor,
    view: "Harbor view",
    size: "220 sq ft",
    capacity: 1,
    price: 145,
    blurb:
      "A snug room over the water, built for one. Porthole window, narrow brass bed, the sound of halyards ticking against masts.",
    amenities: ["Wifi", "Coffee"],
  },
  {
    code: "02",
    id: "captains-suite",
    name: "Captain's Suite",
    icon: Compass,
    view: "Full bay view",
    size: "480 sq ft",
    capacity: 2,
    price: 260,
    blurb:
      "The largest room aboard, with a separate sitting room, a brass telescope on its own stand, and charts of the coast on the walls.",
    amenities: ["Wifi", "Coffee", "Air"],
  },
  {
    code: "03",
    id: "lighthouse-loft",
    name: "Lighthouse Loft",
    icon: Sun,
    view: "Skylight, no shade",
    size: "310 sq ft",
    capacity: 2,
    price: 215,
    blurb:
      "Top floor, sloped ceilings, one wide skylight positioned for watching weather move in from the west.",
    amenities: ["Wifi", "Coffee"],
  },
  {
    code: "04",
    id: "the-boathouse",
    name: "The Boathouse",
    icon: Waves,
    view: "Private deck, sea level",
    size: "340 sq ft",
    capacity: 3,
    price: 195,
    blurb:
      "Ground floor, a few steps from the water. Own deck, own set of oars mounted by the door for the guests who ask.",
    amenities: ["Wifi", "Air"],
  },
  {
    code: "05",
    id: "chart-room",
    name: "Chart Room",
    icon: Users,
    view: "Bay view, two rooms",
    size: "620 sq ft",
    capacity: 4,
    price: 320,
    blurb:
      "Two connected rooms for a family or a crew. Bunk alcove for children, a proper table for cards after dinner.",
    amenities: ["Wifi", "Coffee", "Air"],
  },
];

const AMENITY_ICON = {
  Wifi: Wifi,
  Coffee: Coffee,
  Air: Wind,
};

function diffNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const d1 = new Date(checkIn);
  const d2 = new Date(checkOut);
  const ms = d2 - d1;
  if (Number.isNaN(ms)) return 0;
  const nights = Math.round(ms / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 0;
}

function makeConfirmationCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "WH-";
  for (let i = 0; i < 5; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

function todayISO() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

export default function HotelBookingPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [confirmed, setConfirmed] = useState(null);

  const selectedRoom = ROOMS.find((r) => r.id === selectedId) || null;
  const nights = useMemo(() => diffNights(checkIn, checkOut), [checkIn, checkOut]);
  const subtotal = selectedRoom ? selectedRoom.price * nights : 0;
  const fee = Math.round(subtotal * 0.12);
  const total = subtotal + fee;

  const canReserve = selectedRoom && nights > 0 && !confirmed;

  function handleSelectRoom(room) {
    setSelectedId(room.id);
    setGuests((g) => Math.min(g, room.capacity) || 1);
    setConfirmed(null);
  }

  function handleReserve() {
    if (!canReserve) return;
    setConfirmed({
      code: makeConfirmationCode(),
      room: selectedRoom,
      checkIn,
      checkOut,
      nights,
      guests,
      total,
    });
  }

  function handleReset() {
    setConfirmed(null);
    setSelectedId(null);
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
  }

  return (
    <div className="wh-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

        .wh-root {
          --ink: #142523;
          --ink-2: #1e3634;
          --ink-3: #274743;
          --linen: #f4efe4;
          --linen-2: #fbf8f2;
          --brass: #b8863f;
          --brass-dark: #8f6a2e;
          --tide: #3c6e71;
          --line: #d8cdb8;
          --line-dark: #33504c;
          --text-dark: #142523;
          --text-light: #f4efe4;
          --text-muted: #6b7d78;
          font-family: 'Inter', sans-serif;
          color: var(--text-dark);
          background: var(--linen);
        }
        .wh-root * { box-sizing: border-box; }
        .wh-display {
          font-family: 'Fraunces', serif;
          letter-spacing: -0.01em;
        }
        .wh-mono {
          font-family: 'IBM Plex Mono', monospace;
        }

        /* NAV */
        .wh-nav {
          position: sticky;
          top: 0;
          z-index: 40;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.1rem 1.5rem;
          background: rgba(20, 37, 35, 0.88);
          backdrop-filter: blur(6px);
          border-bottom: 1px solid var(--line-dark);
        }
        .wh-brand {
          display: flex;
          align-items: center;
          gap: 0.55rem;
          color: var(--text-light);
        }
        .wh-brand-mark {
          width: 30px; height: 30px;
          border: 1px solid var(--brass);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: var(--brass);
          flex-shrink: 0;
        }
        .wh-brand-name {
          font-size: 1.05rem;
          font-weight: 500;
        }
        .wh-navlinks {
          display: none;
          gap: 2rem;
          font-size: 0.85rem;
          color: var(--text-light);
        }
        @media (min-width: 768px) {
          .wh-navlinks { display: flex; }
        }
        .wh-navlinks a {
          color: rgba(244,239,228,0.75);
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .wh-navlinks a:hover { color: var(--brass); }
        .wh-navlinks a:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 4px;
        }

        /* HERO */
        .wh-hero {
          position: relative;
          overflow: hidden;
          background: linear-gradient(180deg, var(--ink) 0%, var(--ink-3) 100%);
          color: var(--text-light);
          padding: 5rem 1.5rem 6rem;
        }
        .wh-hero-lines {
          position: absolute;
          inset: 0;
          opacity: 0.35;
          pointer-events: none;
        }
        .wh-hero-inner {
          position: relative;
          max-width: 880px;
          margin: 0 auto;
        }
        .wh-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--brass);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }
        .wh-hero h1 {
          font-size: clamp(2.4rem, 6vw, 4rem);
          line-height: 1.05;
          font-weight: 500;
          margin: 0 0 1.25rem;
          max-width: 14ch;
        }
        .wh-hero p {
          font-size: 1.05rem;
          line-height: 1.6;
          color: rgba(244,239,228,0.78);
          max-width: 46ch;
          margin: 0 0 2.25rem;
        }
        .wh-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          background: var(--brass);
          color: var(--ink);
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.85rem 1.5rem;
          border-radius: 3px;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .wh-cta:hover { background: #cf9a4c; transform: translateY(-1px); }
        .wh-cta:focus-visible { outline: 2px solid var(--text-light); outline-offset: 3px; }

        /* MAIN LAYOUT */
        .wh-main {
          max-width: 1080px;
          margin: 0 auto;
          padding: 4.5rem 1.5rem 6rem;
          display: grid;
          gap: 3rem;
        }
        @media (min-width: 1024px) {
          .wh-main {
            grid-template-columns: 1.7fr 1fr;
            align-items: start;
          }
        }
        .wh-section-head {
          margin-bottom: 2rem;
        }
        .wh-section-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--tide);
          margin-bottom: 0.6rem;
        }
        .wh-section-head h2 {
          font-size: 1.9rem;
          font-weight: 500;
          margin: 0 0 0.5rem;
        }
        .wh-section-head p {
          color: var(--text-muted);
          font-size: 0.95rem;
          max-width: 50ch;
          margin: 0;
        }

        /* ROOM LIST */
        .wh-room-list {
          border-top: 1px solid var(--line);
        }
        .wh-room-row {
          border-bottom: 1px solid var(--line);
          padding: 1.5rem 0;
          cursor: pointer;
        }
        .wh-room-row-head {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .wh-room-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.85rem;
          color: var(--brass-dark);
          width: 1.6rem;
          flex-shrink: 0;
        }
        .wh-room-icon {
          width: 44px; height: 44px;
          border-radius: 50%;
          background: var(--ink);
          color: var(--brass);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .wh-room-info { flex: 1; min-width: 0; }
        .wh-room-info h3 {
          font-size: 1.15rem;
          font-weight: 500;
          margin: 0 0 0.2rem;
        }
        .wh-room-meta {
          font-size: 0.82rem;
          color: var(--text-muted);
          display: flex;
          gap: 0.9rem;
          flex-wrap: wrap;
        }
        .wh-room-price {
          text-align: right;
          flex-shrink: 0;
        }
        .wh-room-price .amt {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.1rem;
          color: var(--text-dark);
        }
        .wh-room-price .per {
          font-size: 0.72rem;
          color: var(--text-muted);
          display: block;
        }
        .wh-room-detail {
          margin-top: 1.1rem;
          padding-left: calc(1.6rem + 1rem + 44px);
          display: grid;
          gap: 1rem;
        }
        .wh-room-detail p {
          font-size: 0.92rem;
          line-height: 1.55;
          color: var(--text-dark);
          margin: 0;
          max-width: 56ch;
        }
        .wh-amenities {
          display: flex;
          gap: 1.1rem;
          flex-wrap: wrap;
        }
        .wh-amenity {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .wh-select-btn {
          justify-self: start;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          padding: 0.55rem 1.1rem;
          border-radius: 3px;
          border: 1px solid var(--ink);
          background: transparent;
          color: var(--ink);
          cursor: pointer;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .wh-select-btn:hover { background: var(--ink); color: var(--text-light); }
        .wh-select-btn.is-selected {
          background: var(--tide);
          border-color: var(--tide);
          color: var(--text-light);
        }
        .wh-select-btn:focus-visible { outline: 2px solid var(--tide); outline-offset: 2px; }

        /* TICKET */
        .wh-ticket-wrap {
          position: relative;
        }
        @media (min-width: 1024px) {
          .wh-ticket-wrap { position: sticky; top: 6rem; }
        }
        .wh-ticket {
          background: var(--ink);
          color: var(--text-light);
          border-radius: 10px;
          padding: 1.75rem 1.6rem;
          position: relative;
          box-shadow: 0 18px 40px -18px rgba(20,37,35,0.55);
        }
        .wh-ticket-notch {
          position: absolute;
          width: 22px; height: 22px;
          background: var(--linen);
          border-radius: 50%;
          left: -11px;
        }
        .wh-ticket-notch.right { left: auto; right: -11px; }
        .wh-ticket-perf {
          border-top: 1px dashed rgba(244,239,228,0.3);
          position: relative;
          margin: 1.25rem 0;
        }
        .wh-ticket-eyebrow {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--brass);
          margin-bottom: 0.35rem;
        }
        .wh-ticket h3 {
          font-size: 1.35rem;
          font-weight: 500;
          margin: 0;
        }
        .wh-ticket-empty {
          font-size: 0.9rem;
          color: rgba(244,239,228,0.6);
          line-height: 1.6;
        }
        .wh-field {
          margin-bottom: 1.1rem;
        }
        .wh-field label {
          display: block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(244,239,228,0.55);
          margin-bottom: 0.4rem;
        }
        .wh-field input[type="date"] {
          width: 100%;
          background: var(--ink-2);
          border: 1px solid var(--line-dark);
          border-radius: 4px;
          padding: 0.55rem 0.6rem;
          color: var(--text-light);
          font-family: 'Inter', sans-serif;
          font-size: 0.9rem;
          color-scheme: dark;
        }
        .wh-field input[type="date"]:focus-visible {
          outline: 2px solid var(--brass);
          outline-offset: 1px;
        }
        .wh-datepair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .wh-stepper {
          display: flex;
          align-items: center;
          gap: 0.9rem;
        }
        .wh-stepper button {
          width: 30px; height: 30px;
          border-radius: 50%;
          border: 1px solid var(--line-dark);
          background: var(--ink-2);
          color: var(--text-light);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        .wh-stepper button:hover:not(:disabled) { border-color: var(--brass); color: var(--brass); }
        .wh-stepper button:disabled { opacity: 0.35; cursor: not-allowed; }
        .wh-stepper button:focus-visible { outline: 2px solid var(--brass); outline-offset: 2px; }
        .wh-stepper .count {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.95rem;
          min-width: 1.4rem;
          text-align: center;
        }
        .wh-line-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.86rem;
          color: rgba(244,239,228,0.75);
          margin-bottom: 0.5rem;
        }
        .wh-line-row .val { font-family: 'IBM Plex Mono', monospace; color: var(--text-light); }
        .wh-total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 0.9rem;
          padding-top: 0.9rem;
          border-top: 1px solid var(--line-dark);
        }
        .wh-total-row .label { font-size: 0.85rem; color: rgba(244,239,228,0.7); }
        .wh-total-row .val {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.4rem;
          color: var(--brass);
        }
        .wh-reserve-btn {
          width: 100%;
          margin-top: 1.4rem;
          background: var(--brass);
          color: var(--ink);
          font-weight: 600;
          font-size: 0.95rem;
          padding: 0.85rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .wh-reserve-btn:hover:not(:disabled) { background: #cf9a4c; }
        .wh-reserve-btn:disabled { opacity: 0.4; cursor: not-allowed; }
        .wh-reserve-btn:focus-visible { outline: 2px solid var(--text-light); outline-offset: 2px; }

        .wh-confirm-stamp {
          display: inline-block;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: var(--tide);
          border: 1px solid var(--tide);
          border-radius: 3px;
          padding: 0.25rem 0.6rem;
          transform: rotate(-3deg);
          margin-bottom: 1rem;
        }
        .wh-confirm-code {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.6rem;
          letter-spacing: 0.05em;
          color: var(--text-light);
          margin: 0.2rem 0 1rem;
        }
        .wh-again-btn {
          width: 100%;
          margin-top: 0.5rem;
          background: transparent;
          border: 1px solid var(--line-dark);
          color: rgba(244,239,228,0.75);
          padding: 0.7rem;
          border-radius: 4px;
          font-size: 0.85rem;
          cursor: pointer;
        }
        .wh-again-btn:hover { border-color: var(--brass); color: var(--brass); }
        .wh-again-btn:focus-visible { outline: 2px solid var(--brass); outline-offset: 2px; }

        /* FOOTER */
        .wh-footer {
          background: var(--ink);
          color: rgba(244,239,228,0.6);
          padding: 3rem 1.5rem;
          font-size: 0.85rem;
        }
        .wh-footer-inner {
          max-width: 1080px;
          margin: 0 auto;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          gap: 1.5rem;
        }
        .wh-footer-col { display: flex; flex-direction: column; gap: 0.5rem; }
        .wh-footer-item { display: flex; align-items: center; gap: 0.5rem; }
      `}</style>

      {/* NAV */}
      <header className="wh-nav">
        <div className="wh-brand">
          <span className="wh-brand-mark"><Anchor size={15} /></span>
          <span className="wh-brand-name wh-display">Windward House</span>
        </div>
        <nav className="wh-navlinks">
          <a href="#rooms">Rooms</a>
          <a href="#book">Book</a>
        </nav>
      </header>

      {/* HERO */}
      <section className="wh-hero">
        <svg className="wh-hero-lines" viewBox="0 0 800 400" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,320 Q100,280 200,320 T400,320 T600,320 T800,320" stroke="#3c6e71" strokeWidth="1" fill="none" />
          <path d="M0,350 Q100,310 200,350 T400,350 T600,350 T800,350" stroke="#b8863f" strokeWidth="1" fill="none" />
          <path d="M0,380 Q100,340 200,380 T400,380 T600,380 T800,380" stroke="#3c6e71" strokeWidth="1" fill="none" />
        </svg>
        <div className="wh-hero-inner">
          <div className="wh-eyebrow"><MapPin size={13} /> A five-room inn on the harbor</div>
          <h1 className="wh-display">Anchor here for the night.</h1>
          <p>
            Five rooms, each named for what it looks out on. No two nights on
            the water are quite the same — check what's open below and hold
            a room before the tide turns.
          </p>
          <a href="#rooms" className="wh-cta">See the rooms <ArrowRight size={16} /></a>
        </div>
      </section>

      {/* MAIN */}
      <main className="wh-main">
        <section id="rooms">
          <div className="wh-section-head">
            <div className="wh-section-eyebrow">The manifest</div>
            <h2 className="wh-display">Five rooms, in order</h2>
            <p>Pick one to see what it's like, then hold it in the ticket alongside.</p>
          </div>

          <div className="wh-room-list">
            {ROOMS.map((room) => {
              const Icon = room.icon;
              const isSelected = selectedId === room.id;
              const isExpanded = expandedId === room.id;
              return (
                <div
                  key={room.id}
                  className="wh-room-row"
                  onClick={() =>
                    setExpandedId((cur) => (cur === room.id ? null : room.id))
                  }
                >
                  <div className="wh-room-row-head">
                    <span className="wh-room-num wh-mono">{room.code}</span>
                    <span className="wh-room-icon"><Icon size={18} /></span>
                    <div className="wh-room-info">
                      <h3 className="wh-display">{room.name}</h3>
                      <div className="wh-room-meta">
                        <span>{room.view}</span>
                        <span>{room.size}</span>
                        <span>Sleeps {room.capacity}</span>
                      </div>
                    </div>
                    <div className="wh-room-price">
                      <span className="amt">${room.price}</span>
                      <span className="per">per night</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="wh-room-detail" onClick={(e) => e.stopPropagation()}>
                      <p>{room.blurb}</p>
                      <div className="wh-amenities">
                        {room.amenities.map((a) => {
                          const AIcon = AMENITY_ICON[a];
                          return (
                            <span className="wh-amenity" key={a}>
                              <AIcon size={14} /> {a}
                            </span>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        className={`wh-select-btn${isSelected ? " is-selected" : ""}`}
                        onClick={() => handleSelectRoom(room)}
                      >
                        {isSelected ? "Selected for booking" : "Select this room"}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* TICKET / BOOKING PANEL */}
        <div className="wh-ticket-wrap" id="book">
          <div className="wh-ticket">
            <span className="wh-ticket-notch" style={{ top: "38%" }} />
            <span className="wh-ticket-notch right" style={{ top: "38%" }} />

            {confirmed ? (
              <>
                <div className="wh-ticket-eyebrow">Booking</div>
                <span className="wh-confirm-stamp">CONFIRMED</span>
                <div className="wh-confirm-code">{confirmed.code}</div>
                <div className="wh-line-row">
                  <span>Room</span>
                  <span className="val">{confirmed.room.name}</span>
                </div>
                <div className="wh-line-row">
                  <span>Check in</span>
                  <span className="val">{confirmed.checkIn}</span>
                </div>
                <div className="wh-line-row">
                  <span>Check out</span>
                  <span className="val">{confirmed.checkOut}</span>
                </div>
                <div className="wh-line-row">
                  <span>Guests</span>
                  <span className="val">{confirmed.guests}</span>
                </div>
                <div className="wh-ticket-perf" />
                <div className="wh-total-row">
                  <span className="label">Total paid at stay</span>
                  <span className="val">${confirmed.total}</span>
                </div>
                <button type="button" className="wh-again-btn" onClick={handleReset}>
                  Book another room
                </button>
              </>
            ) : (
              <>
                <div className="wh-ticket-eyebrow">Your ticket</div>
                {selectedRoom ? (
                  <h3>{selectedRoom.name}</h3>
                ) : (
                  <div className="wh-ticket-empty">
                    No room held yet. Choose one from the manifest to start
                    filling in this ticket.
                  </div>
                )}

                <div className="wh-ticket-perf" />

                <div className="wh-field wh-datepair">
                  <div>
                    <label htmlFor="wh-checkin">Check in</label>
                    <input
                      id="wh-checkin"
                      type="date"
                      value={checkIn}
                      min={todayISO()}
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="wh-checkout">Check out</label>
                    <input
                      id="wh-checkout"
                      type="date"
                      value={checkOut}
                      min={checkIn || todayISO()}
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                </div>

                <div className="wh-field">
                  <label>Guests</label>
                  <div className="wh-stepper">
                    <button
                      type="button"
                      onClick={() => setGuests((g) => Math.max(1, g - 1))}
                      disabled={guests <= 1}
                      aria-label="Fewer guests"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="count wh-mono">{guests}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setGuests((g) =>
                          Math.min(selectedRoom ? selectedRoom.capacity : 4, g + 1)
                        )
                      }
                      disabled={!selectedRoom || guests >= selectedRoom.capacity}
                      aria-label="More guests"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="wh-ticket-perf" />

                <div className="wh-line-row">
                  <span><Clock size={13} style={{ verticalAlign: "-2px", marginRight: "4px" }} />Nights</span>
                  <span className="val">{nights || "—"}</span>
                </div>
                <div className="wh-line-row">
                  <span>Room rate</span>
                  <span className="val">
                    {selectedRoom ? `$${selectedRoom.price} × ${nights || 0}` : "—"}
                  </span>
                </div>
                <div className="wh-line-row">
                  <span>Harbor fee</span>
                  <span className="val">${fee || 0}</span>
                </div>

                <div className="wh-total-row">
                  <span className="label">Total</span>
                  <span className="val">${total || 0}</span>
                </div>

                <button
                  type="button"
                  className="wh-reserve-btn"
                  disabled={!canReserve}
                  onClick={handleReserve}
                >
                  Reserve this room <ArrowRight size={16} />
                </button>
              </>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="wh-footer">
        <div className="wh-footer-inner">
          <div className="wh-footer-col">
            <span className="wh-display" style={{ color: "#f4efe4", fontSize: "1.05rem" }}>
              Windward House
            </span>
            <span className="wh-footer-item"><MapPin size={13} /> Harbor Road, dock end</span>
          </div>
          <div className="wh-footer-col">
            <span className="wh-footer-item"><Clock size={13} /> Check-in from 3pm</span>
            <span className="wh-footer-item"><Clock size={13} /> Check-out by 11am</span>
          </div>
        </div>
      </footer>
    </div>
  );
}