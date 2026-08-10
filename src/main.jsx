import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './Context/AuthContext.jsx'
<<<<<<< HEAD
import { AdminAuthProvider } from './Context/AdminAuthContext.jsx'
import { CurrencyProvider } from './Context/CurrencyContext.jsx'
import { LanguageProvider } from './Context/LanguageContext.jsx'
=======
>>>>>>> 26735bd518f50108e31c192ffdf5dc9e20e7f788
import './index.css'
import App from './App.jsx'
// import StayRoutes from './Pages/Hotel/Stayroutes.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
<<<<<<< HEAD
        <AdminAuthProvider>
        <CurrencyProvider>
        <LanguageProvider>
        {/* <StayRoutes/> */}
        <App />
        </LanguageProvider>
        </CurrencyProvider>
        </AdminAuthProvider>
=======
        {/* <StayRoutes/> */}
        <App />
>>>>>>> 26735bd518f50108e31c192ffdf5dc9e20e7f788
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);