// import React, { useState, useContext, useEffect } from 'react';
// import { AuthContext } from "../../Context/AuthContext";
// import axios from "axios";
// import api from '../../utils/api';
// const axios_URL = import.meta.env.VITE_axios;

// const MyEnquiry = ({ onClose }) => {
//   const { user, token } = useContext(AuthContext);
//   const [bookings, setBookings] = useState([]);
//   const [activeTab, setActiveTab] = useState("enquiries");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [expandedEnquiries, setExpandedEnquiries] = useState(new Set());
//   const [loading, setLoading] = useState(false);
//   const [enquiriesLoading, setEnquiriesLoading] = useState(true);
//   const [notification, setNotification] = useState(null);
//   const [Error, setError] = useState(false);
//   const [enquiries, setEnquiries] = useState([]);

//   const [formData, setFormData] = useState({
//     packageName: "",
//     destination: "",
//     enquiryType: "Package Enquiry",
//     message: "",
//     startDate: "",
//     Message: "",
//     duration: 1,
//     adults: 1,
//     children: 0,
//     seniors: 0,
//     budget: "",
//     generatedBy: {
//       fullName: user?.name || "",
//       email: user?.email || "",
//       phone: "",
//     },
//   });

//   const [formErrors, setFormErrors] = useState({});

//   // Fetch enquiries for logged-in user
//   useEffect(() => {
//     loadEnquiries();
//   }, [user]);

//   const loadEnquiries = async () => {
//     try {
//       if (!user) {
//         setError("User not logged in");
//         return;
//       }

//       const token = localStorage.getItem("token");
//       if (!token) {
//         setError("Token missing, please login again.");
//         return;
//       }

//       setEnquiriesLoading(true);
//       const url = user.isAdmin ? "/bookings" : `/bookings/user/${user._id}`;

//       const { data } = await api.get(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (data.success) {
//         setEnquiries(data.bookings);
//       } else {
//         setError(data.message || "Failed to fetch enquiries");
//       }
//     } catch (err) {
//       console.error(err);
//       showNotification("Failed to load enquiries", "error");
//     } finally {
//       setEnquiriesLoading(false);
//     }
//   };

//   const filteredBookings =
//     filterStatus === "all"
//       ? bookings
//       : bookings.filter((b) => b.status === filterStatus);

//   const showNotification = (message, type = "success") => {
//     setNotification({ message, type });
//     setTimeout(() => setNotification(null), 5000);
//   };

//   const updateStatus = async (bookingId, status) => {
//     if (!user.isAdmin) return;

//     try {
//       // const res = await api.put(
//       //   `/bookings/update-status/${bookingId}`,
//       //   { status },
//       const res = await api.put(`/bookings/update-status/${bookingId}`,
//         { status },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         setEnquiries((prev) =>
//           prev.map((b) => (b._id === bookingId ? { ...b, status } : b))
//         );
//         showNotification(`Booking status updated to ${status}`);
//       }
//     } catch (err) {
//       console.error(err);
//       showNotification("Failed to update status", "error");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;

//     if (name.startsWith("generatedBy.")) {
//       const field = name.split(".")[1];
//       setFormData((prev) => ({
//         ...prev,
//         generatedBy: { ...prev.generatedBy, [field]: value },
//       }));
//       if (formErrors.generatedBy?.[field]) {
//         setFormErrors((prev) => ({
//           ...prev,
//           generatedBy: { ...prev.generatedBy, [field]: "" },
//         }));
//       }
//     } else {
//       setFormData((prev) => ({
//         ...prev,
//         [name]: value,
//       }));
//       if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };

//   const validateForm = () => {
//     const errors = { generatedBy: {} };

//     if (!formData.packageName.trim()) errors.packageName = "Package name required";
//     if (!formData.destination.trim()) errors.destination = "Destination required";
//     if (!formData.duration) errors.duration = "Duration is required";

//     if (!formData.generatedBy.fullName.trim())
//       errors.generatedBy.fullName = "Full name required";
//     if (!formData.generatedBy.email.trim())
//       errors.generatedBy.email = "Email required";
//     if (!formData.generatedBy.phone.trim())
//       errors.generatedBy.phone = "Phone required";

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (formData.generatedBy.email && !emailRegex.test(formData.generatedBy.email))
//       errors.generatedBy.email = "Enter a valid email";

//     const phoneRegex = /^[+]?[0-9]{10,15}$/;
//     if (
//       formData.generatedBy.phone &&
//       !phoneRegex.test(formData.generatedBy.phone.replace(/\s/g, ""))
//     )
//       errors.generatedBy.phone = "Enter a valid phone number";

//     if (Object.keys(errors.generatedBy).length === 0) delete errors.generatedBy;

//     setFormErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const payload = {
//         ...formData,
//         userId: user._id,
//         fullName: formData.generatedBy.fullName,
//         email: formData.generatedBy.email,
//         mobile: formData.generatedBy.phone,
//         Message: formData.message,
//         duration: Number(formData.duration),
//         adults: Number(formData.adults) || 0,
//         children: Number(formData.children) || 0,
//         seniors: Number(formData.seniors) || 0,
//         startdate: Date.parse(formData.startDate) || null
//       };

//       const res = await api.post("/bookings/create", payload, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (res.data.success) {
//         setEnquiries((prev) => [res.data.booking, ...prev]);
//         resetForm();
//         setActiveTab("enquiries");
//         showNotification("Enquiry submitted successfully");
//       }
//     } catch (err) {
//       console.error(err);
//       showNotification("Failed to submit enquiry", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       packageName: "",
//       destination: "",
//       enquiryType: "Package Enquiry",
//       message: "",
//       startDate: "",
//       duration: 1,
//       adults: 1,
//       children: 0,
//       seniors: 0,
//       budget: "",
//       generatedBy: {
//         fullName: user?.name || "",
//         email: user?.email || "",
//         phone: "",
//       },
//     });
//     setFormErrors({});
//   };

//   const toggleEnquiryExpand = (enquiryId) => {
//     setExpandedEnquiries((prev) => {
//       const newSet = new Set(prev);
//       newSet.has(enquiryId) ? newSet.delete(enquiryId) : newSet.add(enquiryId);
//       return newSet;
//     });
//   };

//   const deleteEnquiry = async (enquiryId) => {
//     if (!window.confirm("Are you sure you want to delete this enquiry?")) return;
//     try {
//       const res = await axios.delete(`${axios_URL}/bookings/delete/${enquiryId}`);
//       if (res.data.success) {
//         setEnquiries((prev) => prev.filter((enq) => enq._id !== enquiryId));
//         showNotification("Enquiry deleted successfully");
//       }
//     } catch (err) {
//       console.error(err);
//       showNotification("Failed to delete enquiry", "error");
//     }
//   };

