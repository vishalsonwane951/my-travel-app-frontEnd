import React, { useState } from "react";
import {
  FaTimes,
  FaCalendarAlt,
  FaUsers,
  FaUserFriends,
  FaChild,
  FaWhatsapp,
  FaShieldAlt,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";
import api from "../../utils/api";

const BookingForm = ({ 
  isOpen, 
  onClose, 
  packageData, 
  selectedDuration, 
  user,
  onSuccess 
}) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    travelDate: "",
    adults: 1,
    children: 0,
    seniors: 0,
    childAges: [],
    roomPreference: "",
    mealPreference: "",
    pickup: false,
    guide: false,
    insurance: false,
    wheelchair: false,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalTravelers = (formData.adults || 0) + (formData.children || 0) + (formData.seniors || 0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price);
  };

  const handleWhatsApp = () => {
    const childAgesText = formData.childAges?.length > 0 
      ? `\n👶 Children Ages: ${formData.childAges.join(', ')} years` 
      : '';
    
    const message = `
*New Package Inquiry*
════════════════════
🏷️ *Package:* ${packageData?.title}
📍 *Location:* ${packageData?.location}
📅 *Duration:* ${selectedDuration?.duration}
💰 *Price:* ₹${formatPrice(selectedDuration?.discountedPrice || selectedDuration?.price)}

*Travelers:*
👤 Adults: ${formData.adults || 0}
🧒 Children: ${formData.children || 0}${childAgesText}
👴 Seniors: ${formData.seniors || 0}
📊 Total: ${totalTravelers}

*Preferences:*
🏨 Room: ${formData.roomPreference || 'Not specified'}
🍽️ Meal: ${formData.mealPreference || 'Not specified'}
🚗 Pickup: ${formData.pickup ? 'Yes' : 'No'}
👨‍🏫 Private Guide: ${formData.guide ? 'Yes' : 'No'}
🛡️ Insurance: ${formData.insurance ? 'Yes' : 'No'}
♿ Wheelchair Access: ${formData.wheelchair ? 'Yes' : 'No'}

📅 *Travel Date:* ${formData.travelDate || "Not specified"}

*Contact Details:*
👤 Name: ${formData.name || "Not provided"}
📧 Email: ${formData.email || "Not provided"}
📞 Phone: ${formData.phone || "Not provided"}

*Message:* ${formData.message || "No special requests"}
  `;

    const phone = "919876543210"; // Replace with actual business number
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await api.post("/inquiry", {
        packageId: packageData?._id,
        packageTitle: packageData?.title,
        location: packageData?.location,
        duration: selectedDuration?.duration,
        price: selectedDuration?.discountedPrice || selectedDuration?.price,
        userId: user?._id,
        ...formData,
        totalTravelers,
        totalPrice: (selectedDuration?.discountedPrice || selectedDuration?.price) * totalTravelers
      });

      onSuccess?.();
      alert("✨ Inquiry Submitted Successfully! Our team will contact you shortly.");
      onClose();
    } catch (err) {
      setError("Failed to submit inquiry. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <h2 className="modal-title">Book Your Adventure</h2>

        {/* Booking Summary */}
        <div className="booking-summary">
          <h3 className="package-name">{packageData?.title}</h3>
          <div className="booking-details">
            <span><FaCalendarAlt /> {selectedDuration?.duration}</span>
            <span><FaUsers /> {totalTravelers} Traveler(s)</span>
          </div>
          <div className="booking-total">
            Total: ₹{formatPrice((selectedDuration?.discountedPrice || selectedDuration?.price) * totalTravelers)}
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="booking-form">
          {/* Personal Information */}
          <div className="form-section">
            <h4 className="section-subtitle">Personal Information</h4>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="Enter your full name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Travel Date *</label>
              <input
                type="date"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.travelDate}
                onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
              />
            </div>
          </div>

          {/* Traveler Details Section */}
          <div className="form-section">
            <h4 className="section-subtitle">Traveler Details</h4>
            <p className="section-note">Please provide age-wise breakup for accurate pricing</p>
            
            <div className="traveler-type-grid">
              {/* Adults */}
              <div className="traveler-type-card">
                <div className="traveler-type-header">
                  <FaUserFriends className="traveler-icon" />
                  <span className="traveler-type">Adults</span>
                  <span className="traveler-age">(12-59 years)</span>
                </div>
                <div className="traveler-counter">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData({ ...formData, adults: Math.max(0, (formData.adults || 0) - 1) })}
                  >
                    -
                  </button>
                  <span className="counter-value">{formData.adults || 0}</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData({ ...formData, adults: (formData.adults || 0) + 1 })}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Children */}
              <div className="traveler-type-card">
                <div className="traveler-type-header">
                  <FaChild className="traveler-icon" />
                  <span className="traveler-type">Children</span>
                  <span className="traveler-age">(2-11 years)</span>
                </div>
                <div className="traveler-counter">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData({ ...formData, children: Math.max(0, (formData.children || 0) - 1) })}
                  >
                    -
                  </button>
                  <span className="counter-value">{formData.children || 0}</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData({ ...formData, children: (formData.children || 0) + 1 })}
                  >
                    +
                  </button>
                </div>
                {formData.children > 0 && (
                  <div className="child-ages">
                    <label>Children Ages</label>
                    <div className="age-inputs">
                      {[...Array(formData.children)].map((_, index) => (
                        <select
                          key={index}
                          className="age-select"
                          value={formData.childAges?.[index] || ''}
                          onChange={(e) => {
                            const newChildAges = [...(formData.childAges || [])];
                            newChildAges[index] = e.target.value;
                            setFormData({ ...formData, childAges: newChildAges });
                          }}
                          required
                        >
                          <option value="">Age</option>
                          {[2,3,4,5,6,7,8,9,10,11].map(age => (
                            <option key={age} value={age}>{age} years</option>
                          ))}
                        </select>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Senior Citizens */}
              <div className="traveler-type-card">
                <div className="traveler-type-header">
                  <FaUserFriends className="traveler-icon" />
                  <span className="traveler-type">Senior Citizens</span>
                  <span className="traveler-age">(60+ years)</span>
                </div>
                <div className="traveler-counter">
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData({ ...formData, seniors: Math.max(0, (formData.seniors || 0) - 1) })}
                  >
                    -
                  </button>
                  <span className="counter-value">{formData.seniors || 0}</span>
                  <button
                    type="button"
                    className="counter-btn"
                    onClick={() => setFormData({ ...formData, seniors: (formData.seniors || 0) + 1 })}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Total Travelers Summary */}
            <div className="total-travelers-summary">
              <div className="summary-row">
                <span>Total Travelers:</span>
                <span className="summary-value">
                  {(formData.adults || 0) + (formData.children || 0) + (formData.seniors || 0)}
                </span>
              </div>
              <div className="summary-row">
                <span>Estimated Price:</span>
                <span className="summary-value price">
                  ₹{formatPrice((selectedDuration?.discountedPrice || selectedDuration?.price) * 
                    ((formData.adults || 0) + (formData.children || 0) + (formData.seniors || 0)))}
                </span>
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="form-section">
            <h4 className="section-subtitle">Preferences</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label>Room Preference</label>
                <select
                  value={formData.roomPreference || ''}
                  onChange={(e) => setFormData({ ...formData, roomPreference: e.target.value })}
                >
                  <option value="">Select preference</option>
                  <option value="single">Single Room</option>
                  <option value="double">Double Room</option>
                  <option value="twin">Twin Room</option>
                  <option value="triple">Triple Room</option>
                  <option value="family">Family Room</option>
                  <option value="suite">Suite</option>
                </select>
              </div>

              <div className="form-group">
                <label>Meal Preference</label>
                <select
                  value={formData.mealPreference || ''}
                  onChange={(e) => setFormData({ ...formData, mealPreference: e.target.value })}
                >
                  <option value="">Select preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="jain">Jain</option>
                  <option value="halal">Halal</option>
                  <option value="kosher">Kosher</option>
                </select>
              </div>
            </div>

            {/* Additional Preferences */}
            <div className="additional-preferences">
              <div className="preference-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.pickup || false}
                    onChange={(e) => setFormData({ ...formData, pickup: e.target.checked })}
                  />
                  <span>Airport Pickup Required</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.guide || false}
                    onChange={(e) => setFormData({ ...formData, guide: e.target.checked })}
                  />
                  <span>Private Guide Required</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.insurance || false}
                    onChange={(e) => setFormData({ ...formData, insurance: e.target.checked })}
                  />
                  <span>Travel Insurance</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.wheelchair || false}
                    onChange={(e) => setFormData({ ...formData, wheelchair: e.target.checked })}
                  />
                  <span>Wheelchair Access Required</span>
                </label>
              </div>
            </div>
          </div>

          {/* Special Requests */}
          <div className="form-section">
            <div className="form-group">
              <label>Special Requests</label>
              <textarea
                placeholder="Any specific requirements? (dietary restrictions, accessibility needs, room preferences, medical conditions, etc.)"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows="4"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="form-actions">
            <button 
              type="button" 
              className="whatsapp-btn" 
              onClick={handleWhatsApp}
              disabled={loading}
            >
              <FaWhatsapp /> WhatsApp Inquiry
            </button>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Inquiry'}
            </button>
          </div>

          <p className="form-note">
            * We'll get back to you within 24 hours with availability, confirmation, and final pricing based on traveler ages
          </p>
        </form>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
          padding: 20px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 30px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
          padding: 40px;
          position: relative;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.4);
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

        .modal-close {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          border: none;
          background: #f0f0f0;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #666;
          transition: all 0.3s ease;
          z-index: 10;
        }

        .modal-close:hover {
          background: #e0e0e0;
          transform: rotate(90deg);
        }

        .modal-title {
          font-size: 2rem;
          font-weight: 700;
          color: #333;
          margin-bottom: 25px;
        }

        .booking-summary {
          background: linear-gradient(145deg, #f8f9fa, #ffffff);
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 25px;
          border: 1px solid #f0f0f0;
        }

        .package-name {
          font-size: 1.2rem;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }

        .booking-details {
          display: flex;
          gap: 20px;
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 10px;
        }

        .booking-total {
          font-size: 1.4rem;
          font-weight: 700;
          color: #4158D0;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e0e0e0;
        }

        .error-message {
          background: #fee;
          color: #ef4444;
          padding: 12px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 0.95rem;
        }

        .booking-form {
          display: flex;
          flex-direction: column;
          gap: 25px;
        }

        .form-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 15px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 15px;
        }

        .form-group:last-child {
          margin-bottom: 0;
        }

        .form-group label {
          font-size: 0.95rem;
          font-weight: 500;
          color: #555;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px 15px;
          font-size: 1rem;
          border-radius: 10px;
          border: 2px solid #e0e0e0;
          outline: none;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          border-color: #4158D0;
          box-shadow: 0 0 0 3px rgba(65, 88, 208, 0.1);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .section-subtitle {
          font-size: 1.1rem;
          font-weight: 600;
          color: #333;
          margin: 0 0 15px 0;
        }

        .section-note {
          font-size: 0.85rem;
          color: #666;
          margin: -10px 0 20px 0;
        }

        .traveler-type-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .traveler-type-card {
          background: white;
          padding: 15px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .traveler-type-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          flex-wrap: wrap;
        }

        .traveler-icon {
          color: #4158D0;
          font-size: 1.2rem;
        }

        .traveler-type {
          font-weight: 600;
          color: #333;
        }

        .traveler-age {
          font-size: 0.8rem;
          color: #999;
          margin-left: auto;
        }

        .traveler-counter {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }

        .counter-btn {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          border: 1px solid #e0e0e0;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
          transition: all 0.3s ease;
        }

        .counter-btn:hover:not(:disabled) {
          background: #4158D0;
          color: white;
          border-color: #4158D0;
        }

        .counter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .counter-value {
          font-weight: 600;
          font-size: 1.2rem;
          min-width: 30px;
          text-align: center;
        }

        .child-ages {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px dashed #e0e0e0;
        }

        .child-ages label {
          display: block;
          font-size: 0.9rem;
          font-weight: 500;
          color: #555;
          margin-bottom: 10px;
        }

        .age-inputs {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .age-select {
          flex: 1;
          min-width: 80px;
          padding: 8px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          font-size: 0.9rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .age-select:focus {
          border-color: #4158D0;
          box-shadow: 0 0 0 3px rgba(65, 88, 208, 0.1);
        }

        .total-travelers-summary {
          background: linear-gradient(145deg, #4158D0, #C850C0);
          color: white;
          padding: 15px;
          border-radius: 12px;
          margin-top: 20px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .summary-row:last-child {
          margin-bottom: 0;
          padding-top: 8px;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .summary-value {
          font-weight: 600;
        }

        .summary-value.price {
          font-size: 1.2rem;
        }

        .additional-preferences {
          margin-top: 15px;
        }

        .preference-checkboxes {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          font-size: 0.95rem;
          color: #555;
        }

        .checkbox-label input[type="checkbox"] {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }

        .form-actions {
          display: flex;
          gap: 15px;
          margin-top: 10px;
        }

        .whatsapp-btn {
          flex: 1;
          padding: 14px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;
        }

        .whatsapp-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(37, 211, 102, 0.3);
        }

        .submit-btn {
          flex: 2;
          padding: 14px;
          background: linear-gradient(145deg, #4158D0, #C850C0);
          color: white;
          border: none;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(65, 88, 208, 0.3);
        }

        .submit-btn:disabled,
        .whatsapp-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .form-note {
          font-size: 0.85rem;
          color: #888;
          text-align: center;
          margin-top: 15px;
        }

        @media (max-width: 768px) {
          .modal-content {
            padding: 30px 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .traveler-type-grid {
            grid-template-columns: 1fr;
          }

          .preference-checkboxes {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }
        }

        @media (max-width: 480px) {
          .modal-title {
            font-size: 1.5rem;
          }

          .booking-details {
            flex-direction: column;
            gap: 10px;
          }

          .traveler-type-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .traveler-age {
            margin-left: 0;
          }

          .age-inputs {
            flex-direction: column;
          }

          .age-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingForm;