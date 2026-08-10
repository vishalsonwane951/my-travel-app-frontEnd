import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  FaMapMarkerAlt, FaMoon, FaUsers, FaRupeeSign, FaTrash,
  FaEye, FaWhatsapp, FaCalendarAlt, FaCompass, FaHeart,
  FaSearch, FaSortAmountDown, FaFilter, FaTimes, FaPlane,
  FaRegSadTear, FaSpinner,
} from 'react-icons/fa';
import ItineraryResult from './ItineraryResult.jsx';

// ── Session ID helper (matches ItineraryResult.jsx) ──────────
function getSessionId() {
  let id = sessionStorage.getItem('dvd_session');
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now();
    sessionStorage.setItem('dvd_session', id);
  }
  return id;
}

// const BASE = 'http://localhost:5000';

const BUDGET_LABELS = {
  budget: 'Budget', standard: 'Standard', premium: 'Premium', luxury: 'Luxury',
};

const BUDGET_COLORS = {
  budget:   { bg: '#ECFDF5', color: '#059669', border: '#A7F3D0' },
  standard: { bg: '#EFF6FF', color: '#2563EB', border: '#BFDBFE' },
  premium:  { bg: '#FFF7ED', color: '#EA580C', border: '#FED7AA' },
  luxury:   { bg: '#FDF4FF', color: '#9333EA', border: '#E9D5FF' },
};

const TRIP_ICONS = {
  Adventure: '🏔️', Relaxation: '🌊', Cultural: '🏛️',
  Family: '👨‍👩‍👧', Honeymoon: '💕', Solo: '🎒',
};

