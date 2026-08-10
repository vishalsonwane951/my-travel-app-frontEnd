import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";

import Services from "./Pages/Services.jsx";
import Header from "./Components/Header";
import PageNotFound from "./Pages/PageNotFound";

import BookingForm from "./Components/BookingForm/BookingForm.jsx";
import MyBookings from "./Components/BookingForm/MyBookings.jsx";
import UserProfilePopup from "./Components/Profile/Profile.jsx";
import BaseTourPage from "./Pages/Packages/BaseTourPage.jsx";
import ItineraryPage from "./Pages/ItineraryPage.jsx";

// import Login from "./Pages/Login.jsx";
import { PackageProvider } from "./Context/PackageContext.jsx";
import { AdminAuthProvider } from "./Context/AdminAuthContext.jsx";
import Profile, {
  BookingsTab,
  EnquiriesTab,
  OverviewTab,
  SavedTab,
  SettingsTab,
} from "./Components/ProfileDropdown/Profile.jsx";
import ProfilePopup from "./Components/Profile/Profile.jsx";
// import AdminInquiries from "./Pages/Admin/AdminInquiries.jsx";
import { GiOak } from "react-icons/gi";
import Goa from "./Pages/Domestic/Goa.jsx";
import GoaStay from "./Pages/Domestic/Goa/Goastay.jsx";
import GoaBeachShacks from "./Pages/Domestic/Goa/Goabeachshacks.jsx";
import LocationDetail from "./Pages/Domestic/Maharashtra/Locationdetail.jsx";
import GoaWaterSports from "./Pages/Domestic/Goa/Goawatersports.jsx";
import GoaVillasHomestays from "./Pages/Domestic/Goa/Goavillashomestays.jsx";
import Trainsearch from "./Pages/IRCTC/Trainsearch.jsx";
import SearchPage from "./Pages/Hotel/Staysearch.jsx";
import StayListPage from "./Pages/Hotel/Staylistpage.jsx";
import HotelDetailsPage from "./Pages/Hotel/Hoteldetailspage.jsx";
import BookingPage from "./Pages/Hotel/Booking.jsx";

/* Admin Panel */
import AdminLogin from "./Pages/Admin/Login/AdminLogin.jsx";
import AdminLayout from "./Components/Admin/AdminLayout.jsx";
import ProtectedAdminRoute from "./Components/Admin/ProtectedAdminRoute.jsx";
import Dashboard from "./Pages/Admin/Dashboard/Dashboard.jsx";
import Team from "./Pages/Admin/Team/Team.jsx";
import Enquiries from "./Pages/Admin/Enquiries/Enquiries.jsx";
import Finance from "./Pages/Admin/Finance/Finance.jsx";
import PackagesCms from "./Pages/Admin/Packages/PackagesCms.jsx";
import DomesticContent from "./Pages/Admin/DomesticContent/DomesticContent.jsx";
import Hotels from "./Pages/Admin/Hotels/Hotels.jsx";
import IrctcOversight from "./Pages/Admin/Irctc/IrctcOversight.jsx";
import Moderation from "./Pages/Admin/Moderation/Moderation.jsx";
import Customers from "./Pages/Admin/Customers/Customers.jsx";
import Marketing from "./Pages/Admin/Marketing/Marketing.jsx";
import Reports from "./Pages/Admin/Reports/Reports.jsx";
import Blog from "./Pages/Admin/Blog/Blog.jsx";
import Notifications from "./Pages/Admin/Notifications/Notifications.jsx";
import Support from "./Pages/Admin/Support/Support.jsx";
import AdminSettings from "./Pages/Admin/Settings/Settings.jsx";
import AuditLog from "./Pages/Admin/AuditLog/AuditLog.jsx";
import AiTripConsole from "./Pages/Admin/AiTrips/AiTripConsole.jsx";
import WhatsAppButton from "./Components/WhatsAppButton.jsx";
const Checkout = lazy(() => import("./Pages/Checkout/Checkout.jsx"));
const TripWallet = lazy(() => import("./Pages/TripWallet/TripWallet.jsx"));
const BlogList = lazy(() => import("./Pages/Blog/BlogList.jsx"));
const BlogPost = lazy(() => import("./Pages/Blog/BlogPost.jsx"));
const AgentPortal = lazy(() => import("./Pages/AgentPortal/AgentPortal.jsx"));
const LoyaltyPage = lazy(() => import("./Pages/Loyalty/LoyaltyPage.jsx"));
const GiftCardPurchase = lazy(() => import("./Pages/GiftCards/GiftCardPurchase.jsx"));
/* Lazy Pages */
const HomePage = lazy(() => import("./Pages/HomePage.jsx"));
const Maharashtra = lazy(() => import("./Pages/Domestic/Maharashtra"));

