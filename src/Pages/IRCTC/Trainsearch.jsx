import React, {
  useState, useCallback, useMemo, useContext
} from 'react';
import { fetchLiveStation , mapLiveStationToTrains } from '../../Services/IRCTC/IRCTC.listModel.js'
import { Link } from 'react-router-dom';
import {
  FaTrain, FaMapMarkerAlt, FaExchangeAlt, FaCalendarAlt, FaSearch,
  FaClock, FaChevronDown, FaChevronUp, FaArrowRight, FaCircle, FaShieldAlt, FaBolt
} from 'react-icons/fa';
import api from '../../utils/api.js';
import { AuthContext } from '../../Context/AuthContext.jsx';
import HotelHeader from '../Hotel/component/Header.jsx';
import Header from '../../Components/Header/Header.jsx';
import TrainBookingModal from './Trainbookingmodal.jsx';

// ─── Design tokens reused from the Desi V Desi home page ──────
// --saffron #E8813A / --forest #1A3C34 / --cream #FBF5EC / --ink #0F1923
// --gold #D4AF6A — new premium accent, used sparingly for hairlines & foil details
// Fonts: 'Cormorant Garamond' (display) + 'Outfit' (body) — same as Start.jsx
//
// Hero photo: "Vande Bharat Express around Mumbai" — Wikimedia Commons,
// CC BY-SA 4.0 (https://commons.wikimedia.org/wiki/File:Vande_Bharat_Express_around_Mumbai.jpg)

const DAY_ORDER = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABEL = { sun: 'S', mon: 'M', tue: 'T', wed: 'W', thu: 'T', fri: 'F', sat: 'S' };

