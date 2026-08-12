// // import React, { useState, useEffect } from "react";
// // import { Plane, TrainFront, Landmark, MapPinned, UtensilsCrossed } from "lucide-react";

// // // India-flavoured version: IRCTC-style train icon, a landmark icon standing
// // // in for monuments (Taj Mahal, forts, temples), and Hindi + English labels
// // // side by side. Same center-zoom motion as the original, white background.
// // const ITEMS = [
// //   { Icon: Plane, hi: "उड़ान ढूंढ रहे हैं", en: "Finding flights" },
// //   { Icon: TrainFront, hi: "ट्रेन खोज रहे हैं", en: "Searching trains" },
// //   { Icon: Landmark, hi: "जगहें दिखा रहे हैं", en: "Exploring landmarks" },
// //   { Icon: UtensilsCrossed, hi: "स्वाद ढूंढ रहे हैं", en: "Finding local food" },
// //   { Icon: MapPinned, hi: "रूट बना रहे हैं", en: "Charting the route" },
// // ];

// // const DURATION = 1000; // ms per icon

// // export default function TravelLoaderDesi() {
// //   const [index, setIndex] = useState(0);

// //   useEffect(() => {
// //     const timer = setInterval(() => {
// //       setIndex((prev) => (prev + 1) % ITEMS.length);
// //     }, DURATION);
// //     return () => clearInterval(timer);
// //   }, []);

// //   const { Icon, hi, en } = ITEMS[index];

// //   return (
// //     <div className="td-wrap">
// //       <style>{`
// //         .td-wrap {
// //           min-height: 100vh;
// //           width: 100%;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           background: #ffffff;
// //           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
// //           overflow: hidden;
// //         }

// //         .td-col {
// //           display: flex;
// //           flex-direction: column;
// //           align-items: center;
// //         }

// //         .td-stage {
// //           position: relative;
// //           width: 200px;
// //           height: 200px;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //         }

// //         .td-arc {
// //           position: absolute;
// //           inset: 0;
// //           border-radius: 50%;
// //           border: 1px solid #f3ede3;
// //         }

// //         .td-icon-box {
// //           position: relative;
// //           display: flex;
// //           align-items: center;
// //           justify-content: center;
// //           width: 96px;
// //           height: 96px;
// //           border-radius: 26px;
// //           background: linear-gradient(160deg, #fff3ea 0%, #fff 60%);
// //           border: 1px solid #ffd7ae;
// //           box-shadow: 0 14px 34px -14px rgba(255, 122, 61, 0.4);
// //           animation: td-zoom ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1) both;
// //         }

// //         .td-icon-box svg {
// //           width: 42px;
// //           height: 42px;
// //           color: #ff7a3d;
// //           stroke-width: 1.6;
// //         }

// //         .td-icon-box::after {
// //           content: "";
// //           position: absolute;
// //           inset: -6px;
// //           border-radius: 30px;
// //           border: 1px solid #1a7a4c;
// //           opacity: 0.18;
// //         }

// //         @keyframes td-zoom {
// //           0% { opacity: 0; transform: scale(0.25); }
// //           10% { opacity: 1; transform: scale(1.06); }
// //           18% { transform: scale(1); }
// //           88% { opacity: 1; transform: scale(1); }
// //           100% { opacity: 0; transform: scale(1.3); }
// //         }

// //         .td-label-hi {
// //           margin-top: 26px;
// //           text-align: center;
// //           color: #241f1a;
// //           font-size: 17px;
// //           font-weight: 600;
// //           animation: td-fade ${DURATION}ms ease both;
// //         }

// //         .td-label-en {
// //           margin-top: 4px;
// //           text-align: center;
// //           color: #928a7c;
// //           font-size: 13px;
// //           letter-spacing: 0.02em;
// //           animation: td-fade ${DURATION}ms ease both;
// //         }

// //         @keyframes td-fade {
// //           0% { opacity: 0; transform: translateY(6px); }
// //           10% { opacity: 1; transform: translateY(0); }
// //           88% { opacity: 1; }
// //           100% { opacity: 0; }
// //         }

// //         .td-dots {
// //           margin-top: 22px;
// //           display: flex;
// //           gap: 8px;
// //         }

// //         .td-dot {
// //           width: 6px;
// //           height: 6px;
// //           border-radius: 50%;
// //           background: #f0e6d8;
// //           transition: background 0.3s ease, transform 0.3s ease;
// //         }

