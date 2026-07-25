import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Services from "./Pages/Services.jsx";
import Header from "./Components/Header/Header";
import PageNotFound from "./Pages/PageNotFound";

import Kerala from "./Pages/Explore-Packages/Kerala";
import Rajasthan from "./Pages/Explore-Packages/Rajasthan";
import Sikkim from "./Pages/Explore-Packages/Sikkim";
import Kashmir from "./Pages/Explore-Packages/Kashmir";
import Rishikesh from "./Pages/Explore-Packages/Rishikesh";
import Andman from "./Pages/Explore-Packages/Andman";
import Agra from "./Pages/Explore-Packages/Agra";
import Udaipur from "./Pages/Explore-Packages/Udaipur";
import Ladakh from "./Pages/Explore-Packages/Ladakh";
import Ooty from "./Pages/Explore-Packages/Ooty";

import BookingForm from "./Components/BookingForm/BookingForm.jsx";
import MyBookings from "./Components/BookingForm/MyBookings.jsx";
import UserProfilePopup from "./Components/Profile/Profile.jsx";
import UploadImagesByTitle from "./Components/ImageUpload.jsx";

import PackageDetail from "./Pages/Packages/PackageDetail.jsx";
import BaseTourPage from "./Pages/Packages/BaseTourPage.jsx";
import ItineraryPage from "./Pages/ItineraryPage.jsx";

import Login from "./Pages/Login.jsx";
import { PackageProvider } from "./Context/PackageContext.jsx";
import Profile, {
  BookingsTab,
  EnquiriesTab,
  OverviewTab,
  SavedTab,
  SettingsTab,
} from "./Components/ProfileDropdown/Profile.jsx";
import ProfilePopup from "./Components/Profile/Profile.jsx";
import AdminInquiries from "./Pages/Admin/AdminInquiries.jsx";
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
const Start = lazy(() => import("./Pages/Start"));
const CustomTourP = lazy(() => import("./Pages/Packages/CustomTourP"));
const AdventureTourP = lazy(() => import("./Pages/Packages/AdventureTourP"));
const FamilyTourP = lazy(() => import("./Pages/Packages/FamilyTourP"));
const GroupTourP = lazy(() => import("./Pages/Packages/GroupTourP"));
const CityTourP = lazy(() => import("./Pages/Packages/CityTourP"));

const Manali = lazy(() => import("./Pages/Explore-Packages/Manali"));
// const Goa = lazy(() => import("./Pages/Explore-Packages/Goa"));
const Maharashtra = lazy(() => import("./Pages/Domestic/Maharashtra"));

const App = () => {
  return (
    <>
      {/* <Header /> */}

      <PackageProvider>
        <Suspense fallback={<div className="loading">Loading...</div>}>
          <Routes>
            {/* Landing */}
            <Route path="/" element={<Start />} />
            <Route path="/services" element={<Services />} />
            {/* <Route path="/login" element={<Login />} /> */}

            {/* Tour Categories */}
            {/* <Route path="/tourcard" element={<BaseTourPage />} /> */}
            <Route path="/tourcard/:type" element={<BaseTourPage />} />

            <Route path="/adventure-tours" element={<AdventureTourP />} />
            <Route path="/family-tours" element={<FamilyTourP />} />
            <Route path="/group-tours" element={<GroupTourP />} />
            <Route path="/city-tours" element={<CityTourP />} />
            <Route path="/custom-tours" element={<CustomTourP />} />

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

            {/* Explore Packages */}
            {/* <Route path="/manali-Packages" element={<Manali />} />
            <Route path="/goa-Packages" element={<Goa />} />
            <Route path="/kerala-Packages" element={<Kerala />} />
            <Route path="/rajasthan-Packages" element={<Rajasthan />} />
            <Route path="/sikkim-Packages" element={<Sikkim />} />
            <Route path="/kashmir-Packages" element={<Kashmir />} />
            <Route path="/rishikesh-Packages" element={<Rishikesh />} />
            <Route path="/andaman-Packages" element={<Andman />} />
            <Route path="/agra-Packages" element={<Agra />} />
            <Route path="/udaipur-Packages" element={<Udaipur />} />
            <Route path="/ladakh-Packages" element={<Ladakh />} />
            <Route path="/ooty-Packages" element={<Ooty />} /> */}

            {/* Booking */}
            <Route path="/booking/:packageId" element={<BookingForm />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/my-profile" element={<UserProfilePopup />} />

            {/* Admin Upload */}
            <Route path="/update" element={<UploadImagesByTitle />} />

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
