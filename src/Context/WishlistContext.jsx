import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./AuthContext.jsx";
import api from "../utils/api.js";

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { token } = useContext(AuthContext) || {};
  const [ids, setIds] = useState(new Set());
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    if (!token) { setIds(new Set()); setLoaded(true); return; }
    return api.get("/favourites/my-wishlist/package-ids",
        {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(({ data }) => setIds(new Set((data?.ids || []).map(String))))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [token]);

  useEffect(() => { refresh(); }, [refresh]);

  const isLiked = useCallback((packageId) => ids.has(String(packageId)), [ids]);

  // Optimistic toggle: flips the UI immediately, calls the real backend
  // endpoint, and reverts on failure. This is the ONE place that talks to
  // /favourites/package/:id/toggle — every heart button on the site (home,
  // itinerary page, wishlist page, search results) calls this same function,
  // so "like here, see it in Wishlist, unlike anywhere removes it" is
  // guaranteed by construction rather than by keeping N copies in sync.
  const toggleLike = useCallback(async (packageId) => {
    if (!token) return { ok: false, requiresLogin: true };
    const key = String(packageId);
    const wasLiked = ids.has(key);

    setIds((prev) => {
      const next = new Set(prev);
      wasLiked ? next.delete(key) : next.add(key);
      return next;
    });

    try {
      const { data } = await api.put(`/favourites/package/${key}/toggle`);
      return { ok: true, liked: data.liked };
    } catch (err) {
      // revert on failure
      setIds((prev) => {
        const next = new Set(prev);
        wasLiked ? next.add(key) : next.delete(key);
        return next;
      });
      return { ok: false, error: err.response?.data?.message || "Could not update wishlist." };
    }
  }, [token, ids]);

  return (
    <WishlistContext.Provider value={{ isLiked, toggleLike, loaded, refresh, likedCount: ids.size }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside WishlistProvider");
  return ctx;
};