const App = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  return (
    <>
      {/* <Header /> */}

      <PackageProvider>
        <AdminAuthProvider>
          <Suspense fallback={<div className="loading">Loading...</div>}>
            <Routes>
              {/* Landing */}
              <Route path="/" element={<HomePage />} />
              <Route path="/services" element={<Services />} />
              <Route path="/tourcard/:type" element={<BaseTourPage />} />

              {/* Package Details */}
              <Route
                path="/package/:type/:location"
                element={<ItineraryPage />}
              />

              {/* Legacy redirect */}
              <Route
                path="/package/:location"
                element={<Navigate to="/services" replace />}
              />

              {/* Booking */}
              <Route path="/booking/:packageId" element={<BookingForm />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/my-profile" element={<UserProfilePopup />} />

              {/* Admin Upload */}
              {/* <Route path="/update" element={<UploadImagesByTitle />} /> */}

              {/* State Pages */}
              <Route path="/maharashtra" element={<Maharashtra />} />

              {/* Maharashtra */}
              <Route path="/Goa" element={<Goa />} />
              <Route path="/profile" element={<Profile />} />
              {/* Goa */}
              <Route path="/stay" element={<GoaStay />} />
              <Route path="/beach-shacks" element={<GoaBeachShacks />} />
              <Route path="/water-sports" element={<GoaWaterSports />} />
              <Route path="/villas-homestays" element={<GoaVillasHomestays />} />

              <Route path="/locations/:id" element={<LocationDetail />} />

              {/* <Route path="/overview" element={<OverviewTab />} /> */}
              <Route path="/bookings" element={<BookingsTab />} />
              <Route path="/enquiries" element={<EnquiriesTab />} />
              <Route path="/saved" element={<SavedTab />} />
              <Route path="/settings" element={<SettingsTab />} />

              {/*   IRCTC */}

              <Route path="/trains" element={<Trainsearch />} />
              <Route path="/hotel" element={<SearchPage />} />
              <Route path="/stays" element={<StayListPage />} />
              <Route
                path="/stays/hotel/:property_id"
                element={<HotelDetailsPage />}
              />
              <Route path="/booking" element={<BookingPage />} />
              <Route path="/checkout/:packageId" element={<Checkout />} />
              <Route path="/my-trip/:bookingId" element={<TripWallet />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/agent" element={<AgentPortal />} />
              <Route path="/loyalty" element={<LoyaltyPage />} />
              <Route path="/gift-cards" element={<GiftCardPurchase />} />

              {/* Admin Panel */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin"
                element={
                  <ProtectedAdminRoute>
                    <AdminLayout />
                  </ProtectedAdminRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route
                  path="team"
                  element={
                    <ProtectedAdminRoute roles={["superadmin"]}>
                      <Team />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="enquiries"
                  element={
                    <ProtectedAdminRoute roles={["operations", "sales"]}>
                      <Enquiries />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="finance"
                  element={
                    <ProtectedAdminRoute roles={["finance"]}>
                      <Finance />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="packages"
                  element={
                    <ProtectedAdminRoute roles={["content", "operations"]}>
                      <PackagesCms />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="domestic-content"
                  element={
                    <ProtectedAdminRoute roles={["content", "operations"]}>
                      <DomesticContent />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="hotels"
                  element={
                    <ProtectedAdminRoute roles={["operations"]}>
                      <Hotels />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="irctc"
                  element={
                    <ProtectedAdminRoute roles={["operations", "support"]}>
                      <IrctcOversight />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="moderation"
                  element={
                    <ProtectedAdminRoute roles={["content", "support"]}>
                      <Moderation />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="customers"
                  element={
                    <ProtectedAdminRoute roles={["operations", "sales", "support"]}>
                      <Customers />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="marketing"
                  element={
                    <ProtectedAdminRoute roles={["sales", "content"]}>
                      <Marketing />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="reports"
                  element={
                    <ProtectedAdminRoute roles={["operations", "finance", "sales"]}>
                      <Reports />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="blog"
                  element={
                    <ProtectedAdminRoute roles={["content"]}>
                      <Blog />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="notifications"
                  element={
                    <ProtectedAdminRoute roles={["sales", "support"]}>
                      <Notifications />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="support"
                  element={
                    <ProtectedAdminRoute roles={["support", "operations"]}>
                      <Support />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="ai-trips"
                  element={
                    <ProtectedAdminRoute roles={["operations", "content"]}>
                      <AiTripConsole />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="audit-log"
                  element={
                    <ProtectedAdminRoute roles={["superadmin"]}>
                      <AuditLog />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="settings"
                  element={
                    <ProtectedAdminRoute roles={["superadmin"]}>
                      <AdminSettings />
                    </ProtectedAdminRoute>
                  }
                />
              </Route>

              {/* 404 */}
              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </AdminAuthProvider>
      </PackageProvider>
      {!isAdminRoute && <WhatsAppButton />}
    </>
  );
};

export default App;