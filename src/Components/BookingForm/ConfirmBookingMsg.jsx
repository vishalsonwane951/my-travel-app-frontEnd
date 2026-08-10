import React, { useState, useEffect } from 'react';

const BookingPopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [bookingId, setBookinId] = useState()

    // Show the popup after component mounts
    useEffect(() => {
        const timer = setTimeout(() => {
          setBookinId("BKG-12504C38")
            setShowPopup(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setShowPopup(false);
    };

    return (
        <div className="booking-demo-container">
            <div className="page-content">
                <h1>Travel Booking App</h1>
                <p>Your booking has been processed successfully.</p>
            </div>

            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup-content">
                        <div className="confirmation-header">
                            <div className="unique-animation">
                                <div className="orbit"></div>
                                <div className="orbit"></div>
                                <div className="orbit"></div>
                                <div className="central-icon">
                                    <i className="fas fa-check"></i>
                                </div>
                            </div>
                            <h2 className="unique-title">
                                <span className="success-text">Successfully</span> Created!
                            </h2>
                            <p className="booking-id">Booking ID: <strong>{bookingId}</strong></p>
                            <p className="confirmation-message">We will reach out to you very soon</p>
                        </div>

                        <div className="profile-suggestion">
                            <i className="fas fa-user-circle"></i>
                            <p>You can check your enquiry status in your profile section under <strong>My Enquiries</strong></p>
                        </div>

                        <div className="action-buttons">
                            <button className="btn unique-primary" onClick={handleClose}>
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <style jsx>{`
      /* Unique Color Scheme & Styles */
.booking-demo-container {
  font-family: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.page-content {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  text-align: center;
  margin-bottom: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.page-content h1 {
  color: #5a4b81;
  margin-bottom: 15px;
  font-weight: 700;
  font-size: 2.2rem;
}

.page-content p {
  color: #6c757d;
  font-size: 18px;
}

.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.popup-content {
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8f0 100%);
  border-radius: 20px;
  width: 90%;
  max-width: 450px;
  padding: 35px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.4s ease;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.8);
  overflow: hidden;
}

.popup-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #ff7e5f, #feb47b, #ff7e5f);
  background-size: 200% 200%;
  animation: gradientMove 3s ease infinite;
}

.confirmation-header {
  text-align: center;
  margin-bottom: 25px;
  position: relative;
}

.unique-animation {
  margin: 0 auto 25px;
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.orbit {
  position: absolute;
  border-radius: 50%;
  border: 2px solid transparent;
  animation: orbit 3s linear infinite;
}

.orbit:nth-child(1) {
  width: 80px;
  height: 80px;
  border-top-color: #ff7e5f;
  animation-duration: 4s;
}

.orbit:nth-child(2) {
  width: 90px;
  height: 90px;
  border-right-color: #feb47b;
  animation-duration: 5s;
  animation-direction: reverse;
}

.orbit:nth-child(3) {
  width: 70px;
  height: 70px;
  border-bottom-color: #6a6ef6;
  animation-duration: 3.5s;
}

.central-icon {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  box-shadow: 0 5px 15px rgba(255, 126, 95, 0.4);
  z-index: 2;
}

.unique-title {
  color: #5a4b81;
  margin-bottom: 15px;
  font-size: 28px;
  font-weight: 700;
  position: relative;
  display: inline-block;
}

.success-text {
  background: linear-gradient(135deg, #ff7e5f, #feb47b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  position: relative;
}

.success-text::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ff7e5f, #feb47b);
  border-radius: 3px;
}

.booking-id {
  font-size: 18px;
  color: #6c757d;
  margin-bottom: 10px;
  background: rgba(255, 255, 255, 0.7);
  padding: 10px 15px;
  border-radius: 10px;
  display: inline-block;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.confirmation-message {
  color: #6a6ef6;
  font-weight: 600;
  font-size: 16px;
  margin-top: 15px;
  font-style: italic;
}

.profile-suggestion {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  padding: 18px;
  margin: 25px 0;
  display: flex;
  align-items: center;
  text-align: left;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.profile-suggestion i {
  font-size: 26px;
  color: #6a6ef6;
  margin-right: 15px;
  flex-shrink: 0;
}

.profile-suggestion p {
  margin: 0;
  color: #5a4b81;
  font-size: 15px;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.btn {
  padding: 14px 35px;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  min-width: 140px;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.btn.unique-primary {
  background: linear-gradient(135deg, #6a6ef6, #8a64eb);
  color: white;
  box-shadow: 0 5px 15px rgba(106, 110, 246, 0.4);
}

.btn.unique-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(106, 110, 246, 0.6);
}

.btn.unique-primary:active {
  transform: translateY(1px);
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes gradientMove {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Responsive design */
@media (max-width: 600px) {
  .popup-content {
    width: 95%;
    padding: 25px;
  }
  
  .profile-suggestion {
    flex-direction: column;
    text-align: center;
  }
  
  .profile-suggestion i {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .unique-title {
    font-size: 24px;
  }
}
 
      `}</style>
        </div>
    )
}

export default BookingPopup;