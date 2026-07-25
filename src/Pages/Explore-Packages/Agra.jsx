import React from "react";
import { useState, useEffect, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import BookingForm from "../../Components/BookingForm/BookingForm";
// import Login from "../Login";
import { AuthContext } from "../../Context/AuthContext";
import api from "../../utils/api";
import {
  FaMapMarkedAlt,
  FaStar,
  FaCamera,
  FaUtensils,
  FaShoppingBag,
  FaChevronRight,
  FaCalendarAlt,
  FaUsers,
  FaClock,
  FaShieldAlt,
  FaHeart,
  FaShare,
  FaTimes,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import LoginRegister from "../LoginRegister";
// import { MdLocationOn, MdSecurity } from "react-icons/md";
// import { GiIndiaGate, GiSpices, GiTempleDoor } from "react-icons/gi";

function Agra() {
  // State for package data
  const [packageData, setPackageData] = useState({
    name: "",
    category: "",
    highlights: [],
    itinerary: [],
    gallery: [],
    testimonials: [],
    pricing: {
      currency: "₹",
      original: "",
      discounted: "",
    },
  });
  const { location } = useParams();
  const { user } = useContext(AuthContext);
  const [showAuth, setShowAuth] = useState(false);

  const [showBooking, setShowBooking] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showComparison, setShowComparison] = useState(false);
  const [comparedPackages, setComparedPackages] = useState([]);
  const [allPackagesData, setAllPackagesData] = useState([]);
  const [pendingBooking, setPendingBooking] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [error, setError] = useState();

  // Package Categories
  const packageCategories = [
    {
      id: 1,
      name: "3D/2N",
      axiosEndpoint: "/axios/packages/3d2n",
      price: 7499,
      tag: "Quick Escape",
    },
    {
      id: 2,
      name: "4D/3N",
      axiosEndpoint: "/axios/packages/4d3n",
      price: 9999,
      tag: "Popular Choice",
    },
    {
      id: 3,
      name: "5D/4N",
      axiosEndpoint: "/axios/packages/5d4n",
      price: 11999,
      tag: "Best Value",
    },
    {
      id: 4,
      name: "7D/6N",
      axiosEndpoint: "/axios/packages/7d6n",
      price: 17999,
      tag: "Ultimate Experience",
    },
  ];

  const [activeCategory, setActiveCategory] = useState(2); // Default to 4D/3N as most popular

  // Fetch all packages data
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        if (!location) return;

        const res = await api.get(`/explore/${location}`);
        setPackageData(res.data); // assuming API returns an array of packages
      } catch (err) {
        console.error(err);
        setError("Failed to fetch packages.");
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const findPackageByCategory = (packages, category) => {
    if (!Array.isArray(packages)) return null;

    let categoryName = "";
    if (typeof category === "number") {
      const categoryObj = packageCategories.find((c) => c.id === category);
      if (!categoryObj) return null;
      categoryName = categoryObj.name;
    } else if (typeof category === "string") {
      categoryName = category;
    } else {
      return null;
    }

    const found = packages.find((pkg) => {
      const pkgDuration = (pkg.duration || "").toString().trim();
      return pkgDuration.toLowerCase() === categoryName.toLowerCase();
    });

    return found || null;
  };

  useEffect(() => {
    if (allPackagesData.length > 0) {
      const currentPackageData = findPackageByCategory(
        allPackagesData,
        activeCategory,
      );
      if (currentPackageData) {
        setPackageData(currentPackageData);
      } else {
        setPackageData({
          name: "",
          category: "",
          highlights: [],
          itinerary: [],
          gallery: [],
          testimonials: [],
          pricingObj: { currency: "₹", original: "", discounted: "" },
        });
      }
    }
  }, [activeCategory, allPackagesData]);

  const handleBookNow = () => {
    if (!user) {
      setShowAlert(true);
      setPendingBooking(true);
    } else {
      setShowBooking(true);
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    setShowAuth(true);
  };

  const handleLoginSuccess = (loggedInUser) => {
    setShowAuth(false);
    if (pendingBooking) {
      setShowBooking(true);
      setPendingBooking(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
  };

  const comparePackages = () => {
    const dataForComparison = allPackagesData.map((pkg) => ({
      name: pkg.duration || pkg.name || "Unknown Package",
      pricing: pkg.pricingObj || null,
      price: pkg.price || null,
      rating:
        pkg.testimonials && pkg.testimonials.length > 0
          ? pkg.testimonials[0].rating
          : null,
      highlights: pkg.highlights || [],
    }));

    setComparedPackages(dataForComparison);
    setShowComparison(true);
  };

  const closeComparison = () => setShowComparison(false);

  const getPricing = (pkg) => {
    if (!pkg) return { currency: "₹", original: "", discounted: "" };
    if (pkg.pricingObj) return pkg.pricingObj;
    if (Array.isArray(pkg.pricing) && pkg.pricing.length > 0)
      return pkg.pricing[0];
    if (pkg.pricing && typeof pkg.pricing === "object") return pkg.pricing;
    return { currency: "₹", original: "", discounted: "" };
  };

  const pricing = getPricing(packageData);

  // Custom styles
  const styles = {
    alertOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
      backdropFilter: "blur(5px)",
    },
    alertBox: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "16px",
      width: "400px",
      textAlign: "center",
      boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
      animation: "slideUp 0.3s ease",
    },
    alertButton: {
      marginTop: "20px",
      padding: "12px 30px",
      backgroundColor: "#8B5A2B",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontSize: "16px",
      fontWeight: "600",
      transition: "all 0.3s ease",
    },
  };

  return (
    <div className="agra-package">
      {/* Hero Section - Redesigned */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="container">
            <div className="row align-items-center min-vh-80">
              <div className="col-lg-7 hero-text">
                <div className="badge-container mb-4">
                  <span className="featured-badge">
                    <FaStar className="me-2" /> Featured Destination 2024
                  </span>
                </div>
                <h1 className="hero-title">
                  Discover the Eternal
                  <br />
                  <span className="highlight">Magic of Agra</span>
                </h1>
                <p className="hero-subtitle">
                  Experience the timeless beauty of the Taj Mahal, explore
                  majestic forts, and immerse yourself in the rich Mughal
                  heritage
                </p>

                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-value">5+</span>
                    <span className="stat-label">UNESCO Sites</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">1000+</span>
                    <span className="stat-label">Happy Travelers</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">4.8</span>
                    <span className="stat-label">Rating</span>
                  </div>
                </div>

                <div className="hero-actions">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={handleBookNow}
                  >
                    Book Your Escape <FaArrowRight className="ms-2" />
                  </button>
                  <button
                    className="btn btn-outline-light btn-lg ms-3"
                    onClick={() => setShowShareModal(true)}
                  >
                    <FaShare className="me-2" /> Share
                  </button>
                </div>
              </div>

              <div className="col-lg-5">
                <div className="price-card">
                  <div className="price-header">
                    <span className="offer-tag">Limited Offer</span>
                    <FaHeart className="wishlist-icon" />
                  </div>
                  <div className="price-body">
                    <div className="package-name">
                      {
                        packageCategories.find((p) => p.id === activeCategory)
                          ?.name
                      }{" "}
                      Premium Package
                    </div>
                    <div className="price-tag">
                      <span className="currency">{pricing.currency}</span>
                      <span className="amount">
                        {pricing.discounted || "7,499"}
                      </span>
                      <span className="duration">/person</span>
                    </div>
                    <div className="price-original">
                      <span className="original-price">
                        ₹{pricing.original || "8,500"}
                      </span>
                      <span className="discount-badge">Save 20%</span>
                    </div>
                    <div className="price-features">
                      <div className="feature">
                        <FaCheckCircle className="text-success me-2" /> Free
                        Cancellation
                      </div>
                      <div className="feature">
                        <FaCheckCircle className="text-success me-2" />{" "}
                        Breakfast Included
                      </div>
                      <div className="feature">
                        <FaCheckCircle className="text-success me-2" /> Guided
                        Tours
                      </div>
                    </div>
                    <button
                      className="btn btn-book w-100 mt-3"
                      onClick={handleBookNow}
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <div className="quick-info-bar">
        <div className="container">
          <div className="info-items">
            <div className="info-item">
              <FaCalendarAlt className="info-icon" />
              <div>
                <div className="info-label">Best Time</div>
                <div className="info-value">Oct - March</div>
              </div>
            </div>
            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <div className="info-label">Duration</div>
                <div className="info-value">3-7 Days</div>
              </div>
            </div>
            <div className="info-item">
              <FaUsers className="info-icon" />
              <div>
                <div className="info-label">Group Size</div>
                <div className="info-value">2-12 People</div>
              </div>
            </div>
            <div className="info-item">
              <FaShieldAlt className="info-icon" />
              <div>
                <div className="info-label">Safety</div>
                <div className="info-value">Certified</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Package Duration Selector */}
      <section className="duration-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Choose Your Perfect Duration</h2>
            <p className="section-subtitle">
              Select from our carefully crafted packages
            </p>
          </div>

          <div className="duration-cards">
            {packageCategories.map((category) => (
              <div
                key={category.id}
                className={`duration-card ${activeCategory === category.id ? "active" : ""}`}
                onClick={() => handleCategoryChange(category.id)}
              >
                <div className="card-badge">{category.tag}</div>
                <h3 className="duration">{category.name}</h3>
                <div className="price">₹{category.price}</div>
                <p className="per-person">per person</p>
                {activeCategory === category.id && (
                  <div className="selected-indicator">
                    <FaCheckCircle />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section - Redesigned */}
      <section className="highlights-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Experience the Best of Agra</h2>
            <p className="section-subtitle">
              What makes your journey unforgettable
            </p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="highlights-grid">
              {packageData.highlights?.map((item, index) => (
                <div className="highlight-card" key={index}>
                  <div className="highlight-icon-wrapper">
                    <span className="highlight-icon">{item.icon}</span>
                  </div>
                  <h4 className="highlight-title">{item.text}</h4>
                  <p className="highlight-description">
                    Experience the magic of Agra's most cherished attractions
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Itinerary Section - Redesigned */}
      <section className="itinerary-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Your Journey, Day by Day</h2>
            <p className="section-subtitle">
              Every moment crafted for perfection
            </p>
          </div>

          <div className="row">
            <div className="col-lg-8">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="timeline">
                  {packageData.itinerary?.map((day, index) => (
                    <div className="timeline-item" key={index}>
                      <div className="timeline-marker">
                        <span className="marker-icon">{day.icon}</span>
                      </div>
                      <div className="timeline-content">
                        <h3 className="day-title">{day.day}</h3>
                        <div className="activities">
                          {day.activities.map((activity, i) => {
                            const [time, desc] = activity.split(" - ");
                            return (
                              <div className="activity-item" key={i}>
                                <span className="activity-time">{time}</span>
                                <span className="activity-desc">{desc}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="col-lg-4">
              <div className="itinerary-sidebar">
                <div className="info-card">
                  <h4>Package Includes</h4>
                  <ul className="includes-list">
                    <li>
                      <FaCheckCircle className="text-success me-2" />{" "}
                      Accommodation
                    </li>
                    <li>
                      <FaCheckCircle className="text-success me-2" /> Daily
                      Breakfast
                    </li>
                    <li>
                      <FaCheckCircle className="text-success me-2" /> Guided
                      Tours
                    </li>
                    <li>
                      <FaCheckCircle className="text-success me-2" />{" "}
                      Transportation
                    </li>
                    <li>
                      <FaCheckCircle className="text-success me-2" /> Monument
                      Entries
                    </li>
                  </ul>

                  <button
                    className="btn btn-outline-primary w-100 mt-3"
                    onClick={comparePackages}
                  >
                    Compare Packages
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section - Redesigned */}
      <section className="gallery-section">
        <div className="container-fluid px-0">
          <div className="section-header text-center">
            <h2 className="section-title">Visual Journey Through Agra</h2>
            <p className="section-subtitle">Moments you'll cherish forever</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="gallery-grid">
              {packageData.gallery?.map((item, index) => (
                <div
                  className={`gallery-item ${index === 0 ? "grid-span-2" : ""}`}
                  key={index}
                  onClick={() => setActiveImage(index)}
                >
                  <img
                    src={
                      item.img ||
                      `https://via.placeholder.com/800x600?text=Agra+${index + 1}`
                    }
                    alt={item.caption || `Gallery image ${index + 1}`}
                    loading="lazy"
                  />
                  <div className="gallery-overlay">
                    <FaCamera className="overlay-icon" />
                    <p>{item.caption || `View ${index + 1}`}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials Section - Redesigned */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Traveler Stories</h2>
            <p className="section-subtitle">Don't just take our word for it</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="testimonials-grid">
              {packageData.testimonials?.map((testimonial, index) => (
                <div className="testimonial-card" key={index}>
                  <div className="testimonial-content">
                    <div className="quote-mark">"</div>
                    <p className="quote">
                      {testimonial.quote || "Great experience!"}
                    </p>
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < (testimonial.rating || 0)
                              ? "star-filled"
                              : "star-empty"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <div className="testimonial-author">
                    <div className="author-avatar">
                      {testimonial.avatar || "👤"}
                    </div>
                    <div className="author-info">
                      <h5>{testimonial.author || "Anonymous"}</h5>
                      <p>Verified Traveler</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Redesigned */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">
              Ready to Experience the Magic of Agra?
            </h2>
            <p className="cta-text">
              Join hundreds of happy travelers who've discovered the timeless
              beauty of this majestic city. Limited slots available for the
              upcoming season.
            </p>
            <div className="cta-buttons">
              <button className="btn btn-cta-primary" onClick={handleBookNow}>
                Book Your Adventure Now
              </button>
              <button
                className="btn btn-cta-secondary"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              >
                Explore Packages
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Modals */}
      {showAlert && (
        <div style={styles.alertOverlay}>
          <div style={styles.alertBox}>
            <FaHeart className="text-danger mb-3" size={40} />
            <h4 className="mb-3">Login Required</h4>
            <p className="text-muted mb-4">
              Please login first to book this amazing package!
            </p>
            <button onClick={handleAlertClose} style={styles.alertButton}>
              Login Now
            </button>
          </div>
        </div>
      )}

      {showAuth && (
        <LoginRegister
          onClose={() => setShowAuth(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {showBooking && (
        <BookingForm user={user} onClose={() => setShowBooking(false)} />
      )}

      {/* Comparison Modal */}
      {/* Comparison Modal */}
      {showComparison && (
        <div className="comparison-modal">
          <div className="modal-overlay" onClick={closeComparison}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Compare Packages</h3>
              <button className="close-btn" onClick={closeComparison}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="comparison-table-container">
                <table className="comparison-table">
                  <thead>
                    <tr>
                      <th>Features</th>
                      {comparedPackages.map((pkg, index) => (
                        <th key={index}>{pkg.name || "Unknown Package"}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Price */}
                    <tr>
                      <td>Price</td>
                      {comparedPackages.map((pkg, index) => (
                        <td key={`${index}-price`}>
                          <span className="price-highlight">
                            {pkg.pricing
                              ? `${pkg.pricing.currency || "₹"}${pkg.pricing.discounted || pkg.price || ""}`
                              : pkg.price
                                ? `₹${pkg.price}`
                                : "-"}
                          </span>
                        </td>
                      ))}
                    </tr>

                    {/* Rating */}
                    <tr>
                      <td>Rating</td>
                      {comparedPackages.map((pkg, index) => (
                        <td key={`${index}-rating`}>
                          {pkg.rating ? (
                            <span className="rating-badge">
                              {pkg.rating} <FaStar className="ms-1" />
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                      ))}
                    </tr>

                    {/* Highlights - Fixed the array creation issue */}
                    {comparedPackages.length > 0 &&
                      [
                        ...Array(
                          Math.max(
                            0,
                            ...comparedPackages.map(
                              (pkg) => pkg.highlights?.length || 0,
                            ),
                          ),
                        ),
                      ].map((_, index) => (
                        <tr key={`highlight-${index}`}>
                          <td>{index === 0 ? "Highlights" : ""}</td>
                          {comparedPackages.map((pkg, pkgIndex) => (
                            <td key={`${pkgIndex}-highlight-${index}`}>
                              {pkg.highlights?.[index]
                                ? pkg.highlights[index].text
                                : "-"}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-primary" onClick={closeComparison}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Styles */}
      <style jsx>{`
        .agra-package {
          font-family: "Poppins", sans-serif;
          overflow-x: hidden;
        }

        /* Hero Section */
        .hero-section {
          position: relative;
          min-height: 90vh;
          background:
            linear-gradient(135deg, #667eea 0%, #764ba2 100%),
            url("https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80");
          background-size: cover;
          background-position: center;
          background-blend-mode: overlay;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding: 100px 0;
        }

        .hero-text {
          color: white;
        }

        .featured-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 30px;
          font-size: 0.9rem;
          backdrop-filter: blur(10px);
        }

        .hero-title {
          font-size: 4rem;
          font-weight: 700;
          line-height: 1.2;
          margin-bottom: 1.5rem;
        }

        .hero-title .highlight {
          color: #ffd700;
          position: relative;
          display: inline-block;
        }

        .hero-title .highlight::after {
          content: "";
          position: absolute;
          bottom: 10px;
          left: 0;
          width: 100%;
          height: 20px;
          background: rgba(255, 215, 0, 0.3);
          z-index: -1;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }

        .hero-stats {
          display: flex;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        /* Price Card */
        .price-card {
          background: white;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }

        .price-header {
          padding: 15px 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .offer-tag {
          background: #ffd700;
          color: #333;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .wishlist-icon {
          font-size: 1.2rem;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .wishlist-icon:hover {
          transform: scale(1.1);
        }

        .price-body {
          padding: 25px;
        }

        .package-name {
          font-size: 1.2rem;
          color: #666;
          margin-bottom: 10px;
        }

        .price-tag {
          display: flex;
          align-items: baseline;
          margin-bottom: 10px;
        }

        .currency {
          font-size: 1.5rem;
          color: #8b5a2b;
          font-weight: 600;
        }

        .amount {
          font-size: 3.5rem;
          font-weight: 700;
          color: #333;
          line-height: 1;
        }

        .duration {
          font-size: 1rem;
          color: #999;
          margin-left: 5px;
        }

        .price-original {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .original-price {
          font-size: 1.1rem;
          color: #999;
          text-decoration: line-through;
        }

        .discount-badge {
          background: #28a745;
          color: white;
          padding: 3px 10px;
          border-radius: 15px;
          font-size: 0.8rem;
        }

        .price-features {
          margin-top: 15px;
        }

        .feature {
          margin-bottom: 8px;
          color: #666;
        }

        .btn-book {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
          padding: 15px;
          border: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-book:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        /* Quick Info Bar */
        .quick-info-bar {
          background: white;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
          padding: 20px 0;
          position: relative;
          z-index: 10;
        }

        .info-items {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 20px;
        }

        .info-item {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .info-icon {
          font-size: 2rem;
          color: #8b5a2b;
        }

        .info-label {
          font-size: 0.9rem;
          color: #999;
        }

        .info-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
        }

        /* Duration Section */
        .duration-section {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .duration-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 40px;
        }

        .duration-card {
          background: white;
          border-radius: 15px;
          padding: 30px 20px;
          text-align: center;
          cursor: pointer;
          position: relative;
          transition: all 0.3s ease;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .duration-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
        }

        .duration-card.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .card-badge {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          background: #ffd700;
          color: #333;
          padding: 5px 15px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .duration {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 15px 0 5px;
        }

        .price {
          font-size: 2rem;
          font-weight: 700;
        }

        .per-person {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .selected-indicator {
          position: absolute;
          bottom: -10px;
          right: -10px;
          background: #28a745;
          color: white;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Highlights Section */
        .highlights-section {
          padding: 80px 0;
        }

        .highlights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .highlight-card {
          text-align: center;
          padding: 30px;
          background: white;
          border-radius: 15px;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .highlight-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .highlight-icon-wrapper {
          width: 80px;
          height: 80px;
          margin: 0 auto 20px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .highlight-icon {
          font-size: 2.5rem;
          color: white;
        }

        .highlight-title {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 10px;
        }

        .highlight-description {
          color: #999;
          font-size: 0.9rem;
        }

        /* Itinerary Section */
        .itinerary-section {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .timeline {
          position: relative;
          padding: 20px 0;
        }

        .timeline::before {
          content: "";
          position: absolute;
          left: 30px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(to bottom, #667eea, #764ba2);
        }

        .timeline-item {
          position: relative;
          padding-left: 80px;
          margin-bottom: 50px;
        }

        .timeline-marker {
          position: absolute;
          left: 0;
          top: 0;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
          z-index: 2;
        }

        .timeline-content {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }

        .day-title {
          font-size: 1.3rem;
          font-weight: 600;
          margin-bottom: 15px;
          color: #333;
        }

        .activity-item {
          display: flex;
          align-items: baseline;
          margin-bottom: 10px;
          padding: 5px 0;
          border-bottom: 1px dashed #eee;
        }

        .activity-time {
          font-weight: 600;
          color: #8b5a2b;
          min-width: 100px;
        }

        .activity-desc {
          color: #666;
        }

        .info-card {
          background: white;
          padding: 25px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          position: sticky;
          top: 20px;
        }

        .includes-list {
          list-style: none;
          padding: 0;
          margin-top: 15px;
        }

        .includes-list li {
          margin-bottom: 10px;
          color: #666;
        }

        /* Gallery Section */
        .gallery-section {
          padding: 80px 0;
        }

        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
          margin-top: 40px;
        }

        .gallery-item {
          position: relative;
          height: 250px;
          overflow: hidden;
          cursor: pointer;
        }

        .grid-span-2 {
          grid-column: span 2;
          grid-row: span 2;
          height: 510px;
        }

        .gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .gallery-item:hover img {
          transform: scale(1.1);
        }

        .gallery-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .gallery-item:hover .gallery-overlay {
          opacity: 1;
        }

        .overlay-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        /* Testimonials Section */
        .testimonials-section {
          padding: 80px 0;
          background: #f8f9fa;
        }

        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }

        .testimonial-card {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .testimonial-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        }

        .testimonial-content {
          padding: 30px;
          position: relative;
        }

        .quote-mark {
          font-size: 4rem;
          color: #667eea;
          opacity: 0.2;
          position: absolute;
          top: 10px;
          left: 20px;
        }

        .quote {
          font-size: 1rem;
          line-height: 1.6;
          color: #666;
          margin-bottom: 15px;
          position: relative;
          z-index: 1;
        }

        .rating {
          display: flex;
          gap: 5px;
        }

        .star-filled {
          color: #ffd700;
        }

        .star-empty {
          color: #ddd;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 20px 30px;
          background: #f8f9fa;
          border-top: 1px solid #eee;
        }

        .author-avatar {
          font-size: 2rem;
        }

        .author-info h5 {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .author-info p {
          margin: 0;
          font-size: 0.9rem;
          color: #999;
        }

        /* CTA Section */
        .cta-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .cta-content {
          text-align: center;
          max-width: 700px;
          margin: 0 auto;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .cta-text {
          font-size: 1.1rem;
          margin-bottom: 30px;
          opacity: 0.9;
        }

        .cta-buttons {
          display: flex;
          gap: 15px;
          justify-content: center;
        }

        .btn-cta-primary {
          background: white;
          color: #667eea;
          padding: 15px 30px;
          border: none;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .btn-cta-secondary {
          background: transparent;
          color: white;
          padding: 15px 30px;
          border: 2px solid white;
          border-radius: 30px;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .btn-cta-secondary:hover {
          background: white;
          color: #667eea;
        }

        /* Comparison Modal */
        .comparison-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(5px);
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          max-width: 90vw;
          max-height: 80vh;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          padding: 20px 30px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #666;
          transition: color 0.3s ease;
        }

        .close-btn:hover {
          color: #333;
        }

        .modal-body {
          padding: 30px;
          overflow: auto;
          flex: 1;
        }

        .comparison-table-container {
          max-height: 500px;
          overflow: auto;
        }

        .comparison-table {
          width: 100%;
          border-collapse: collapse;
        }

        .comparison-table th {
          position: sticky;
          top: 0;
          background: #f8f9fa;
          padding: 15px;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #ddd;
        }

        .comparison-table td {
          padding: 12px 15px;
          border: 1px solid #eee;
          text-align: center;
        }

        .comparison-table tr:hover td {
          background: #f8f9fa;
        }

        .price-highlight {
          font-weight: 600;
          color: #28a745;
        }

        .rating-badge {
          display: inline-flex;
          align-items: center;
          background: #ffd700;
          color: #333;
          padding: 5px 10px;
          border-radius: 15px;
          font-weight: 600;
        }

        .modal-footer {
          padding: 20px 30px;
          border-top: 1px solid #eee;
          text-align: right;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-stats {
            flex-wrap: wrap;
            gap: 1rem;
          }

          .gallery-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .grid-span-2 {
            grid-column: span 2;
            grid-row: span 1;
            height: 250px;
          }

          .cta-buttons {
            flex-direction: column;
          }

          .timeline-item {
            padding-left: 60px;
          }

          .timeline-marker {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
        }

        @media (max-width: 576px) {
          .hero-title {
            font-size: 2rem;
          }

          .duration-cards {
            grid-template-columns: 1fr;
          }

          .gallery-grid {
            grid-template-columns: 1fr;
          }

          .grid-span-2 {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}

export default Agra;