//   const getTravelersInfo = (enquiry) => {
//     const total = (enquiry.adults || 0) + (enquiry.children || 0) + (enquiry.seniors || 0);
//     const breakdown = [
//       enquiry.adults > 0 && `${enquiry.adults} adult${enquiry.adults > 1 ? "s" : ""}`,
//       enquiry.children > 0 && `${enquiry.children} child${enquiry.children > 1 ? "ren" : ""}`,
//       enquiry.seniors > 0 && `${enquiry.seniors} senior${enquiry.seniors > 1 ? "s" : ""}`,
//     ]
//       .filter(Boolean)
//       .join(", ");

//     return { total, breakdown };
//   };

//   const getStatusColor = (status) => {
//     const statusLower = (status || '').toLowerCase();
//     switch (statusLower) {
//       case "pending":
//         return { background: "#fff3cd", color: "#856404" };
//       case "responded":
//         return { background: "#d4edda", color: "#155724" };
//       case "closed":
//         return { background: "#f8d7da", color: "#721c24" };
//       case "confirmed":
//         return { background: "#d1ecf1", color: "#0c5460" };
//       default:
//         return { background: "#e2e3e5", color: "#383d41" };
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     const d = new Date(dateString);
//     if (isNaN(d.getTime())) return "Invalid date";
//     return d.toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const stats = {
//     pending: enquiries.filter((enq) => enq.status?.toLowerCase() === "pending").length,
//     responded: enquiries.filter((enq) => enq.status?.toLowerCase() === "responded").length,
//     confirmed: enquiries.filter((enq) => enq.status?.toLowerCase() === "confirmed").length,
//     closed: enquiries.filter((enq) => enq.status?.toLowerCase() === "closed").length,
//   };

//  const filteredEnquiries = enquiries.filter((enq) => {
//   const search = searchTerm.toLowerCase().trim();

//   const matchesSearch =
//     enq?.packageName?.toLowerCase().includes(search) ||
//     enq?.destination?.toLowerCase().includes(search) ||
//     enq?.enquiryType?.toLowerCase().includes(search) ||
//     enq?.message?.toLowerCase().includes(search) ||
//     enq?.name?.toLowerCase().includes(search) ||
//     enq?.fullName?.toLowerCase().includes(search) || // ✅ correct key used
//     enq?.bookingId?.toLowerCase().includes(search)


//   const matchesFilter =
//     filterStatus === "all" ||
//     enq?.status?.toLowerCase() === filterStatus.toLowerCase();

//   return matchesSearch && matchesFilter;
// });
//   if (enquiriesLoading)
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         minHeight: '400px',
//         background: 'white',
//         borderRadius: '12px'
//       }}>
//         <div style={{ textAlign: 'center' }}>
//           <div style={{
//             width: '50px',
//             height: '50px',
//             border: '4px solid #f3f3f3',
//             borderTop: '4px solid #007bff',
//             borderRadius: '50%',
//             animation: 'spin 1s linear infinite',
//             margin: '0 auto 20px'
//           }}></div>
//           <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>Loading your enquiries...</p>
//         </div>
//       </div>
//     );

//   return (
//     <div style={{
//       fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//       backgroundColor: '#f8f9fa',
//       minHeight: '60vh',
//       color: '#333',
//       lineHeight: '1.6',
//       borderRadius: '8px',
//       overflow: 'hidden',
//       position: 'relative',
//       boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
//       maxHeight: '95vh',
//       display: 'flex',
//       flexDirection: 'column'
//     }}>
//       <style>
//         {`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//           @keyframes fadeIn {
//             from { opacity: 0; transform: translateY(10px); }
//             to { opacity: 1; transform: translateY(0); }
//           }
//           @keyframes slideIn {
//             from { opacity: 0; transform: translateX(100px); }
//             to { opacity: 1; transform: translateX(0); }
//           }
//           @keyframes pulse {
//             0%, 100% { transform: scale(1); }
//             50% { transform: scale(1.05); }
//           }
//         `}
//       </style>

//       {/* Notification */}
//       {notification && (
//         <div style={{
//           position: 'fixed',
//           top: '20px',
//           right: '20px',
//           padding: '15px 20px',
//           borderRadius: '8px',
//           color: 'white',
//           fontWeight: '600',
//           zIndex: 10001,
//           animation: 'slideIn 0.3s ease',
//           background: notification.type === 'error' ? '#dc3545' : '#28a745',
//           boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
//           maxWidth: '300px'
//         }}>
//           <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//             <span>{notification.type === 'error' ? '❌' : '✅'}</span>
//             {notification.message}
//           </div>
//           <button
//             onClick={() => setNotification(null)}
//             style={{
//               position: 'absolute',
//               top: '5px',
//               right: '8px',
//               background: 'none',
//               border: 'none',
//               color: 'white',
//               cursor: 'pointer',
//               fontSize: '20px',
//               lineHeight: '1'
//             }}
//           >
//             ×
//           </button>
//         </div>
//       )}

