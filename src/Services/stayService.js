/* ------------------------------------------------------------------
   STAY SERVICE
   Handles all API communication for stay/hotel search & booking flow.

   Provider: Xeni's Wholesale Rate Hotel Booking (RapidAPI).
   The old Hotels.com provider has been fully removed — every step now
   runs against Xeni.

   Flow:
   1. Autocomplete             -> searchRegions()      [path TODO, see below]
   2. Search Hotels            -> searchStays()         [path CONFIRMED]
   3. Check Availability       -> getHotelRooms()       [path CONFIRMED]
   4. Property Details         -> getPropertyDetails()  [path CONFIRMED]
   5. Get Price Confirmation   -> getPriceConfirmation() [path CONFIRMED, method CONFIRMED — see note below]
   6. Create Booking           -> createBooking()        [path CONFIRMED, method inferred from body presence; RESPONSE SHAPE UNCONFIRMED — see note below]
   7. Get Booking Detail       -> getBookingDetail()      [path TODO, see below — mirrors Property Details' shape as a starting guess, NOT confirmed]
   8. Cancel Booking           -> not yet implemented

   Headers (confirmed from playground/sample): x-rapidapi-host,
   x-rapidapi-key, Content-Type
------------------------------------------------------------------- */

export const getBestDeals = async () => {
  return {
    list: [],
  };
};

export const getOffers = async () => {
  return {
    list: [],
  };
};

/* ------------------------------------------------------------------
   PROVIDER CONFIG — Xeni's Wholesale Rate Hotel Booking (RapidAPI)
------------------------------------------------------------------- */
console.log('RAPIDAPI_KEY',import.meta.env.VITE_RAPIDAPI_KEY);

// TODO: confirm exact value from the RapidAPI playground's code snippet /
// x-rapidapi-host header. Placeholder follows this API's slug naming
// convention but has NOT been confirmed against a real request yet.
const RAPIDAPI_HOST = "xenis-wholesale-rate-hotel-booking.p.rapidapi.com";
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const BASE_URL = `https://${RAPIDAPI_HOST}`;
const AUTOCOMPLETE_PATH = "/api/hotels/api/v2/autocomplete";

const SEARCH_HOTELS_PATH = "/api/hotels/api/v2/properties";

const CHECK_AVAILABILITY_PATH = "/api/hotels/api/v2/properties/availability";

const PROPERTY_DETAILS_PATH = "/api/hotels/api/v2/property";

const PRICE_CONFIRMATION_PATH = "/api/hotels/api/v2/properties/price";

const CREATE_BOOKING_PATH = "/api/hotels/api/v2/bookings";

const BOOKING_DETAIL_PATH = "/api/hotels/api/v2/bookings";

  //  Internal fetch helpers
async function apiGet(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": RAPIDAPI_KEY,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed [${path}] with status ${response.status}`);
  }

  return response.json();
}

