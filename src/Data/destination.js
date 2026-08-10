// // src/Data/destination.js
// // Uses our own backend Places API — no Google API key needed
// import api from '../utils/api.js'
// // const API_BASE = 'http://localhost:5000/api/places';

// // ── Search destinations ───────────────────────────────────────
// export async function searchDestinations(query) {
//   if (!query || query.trim().length < 2) return [];
//   try {
//     const res  = await api.get(`/places/search?q=${encodeURIComponent(query)}`);
//     const data = await res.json();
//     return (data.results || []).map(r => ({
//       name:    r.name,
//       sub:     r.sub,
//       placeId: r.placeId,
//     }));
//   } catch (err) {
//     console.warn('Destination search failed:', err.message);
//     return [];
//   }
// }

// // ── Search areas within a destination ────────────────────────
// export async function searchAreas(query, destLocation, placeId) {
//   if (!query || query.trim().length < 2) return [];
//   try {
//     const params = new URLSearchParams({ q: query });
//     if (placeId) params.set('placeId', placeId);

//     const res  = await fetch(`${API_BASE}/areas?${params}`);
//     const data = await res.json();
//     return (data.results || []).map(r => ({
//       name: r.name,
//       sub:  r.sub || null,
//     }));
//   } catch (err) {
//     console.warn('Area search failed:', err.message);
//     return [];
//   }
// }

// // ── Get place details (lat/lng) — kept for API compatibility ──
// export async function getPlaceDetails(placeId) {
//   if (!placeId) return null;
//   try {
//     const res  = await fetch(`${API_BASE}/details/${placeId}`);
//     const data = await res.json();
//     return data.success ? data : null;
//   } catch {
//     return null;
//   }
// }

// // ── Highlight matching text in suggestions ────────────────────
// export function highlightMatch(text, query) {
//   if (!query || !text) return text;
//   const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//   return text.replace(
//     new RegExp(`(${escaped})`, 'gi'),
//     '<mark style="background:#FFF3E0;color:#E8813A;font-weight:700;border-radius:2px;padding:0 1px">$1</mark>'
//   );
// }