// //         .td-dot.active {
// //           background: #ff7a3d;
// //           transform: scale(1.4);
// //         }

// //         @media (prefers-reduced-motion: reduce) {
// //           .td-icon-box, .td-label-hi, .td-label-en {
// //             animation: none !important;
// //           }
// //         }
// //       `}</style>

// //       <div className="td-col">
// //         <div className="td-stage">
// //           <div className="td-arc" />
// //           <div className="td-icon-box" key={index}>
// //             <Icon />
// //           </div>
// //         </div>

// //         <div className="td-label-hi" key={`hi-${index}`}>{hi}</div>
// //         <div className="td-label-en" key={`en-${index}`}>{en}</div>

// //         <div className="td-dots">
// //           {ITEMS.map((_, i) => (
// //             <div key={i} className={`td-dot ${i === index ? "active" : ""}`} />
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// // animation 02: orbit

// import React, { useState, useEffect } from "react";
// import { Plane, Building2, MapPin, Luggage, Compass } from "lucide-react";

// // Icons sit on an orbit ring around a center hub. One at a time, an icon
// // travels from its ring position into the center, zooms up large, then
// // returns to the ring as the next one makes its trip inward.
// const ITEMS = [
//   { Icon: Plane, label: "Finding flights" },
//   { Icon: Building2, label: "Checking hotels" },
//   { Icon: MapPin, label: "Mapping your stops" },
//   { Icon: Luggage, label: "Packing the essentials" },
//   { Icon: Compass, label: "Charting the route" },
// ];

// const DURATION = 1000; // ms per icon
// const RADIUS = 90;

// export default function TravelLoaderOrbit() {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % ITEMS.length);
//     }, DURATION);
//     return () => clearInterval(timer);
//   }, []);

//   const angleFor = (i) => (360 / ITEMS.length) * i - 90;

//   return (
//     <div className="to-wrap">
//       <style>{`
//         .to-wrap {
//           min-height: 100vh;
//           width: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: #ffffff;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
//         }

//         .to-col {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         .to-stage {
//           position: relative;
//           width: ${RADIUS * 2 + 60}px;
//           height: ${RADIUS * 2 + 60}px;
//         }

//         .to-orbit-ring {
//           position: absolute;
//           inset: 30px;
//           border-radius: 50%;
//           border: 1px dashed #f0e9df;
//         }

//         .to-node {
//           position: absolute;
//           top: 50%;
//           left: 50%;
//           width: 40px;
//           height: 40px;
//           margin: -20px;
//           border-radius: 12px;
//           background: #faf7f2;
//           border: 1px solid #f0e6d8;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.4, 0.1, 0.2, 1),
//             width 0.5s ease, height 0.5s ease, box-shadow 0.5s ease, background 0.5s ease, border-color 0.5s ease;
//         }

//         .to-node svg {
//           width: 18px;
//           height: 18px;
//           color: #b9ac98;
//           stroke-width: 1.6;
//           transition: color 0.5s ease, width 0.5s ease, height 0.5s ease;
//         }

//         .to-node.active {
//           width: 84px;
//           height: 84px;
//           margin: -42px;
//           left: 50%;
//           top: 50%;
//           transform: translate(0, 0) !important;
//           background: linear-gradient(160deg, #fff4ec, #fff);
//           border-color: #ffd0a8;
//           box-shadow: 0 14px 34px -12px rgba(255, 122, 61, 0.4);
//           z-index: 2;
//         }

//         .to-node.active svg {
//           width: 38px;
//           height: 38px;
//           color: #ff7a3d;
//         }

//         .to-label {
//           margin-top: 22px;
//           min-height: 20px;
//           text-align: center;
//           color: #3a3530;
//           font-size: 15px;
//           letter-spacing: 0.02em;
//           font-weight: 500;
//           animation: to-fade ${DURATION}ms ease both;
//         }

//         @keyframes to-fade {
//           0% { opacity: 0; transform: translateY(4px); }
//           15% { opacity: 1; transform: translateY(0); }
//           85% { opacity: 1; }
//           100% { opacity: 0; }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .to-node, .to-label {
//             transition: none !important;
//             animation: none !important;
//           }
//         }
//       `}</style>

