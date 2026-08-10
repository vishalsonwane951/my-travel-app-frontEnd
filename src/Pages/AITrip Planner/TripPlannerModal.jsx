import { useState, useRef, useEffect, useCallback } from 'react';
import {
  searchDestinations,
  searchAreas,
  getPlaceDetails,
  highlightMatch,
} from '../../utils/places.js';
import api from '../../utils/api.js';

const TP_STYLES = `
.tp-scope {
  --cream: #FBF6ED;
  --cream-deep: #F3EAD8;
  --ink: #241E17;
  --ink-soft: #4A3F33;
  --muted: #9C9082;
  --saffron: #E08A2C;
  --saffron-dark: #B96A1B;
  --saffron-tint: #FBEDDB;
  --sage: #6E8B6A;
  --sage-tint: #EAF0E7;
  --border: #E4D9C4;
  --danger: #C0392B;
  --danger-tint: #FBEAE7;
  --white: #FFFFFF;
  --shadow: 0 24px 60px -20px rgba(36, 30, 23, 0.35);
  --font-display: 'Cormorant Garamond', serif;
  --font-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-family: var(--font-body);
  color: var(--ink);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(36, 30, 23, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.modal-box {
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  background: var(--cream);
  border-radius: 20px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 28px 28px 24px;
  scrollbar-width: thin;
  scrollbar-color: var(--border) transparent;
}

.modal-box::-webkit-scrollbar { width: 6px; }
.modal-box::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; }

.close-btn {
  background: none;
  border: none;
  font-size: 1.4rem;
  line-height: 1;
  cursor: pointer;
  color: var(--muted);
  padding: 4px;
  border-radius: 999px;
  transition: color 0.15s, background 0.15s;
}
.close-btn:hover { color: var(--ink); background: var(--cream-deep); }

.tp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 18px; }
.tp-eyebrow {
  font-size: 0.7rem; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase;
  color: var(--saffron-dark); margin-bottom: 6px;
}
.tp-title { font-family: var(--font-display); font-size: 1.9rem; font-weight: 700; color: var(--ink); line-height: 1.1; }

.journey-progress {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 4px 4px 28px;
  height: 28px;
}

.journey-progress::before {
  content: '';
  position: absolute;
  left: 10px; right: 10px; top: 50%;
  height: 1px;
  background-image: linear-gradient(to right, var(--border) 60%, transparent 0%);
  background-size: 8px 1px;
  background-repeat: repeat-x;
  transform: translateY(-50%);
}

.journey-progress .journey-fill {
  position: absolute;
  left: 10px; top: 50%;
  height: 2px;
  background: var(--saffron);
  transform: translateY(-50%);
  transition: width 0.35s ease;
  z-index: 1;
}

.journey-stop {
  position: relative;
  z-index: 2;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--cream);
  border: 2px solid var(--border);
  transition: border-color 0.25s, background 0.25s, transform 0.25s;
}
.journey-stop.done { border-color: var(--saffron); background: var(--saffron); }
.journey-stop.active {
  border-color: var(--saffron);
  background: var(--white);
  transform: scale(1.35);
}
.journey-stop.active::after {
  content: '✈';
  position: absolute;
  top: -22px; left: 50%;
  transform: translateX(-50%) rotate(45deg);
  font-size: 12px;
  color: var(--saffron-dark);
}

.step-enter { animation: tp-fade-up 0.28s ease both; }
@keyframes tp-fade-up {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .step-enter { animation: none; }
}

.step-title { font-family: var(--font-display); font-size: 1.3rem; font-weight: 600; color: var(--ink); margin-bottom: 18px; }

.field-label {
  font-size: 0.82rem; font-weight: 600; color: var(--ink-soft);
  display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px;
}
.field-hint { font-size: 0.72rem; font-weight: 400; color: var(--muted); }

.input {
  width: 100%;
  font-family: var(--font-body);
  font-size: 0.92rem;
  color: var(--ink);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 11px 14px;
  outline: none;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.input::placeholder { color: var(--muted); }
.input:focus {
  border-color: var(--saffron);
  box-shadow: 0 0 0 3px var(--saffron-tint);
}

.ac-wrap { position: relative; }
.ac-inner { position: relative; }

.clear-btn {
  position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
  background: none; border: none; color: var(--muted); cursor: pointer;
  font-size: 0.75rem; padding: 4px; opacity: 0; pointer-events: none;
  transition: opacity 0.15s, color 0.15s;
}
.clear-btn.show { opacity: 1; pointer-events: auto; }
.clear-btn:hover { color: var(--danger); }

.dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0; right: 0;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: var(--shadow);
  max-height: 260px;
  overflow-y: auto;
  z-index: 10;
  padding: 6px;
}

.dropdown-item {
  display: flex; align-items: flex-start; gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.88rem;
  color: var(--ink);
  transition: background 0.12s;
}
.dropdown-item:hover, .dropdown-item.focused { background: var(--saffron-tint); }
.dropdown-item mark { background: var(--saffron-tint); color: var(--saffron-dark); font-weight: 600; border-radius: 2px; }

.dd-icon { font-size: 0.85rem; margin-top: 1px; }
.dd-sub { font-size: 0.72rem; color: var(--muted); margin-top: 1px; }

.dd-kbhint {
  display: flex; gap: 12px;
  padding: 8px 10px 4px;
  border-top: 1px solid var(--border);
  margin-top: 4px;
  font-size: 0.68rem;
  color: var(--muted);
}
.dd-kbhint kbd {
  font-family: var(--font-body);
  background: var(--cream-deep);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 1px 5px;
  font-size: 0.65rem;
}

.area-wrap {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.25s ease, margin 0.3s ease;
}
.area-wrap.visible { max-height: 220px; opacity: 1; margin-bottom: 18px; }

.date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 4px; }

.nights-info { min-height: 22px; margin-top: 10px; }
.nights-badge {
  display: inline-block;
  font-size: 0.75rem; font-weight: 600;
  color: var(--saffron-dark);
  background: var(--saffron-tint);
  border-radius: 999px;
  padding: 4px 12px;
}

.pills { display: flex; flex-wrap: wrap; gap: 8px; }

.pill {
  font-family: var(--font-body);
  font-size: 0.82rem; font-weight: 500;
  color: var(--ink-soft);
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 8px 16px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}
.pill:hover { border-color: var(--saffron); }
.pill.active {
  background: var(--saffron);
  border-color: var(--saffron);
  color: var(--white);
}

.range-wrap { margin-bottom: 22px; }
.range-label { font-size: 0.82rem; font-weight: 600; color: var(--ink-soft); display: block; margin-bottom: 8px; }
.range-val { color: var(--saffron-dark); font-weight: 700; }

.range-wrap input[type="range"] {
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  border-radius: 2px;
  background: var(--border);
  outline: none;
}
.range-wrap input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--saffron);
  border: 3px solid var(--white);
  box-shadow: 0 1px 4px rgba(36, 30, 23, 0.3);
  cursor: pointer;
}
.range-wrap input[type="range"]::-moz-range-thumb {
  width: 18px; height: 18px;
  border-radius: 50%;
  background: var(--saffron);
  border: 3px solid var(--white);
  cursor: pointer;
}

.budget-card {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--white);
  cursor: pointer;
  margin-bottom: 10px;
  transition: border-color 0.15s, background 0.15s;
}
.budget-card:hover { border-color: var(--saffron); }
.budget-card.active { border-color: var(--saffron); background: var(--saffron-tint); }

.budget-radio {
  width: 18px; height: 18px;
  border-radius: 50%;
  border: 2px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: border-color 0.15s;
}
.budget-card.active .budget-radio { border-color: var(--saffron); }
.budget-dot {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--saffron);
  transform: scale(0);
  transition: transform 0.15s;
}
.budget-card.active .budget-dot { transform: scale(1); }
.budget-label { font-size: 0.9rem; color: var(--ink); }

.error-msg {
  font-size: 0.78rem;
  color: var(--danger);
  margin-top: 6px;
}

.footer-btns { display: flex; gap: 10px; margin-top: 26px; }

.btn-primary {
  flex: 1;
  font-family: var(--font-body);
  font-size: 0.92rem; font-weight: 600;
  color: var(--white);
  background: var(--saffron);
  border: none;
  border-radius: 10px;
  padding: 13px 20px;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  transition: background 0.15s, transform 0.1s;
}
.btn-primary:hover:not(:disabled) { background: var(--saffron-dark); }
.btn-primary:active:not(:disabled) { transform: scale(0.98); }
.btn-primary:disabled { opacity: 0.7; cursor: not-allowed; }

.btn-back {
  font-family: var(--font-body);
  font-size: 0.92rem; font-weight: 500;
  color: var(--ink-soft);
  background: none;
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 13px 18px;
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
}
.btn-back:hover { background: var(--cream-deep); }

.spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: var(--white);
  border-radius: 50%;
  animation: tp-spin 0.7s linear infinite;
}
@keyframes tp-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .spinner { animation: tp-spin 1.4s linear infinite; }
}

.tp-scope button:focus-visible,
.tp-scope input:focus-visible {
  outline: 2px solid var(--saffron-dark);
  outline-offset: 2px;
}

@media (max-width: 420px) {
  .modal-box { padding: 22px 18px 18px; border-radius: 16px; }
  .tp-title { font-size: 1.6rem; }
  .date-row { grid-template-columns: 1fr; }
  .footer-btns { flex-direction: column-reverse; }
  .btn-back { text-align: center; }
}
`;