// RapidAPI train-search endpoints sometimes return continuous ("day-rollover")
// HH:MM values — e.g. "24:45" means 00:45 the next day, "47:35" means 23:35
// two days later. This normalizes that safely for display + duration math.
function normalizeTime(hhmm) {
  if (!hhmm || typeof hhmm !== 'string' || !hhmm.includes(':')) {
    return { totalMinutes: 0, display: '--:--', dayOffset: 0 };
  }
  const [hStr, mStr] = hhmm.split(':');
  const h = parseInt(hStr, 10) || 0;
  const m = parseInt(mStr, 10) || 0;
  const totalMinutes = h * 60 + m;
  const dayOffset = Math.floor(h / 24);
  const displayH = h % 24;
  const display = `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  return { totalMinutes, display, dayOffset };
}

function computeDuration(departureTime, arrivalTime) {
  const dep = normalizeTime(departureTime);
  const arr = normalizeTime(arrivalTime);
  let diff = arr.totalMinutes - dep.totalMinutes;
  // Sandbox/mock data occasionally returns an arrival before the departure
  // on the same rollover day — treat that as spanning into the next day.
  while (diff <= 0) diff += 1440;
  const hrs = Math.floor(diff / 60);
  const mins = diff % 60;
  return `${hrs}h ${mins}m`;
}

function classTone(value) {
  const acClasses = ['1A', '2A', '3A', 'CC', 'EC', '3E'];
  if (acClasses.includes(value)) return 'ac';
  if (value === 'SL') return 'sleeper';
  return 'seating';
}

// First-class / executive codes get a small gold "premium" cue on their chip
function isEliteClass(value) {
  return value === '1A' || value === 'EC';
}

// ─── Run-day dots ──────────────────────────────────────────────
const RunDays = React.memo(({ runDays }) => (
  <div className="train-rundays" title="Days this train runs">
    {DAY_ORDER.map(d => (
      <span key={d} className={`train-rundot ${runDays?.[d] ? 'active' : ''}`}>
        {DAY_LABEL[d]}
      </span>
    ))}
  </div>
));

// ─── Single train result card ──────────────────────────────────
const TrainCard = React.memo(({ train, fromStation, toStation, journeyDate, onBook }) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedClass, setSelectedClass] = useState(train.classes?.[0]?.value || null);

  const dep = useMemo(() => normalizeTime(train.departureTime), [train.departureTime]);
  const arr = useMemo(() => normalizeTime(train.arrivalTime), [train.arrivalTime]);
  const duration = useMemo(
    () => computeDuration(train.departureTime, train.arrivalTime),
    [train.departureTime, train.arrivalTime]
  );

  const badgeTone = train.trainType === 'SUPERFAST' ? 'superfast' : 'mail';

  return (
    <div className="train-card">
      <div className="train-card-sheen" aria-hidden="true" />
      <div className="train-card-top">
        <div className="train-card-id">
          <span className={`train-type-badge ${badgeTone}`}>{train.trainType}</span>
          <div>
            <div className="train-name">{train.trainName}</div>
            <div className="train-number">#{train.trainNumber}</div>
          </div>
        </div>
        <RunDays runDays={train.runDays} />
      </div>

      <div className="train-card-route">
        <div className="train-route-point">
          <div className="train-time">{dep.display}</div>
          <div className="train-station">{fromStation || 'Origin'}</div>
          {dep.dayOffset > 0 && <div className="train-dayoffset">Day {dep.dayOffset + 1}</div>}
        </div>

        <div className="train-route-line">
          <FaTrain className="train-route-icon" />
          <div className="train-duration"><FaClock size={11} /> {duration}</div>
        </div>

        <div className="train-route-point right">
          <div className="train-time">{arr.display}</div>
          <div className="train-station">{toStation || 'Destination'}</div>
          {arr.dayOffset > 0 && <div className="train-dayoffset">Day {arr.dayOffset + 1}</div>}
        </div>
      </div>

      <div className="train-classes">
        {train.classes?.map(c => (
          <button
            key={c.value}
            onClick={() => setSelectedClass(c.value)}
            className={`train-class-chip ${classTone(c.value)} ${selectedClass === c.value ? 'active' : ''} ${isEliteClass(c.value) ? 'elite' : ''}`}
          >
            {isEliteClass(c.value) && <span className="elite-dot" aria-hidden="true" />}
            {c.value}
            <span className="train-class-name">{c.name}</span>
          </button>
        ))}
      </div>

      <div className="train-card-footer">
        <button className="train-details-toggle" onClick={() => setExpanded(p => !p)}>
          {expanded ? <>Hide details <FaChevronUp size={11} /></> : <>View details <FaChevronDown size={11} /></>}
        </button>
        <button
          className="btn-primary train-book-btn"
          onClick={() => onBook(train, selectedClass)}
          disabled={!selectedClass}
        >
          Book Now <FaArrowRight style={{ marginLeft: 6 }} />
        </button>
      </div>

      {expanded && (
        <div className="train-card-expanded">
          <div className="train-expanded-row">
            <FaCalendarAlt style={{ color: 'var(--saffron)' }} />
            Journey date: <strong>{journeyDate || 'Select a date above'}</strong>
          </div>
          <div className="train-expanded-row">
            <FaMapMarkerAlt style={{ color: 'var(--saffron)' }} />
            {fromStation || 'Origin'} <FaArrowRight size={10} /> {toStation || 'Destination'}
          </div>
          <div className="train-expanded-hint">
            Availability and fares are confirmed on the next step, based on the class and quota you choose.
          </div>
        </div>
      )}
    </div>
  );
});

// ─── Skeleton for loading state ─────────────────────────────────
const TrainCardSkeleton = () => (
  <div className="train-card">
    <div className="skeleton" style={{ height: 22, width: '40%', marginBottom: 14 }} />
    <div className="skeleton" style={{ height: 50, marginBottom: 14 }} />
    <div className="skeleton" style={{ height: 34, width: '60%' }} />
  </div>
);

// ─── Main page ──────────────────────────────────────────────────
function TrainSearch() {
  const { user } = useContext(AuthContext);
  const [fromStation, setFromStation] = useState('');
  const [toStation, setToStation] = useState('');
  const [journeyDate, setJourneyDate] = useState('');
  const [trains, setTrains] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingTrain, setBookingTrain] = useState(null);
  const [bookingClass, setBookingClass] = useState(null);
  const [showAlert, setShowAlert] = useState(false);

  const handleSearch = useCallback(async (e) => {
  e.preventDefault();
  if (!fromStation.trim() || !toStation.trim()) {
    setError('Please enter both the origin and destination stations.');
    return;
  }
  setError('');
  setLoading(true);
  setSearched(true);
  try {
    const payload = await fetchLiveStation(fromStation.trim(), toStation.trim(), 8); // 8 hours, or make this a form field
    setTrains(mapLiveStationToTrains(payload));
  } catch (err) {
    console.error(err);
    setError('We could not fetch trains right now. Please try again in a moment.');
    setTrains([]);
  } finally {
    setLoading(false);
  }
}, [fromStation, toStation]);

  const swapStations = useCallback(() => {
    setFromStation(toStation);
    setToStation(fromStation);
  }, [fromStation, toStation]);

  const openBooking = useCallback((train, selectedClass) => {
    if (!user) { setShowAlert(true); setTimeout(() => setShowAlert(false), 3000); return; }
    setBookingTrain(train);
    setBookingClass(selectedClass);
  }, [user]);

  return (
    <>
    <Header/>
    <HotelHeader/>
      <TrainStyles />
      

      {showAlert && (
        <div className="animate-fadeup" style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, background: 'white', borderRadius: 16, padding: '14px 20px', boxShadow: '0 20px 60px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: 12, border: '1px solid #FDE68A' }}>
          <span style={{ fontSize: '1.3rem' }}>🔐</span>
          <p style={{ fontFamily: 'Outfit', fontSize: '0.88rem', color: '#374151' }}>
            Please <Link to="/login" style={{ color: 'var(--saffron)', fontWeight: 700 }}>log in</Link> to book this train
          </p>
        </div>
      )}

      {/* ─── Hero-style search band, Vande Bharat photo backdrop ──── */}
      <section className="train-hero">
        <div className="train-hero-photo" aria-hidden="true" />
        <div className="train-hero-scrim" aria-hidden="true" />
        <div className="train-hero-inner">
          <div className="train-hero-eyebrow-row">
            <span className="section-eyebrow" style={{ color: 'var(--saffron-light)' }}>Desi V Desi Rail</span>
            <span className="train-hero-hairline" aria-hidden="true" />
          </div>
          <h1 className="train-hero-title">Book Your Train, <em style={{ color: 'var(--saffron)' }}>Hassle-Free</em></h1>
          <p className="train-hero-sub">Search live schedules, compare classes and confirm your seat in minutes.</p>

          <div className="train-hero-trust-row">
            <span className="train-hero-trust-chip"><FaBolt size={11} /> Live IRCTC data</span>
            <span className="train-hero-trust-chip"><FaShieldAlt size={11} /> Secure checkout</span>
            <span className="train-hero-trust-chip"><FaClock size={11} /> Instant confirmation</span>
          </div>

          <form onSubmit={handleSearch} className="train-search-bar">
            <div className="train-search-field">
              <label className="field-label" style={{ color: 'rgba(255,255,255,0.7)' }}>From</label>
              <div className="train-search-input-wrap">
                <FaMapMarkerAlt style={{ color: 'var(--saffron)' }} />
                <input
                  className="search-input train-search-input"
                  placeholder="Origin station"
                  value={fromStation}
                  onChange={e => setFromStation(e.target.value)}
                />
              </div>
            </div>

            <button type="button" className="train-swap-btn" onClick={swapStations} aria-label="Swap stations">
              <FaExchangeAlt />
            </button>

            <div className="train-search-field">
              <label className="field-label" style={{ color: 'rgba(255,255,255,0.7)' }}>To</label>
              <div className="train-search-input-wrap">
                <FaMapMarkerAlt style={{ color: 'var(--saffron)' }} />
                <input
                  className="search-input train-search-input"
                  placeholder="Destination station"
                  value={toStation}
                  onChange={e => setToStation(e.target.value)}
                />
              </div>
            </div>

            <div className="train-search-field">
              <label className="field-label" style={{ color: 'rgba(255,255,255,0.7)' }}>Date</label>
              <div className="train-search-input-wrap">
                <FaCalendarAlt style={{ color: 'var(--saffron)' }} />
                <input
                  type="date"
                  className="search-input train-search-input"
                  value={journeyDate}
                  onChange={e => setJourneyDate(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary train-search-btn" disabled={loading}>
              <FaSearch style={{ marginRight: 8 }} /> {loading ? 'Searching…' : 'Search Trains'}
            </button>
          </form>
          {error && <div className="train-error">{error}</div>}
        </div>
      </section>

      {/* ─── Results ────────────────────────────────────────── */}
      <section className="train-results-section">
        {loading && (
          <div className="train-results-grid">
            {[1, 2, 3].map(i => <TrainCardSkeleton key={i} />)}
          </div>
        )}

        {!loading && searched && trains.length === 0 && !error && (
          <div className="train-empty">
            <FaTrain style={{ fontSize: '2.5rem', color: '#E5E7EB', marginBottom: 16 }} />
            <div className="train-empty-title">No Trains Found</div>
            <div className="train-empty-sub">Try a different station pair or date.</div>
          </div>
        )}

        {!loading && trains.length > 0 && (
          <>
            <div className="train-results-heading">
              <div className="section-eyebrow" style={{ marginBottom: 6 }}>
                {trains.length} Train{trains.length > 1 ? 's' : ''} Found
              </div>
              <h2 className="section-title" style={{ fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>
                {fromStation || 'Origin'} <FaArrowRight size={18} style={{ margin: '0 10px', color: 'var(--saffron)' }} /> {toStation || 'Destination'}
              </h2>
            </div>
            <div className="train-results-grid">
              {trains.map(train => (
                <TrainCard
                  key={train.trainNumber}
                  train={train}
                  fromStation={fromStation}
                  toStation={toStation}
                  journeyDate={journeyDate}
                  onBook={openBooking}
                />
              ))}
            </div>
          </>
        )}

        {!searched && !loading && (
          <div className="train-empty">
            <FaSearch style={{ fontSize: '2.2rem', color: '#E5E7EB', marginBottom: 16 }} />
            <div className="train-empty-title">Search for Trains</div>
            <div className="train-empty-sub">Enter your origin and destination above to see live schedules.</div>
          </div>
        )}
      </section>

      {bookingTrain && (
        <TrainBookingModal
          train={bookingTrain}
          selectedClass={bookingClass}
          fromStation={fromStation}
          toStation={toStation}
          journeyDate={journeyDate}
          user={user}
          onClose={() => { setBookingTrain(null); setBookingClass(null); }}
        />
      )}
    </>
  );
}

// ─── Scoped styles for the train pages ─────────────────────────
// Relies on the CSS custom properties (--saffron, --forest, --ink, etc.)
// and the .btn-primary / .search-input / .section-title / .field-label
// classes already defined globally by the home page's <GlobalStyles />.
const TrainStyles = () => (
  <style>{`
    :root {
      --gold: #D4AF6A;
      --gold-dim: rgba(212,175,106,0.35);
    }

    .train-hero {
      padding: 150px 24px 92px;
      position: relative;
      overflow: hidden;
      isolation: isolate;
    }
    .train-hero-photo {
      position: absolute; inset: 0;
      background-image: url('https://commons.wikimedia.org/wiki/Special:FilePath/Vande%20Bharat%20Express%20around%20Mumbai.jpg');
      background-size: cover;
      background-position: center 58%;
      background-repeat: no-repeat;
      transform: scale(1.06);
      animation: heroPan 22s ease-in-out infinite alternate;
      z-index: -2;
    }
    .train-hero-scrim {
      position: absolute; inset: 0;
      background:
        radial-gradient(circle at 85% 12%, rgba(232,129,58,0.24), transparent 55%),
        linear-gradient(180deg, rgba(10,17,24,0.88) 0%, rgba(15,25,35,0.85) 45%, rgba(15,25,35,0.96) 100%),
        linear-gradient(115deg, rgba(26,60,52,0.55), rgba(15,25,35,0.55));
      z-index: -1;
    }
    @keyframes heroPan {
      from { transform: scale(1.06) translateX(0); }
      to   { transform: scale(1.12) translateX(-1.5%); }
    }
    @media (prefers-reduced-motion: reduce) {
      .train-hero-photo { animation: none; }
    }

    .train-hero-inner { max-width: 1100px; margin: 0 auto; position: relative; z-index: 1; }

    .train-hero-eyebrow-row { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
    .train-hero-hairline { flex: 1; max-width: 60px; height: 1px; background: linear-gradient(90deg, var(--gold), transparent); }

    .train-hero-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2.3rem, 5vw, 3.8rem);
      font-weight: 700; color: white; line-height: 1.12; margin-bottom: 14px;
      text-shadow: 0 6px 30px rgba(0,0,0,0.35);
    }
    .train-hero-sub {
      font-family: 'Outfit', sans-serif; font-size: 0.96rem;
      color: rgba(255,255,255,0.72); margin-bottom: 22px; max-width: 480px;
    }

    .train-hero-trust-row { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 30px; }
    .train-hero-trust-chip {
      display: inline-flex; align-items: center; gap: 7px;
      font-family: 'Outfit', sans-serif; font-size: 0.72rem; font-weight: 600;
      letter-spacing: 0.3px; color: rgba(255,255,255,0.88);
      background: rgba(255,255,255,0.08); border: 1px solid rgba(212,175,106,0.3);
      backdrop-filter: blur(6px);
      padding: 7px 13px; border-radius: 999px;
    }
    .train-hero-trust-chip svg { color: var(--gold); }

    .train-search-bar {
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(10px);
      border-radius: 20px; padding: 22px;
      box-shadow: 0 35px 90px rgba(0,0,0,0.4), 0 0 0 1px rgba(212,175,106,0.2);
      display: grid; grid-template-columns: 1fr auto 1fr auto auto;
      gap: 16px; align-items: end;
    }
    .train-search-field { display: flex; flex-direction: column; gap: 6px; }
    .train-search-input-wrap {
      display: flex; align-items: center; gap: 10px;
      border: 1.5px solid #E5E7EB; border-radius: 12px; padding: 11px 14px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .train-search-input-wrap:focus-within {
      border-color: var(--saffron); box-shadow: 0 0 0 3px rgba(232,129,58,0.12);
    }
    .train-search-input { color: var(--ink); }
    .train-swap-btn {
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--cream-deep); border: 1.5px solid #E5E7EB;
      color: var(--saffron); cursor: pointer; display: flex;
      align-items: center; justify-content: center; margin-bottom: 2px;
      transition: transform 0.3s;
    }
    .train-swap-btn:hover { transform: rotate(180deg); }
    .train-search-btn {
      padding: 13px 28px; font-size: 0.88rem; white-space: nowrap;
      position: relative; overflow: hidden;
    }
    .train-search-btn::after {
      content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
      background: linear-gradient(115deg, transparent, rgba(255,255,255,0.35), transparent);
      transform: skewX(-20deg);
      animation: shine 3.2s ease-in-out infinite;
    }
    @keyframes shine {
      0% { left: -60%; }
      50% { left: 130%; }
      100% { left: 130%; }
    }
    .train-error {
      margin-top: 16px; font-family: 'Outfit', sans-serif; font-size: 0.85rem;
      color: #FCA5A5; background: rgba(220,38,38,0.14); border: 1px solid rgba(252,165,165,0.3);
      border-radius: 10px; padding: 10px 16px; display: inline-block;
    }

    .train-results-section {
      max-width: 1100px; margin: 0 auto; padding: 64px 24px 90px; min-height: 300px;
      background-image: radial-gradient(circle, rgba(26,60,52,0.06) 1px, transparent 1px);
      background-size: 22px 22px;
    }
    .train-results-heading { text-align: center; margin-bottom: 40px; }
    .train-results-grid { display: flex; flex-direction: column; gap: 22px; }

    .train-card {
      background: white; border-radius: 20px; padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      border: 1.5px solid #F3F4F6;
      transition: box-shadow 0.35s, transform 0.35s, border-color 0.35s;
      position: relative;
      overflow: hidden;
    }
    .train-card::before {
      content: '';
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, var(--saffron), var(--gold), var(--forest));
      transform: scaleX(0); transform-origin: left;
      transition: transform 0.45s ease;
    }
    .train-card:hover { box-shadow: 0 20px 55px rgba(15,25,35,0.14); transform: translateY(-4px); border-color: rgba(212,175,106,0.3); }
    .train-card:hover::before { transform: scaleX(1); }
    .train-card-sheen { position: absolute; inset: 0; pointer-events: none; }

    .train-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; gap: 12px; flex-wrap: wrap; }
    .train-card-id { display: flex; align-items: center; gap: 14px; }
    .train-type-badge {
      font-family: 'Outfit', sans-serif; font-size: 0.62rem; font-weight: 700;
      letter-spacing: 1.1px; padding: 5px 10px; border-radius: 6px; color: white; white-space: nowrap;
    }
    .train-type-badge.superfast { background: linear-gradient(135deg, var(--saffron), var(--saffron-dark)); }
    .train-type-badge.mail { background: linear-gradient(135deg, var(--forest), var(--forest-light)); }
    .train-name { font-family: 'Cormorant Garamond', serif; font-size: 1.28rem; font-weight: 700; color: var(--ink); line-height: 1.2; }
    .train-number { font-family: 'Outfit', sans-serif; font-size: 0.75rem; color: #9CA3AF; margin-top: 2px; letter-spacing: 0.3px; }

    .train-rundays { display: flex; gap: 5px; }
    .train-rundot {
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Outfit', sans-serif; font-size: 0.65rem; font-weight: 700;
      background: #F3F4F6; color: #C1C6CE;
    }
    .train-rundot.active { background: var(--forest); color: white; }

    .train-card-route {
      display: grid; grid-template-columns: 1fr auto 1fr;
      align-items: center; gap: 16px;
      padding: 18px 0; border-top: 1px dashed #E5E7EB; border-bottom: 1px dashed #E5E7EB;
      margin-bottom: 18px;
    }
    .train-route-point.right { text-align: right; }
    .train-time { font-family: 'Cormorant Garamond', serif; font-size: 1.75rem; font-weight: 700; color: var(--ink); line-height: 1; }
    .train-station { font-family: 'Outfit', sans-serif; font-size: 0.78rem; color: #6B7280; margin-top: 4px; text-transform: uppercase; letter-spacing: 0.5px; }
    .train-dayoffset { font-family: 'Outfit', sans-serif; font-size: 0.68rem; color: var(--saffron); font-weight: 700; margin-top: 3px; }
    .train-route-line { display: flex; flex-direction: column; align-items: center; gap: 6px; color: #D1D5DB; }
    .train-route-icon { font-size: 1.1rem; color: var(--saffron); }
    .train-duration {
      display: flex; align-items: center; gap: 5px;
      font-family: 'Outfit', sans-serif; font-size: 0.7rem; font-weight: 600; color: #9CA3AF; white-space: nowrap;
    }

    .train-classes { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px; }
    .train-class-chip {
      display: flex; flex-direction: column; align-items: flex-start; gap: 2px;
      padding: 8px 14px; border-radius: 12px; cursor: pointer;
      border: 1.5px solid #E5E7EB; background: white; transition: all 0.2s;
      font-family: 'Outfit', sans-serif;
      position: relative;
    }
    .train-class-chip span.train-class-name { font-size: 0.65rem; font-weight: 400; color: #9CA3AF; }
    .train-class-chip { font-size: 0.85rem; font-weight: 700; color: var(--ink); }
    .train-class-chip.ac:hover, .train-class-chip.ac.active { border-color: var(--forest); background: rgba(26,60,52,0.06); }
    .train-class-chip.sleeper:hover, .train-class-chip.sleeper.active { border-color: var(--saffron); background: rgba(232,129,58,0.07); }
    .train-class-chip.seating:hover, .train-class-chip.seating.active { border-color: var(--sand); background: rgba(212,184,150,0.15); }
    .train-class-chip.active span.train-class-name { color: inherit; opacity: 0.65; }
    .train-class-chip.elite { padding-left: 20px; }
    .train-class-chip.elite.active, .train-class-chip.elite:hover { border-color: var(--gold); background: rgba(212,175,106,0.1); }
    .elite-dot {
      position: absolute; left: 8px; top: 50%; transform: translateY(-50%);
      width: 6px; height: 6px; border-radius: 50%; background: var(--gold);
      box-shadow: 0 0 0 3px rgba(212,175,106,0.2);
    }

    .train-card-footer { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
    .train-details-toggle {
      background: none; border: none; cursor: pointer;
      font-family: 'Outfit', sans-serif; font-size: 0.8rem; font-weight: 600; color: #6B7280;
      display: flex; align-items: center; gap: 6px;
    }
    .train-details-toggle:hover { color: var(--saffron); }
    .train-book-btn { padding: 11px 26px; font-size: 0.85rem; }

    .train-card-expanded {
      margin-top: 18px; padding-top: 18px; border-top: 1px solid #F3F4F6;
      display: flex; flex-direction: column; gap: 10px;
    }
    .train-expanded-row {
      display: flex; align-items: center; gap: 8px;
      font-family: 'Outfit', sans-serif; font-size: 0.85rem; color: #6B7280;
    }
    .train-expanded-hint { font-family: 'Outfit', sans-serif; font-size: 0.78rem; color: #B0B5BD; font-style: italic; }

    .train-empty { text-align: center; padding: 80px 24px; }
    .train-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 1.5rem; font-weight: 700; color: #9CA3AF; margin-bottom: 8px; }
    .train-empty-sub { font-family: 'Outfit', sans-serif; font-size: 0.85rem; color: #D1D5DB; }

    @media(max-width: 900px) {
      .train-hero-photo { animation: none; background-attachment: scroll; }
      .train-search-bar { grid-template-columns: 1fr; }
      .train-swap-btn { justify-self: center; transform: rotate(90deg); }
      .train-swap-btn:hover { transform: rotate(270deg); }
      .train-card-route { grid-template-columns: 1fr; text-align: center; }
      .train-route-point.right { text-align: center; }
      .train-card-top { flex-direction: column; }
    }
  `}</style>
);

export default React.memo(TrainSearch);