//       <div className="to-col">
//         <div className="to-stage">
//           <div className="to-orbit-ring" />
//           {ITEMS.map(({ Icon }, i) => {
//             const active = i === index;
//             const angle = (angleFor(i) * Math.PI) / 180;
//             const x = active ? 0 : Math.cos(angle) * RADIUS;
//             const y = active ? 0 : Math.sin(angle) * RADIUS;
//             return (
//               <div
//                 key={i}
//                 className={`to-node ${active ? "active" : ""}`}
//                 style={{ transform: `translate(${x}px, ${y}px)` }}
//               >
//                 <Icon />
//               </div>
//             );
//           })}
//         </div>
//         <div className="to-label" key={index}>{ITEMS[index].label}</div>
//       </div>
//     </div>
//   );
// }


// Animation 03: Flip

// import React, { useState, useEffect } from "react";
// import { Plane, Building2, MapPin, Luggage, Compass } from "lucide-react";

// // Each card flips over in place (like a flashcard) to reveal the next
// // travel icon, centered on a white background.
// const ITEMS = [
//   { Icon: Plane, label: "Finding flights" },
//   { Icon: Building2, label: "Checking hotels" },
//   { Icon: MapPin, label: "Mapping your stops" },
//   { Icon: Luggage, label: "Packing the essentials" },
//   { Icon: Compass, label: "Charting the route" },
// ];

// const DURATION = 1400; // ms per icon

// export default function TravelLoaderFlip() {
//   const [index, setIndex] = useState(0);
//   const [flip, setFlip] = useState(false);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setFlip((f) => !f);
//       setIndex((prev) => (prev + 1) % ITEMS.length);
//     }, DURATION);
//     return () => clearInterval(timer);
//   }, []);

//   const { Icon, label } = ITEMS[index];

//   return (
//     <div className="tf-wrap">
//       <style>{`
//         .tf-wrap {
//           min-height: 100vh;
//           width: 100%;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           background: #ffffff;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
//           perspective: 900px;
//         }

//         .tf-col {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         .tf-card {
//           width: 110px;
//           height: 110px;
//           border-radius: 24px;
//           background: linear-gradient(160deg, #fff4ec, #fff);
//           border: 1px solid #ffd9bd;
//           box-shadow: 0 12px 30px -12px rgba(255, 122, 61, 0.35);
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           transform-style: preserve-3d;
//           animation: tf-flip ${DURATION}ms cubic-bezier(0.4, 0.1, 0.2, 1) both;
//         }

//         .tf-card svg {
//           width: 44px;
//           height: 44px;
//           color: #ff7a3d;
//           stroke-width: 1.6;
//           backface-visibility: hidden;
//         }

//         @keyframes tf-flip {
//           0% { transform: rotateY(-90deg); }
//           45% { transform: rotateY(0deg); }
//           100% { transform: rotateY(0deg); }
//         }

//         .tf-label {
//           margin-top: 26px;
//           min-height: 20px;
//           text-align: center;
//           color: #3a3530;
//           font-size: 15px;
//           letter-spacing: 0.02em;
//           font-weight: 500;
//           animation: tf-fade 0.4s ease both;
//         }

//         @keyframes tf-fade {
//           0% { opacity: 0; transform: translateY(4px); }
//           100% { opacity: 1; transform: translateY(0); }
//         }

//         .tf-bar {
//           margin-top: 22px;
//           width: 140px;
//           height: 3px;
//           border-radius: 2px;
//           background: #f1ece4;
//           overflow: hidden;
//         }

//         .tf-bar-fill {
//           height: 100%;
//           background: #ff7a3d;
//           border-radius: 2px;
//           animation: tf-progress ${DURATION}ms linear infinite;
//         }

//         @keyframes tf-progress {
//           0% { width: 0%; }
//           100% { width: 100%; }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .tf-card, .tf-label, .tf-bar-fill {
//             animation: none !important;
//           }
//         }
//       `}</style>

//       <div className="tf-col">
//         <div className="tf-card" key={index}>
//           <Icon />
//         </div>
//         <div className="tf-label" key={`label-${index}`}>{label}</div>
//         <div className="tf-bar" key={`bar-${index}`}>
//           <div className="tf-bar-fill" />
//         </div>
//       </div>
//     </div>
//   );
// }


// // Animation 03: Branded horizontal variant

// import React, { useState, useEffect } from "react";
// import { Plane, TrainFront, Landmark, UtensilsCrossed, MapPinned } from "lucide-react";

