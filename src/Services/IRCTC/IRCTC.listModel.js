// services/trainService.js
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY; // Vite convention — adjust if using CRA (process.env.REACT_APP_RAPIDAPI_KEY)

export async function fetchLiveStation(fromStationCode, toStationCode, hours) {
  const url = new URL('https://irctc1.p.rapidapi.com/api/v3/getLiveStation');
  url.searchParams.append('fromStationCode', fromStationCode);
  url.searchParams.append('toStationCode', toStationCode);
  url.searchParams.append('hours', hours);

  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: {
      'x-rapidapi-host': 'irctc1.p.rapidapi.com',
      'x-rapidapi-key': RAPIDAPI_KEY,
      'Content-Type': 'application/json'
    }
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