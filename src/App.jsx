import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
/* Lazy Pages */
const HomePage = lazy(() => import("./Pages/HomePage.jsx"));
const Maharashtra = lazy(() => import("./Pages/Domestic/Maharashtra"));

const App = () => {
  return (
    <>
      {/* <Header /> */}

      <PackageProvider>
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

            {/* 404 */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </PackageProvider>
    </>
  );
};

export default App;