// // Branded loader: "Desi Videsi" wordmark sits above the animation, icon
// // zooms in center, warm cream background (distinct from the white and
// // navy variants already built).
// const ITEMS = [
//   { Icon: Plane, hi: "उड़ान ढूंढ रहे हैं", en: "Finding flights" },
//   { Icon: TrainFront, hi: "ट्रेन खोज रहे हैं", en: "Searching trains" },
//   { Icon: Landmark, hi: "जगहें दिखा रहे हैं", en: "Exploring landmarks" },
//   { Icon: UtensilsCrossed, hi: "स्वाद ढूंढ रहे हैं", en: "Finding local food" },
//   { Icon: MapPinned, hi: "रूट बना रहे हैं", en: "Charting the route" },
// ];

// const DURATION = 1600; // ms per icon

// export default function TravelLoaderBrand() {
//   const [index, setIndex] = useState(0);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setIndex((prev) => (prev + 1) % ITEMS.length);
//     }, DURATION);
//     return () => clearInterval(timer);
//   }, []);

//   const { Icon, hi, en } = ITEMS[index];

//   return (
//     <div className="tb-wrap">
//       <style>{`
//         .tb-wrap {
//           min-height: 100vh;
//           width: 100%;
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//           justify-content: center;
//           background: #fdf6ec;
//           font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
//           overflow: hidden;
//         }

//         .tb-logo {
//           display: flex;
//           align-items: baseline;
//           gap: 2px;
//           margin-bottom: 46px;
//         }

//         .tb-logo-desi {
//           font-size: 26px;
//           font-weight: 800;
//           color: #ff7a3d;
//           letter-spacing: -0.01em;
//         }

//         .tb-logo-videsi {
//           font-size: 26px;
//           font-weight: 800;
//           color: #1a7a4c;
//           letter-spacing: -0.01em;
//         }

//         .tb-logo-tag {
//           margin-top: 6px;
//           font-size: 11px;
//           letter-spacing: 0.16em;
//           text-transform: uppercase;
//           color: #b7ac98;
//           text-align: center;
//         }

//         .tb-col {
//           display: flex;
//           flex-direction: column;
//           align-items: center;
//         }

//         .tb-stage {
//           position: relative;
//           width: 200px;
//           height: 200px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//         }

//         .tb-arc {
//           position: absolute;
//           inset: 0;
//           border-radius: 50%;
//           border: 1px solid #f1e4cf;
//         }

//         .tb-icon-box {
//           position: relative;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           width: 96px;
//           height: 96px;
//           border-radius: 26px;
//           background: linear-gradient(160deg, #ffffff 0%, #fff3e4 100%);
//           border: 1px solid #ffd7ae;
//           box-shadow: 0 14px 34px -14px rgba(255, 122, 61, 0.35);
//           animation: tb-zoom ${DURATION}ms cubic-bezier(0.22, 1, 0.36, 1) both;
//         }

//         .tb-icon-box svg {
//           width: 42px;
//           height: 42px;
//           color: #ff7a3d;
//           stroke-width: 1.6;
//         }

//         @keyframes tb-zoom {
//           0% { opacity: 0; transform: scale(0.25); }
//           10% { opacity: 1; transform: scale(1.06); }
//           18% { transform: scale(1); }
//           88% { opacity: 1; transform: scale(1); }
//           100% { opacity: 0; transform: scale(1.3); }
//         }

//         .tb-label-hi {
//           margin-top: 24px;
//           text-align: center;
//           color: #2b2620;
//           font-size: 17px;
//           font-weight: 600;
//           animation: tb-fade ${DURATION}ms ease both;
//         }

//         .tb-label-en {
//           margin-top: 4px;
//           text-align: center;
//           color: #a89c86;
//           font-size: 13px;
//           letter-spacing: 0.02em;
//           animation: tb-fade ${DURATION}ms ease both;
//         }

//         @keyframes tb-fade {
//           0% { opacity: 0; transform: translateY(6px); }
//           10% { opacity: 1; transform: translateY(0); }
//           88% { opacity: 1; }
//           100% { opacity: 0; }
//         }

//         .tb-dots {
//           margin-top: 22px;
//           display: flex;
//           gap: 8px;
//         }

//         .tb-dot {
//           width: 6px;
//           height: 6px;
//           border-radius: 50%;
//           background: #f1e4cf;
//           transition: background 0.3s ease, transform 0.3s ease;
//         }

