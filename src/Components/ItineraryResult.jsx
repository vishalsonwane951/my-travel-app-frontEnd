import { useState } from 'react';
import {
  FaMapMarkerAlt, FaClock, FaUsers, FaStar, FaHotel,
  FaRupeeSign, FaUtensils, FaLightbulb, FaBus, FaWhatsapp,
  FaDownload, FaCalendarAlt, FaMoon,
} from 'react-icons/fa';

// ── Helpers ────────────────────────────────────────────────────
const MEAL_ICONS = { Breakfast: '☕', Lunch: '🍱', Dinner: '🍽️' };

const TYPE_COLORS = {
  budget:      { bg: '#ECFDF5', color: '#059669' },
  'mid-range': { bg: '#EFF6FF', color: '#2563EB' },
  premium:     { bg: '#FEF3C7', color: '#D97706' },
  luxury:      { bg: '#FDF2F8', color: '#9333EA' },
};

// Map time string → slot label + emoji
function timeToSlot(timeStr = '') {
  const hour = parseInt(timeStr.split(':')[0], 10);
  if (hour < 12)  return { label: 'Morning',   emoji: '🌅' };
  if (hour < 17)  return { label: 'Afternoon', emoji: '☀️' };
  return              { label: 'Evening',   emoji: '🌙' };
}

// ── Tab Bar ────────────────────────────────────────────────────
const TABS = [
  { key: 'itinerary', label: 'Itinerary',  icon: <FaCalendarAlt /> },
  { key: 'hotels',    label: 'Hotels',     icon: <FaHotel /> },
  { key: 'budget',    label: 'Budget',     icon: <FaRupeeSign /> },
  { key: 'tips',      label: 'Local Tips', icon: <FaLightbulb /> },
];

// ── Share helpers ──────────────────────────────────────────────
function shareWhatsApp(dest) {
  const text = encodeURIComponent(
    `Check out my AI-planned trip to ${dest}! 🌍✈️ Planned with Desi V Desi Tours`
  );
  window.open(`https://wa.me/?text=${text}`, '_blank');
}

function downloadItinerary(data) {
  const days = data.days || [];
  const lines = [
    `TRIP ITINERARY — ${data.destination}`,
    '─'.repeat(50),
    `Theme: ${data.summary || ''}`,
    `Nights: ${data.nights} | Travelers: ${data.travelers} | Budget: ${data.budget}`,
    '',
    ...days.flatMap(d => [
      `DAY ${d.day}: ${d.title}`,
      ...(d.activities || []).map(a => `  ${a.time}  ${a.name} — ${a.description} (${a.cost})`),
      '',
      'Meals:',
      ...(d.food || []).map(f => `  ${f.meal}: ${f.place} — ${f.description} (${f.cost})`),
      '',
      d.stay ? `Stay: ${d.stay.name} (${d.stay.type}) ${d.stay.cost}` : 'No stay tonight',
      `Estimated day cost: ${d.dayCostEstimate}`,
      '',
    ]),
    'TIPS',
    ...(data.tips || []).map(t => `• ${t}`),
  ];
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `itinerary-${(data.destination || 'trip').replace(/[^a-z0-9]/gi, '-').toLowerCase()}.txt`;
  a.click();
}

