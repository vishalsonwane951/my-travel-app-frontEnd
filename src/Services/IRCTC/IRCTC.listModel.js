// services/trainService.js
<<<<<<< HEAD
//
// Routes through our own backend now (Backend/Controllers/IRCTC/Controller/liveStationController.js)
// instead of calling RapidAPI directly from the browser with an exposed key.
// Same function name/signature/return shape as before, so Trainsearch.jsx
// didn't need to change.
const BACKEND_BASE_URL = "http://localhost:5000/api/irctc";

export async function fetchLiveStation(fromStationCode, toStationCode, hours) {
  const url = new URL(`${BACKEND_BASE_URL}/live-station`);
=======
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY; // Vite convention — adjust if using CRA (process.env.REACT_APP_RAPIDAPI_KEY)

export async function fetchLiveStation(fromStationCode, toStationCode, hours) {
  const url = new URL('https://irctc1.p.rapidapi.com/api/v3/getLiveStation');
>>>>>>> 26735bd518f50108e31c192ffdf5dc9e20e7f788
  url.searchParams.append('fromStationCode', fromStationCode);
  url.searchParams.append('toStationCode', toStationCode);
  url.searchParams.append('hours', hours);

  const response = await fetch(url.toString(), {
    method: 'GET',
<<<<<<< HEAD
    headers: { 'Content-Type': 'application/json' },
=======
    headers: {
      'x-rapidapi-host': 'irctc1.p.rapidapi.com',
      'x-rapidapi-key': RAPIDAPI_KEY,
      'Content-Type': 'application/json'
    }
>>>>>>> 26735bd518f50108e31c192ffdf5dc9e20e7f788
  });

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

// Maps the raw getLiveStation response into the shape TrainCard expects.
// NOTE: verify actual field names once you see a real response — I'm guessing
// common IRCTC field naming (train_number, train_name, std/sta) since this
// endpoint's exact schema isn't publicly documented in detail.
export function mapLiveStationToTrains(payload) {
  const list = Array.isArray(payload?.data) ? payload.data : [];
  return list.map(item => ({
    trainNumber: item.train_number ?? item.trainNumber ?? 'N/A',
    trainName: item.train_name ?? item.trainName ?? 'Unknown Train',
    trainType: item.type ?? 'MAIL',            // getLiveStation likely has no classification — default
    departureTime: item.std ?? item.scheduled_departure ?? item.departureTime ?? '00:00',
    arrivalTime: item.sta ?? item.scheduled_arrival ?? item.arrivalTime ?? '00:00',
    runDays: item.runDays ?? {},                // not returned by this endpoint — will show all inactive
    classes: item.classes ?? [{ value: 'GN', name: 'General' }] // placeholder, not returned by this endpoint
  }));
}