import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../utils/api";

// 🔹 helpers
const formatPrice = (price) =>
  price ? `$${price.toLocaleString()}` : "$0";


const MyFavourite = () => {
  const [favoritePackages, setFavoritePackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchFavoritePackages = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/favourites/${user._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

      

        // Only keep liked packages
        // const liked = Array.isArray(data)
        //   ? data.filter(pkg => pkg.status === "like")
        //   : [];

        setFavoritePackages(res.data);
      } catch (err) {
        console.error("Failed to fetch favourites", err);
        setFavoritePackages([]);
        setError("Could not load favourites.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoritePackages();
  }, [user._id]);

  // Use this array for mapping in your UI
  const likedPackages = Array.isArray(favoritePackages);

  const totalSaved = likedPackages.length;
  // const totalDays = likedPackages.reduce((sum, pkg) => sum + (parseInt(pkg.duration) || 0), 0);
  // const totalPrice = likedPackages.reduce((sum, pkg) => sum + (pkg.price || 0), 0);

  const formatPrice = (value) => `$${value.toLocaleString()}`;



  // const sortedPackages = [...filteredPackages].sort((a, b) => {
  //   switch (sortBy) {
  //     case "price-low":
  //       return a.price - b.price;
  //     case "price-high":
  //       return b.price - a.price;
  //     case "rating":
  //       return b.rating - a.rating;
  //     case "duration":
  //       return parseInt(a.duration) - parseInt(b.duration);
  //     default:
  //       return 0;
  //   }
  // });

  // 🔹 Tag toggle
  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 🔹 Compare toggle
  const toggleCompare = (id) => {
    setCompareList((prev) =>
      prev.includes(id)
        ? prev.filter((pid) => pid !== id)
        : prev.length < 3
          ? [...prev, id]
          : prev
    );
  };

  // 🔹 Remove favourite
  const handleRemoveFavorite = async (id) => {
    try {
      await axios.delete(`/api/favourites/remove/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFavoritePackages((prev) => prev.filter((pkg) => pkg.id !== id));
    } catch (err) {
      console.error("Failed to remove favourite", err);
    }
  };

  return (
 <div className="favorites-page">
      <div className="p-6 relative">{error && <p className="text-red-500">{error}</p>}</div>

      {/* Hero Section */}
      <section className="favorites-hero mt-5">
        <div className="hero-overlay"></div>
        <div className="container position-relative">
          <div className="row align-items-center min-vh-50">
            <div className="col-lg-8 mx-auto text-center">
              <div className="hero-content">
                <div className="favorites-icon mb-4">
                  <i className="bi bi-heart-fill"></i>
                </div>
                <h1 className="hero-title">
                  Your Favorite <span className="text-warning">Destinations</span>
                </h1>
                <p className="hero-subtitle">
                  Your handpicked collection of dream destinations and unforgettable experiences
                </p>
                <div className="hero-stats">
                  <div className="stat-card">
                    <div className="stat-number">{totalSaved}</div>
                    <div className="stat-label">Saved Packages</div>
                  </div>
                  <div className="stat-card">
                    {/* <div className="stat-number">{totalDays}</div> */}
                    <div className="stat-label">Total Days</div>
                  </div>
                  <div className="stat-card">
                    {/* <div className="stat-number">{formatPrice(totalPrice)}</div> */}
                    <div className="stat-label">Total Value</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Section */}
      <section className="packages-section">
        <div className="container">
          {loading ? (
            <p>Loading favourites...</p>
          ) : likedPackages.length > 0 ? (
            <div className="packages-grid grid-view">
              {likedPackages.map((pkg, index) => (
                <div key={pkg._id} className="package-card">
                  <img src={pkg.img} alt={pkg.title} />
                  <h5>{pkg.title}</h5>
                  <p>{pkg.category}</p>
                  <p>Rating: {pkg.rating} ⭐</p>
                  <p>Duration: {pkg.duration} days</p>
                  <p>Price: {formatPrice(pkg.price)}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🏝️</div>
              <h3>No favorite destinations found</h3>
              <p>
                Start exploring and save your dream destinations by clicking the heart icon.
              </p>
            </div>
          )}
        </div>
      </section>
    
    


      export default MyFavourite;


      <style jsx>{`
        /* Base Styles */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
        }

        /* Layout */
        .favorites-page {
          background: linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%);
          min-height: 100vh;
        }

        /* Hero Section */
        .favorites-hero {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
          padding: 4rem 0;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%),
                      radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%);
        }

        .min-vh-50 {
          min-height: 50vh;
        }

        .favorites-icon {
          font-size: 4rem;
          color: #fbbf24;
          animation: heartBeat 2s ease-in-out infinite;
        }

        @keyframes heartBeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.05); }
          75% { transform: scale(0.95); }
        }

        .hero-title {
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          color: white;
          margin-bottom: 1rem;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero-subtitle {
          font-size: 1.3rem;
          color: rgba(255,255,255,0.9);
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .hero-stats {
          display: flex;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-top: 3rem;
        }

        .stat-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 20px;
          padding: 2rem 1.5rem;
          text-align: center;
          color: white;
          min-width: 140px;
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          color: #fbbf24;
          display: block;
        }

        .stat-label {
          font-size: 0.95rem;
          opacity: 0.9;
          margin-top: 0.5rem;
          font-weight: 500;
        }

        /* Controls Section */
        .controls-section {
          padding: 2rem 0;
          margin-top: -60px;
          position: relative;
          z-index: 10;
        }

        .controls-card {
          background: white;
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
          border: 1px solid rgba(255,255,255,0.1);
        }

        /* Search */
        .search-box {
          position: relative;
        }

        .search-input {
          border: 2px solid #e2e8f0;
          border-radius: 16px;
          padding: 1rem 3rem;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8fafc;
        }

        .search-input:focus {
          border-color: #667eea;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
          background: white;
        }

        .search-icon {
          position: absolute;
          left: 1.2rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .search-clear {
          position: absolute;
          right: 0.5rem;
          top: 50%;
          transform: translateY(-50%);
          background: #ef4444;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
        }

        .search-clear:hover {
          background: #dc2626;
          transform: translateY(-50%) scale(1.1);
        }

        /* Filter Tabs */
        .filter-tabs {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .filter-tab {
          background: #f1f5f9;
          border: 2px solid transparent;
          padding: 0.9rem 1.4rem;
          border-radius: 30px;
          font-size: 0.9rem;
          font-weight: 600;
          color: #64748b;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 0.6rem;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .filter-tab::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          transition: left 0.5s;
        }

        .filter-tab:hover::before {
          left: 100%;
        }

        .filter-tab:hover {
          background: #e2e8f0;
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }

        .filter-tab.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          border-color: #667eea;
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(102, 126, 234, 0.3);
        }

        .category-emoji {
          font-size: 1.1rem;
        }

        /* Advanced Filters */
        .filter-panel {
          background: #f8fafc;
          border-radius: 16px;
          padding: 2rem;
          margin-top: 1.5rem;
          animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .tag-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tag-filter {
          background: white;
          border: 2px solid #e2e8f0;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          color: #64748b;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .tag-filter:hover {
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .tag-filter.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        .price-range input[type="range"] {
          width: 100%;
          height: 6px;
          border-radius: 3px;
          background: #e2e8f0;
          outline: none;
          -webkit-appearance: none;
        }

        .price-range input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #667eea;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }

        /* Sort & View Controls */
        .sort-select {
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 0.8rem 1rem;
          background: white;
          font-weight: 500;
          min-width: 180px;
        }

        .view-toggle {
          display: flex;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          overflow: hidden;
          background: white;
        }

        .view-btn {
          background: transparent;
          border: none;
          padding: 0.8rem 1rem;
          color: #64748b;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          min-width: 48px;
        }

        .view-btn:hover {
          background: #f1f5f9;
        }

        .view-btn.active {
          background: #667eea;
          color: white;
        }

        /* Compare Bar */
        .compare-bar {
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 1rem 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          animation: slideDown 0.3s ease;
        }

        /* Packages Grid */
        .packages-section {
          padding: 4rem 0;
        }

        .packages-grid {
          display: grid;
          gap: 2.5rem;
        }

        .packages-grid.grid-view {
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }

        .packages-grid.list-view {
          grid-template-columns: 1fr;
          gap: 2rem;
        }

        /* Package Cards */
        .package-card {
          background: white;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: slideUp 0.6s ease forwards;
          opacity: 0;
          transform: translateY(30px);
          border: 1px solid rgba(255,255,255,0.1);
        }

        @keyframes slideUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .package-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }

        /* Package Images */
        .package-image-wrapper {
          position: relative;
          height: 280px;
          overflow: hidden;
        }

        .package-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .package-card:hover .package-image {
          transform: scale(1.08);
        }

        .image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            to bottom,
            rgba(0,0,0,0.4) 0%,
            transparent 30%,
            transparent 70%,
            rgba(0,0,0,0.6) 100%
          );
        }

        /* Badges */
        .package-badges {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .difficulty-badge,
        .discount-badge,
        .availability-badge {
          padding: 0.4rem 1rem;
          border-radius: 25px;
          font-size: 0.8rem;
          font-weight: 700;
          color: white;
          backdrop-filter: blur(10px);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .discount-badge {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.3);
        }

        /* Action Buttons */
        .image-actions {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.95);
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
          cursor: pointer;
        }

        .action-btn:hover {
          transform: scale(1.15);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .favorite-btn.active {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          animation: heartPulse 0.6s ease;
        }

        .compare-btn.active {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }

        @keyframes heartPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        /* Package Content */
        .package-content {
          padding: 2.5rem;
        }

        .package-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e293b;
          margin-bottom: 0.75rem;
          line-height: 1.3;
        }

        .package-location {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          color: #64748b;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .package-location i {
          color: #ef4444;
          font-size: 1.1rem;
        }

        /* Meta Information */
        .package-meta {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: #64748b;
          font-weight: 500;
        }

        .meta-item i {
          color: #667eea;
          font-size: 1rem;
        }

        /* Highlights */
        .package-highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .highlight-tag {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          color: #059669;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          border: 1px solid #a7f3d0;
        }

        .highlight-tag i {
          font-size: 0.75rem;
        }

        .more-highlights {
          background: #f1f5f9;
          color: #64748b;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid #e2e8f0;
        }

        /* Package Features */
        .package-features {
          margin-bottom: 1.5rem;
        }

        .feature-row {
          display: flex;
          gap: 1.5rem;
          flex-wrap: wrap;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
          color: #64748b;
          font-weight: 500;
        }

        /* Rating */
        .package-rating {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .stars {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .stars i {
          color: #fbbf24;
          font-size: 1rem;
        }

        .rating-text {
          margin-left: 0.6rem;
          font-weight: 700;
          color: #1e293b;
          font-size: 1.05rem;
        }

        .review-count {
          color: #64748b;
          font-size: 0.9rem;
          font-weight: 500;
        }

        /* Package Footer */
        .package-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
        }

        .price-section {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .current-price {
          font-size: 2rem;
          font-weight: 800;
          color: #059669;
          line-height: 1;
        }

        .original-price {
          font-size: 1.1rem;
          color: #94a3b8;
          text-decoration: line-through;
          font-weight: 500;
        }

        .price-per {
          font-size: 0.8rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.75rem;
        }

        .action-buttons .btn {
          border-radius: 12px;
          font-weight: 600;
          padding: 0.75rem 1.25rem;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .action-buttons .btn:hover {
          transform: translateY(-2px);
        }

        .added-date {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.9rem;
          color: #64748b;
          padding-top: 1.5rem;
          border-top: 1px solid #f1f5f9;
          font-weight: 500;
        }

        .added-date i {
          color: #ef4444;
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 5rem 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .empty-icon {
          font-size: 6rem;
          margin-bottom: 2rem;
          opacity: 0.8;
        }

        .empty-state h3 {
          color: #1e293b;
          margin-bottom: 1.5rem;
          font-size: 2rem;
          font-weight: 700;
        }

        .empty-state p {
          color: #64748b;
          font-size: 1.2rem;
          line-height: 1.6;
          margin-bottom: 3rem;
        }

        .empty-actions {
          display: flex;
          gap: 1.25rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .empty-actions .btn {
          border-radius: 14px;
          font-weight: 600;
          padding: 1rem 2rem;
        }

        /* Compare Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .compare-modal {
          background: white;
          border-radius: 24px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
          animation: modalSlide 0.3s ease;
        }

        @keyframes modalSlide {
          from { transform: scale(0.9) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }

        .modal-header {
          padding: 2rem 2.5rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #64748b;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .close-btn:hover {
          background: #f1f5f9;
          color: #1e293b;
        }

        .modal-body {
          padding: 2rem 2.5rem;
        }

        .compare-table {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .compare-column {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 1.5rem;
          background: #fafafa;
        }

        .compare-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .compare-column h4 {
          font-size: 1.3rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 1rem;
        }

        .compare-details {
          space-y: 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid #e2e8f0;
          font-size: 0.9rem;
        }

        .detail-row strong {
          color: #374151;
        }

        /* Loading Animation */
        .travel-bg {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .loading-container {
          position: relative;
        }

        .travel-loader {
          position: relative;
          width: 250px;
          height: 120px;
          margin: 0 auto 2rem;
        }

        .plane {
          position: absolute;
          font-size: 2.5rem;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          animation: fly 3s ease-in-out infinite;
        }

        .cloud {
          position: absolute;
          font-size: 1.8rem;
          opacity: 0.7;
          animation: float 4s ease-in-out infinite;
        }

        .cloud1 {
          top: 15%;
          left: 25%;
          animation-delay: -1s;
        }

        .cloud2 {
          top: 65%;
          left: 55%;
          animation-delay: -2s;
        }

        .cloud3 {
          top: 5%;
          right: 15%;
          animation-delay: -0.5s;
        }

        @keyframes fly {
          0%, 100% { 
            left: 0;
            transform: translateY(-50%) rotate(0deg);
          }
          50% { 
            left: calc(100% - 50px);
            transform: translateY(-50%) rotate(5deg);
          }
        }

        @keyframes float {
          0%, 100% { 
            transform: translateY(0) scale(1);
            opacity: 0.7;
          }
          50% { 
            transform: translateY(-15px) scale(1.1);
            opacity: 1;
          }
        }

        /* List View Styles */
        .packages-grid.list-view .package-card {
          display: flex;
          flex-direction: row;
          height: auto;
          max-height: 320px;
        }

        .packages-grid.list-view .package-image-wrapper {
          width: 350px;
          height: auto;
          flex-shrink: 0;
        }

        .packages-grid.list-view .package-content {
          flex: 1;
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }

        .packages-grid.list-view .package-footer {
          margin-top: auto;
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .packages-grid.grid-view {
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            gap: 1.5rem;
          }

          .stat-card {
            min-width: 120px;
            padding: 1.5rem 1rem;
          }

          .controls-card {
            padding: 2rem;
          }

          .filter-tabs {
            justify-content: flex-start;
            overflow-x: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
          }

          .filter-tabs::-webkit-scrollbar {
            display: none;
          }

          .packages-grid.grid-view {
            grid-template-columns: 1fr;
          }

          .packages-grid.list-view .package-card {
            flex-direction: column;
            max-height: none;
          }

          .packages-grid.list-view .package-image-wrapper {
            width: 100%;
            height: 250px;
          }

          .package-meta {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .package-footer {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
          }

          .action-buttons {
            width: 100%;
            justify-content: center;
          }

          .compare-table {
            grid-template-columns: 1fr;
          }

          .modal-body {
            padding: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }

          .packages-grid {
            gap: 1.5rem;
          }

          .package-content {
            padding: 2rem 1.5rem;
          }

          .controls-card {
            padding: 1.5rem;
          }

          .hero-stats {
            flex-direction: column;
            align-items: center;
            gap: 1rem;
          }

          .stat-card {
            min-width: 200px;
          }
        }

        /* Button Variants */
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:hover {
          background: linear-gradient(135deg, #5a67d8, #6b46c1);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
        }

        .btn-outline-primary {
          background: transparent;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-outline-primary:hover {
          background: #667eea;
          color: white;
        }

        .btn-warning {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          color: white;
          box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);
        }

        .btn-warning:hover {
          background: linear-gradient(135deg, #f59e0b, #d97706);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(251, 191, 36, 0.4);
        }

        .btn-outline-secondary {
          background: transparent;
          color: #64748b;
          border: 2px solid #e2e8f0;
        }

        .btn-outline-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .btn-sm {
          padding: 0.6rem 1.2rem;
          font-size: 0.875rem;
        }

        .btn-lg {
          padding: 1rem 2rem;
          font-size: 1.125rem;
        }

        /* Utility Classes */
        .text-success { color: #059669 !important; }
        .text-warning { color: #d97706 !important; }
        .text-danger { color: #dc2626 !important; }
        .bg-success { background-color: #10b981 !important; }
        .bg-warning { background-color: #f59e0b !important; }
        .bg-danger { background-color: #ef4444 !important; }

        /* Animations */
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Focus styles */
        .btn:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
        }

        input:focus,
        select:focus {
          outline: none;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }

        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}
      </style>

    </div >
  );
};

export default MyFavourite;



