import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
// const API_URL = 'http://localhost:5000/api'
import api from "../../utils/api";



const BookingUI = () => {
  const { user, token } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState("bookings");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedBookings, setExpandedBookings] = useState(new Set());

  // ✅ Define bookings state BEFORE using in useEffect
  const [booking, setBooking] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const userRole = user?.isAdmin ? "admin" : "user";

  const loadConfirmedBookings = async () => {
    try {
      if (!user) return; // safety

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token missing, please login again.");
        return;
      }

      setIsLoading(true);

      const url = user?.isAdmin ? `/bookings/confirmed` : `/bookings/confirmed-user`;      

      const { data } = await api.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setBooking(data.bookings || []);
        console.log("Confirmed bookings loaded:", data.bookings)
      } else {
        setBooking([]);
        setError(data.message || "Failed to fetch confirmed bookings");
      }
    } catch (err) {
      console.error(err);
      setBooking([]);
      setError(err.response?.data?.message || "Failed to fetch confirmed bookings");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    loadConfirmedBookings();
  }, [user]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;



  const handleSubmit = (e) => {
    e.preventDefault();

    const newBooking = {
      ...formData,
      _id: `booking_${Date.now()}`,
      userId: `user_${Date.now()}`,
      status: "pending",
      createdAt: new Date().toISOString().split("T")[0],

      quotedPrice: formData.quotedPrice
        ? parseInt(formData.quotedPrice)
        : null,
    };

    setBooking((prev) => [newBooking, ...prev]);

    setFormData({
      packageId: "",
      fullName: "",
      location: "",
      email: "",
      mobile: "",
      startDate: "",
      days: 1,
      adults: 1,
      children: 0,
      notes: "",
      quotedPrice: "",
    });

    setActiveTab("bookings");
    alert("Booking created successfully!");
  };

  // const handleStatusUpdate = (bookingId, newStatus) => {
  //   setBooking((prev) =>
  //     prev.map((booking) =>
  //       booking._id === bookingId
  //         ? { ...booking, status: newStatus }
  //         : booking
  //     )
  //   );
  // };

  const handleDeleteBooking = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBooking((prev) =>
        prev.filter((booking) => booking._id !== bookingId)
      );
    }
  };
  const filteredBookings = Array.isArray(booking)
    ? booking.filter((booking) => {
      const matchesSearch =
        booking.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.packageId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filterStatus === "all" || booking.status === filterStatus;

      return matchesSearch && matchesFilter;
    })
    : [];
  // fallback to empty array if bookings is undefined

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return { background: "#d4edda", color: "#155724" };
      case "pending":
        return { background: "#fff3cd", color: "#856404" };
      case "cancelled":
        return { background: "#f8d7da", color: "#721c24" };
      default:
        return { background: "#f8f9fa", color: "#6c757d" };
    }
  };

  const toggleBookingExpand = (bookingId) => {
    setExpandedBookings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(bookingId)) {
        newSet.delete(bookingId);
      } else {
        newSet.add(bookingId);
      }
      return newSet;
    });
  };

  if (isLoading) return <p>Loading bookings...</p>;



  const handlePrintBooking = (booking) => {
    console.log("BOOKING RECEIVED:", booking);
    console.log(" confiemedAT:", booking.confirmedAt);       // snapshot



    const printWindow = window.open("", "_blank");

    // <A></A>dd your logo URL or base64 image here
    const logoUrl = "logo.png"; // Replace with your logo URL
    // Or use base64: "data:image/png;base64,your-base64-string"

    printWindow.document.write(`
<!DOCTYPE html> 
<html>
<head>
<meta charset="UTF-8" />
<title>Travel Itinerary - Booking #${booking?._id}</title>

<style>
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Playfair+Display:wght@400;500&display=swap');

  :root {
    --primary: #1a73e8;
    --primary-light: #e8f0fe;
    --secondary: #ff6b35;
    --dark: #2d3748;
    --light: #f8fafc;
    --border: #e2e8f0;
    --success: #10b981;
    --warning: #f59e0b;
    --danger: #ef4444;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', sans-serif;
    background: #fff;
    color: var(--dark);
    line-height: 1.6;
    padding: 20px;
  }

  .itinerary-container {
    max-width: 1000px;
    margin: 0 auto;
    background: white;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
  }

  /* Header with Logo */
  .itinerary-header {
    background: linear-gradient(135deg, var(--primary) 0%, #1557b0 100%);
    color: white;
    padding: 10px 20px;
    position: relative;
  }

  .header-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }

  .logo-container {
    display: flex;
    align-items: left;
    gap: 15px;
    margin-Top: -10px;
  }

  .logo {
    height: 170px;
    width: 150px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
    .company-info {
    margin-top: 20px;
    }

  .company-info h1 {
    font-family: 'Fraunces', serif;
    font-size: 32px;
    font-weight: 600;
    margin-Top: 15px;
    letter-spacing: 1px;
    margin-bottom: 5px;
  }
    .company-info span {
    font-family: Space Grotesk
    }

  .tagline p {
    font-size: 14px;
    opacity: 0.9;
    margin-top: -20px;
  }

  .booking-badge {
    background: rgba(255, 255, 255, 0.2);
    padding: 12px 20px;
    border-radius: 8px;
    backdrop-filter: blur(10px);
  }

  .booking-id {
    font-size: 18px;
    font-weight: 600;
  }

  .reference {
    font-size: 12px;
    opacity: 0.9;
  }

  /* Passenger Info */
  .passenger-section {
    padding: 25px 40px;
    background: var(--light);
    border-bottom: 2px solid var(--border);
  }

  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 20px;
    color: var(--primary);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .section-title i {
    font-size: 22px;
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .info-card {
    background: white;
    padding: 15px;
    border-radius: 8px;
    border-left: 4px solid var(--primary);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }

  .info-label {
    font-size: 12px;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 5px;
  }

  .info-value {
    font-size: 16px;
    font-weight: 500;
  }

  /* Itinerary Details */
  .itinerary-details {
    padding: 25px 40px;
  }

  .details-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
    margin-top: 20px;
  }

  .detail-card {
    text-align: center;
    padding: 20px;
    background: var(--light);
    border-radius: 10px;
    transition: transform 0.3s ease;
  }

  .detail-card:hover {
    transform: translateY(-5px);
  }

  .detail-icon {
    font-size: 28px;
    color: var(--primary);
    margin-bottom: 10px;
  }

  .detail-label {
    font-size: 13px;
    color: #666;
    margin-bottom: 8px;
  }

  .detail-value {
    font-size: 18px;
    font-weight: 600;
    color: var(--dark);
  }

  .price-highlight {
    font-size: 24px;
    color: var(--secondary);
    font-weight: 700;
  }

  /* Status Badge */
  .status-container {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .status-confirmed {
    background: var(--primary-light);
    color: var(--primary);
  }

  .status-pending {
    background: #fef3c7;
    color: #d97706;
  }

  .status-cancelled {
    background: #fee2e2;
    color: var(--danger);
  }

  /* Special Requests */
  .requests-section {
    padding: 25px 40px;
    background: var(--light);
    margin: 20px 40px;
    border-radius: 10px;
    border-left: 4px solid var(--secondary);
  }

  /* Footer */
  .itinerary-footer {
    padding: 30px 40px;
    background: var(--dark);
    color: white;
    text-align: center;
  }

  .contact-info {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin: 20px 0;
    font-size: 14px;
  }

  .contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .terms {
    font-size: 12px;
    opacity: 0.7;
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* Print Button */
  .print-actions {
    padding: 20px 40px;
    text-align: center;
  }

  .print-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 12px 30px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
  }

  .print-btn:hover {
    background: #1557b0;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(26, 115, 232, 0.3);
  }

    /* Print Styles */
    @media print {
      body {
        padding: 0;
        background: white;
      }
      
      .itinerary-container {
        box-shadow: none;
        border-radius: 0;
      }
      
      .print-btn {
        display: none;
      }
      
      .itinerary-header {
        background: #1a73e8 !important;
        -webkit-print-color-adjust: exact;
        
      }
      
      .detail-card:hover {
        transform: none;
      }


/* Print Styles -----*/
      .itinerary-header {
    padding: 16px 20px !important;
    
  }

  .header-top {
    display: flex !important;
    flex-wrap: wrap !important;
    align-items: center !important;
    gap: 12px;
  }

  /* FIX logo size */
  

  /* REMOVE negative spacing */
  .logo-container {
    margin-top: 0 !important;
    align-items: left !important;
    display: flex !important;
  }

  .company-info h1 {
    font-size: 24px !important;
    margin-top: 0 !important;
    line-height: 1.2;
  }

  .company-info span {
    font-size: 14px;
    display: block;
  }

  .tagline {
    margin-top: 5px !important;
    margin-left: 20px;

  .tagline p{
    font-size: 12px;
    margin-bottom: 5px !important;
    margin-top: 15px !important;
    text-align: left;
    
  }

  /* Booking badge fix */
  .booking-badge {
    padding: 10px 10px !important;
    text-align: left;
    word-break: break-word;
  }

  .booking-id {
    font-size: 14px !important;
  }

  .reference {
    font-size: 11px !important;
    text-align: left;
  }

  /* Generated date line */
  .itinerary-header > p {
    margin-top: 8px !important;
    font-size: 12px !important;
  }
    }


    /* =============================================
   PRINT STYLES - HEADER SECTION & PAGE BREAKS
============================================= */
@media print {
  /* ===== PAGE SETUP ===== */
  @page {
    size: A4 portrait;
    margin: 15mm;
  }

  /* ===== HEADER SECTION - COMPACT & PRINT-OPTIMIZED ===== */
  .itinerary-header {
    background: #1a73e8 !important;
    color: white !important;
    padding: 10mm 0 6mm 0 !important;
    margin: 0 0 8mm 0 !important;
    page-break-after: avoid;
    break-after: avoid-page;
    max-heght: 50mm !important;
  }

  .header-top {
    display: flex !important;
    justify-content: space-between !important;
    align-items: flex-start !important;
    flex-wrap: nowrap !important;
    gap: 15mm !important;
    margin: 0 5mm !important;
    page-break-inside: avoid;
  }

  .logo-container {
    flex: 0 0 10% !important;
    display: flex !important;
    align-items: flex-start !important;
    gap: 4mm !important;
    min-width: 70mm !important;
  }

  .logo {
    height: 35mm !important;
    width: auto !important;
    margin-left:-5mm;
    margin-right:-10mm;
    margin-top: -9mm;
    max-width: 50mm !important;
    object-fit: contain !important;
    filter: brightness(0) invert(1) !important;
  }

  .company-info {
    flex: 1 !important;
    min-width: 0 !important; /* Allows text wrapping */
    max-width: 55mm;
    margin-top: -4mm !important;
    

  }

  .company-info h1 {
    font-size: 20pt !important;
    font-weight: bold !important;
    color: white !important;
    line-height: 1.2 !important;
    word-break: break-word;
    margin-top: 5mm !important;
  }



  .booking-badge {
    background: white !important;
    color: #000 !important;
    padding: 1mm 2mm !important;
    border-radius: 2mm !important;
    box-shadow: 0 1mm 2mm rgba(0,0,0,0.1) !important;
    flex: 0 0 5mm !important;
    min-width: 85mm !important;
    max-width: 100mm !important;
    page-break-inside: avoid;
  }

  .booking-id {
    font-size: 13pt !important;
    font-weight: bold !important;
    margin: 0 0 1mm 0 !important;
    color: #1a73e8 !important;
  }

  .reference {
    font-size: 10pt !important;
    margin: 0 !important;
    color: #666 !important;
    word-break: break-all;
  }

  

  /* ===== PAGE BREAK CONTROL ===== */
  .page-break-before {
    page-break-before: always !important;
  }

  .page-break-after {
    page-break-after: always !important;
  }

  .avoid-break-inside {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .allow-break-inside {
    page-break-inside: auto !important;
  }

  /* Keep section headers with their content */
  h2, h3, .section-title {
    page-break-after: avoid !important;
  }

  /* Prevent breaking in the middle of important content */
  table, tr, .day-card, .activity-group {
    page-break-inside: avoid !important;
  }

  /* Allow breaking between list items */
  li {
    page-break-inside: avoid !important;
  }

  /* Force break before major sections if needed */
  .major-section {
    page-break-before: auto !important;
  }

  /* Ensure minimum lines stay together */
  .keep-together {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }
}
   

  /* Responsive */
  @media (max-width: 768px) {
    .header-top {
      flex-direction: row;
      gap: 15px;
      text-align: center;
      display; flex;
    }
    
    .details-grid {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .contact-info {
      flex-direction: column;
      gap: 15px;
    }
  }

  @media (max-width: 480px) {
    .itinerary-header,
    .passenger-section,
    .itinerary-details {
      padding: 20px;
    }
    
    .details-grid {
      grid-template-columns: 1fr;
    }
    
    .info-grid {
      grid-template-columns: 1fr;
    }
  }
</style>

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>

<body>
<div class="itinerary-container">

  <!-- Header with Logo -->
  <div class="itinerary-header">
    <div class="header-top">
      <div class="logo-container">
        <img src="${logoUrl}" alt="Elite Travel Agency" class="logo">
        <div class="company-info">
          <h1>DESIVDESI</h1>
          <span>Tours & Travel</span>
        </div>
      </div>

      
      <div class="booking-badge">
        <div class="booking-id">ITINERARY #${booking._id}</div>
        <div class="reference">Reference: ${booking._id.slice(-8).toUpperCase()}</div>
      </div>
    </div>
      <div class="tagline">
        <p >Crafting Extraordinary Journeys Since 2005</p>
        <p style="font-size: 14px; opacity: 0.9; margin-top:5px; ">
    
      <i class="fas fa-calendar-alt"></i> Generated on ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
    </p>
    </div>
  </div>

  <!-- Passenger Information -->
  <div class="passenger-section">
    <div class="section-title">
      <i class="fas fa-user-circle"></i>
      <span>Passenger Information</span>
    </div>
    <div class="info-grid">
      <div class="info-card">
        <div class="info-label">Full Name</div>
        <div class="info-value">${booking.fullName}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Email Address</div>
        <div class="info-value">${booking.email}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Mobile Number</div>
        <div class="info-value">${booking.mobile}</div>
      </div>
      <div class="info-card">
        <div class="info-label">Location</div>
        <div class="info-value">${booking.destination}</div>
      </div>
    </div>
  </div>

  <!-- Itinerary Details -->
  <div class="itinerary-details">
    <div class="section-title">
      <i class="fas fa-route"></i>
      <span>Travel Itinerary Details</span>
    </div>
    
    <div class="details-grid">
      <div class="detail-card">
        <div class="detail-icon">
          <i class="fas fa-calendar-day"></i>
        </div>
        <div class="detail-label">Start Date</div>
        <div class="detail-value">
          ${new Date(booking.startDate).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}
        </div>
      </div>
      
      <div class="detail-card">
        <div class="detail-icon">
          <i class="fas fa-clock"></i>
        </div>
        <div class="detail-label">Duration</div>
        <div class="detail-value">${booking.duration} Days</div>
      </div>
      
      <div class="detail-card">
        <div class="detail-icon">
          <i class="fas fa-users"></i>
        </div>
        <div class="detail-label">Travelers</div>
        <div class="detail-value">${booking.adults} Adults, ${booking.children} Children</div>
      </div>
      
      <div class="detail-card">
        <div class="detail-icon">
          <i class="fas fa-box"></i>
        </div>
        <div class="detail-label">Package ID</div>
        <div class="detail-value">${booking.packageId}</div>
      </div>
      
      <div class="detail-card">
        <div class="detail-icon">
          <i class="fas fa-wallet"></i>
        </div>
        <div class="detail-label">Total Price</div>
        <div class="detail-value price-highlight">
          ₹${booking.quotedPrice || "TBD"}
        </div>
      </div>
      
      <div class="detail-card">
        <div class="detail-icon">
          <i class="fas fa-flag"></i>
        </div>
        <div class="detail-label">Booking Status</div>
        <div class="status-container status-${booking.status}">
          <i class="fas fa-circle" style="font-size: 8px;"></i>
          ${booking.status.toUpperCase()}
        </div>
      </div>
    </div>
    
   <div style="
  margin-top: 25px;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
  display: flex;
  justify-content: space-between;
">

  <!-- Created date (always show) -->
  ${booking.status === "Confirmed" && (booking.createdAt) ? `
  <div style="margin-top: 15px; display: flex; align-items: center; gap: 8px;">
    <i class="fas fa-calendar-plus"></i>
    Booking Created on ${new Date(booking.createdAt).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
        }
  </div>
  ` : ''
      }>

  <!-- Confirmed date (show only if confirmed) -->
   ${booking.status === "Confirmed" && (booking.updatedAt) ? `
  <div style="margin-top: 15px; display: flex; align-items: center; gap: 8px;">
    <i class="fas fa-check-circle" style="color: green;"></i>
    Booking Confirmed on ${new Date(booking.updatedAt).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
        }
  </div>
  ` : ''
      }




  </div>

  <!-- Special Requests -->
  ${booking.notes ? `
  <div class="requests-section">
    <div class="section-title">
      <i class="fas fa-sticky-note"></i>
      <span>Special Requests & Notes</span>
    </div>
    <div style="background: white; padding: 15px; border-radius: 8px; font-size: 14px; line-height: 1.8;">
      ${booking.notes}
    </div>
  </div>
  ` : ''}

  <!-- Footer -->
  <div class="itinerary-footer">
    <h3 style="margin-bottom: 15px; font-weight: 500; font-size: 1.8rem;">DESIVDESI <span style="font-weight: 250;font-size: 1rem;">Tours & Travel</span></h3>
    <div class="contact-info">
      <div class="contact-item">
        <i class="fas fa-envelope"></i>
        <span>tours.desivdesi@gmail</span>
      </div>
      <div class="contact-item">
        <i class="fas fa-phone"></i>
        <span>+91 7888251550</span>
      </div>
      <div class="contact-item">
        <i class="fas fa-map-marker-alt"></i>
        <span>123 Plot No.24 Amar society-N8 cidco  Chh.Sambhajinagar</span>
      </div>
    </div>
    <p style="font-size: 13px; opacity: 0.9; margin-top: 15px;">
      Creating unforgettable travel experiences with passion and professionalism
    </p>
    <div class="terms">
      <p>This document serves as your official travel itinerary. Please present it during check-in.</p>
      <p style="margin-top: 5px;">© ${new Date().getFullYear()} DESIVDESI tours & travel. All rights reserved.</p>
    </div>
  </div>

  <!-- Print Button -->
  <div class="print-actions">
    <button class="print-btn" onclick="window.print()">
      <i class="fas fa-print"></i>
      Print Itinerary
    </button>
  </div>

</div>

<script>
  // Auto-print option (uncomment if needed)
  // window.onload = () => window.print();
</script>
</body>
</html>
  `);

    printWindow.document.close();
  };

  return (
    <div style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f8f9fa',
      minHeight: '100vh',
      color: '#333',
      lineHeight: '1.6'
    }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e9ecef',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <h1 style={{
                fontSize: '2rem',
                color: '#2c3e50',
                marginBottom: '5px',
                margin: '0 0 5px 0'
              }}>Booking Management</h1>
              <p style={{
                color: '#6c757d',
                fontSize: '0.9rem',
                margin: 0
              }}>Manage your travel bookings and reservations</p>
            </div>
            <div style={{
              display: 'flex',
              gap: '10px'
            }}>
              <button
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'inherit',
                  background: activeTab === 'bookings' ? '#007bff' : '#f8f9fa',
                  color: activeTab === 'bookings' ? 'white' : '#495057'
                }}
                onClick={() => setActiveTab('bookings')}
              >
                <span>👁️</span> Total Bookings ({Array.isArray(booking) ? booking.length : 0})

              </button>

            </div>
          </div>
        </div>
      </header>

      <main style={{ padding: '30px 0' }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {activeTab === 'bookings' ? (
            <div>
              {/* Search and Filter */}
              <div style={{
                background: 'white',
                padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                marginBottom: '30px'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '20px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    flex: '1',
                    position: 'relative',
                    minWidth: '250px'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#6c757d'
                    }}>🔍</span>
                    <input
                      type="text"
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 12px 12px 40px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                  <div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      style={{
                        padding: '12px 15px',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        background: 'white',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit'
                      }}
                    >
                      <option value="all">All Status</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bookings Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: '25px'
              }}>
                {booking.map((booking) => {
                  const isExpanded = expandedBookings.has(booking._id);
                  const user = booking.user || {};


                  return (

                    <div key={booking._id} style={{
                      background: 'white',
                      borderRadius: '12px',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                      overflow: 'hidden'

                    }}>
                      <div style={{ padding: '20px' }}>
                        {/* Header with Status */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          marginBottom: '15px',


                        }}>
                          <div>
                            <div style={{
                              fontSize: '1.2rem',
                              fontWeight: '700',
                              color: '#2c3e50',
                              marginBottom: '5px',
                              display: 'flex',

                            }}>{booking.packageName || 'Untitled Package'}</div>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              color: '#6c757d',
                              fontSize: '0.9rem'
                            }}>
                              <span>📍</span>
                              {booking?.destination}
                            </div>

                            <div style={{
                              fontSize: '0.8rem',
                              color: '#28a745',
                              fontWeight: '600',

                              gap: '4px'
                            }}>
                              👤 Generated by: {booking.fullName || "Unknown"}
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                            <span style={{
                              padding: '5px 12px',
                              borderRadius: '20px',
                              fontSize: '0.8rem',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              ...getStatusColor(booking.status)
                            }}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>

                          </div>
                        </div>

                        {/* Contact Info */}
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          marginBottom: '15px'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.9rem',
                            color: '#495057'
                          }}>
                            <span>📧</span>
                            <span>{booking.email || 'NA'}</span>
                          </div>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '0.9rem',
                            color: '#495057'
                          }}>
                            <span>📞</span>
                            <span>{booking.mobile}</span>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {isExpanded && (
                          <div style={{
                            borderTop: '1px solid #f8f9fa',
                            marginTop: '15px',
                            paddingTop: '15px'
                          }}>
                            {/* Booking Information */}
                            <div style={{ marginBottom: '20px' }}>
                              <h4 style={{
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#2c3e50',
                                marginBottom: '10px'
                              }}>Booking Information</h4>
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '15px'
                              }}>
                                <div>
                                  <div style={{
                                    fontSize: '0.8rem',
                                    color: '#6c757d',
                                    textTransform: 'uppercase'
                                  }}>Package ID</div>
                                  <div style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                  }}>{booking.packageId}</div>
                                </div>
                                <div>
                                  <div style={{
                                    fontSize: '0.8rem',
                                    color: '#6c757d',
                                    textTransform: 'uppercase'
                                  }}><span>📞</span> Alternate Contact</div>
                                  <div style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                  }}>{booking.alternateMobile || 'NA'}</div>
                                </div>
                                <div>
                                  <div style={{
                                    fontSize: '0.8rem',
                                    color: '#6c757d',
                                    textTransform: 'uppercase'
                                  }}>Booking ID</div>
                                  <div style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                  }}>{booking.bookingId}</div>
                                </div>
                              </div>
                            </div>

                            {/* Travel Details */}
                            <div style={{ marginBottom: '20px' }}>
                              <h4 style={{
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                color: '#2c3e50',
                                marginBottom: '10px'
                              }}>Travel Details</h4>
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                gap: '15px'
                              }}>
                                <div>
                                  <div style={{
                                    fontSize: '0.8rem',
                                    color: '#6c757d',
                                    textTransform: 'uppercase'
                                  }}>Start Date</div>
                                  <div style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                  }}>{new Date(booking.startDate).toLocaleDateString()}</div>
                                </div>
                                <div>
                                  <div style={{
                                    fontSize: '0.8rem',
                                    color: '#6c757d',
                                    textTransform: 'uppercase'
                                  }}>Duration</div>
                                  <div style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                  }}>{booking.duration} days</div>
                                </div>
                                <div>
                                  <div style={{
                                    fontSize: '0.8rem',
                                    color: '#6c757d',
                                    textTransform: 'uppercase'
                                  }}>Travelers</div>
                                  <div style={{
                                    fontWeight: '600',
                                    color: '#2c3e50'
                                  }}>{booking.adults} Adults + {booking.children} Children</div>
                                </div>
                                {booking.quotedPrice && (
                                  <div>
                                    <div style={{
                                      fontSize: '0.8rem',
                                      color: '#6c757d',
                                      textTransform: 'uppercase'
                                    }}>Price</div>
                                    <div style={{
                                      fontWeight: '600',
                                      color: '#28a745'
                                    }}>${booking.quotedPrice}</div>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Notes */}
                            {booking.notes && (
                              <div style={{ marginBottom: '20px' }}>
                                <h4 style={{
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                  color: '#2c3e50',
                                  marginBottom: '10px'
                                }}>Special Requests</h4>
                                <div style={{
                                  background: '#f8f9fa',
                                  padding: '15px',
                                  borderRadius: '8px'
                                }}>
                                  <div style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '8px'
                                  }}>
                                    <span>📝</span>
                                    <p style={{
                                      margin: '0',
                                      color: '#495057',
                                      fontSize: '0.9rem'
                                    }}>{booking.notes}</p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Created Date */}
                            <div style={{
                              fontSize: '0.8rem',
                              color: '#6c757d',
                              textAlign: 'center',
                              paddingTop: '15px',
                              borderTop: '1px solid #f8f9fa'
                            }}>
                              Booking created: {new Date(booking.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div style={{
                        padding: '15px 20px',
                        background: '#f8f9fa',
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap'
                      }}>
                        <button
                          onClick={() => toggleBookingExpand(booking._id)}
                          style={{
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            fontFamily: 'inherit',
                            background: '#007bff',
                            color: 'white',
                            flex: '1'
                          }}
                        >
                          <span>{isExpanded ? '⬆️' : '⬇️'}</span>
                          {isExpanded ? 'Less' : 'More'}
                        </button>

                        {userRole === 'user' && (
                          <button
                            onClick={() => handlePrintBooking(booking)}
                            style={{
                              padding: '8px 12px',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '600',
                              fontSize: '0.8rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '5px',
                              fontFamily: 'inherit',
                              background: '#6c757d',
                              color: 'white'
                            }}
                          >
                            <span>🖨️</span>
                            Print
                          </button>
                        )}


                        <button
                          onClick={() => handleDeleteBooking(booking._id)}
                          style={{
                            padding: '8px 12px',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.8rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px',
                            fontFamily: 'inherit',
                            background: '#dc3545',
                            color: 'white'
                          }}
                        >
                          <span>🗑️</span>
                          Delete
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: '#6c757d'
            }}>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '10px',
                color: '#2c3e50'
              }}>No bookings found</h3>
              <p>Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'white',
        borderTop: '1px solid #e9ecef',
        padding: '20px 0',
        textAlign: 'center',
        color: '#6c757d',
        fontSize: '0.9rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          <p style={{ margin: 0 }}>
            © {new Date().getFullYear()} Booking Management System. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #f8f9fa;
        }
        .print-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
            padding: 30px;
        }
        .company-header {
            text-align: center;
            border-bottom: 2px solid #2c3e50;
            padding-bottom: 20px;
            margin-bottom: 25px;
        }
        .company-name {
            font-size: 28px;
            font-weight: bold;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 25px;
        }
        .booking-title {
            font-size: 24px;
            color: #2c3e50;
            margin-bottom: 5px;
        }
        .generated-date {
            color: #7f8c8d;
            font-size: 14px;
        }
        .section {
            margin: 25px 0;
            padding-bottom: 15px;
            border-bottom: 1px solid #ecf0f1;
        }
        .section h3 {
            color: #2c3e50;
            border-bottom: 2px solid #3498db;
            padding-bottom: 8px;
            margin-bottom: 15px;
            font-size: 18px;
        }
        .booking-info p {
            margin: 10px 0;
            display: flex;
        }
        .label {
            font-weight: bold;
            min-width: 150px;
            color: #2c3e50;
        }
        .status {
            padding: 5px 12px;
            border-radius: 20px;
            display: inline-block;
            font-weight: bold;
            font-size: 12px;
        }
        .confirmed { background-color: #d4edda; color: #155724; }
        .pending { background-color: #fff3cd; color: #856404; }
        .cancelled { background-color: #f8d7da; color: #721c24; }
        .notes {
            background-color: #f8f9fa;
            padding: 15px;
            border-left: 4px solid #3498db;
            border-radius: 4px;
            margin-top: 10px;
        }
        .company-footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px solid #2c3e50;
            color: #7f8c8d;
        }
        .website {
            font-size: 16px;
            color: #3498db;
            font-weight: bold;
            margin: 10px 0;
            text-decoration: none;
            display: inline-block;
        }
        .contact-info {
            font-size: 14px;
            margin: 5px 0;
        }
        .print-btn {
            background-color: #3498db;
            color: white;
            border: none;
            padding: 12px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
            margin: 20px auto;
            display: block;
            transition: background-color 0.3s;
        }
        .print-btn:hover {
            background-color: #2980b9;
        }
       
        `}
      </style>
    </div>
  );
};

export default BookingUI;













