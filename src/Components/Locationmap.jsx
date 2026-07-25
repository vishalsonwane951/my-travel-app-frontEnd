// Components/LocationMap.jsx
// Reusable Google Maps embed component
// Accepts lat/lng directly OR a locationUrl (Google Maps share link) as fallback
//
// USAGE EXAMPLES:
//
// 1. With lat/lng (from API response):
//    <LocationMap lat={26.9124} lng={75.7873} title="Jaipur" />
//
// 2. With a Google Maps URL (auto-parsed):
//    <LocationMap locationUrl="https://maps.google.com/?q=26.9124,75.7873" title="Jaipur" />
//
// 3. Full control — custom height, theme, zoom, address subtitle:
//    <LocationMap
//      lat={26.9124} lng={75.7873}
//      title="Jaipur" subtitle="Rajasthan, India"
//      height={420} zoom={14}
//      theme="light"           // "dark" | "light" | "navy"  (default: "navy")
//      defaultView="satellite" // "roadmap" | "satellite"    (default: "roadmap")
//      showDirections          // shows a "Get Directions" chip
//      showCopyCoords          // shows a copy-coords chip
//      className="mb-4"
//    />
//
// 4. Minimal / embedded anywhere (hotel card, contact page, etc.):
//    <LocationMap lat={28.6139} lng={77.2090} title="New Delhi" height={220} compact />

import React, { useState, useCallback, useRef } from "react";
import {
  FaMapMarkerAlt,
  FaDirections,
  FaExternalLinkAlt,
  FaCopy,
  FaCheck,
  FaExpand,
  FaCompress,
  FaSatellite,
  FaMap,
} from "react-icons/fa";

// ─── helpers ──────────────────────────────────────────────────────────────────

/** Parse lat/lng out of a Google Maps share URL */
function extractLatLng(url) {
  if (!url) return null;
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch)
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  const llMatch = url.match(/[?&](?:ll|center|q)=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (llMatch)
    return { lat: parseFloat(llMatch[1]), lng: parseFloat(llMatch[2]) };
  return null;
}

// ─── theme tokens ─────────────────────────────────────────────────────────────

const THEMES = {
  navy: {
    header: "#1A2340",
    headerBorder: "rgba(255,255,255,0.10)",
    titleColor: "#ffffff",
    subtitleColor: "rgba(255,255,255,0.55)",
    chipBg: "rgba(255,255,255,0.10)",
    chipColor: "rgba(255,255,255,0.75)",
    chipHover: "rgba(255,255,255,0.20)",
    chipBorder: "rgba(255,255,255,0.18)",
    pinColor: "#F04B5A",
    cardBorder: "#E5E7EB",
    cardShadow: "0 4px 24px rgba(0,0,0,0.10)",
    footerBg: "#F5F6F8",
    footerColor: "#6B7280",
    expandBg: "rgba(26,35,64,0.85)",
    expandColor: "#fff",
  },
  light: {
    header: "#ffffff",
    headerBorder: "#E5E7EB",
    titleColor: "#111827",
    subtitleColor: "#6B7280",
    chipBg: "#F3F4F6",
    chipColor: "#374151",
    chipHover: "#E5E7EB",
    chipBorder: "#E5E7EB",
    pinColor: "#F04B5A",
    cardBorder: "#E5E7EB",
    cardShadow: "0 4px 24px rgba(0,0,0,0.07)",
    footerBg: "#F9FAFB",
    footerColor: "#9CA3AF",
    expandBg: "rgba(17,24,39,0.80)",
    expandColor: "#fff",
  },
  dark: {
    header: "#111827",
    headerBorder: "rgba(255,255,255,0.08)",
    titleColor: "#F9FAFB",
    subtitleColor: "rgba(249,250,251,0.50)",
    chipBg: "rgba(255,255,255,0.07)",
    chipColor: "rgba(249,250,251,0.70)",
    chipHover: "rgba(255,255,255,0.15)",
    chipBorder: "rgba(255,255,255,0.12)",
    pinColor: "#F04B5A",
    cardBorder: "#374151",
    cardShadow: "0 4px 24px rgba(0,0,0,0.30)",
    footerBg: "#1F2937",
    footerColor: "#6B7280",
    expandBg: "rgba(0,0,0,0.85)",
    expandColor: "#fff",
  },
};

