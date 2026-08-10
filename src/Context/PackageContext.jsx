// // PackageContext.jsx
// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";

// export const PackageContext = createContext();

// export const PackageProvider = ({ children }) => {
//   const [selectedType, setSelectedType] = useState(null);
//   const [types, setTypes] = useState([]); // fetched from DB

//   useEffect(() => {
//     const fetchTypes = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/packages/types"); // returns ["Custom Tours", "Adventure Tours", ...]
//         setTypes(res.data);
//       } catch (err) {
//         console.error("Error fetching package types:", err);
//       }
//     };

//     fetchTypes();
//   }, []);

//   return (
//     <PackageContext.Provider value={{ selectedType, setSelectedType, types }}>
//       {children}
//     </PackageContext.Provider>
//   );
// };


import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api.js';

const PackageContext = createContext({
  packageTypes: [],
  loading: false,
  error: null,
});

export const PackageProvider = ({ children }) => {
  const [packageTypes, setPackageTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchTypes = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/packages/${packageTypes}`, { signal: controller.signal });
        console.log('typeAPI',res)
        setPackageTypes(res.data || []);
      } catch (err) {
        // FIX 1: Don't crash on 404 — endpoint may not exist yet on the backend.
        //        Silently fall back to an empty array so the rest of the app works.
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          // Component unmounted — ignore silently
          return;
        }
        if (err?.response?.status === 404) {
          // Endpoint not yet implemented on backend — use empty fallback
          console.warn('[PackageContext] /api/packages/types returned 404 — using empty fallback.');
          setPackageTypes([]);
        } else {
          // Real error worth logging
          console.error('[PackageContext] Error fetching package types:', err.message);
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchTypes();

    // FIX 2: Abort on unmount to prevent CanceledError spam in console
    return () => controller.abort();
  }, []);

  return (
    <PackageContext.Provider value={{ packageTypes, loading, error }}>
      {children}
    </PackageContext.Provider>
  );
};

export const usePackageContext = () => useContext(PackageContext);

export default PackageContext;