// ── Styles ────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Outfit:wght@300;400;500;600;700&display=swap');

  :root {
    --saffron: #E8813A;
    --saffron-light: #F4A261;
    --saffron-dark: #C85A1A;
    --forest: #1A3C34;
    --forest-light: #2E6B5C;
    --cream: #FBF5EC;
    --cream-deep: #F3E8D4;
    --ink: #0F1923;
    --muted: #9CA3AF;
  }

  .saved-page {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'Outfit', sans-serif;
  }

  /* ── Hero Header ── */
  .saved-hero {
    background: linear-gradient(135deg, var(--forest) 0%, var(--forest-light) 60%, #3d8b7a 100%);
    padding: 80px 24px 60px;
    position: relative;
    overflow: hidden;
  }
  .saved-hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at 70% 50%, rgba(232,129,58,0.18) 0%, transparent 65%);
  }
  .saved-hero::after {
    content: '✈';
    position: absolute;
    right: 60px; top: 40px;
    font-size: 8rem;
    opacity: 0.06;
    transform: rotate(-20deg);
    color: white;
  }
  .saved-hero-inner {
    max-width: 1200px;
    margin: 0 auto;
    position: relative; z-index: 1;
  }
  .saved-eyebrow {
    font-size: 0.72rem; font-weight: 700;
    letter-spacing: 3px; text-transform: uppercase;
    color: var(--saffron-light); margin-bottom: 12px;
  }
  .saved-hero h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.2rem, 5vw, 3.8rem);
    font-weight: 700; color: white; line-height: 1.1;
    margin-bottom: 12px;
  }
  .saved-hero p {
    font-size: 0.95rem; color: rgba(255,255,255,0.65);
    max-width: 480px; line-height: 1.6;
  }

  /* ── Controls ── */
  .saved-controls {
    background: white;
    border-bottom: 1px solid #F3F4F6;
    padding: 16px 24px;
    position: sticky; top: 0; z-index: 100;
    box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  }
  .saved-controls-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; gap: 12px; align-items: center; flex-wrap: wrap;
  }
  .search-box {
    flex: 1; min-width: 200px;
    position: relative;
  }
  .search-box input {
    width: 100%; padding: 10px 16px 10px 40px;
    border: 1.5px solid #E5E7EB; border-radius: 50px;
    font-family: 'Outfit'; font-size: 0.85rem; outline: none;
    transition: border-color 0.2s; background: #FAFAFA;
  }
  .search-box input:focus { border-color: var(--saffron); background: white; }
  .search-box svg {
    position: absolute; left: 14px; top: 50%;
    transform: translateY(-50%); color: var(--muted); font-size: 0.8rem;
  }
  .sort-select {
    padding: 10px 16px; border: 1.5px solid #E5E7EB;
    border-radius: 50px; font-family: 'Outfit'; font-size: 0.82rem;
    outline: none; cursor: pointer; background: white; color: #374151;
    transition: border-color 0.2s;
  }
  .sort-select:focus { border-color: var(--saffron); }
  .filter-chip {
    padding: 8px 16px; border-radius: 50px;
    border: 1.5px solid #E5E7EB; background: white;
    font-family: 'Outfit'; font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s; color: #6B7280;
    white-space: nowrap;
  }
  .filter-chip:hover { border-color: var(--saffron); color: var(--saffron); }
  .filter-chip.active {
    background: var(--saffron); color: white;
    border-color: var(--saffron);
    box-shadow: 0 3px 10px rgba(232,129,58,0.35);
  }
  .count-badge {
    background: var(--forest); color: white;
    font-size: 0.72rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    margin-left: auto;
  }

  /* ── Grid ── */
  .saved-grid-wrap {
    max-width: 1200px; margin: 0 auto;
    padding: 36px 24px 80px;
  }

  .saved-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
  }

  /* ── Card ── */
  .saved-card {
    background: white; border-radius: 20px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    overflow: hidden;
    transition: transform 0.35s cubic-bezier(.25,.8,.25,1), box-shadow 0.35s;
    animation: cardIn 0.5s ease forwards;
    opacity: 0;
  }
  .saved-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0,0,0,0.12);
  }
  @keyframes cardIn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .card-header {
    background: linear-gradient(135deg, var(--forest), var(--forest-light));
    padding: 22px 22px 18px;
    position: relative; overflow: hidden;
  }
  .card-header::after {
    content: ''; position: absolute;
    width: 120px; height: 120px;
    background: rgba(255,255,255,0.04);
    border-radius: 50%; bottom: -40px; right: -30px;
  }
  .card-dest {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 700; color: white;
    margin-bottom: 4px; line-height: 1.2;
  }
  .card-area {
    font-size: 0.78rem; color: rgba(255,255,255,0.65);
    margin-bottom: 14px;
  }
  .card-meta-row {
    display: flex; flex-wrap: wrap; gap: 8px;
  }
  .card-meta-chip {
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 20px; padding: 4px 12px;
    font-size: 0.74rem; color: rgba(255,255,255,0.9);
    display: flex; align-items: center; gap: 5px;
  }
  .card-trip-icon {
    position: absolute; top: 16px; right: 18px;
    font-size: 1.6rem; opacity: 0.9;
  }

  .card-body { padding: 18px 22px 20px; }

  .card-cost {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.25rem; font-weight: 700;
    color: var(--saffron); margin-bottom: 14px;
    display: flex; align-items: center; gap: 6px;
  }

  .budget-pill {
    display: inline-flex; align-items: center;
    padding: 4px 12px; border-radius: 20px;
    font-size: 0.72rem; font-weight: 700;
    border: 1.5px solid; margin-left: auto;
  }

  .card-divider {
    height: 1px; background: #F3F4F6; margin: 14px 0;
  }

  .card-date {
    font-size: 0.78rem; color: var(--muted);
    display: flex; align-items: center; gap: 6px;
    margin-bottom: 16px;
  }

  .card-actions {
    display: flex; gap: 8px;
  }
  .card-btn {
    flex: 1; padding: 10px 8px;
    border-radius: 10px; border: 1.5px solid #E5E7EB;
    background: white; font-family: 'Outfit';
    font-size: 0.78rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 6px;
    color: #374151;
  }
  .card-btn:hover { border-color: var(--saffron); color: var(--saffron); }
  .card-btn.primary {
    background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
    color: white; border-color: transparent;
    box-shadow: 0 3px 12px rgba(232,129,58,0.3);
  }
  .card-btn.primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(232,129,58,0.4);
  }
  .card-btn.danger:hover { border-color: #EF4444; color: #EF4444; }

  /* ── Empty State ── */
  .saved-empty {
    text-align: center; padding: 100px 24px;
    max-width: 460px; margin: 0 auto;
  }
  .saved-empty-icon {
    width: 100px; height: 100px; border-radius: 50%;
    background: linear-gradient(135deg, var(--cream-deep), var(--cream));
    border: 2px dashed var(--cream-deep);
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; margin: 0 auto 28px;
  }
  .saved-empty h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 700;
    color: var(--ink); margin-bottom: 10px;
  }
  .saved-empty p {
    font-size: 0.88rem; color: var(--muted);
    line-height: 1.7; margin-bottom: 28px;
  }
  .btn-plan {
    display: inline-flex; align-items: center; gap: 8px;
    background: linear-gradient(135deg, var(--saffron), var(--saffron-dark));
    color: white; border: none; border-radius: 50px;
    padding: 14px 32px; font-family: 'Outfit';
    font-size: 0.9rem; font-weight: 600;
    cursor: pointer; text-decoration: none;
    box-shadow: 0 4px 20px rgba(232,129,58,0.35);
    transition: all 0.3s;
  }
  .btn-plan:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(232,129,58,0.45); }

  /* ── Loading ── */
  .saved-loading {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 100px 24px; gap: 20px;
    color: var(--muted); font-size: 0.9rem;
  }
  .spin { animation: spin 0.9s linear infinite; color: var(--saffron); font-size: 2rem; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── Delete confirm ── */
  .delete-backdrop {
    position: fixed; inset: 0;
    background: rgba(15,25,35,0.6);
    backdrop-filter: blur(6px);
    z-index: 5000;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: fadeIn 0.2s ease;
  }
  .delete-box {
    background: white; border-radius: 20px;
    padding: 36px; max-width: 400px; width: 100%;
    text-align: center;
    box-shadow: 0 30px 80px rgba(0,0,0,0.25);
    animation: popIn 0.3s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes popIn {
    from { opacity: 0; transform: scale(0.85); }
    to   { opacity: 1; transform: scale(1); }
  }
  .delete-box h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 700;
    color: var(--ink); margin-bottom: 10px;
  }
  .delete-box p { font-size: 0.88rem; color: var(--muted); margin-bottom: 28px; line-height: 1.6; }
  .delete-actions { display: flex; gap: 12px; }
  .btn-cancel {
    flex: 1; padding: 13px; border-radius: 12px;
    border: 1.5px solid #E5E7EB; background: white;
    font-family: 'Outfit'; font-weight: 600; font-size: 0.9rem;
    cursor: pointer; transition: all 0.2s;
  }
  .btn-cancel:hover { border-color: #9CA3AF; }
  .btn-delete-confirm {
    flex: 1; padding: 13px; border-radius: 12px;
    border: none; background: #EF4444; color: white;
    font-family: 'Outfit'; font-weight: 600; font-size: 0.9rem;
    cursor: pointer; transition: all 0.2s;
    box-shadow: 0 4px 14px rgba(239,68,68,0.3);
  }
  .btn-delete-confirm:hover { background: #DC2626; transform: translateY(-1px); }

  /* ── Detail overlay ── */
  .detail-overlay {
    position: fixed; inset: 0;
    background: var(--cream);
    z-index: 4000; overflow-y: auto;
    animation: fadeIn 0.35s ease;
  }
  .detail-topbar {
    position: sticky; top: 0;
    background: rgba(251,245,236,0.95);
    backdrop-filter: blur(12px);
    padding: 14px 24px;
    border-bottom: 1px solid var(--cream-deep);
    display: flex; align-items: center; gap: 14px;
    z-index: 10;
  }
  .topbar-back {
    display: flex; align-items: center; gap: 6px;
    background: none; border: 1.5px solid #E5E7EB;
    border-radius: 10px; padding: 8px 16px;
    font-family: 'Outfit'; font-size: 0.85rem;
    font-weight: 600; cursor: pointer; color: var(--ink);
    transition: all 0.2s;
  }
  .topbar-back:hover { border-color: var(--saffron); color: var(--saffron); }
  .topbar-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 700; color: var(--ink);
  }

  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

  /* ── Stats bar ── */
  .saved-stats {
    display: flex; gap: 24px; flex-wrap: wrap;
    margin-top: 28px;
  }
  .stat-item {
    display: flex; flex-direction: column; gap: 2px;
  }
  .stat-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 700; color: white; line-height: 1;
  }
  .stat-lbl {
    font-size: 0.72rem; color: rgba(255,255,255,0.55);
    letter-spacing: 1px; text-transform: uppercase;
  }

  @media(max-width: 768px) {
    .saved-grid { grid-template-columns: 1fr; }
    .saved-controls-inner { gap: 8px; }
    .filter-chip { display: none; }
    .card-actions { flex-wrap: wrap; }
  }
`;

// ── Main Component ─────────────────────────────────────────────
export default function SavedItineraries({ onPlanNew }) {
  const [itineraries,    setItineraries]    = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState('');
  const [searchTerm,     setSearchTerm]     = useState('');
  const [sortBy,         setSortBy]         = useState('newest');
  const [filterBudget,   setFilterBudget]   = useState('all');
  const [deleteTarget,   setDeleteTarget]   = useState(null);
  const [deleting,       setDeleting]       = useState(false);
  const [viewItinerary,  setViewItinerary]  = useState(null);
  const [loadingDetail,  setLoadingDetail]  = useState(null);

  // ── Fetch list ──────────────────────────────────────────────
  const fetchSaved = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const sessionId = getSessionId();
      const res  = await api.get(`/saved?sessionId=${sessionId}`);
      const data = await res.json();
      if (data.success) setItineraries(data.itineraries || []);
      else setError('Could not load your saved trips.');
    } catch {
      setError('Server not reachable. Is the backend running?');
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSaved(); }, [fetchSaved]);

  // ── Load full itinerary for viewing ────────────────────────
  const handleView = useCallback(async (id) => {
    setLoadingDetail(id);
    try {
      const res  = await fetch(`${BASE}/api/saved/${id}`);
      const data = await res.json();
      if (data.success) setViewItinerary(data.itinerary);
    } catch {
      alert('Could not load itinerary details.');
    }
    setLoadingDetail(null);
  }, []);

  // ── Delete ──────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await fetch(`${BASE}/api/saved/${deleteTarget}`, { method: 'DELETE' });
      setItineraries(prev => prev.filter(i => i._id !== deleteTarget));
    } catch {
      alert('Could not delete. Try again.');
    }
    setDeleting(false);
    setDeleteTarget(null);
  }, [deleteTarget]);

  // ── WhatsApp share ──────────────────────────────────────────
  const handleShare = useCallback((item) => {
    const text = `🌏 My DesiVDesi Trip Plan!\n\n📍 ${item.destination}${item.area ? ` · ${item.area}` : ''}\n📅 ${item.checkin} → ${item.checkout} (${item.nights} nights)\n👥 ${item.travelers} traveler(s) · ${item.tripType}\n💰 ${item.totalCostEstimate}\n\nPlanned with DesiVDesi AI Trip Planner ✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  }, []);

  // ── Filter + Sort ───────────────────────────────────────────
  const displayed = itineraries
    .filter(i => {
      const q = searchTerm.toLowerCase();
      const matchSearch = !q ||
        i.destination?.toLowerCase().includes(q) ||
        i.area?.toLowerCase().includes(q) ||
        i.tripType?.toLowerCase().includes(q);
      const matchBudget = filterBudget === 'all' || i.budget === filterBudget;
      return matchSearch && matchBudget;
    })
    .sort((a, b) => {
      if (sortBy === 'newest')      return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest')      return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'destination') return a.destination.localeCompare(b.destination);
      if (sortBy === 'nights')      return (b.nights || 0) - (a.nights || 0);
      return 0;
    });

  // ── Stats ───────────────────────────────────────────────────
  const totalNights     = itineraries.reduce((s, i) => s + (i.nights || 0), 0);
  const uniqueDests     = new Set(itineraries.map(i => i.destination)).size;
  const mostRecentTrip  = itineraries[0]?.destination || '—';

  // ── Detail overlay ──────────────────────────────────────────
  if (viewItinerary) {
    return (
      <>
        <style>{styles}</style>
        <div className="detail-overlay">
          <div className="detail-topbar">
            <button className="topbar-back" onClick={() => setViewItinerary(null)}>
              ← Back to Saved Trips
            </button>
            <span className="topbar-title">
              {viewItinerary.destination}{viewItinerary.area ? ` · ${viewItinerary.area}` : ''} ✨
            </span>
          </div>
          <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
            <ItineraryResult
              itinerary={viewItinerary}
              onPlanAgain={() => { setViewItinerary(null); onPlanNew?.(); }}
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="saved-page">

        {/* ── Hero ── */}
        <div className="saved-hero">
          <div className="saved-hero-inner">
            <div className="saved-eyebrow">My Travel Journal</div>
            <h1>Saved <em style={{ color: 'var(--saffron-light)', fontStyle: 'italic' }}>Itineraries</em></h1>
            <p>All your AI-crafted trip plans in one place — revisit, share, or plan your next adventure.</p>

            {/* Stats */}
            {itineraries.length > 0 && (
              <div className="saved-stats">
                <div className="stat-item">
                  <span className="stat-val">{itineraries.length}</span>
                  <span className="stat-lbl">Trips Planned</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">{uniqueDests}</span>
                  <span className="stat-lbl">Destinations</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val">{totalNights}</span>
                  <span className="stat-lbl">Total Nights</span>
                </div>
                <div className="stat-item">
                  <span className="stat-val" style={{ fontSize: '1.1rem', paddingTop: 4 }}>{mostRecentTrip}</span>
                  <span className="stat-lbl">Latest Trip</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Controls ── */}
        {itineraries.length > 0 && (
          <div className="saved-controls">
            <div className="saved-controls-inner">
              {/* Search */}
              <div className="search-box">
                <FaSearch />
                <input
                  placeholder="Search destination, type…"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Sort */}
              <select
                className="sort-select"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="destination">A → Z</option>
                <option value="nights">Longest Trip</option>
              </select>

              {/* Budget filters */}
              {['all', 'budget', 'standard', 'premium', 'luxury'].map(b => (
                <button
                  key={b}
                  className={`filter-chip ${filterBudget === b ? 'active' : ''}`}
                  onClick={() => setFilterBudget(b)}
                >
                  {b === 'all' ? 'All' : BUDGET_LABELS[b]}
                </button>
              ))}

              {/* Count */}
              <span className="count-badge">{displayed.length} trip{displayed.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        )}

        {/* ── Content ── */}
        <div className="saved-grid-wrap">

          {/* Loading */}
          {loading && (
            <div className="saved-loading">
              <FaSpinner className="spin" />
              <span>Loading your saved trips…</span>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{ textAlign: 'center', padding: '60px 24px' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>⚠️</div>
              <p style={{ color: '#DC2626', fontFamily: 'Outfit', marginBottom: 20 }}>{error}</p>
              <button className="btn-plan" onClick={fetchSaved}>Try Again</button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && itineraries.length === 0 && (
            <div className="saved-empty">
              <div className="saved-empty-icon">🗺️</div>
              <h2>No Trips Saved Yet</h2>
              <p>
                You haven't saved any itineraries yet. Plan a trip with our AI Trip Planner
                and hit <strong>"Save Itinerary"</strong> to see it here.
              </p>
              <button className="btn-plan" onClick={onPlanNew}>
                <FaCompass /> Plan My First Trip ✨
              </button>
            </div>
          )}

          {/* No search results */}
          {!loading && !error && itineraries.length > 0 && displayed.length === 0 && (
            <div className="saved-empty">
              <div className="saved-empty-icon"><FaRegSadTear /></div>
              <h2>No Matches Found</h2>
              <p>No saved trips match your current search or filter. Try clearing the filters.</p>
              <button className="btn-plan" onClick={() => { setSearchTerm(''); setFilterBudget('all'); }}>
                Clear Filters
              </button>
            </div>
          )}

          {/* Grid */}
          {!loading && !error && displayed.length > 0 && (
            <div className="saved-grid">
              {displayed.map((item, idx) => {
                const budgetStyle = BUDGET_COLORS[item.budget] || BUDGET_COLORS.standard;
                const savedDate   = new Date(item.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric', month: 'short', year: 'numeric',
                });

                return (
                  <div
                    key={item._id}
                    className="saved-card"
                    style={{ animationDelay: `${idx * 0.06}s` }}
                  >
                    {/* Card header */}
                    <div className="card-header">
                      <span className="card-trip-icon">
                        {TRIP_ICONS[item.tripType] || '✈️'}
                      </span>
                      <div className="card-dest">{item.destination}</div>
                      {item.area && <div className="card-area">📍 {item.area}</div>}
                      <div className="card-meta-row">
                        <span className="card-meta-chip">
                          <FaMoon size={10} /> {item.nights} night{item.nights !== 1 ? 's' : ''}
                        </span>
                        <span className="card-meta-chip">
                          <FaUsers size={10} /> {item.travelers} traveler{item.travelers !== 1 ? 's' : ''}
                        </span>
                        {item.tripType && (
                          <span className="card-meta-chip">{item.tripType}</span>
                        )}
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="card-body">
                      {/* Cost + Budget */}
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                        <div className="card-cost">
                          <FaRupeeSign size={13} />
                          {item.totalCostEstimate?.replace('₹', '').split('(')[0].trim() || 'Estimated'}
                        </div>
                        <span
                          className="budget-pill"
                          style={{
                            background: budgetStyle.bg,
                            color: budgetStyle.color,
                            borderColor: budgetStyle.border,
                          }}
                        >
                          {BUDGET_LABELS[item.budget] || item.budget}
                        </span>
                      </div>

                      {/* Dates */}
                      {(item.checkin || item.checkout) && (
                        <div className="card-date">
                          <FaCalendarAlt size={11} />
                          {item.checkin} → {item.checkout}
                        </div>
                      )}

                      <div className="card-divider" />

                      {/* Saved on */}
                      <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginBottom: 14 }}>
                        Saved on {savedDate}
                      </div>

                      {/* Actions */}
                      <div className="card-actions">
                        <button
                          className="card-btn primary"
                          onClick={() => handleView(item._id)}
                          disabled={loadingDetail === item._id}
                        >
                          {loadingDetail === item._id
                            ? <FaSpinner style={{ animation: 'spin 0.8s linear infinite' }} />
                            : <FaEye size={12} />
                          }
                          View
                        </button>
                        <button
                          className="card-btn"
                          onClick={() => handleShare(item)}
                        >
                          <FaWhatsapp size={12} style={{ color: '#25D366' }} />
                          Share
                        </button>
                        <button
                          className="card-btn danger"
                          onClick={() => setDeleteTarget(item._id)}
                        >
                          <FaTrash size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Plan new CTA at bottom */}
          {!loading && itineraries.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 56 }}>
              <p style={{ fontFamily: 'Outfit', fontSize: '0.88rem', color: 'var(--muted)', marginBottom: 16 }}>
                Ready for your next adventure?
              </p>
              <button className="btn-plan" onClick={onPlanNew}>
                <FaPlane /> Plan Another Trip ✨
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── Delete confirm modal ── */}
      {deleteTarget && (
        <div className="delete-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="delete-box" onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '2.5rem', marginBottom: 16 }}>🗑️</div>
            <h3>Delete This Trip?</h3>
            <p>
              This itinerary will be permanently removed from your saved trips.
              This action cannot be undone.
            </p>
            <div className="delete-actions">
              <button className="btn-cancel" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className="btn-delete-confirm"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? 'Deleting…' : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}