//         .tb-dot.active {
//           background: #ff7a3d;
//           transform: scale(1.4);
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .tb-icon-box, .tb-label-hi, .tb-label-en {
//             animation: none !important;
//           }
//         }
//       `}</style>

//       <div className="tb-col">
//         <span className="tb-logo-tag" style={{ marginBottom: 8 }}>Loading your trip</span>
//         <div className="tb-logo">
//           <span className="tb-logo-desi">Desi</span>
//           <span className="tb-logo-videsi">Videsi</span>
//         </div>
//       </div>

//       <div className="tb-col">
//         <div className="tb-stage">
//           <div className="tb-arc" />
//           <div className="tb-icon-box" key={index}>
//             <Icon />
//           </div>
//         </div>

//         <div className="tb-label-hi" key={`hi-${index}`}>{hi}</div>
//         <div className="tb-label-en" key={`en-${index}`}>{en}</div>

//         <div className="tb-dots">
//           {ITEMS.map((_, i) => (
//             <div key={i} className={`tb-dot ${i === index ? "active" : ""}`} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { Plane, TrainFront, Landmark, UtensilsCrossed, MapPinned } from "lucide-react";

// Branded horizontal variant: row of icons, active one zooms up in place,
// "Desi Videsi" wordmark above, soft sky-blue background (a third distinct
// background from the white and cream variants).
const ITEMS = [
  { Icon: Plane, hi: "उड़ान", en: "Flights" },
  { Icon: TrainFront, hi: "ट्रेन", en: "Trains" },
  { Icon: Landmark, hi: "स्थल", en: "Landmarks" },
  { Icon: UtensilsCrossed, hi: "स्वाद", en: "Food" },
  { Icon: MapPinned, hi: "रूट", en: "Route" },
];

const DURATION = 900; // ms per icon

 function TravelLoaderBrandHorizontal() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ITEMS.length);
    }, DURATION);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="tbh-wrap">
      <style>{`
        .tbh-wrap {
          min-height: 100vh;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #eef6fb;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .tbh-logo {
          display: flex;
          align-items: baseline;
          gap: 2px;
          margin-bottom: 8px;
        }

        .tbh-logo-desi {
          font-size: 24px;
          font-weight: 800;
          color: #ff7a3d;
          letter-spacing: -0.01em;
        }

        .tbh-logo-videsi {
          font-size: 24px;
          font-weight: 800;
          color: #1a7a9c;
          letter-spacing: -0.01em;
        }

        .tbh-tag {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #8fa7bb;
          margin-bottom: 64px;
        }

        .tbh-row {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 26px;
        }

        .tbh-item {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
        }

        .tbh-item-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 54px;
          height: 54px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid #dbeaf4;
          opacity: 0.45;
          transform: scale(0.82);
          transform-origin: center bottom;
          transition: opacity 0.18s ease, transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
            background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
        }

        .tbh-item-box svg {
          width: 22px;
          height: 22px;
          color: #9ab3c6;
          stroke-width: 1.6;
          transition: color 0.18s ease, width 0.18s ease, height 0.18s ease;
        }

        .tbh-item.active .tbh-item-box {
          opacity: 1;
          transform: scale(1.65);
          background: linear-gradient(160deg, #fff, #eaf6ff);
          border-color: #b7dcf2;
          box-shadow: 0 10px 26px -10px rgba(26, 122, 156, 0.35);
          z-index: 2;
        }

        .tbh-item.active .tbh-item-box svg {
          color: #1a7a9c;
          width: 26px;
          height: 26px;
        }

        .tbh-item-hi {
          font-size: 12px;
          color: #7d93a5;
          opacity: 0.6;
          transition: opacity 0.18s ease, color 0.18s ease;
        }

        .tbh-item.active .tbh-item-hi {
          opacity: 1;
          color: #1a4a63;
          font-weight: 600;
        }

        .tbh-label {
          margin-top: 40px;
          min-height: 18px;
          text-align: center;
          color: #4a6376;
          font-size: 13px;
          letter-spacing: 0.03em;
        }

        @media (prefers-reduced-motion: reduce) {
          .tbh-item-box {
            transition: none !important;
          }
        }
      `}</style>

      <div className="tbh-logo">
        <span className="tbh-logo-desi">Desi</span>
        <span className="tbh-logo-videsi">Videsi</span>
      </div>
      <div className="tbh-tag">Loading your trip</div>

      <div className="tbh-row">
        {ITEMS.map(({ Icon, hi }, i) => (
          <div key={i} className={`tbh-item ${i === index ? "active" : ""}`}>
            <div className="tbh-item-box"><Icon /></div>
            <span className="tbh-item-hi">{hi}</span>
          </div>
        ))}
      </div>

      <div className="tbh-label">{ITEMS[index].en}</div>
    </div>
  );
}

export default TravelLoaderBrandHorizontal;