const TRIP_TYPES = ['Adventure', 'Relaxation', 'Cultural', 'Family', 'Honeymoon', 'Solo'];
const PACES = [
  { value: 'relaxed', label: 'Relaxed', hint: '2–3 stops/day' },
  { value: 'balanced', label: 'Balanced', hint: '3–4 stops/day' },
  { value: 'packed', label: 'Packed', hint: '5+ stops/day' },
];
const DIETS = ['Any', 'Vegetarian', 'Vegan', 'Non-vegetarian', 'No seafood'];
const BUDGETS = [
  { value: 'budget', label: 'Budget', range: '₹10,000 – ₹25,000' },
  { value: 'standard', label: 'Standard', range: '₹25,000 – ₹60,000' },
  { value: 'premium', label: 'Premium', range: '₹60,000 – ₹1,20,000' },
  { value: 'luxury', label: 'Luxury', range: '₹1,20,000+' },
];
const STEP_LABELS = ['Destination', 'Travelers', 'Budget'];

// ── Async autocomplete hook ────────────────────────────────────────────────────
function useAutocomplete(fetchFn) {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [focusIdx, setFocusIdx] = useState(-1);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  const handleInput = useCallback(async (val) => {
    setValue(val);
    setFocusIdx(-1);
    clearTimeout(timer.current);
    if (!val || val.trim().length < 2) {
      setSuggestions([]); setOpen(false); return;
    }
    timer.current = setTimeout(async () => {
      setLoading(true);
      const results = await fetchFn(val);
      setSuggestions(results);
      setOpen(results.length > 0);
      setLoading(false);
    }, 220);
  }, [fetchFn]);

  const pick = useCallback((name) => {
    setValue(name); setOpen(false); setFocusIdx(-1); setSuggestions([]);
  }, []);

  const clear = useCallback(() => {
    setValue(''); setSuggestions([]); setOpen(false);
  }, []);

  const handleKey = useCallback((e, onEnterFree) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusIdx(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusIdx(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      if (focusIdx >= 0 && suggestions[focusIdx]) {
        pick(suggestions[focusIdx].name ?? suggestions[focusIdx]);
      } else {
        setOpen(false);
        onEnterFree?.();
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }, [open, focusIdx, suggestions, pick]);

  return {
    value, setValue, suggestions, open, setOpen,
    loading, focusIdx, handleInput, pick, clear, handleKey,
  };
}

// ── Journey progress (signature element) ────────────────────────────────────
function JourneyProgress({ step }) {
  const fillPct = ((step - 1) / (STEP_LABELS.length - 1)) * 100;
  return (
    <div className="journey-progress" aria-label={`Step ${step} of ${STEP_LABELS.length}: ${STEP_LABELS[step - 1]}`}>
      <div className="journey-fill" style={{ width: `${fillPct}%` }} />
      {STEP_LABELS.map((_, i) => {
        const n = i + 1;
        const cls = n < step ? 'done' : n === step ? 'active' : '';
        return <div key={n} className={`journey-stop ${cls}`} />;
      })}
    </div>
  );
}

// ── Main Modal ─────────────────────────────────────────────────────────────────
export default function TripPlannerModal({ open, onClose, onItinerary }) {
  const [step, setStep] = useState(1);
  const [travelers, setTravelers] = useState(2);
  const [tripType, setTripType] = useState('');
  const [pace, setPace] = useState('balanced');
  const [diet, setDiet] = useState('Any');
  const [budget, setBudget] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [destLocation, setDestLocation] = useState(null); // lat,lng for area bias
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dest = useAutocomplete(useCallback(q => searchDestinations(q), []));
  const area = useAutocomplete(
    useCallback(q => searchAreas(q, destLocation), [destLocation])
  );

  const showArea = dest.value.trim().length >= 2;

  const nights = (() => {
    if (!checkin || !checkout) return null;
    const d = Math.round((new Date(checkout) - new Date(checkin)) / 86400000);
    return d > 0 ? d : null;
  })();

  // When user picks a destination — fetch lat/lng to bias area search
  const handlePickDest = useCallback(async (suggestion) => {
    dest.pick(suggestion.name);
    area.clear();
    setDestLocation(null);
    if (suggestion.placeId) {
      const details = await getPlaceDetails(suggestion.placeId);
      if (details?.location) setDestLocation(details.location);
    }
  }, [dest, area]);

  // Reset area when destination text changes
  useEffect(() => {
    area.clear();
    setDestLocation(null);
  }, [dest.value]); // eslint-disable-line

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.ac-wrap')) {
        dest.setOpen(false);
        area.setOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []); // eslint-disable-line

  if (!open) return null;

  const today = new Date().toISOString().split('T')[0];

  function validate(s) {
    const err = {};
    if (s === 1) {
      if (!dest.value.trim()) err.destination = 'Please enter a destination';
      if (!checkin) err.checkin = 'Select check-in date';
      if (!checkout) err.checkout = 'Select check-out date';
      if (checkin && checkout && nights === null)
        err.checkout = 'Check-out must be after check-in';
    }
    if (s === 2 && !tripType) err.tripType = 'Please pick a trip type';
    if (s === 3 && !budget) err.budget = 'Please select a budget';
    return err;
  }

  function next() {
    const err = validate(step);
    if (Object.keys(err).length) { setErrors(err); return; }
    setErrors({});
    setStep(s => s + 1);
  }

  async function submit() {
    const err = validate(3);
    if (Object.keys(err).length) { setErrors(err); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await api.post('/plan-trip', {
        destination: dest.value.trim(),
        area: area.value.trim(),
        checkin,
        checkout,
        travelers,
        tripType,
        pace,
        diet,
        budget,
      });

      const data = res.data; // axios already parses JSON — no res.json(), no res.ok

      if (!data.success) {
        setErrors({ api: data.errors?.join(', ') || data.error || 'Something went wrong' });
        setLoading(false);
        return;
      }

      onItinerary(data.itinerary);
      onClose();
    } catch (e) {
      console.error('[plan-trip] request failed:', e);
      const msg =
        e.response?.data?.error ||
        e.response?.data?.errors?.join(', ') ||
        'Network error. Is the server running on port 5000?';
      setErrors({ api: msg });
      setLoading(false);
    }
  }

  // ── Dropdown ──────────────────────────────────────────────────────────────
  function Dropdown({ ac, onPick }) {
    if (!ac.open || !ac.suggestions.length) return null;
    return (
      <div className="dropdown">
        {ac.suggestions.map((s, i) => {
          const name = typeof s === 'string' ? s : s.name;
          const sub = typeof s === 'string' ? null : s.sub;
          return (
            <div
              key={i}
              className={`dropdown-item${i === ac.focusIdx ? ' focused' : ''}`}
              onMouseDown={() => onPick ? onPick(s) : ac.pick(name)}
            >
              <span className="dd-icon">{sub ? '📍' : '🗺'}</span>
              <span>
                <span dangerouslySetInnerHTML={{ __html: highlightMatch(name, ac.value) }} />
                {sub && <div className="dd-sub">{sub}</div>}
              </span>
            </div>
          );
        })}
        <div className="dd-kbhint">
          <span><kbd>↑↓</kbd> navigate</span>
          <span><kbd>Enter</kbd> select</span>
          <span><kbd>Esc</kbd> close</span>
        </div>
      </div>
    );
  }

  return (
    <div className="tp-scope modal-backdrop" onClick={onClose}>
      <style>{TP_STYLES}</style>
      <div className="modal-box" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Plan your trip">

        {/* Header */}
        <div className="tp-header">
          <div>
            <div className="tp-eyebrow">AI-Powered</div>
            <h2 className="tp-title">Plan your trip</h2>
          </div>
          <button onClick={onClose} className="close-btn" aria-label="Close">×</button>
        </div>

        {/* Journey progress */}
        <JourneyProgress step={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div className="step-enter">
            <h3 className="step-title">Where do you want to go?</h3>

            {/* Destination */}
            <div style={{ marginBottom: 18 }}>
              <div className="field-label">
                Destination
                <span className="field-hint">type or pick a suggestion</span>
              </div>
              <div className="ac-wrap">
                <div className="ac-inner">
                  <input
                    className="input"
                    type="text"
                    placeholder="e.g. Goa, Kerala, Bali, Manali…"
                    autoComplete="off"
                    value={dest.value}
                    onChange={e => dest.handleInput(e.target.value)}
                    onFocus={() => { if (!dest.value) dest.handleInput(''); }}
                    onKeyDown={e => dest.handleKey(e)}
                  />
                  {dest.loading && (
                    <span style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', fontSize: '0.7rem', color: 'var(--muted)' }}>…</span>
                  )}
                  {dest.value && !dest.loading && (
                    <button className="clear-btn show" onClick={dest.clear} tabIndex={-1} aria-label="Clear destination">✕</button>
                  )}
                </div>
                <Dropdown ac={dest} onPick={handlePickDest} />
              </div>
              {errors.destination && <div className="error-msg">{errors.destination}</div>}
            </div>

            {/* Area within destination */}
            <div className={`area-wrap${showArea ? ' visible' : ''}`}>
              <div style={{ marginBottom: 0 }}>
                <div className="field-label">
                  Where in <strong style={{ color: 'var(--saffron-dark)' }}>{dest.value || '—'}</strong>?
                  <span className="field-hint">optional · type or pick</span>
                </div>
                <div className="ac-wrap">
                  <div className="ac-inner">
                    <input
                      className="input"
                      type="text"
                      placeholder="Specific area, beach, neighbourhood…"
                      autoComplete="off"
                      value={area.value}
                      onChange={e => area.handleInput(e.target.value)}
                      onKeyDown={e => area.handleKey(e)}
                    />
                    {area.value && (
                      <button className="clear-btn show" onClick={area.clear} tabIndex={-1} aria-label="Clear area">✕</button>
                    )}
                  </div>
                  <Dropdown ac={area} />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="date-row">
              <div>
                <div className="field-label">Check-in</div>
                <input
                  className="input"
                  type="date"
                  min={today}
                  value={checkin}
                  onChange={e => {
                    setCheckin(e.target.value);
                    if (checkout && checkout < e.target.value) setCheckout('');
                  }}
                />
                {errors.checkin && <div className="error-msg">{errors.checkin}</div>}
              </div>
              <div>
                <div className="field-label">Check-out</div>
                <input
                  className="input"
                  type="date"
                  min={checkin || today}
                  value={checkout}
                  onChange={e => setCheckout(e.target.value)}
                />
                {errors.checkout && <div className="error-msg">{errors.checkout}</div>}
              </div>
            </div>
            <div className="nights-info">
              {nights && <span className="nights-badge">{nights} night{nights > 1 ? 's' : ''}</span>}
            </div>

            <div className="footer-btns">
              <button className="btn-primary" style={{ flex: 1 }} onClick={next}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div className="step-enter">
            <h3 className="step-title">Who's traveling?</h3>

            <div className="range-wrap">
              <span className="range-label">
                Travelers: <span className="range-val">{travelers}</span>
              </span>
              <input
                type="range" min={1} max={20} value={travelers}
                onChange={e => setTravelers(+e.target.value)}
              />
            </div>

            <div className="field-label" style={{ marginBottom: 10 }}>Trip type</div>
            <div className="pills">
              {TRIP_TYPES.map(t => (
                <button
                  key={t}
                  className={`pill${tripType === t ? ' active' : ''}`}
                  onClick={() => setTripType(t)}
                >{t}</button>
              ))}
            </div>
            {errors.tripType && (
              <div className="error-msg" style={{ marginTop: 6 }}>{errors.tripType}</div>
            )}

            <div className="field-label" style={{ marginTop: 20, marginBottom: 10 }}>
              Pace
              <span className="field-hint">how packed should each day be</span>
            </div>
            <div className="pills">
              {PACES.map(p => (
                <button
                  key={p.value}
                  className={`pill${pace === p.value ? ' active' : ''}`}
                  onClick={() => setPace(p.value)}
                  title={p.hint}
                >{p.label}</button>
              ))}
            </div>

            <div className="field-label" style={{ marginTop: 20, marginBottom: 10 }}>
              Dietary preference
            </div>
            <div className="pills">
              {DIETS.map(d => (
                <button
                  key={d}
                  className={`pill${diet === d ? ' active' : ''}`}
                  onClick={() => setDiet(d)}
                >{d}</button>
              ))}
            </div>

            <div className="footer-btns">
              <button className="btn-back" onClick={() => setStep(1)}>← Back</button>
              <button className="btn-primary" onClick={next}>Continue →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && (
          <div className="step-enter">
            <h3 className="step-title">What's your budget?</h3>

            {BUDGETS.map(b => (
              <div
                key={b.value}
                className={`budget-card${budget === b.value ? ' active' : ''}`}
                onClick={() => setBudget(b.value)}
              >
                <div className="budget-radio"><div className="budget-dot" /></div>
                <span className="budget-label">{b.label} &nbsp;·&nbsp; {b.range}</span>
              </div>
            ))}
            {errors.budget && <div className="error-msg">{errors.budget}</div>}
            {errors.api && (
              <div className="error-msg" style={{ marginTop: 8, padding: '10px 14px', background: 'var(--danger-tint)', borderRadius: 8 }}>
                {errors.api}
              </div>
            )}

            <div className="footer-btns">
              <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
              <button className="btn-primary" onClick={submit} disabled={loading}>
                {loading
                  ? <><div className="spinner" /> Crafting your trip…</>
                  : 'Get my itinerary'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}