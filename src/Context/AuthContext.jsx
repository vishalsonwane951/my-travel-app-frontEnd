// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // stores logged-in user info
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   useEffect(() => {
//     // Optional: fetch user details if token exists
//     if (token) {
//       const storedUser = JSON.parse(localStorage.getItem("user"));
//       if (storedUser) setUser(storedUser);
//     }
//   }, [token]);

  

//   const login = (userData, token) => {
//     setUser(userData);
//     setToken(token);
//     localStorage.setItem("token", token);
//     localStorage.setItem("user", JSON.stringify(userData));
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };

//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null); // stores logged-in user info
//   const [token, setToken] = useState(localStorage.getItem("token") || null);

//   useEffect(() => {
//     if (token) {
//       // Safe parse: check if localStorage has a valid value
//       const storedUserRaw = localStorage.getItem("user");
//       const storedUser = storedUserRaw && storedUserRaw !== "undefined" 
//         ? JSON.parse(storedUserRaw) 
//         : null;

//       if (storedUser) setUser(storedUser);
//     }
//   }, [token]);

//   const login = (userData, token) => {
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", token);
//     setUser(userData);
//     setToken(token);
//   };

 
//   const logout = () => {
//   // Clear user info
//   setUser(null);
//   setToken(null);

//   // Clear localStorage
//   localStorage.removeItem("token");
//   localStorage.removeItem("user");

//   // Close any open popups automatically
//   setShowProfile(false);
//   setShowMyBookings(false);
//   setShowBookingSuccess(false);
// };


//   return (
//     <AuthContext.Provider value={{ user, token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem("token") || null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Check if user is already authenticated on app load
//     const checkAuth = () => {
//       const storedToken = localStorage.getItem("token");
//       const storedUser = localStorage.getItem("user");

//       if (storedToken && storedUser) {
//         try {
//           const parsedUser = JSON.parse(storedUser);
//           setUser(parsedUser);
//           setToken(storedToken);
//         } catch (error) {
//           console.error("Error parsing user data:", error);
//           localStorage.removeItem("token");
//           localStorage.removeItem("user");
//         }
//       }
//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   const login = (userData, authToken) => {
//     try {
//       localStorage.setItem("token", authToken);
//       localStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);
//       setToken(authToken);
//     } catch (error) {
//       console.error("Error saving auth data:", error);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     setToken(null);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//   };

//   const value = {
//     user,
//     token,
//     login,
//     logout,
//     loading
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


// context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);


const updateUser = (updates) => {
  setUser((prev) => ({ ...prev, ...updates }));
};


  // Load user & token on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUserRaw = localStorage.getItem("user");

    if (storedToken && storedUserRaw && storedUserRaw !== "undefined") {
      const parsedUser = JSON.parse(storedUserRaw);
      setUser(parsedUser);
       console.log('parsedUser',parsedUser )
      setToken(storedToken);
    }
       

  }, []);

  const login = (userData, authToken) => {
    if (!userData._id) {
      console.error("Login failed: userData must include _id from backend");
      return;
    }
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUser(userData);
    setToken(authToken);
    console.log('userdata',userData)
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