//       {/* Header */}
//       <header style={{
//         background: 'linear-gradient(135deg, #007bff, #0056b3)',
//         color: 'white',
//         padding: '20px 30px',
//         flexShrink: 0
//       }}>
//         <div style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           flexWrap: 'wrap',
//           gap: '20px'
//         }}>
//           <div>
//             <h2 style={{
//               fontSize: '1.8rem',
//               margin: '0 0 5px 0'
//             }}>My Travel Enquiries</h2>
//             <p style={{
//               margin: 0,
//               opacity: 0.9,
//               fontSize: '0.9rem'
//             }}>Track and manage your travel enquiries • Welcome, {user?.name || 'Guest'}</p>
//           </div>
//           <div style={{
//             display: 'flex',
//             gap: '10px',
//             flexWrap: 'wrap'
//           }}>
//             <button
//               style={{
//                 padding: '10px 20px',
//                 border: '2px solid rgba(255,255,255,0.3)',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 fontWeight: '600',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 fontFamily: 'inherit',
//                 fontSize: '0.9rem',
//                 background: activeTab === 'enquiries' ? 'rgba(255,255,255,0.2)' : 'transparent',
//                 color: 'white',
//                 transition: 'all 0.2s ease'
//               }}
//               onClick={() => setActiveTab('enquiries')}
//               onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
//               onMouseLeave={(e) => e.target.style.background = activeTab === 'enquiries' ? 'rgba(255,255,255,0.2)' : 'transparent'}
//             >
//               📋 View Enquiries ({enquiries.length})
//             </button>
//             <button
//               style={{
//                 padding: '10px 20px',
//                 border: '2px solid rgba(255,255,255,0.3)',
//                 borderRadius: '8px',
//                 cursor: 'pointer',
//                 fontWeight: '600',
//                 display: 'flex',
//                 alignItems: 'center',
//                 gap: '8px',
//                 fontFamily: 'inherit',
//                 fontSize: '0.9rem',
//                 background: activeTab === 'new-enquiry' ? 'rgba(255,255,255,0.2)' : 'transparent',
//                 color: 'white',
//                 transition: 'all 0.2s ease'
//               }}
//               onClick={() => setActiveTab('new-enquiry')}
//               onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
//               onMouseLeave={(e) => e.target.style.background = activeTab === 'new-enquiry' ? 'rgba(255,255,255,0.2)' : 'transparent'}
//             >
//               ➕ New Enquiry
//             </button>
//             {onClose && (
//               <button
//                 style={{
//                   padding: '10px 15px',
//                   border: '2px solid rgba(255,255,255,0.3)',
//                   borderRadius: '8px',
//                   cursor: 'pointer',
//                   fontWeight: '600',
//                   fontFamily: 'inherit',
//                   fontSize: '0.9rem',
//                   background: 'transparent',
//                   color: 'white',
//                   transition: 'all 0.2s ease'
//                 }}
//                 onClick={onClose}
//                 onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.2)'}
//                 onMouseLeave={(e) => e.target.style.background = 'transparent'}
//               >
//                 ✕
//               </button>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Main Content - Scrollable */}
//       <main style={{ 
//         padding: '30px', 
//         overflow: 'auto',
//         flex: 1
//       }}>
//         {activeTab === 'enquiries' ? (
//           <div>
//             {/* Stats Cards */}
//             <div style={{
//               display: 'grid',
//               gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
//               gap: '20px',
//               marginBottom: '30px'
//             }}>
//               <div style={{
//                 background: 'white',
//                 padding: '20px',
//                 borderRadius: '12px',
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                 textAlign: 'center',
//                 transition: 'transform 0.2s ease',
//                 cursor: 'pointer'
//               }}
//                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//               >
//                 <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#007bff' }}>
//                   {enquiries.length}
//                 </div>
//                 <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Total Enquiries</div>
//               </div>
//               <div style={{
//                 background: 'white',
//                 padding: '20px',
//                 borderRadius: '12px',
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                 textAlign: 'center',
//                 transition: 'transform 0.2s ease',
//                 cursor: 'pointer'
//               }}
//                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//               >
//                 <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#856404' }}>
//                   {stats.pending || 0}
//                 </div>
//                 <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Pending</div>
//               </div>
//               <div style={{
//                 background: 'white',
//                 padding: '20px',
//                 borderRadius: '12px',
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                 textAlign: 'center',
//                 transition: 'transform 0.2s ease',
//                 cursor: 'pointer'
//               }}
//                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//               >
//                 <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0c5460' }}>
//                   {stats.confirmed || 0}
//                 </div>
//                 <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Confirmed</div>
//               </div>
//               <div style={{
//                 background: 'white',
//                 padding: '20px',
//                 borderRadius: '12px',
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                 textAlign: 'center',
//                 transition: 'transform 0.2s ease',
//                 cursor: 'pointer'
//               }}
//                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//               >
//                 <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#155724' }}>
//                   {stats.responded || 0}
//                 </div>
//                 <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Responded</div>
//               </div>
//               <div style={{
//                 background: 'white',
//                 padding: '20px',
//                 borderRadius: '12px',
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//                 textAlign: 'center',
//                 transition: 'transform 0.2s ease',
//                 cursor: 'pointer'
//               }}
//                 onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
//                 onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
//               >
//                 <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#721c24' }}>
//                   {stats.closed || 0}
//                 </div>
//                 <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>Closed</div>
//               </div>
//             </div>

