import React, { createContext, useContext, useState } from "react";

// Scoped intentionally: a handful of high-visibility strings (nav, CTAs,
// checkout) rather than a full site translation, which would require
// translating every page's copy — a good follow-up once content is finalized.
const STRINGS = {
  en: {
    bookNow: "Book Now", addToCart: "Add to Cart", checkout: "Checkout",
    home: "Home", packages: "Packages", myBookings: "My Bookings",
    login: "Login", logout: "Logout", search: "Search",
    applyCoupon: "Apply Coupon", payNow: "Pay Now", loyaltyPoints: "Loyalty Points",
  },
  hi: {
    bookNow: "अभी बुक करें", addToCart: "कार्ट में जोड़ें", checkout: "चेकआउट",
    home: "होम", packages: "पैकेज", myBookings: "मेरी बुकिंग",
    login: "लॉगिन", logout: "लॉगआउट", search: "खोजें",
    applyCoupon: "कूपन लागू करें", payNow: "अभी भुगतान करें", loyaltyPoints: "लॉयल्टी पॉइंट्स",
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem("language") || "en");

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key) => STRINGS[language]?.[key] || STRINGS.en[key] || key;

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, languages: Object.keys(STRINGS) }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
};
