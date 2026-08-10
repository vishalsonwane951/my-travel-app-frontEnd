import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './Context/AuthContext.jsx'
import { AdminAuthProvider } from './Context/AdminAuthContext.jsx'
import { CurrencyProvider } from './Context/CurrencyContext.jsx'
import { LanguageProvider } from './Context/LanguageContext.jsx'
import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdminAuthProvider>
          <CurrencyProvider>
            <LanguageProvider>
              <App />
            </LanguageProvider>
          </CurrencyProvider>
        </AdminAuthProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);