import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { searchStays, normalizeStayCard } from "../../Services/stayService.js";
import StayStyles from "./Staystyles.jsx";
import StayListItem from "./StayListItem.jsx";
import HotelHeader from "./component/Header.jsx";

/* ------------------------------------------------------------------
   STEP 3-5: Search hotels for geoId/dates -> show list -> click hotel
------------------------------------------------------------------- */

function extractList(res) {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.list)) return res.list;
  if (Array.isArray(res?.results)) return res.results;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.hotels)) return res.hotels;
  return [];
}

export default function StayListPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const regionId = searchParams.get("regionId") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const label = searchParams.get("label") || "";

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!regionId || !checkIn || !checkOut) {
      setList([]);
      setNotice({
        type: "error",
        text: "Missing destination or dates. Go back and search again.",
      });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setNotice(null);
    setList([]);

    searchStays({ regionId, checkIn, checkOut })
      .then((res) => {
        if (cancelled) return;

        if (process.env.NODE_ENV !== "production") {
          console.log("[StayListPage] searchStays raw response:", res);
        }

        const results = extractList(res).map(normalizeStayCard);
        setList(results);
        setNotice(
          results.length === 0
            ? { type: "empty", text: "No stays found for this search." }
            : {
                type: "live",
                text: `Loaded ${results.length} live result${results.length > 1 ? "s" : ""}.`,
              },
        );
      })
      .catch((err) => {
        if (cancelled) return;
        setList([]);
        setNotice({
          type: "error",
          text: `Couldn't load live results (${err.message}).`,
        });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [regionId, checkIn, checkOut]);

  const handleSelect = useCallback(
    (item) => {
      const hotelId = item.id;
      if (!hotelId) return;
      const params = new URLSearchParams({ checkIn, checkOut });
      navigate(`/stays/hotel/${hotelId}?${params.toString()}`);
    },
    [checkIn, checkOut, navigate],
  );

  const formatRange = (a, b) => {
    const fmt = (iso) => {
      if (!iso) return "—";
      const d = new Date(iso);
      return Number.isNaN(d.getTime())
        ? iso
        : d.toLocaleDateString("en-IN", {
            weekday: "short",
            day: "2-digit",
            month: "short",
          });
    };
    return `${fmt(a)} → ${fmt(b)}`;
  };

  return (
    <>
      <div className="app">
        <HotelHeader />
        <StayStyles />

        {label && (
          <>
            <h1 className="page-title">{`Stays in ${label}`}</h1>
            <p className="selected-note" style={{ margin: "-14px auto 22px" }}>
              {formatRange(checkIn, checkOut)}
            </p>
          </>
        )}

        {notice && <div className={`notice ${notice.type}`}>{notice.text}</div>}

        {loading ? (
          <div className="stay-list" aria-busy="true" aria-label="Loading stays">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="stay-row stay-row-skeleton" key={i}>
                <div className="stay-row-photo">
                  <div
                    className="tag-skeleton-block"
                    style={{ position: "absolute", inset: 0, borderRadius: 0 }}
                  />
                </div>
                <div className="stay-row-body">
                  <div className="stay-row-main">
                    <div className="tag-skeleton-line" style={{ width: "40%" }} />
                    <div
                      className="tag-skeleton-line"
                      style={{ width: "70%", height: 18, marginTop: 4 }}
                    />
                    <div className="tag-skeleton-line" style={{ width: "50%" }} />
                  </div>
                  <div className="tag-skeleton-line" style={{ width: "80px", marginTop: 10 }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="stay-list">
            {list.map((item) => (
              <StayListItem
                key={item.id}
                item={item}
                checkIn={checkIn}
                checkOut={checkOut}
                onSelect={handleSelect}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}