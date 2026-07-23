/* ------------------------------------------------------------------
   STAY SERVICE
   Handles all API communication for stay/hotel search & booking flow.
   Provider: Hotels.com (via RapidAPI, host: hotels-com-provider)

   Flow:
   1. Search Location        -> searchRegions()
   2. Get Region ID          -> (pick a "CITY"/"NEIGHBORHOOD" result's gaiaId)
   3. Search Hotels          -> searchStays()
   4. Show Hotel List        -> (render searchStays() result, normalized via normalizeStayCard())
   5. Click Hotel            -> (navigate with hotelId)
   6. Get Hotel Details      -> getHotelDetails()
   7. Get Hotel Info         -> getHotelInfo()
   8. Get Reviews Summary    -> getReviewsSummary()
   9. Get Reviews List       -> getReviewsList()   [endpoint unconfirmed, see note below]
   10. Get Hotel Rooms       -> getHotelRooms()    [shape CONFIRMED, path best-guess — see note below]
   11. Proceed to Booking    -> (use selected offer from getHotelRooms())

   CONFIRMED endpoints (matched to real sample responses):
     GET /v2/regions
     GET /v3/hotels/search
     GET /v2/hotels/details
     GET /v3/hotels/info
     GET /v2/hotels/reviews/summary

   GET /v3/hotels/offers (getHotelRooms) — the PATH is still a best guess
   (no confirmed request URL yet), but the RESPONSE SHAPE is now confirmed
   against a real sample: an "OfferDetails" object returned directly (not
   wrapped in `.data`), with room types under `categorizedListings[]`:
     { id, soldOut, stickyBar: { displayPrice }, categorizedListings: [
         { unitId, header: { text }, featureHeader: { text }, features: [
             { text, graphic: { id } } ],
           primarySelections: [ { propertyUnit: {
               id, unitGallery: { gallery: [ { image: { url, description } } ] },
               ratePlans: [ { id, badge: { text }, priceDetails: [ {
                   availability: { available, scarcityMessage },
                   price: { options: [ { formattedDisplayPrice, strikeOut: { formatted } } ] },
                   propertyNaturalKeys: [ { id, roomTypeId, ratePlanId,
                     checkIn: { day, month, year }, checkOut: {...} } ] } ] } ],
               availabilityCallToAction: { value } // e.g. "We are sold out", present
                                                    // instead of ratePlans when unavailable
           } } ] } ] }
   Replace the path below once you've got a confirmed request URL to match.

   NOT YET CONFIRMED (no sample response provided) — path below is a best
   guess following this API's existing /v2 and /v3 naming convention.
   Swap it once you've got a real response to match against:
     GET /v2/hotels/reviews/list   (getReviewsList)

   Headers: x-rapidapi-host, x-rapidapi-key
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

const RAPIDAPI_HOST = "hotels-com-provider.p.rapidapi.com";
const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
const BASE_URL = "https://hotels-com-provider.p.rapidapi.com";

const DEFAULT_LOCALE = "en_IN";
const DEFAULT_DOMAIN = "IN";

/* ------------------------------------------------------------------
   Internal fetch helper
------------------------------------------------------------------- */
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
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed [${path}] with status ${response.status}`);
  }

  return response.json();
}

/* ------------------------------------------------------------------
   1 & 2. REGIONS SEARCH
   GET /v2/regions?query=pune&locale=en_IN&domain=IN
   Response: { query, data: [ { "@type": "gaiaRegionResult" | "gaiaHotelResult",
     gaiaId | hotelId, type: "CITY"|"AIRPORT"|"NEIGHBORHOOD"|"HOTEL",
     regionNames: { fullName, shortName, displayName, primaryDisplayName, secondaryDisplayName },
     coordinates: { lat, long } } ] }
------------------------------------------------------------------- */
/**
 * @param {{ query: string, locale?: string, domain?: string }} params
 * @returns {Promise<{ list: Array }>}
 */
export async function searchRegions({ query, locale = DEFAULT_LOCALE, domain = DEFAULT_DOMAIN }) {
  const json = await apiGet("/v2/regions", { query, locale, domain });

  const raw = json?.data || [];

  // Normalize both region and hotel-direct results into one shape.
  const list = raw.map((r) => ({
    kind: r["@type"] === "gaiaHotelResult" ? "hotel" : "region",
    id: r.gaiaId || r.hotelId,
    type: r.type,
    name: r.regionNames?.primaryDisplayName || r.regionNames?.shortName,
    subtitle: r.regionNames?.secondaryDisplayName,
    fullName: r.regionNames?.fullName,
    coordinates: r.coordinates,
  }));

  return { list };
}

/* ------------------------------------------------------------------
   3 & 4. HOTELS SEARCH
   GET /v3/hotels/search?region_id=...&checkin_date=YYYY-MM-DD&checkout_date=YYYY-MM-DD
     &adults_number=2&locale=en_IN&domain=IN&sort_order=REVIEW&page_number=1
   Response: { data: { properties: [ { id, link, name, messages: [neighborhood],
     short_amenities: [...], guestRating: { rating, totalReviews, starRating },
     mediaSection: { media: [{ id, description, url }] },
     price: { badge: { text }, priceSummary: { definition: { displayPrice, strikeOut,
       accessibilityLabel, priceDisclaimer }, priceMessaging: [{ value }] } } } ] } }

   NOTE: this returns the RAW property objects from the API, not the flat
   shape StayCard.jsx expects. Callers rendering a card grid should map
   each item through normalizeStayCard() below before passing it to
   <StayCard />.
------------------------------------------------------------------- */
/**
 * @param {{ regionId: string, checkIn: string, checkOut: string, adults?: number, sortOrder?: string, page?: number, locale?: string, domain?: string }} params
 * @returns {Promise<{ list: Array }>}
 */
export async function searchStays({
  regionId,
  checkIn,
  checkOut,
  adults = 2,
  sortOrder = "REVIEW",
  page = 1,
  locale = DEFAULT_LOCALE,
  domain = DEFAULT_DOMAIN,
}) {
  const json = await apiGet("/v3/hotels/search", {
    region_id: regionId,
    checkin_date: checkIn,
    checkout_date: checkOut,
    adults_number: adults,
    locale,
    domain,
    sort_order: sortOrder,
    page_number: page,
  });

  return {
    list: json?.data?.properties || [],
  };
}

/* ------------------------------------------------------------------
   CARD NORMALIZATION
   Maps a raw searchStays() `properties[]` item into the flat shape
   StayCard.jsx expects:
     { id, name, ribbon, starRating, location, distanceLabel,
       rating: { score, label, count }, amenities: [{ key, label }],
       tagline, roomsLeft, price, originalPrice, taxes }

   Anything not present in the CONFIRMED /v3/hotels/search response shape
   (roomsLeft, taxes) is left undefined rather than guessed at — StayCard
   already hides those pills gracefully when the value is nullish.
------------------------------------------------------------------- */

// Raw short_amenities strings -> StayCard's AMENITY_ICON keys.
// Case-insensitive substring match since we don't have a confirmed enum
// of possible values from the API yet.
const AMENITY_KEY_MAP = [
  { match: /wifi|internet/i, key: "wifi" },
  { match: /breakfast/i, key: "breakfast" },
  { match: /restaurant|dining/i, key: "restaurant" },
  { match: /room service/i, key: "roomService" },
  { match: /parking/i, key: "parking" },
  { match: /air.?condition|\bac\b/i, key: "ac" },
  { match: /fitness|gym/i, key: "fitness" },
  { match: /accessible|wheelchair/i, key: "accessible" },
];

function mapAmenityKey(label) {
  const found = AMENITY_KEY_MAP.find((m) => m.match.test(label));
  return found?.key || "default";
}

function parsePriceNumber(str) {
  if (!str) return undefined;
  const n = Number(String(str).replace(/[^\d.]/g, ""));
  return Number.isNaN(n) ? undefined : n;
}

function ratingLabel(score) {
  if (score == null) return undefined;
  if (score >= 4.5) return "Excellent";
  if (score >= 4) return "Very Good";
  if (score >= 3) return "Good";
  return undefined;
}

/**
 * Normalizes one raw `properties[]` entry from searchStays() into the
 * flat shape StayCard.jsx expects.
 *
 * NOT YET CONFIRMED against a real payload:
 *   - `messages[1]` as distanceLabel (module comment only confirms
 *     messages[0] = neighborhood; index 1 is a guess)
 *   - `roomsLeft` — no field for this in the confirmed shape; left undefined
 *   - `taxes` — no field for this in the confirmed shape; left undefined
 *
 * @param {Object} p raw property object from searchStays()
 * @returns {Object} normalized card data
 */
export function normalizeStayCard(p = {}) {
  const priceDef = p?.price?.priceSummary?.definition;
  const mediaList = p?.mediaSection?.media || [];

  return {
    id: p.id,
    name: p.name,
    images: mediaList
      .map((m) => ({ url: m.url, alt: m.description || p.name }))
      .filter((m) => m.url),
    ribbon: p?.price?.badge?.text,
    starRating: p?.guestRating?.starRating,
    location: p?.messages?.[0],
    distanceLabel: p?.messages?.[1],
    rating: p?.guestRating
      ? {
          score: p.guestRating.rating,
          label: ratingLabel(p.guestRating.rating),
          count: p.guestRating.totalReviews,
        }
      : undefined,
    amenities: (p?.short_amenities || []).slice(0, 3).map((label) => ({
      key: mapAmenityKey(label),
      label,
    })),
    tagline: priceDef?.priceDisclaimer,
    price: parsePriceNumber(priceDef?.displayPrice),
    originalPrice: parsePriceNumber(priceDef?.strikeOut),
    taxes: undefined,
    roomsLeft: undefined,
  };
}
/* ------------------------------------------------------------------
   6. HOTEL DETAILS
   GET /v2/hotels/details?domain=IN&hotel_id=...&locale=en_IN
   Response is a large object; the pieces we use:
     .summary                        -> name, tagline, rating, address, policies
     .propertyGallery.images         -> gallery photos
     .propertyContentSectionGroups   -> "About this property" long description
     .reviewInfo.summary             -> quick review blurb (full breakdown is
                                         a separate call, see getReviewsSummary)
------------------------------------------------------------------- */
/**
 * @param {{ hotelId: string, locale?: string, domain?: string }} params
 * @returns {Promise<Object>} raw hotel details payload (see shape above)
 */
export async function getHotelDetails({ hotelId, locale = DEFAULT_LOCALE, domain = DEFAULT_DOMAIN }) {
  const json = await apiGet("/v2/hotels/details", { hotel_id: hotelId, locale, domain });

  return json || {};
}

/* ------------------------------------------------------------------
   7. HOTEL INFO
   GET /v3/hotels/info?hotel_id=...&locale=en_IN&domain=IN
   Response: { data: { aboutThisProperty: [...], policies: [...],
     specialFeatures: [], amenities: [ { header: { text }, sections: [
       { header: { text }, items: [{ text, primary, markupType }] } ] } ] } }
------------------------------------------------------------------- */
/**
 * @param {{ hotelId: string, locale?: string, domain?: string }} params
 * @returns {Promise<Object>} { aboutThisProperty, policies, specialFeatures, amenities }
 */
export async function getHotelInfo({ hotelId, locale = DEFAULT_LOCALE, domain = DEFAULT_DOMAIN }) {
  const json = await apiGet("/v3/hotels/info", { hotel_id: hotelId, locale, domain });

  return json?.data || {};
}

/* ------------------------------------------------------------------
   8. REVIEWS SUMMARY
   GET /v2/hotels/reviews/summary?locale=en_IN&hotel_id=...&domain=IN
   Response: an ARRAY with a single object:
     [{ averageOverallRating: { raw }, cleanliness: { raw }, hotelCondition: { raw },
        roomComfort: { raw }, serviceAndStaff: { raw }, totalCount: { raw },
        reviewDisclaimer, propertyId }]
------------------------------------------------------------------- */
/**
 * @param {{ hotelId: string, locale?: string, domain?: string }} params
 * @returns {Promise<Object>} the single summary object (already unwrapped from the array)
 */
export async function getReviewsSummary({ hotelId, locale = DEFAULT_LOCALE, domain = DEFAULT_DOMAIN }) {
  const json = await apiGet("/v2/hotels/reviews/summary", { hotel_id: hotelId, locale, domain });

  // API returns an array with one summary object per hotel.
  return Array.isArray(json) ? json[0] || {} : json || {};
}

/* ------------------------------------------------------------------
   9. REVIEWS LIST  — endpoint NOT yet confirmed against a real response.
   Guessed path/params follow the same convention as the endpoints above.
   Replace once you have a sample payload.
------------------------------------------------------------------- */
/**
 * @param {{ hotelId: string, page?: number, locale?: string, domain?: string }} params
 * @returns {Promise<{ list: Array, page: number }>}
 */
export async function getReviewsList({
  hotelId,
  page = 1,
  locale = DEFAULT_LOCALE,
  domain = DEFAULT_DOMAIN,
}) {
  const json = await apiGet("/v2/hotels/reviews/list", {
    hotel_id: hotelId,
    page_number: page,
    locale,
    domain,
  });

  return {
    list: json?.data?.reviews || json?.data?.list || [],
    page: json?.data?.page_number || page,
  };
}

/* ------------------------------------------------------------------
   10. HOTEL ROOMS / OFFERS
   GET /v3/hotels/offers?hotel_id=...&checkin_date=YYYY-MM-DD&checkout_date=YYYY-MM-DD
     &adults_number=2&locale=en_IN&domain=IN
   RESPONSE SHAPE CONFIRMED (see module header comment for the full raw
   shape). The response is a single "OfferDetails" object returned
   directly — each room type lives in `categorizedListings[]`, and each
   one may be sold out (no ratePlans, `propertyUnit.availabilityCallToAction`
   set instead) or bookable (ratePlans[0] has the price + the natural key
   IDs booking needs).

   We normalize each categorized listing down to one flat "room" object
   so HotelDetailsPage doesn't need to know about the nested GraphQL-ish
   shape at all.
------------------------------------------------------------------- */
/**
 * @param {{ hotelId: string, checkIn: string, checkOut: string, adults?: number, locale?: string, domain?: string }} params
 * @returns {Promise<{ list: Array }>}
 */
export async function getHotelRooms({
  hotelId,
  checkIn,
  checkOut,
  adults = 2,
  locale = DEFAULT_LOCALE,
  domain = DEFAULT_DOMAIN,
}) {
  const json = await apiGet("/v3/hotels/offers", {
    hotel_id: hotelId,
    checkin_date: checkIn,
    checkout_date: checkOut,
    adults_number: adults,
    locale,
    domain,
  });

  // The confirmed sample has categorizedListings at the top level, but this
  // API is inconsistent about wrapping responses in `.data` (compare
  // getHotelDetails vs. getHotelInfo above) — check both until the real
  // request URL/shape for THIS endpoint is confirmed.
  const categorized = json?.categorizedListings || json?.data?.categorizedListings || [];

  if (categorized.length === 0) {
    // eslint-disable-next-line no-console
    console.warn(
      "[getHotelRooms] No categorizedListings found in response — the path or shape may not match what was confirmed. Raw response:",
      json
    );
  }

  const list = categorized.map((unit) => {
    const propertyUnit = unit.primarySelections?.[0]?.propertyUnit;
    const ratePlan = propertyUnit?.ratePlans?.[0];
    const offer = ratePlan?.priceDetails?.[0];
    const priceOption = offer?.price?.options?.[0];
    const naturalKey = offer?.propertyNaturalKeys?.[0];
    const soldOutMessage = propertyUnit?.availabilityCallToAction?.value;

    return {
      id: unit.unitId,
      name: unit.header?.text,
      tagline: unit.featureHeader?.text,
      image: propertyUnit?.unitGallery?.gallery?.[0]?.image?.url,
      imageAlt: propertyUnit?.unitGallery?.gallery?.[0]?.image?.description || unit.header?.text,
      features: (unit.features || []).map((f) => f.text).filter(Boolean),
      badge: ratePlan?.badge?.text,
      scarcityMessage: offer?.availability?.scarcityMessage,
      soldOut: !ratePlan || offer?.availability?.available === false,
      soldOutMessage,
      displayPrice: priceOption?.formattedDisplayPrice,
      strikeOutPrice: priceOption?.strikeOut?.formatted,
      // IDs needed to build the booking request in STEP 11.
      hotelId: naturalKey?.id || hotelId,
      roomTypeId: naturalKey?.roomTypeId || propertyUnit?.id,
      ratePlanId: naturalKey?.ratePlanId || ratePlan?.id,
    };
  });

  return { list };
}