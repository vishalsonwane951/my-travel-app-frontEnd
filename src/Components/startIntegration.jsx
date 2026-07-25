// // ─────────────────────────────────────────────────────────────
// //  HOW TO INTEGRATE SavedItineraries into start.jsx
// //  Add these 4 changes to your existing start.jsx
// // ─────────────────────────────────────────────────────────────

// // ── 1. Add import at the top (after ItineraryResult import) ──
// import SavedItineraries from '../Components/SavedItineraries.jsx';


// // ── 2. Add state in Start() component ────────────────────────
// const [showSaved, setShowSaved] = useState(false);


// // ── 3. Add "My Trips" button in the Tour Cards section header ─
// //  Find the existing "AI Trip Planner ✨" button and add next to it:

// <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//   {/* Existing button */}
//   <button
//     onClick={() => setShowPlanner(true)}
//     className="btn-primary"
//     style={{ padding: '12px 24px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 8 }}
//   >
//     <FaCalendarAlt /> AI Trip Pl
//   </button>

//   {/* NEW: import express from 'express's button */}
//   <Link
//     to="/saved-trips"
//     style={{
//       padding: '12px 24px', fontSize: '0.85rem',
//       display: 'inline-flex', alignItems: 'center', gap: 8,
//       background: 'var(--forest)', color: 'white',
//       border: 'none', borderRadius: 50, fontFamily: 'Outfit',
//       fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
//       boxShadow: '0 4px 16px rgba(26,60,52,0.3)',
//       transition: 'all 0.3s',
//     }}
//     onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
//     onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
//   >
//     🗺️ My Saved Trips
//   </Link>
// </div>


// // ── 4. Add SavedItineraries overlay in the Modals section ─────
// //  Find the {itinerary && <ItineraryOverlay ... />} block
// //  and add BELOW it:

// {showSaved && (
//   <div style={{ position: 'fixed', inset: 0, background: 'var(--cream)', zIndex: 4500, overflowY: 'auto' }}>
//     {/* Back button */}
//     <div style={{
//       position: 'sticky', top: 0, background: 'rgba(251,245,236,0.95)',
//       backdropFilter: 'blur(12px)', padding: '14px 24px',
//       borderBottom: '1px solid #F3E8D4', display: 'flex',
//       alignItems: 'center', gap: 14, zIndex: 10,
//     }}>
//       <button
//         onClick={() => setShowSaved(false)}
//         style={{
//           display: 'flex', alignItems: 'center', gap: 6,
//           background: 'none', border: '1.5px solid #E5E7EB',
//           borderRadius: 10, padding: '8px 16px',
//           fontFamily: 'Outfit', fontSize: '0.85rem', fontWeight: 600,
//           cursor: 'pointer', color: 'var(--ink)', transition: 'all 0.2s',
//         }}
//         onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--saffron)'; e.currentTarget.style.color = 'var(--saffron)'; }}
//         onMouseLeave={e => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.color = 'var(--ink)'; }}
//       >
//         ← Back to Home
//       </button>
//     </div>

//     <SavedItineraries
//       onPlanNew={() => {
//         setShowSaved(false);
//         setShowPlanner(true);
//       }}

//     />
//   </div>
// )}