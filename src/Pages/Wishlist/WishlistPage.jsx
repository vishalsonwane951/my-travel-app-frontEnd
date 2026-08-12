import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api.js";
import { AuthContext } from "../../Context/AuthContext.jsx";
import { useWishlist } from "../../Context/WishlistContext.jsx";
import TourPackageCard from "../../Components/TourPackageCard.jsx";
import "../My Bookings/MyPagesShared.css";

const WishlistPage = () => {
  const { token } = useContext(AuthContext) || {};
  const { refresh } = useWishlist();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/favourites/my-wishlist/packages")
      .then(({ data }) => setPackages(data.packages || []))
      .catch((err) => setError(err.response?.data?.message || "Could not load your wishlist."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleWishlistChange = (pkg, liked) => {
    if (!liked) {
      setPackages((prev) => prev.filter((p) => (p._id || p.id) !== (pkg._id || pkg.id)));
    }
    refresh();
  };

  if (!token) {
    return (
      <div className="mp-page mp-center">
        <h2>My Wishlist</h2>
        <p>Please <Link to="/login">log in</Link> to see your saved packages.</p>
      </div>
    );
  }

  return (
    <div className="mp-page">
      <div className="mp-header">
        <h1>My Wishlist</h1>
        <p className="mp-sub">Packages you've saved — tap the heart again to remove one.</p>
      </div>

      {loading && <div className="mp-loading">Loading your wishlist…</div>}
      {error && <div className="mp-error">{error}</div>}

      {!loading && !error && packages.length === 0 && (
        <div className="mp-empty">
          <div className="mp-empty-icon">❤️</div>
          <h3>Your wishlist is empty</h3>
          <p>Tap the heart icon on any package to save it here.</p>
          <Link to="/packages" className="mp-cta">Browse Packages</Link>
        </div>
      )}

      <div className="mp-wishlist-grid">
        {packages.map((pkg, i) => (
          <TourPackageCard key={pkg._id} pkg={pkg} index={i} onWishlistChange={handleWishlistChange} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
