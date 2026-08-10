import React, { createContext, useContext, useState } from "react";

// Static reference rates (INR base). A live-rate API is a natural follow-up —
// kept static and clearly labeled so nothing here silently drifts from reality.
const RATES = { INR: 1, USD: 1 / 83, EUR: 1 / 90, GBP: 1 / 105, AED: 1 / 22.6 };
const SYMBOLS = { INR: "₹", USD: "$", EUR: "€", GBP: "£", AED: "AED " };

const CurrencyContext = createContext(null);

export const CurrencyProvider = ({ children }) => {
  const [currency, setCurrency] = useState(localStorage.getItem("currency") || "INR");

  const changeCurrency = (code) => {
    setCurrency(code);
    localStorage.setItem("currency", code);
  };

  const convert = (amountInInr) => +(amountInInr * RATES[currency]).toFixed(2);
  const format = (amountInInr) =>
    `${SYMBOLS[currency]}${convert(amountInInr).toLocaleString(currency === "INR" ? "en-IN" : "en-US")}`;

  return (
    <CurrencyContext.Provider value={{ currency, changeCurrency, convert, format, currencies: Object.keys(RATES) }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used inside CurrencyProvider");
  return ctx;
};