export default function LocationMap({
  lat,
  lng,
  locationUrl,
  title = "Location",
  subtitle,
  height = 340,
  zoom = 13,
  theme = "navy",
  compact = false,
  showDirections = true,
  showCopyCoords = false,
  defaultView = "roadmap", // "roadmap" | "satellite"
  className = "",
  style = {},
  apiKey,
}) {
  const tk = THEMES[theme] || THEMES.navy;

  // resolve coordinates
  const resolved =
    lat != null && lng != null ? { lat, lng } : extractLatLng(locationUrl);

  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapView, setMapView] = useState(defaultView); // "roadmap" | "satellite"
  const iframeRef = useRef(null);

  const handleCopy = useCallback(() => {
    if (!resolved) return;
    navigator.clipboard
      .writeText(`${resolved.lat}, ${resolved.lng}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
  }, [resolved]);

  // ── no coords → graceful empty state ──────────────────────────────────────
  if (!resolved) {
    return (
      <div
        className={className}
        style={{
          borderRadius: 16,
          border: `1px dashed ${tk.cardBorder}`,
          height,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: tk.footerBg,
          color: tk.footerColor,
          fontSize: ".85rem",
          ...style,
        }}
      >
        <FaMapMarkerAlt size={28} color={tk.pinColor} opacity={0.45} />
        <span>Map unavailable — no coordinates provided</span>
      </div>
    );
  }

  // ── build iframe src ───────────────────────────────────────────────────────
  const buildSrc = (view) => {
    if (apiKey) {
      return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${resolved.lat},${resolved.lng}&zoom=${zoom}&maptype=${view}`;
    }
    // no-key fallback: t=k is satellite, t=m is roadmap
    const mapType = view === "satellite" ? "k" : "m";
    return `https://maps.google.com/maps?q=${resolved.lat},${resolved.lng}&z=${zoom}&t=${mapType}&output=embed`;
  };

  const iframeSrc = buildSrc(mapView);
  const expandedSrc = buildSrc(mapView);

  const googleMapsUrl = `https://www.google.com/maps?q=${resolved.lat},${resolved.lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${resolved.lat},${resolved.lng}`;

  // ── chip helper ────────────────────────────────────────────────────────────
  const Chip = ({ href, onClick, icon, label, title: chipTitle }) => {
    const [hovered, setHovered] = useState(false);
    const shared = {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      fontSize: ".74rem",
      fontWeight: 600,
      padding: "5px 13px",
      borderRadius: 50,
      border: `1px solid ${tk.chipBorder}`,
      background: hovered ? tk.chipHover : tk.chipBg,
      color: hovered ? (theme === "light" ? "#111827" : "#fff") : tk.chipColor,
      cursor: "pointer",
      transition: "all .18s",
      textDecoration: "none",
      fontFamily: "'DM Sans', sans-serif",
      whiteSpace: "nowrap",
      flexShrink: 0,
    };
    if (href) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          title={chipTitle}
          style={shared}
          onMouseOver={() => setHovered(true)}
          onMouseOut={() => setHovered(false)}
        >
          {icon} {label}
        </a>
      );
    }
    return (
      <button
        type="button"
        title={chipTitle}
        style={{ ...shared, outline: "none" }}
        onClick={onClick}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        {icon} {label}
      </button>
    );
  };

  // ── expand / fullscreen overlay ────────────────────────────────────────────
  const ExpandedOverlay = () => (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setExpanded(false);
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.80)",
        backdropFilter: "blur(8px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        animation: "lm-fade-in .2s ease both",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
        }}
      >
        {/* header */}
        <div
          style={{
            background: tk.header,
            borderBottom: `1px solid ${tk.headerBorder}`,
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <FaMapMarkerAlt size={14} color={tk.pinColor} />
          <span
            style={{
              color: tk.titleColor,
              fontWeight: 700,
              fontSize: ".95rem",
              flex: 1,
            }}
          >
            {title}
            {subtitle && (
              <span
                style={{
                  color: tk.subtitleColor,
                  fontWeight: 400,
                  marginLeft: 8,
                  fontSize: ".82rem",
                }}
              >
                {subtitle}
              </span>
            )}
          </span>

          {/* view toggle in expanded overlay */}
          <div
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.08)",
              borderRadius: 50,
              border: `1px solid ${tk.chipBorder}`,
              padding: 3,
              gap: 2,
            }}
          >
            {[
              { key: "roadmap", icon: <FaMap size={10} />, label: "Map" },
              {
                key: "satellite",
                icon: <FaSatellite size={10} />,
                label: "Satellite",
              },
            ].map((v) => {
              const isActive = mapView === v.key;
              return (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => {
                    setMapLoaded(false);
                    setMapView(v.key);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: ".72rem",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: 50,
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                    transition: "all .18s",
                    background: isActive ? "#fff" : "transparent",
                    color: isActive ? "#111827" : tk.chipColor,
                    boxShadow: isActive ? "0 1px 6px rgba(0,0,0,0.18)" : "none",
                  }}
                >
                  {v.icon} {v.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setExpanded(false)}
            style={{
              background: "rgba(255,255,255,.12)",
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FaCompress size={13} />
          </button>
        </div>
        {/* iframe */}
        <iframe
          src={expandedSrc}
          width="100%"
          height="600"
          style={{ border: 0, display: "block", flex: 1 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${title} — expanded`}
        />
      </div>
    </div>
  );

  // ── main render ────────────────────────────────────────────────────────────
  return (
    <>
      {/* inject keyframe once */}
      <style>{`
        @keyframes lm-fade-in { from { opacity:0; transform:scale(.97) } to { opacity:1; transform:scale(1) } }
        .lm-expand-btn { position:absolute; bottom:12px; right:12px; width:36px; height:36px; border-radius:50%; border:none; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all .2s; }
        .lm-expand-btn:hover { transform:scale(1.1); }
        .lm-skeleton { background: linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%); background-size:400px 100%; animation:lm-shimmer 1.4s infinite; }
        @keyframes lm-shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
      `}</style>

      <div
        className={className}
        style={{
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${tk.cardBorder}`,
          boxShadow: tk.cardShadow,
          ...style,
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            background: tk.header,
            borderBottom: `1px solid ${tk.headerBorder}`,
            padding: "13px 18px",
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
            minHeight: 52,
          }}
        >
          <FaMapMarkerAlt
            size={13}
            color={tk.pinColor}
            style={{ flexShrink: 0 }}
          />

          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                color: tk.titleColor,
                fontWeight: 700,
                fontSize: ".9rem",
                fontFamily: "'DM Sans', sans-serif",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {title}
            </div>
            {subtitle && (
              <div
                style={{
                  color: tk.subtitleColor,
                  fontSize: ".72rem",
                  fontFamily: "'DM Sans', sans-serif",
                  marginTop: 1,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          {/* chips */}
          <div
            style={{
              display: "flex",
              gap: 6,
              flexShrink: 0,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {showDirections && (
              <Chip
                href={directionsUrl}
                icon={<FaDirections size={11} />}
                label="Directions"
                chipTitle="Get directions to this location"
              />
            )}
            {showCopyCoords && (
              <Chip
                onClick={handleCopy}
                icon={copied ? <FaCheck size={10} /> : <FaCopy size={10} />}
                label={
                  copied
                    ? "Copied!"
                    : `${resolved.lat.toFixed(4)}, ${resolved.lng.toFixed(4)}`
                }
                chipTitle="Copy coordinates"
              />
            )}
            <Chip
              href={googleMapsUrl}
              icon={<FaExternalLinkAlt size={10} />}
              label="Open Maps"
              chipTitle="Open in Google Maps"
            />

            {/* ── View toggle: Roadmap / Satellite ── */}
            <div
              style={{
                display: "flex",
                background: "rgba(255,255,255,0.08)",
                borderRadius: 50,
                border: `1px solid ${tk.chipBorder}`,
                padding: 3,
                gap: 2,
                flexShrink: 0,
              }}
            >
              {[
                { key: "roadmap", icon: <FaMap size={10} />, label: "Map" },
                {
                  key: "satellite",
                  icon: <FaSatellite size={10} />,
                  label: "Satellite",
                },
              ].map((v) => {
                const isActive = mapView === v.key;
                return (
                  <button
                    key={v.key}
                    type="button"
                    title={`Switch to ${v.label} view`}
                    onClick={() => {
                      setMapLoaded(false);
                      setMapView(v.key);
                    }}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: ".72rem",
                      fontWeight: 600,
                      padding: "4px 10px",
                      borderRadius: 50,
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                      whiteSpace: "nowrap",
                      transition: "all .18s",
                      background: isActive
                        ? theme === "light"
                          ? "#111827"
                          : "#fff"
                        : "transparent",
                      color: isActive
                        ? theme === "light"
                          ? "#fff"
                          : "#111827"
                        : tk.chipColor,
                      boxShadow: isActive
                        ? "0 1px 6px rgba(0,0,0,0.18)"
                        : "none",
                    }}
                  >
                    {v.icon} {v.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Map iframe ── */}
        <div style={{ position: "relative", background: "#e8eaed" }}>
          {/* skeleton shimmer while loading */}
          {!mapLoaded && (
            <div
              className="lm-skeleton"
              style={{ position: "absolute", inset: 0, zIndex: 1 }}
            />
          )}

          <iframe
            ref={iframeRef}
            src={iframeSrc}
            width="100%"
            height={height}
            style={{
              border: 0,
              display: "block",
              opacity: mapLoaded ? 1 : 0,
              transition: "opacity .4s",
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map of ${title}`}
            onLoad={() => setMapLoaded(true)}
          />

          {/* expand button */}
          <button
            className="lm-expand-btn"
            onClick={() => setExpanded(true)}
            title="Expand map"
            style={{
              background: tk.expandBg,
              color: tk.expandColor,
            }}
          >
            <FaExpand size={12} />
          </button>
        </div>

        {/* ── Footer (coordinates bar) ── */}
        {!compact && (
          <div
            style={{
              background: tk.footerBg,
              borderTop: `1px solid ${tk.cardBorder}`,
              padding: "8px 18px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            <span
              style={{
                fontSize: ".7rem",
                color: tk.footerColor,
                fontFamily: "'DM Sans', sans-serif",
                letterSpacing: ".02em",
              }}
            >
              📍 {resolved.lat.toFixed(5)}, {resolved.lng.toFixed(5)}
            </span>
            <span
              style={{
                fontSize: ".68rem",
                color: tk.footerColor,
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              {mapView === "satellite" ? (
                <FaSatellite size={10} />
              ) : (
                <FaMap size={10} />
              )}
              {mapView === "satellite" ? "Satellite View" : "Map View"} ·
              Powered by Google Maps
            </span>
          </div>
        )}
      </div>

      {/* expanded fullscreen overlay */}
      {expanded && <ExpandedOverlay />}
    </>
  );
}
