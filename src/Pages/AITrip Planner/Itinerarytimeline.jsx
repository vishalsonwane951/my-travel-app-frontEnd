import { useState } from 'react';

const SLOT_ICON = { breakfast: '☕', lunch: '🍽', dinner: '🌙', morning: '☀', afternoon: '🌤', evening: '🌆' };

function money(n) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

export default function ItineraryTimeline({ itinerary }) {
  const [activeDay, setActiveDay] = useState(0);
  if (!itinerary) return null;

  const { destination, area, travelers, tripType, budget, days = [], localTips } = itinerary;
  const day = days[activeDay];

  return (
    <div className="itinerary-wrap">
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--saffron)', marginBottom: 6 }}>
          Your itinerary
        </div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: 'var(--ink)' }}>
          {destination}{area ? ` · ${area}` : ''}
        </h2>
        <div style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 4 }}>
          {days.length} day{days.length > 1 ? 's' : ''} · {travelers} traveler{travelers > 1 ? 's' : ''} · {tripType}
        </div>
      </div>

      {/* Budget summary */}
      {budget && (
        <div className="budget-summary" style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div className="budget-chip"><strong>{money(budget.total)}</strong><span>Total ({budget.tier})</span></div>
          {budget.breakdown && Object.entries(budget.breakdown).map(([key, val]) => (
            <div className="budget-chip" key={key}>
              <strong>{money(val)}</strong>
              <span>{key[0].toUpperCase() + key.slice(1)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Day tabs */}
      <div className="pills" style={{ marginBottom: 20 }}>
        {days.map((d, i) => (
          <button
            key={d.date}
            className={`pill${i === activeDay ? ' active' : ''}`}
            onClick={() => setActiveDay(i)}
          >
            Day {i + 1}
          </button>
        ))}
      </div>

      {/* Day timeline */}
     {day && (
  <div>
    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', fontWeight: 600, marginBottom: 16 }}>
      {day.dayLabel}
    </h3>
    <div className="timeline">
      {(day.items || []).length === 0 ? (
        <div style={{ color: 'var(--muted)', fontSize: '0.9rem', padding: '20px 0' }}>
          No activities were generated for this day.
        </div>
      ) : (
        day.items.map((item, i) => (
          <div className="timeline-item" key={`${item.placeId || 'item'}-${i}`}>
            {item.travelFromPrevMin != null && i > 0 && (
              <div className="travel-note">↳ {item.travelFromPrevMin} min travel</div>
            )}
            <div className="timeline-card">
              <div className="timeline-time">{item.time}</div>
              <div className="timeline-body">
                <div className="timeline-title">
                  <span>{SLOT_ICON[item.slot] || '📍'}</span> {item.name}
                </div>
                {item.notes && <div className="timeline-notes">{item.notes}</div>}
                <div className="timeline-meta">
                  {item.durationMin && <span>{item.durationMin} min</span>}
                  {item.estCostPerPerson != null && <span>{money(item.estCostPerPerson)}/person</span>}
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
)}
      {/* Local tips */}
      {localTips && (
        <div className="local-tips" style={{ marginTop: 24, padding: 16, borderRadius: 12, background: 'var(--cream, #FAF7F0)' }}>
          <div className="field-label" style={{ marginBottom: 8 }}>Good to know</div>
          {localTips.currency && <div>💱 {localTips.currency}</div>}
          {localTips.safety && <div>🛡 {localTips.safety}</div>}
          {localTips.connectivity && <div>📶 {localTips.connectivity}</div>}
        </div>
      )}
    </div>
  );
}