// ── Main Component ─────────────────────────────────────────────
export default function ItineraryResult({ itinerary: raw, onPlanAgain }) {
  const [activeTab, setActiveTab] = useState('itinerary');
  const [activeDay, setActiveDay] = useState(0);

  if (!raw) return null;

  // Support both shapes: raw.itinerary (old) or raw directly (new)
  const data = raw.itinerary ?? raw;
  const days = data.days || [];

  const day = days[activeDay];

  return (
    <div style={{ fontFamily: 'Outfit, sans-serif' }}>

      {/* ── Trip Header ───────────────────────────────────────── */}
      <div className="trip-header" style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>
              AI-Generated Itinerary ✨
            </div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: 0 }}>
              {data.destination}
            </h1>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => shareWhatsApp(data.destination)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: '#25D366', border: 'none', borderRadius: 10, color: 'white', fontFamily: 'Outfit', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <FaWhatsapp /> Share
            </button>
            <button
              onClick={() => downloadItinerary(data)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 10, color: 'white', fontFamily: 'Outfit', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
            >
              <FaDownload /> Save
            </button>
          </div>
        </div>

        {/* Meta badges */}
        <div className="trip-meta">
          {data.checkin   && <span className="meta-badge">📅 {data.checkin} → {data.checkout}</span>}
          {data.nights    && <span className="meta-badge"><FaMoon style={{ marginRight: 5 }} />{data.nights} Nights</span>}
          {data.travelers && <span className="meta-badge"><FaUsers style={{ marginRight: 5 }} />{data.travelers} Traveler{data.travelers > 1 ? 's' : ''}</span>}
          {data.budget    && <span className="meta-badge">{data.budget} Budget</span>}
          {data.tripType  && <span className="meta-badge">{data.tripType}</span>}
        </div>

        {/* Summary / theme */}
        {(data.summary || data.theme) && (
          <p className="trip-summary" style={{ fontStyle: 'italic', marginBottom: 16 }}>
            ✦ {data.summary || data.theme}
          </p>
        )}

        {/* Cost estimate + best time */}
        {(data.totalCostEstimate || data.bestTimeToVisit) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {data.totalCostEstimate && (
              <span style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: '0.78rem', fontWeight: 500, color: 'white' }}>
                💰 {data.totalCostEstimate}
              </span>
            )}
            {data.bestTimeToVisit && (
              <span style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 14px', fontSize: '0.78rem', fontWeight: 500, color: 'white' }}>
                🗓 Best: {data.bestTimeToVisit}
              </span>
            )}
          </div>
        )}
      </div>

      {/* ── Tab Bar ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '2px solid #E5E7EB', marginBottom: 28, overflowX: 'auto' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '10px 18px', background: 'none', border: 'none',
              fontFamily: 'Outfit', fontSize: '0.85rem',
              fontWeight: activeTab === t.key ? 700 : 500,
              color: activeTab === t.key ? 'var(--saffron-dark)' : '#6B7280',
              borderBottom: activeTab === t.key ? '2px solid var(--saffron)' : '2px solid transparent',
              marginBottom: -2, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* ── ITINERARY TAB ─────────────────────────────────────── */}
      {activeTab === 'itinerary' && (
        <div>
          {/* Day selector */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
            {days.map((d, i) => (
              <button
                key={i}
                onClick={() => setActiveDay(i)}
                style={{
                  padding: '7px 16px', borderRadius: 10, border: '1.5px solid',
                  borderColor: activeDay === i ? 'var(--saffron)' : '#E5E7EB',
                  background:  activeDay === i ? 'var(--saffron)' : 'white',
                  color:       activeDay === i ? 'white' : '#6B7280',
                  fontFamily: 'Outfit', fontSize: '0.82rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                Day {d.day}
              </button>
            ))}
          </div>

          {day && (
            <div className="day-card">
              {/* Day header */}
              <div className="day-header">
                <div className="day-num">{day.day}</div>
                <div className="day-title">{day.title}</div>
              </div>

              {/* Activities (mapped from activities[]) */}
              {(day.activities || []).map((act, i) => {
                const slot = timeToSlot(act.time);
                return (
                  <div key={i} style={{ padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <span style={{ fontSize: '1.1rem' }}>{slot.emoji}</span>
                      <span style={{ fontFamily: 'Outfit', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF' }}>
                        {slot.label}
                      </span>
                      <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: '#9CA3AF' }}>{act.time}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--ink)', marginBottom: 6 }}>
                      {act.name}
                    </div>
                    <div style={{ fontSize: '0.83rem', color: '#6B7280', lineHeight: 1.55, marginBottom: 8 }}>
                      {act.description}
                    </div>
                    <div style={{ display: 'flex', gap: 18, fontSize: '0.8rem', color: '#9CA3AF' }}>
                      {act.cost && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4, background: '#F0FDF4', color: '#16A34A', fontWeight: 600, padding: '2px 10px', borderRadius: 6 }}>
                          <FaRupeeSign style={{ fontSize: '0.7rem' }} />{act.cost}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Meals (mapped from food[]) */}
              {day.food?.length > 0 && (
                <div style={{ padding: '16px 24px' }}>
                  <div style={{ fontFamily: 'Outfit', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FaUtensils /> Meals
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {day.food.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '0.85rem' }}>
                        <span style={{ minWidth: 24, fontSize: '1rem' }}>{MEAL_ICONS[f.meal] || '🍴'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                            <span style={{ fontWeight: 700, color: '#374151' }}>{f.place}</span>
                            <span style={{ fontSize: '0.75rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>{f.meal}</span>
                          </div>
                          <div style={{ color: '#6B7280', lineHeight: 1.5, marginTop: 2 }}>{f.description}</div>
                          {f.cost && (
                            <div style={{ fontSize: '0.75rem', color: '#16A34A', fontWeight: 600, marginTop: 4 }}>{f.cost}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Stay tonight */}
              {day.stay && (
                <div style={{ margin: '0 24px 20px', background: 'linear-gradient(135deg,#FFF7ED,#FEF3C7)', border: '1px solid #FDE68A', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontFamily: 'Outfit', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D97706', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <FaHotel /> Tonight's Stay
                  </div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{day.stay.name}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: '0.8rem', color: '#92400E' }}>
                    <span>{day.stay.type}</span>
                    {day.stay.cost && <span style={{ fontWeight: 600 }}>{day.stay.cost}</span>}
                  </div>
                </div>
              )}

              {/* Day cost estimate */}
              {day.dayCostEstimate && (
                <div style={{ margin: '0 24px 20px', background: '#F9FAFB', borderRadius: 10, padding: '10px 16px', fontSize: '0.83rem', color: '#374151', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#9CA3AF', fontWeight: 600 }}>Estimated Day Cost (per person)</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', fontWeight: 700, color: 'var(--saffron-dark)' }}>{day.dayCostEstimate}</span>
                </div>
              )}
            </div>
          )}

          {/* Day navigation */}
          {days.length > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
              <button
                onClick={() => setActiveDay(i => Math.max(0, i - 1))}
                disabled={activeDay === 0}
                style={{ padding: '10px 20px', borderRadius: 12, border: '1.5px solid #E5E7EB', background: 'white', fontFamily: 'Outfit', fontSize: '0.85rem', fontWeight: 600, color: activeDay === 0 ? '#D1D5DB' : 'var(--ink)', cursor: activeDay === 0 ? 'not-allowed' : 'pointer' }}
              >← Previous Day</button>
              <button
                onClick={() => setActiveDay(i => Math.min(days.length - 1, i + 1))}
                disabled={activeDay === days.length - 1}
                style={{ padding: '10px 20px', borderRadius: 12, border: '1.5px solid #E5E7EB', background: 'white', fontFamily: 'Outfit', fontSize: '0.85rem', fontWeight: 600, color: activeDay === days.length - 1 ? '#D1D5DB' : 'var(--ink)', cursor: activeDay === days.length - 1 ? 'not-allowed' : 'pointer' }}
              >Next Day →</button>
            </div>
          )}
        </div>
      )}

      {/* ── HOTELS TAB ────────────────────────────────────────── */}
      {activeTab === 'hotels' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Collect unique stays from days */}
          {(() => {
            const stayMap = new Map();
            days.forEach(d => {
              if (d.stay) stayMap.set(d.stay.name, d.stay);
            });
            const stays = [...stayMap.values()];

            if (stays.length === 0) {
              return (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF', fontFamily: 'Outfit' }}>
                  No hotel suggestions in this itinerary.
                </div>
              );
            }

            return stays.map((h, i) => {
              const typeKey = (data.budget || 'mid-range').toLowerCase();
              const typeStyle = TYPE_COLORS[typeKey] || TYPE_COLORS['mid-range'];
              return (
                <div key={i} style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: '20px 22px', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>{h.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <FaMapMarkerAlt />{data.destination}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', fontWeight: 700, color: 'var(--saffron-dark)' }}>
                        {h.cost}
                      </div>
                    </div>
                  </div>
                  <span style={{ display: 'inline-block', background: typeStyle.bg, color: typeStyle.color, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 6 }}>
                    {h.type}
                  </span>
                </div>
              );
            });
          })()}

          {/* Local transport tip */}
          {data.localTransport && (
            <div style={{ background: '#EFF6FF', borderRadius: 16, padding: '18px 20px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <FaBus style={{ color: '#2563EB', flexShrink: 0, marginTop: 3 }} />
              <div>
                <div style={{ fontFamily: 'Outfit', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 6 }}>
                  Local Transport
                </div>
                <div style={{ fontSize: '0.85rem', color: '#1E3A5F', lineHeight: 1.55 }}>{data.localTransport}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── BUDGET TAB ────────────────────────────────────────── */}
      {activeTab === 'budget' && (
        <div>
          {/* Total estimate */}
          {data.totalCostEstimate && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
              <div style={{ gridColumn: '1/-1', background: 'linear-gradient(135deg, var(--saffron), var(--saffron-dark))', borderRadius: 16, padding: '20px', textAlign: 'center', color: 'white' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.8, marginBottom: 6 }}>Total Trip Cost Estimate</div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 700, lineHeight: 1 }}>{data.totalCostEstimate}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: 4 }}>for {data.travelers || 1} traveler{data.travelers > 1 ? 's' : ''}</div>
              </div>
            </div>
          )}

          {/* Per-day breakdown */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: '20px 22px', marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ fontFamily: 'Outfit', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 16 }}>
              Day-by-Day Cost Estimate (per person)
            </div>
            {days.map((d, i) => (
              d.dayCostEstimate && (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < days.length - 1 ? '1px solid #F9FAFB' : 'none' }}>
                  <span style={{ fontFamily: 'Outfit', fontSize: '0.88rem', color: '#6B7280' }}>Day {d.day} — {d.title}</span>
                  <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', fontWeight: 700, color: 'var(--ink)' }}>{d.dayCostEstimate}</span>
                </div>
              )
            ))}
          </div>

          {/* Activity costs */}
          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: '20px 22px', marginBottom: 24, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
            <div style={{ fontFamily: 'Outfit', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 16 }}>
              Activity Costs
            </div>
            {days.flatMap(d => d.activities || []).map((a, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #F9FAFB', fontSize: '0.85rem' }}>
                <span style={{ color: '#374151' }}>{a.name}</span>
                <span style={{ color: '#16A34A', fontWeight: 600 }}>{a.cost}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── LOCAL TIPS TAB ────────────────────────────────────── */}
      {activeTab === 'tips' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {(data.tips || []).length > 0 ? (
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7EB', padding: '20px 22px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 16 }}>
                🌟 Insider Tips
              </div>
              {data.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: i < data.tips.length - 1 ? '1px solid #F3F4F6' : 'none', fontSize: '0.88rem', color: '#374151', lineHeight: 1.6, alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--saffron)', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>✦</span>
                  {tip}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#9CA3AF' }}>No tips available.</div>
          )}

          {/* Transport */}
          {data.localTransport && (
            <div style={{ background: '#EFF6FF', borderRadius: 16, padding: '20px 22px' }}>
              <div style={{ fontFamily: 'Outfit', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#2563EB', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <FaBus /> Getting Around
              </div>
              <div style={{ fontSize: '0.85rem', color: '#1E3A5F', lineHeight: 1.6 }}>{data.localTransport}</div>
            </div>
          )}
        </div>
      )}

      {/* ── Footer CTA ────────────────────────────────────────── */}
      <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={onPlanAgain} className="plan-again-btn">
          ✨ Plan Another Trip
        </button>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ width: '100%', padding: '13px', background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 14, fontFamily: 'Outfit', fontWeight: 600, fontSize: '0.9rem', color: '#374151', cursor: 'pointer' }}
        >
          ↑ Back to Top
        </button>
      </div>
    </div>
  );
} 