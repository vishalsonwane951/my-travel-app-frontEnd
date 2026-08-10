import api from './api.js';

// Google Places autocomplete billing is per session — reuse one token across
// a search, then rotate it once a Details call ends that session.
let sessionToken = null;
function newToken() {
  sessionToken = crypto.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  return sessionToken;
}
function getToken() {
  return sessionToken || newToken();
}

async function getData(path) {
  const res = await api.get(path); // axios — response body is res.data, not res.json()
  return res.data;
}

export async function searchDestinations(query) {
  const params = new URLSearchParams({
    input: query,
    type: 'destination',
    sessiontoken: getToken(),
  });
  const data = await getData(`/places/autocomplete?${params}`);
  return (data.predictions || []).map(p => ({ name: p.name, sub: p.sub, placeId: p.placeId }));
}

export async function searchAreas(query, location) {
  if (!location) return [];
  const params = new URLSearchParams({
    input: query,
    type: 'area',
    sessiontoken: getToken(),
    location: `${location.lat},${location.lng}`,
    radius: '50000',
  });
  const data = await getData(`/places/autocomplete?${params}`);
  return (data.predictions || []).map(p => ({ name: p.name, sub: p.sub, placeId: p.placeId }));
}

export async function getPlaceDetails(placeId) {
  const params = new URLSearchParams({ placeId, sessiontoken: getToken() });
  const data = await getData(`/places/details?${params}`);
  newToken(); // session ends after Details — start fresh for the next search
  if (!data.location) return null;
  const [lat, lng] = data.location.split(',').map(Number);
  return { name: data.name, address: data.address, location: { lat, lng } };
}

export function highlightMatch(text, query) {
  if (!query || !text) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    text.slice(0, idx) +
    '<mark>' + text.slice(idx, idx + query.length) + '</mark>' +
    text.slice(idx + query.length)
  );
}