async function apiPost(path, { params = {}, body = {} } = {}) {
  const url = new URL(`${BASE_URL}${path}`);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "x-rapidapi-host": RAPIDAPI_HOST,
      "x-rapidapi-key": RAPIDAPI_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Request failed [${path}] with status ${response.status}`);
  }

  return response.json();
}

  //  1. AUTOCOMPLETE  (path unconfirmed, see TODO above)
   
const PLACE_TYPES = new Set([
  "State",
  "City",
  "Point of Interest",
  "Train Station",
  "Airport",
]);

/**
 * @param {{ query: string }} params
 * @returns {Promise<{ list: Array }>}
 */
export async function searchRegions({ query }) {
  const json = await apiGet(AUTOCOMPLETE_PATH, { key: query });

  const raw = json?.data || [];

  const list = raw.map((r) => {
    const isProperty = r.type === "property" || !PLACE_TYPES.has(r.type);

    return {
      kind: isProperty ? "hotel" : "region",
      id: r.id,
      type: r.type,
      name: r.name,
      subtitle: [r.state, r.country].filter(Boolean).join(", "),
      fullName: r.full_name,
      coordinates: r.location
        ? { lat: r.location.lat, long: r.location.long }
        : undefined,
    };
  });

  return { list };
}

  //  2. SEARCH HOTELS  (path CONFIRMED)
/**
 * @param {{ placeId: string, checkIn: string, checkOut: string, adults?: number, children?: number, childrenAges?: number[], countryOfResidence?: string, page?: number, limit?: number }} params
 * @returns {Promise<{ list: Array, total: number }>}
 */
export async function searchStays({
  placeId,
  checkIn,
  checkOut,
  adults = 2,
  children = 0,
  childrenAges = [],
  countryOfResidence = "IN",
  page = 1,
  limit = 20,
}) {
  const json = await apiPost(SEARCH_HOTELS_PATH, {
    params: { page, limit },
    body: {
      place_id: placeId,
      checkin_date: checkIn,
      checkout_date: checkOut,
      occupancy: [{ adults, children, childrenAges }],
      country_of_residence: countryOfResidence,
    },
  });

  return {
    list: json?.data?.hotels || [],
    total: json?.data?.total ?? 0,
  };
}

function ratingLabel(score) {
  if (score == null) return undefined;
  if (score >= 4.5) return "Excellent";
  if (score >= 4) return "Very Good";
  if (score >= 3) return "Good";
  return undefined;
}

// CURRENCY CONVERSION
const USD_TO_INR_RATE = 83.5; // approximate — not live, update periodically

function convertToINR(amount, fromCurrency) {
  if (amount == null) return undefined;
  if (!fromCurrency || fromCurrency === "INR") return amount;
  if (fromCurrency === "USD") return Math.round(amount * USD_TO_INR_RATE * 100) / 100;
  console.warn(`[convertToINR] Unhandled currency "${fromCurrency}" — returning unconverted amount.`);
  return amount;
}

/**
 * Normalizes one raw `hotels[]` entry from searchStays() into the flat
 * shape StayCard.jsx expects.
 *
 * @param {Object} p raw hotel object from searchStays()
 * @returns {Object} normalized card data
 */
export function normalizeStayCard(p = {}) {
  const address = p?.contact?.address;
  const largeImages = p?.property_images?.large || [];
  const thumbImages = p?.property_images?.thumbnail || [];
  const rate = p?.rate || {};
  const sourceCurrency = rate.currency;

  return {
    id: p.property_id,
    name: p.name,
    images: (largeImages.length ? largeImages : thumbImages).map((url, i) => ({
      url,
      alt: p.name ? `${p.name} photo ${i + 1}` : `Hotel photo ${i + 1}`,
    })),
    ribbon: p.hot_deal ? "Hot Deal" : undefined,
    starRating: p?.ratings?.star_rating,
    location: [address?.city, address?.state].filter(Boolean).join(", "),
    distanceLabel: p.distance != null ? `${p.distance} from center` : undefined,
    rating:
      p?.ratings?.user_rating != null && p.ratings.user_rating > 0
        ? {
            score: p.ratings.user_rating,
            label: ratingLabel(p.ratings.user_rating),
            count: undefined, // not provided by this endpoint
          }
        : undefined,
    amenities: [],
    tagline: undefined,
    price: convertToINR(rate.total_rate, sourceCurrency),
    originalPrice: convertToINR(rate.recommended_selling_price, sourceCurrency),
    savedPrice: convertToINR(rate.saved_price, sourceCurrency),
    taxes: convertToINR(rate.tax_and_fees, sourceCurrency),
    currency: "INR",
    roomsLeft: undefined,
  };
}

  //  3. CHECK AVAILABILITY  (path CONFIRMED)

/**
 * @param {{ placeId: string, propertyId: string, checkIn: string, checkOut: string, adults?: number, children?: number, childrenAges?: number[], countryOfResidence?: string }} params
 * @returns {Promise<{ list: Array }>}
 */
export async function getHotelRooms({
  placeId,
  propertyId,
  checkIn,
  checkOut,
  adults = 2,
  children = 0,
  childrenAges = [],
  countryOfResidence = "IN",
}) {
  const json = await apiPost(CHECK_AVAILABILITY_PATH, {
    body: {
      place_id: placeId,
      property_id: propertyId,
      checkin_date: checkIn,
      checkout_date: checkOut,
      occupancy: [{ adults, children, childrenAges }],
      country_of_residence: countryOfResidence,
    },
  });

  const rooms = json?.data || [];

  const list = rooms.map((room) => {
    const largeImages = room?.images?.large || [];
    const thumbImages = room?.images?.thumbnail || [];

    const rates = (room.rates || []).map((rate) => {
      const sourceCurrency = rate.currency;

      return {
        refundable: !!rate.refundable,
        price: convertToINR(rate.total_rate, sourceCurrency),
        originalPrice: convertToINR(rate.recommended_selling_price, sourceCurrency),
        savedPrice: convertToINR(rate.saved_price, sourceCurrency),
        taxes: convertToINR(rate.tax_and_fees, sourceCurrency),
        currency: "INR",
        boardBasis: rate.board_basis || [],
        amenities: rate.amenities || [],
        extras: rate.extras || [],
        beds: (rate.beds || []).map((b) => ({
          name: b.name,
          availabilityToken: b.availability_token,
        })),
        cancellationPolicy: (rate.cancellation_policy || []).map((c) => ({
          start: c.start,
          end: c.end,
          value: c.value,
          type: c.type,
          estimateAmount: convertToINR(c.estimate_amount, c.currency),
          billableAmount: convertToINR(c.billable_amount, c.billable_currency),
          currency: "INR",
        })),
      };
    });

    return {
      id: room.id,
      name: room.name,
      sleeps: room.sleeps,
      descriptionHtml: room.descriptions,
      images: (largeImages.length ? largeImages : thumbImages).map((url, i) => ({
        url,
        alt: room.name ? `${room.name} photo ${i + 1}` : `Room photo ${i + 1}`,
      })),
      availability: room.availability,
      amenities: room.amenities || [],
      areaSqFt: room?.area?.square_feet,
      areaSqM: room?.area?.square_meters,
      rates,
      soldOut: rates.length === 0,
    };
  });

  return { list };
}

  //  4. PROPERTY DETAILS  (path CONFIRMED)

function policyValue(policies, type) {
  return policies.find((p) => p.type === type)?.description;
}

function highlightValue(highlights, type) {
  return highlights.find((h) => h.type === type)?.description;
}

function mapImageSet(images = []) {
  return images.map((url, i) => ({ url, alt: `Hotel photo ${i + 1}` }));
}

/**
 *
 * @param {Object} d raw `data` object from the Property Details response
 * @returns {Object} normalized property details
 */
export function normalizePropertyDetails(d = {}) {
  const address = d?.contact?.address;
  const ratings = d?.ratings || {};
  const policies = d?.policies || [];
  const highlights = d?.highlights || [];

  return {
    id: d.property_id,
    name: d.name,
    phone: d?.contact?.phone,
    address: {
      line1: address?.line_1,
      city: address?.city,
      state: address?.state,
      country: address?.country,
      postalCode: address?.postal_code,
    },
    coordinates: d.location ? { lat: d.location.lat, long: d.location.long } : undefined,

    starRating: ratings.star_rating,
    rating:
      ratings.user_rating != null && ratings.user_rating > 0
        ? {
            score: ratings.user_rating,
            label: ratingLabel(ratings.user_rating),
            count: ratings.reviews_count,
          }
        : undefined,
    subRatings: {
      amenities: ratings.amenities,
      condition: ratings.condition,
      service: ratings.service,
      comfort: ratings.comfort,
      cleanliness: ratings.cleanliness,
    },

    accessibilities: d.accessibilities || [],
    amenities: d.amenities || [],

    checkIn: {
      beginTime: policyValue(policies, "check_in_begin_time"),
      endTime: policyValue(policies, "check_in_end_time"),
      minAge: policyValue(policies, "check_in_min_age"),
      instructionsHtml: policyValue(policies, "check_in_instructions"),
      specialInstructions: policyValue(policies, "check_in_special_instructions"),
    },
    checkOutTime: policyValue(policies, "check_out_time"),
    policies: policies.map((p) => ({ type: p.type, description: p.description })),

    headline: highlightValue(highlights, "headline"),
    locationSummary: highlightValue(highlights, "location"),
    dining: highlightValue(highlights, "dining"),
    businessAmenities: highlightValue(highlights, "business_amenities"),
    attractionsHtml: highlightValue(highlights, "attractions"),
    roomsSummary: highlightValue(highlights, "rooms"),
    // Full raw list too, same rationale as `policies` above.
    highlights: highlights.map((h) => ({ type: h.type, description: h.description })),

    images: {
      thumbnail: mapImageSet(d?.images?.thumbnail),
      small: mapImageSet(d?.images?.small),
      large: mapImageSet(d?.images?.large),
      extraLarge: mapImageSet(d?.images?.extra_large),
    },
  };
}

/**
 * @param {{ propertyId: string }} params
 * @returns {Promise<{ details: Object }>}
 */
export async function getPropertyDetails({ propertyId }) {
  const json = await apiGet(`${PROPERTY_DETAILS_PATH}/${propertyId}`);

  return { details: normalizePropertyDetails(json?.data) };
}

  //  5. GET PRICE CONFIRMATION  (path CONFIRMED, method CONFIRMED — see

function normalizeCancellationPolicy(list) {
  return (list || []).map((c) => ({
    start: c.start,
    end: c.end,
    type: c.type,
    value: c.value,
    estimateAmount: convertToINR(c.estimate_amount, c.currency),
    billableAmount: convertToINR(c.billable_amount, c.billable_currency),
    currency: "INR",
  }));
}

/**
 *
 * @param {Object} d raw `data` object from the Get Price Confirmation response
 * @returns {Object} normalized price confirmation
 */
export function normalizePriceConfirmation(d = {}) {
  const sourceCurrency = d.currency;
  const room = d.rooms?.[0] || {};
  const largeImages = room?.images?.large || [];
  const thumbImages = room?.images?.thumbnail || [];

  return {
    available: d.status === "available",
    status: d.status,

    propertyId: d.property_id,
    checkIn: d.checkin_date,
    checkOut: d.checkout_date,
    refundable: !!d.refundable,
    boardBasis: d.board_basis || [],
    amenities: d.amenities || [],
    extras: d.extras || [],

    price: convertToINR(d.total_price, sourceCurrency),
    originalPrice: convertToINR(d.recommended_selling_price, sourceCurrency),
    savedPrice: convertToINR(d.saved_price, sourceCurrency),
    taxes: convertToINR(d.tax_and_fees, sourceCurrency),
    currency: "INR",

    cancellationPolicy: normalizeCancellationPolicy(d.cancellation_policy),

    room: {
      id: room.id,
      name: room.name,
      descriptionHtml: room.descriptions,
      images: (largeImages.length ? largeImages : thumbImages).map((url, i) => ({
        url,
        alt: room.name ? `${room.name} photo ${i + 1}` : `Room photo ${i + 1}`,
      })),
      amenities: room.amenities || [],
      adults: room.number_of_adults,
      bed: room.bed,
      sleeps: room.sleeps,
      allGuestInfoRequired: !!room.all_guest_info_required,
      specialRequestSupported: !!room.special_request_supported,
    },

    pricingToken: d.pricing_token,
  };
}

/**
 * @param {{ availabilityToken: string }} params
 * @returns {Promise<{ confirmation: Object }>}
 */
export async function getPriceConfirmation({ availabilityToken }) {
  const json = await apiPost(PRICE_CONFIRMATION_PATH, {
    body: { availability_token: availabilityToken },
  });

  return { confirmation: normalizePriceConfirmation(json?.data) };
}

  //  6. CREATE BOOKING  (path CONFIRMED, method inferred — see

const BOOKING_ID_KEYS = ["booking_id", "bookingId", "id", "reference_number", "confirmation_number"];
const BOOKING_STATUS_KEYS = ["status", "booking_status"];

function firstDefined(obj, keys) {
  for (const key of keys) {
    if (obj?.[key] !== undefined) return obj[key];
  }
  return undefined;
}

/**
 * @param {{
 *   pricingToken: string,
 *   email: string,
 *   phone: { countryCode: string, number: string },
 *   rooms: Array<{ title: string, firstName: string, lastName: string }>
 * }} params
 * @returns {Promise<{ raw: Object, bookingId: string|undefined, status: string|undefined }>}
 */
export async function createBooking({ pricingToken, email, phone, rooms }) {
  const json = await apiPost(CREATE_BOOKING_PATH, {
    body: {
      pricing_token: pricingToken,
      email,
      phone: {
        country_code: phone?.countryCode,
        number: phone?.number,
      },
      rooms: (rooms || []).map((r) => ({
        title: r.title,
        first_name: r.firstName,
        last_name: r.lastName,
      })),
    },
  });

  const container = json?.data || json || {};

  return {
    raw: json,
    bookingId: firstDefined(container, BOOKING_ID_KEYS),
    status: firstDefined(container, BOOKING_STATUS_KEYS),
  };
}

  //  7. GET BOOKING DETAIL  (path NOT CONFIRMED — see BOOKING_DETAIL_PATH
const BOOKING_DETAIL_STATUS_KEYS = ["status", "booking_status"];
const BOOKING_DETAIL_CHECKIN_KEYS = ["checkin_date", "check_in_date"];
const BOOKING_DETAIL_CHECKOUT_KEYS = ["checkout_date", "check_out_date"];
const BOOKING_DETAIL_PROPERTY_ID_KEYS = ["property_id", "propertyId"];
const BOOKING_DETAIL_TOTAL_KEYS = ["total_price", "total_rate", "amount"];
const BOOKING_DETAIL_CURRENCY_KEYS = ["currency"];

/**
 *
 * @param {Object} json raw parsed response from the Get Booking Detail request
 * @returns {Object}
 */
export function normalizeBookingDetail(json = {}) {
  const container = json?.data || json || {};
  const sourceCurrency = firstDefined(container, BOOKING_DETAIL_CURRENCY_KEYS);

  return {
    raw: json,
    bookingId: firstDefined(container, BOOKING_ID_KEYS),
    status: firstDefined(container, BOOKING_DETAIL_STATUS_KEYS),
    propertyId: firstDefined(container, BOOKING_DETAIL_PROPERTY_ID_KEYS),
    checkIn: firstDefined(container, BOOKING_DETAIL_CHECKIN_KEYS),
    checkOut: firstDefined(container, BOOKING_DETAIL_CHECKOUT_KEYS),
    total: convertToINR(firstDefined(container, BOOKING_DETAIL_TOTAL_KEYS), sourceCurrency),
    currency: "INR",
  };
}

/**
 * @param {{ bookingId: string }} params
 * @returns {Promise<Object>} normalized booking detail (see normalizeBookingDetail)
 */
export async function getBookingDetail({ bookingId }) {
  const json = await apiGet(`${BOOKING_DETAIL_PATH}/${bookingId}`);

  return normalizeBookingDetail(json);
}