import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './Context/AuthContext.jsx'
import './index.css'
import App from './App.jsx'
// import StayRoutes from './Pages/Hotel/Stayroutes.jsx';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        {/* <StayRoutes/> */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);