//             {/* Search and Filter */}
//             <div style={{
//               background: 'white',
//               padding: '20px',
//               borderRadius: '12px',
//               boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
//               marginBottom: '30px'
//             }}>
//               <div style={{
//                 display: 'flex',
//                 gap: '20px',
//                 alignItems: 'center',
//                 flexWrap: 'wrap'
//               }}>
//                 <div style={{
//                   flex: '1',
//                   position: 'relative',
//                   minWidth: '250px'
//                 }}>
//                   <input
//                     type="text"
//                     placeholder="Search by package, destination, Name, BookingId..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     style={{
//                       width: '100%',
//                       padding: '12px 15px 12px 40px',
//                       border: '2px solid #e9ecef',
//                       borderRadius: '8px',
//                       fontSize: '0.9rem',
//                       fontFamily: 'inherit',
//                       outline: 'none',
//                       transition: 'border-color 0.2s ease',
//                       boxSizing: 'border-box'
//                     }}
//                     onFocus={(e) => e.target.style.borderColor = '#007bff'}
//                     onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
//                   />
//                   <span style={{
//                     position: 'absolute',
//                     left: '15px',
//                     top: '50%',
//                     transform: 'translateY(-50%)',
//                     color: '#6c757d'
//                   }}>🔍</span>
//                 </div>
//                 <div>
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                     style={{
//                       padding: '12px 15px',
//                       border: '2px solid #e9ecef',
//                       borderRadius: '8px',
//                       background: 'white',
//                       cursor: 'pointer',
//                       fontSize: '0.9rem',
//                       fontFamily: 'inherit',
//                       outline: 'none',
//                       transition: 'border-color 0.2s ease'
//                     }}
//                     onFocus={(e) => e.target.style.borderColor = '#007bff'}
//                     onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
//                   >
//                     <option value="all">All Statuses</option>
//                     <option value="pending">Pending</option>
//                     <option value="confirmed">Confirmed</option>
//                     <option value="responded">Responded</option>
//                     <option value="closed">Closed</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             {/* Enquiries Grid */}
//             {filteredEnquiries.length > 0 ? (
//               <div style={{
//                 display: 'grid',
//                 gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
//                 gap: '25px'
//               }}>
//                 {filteredEnquiries.map((enquiry) => {
//                   const isExpanded = expandedEnquiries.has(enquiry._id);
//                   const travelersInfo = getTravelersInfo(enquiry);
//                   return (
//                     <div key={enquiry._id} style={{
//                       background: 'white',
//                       borderRadius: '12px',
//                       boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
//                       overflow: 'hidden',
//                       transition: 'transform 0.2s ease, box-shadow 0.2s ease'
//                     }}
//                       onMouseEnter={(e) => {
//                         e.currentTarget.style.transform = 'translateY(-2px)';
//                         e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
//                       }}
//                       onMouseLeave={(e) => {
//                         e.currentTarget.style.transform = 'translateY(0)';
//                         e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
//                       }}
//                     >
//                       <div style={{ padding: '20px' }}>
//                         {/* Header */}
//                         <div style={{
//                           display: 'flex',
//                           justifyContent: 'space-between',
//                           alignItems: 'flex-start',
//                           marginBottom: '15px'
//                         }}>
//                           <div style={{ flex: 1 }}>
//                             <div style={{
//                               fontSize: '1.2rem',
//                               fontWeight: '700',
//                               color: '#2c3e50',
//                               marginBottom: '5px'
//                             }}>
//                               📦 {enquiry.packageName || "Untitled Package"}
//                             </div>
//                             <div style={{
//                               color: '#6c757d',
//                               fontSize: '0.9rem',
//                               marginBottom: '5px'
//                             }}>
//                               📍 {enquiry.destination || "No destination"}
//                             </div>
//                             <div style={{
//                               fontSize: '0.8rem',
//                               color: '#007bff',
//                               fontWeight: '600',
//                               marginBottom: '8px'
//                             }}>
//                               {enquiry.enquiryType}
//                             </div>
//                             <div style={{
//                               fontSize: '0.8rem',
//                               color: '#28a745',
//                               fontWeight: '600',
//                               display: 'flex',
//                               alignItems: 'center',
//                               gap: '4px'
//                             }}>
//                               👤 Generated by: {enquiry.fullName || "Unknown"}
//                             </div>
//                           </div>
//                           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
//                             {user?.isAdmin ? (
//                               <select
//                                 value={enquiry.status}
//                                 onChange={(e) => updateStatus(enquiry._id, e.target.value)}
//                                 onClick={(e) => e.stopPropagation()}
//                                 style={{
//                                   padding: '5px 10px',
//                                   borderRadius: '20px',
//                                   fontSize: '0.8rem',
//                                   fontWeight: '600',
//                                   textTransform: 'uppercase',
//                                   border: 'none',
//                                   cursor: 'pointer',
//                                   ...getStatusColor(enquiry.status)
//                                 }}
//                               >
//                                 <option value="Pending">Pending</option>
//                                 <option value="Responded">Responded</option>
//                                 <option value="Confirmed">Confirmed</option>
//                                 <option value="Closed">Closed</option>
//                               </select>
//                             ) : (
//                               <span style={{
//                                 padding: '5px 12px',
//                                 borderRadius: '20px',
//                                 fontSize: '0.8rem',
//                                 fontWeight: '600',
//                                 textTransform: 'uppercase',
//                                 ...getStatusColor(enquiry.status)
//                               }}>
//                                 {enquiry.status}
//                               </span>
//                             )}

//                             {user?.isAdmin && (
//                               <button
//                                 onClick={(e) => {
//                                   e.stopPropagation();
//                                   deleteEnquiry(enquiry._id);
//                                 }}
//                                 style={{
//                                   background: '#dc3545',
//                                   color: 'white',
//                                   border: 'none',
//                                   borderRadius: '4px',
//                                   padding: '4px 8px',
//                                   fontSize: '0.7rem',
//                                   cursor: 'pointer',
//                                   transition: 'background 0.2s ease'
//                                 }}
//                                 onMouseEnter={(e) => e.target.style.background = '#c82333'}
//                                 onMouseLeave={(e) => e.target.style.background = '#dc3545'}
//                               >
//                                 🗑️ Delete
//                               </button>
//                             )}
//                           </div>
//                         </div>

//                         {/* Message Preview */}
//                         <div style={{ marginBottom: '15px' }}>
//                           <p style={{
//                             margin: '0',
//                             fontSize: '0.9rem',
//                             color: '#495057',
//                             lineHeight: '1.5',
//                             display: '-webkit-box',
//                             WebkitLineClamp: isExpanded ? 'unset' : 2,
//                             WebkitBoxOrient: 'vertical',
//                             overflow: 'hidden'
//                           }}>
//                             {enquiry.message || "No message provided"}
//                           </p>
//                         </div>

//                         {/* Basic Info */}
//                         <div style={{
//                           display: 'grid',
//                           gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
//                           gap: '15px',
//                           marginBottom: '15px',
//                           padding: '15px',
//                           background: '#f8f9fa',
//                           borderRadius: '8px'
//                         }}>
//                           <div style={{ textAlign: 'center' }}>
//                             <div style={{
//                               fontSize: '0.8rem',
//                               color: '#6c757d',
//                               textTransform: 'uppercase'
//                             }}>BOOKING ID</div>
//                             <div style={{
//                               fontWeight: '600',
//                               color: '#2c3e50',
//                               fontSize: '0.85rem'
//                             }}>{enquiry.bookingId || 'N/A'}</div>
//                           </div>
//                           <div style={{ textAlign: 'center' }}>
//                             <div style={{
//                               fontSize: '0.8rem',
//                               color: '#6c757d',
//                               textTransform: 'uppercase'
//                             }}>Duration</div>
//                             <div style={{
//                               fontWeight: '600',
//                               color: '#2c3e50'
//                             }}>{enquiry.duration} days</div>
//                           </div>
//                           <div style={{ textAlign: 'center' }}>
//                             <div style={{
//                               fontSize: '0.8rem',
//                               color: '#6c757d',
//                               textTransform: 'uppercase'
//                             }}>Travelers</div>
//                             <div style={{
//                               fontWeight: '600',
//                               color: '#2c3e50'
//                             }}>{travelersInfo.total}</div>
//                             <div style={{
//                               fontSize: '0.7rem',
//                               color: '#6c757d'
//                             }}>{travelersInfo.breakdown}</div>
//                           </div>
//                           <div style={{ textAlign: 'center' }}>
//                             <div style={{
//                               fontSize: '0.8rem',
//                               color: '#6c757d',
//                               textTransform: 'uppercase'
//                             }}>Budget</div>
//                             <div style={{
//                               fontWeight: '600',
//                               color: '#28a745'
//                             }}>₹{enquiry.budget || 'N/A'}</div>
//                           </div>
//                         </div>

//                         {/* Expanded Details */}
//                         {isExpanded && (
//                           <div style={{
//                             borderTop: '1px solid #f8f9fa',
//                             marginTop: '15px',
//                             paddingTop: '15px',
//                             animation: 'fadeIn 0.3s ease'
//                           }}>
//                             {/* Contact Details */}
//                             <div style={{ marginBottom: '20px' }}>
//                               <h4 style={{
//                                 fontSize: '0.9rem',
//                                 fontWeight: '600',
//                                 color: '#2c3e50',
//                                 marginBottom: '10px'
//                               }}>Generated By</h4>
//                               <div style={{
//                                 background: '#e8f5e8',
//                                 padding: '15px',
//                                 borderRadius: '8px',
//                                 borderLeft: '4px solid #28a745'
//                               }}>
//                                 <div style={{
//                                   display: 'grid',
//                                   gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
//                                   gap: '15px'
//                                 }}>
//                                   <div>
//                                     <div style={{
//                                       fontSize: '0.8rem',
//                                       color: '#155724',
//                                       fontWeight: '600'
//                                     }}>Full Name</div>
//                                     <div style={{ color: '#155724' }}>
//                                       {enquiry.fullName || "Unknown"}
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <div style={{
//                                       fontSize: '0.8rem',
//                                       color: '#155724',
//                                       fontWeight: '600'
//                                     }}>Email</div>
//                                     <div style={{ color: '#155724', wordBreak: 'break-word' }}>
//                                       {enquiry.email || "N/A"}
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <div style={{
//                                       fontSize: '0.8rem',
//                                       color: '#155724',
//                                       fontWeight: '600'
//                                     }}>Phone</div>
//                                     <div style={{ color: '#155724' }}>
//                                       {enquiry.mobile || "N/A"}
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Travel Details */}
//                             <div style={{ marginBottom: '20px' }}>
//                               <h4 style={{
//                                 fontSize: '0.9rem',
//                                 fontWeight: '600',
//                                 color: '#2c3e50',
//                                 marginBottom: '10px'
//                               }}>Travel Details</h4>
//                               <div style={{
//                                 display: 'grid',
//                                 gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
//                                 gap: '15px'
//                               }}>
//                                 <div>
//                                   <div style={{
//                                     fontSize: '0.8rem',
//                                     color: '#6c757d',
//                                     textTransform: 'uppercase'
//                                   }}>Package ID</div>
//                                   <div style={{
//                                     fontWeight: '600',
//                                     color: '#2c3e50'
//                                   }}>{enquiry.packageId || 'N/A'}</div>
//                                 </div>
//                                 <div>
//                                   <div style={{
//                                     fontSize: '0.8rem',
//                                     color: '#6c757d',
//                                     textTransform: 'uppercase'
//                                   }}>Start Date</div>
//                                   <div style={{
//                                     fontWeight: '600',
//                                     color: '#2c3e50'
//                                   }}>{enquiry.startDate ? new Date(enquiry.startDate).toLocaleDateString() : 'Not specified'}</div>
//                                 </div>
//                                 <div>
//                                   <div style={{
//                                     fontSize: '0.8rem',
//                                     color: '#6c757d',
//                                     textTransform: 'uppercase'
//                                   }}>Adults</div>
//                                   <div style={{
//                                     fontWeight: '600',
//                                     color: '#2c3e50'
//                                   }}>{enquiry.adults || 1}</div>
//                                 </div>
//                                 <div>
//                                   <div style={{
//                                     fontSize: '0.8rem',
//                                     color: '#6c757d',
//                                     textTransform: 'uppercase'
//                                   }}>Children</div>
//                                   <div style={{
//                                     fontWeight: '600',
//                                     color: '#2c3e50'
//                                   }}>{enquiry.children || 0}</div>
//                                 </div>
//                                 <div>
//                                   <div style={{
//                                     fontSize: '0.8rem',
//                                     color: '#6c757d',
//                                     textTransform: 'uppercase'
//                                   }}>Senior Citizens</div>
//                                   <div style={{
//                                     fontWeight: '600',
//                                     color: '#dc3545'
//                                   }}>{enquiry.seniors || 0}</div>
//                                 </div>
//                               </div>
//                             </div>

//                             {/* Special Requirements Alert */}
//                             {enquiry.seniors > 0 && (
//                               <div style={{
//                                 background: '#fff3cd',
//                                 border: '1px solid #ffeaa7',
//                                 borderRadius: '8px',
//                                 padding: '12px',
//                                 marginBottom: '15px',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '10px'
//                               }}>
//                                 <span style={{ fontSize: '1.2rem' }}>👴</span>
//                                 <div>
//                                   <div style={{ fontWeight: '600', color: '#856404' }}>
//                                     Special Assistance Required
//                                   </div>
//                                   <div style={{ fontSize: '0.8rem', color: '#856404' }}>
//                                     This group includes {enquiry.seniors} senior citizen{enquiry.seniors > 1 ? 's' : ''} who may need special assistance
//                                   </div>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Response */}
//                             {enquiry.response && (
//                               <div style={{ marginBottom: '20px' }}>
//                                 <h4 style={{
//                                   fontSize: '0.9rem',
//                                   fontWeight: '600',
//                                   color: '#2c3e50',
//                                   marginBottom: '10px'
//                                 }}>Our Response</h4>
//                                 <div style={{
//                                   background: '#e8f4fd',
//                                   padding: '15px',
//                                   borderRadius: '8px',
//                                   borderLeft: '4px solid #007bff'
//                                 }}>
//                                   <p style={{
//                                     margin: '0',
//                                     color: '#495057',
//                                     fontSize: '0.9rem',
//                                     lineHeight: '1.5'
//                                   }}>{enquiry.response}</p>
//                                 </div>
//                               </div>
//                             )}

//                             {/* Timestamps */}
//                             <div style={{
//                               display: 'flex',
//                               justifyContent: 'space-between',
//                               fontSize: '0.8rem',
//                               color: '#6c757d',
//                               paddingTop: '15px',
//                               borderTop: '1px solid #f8f9fa',
//                               flexWrap: 'wrap',
//                               gap: '10px'
//                             }}>
//                               <div>Created: {formatDate(enquiry.createdAt)}</div>
//                               {enquiry.updatedAt !== enquiry.createdAt && (
//                                 <div>Updated: {formatDate(enquiry.updatedAt)}</div>
//                               )}
//                             </div>
//                           </div>
//                         )}
//                       </div>

//                       {/* Action Button */}
//                       <div style={{
//                         padding: '15px 20px',
//                         background: '#f8f9fa',
//                         display: 'flex',
//                         justifyContent: 'center'
//                       }}>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             toggleEnquiryExpand(enquiry._id);
//                           }}
//                           style={{
//                             padding: '8px 20px',
//                             border: 'none',
//                             borderRadius: '6px',
//                             cursor: 'pointer',
//                             fontWeight: '600',
//                             fontSize: '0.9rem',
//                             fontFamily: 'inherit',
//                             background: '#007bff',
//                             color: 'white',
//                             transition: 'background-color 0.2s ease'
//                           }}
//                           onMouseEnter={(e) => e.target.style.background = '#0056b3'}
//                           onMouseLeave={(e) => e.target.style.background = '#007bff'}
//                         >
//                           {isExpanded ? '👆 Show Less' : '👇 Show More'}
//                         </button>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div style={{
//                 textAlign: 'center',
//                 padding: '60px 20px',
//                 color: '#6c757d',
//                 background: 'white',
//                 borderRadius: '12px',
//                 boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
//               }}>
//                 <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
//                 <h3 style={{
//                   fontSize: '1.5rem',
//                   marginBottom: '10px',
//                   color: '#2c3e50'
//                 }}>No enquiries found</h3>
//                 <p>Try adjusting your search or filter criteria</p>
//                 <button
//                   onClick={() => setActiveTab('new-enquiry')}
//                   style={{
//                     padding: '12px 25px',
//                     background: '#007bff',
//                     color: 'white',
//                     border: 'none',
//                     borderRadius: '8px',
//                     cursor: 'pointer',
//                     fontWeight: '600',
//                     marginTop: '15px',
//                     transition: 'background 0.2s ease'
//                   }}
//                   onMouseEnter={(e) => e.target.style.background = '#0056b3'}
//                   onMouseLeave={(e) => e.target.style.background = '#007bff'}
//                 >
//                   Create New Enquiry
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           /* New Enquiry Form */
//           <div>
//             <div style={{
//               background: 'white',
//               borderRadius: '12px',
//               boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
//               overflow: 'hidden'
//             }}>
//               <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
//                 {/* Contact Information */}
//                 <div style={{ marginBottom: '30px' }}>
//                   <h3 style={{
//                     fontSize: '1.2rem',
//                     color: '#2c3e50',
//                     marginBottom: '20px',
//                     paddingBottom: '10px',
//                     borderBottom: '2px solid #f8f9fa',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px'
//                   }}>👤 Contact Information</h3>
//                   <div style={{
//                     display: 'grid',
//                     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//                     gap: '20px'
//                   }}>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Full Name *</label>
//                       <input
//                         type="text"
//                         name="generatedBy.fullName"
//                         value={formData.generatedBy.fullName}
//                         onChange={handleInputChange}
//                         style={{
//                           padding: '12px 15px',
//                           border: `2px solid ${formErrors.generatedBy?.fullName ? '#dc3545' : '#e9ecef'}`,
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease'
//                         }}
//                         placeholder="Enter your full name"
//                         required
//                         onFocus={(e) => !formErrors.generatedBy?.fullName && (e.target.style.borderColor = '#007bff')}
//                         onBlur={(e) => !formErrors.generatedBy?.fullName && (e.target.style.borderColor = '#e9ecef')}
//                       />
//                       {formErrors.generatedBy?.fullName && (
//                         <span style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px' }}>
//                           {formErrors.generatedBy.fullName}
//                         </span>
//                       )}
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Email Address *</label>
//                       <input
//                         type="email"
//                         name="generatedBy.email"
//                         value={formData.generatedBy.email}
//                         onChange={handleInputChange}
//                         style={{
//                           padding: '12px 15px',
//                           border: `2px solid ${formErrors.generatedBy?.email ? '#dc3545' : '#e9ecef'}`,
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease'
//                         }}
//                         placeholder="Enter your email address"
//                         required
//                         onFocus={(e) => !formErrors.generatedBy?.email && (e.target.style.borderColor = '#007bff')}
//                         onBlur={(e) => !formErrors.generatedBy?.email && (e.target.style.borderColor = '#e9ecef')}
//                       />
//                       {formErrors.generatedBy?.email && (
//                         <span style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px' }}>
//                           {formErrors.generatedBy.email}
//                         </span>
//                       )}
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Phone Number *</label>
//                       <input
//                         type="tel"
//                         name="generatedBy.phone"
//                         value={formData.generatedBy.phone}
//                         onChange={handleInputChange}
//                         style={{
//                           padding: '12px 15px',
//                           border: `2px solid ${formErrors.generatedBy?.phone ? '#dc3545' : '#e9ecef'}`,
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease'
//                         }}
//                         placeholder="Enter your phone number"
//                         required
//                         onFocus={(e) => !formErrors.generatedBy?.phone && (e.target.style.borderColor = '#007bff')}
//                         onBlur={(e) => !formErrors.generatedBy?.phone && (e.target.style.borderColor = '#e9ecef')}
//                       />
//                       {formErrors.generatedBy?.phone && (
//                         <span style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px' }}>
//                           {formErrors.generatedBy.phone}
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Package Information */}
//                 <div style={{ marginBottom: '30px' }}>
//                   <h3 style={{
//                     fontSize: '1.2rem',
//                     color: '#2c3e50',
//                     marginBottom: '20px',
//                     paddingBottom: '10px',
//                     borderBottom: '2px solid #f8f9fa',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px'
//                   }}>📦 Package Information</h3>
//                   <div style={{
//                     display: 'grid',
//                     gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//                     gap: '20px'
//                   }}>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Start Date (Tentetive)</label>
//                       <input
//                         type="date"
//                         name="startDate"
//                         value={formData.startDate}
//                         onChange={handleInputChange}
//                         min="0"
//                         max="20"
//                         style={{
//                           padding: '12px 15px',
//                           border: '2px solid #e9ecef',
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#007bff'}
//                         onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
//                       />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Package Name *</label>
//                       <select
//                         name="packageName"
//                         value={formData.packageName}
//                         onChange={handleInputChange}
//                         style={{
//                           padding: '12px 15px',
//                           border: `2px solid ${formErrors.packageName ? '#dc3545' : '#e9ecef'}`,
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease',
//                           backgroundColor: '#fff',
//                           cursor: 'pointer'
//                         }}
//                         required
//                         onFocus={(e) => !formErrors.packageName && (e.target.style.borderColor = '#007bff')}
//                         onBlur={(e) => !formErrors.packageName && (e.target.style.borderColor = '#e9ecef')}
//                       >
//                         <option value="" disabled>Select package type</option>
//                         <option value="CUSTOM">CUSTOM</option>
//                         <option value="FAMILY">FAMILY</option>
//                         <option value="GROUP">GROUP</option>
//                         <option value="CITY">CITY</option>
//                         <option value="ADVENTURE">ADVENTURE</option>
//                       </select>
//                       {formErrors.packageName && (
//                         <span style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px' }}>
//                           {formErrors.packageName}
//                         </span>
//                       )}
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Destination *</label>
//                       <input
//                         type="text"
//                         name="destination"
//                         value={formData.destination}
//                         onChange={handleInputChange}
//                         style={{
//                           padding: '12px 15px',
//                           border: `2px solid ${formErrors.destination ? '#dc3545' : '#e9ecef'}`,
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease'
//                         }}
//                         placeholder="Enter destination"
//                         required
//                         onFocus={(e) => !formErrors.destination && (e.target.style.borderColor = '#007bff')}
//                         onBlur={(e) => !formErrors.destination && (e.target.style.borderColor = '#e9ecef')}
//                       />
//                       {formErrors.destination && (
//                         <span style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px' }}>
//                           {formErrors.destination}
//                         </span>
//                       )}
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Enquiry Type</label>
//                       <select
//                         name="enquiryType"
//                         value={formData.enquiryType}
//                         onChange={handleInputChange}
//                         style={{
//                           padding: '12px 15px',
//                           border: '2px solid #e9ecef',
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           background: 'white',
//                           transition: 'border-color 0.2s ease',
//                           cursor: 'pointer'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#007bff'}
//                         onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
//                       >
//                         <option value="Package Enquiry">Package Enquiry</option>
//                         <option value="Custom Request">Custom Request</option>
//                         <option value="Price Enquiry">Price Enquiry</option>
//                         <option value="Availability Check">Availability Check</option>
//                         <option value="General Query">General Query</option>
//                       </select>
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Adults</label>
//                       <input
//                         type="number"
//                         name="adults"
//                         value={formData.adults}
//                         onChange={handleInputChange}
//                         min="0"
//                         max="20"
//                         style={{
//                           padding: '12px 15px',
//                           border: '2px solid #e9ecef',
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#007bff'}
//                         onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
//                       />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Children (2-17 years)</label>
//                       <input
//                         type="number"
//                         name="children"
//                         value={formData.children}
//                         onChange={handleInputChange}
//                         min="0"
//                         max="20"
//                         style={{
//                           padding: '12px 15px',
//                           border: '2px solid #e9ecef',
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#007bff'}
//                         onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
//                       />
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Senior Citizens (60+ years)</label>
//                       <input
//                         type="number"
//                         name="seniors"
//                         value={formData.seniors}
//                         onChange={handleInputChange}
//                         min="0"
//                         max="20"
//                         style={{
//                           padding: '12px 15px',
//                           border: '2px solid #e9ecef',
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease'
//                         }}
//                         onFocus={(e) => e.target.style.borderColor = '#007bff'}
//                         onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
//                       />
//                       <div style={{
//                         fontSize: '0.8rem',
//                         color: '#6c757d',
//                         marginTop: '4px'
//                       }}>
//                         Special assistance may be provided
//                       </div>
//                     </div>
//                     <div style={{ display: 'flex', flexDirection: 'column' }}>
//                       <label style={{
//                         fontWeight: '600',
//                         color: '#2c3e50',
//                         marginBottom: '8px',
//                         fontSize: '0.9rem'
//                       }}>Budget (₹)</label>
//                       <input
//                         type="number"
//                         name="budget"
//                         value={formData.budget}
//                         onChange={handleInputChange}
//                         min="0"
//                         step="1000"
//                         style={{
//                           padding: '12px 15px',
//                           border: '2px solid #e9ecef',
//                           borderRadius: '8px',
//                           fontSize: '0.9rem',
//                           fontFamily: 'inherit',
//                           outline: 'none',
//                           transition: 'border-color 0.2s ease'
//                         }}
//                         placeholder="Enter your budget"
//                         onFocus={(e) => e.target.style.borderColor = '#007bff'}
//                         onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
//                       />
//                     </div>
//                   </div>

//                   {/* Travelers Summary */}
//                   {(formData.adults > 0 || formData.children > 0 || formData.seniors > 0) && (
//                     <div style={{
//                       marginTop: '20px',
//                       padding: '15px',
//                       background: '#f8f9fa',
//                       borderRadius: '8px',
//                       border: '2px solid #e9ecef'
//                     }}>
//                       <div style={{ fontWeight: '600', marginBottom: '8px', color: '#2c3e50' }}>
//                         Travelers Summary:
//                       </div>
//                       <div style={{ color: '#495057' }}>
//                         Total {Number(formData.adults) + Number(formData.children) + Number(formData.seniors)} travelers
//                         {formData.adults > 0 && ` • ${formData.adults} Adult${formData.adults > 1 ? 's' : ''}`}
//                         {formData.children > 0 && ` • ${formData.children} Child${formData.children > 1 ? 'ren' : ''}`}
//                         {formData.seniors > 0 && ` • ${formData.seniors} Senior Citizen${formData.seniors > 1 ? 's' : ''}`}
//                       </div>
//                       {formData.seniors > 0 && (
//                         <div style={{
//                           marginTop: '8px',
//                           padding: '8px',
//                           background: '#fff3cd',
//                           borderRadius: '4px',
//                           fontSize: '0.9rem',
//                           color: '#856404'
//                         }}>
//                           ℹ️ Note: Senior citizens in your group may receive special assistance and discounts
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {/* Message */}
//                 <div style={{ marginBottom: '30px' }}>
//                   <h3 style={{
//                     fontSize: '1.2rem',
//                     color: '#2c3e50',
//                     marginBottom: '20px',
//                     paddingBottom: '10px',
//                     borderBottom: '2px solid #f8f9fa',
//                     display: 'flex',
//                     alignItems: 'center',
//                     gap: '8px'
//                   }}>💬 Your Message</h3>
//                   <div style={{ display: 'flex', flexDirection: 'column' }}>
//                     <label style={{
//                       fontWeight: '600',
//                       color: '#2c3e50',
//                       marginBottom: '8px',
//                       fontSize: '0.9rem'
//                     }}>Detailed Message *</label>
//                     <textarea
//                       name="message"
//                       value={formData.message}
//                       onChange={handleInputChange}
//                       rows="6"
//                       style={{
//                         padding: '15px',
//                         border: `2px solid ${formErrors.message ? '#dc3545' : '#e9ecef'}`,
//                         borderRadius: '8px',
//                         fontSize: '0.9rem',
//                         fontFamily: 'inherit',
//                         outline: 'none',
//                         resize: 'vertical',
//                         minHeight: '150px',
//                         transition: 'border-color 0.2s ease'
//                       }}
//                       placeholder="Please describe your requirements, questions, or any specific requests. If you have senior citizens, mention any special needs or accessibility requirements..."
//                       required
//                       onFocus={(e) => !formErrors.message && (e.target.style.borderColor = '#007bff')}
//                       onBlur={(e) => !formErrors.message && (e.target.style.borderColor = '#e9ecef')}
//                     />
//                     {formErrors.message && (
//                       <span style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '4px' }}>
//                         {formErrors.message}
//                       </span>
//                     )}
//                     <div style={{
//                       fontSize: '0.8rem',
//                       color: '#6c757d',
//                       marginTop: '8px'
//                     }}>
//                       Be as specific as possible to help us provide the best assistance. Mention any special requirements for senior citizens or accessibility needs.
//                     </div>
//                   </div>
//                 </div>

//                 {/* Form Actions */}
//                 <div style={{
//                   display: 'flex',
//                   gap: '15px',
//                   justifyContent: 'flex-end',
//                   paddingTop: '20px',
//                   borderTop: '1px solid #f8f9fa',
//                   flexWrap: 'wrap'
//                 }}>
//                   <button
//                     type="button"
//                     onClick={resetForm}
//                     disabled={loading}
//                     style={{
//                       padding: '12px 25px',
//                       border: '2px solid #6c757d',
//                       borderRadius: '8px',
//                       cursor: loading ? 'not-allowed' : 'pointer',
//                       fontWeight: '600',
//                       fontSize: '0.9rem',
//                       fontFamily: 'inherit',
//                       background: 'white',
//                       color: '#6c757d',
//                       transition: 'all 0.2s ease',
//                       opacity: loading ? 0.6 : 1
//                     }}
//                     onMouseEnter={(e) => !loading && (e.target.style.background = '#6c757d', e.target.style.color = 'white')}
//                     onMouseLeave={(e) => !loading && (e.target.style.background = 'white', e.target.style.color = '#6c757d')}
//                   >
//                     🔄 Reset Form
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setActiveTab('enquiries')}
//                     disabled={loading}
//                     style={{
//                       padding: '12px 25px',
//                       border: '2px solid #ffc107',
//                       borderRadius: '8px',
//                       cursor: loading ? 'not-allowed' : 'pointer',
//                       fontWeight: '600',
//                       fontSize: '0.9rem',
//                       fontFamily: 'inherit',
//                       background: 'white',
//                       color: '#ffc107',
//                       transition: 'all 0.2s ease',
//                       opacity: loading ? 0.6 : 1
//                     }}
//                     onMouseEnter={(e) => !loading && (e.target.style.background = '#ffc107', e.target.style.color = 'white')}
//                     onMouseLeave={(e) => !loading && (e.target.style.background = 'white', e.target.style.color = '#ffc107')}
//                   >
//                     👁️ View Enquiries
//                   </button>
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     style={{
//                       padding: '12px 25px',
//                       border: 'none',
//                       borderRadius: '8px',
//                       cursor: loading ? 'not-allowed' : 'pointer',
//                       fontWeight: '600',
//                       fontSize: '0.9rem',
//                       fontFamily: 'inherit',
//                       background: loading ? '#6c757d' : '#28a745',
//                       color: 'white',
//                       transition: 'all 0.2s ease',
//                       display: 'flex',
//                       alignItems: 'center',
//                       gap: '8px',
//                       minWidth: '140px',
//                       justifyContent: 'center'
//                     }}
//                     onMouseEnter={(e) => !loading && (e.target.style.background = '#218838')}
//                     onMouseLeave={(e) => !loading && (e.target.style.background = '#28a745')}
//                   >
//                     {loading ? (
//                       <>
//                         <div style={{
//                           width: '16px',
//                           height: '16px',
//                           border: '2px solid #ffffff40',
//                           borderTop: '2px solid #ffffff',
//                           borderRadius: '50%',
//                           animation: 'spin 1s linear infinite'
//                         }}></div>
//                         Submitting...
//                       </>
//                     ) : (
//                       <>
//                         📤 Submit Enquiry
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </form>

//               {/* Help Section */}
//               <div style={{
//                 background: 'linear-gradient(135deg, #e3f2fd, #f8f9fa)',
//                 padding: '25px 30px',
//                 borderTop: '1px solid #e9ecef'
//               }}>
//                 <h4 style={{
//                   color: '#2c3e50',
//                   marginBottom: '15px',
//                   fontSize: '1.1rem',
//                   display: 'flex',
//                   alignItems: 'center',
//                   gap: '8px'
//                 }}>💡 Need Help?</h4>
//                 <div style={{
//                   display: 'grid',
//                   gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
//                   gap: '20px'
//                 }}>
//                   <div style={{
//                     padding: '15px',
//                     background: 'white',
//                     borderRadius: '8px',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//                   }}>
//                     <h5 style={{ color: '#007bff', marginBottom: '8px', fontSize: '0.9rem' }}>📞 Call Us</h5>
//                     <p style={{ margin: 0, fontSize: '0.9rem', color: '#495057' }}>
//                       Speak with our travel experts<br />
//                       <strong>+91 1800-XXX-XXXX</strong><br />
//                       <small>Mon-Fri 9AM-6PM</small>
//                     </p>
//                   </div>
//                   <div style={{
//                     padding: '15px',
//                     background: 'white',
//                     borderRadius: '8px',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//                   }}>
//                     <h5 style={{ color: '#28a745', marginBottom: '8px', fontSize: '0.9rem' }}>💬 Live Chat</h5>
//                     <p style={{ margin: 0, fontSize: '0.9rem', color: '#495057' }}>
//                       Get instant help from our team<br />
//                       <strong>Available 24/7</strong><br />
//                       <small>Average response: 2 mins</small>
//                     </p>
//                   </div>
//                   <div style={{
//                     padding: '15px',
//                     background: 'white',
//                     borderRadius: '8px',
//                     boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
//                   }}>
//                     <h5 style={{ color: '#ffc107', marginBottom: '8px', fontSize: '0.9rem' }}>📧 Email Support</h5>
//                     <p style={{ margin: 0, fontSize: '0.9rem', color: '#495057' }}>
//                       Send us detailed queries<br />
//                       <strong>support@travelapp.com</strong><br />
//                       <small>Response within 4 hours</small>
//                     </p>
//                   </div>
//                 </div>
//                 <div style={{
//                   marginTop: '20px',
//                   padding: '15px',
//                   background: 'rgba(255, 193, 7, 0.1)',
//                   borderRadius: '8px',
//                   borderLeft: '4px solid #ffc107'
//                 }}>
//                   <p style={{
//                     margin: 0,
//                     fontSize: '0.9rem',
//                     color: '#495057',
//                     lineHeight: '1.5'
//                   }}>
//                     <strong>💡 Pro Tip:</strong> For faster processing, please include your travel dates,
//                     number of travelers, and specific requirements in your enquiry. If you have senior
//                     citizens in your group, mention any special assistance needs.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// export default MyEnquiry;

import React from 'react'

function MyEnquiry() {
  return (
    <div>
      
    </div>
  )
}

export default MyEnquiry
