import React, { useState, useEffect, useCallback, useRef, useContext } from "react";
import { createPortal } from "react-dom";
import { AuthContext } from "../Context/AuthContext";
import api from "../utils/api";

const LoginRegister = ({ onClose }) => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    mobile: "",
    city: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});
  const [backendError, setBackendError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loginMethod, setLoginMethod] = useState("password"); // 'password' or 'otp'

  // Lock body scroll while modal is open
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // Handle mode switch with animation
  const toggleMode = useCallback(() => {
    setAnimationDirection(isLogin ? 'to-register' : 'to-login');
    setIsAnimating(true);

    setTimeout(() => {
      setIsLogin(!isLogin);

      setFormData({
        email: "",
        password: "",
        name: "",
        mobile: "",
        city: "",
        otp: "",
      });
      setErrors({});
      setBackendError("");
      setSuccessMsg("");
      setOtpSent(false);
      setLoginMethod("password");
      setCountdown(0);

      setTimeout(() => {
        setIsAnimating(false);
        setAnimationDirection(null);
      }, 50);
    }, 400);
  }, [isLogin]);

  // Countdown timer for OTP
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
    setBackendError("");
  }, []);

  const validateLogin = useCallback(() => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";

    if (loginMethod === "password" && !formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    if (loginMethod === "otp" && otpSent && !formData.otp.trim()) {
      newErrors.otp = "OTP is required";
    } else if (loginMethod === "otp" && otpSent && formData.otp.length !== 6) {
      newErrors.otp = "OTP must be 6 digits";
    }

    return newErrors;
  }, [formData, loginMethod, otpSent]);

  const validateRegister = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Minimum 6 characters";
    if (!formData.mobile.trim()) newErrors.mobile = "Mobile is required";
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = "10 digits required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    return newErrors;
  }, [formData]);

  const handleSendOtp = useCallback(async () => {
    if (!formData.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post('/users/generate-login-otp', {
        email: formData.email
      });

      if (res.data.success) {
        alert(`Your OTP is: ${res.data.otp}`);
        setOtpSent(true);
        setLoginMethod("otp");
        setCountdown(60);
        setSuccessMsg("OTP sent successfully!");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
    } catch (err) {
      setBackendError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData.email]);

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setErrors({});
    setBackendError("");

    const validationErrors = validateLogin();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let res;
      if (loginMethod === "password") {
        res = await api.post('/users/login', {
          email: formData.email,
          password: formData.password
        });
      } else {
        res = await api.post('/users/login', {
          email: formData.email,
          otp: formData.otp
        });
      }

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      login(user, token);

      setSuccessMsg("Login successful! Redirecting...");
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setBackendError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, loginMethod, validateLogin, login, onClose]);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    setErrors({});
    setBackendError("");

    const validationErrors = validateRegister();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        city: formData.city,
      });

      if (res.data.success) {
        setSuccessMsg("Registration successful! Redirecting to login...");
        setTimeout(() => {
          toggleMode();
        }, 1500);
      }
    } catch (err) {
      setBackendError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateRegister, toggleMode]);

  const switchToPasswordLogin = useCallback(() => {
    setLoginMethod("password");
    setOtpSent(false);
    setFormData(prev => ({ ...prev, otp: "" }));
  }, []);

  // Responsive styles based on screen size
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  const getLeftPanelAnimation = () => {
    if (!isAnimating) return {};

    if (animationDirection === 'to-register') {
      return {
        transform: isMobile ? 'translateY(-100%)' : 'translateX(-100%)',
        opacity: 0,
      };
    } else if (animationDirection === 'to-login') {
      return {
        transform: isMobile ? 'translateY(100%)' : 'translateX(100%)',
        opacity: 0,
      };
    }
    return {};
  };

  const getRightPanelAnimation = () => {
    if (!isAnimating) return {};

    if (animationDirection === 'to-register') {
      return {
        transform: isMobile ? 'translateY(100%)' : 'translateX(100%)',
        opacity: 0,
      };
    } else if (animationDirection === 'to-login') {
      return {
        transform: isMobile ? 'translateY(-100%)' : 'translateX(-100%)',
        opacity: 0,
      };
    }
    return {};
  };

  const styles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      backdropFilter: "blur(12px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      padding: isMobile ? "10px" : "20px",
      animation: "fadeIn 0.4s ease",
    },
    container: {
      width: isMobile ? "100%" : isTablet ? "90%" : "1000px",
      maxWidth: "1200px",
      height: isMobile ? "90%" : isTablet ? "80%" : "650px",
      maxHeight: "90vh",
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      borderRadius: isMobile ? "20px" : "32px",
      overflow: "hidden",
      boxShadow: "0 40px 80px rgba(0, 0, 0, 0.4)",
      position: "relative",
      background: "#ffffff",
    },
    leftPanel: {
      flex: isMobile ? "none" : 1.2,
      height: isMobile ? (isLogin ? "200px" : "250px") : "100%",
      width: "100%",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      background: isLogin
        ? "linear-gradient(145deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"
        : "linear-gradient(145deg, #0093E9 0%, #80D0C7 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      order: isMobile ? (isLogin ? 1 : 2) : (isLogin ? 1 : 2),
      ...getLeftPanelAnimation(),
    },
    leftContent: {
      position: "relative",
      zIndex: 2,
      padding: isMobile ? "20px" : "40px",
      color: "white",
      textAlign: "center",
      maxWidth: isMobile ? "100%" : "400px",
      animation: isAnimating ? "none" : "slideUp 0.6s ease",
    },
    welcomeTitle: {
      fontSize: isMobile ? "1.8rem" : isTablet ? "2.2rem" : "3rem",
      fontWeight: "800",
      marginBottom: isMobile ? "10px" : "20px",
      fontFamily: "'Poppins', sans-serif",
      lineHeight: 1.2,
      textShadow: "0 4px 15px rgba(0,0,0,0.2)",
    },
    welcomeText: {
      fontSize: isMobile ? "0.9rem" : "1.1rem",
      lineHeight: 1.6,
      marginBottom: isMobile ? "20px" : "40px",
      opacity: 0.95,
      fontFamily: "'Inter', sans-serif",
      display: isMobile ? "none" : "block",
    },
    switchButton: {
      padding: isMobile ? "10px 25px" : "14px 35px",
      fontSize: isMobile ? "0.9rem" : "1rem",
      fontWeight: "600",
      color: "white",
      background: "rgba(255, 255, 255, 0.15)",
      border: "2px solid rgba(255, 255, 255, 0.5)",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      backdropFilter: "blur(10px)",
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: "0.5px",
      width: isMobile ? "100%" : "auto",
    },
    rightPanel: {
      flex: 1,
      backgroundColor: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: isMobile ? "20px" : "40px",
      position: "relative",
      height: isMobile ? (isLogin ? "calc(100% - 200px)" : "calc(100% - 250px)") : "100%",
      order: isMobile ? (isLogin ? 2 : 1) : (isLogin ? 2 : 1),
      transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
      ...getRightPanelAnimation(),
    },
    formContainer: {
      width: "100%",
      maxWidth: isMobile ? "100%" : "380px",
      animation: isAnimating ? "none" : "fadeIn 0.6s ease",
    },
    closeButton: {
      position: "absolute",
      top: isMobile ? "10px" : "20px",
      right: isMobile ? "10px" : "20px",
      width: isMobile ? "35px" : "40px",
      height: isMobile ? "35px" : "40px",
      borderRadius: "50%",
      border: "none",
      background: "#f1f5f9",
      fontSize: isMobile ? "20px" : "24px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      color: "#64748b",
      zIndex: 10,
    },
    decorativeCircle1: {
      position: "absolute",
      top: "-100px",
      right: "-100px",
      width: isMobile ? "150px" : "300px",
      height: isMobile ? "150px" : "300px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      animation: "pulse 6s ease-in-out infinite",
    },
    decorativeCircle2: {
      position: "absolute",
      bottom: "-150px",
      left: "-150px",
      width: isMobile ? "200px" : "400px",
      height: isMobile ? "200px" : "400px",
      borderRadius: "50%",
      background: "rgba(255, 255, 255, 0.1)",
      animation: "pulse 8s ease-in-out infinite reverse",
    },
    floatingIcon1: {
      position: "absolute",
      top: isMobile ? "10%" : "15%",
      left: isMobile ? "10%" : "15%",
      fontSize: isMobile ? "1.5rem" : "2.5rem",
      animation: "float 7s ease-in-out infinite",
      opacity: 0.6,
      display: isMobile ? "none" : "block",
    },
    floatingIcon2: {
      position: "absolute",
      bottom: isMobile ? "10%" : "20%",
      right: isMobile ? "10%" : "15%",
      fontSize: isMobile ? "1.8rem" : "3rem",
      animation: "float 9s ease-in-out infinite reverse",
      opacity: 0.6,
      display: isMobile ? "none" : "block",
    },
    formTitle: {
      fontSize: isMobile ? "1.8rem" : "2.2rem",
      fontWeight: "700",
      color: "#0f172a",
      marginBottom: "5px",
      fontFamily: "'Poppins', sans-serif",
    },
    formSubtitle: {
      fontSize: isMobile ? "0.85rem" : "0.95rem",
      color: "#64748b",
      marginBottom: isMobile ? "20px" : "30px",
      fontFamily: "'Inter', sans-serif",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: isMobile ? "15px" : "20px",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    label: {
      fontSize: "0.9rem",
      fontWeight: "500",
      color: "#334155",
      fontFamily: "'Inter', sans-serif",
      marginLeft: "4px",
    },
    inputWrapper: {
      position: "relative",
      width: "100%",
    },
    input: {
      width: "100%",
      padding: isMobile ? "12px 14px" : "14px 16px",
      paddingRight: "45px",
      fontSize: isMobile ? "0.9rem" : "0.95rem",
      borderRadius: "14px",
      border: "2px solid #e2e8f0",
      outline: "none",
      transition: "all 0.3s ease",
      backgroundColor: "#f8fafc",
      fontFamily: "'Inter', sans-serif",
    },
    passwordToggle: {
      position: "absolute",
      right: "12px",
      top: "50%",
      transform: "translateY(-50%)",
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#94a3b8",
      fontSize: "1.1rem",
    },
    row: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "15px" : "12px",
    },
    halfInputGroup: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: "4px",
    },
    otpContainer: {
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      gap: "10px",
      alignItems: "center",
      marginTop: "5px",
    },
    otpInput: {
      flex: 2,
      padding: isMobile ? "12px 14px" : "14px 16px",
      fontSize: isMobile ? "1rem" : "1.1rem",
      fontWeight: "600",
      letterSpacing: "4px",
      textAlign: "center",
      borderRadius: "14px",
      border: "2px solid #e2e8f0",
      outline: "none",
      backgroundColor: "#f8fafc",
      fontFamily: "'Inter', sans-serif",
    },
    otpButton: {
      flex: 1,
      padding: isMobile ? "12px" : "14px",
      fontSize: isMobile ? "0.85rem" : "0.9rem",
      fontWeight: "600",
      color: "white",
      background: "linear-gradient(145deg, #4158D0, #C850C0)",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      fontFamily: "'Inter', sans-serif",
      whiteSpace: "nowrap",
    },
    backToPasswordBtn: {
      background: "none",
      border: "none",
      color: "#4158D0",
      fontSize: "0.85rem",
      cursor: "pointer",
      textDecoration: "underline",
      marginTop: "5px",
      fontFamily: "'Inter', sans-serif",
    },
    submitButton: {
      padding: isMobile ? "14px" : "16px",
      fontSize: "1rem",
      fontWeight: "600",
      color: "white",
      background: "linear-gradient(145deg, #4158D0, #C850C0)",
      border: "none",
      borderRadius: "50px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginTop: "10px",
      fontFamily: "'Poppins', sans-serif",
      letterSpacing: "0.5px",
      boxShadow: "0 10px 25px rgba(65, 88, 208, 0.3)",
    },
    fieldError: {
      color: "#ef4444",
      fontSize: "0.8rem",
      marginTop: "4px",
      fontFamily: "'Inter', sans-serif",
    },
    errorMessage: {
      padding: isMobile ? "12px" : "14px",
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      borderRadius: "12px",
      fontSize: "0.9rem",
      marginBottom: "20px",
      fontFamily: "'Inter', sans-serif",
      border: "1px solid #fecaca",
    },
    successMessage: {
      padding: isMobile ? "12px" : "14px",
      backgroundColor: "#dcfce7",
      color: "#166534",
      borderRadius: "12px",
      fontSize: "0.9rem",
      marginBottom: "20px",
      fontFamily: "'Inter', sans-serif",
      border: "1px solid #bbf7d0",
    },
    footer: {
      marginTop: isMobile ? "20px" : "25px",
      textAlign: "center",
    },
    footerText: {
      fontSize: "0.9rem",
      color: "#64748b",
      fontFamily: "'Inter', sans-serif",
    },
    footerLink: {
      background: "none",
      border: "none",
      color: "#4158D0",
      fontWeight: "600",
      cursor: "pointer",
      marginLeft: "5px",
      fontSize: "0.9rem",
      fontFamily: "'Inter', sans-serif",
      textDecoration: "underline",
    },
  };

  return createPortal(
    <div style={styles.overlay}>
      <div style={styles.container}>
        {/* Left Panel */}
        <div style={styles.leftPanel}>
          <div style={styles.decorativeCircle1}></div>
          <div style={styles.decorativeCircle2}></div>
          <div style={styles.floatingIcon1}>✈️</div>
          <div style={styles.floatingIcon2}>🌍</div>

          <div style={styles.leftContent}>
            <h1 style={styles.welcomeTitle}>
              {isLogin ? "Welcome Back!" : "Join Us!"}
            </h1>
            <p style={styles.welcomeText}>
              {isLogin
                ? "Sign in to continue your journey with us"
                : "Create an account and start exploring amazing destinations"}
            </p>
            <button
              style={styles.switchButton}
              onClick={toggleMode}
              disabled={isAnimating}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.25)";
                e.target.style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.15)";
                e.target.style.transform = "scale(1)";
              }}
            >
              {isLogin ? "Create Account →" : "← Back to Login"}
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div style={styles.rightPanel}>
          <button
            style={styles.closeButton}
            onClick={onClose}
            onMouseEnter={(e) => {
              e.target.style.background = "#e2e8f0";
              e.target.style.transform = "rotate(90deg)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#f1f5f9";
              e.target.style.transform = "rotate(0deg)";
            }}
          >
            ×
          </button>

          <div style={styles.formContainer}>
            <h2 style={styles.formTitle}>
              {isLogin ? "Sign In" : "Create Account"}
            </h2>
            <p style={styles.formSubtitle}>
              {isLogin
                ? "Please enter your credentials"
                : "Fill in the details to get started"}
            </p>

            {backendError && (
              <div style={styles.errorMessage}>{backendError}</div>
            )}
            {successMsg && (
              <div style={styles.successMessage}>{successMsg}</div>
            )}

            {isLogin ? (
              <form style={styles.form} onSubmit={handleLogin}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <div style={styles.inputWrapper}>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        borderColor: errors.email ? "#ef4444" : focusedField === 'email' ? "#4158D0" : "#e2e8f0",
                      }}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                    />
                  </div>
                  {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
                </div>

                {loginMethod === "otp" && otpSent ? (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Enter OTP</label>
                      <div style={styles.otpContainer}>
                        <input
                          type="text"
                          name="otp"
                          placeholder="000000"
                          value={formData.otp}
                          onChange={handleChange}
                          maxLength="6"
                          style={styles.otpInput}
                        />
                        <button
                          type="button"
                          style={styles.otpButton}
                          onClick={handleSendOtp}
                          disabled={isSubmitting}
                        >
                          {countdown > 0 ? `Resend (${countdown}s)` : "Resend"}
                        </button>
                      </div>
                      {errors.otp && <span style={styles.fieldError}>{errors.otp}</span>}
                    </div>
                    <button
                      type="button"
                      style={styles.backToPasswordBtn}
                      onClick={switchToPasswordLogin}
                    >
                      ← Back to password login
                    </button>
                  </>
                ) : loginMethod === "password" ? (
                  <>
                    <div style={styles.inputGroup}>
                      <label style={styles.label}>Password</label>
                      <div style={styles.inputWrapper}>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          style={{
                            ...styles.input,
                            borderColor: errors.password ? "#ef4444" : focusedField === 'password' ? "#4158D0" : "#e2e8f0",
                          }}
                          onFocus={() => setFocusedField('password')}
                          onBlur={() => setFocusedField(null)}
                        />
                        <button
                          type="button"
                          style={styles.passwordToggle}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? "👁️" : "👁️‍🗨️"}
                        </button>
                      </div>
                      {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
                    </div>

                    <div style={styles.otpContainer}>
                      <button
                        type="button"
                        style={{
                          ...styles.otpButton,
                          background: "transparent",
                          color: "#4158D0",
                          boxShadow: "none",
                          padding: 0,
                        }}
                        onClick={handleSendOtp}
                        disabled={isSubmitting}
                      >
                        Login with OTP instead?
                      </button>
                    </div>
                  </>
                ) : null}

                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={isSubmitting}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 15px 30px rgba(65, 88, 208, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 10px 25px rgba(65, 88, 208, 0.3)";
                    }
                  }}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>
            ) : (
              <form style={styles.form} onSubmit={handleRegister}>
                <div style={styles.inputGroup}>
                  <label style={styles.label}>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      borderColor: errors.name ? "#ef4444" : focusedField === 'name' ? "#4158D0" : "#e2e8f0",
                    }}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.name && <span style={styles.fieldError}>{errors.name}</span>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      ...styles.input,
                      borderColor: errors.email ? "#ef4444" : focusedField === 'email' ? "#4158D0" : "#e2e8f0",
                    }}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                  />
                  {errors.email && <span style={styles.fieldError}>{errors.email}</span>}
                </div>

                <div style={styles.inputGroup}>
                  <label style={styles.label}>Password</label>
                  <div style={styles.inputWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password (min. 6 characters)"
                      value={formData.password}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        borderColor: errors.password ? "#ef4444" : focusedField === 'password' ? "#4158D0" : "#e2e8f0",
                      }}
                      onFocus={() => setFocusedField('password')}
                      onBlur={() => setFocusedField(null)}
                    />
                    <button
                      type="button"
                      style={styles.passwordToggle}
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                  {errors.password && <span style={styles.fieldError}>{errors.password}</span>}
                </div>

                <div style={styles.row}>
                  <div style={styles.halfInputGroup}>
                    <label style={styles.label}>Mobile</label>
                    <input
                      type="tel"
                      name="mobile"
                      placeholder="10-digit number"
                      value={formData.mobile}
                      onChange={handleChange}
                      maxLength="10"
                      style={{
                        ...styles.input,
                        borderColor: errors.mobile ? "#ef4444" : focusedField === 'mobile' ? "#4158D0" : "#e2e8f0",
                      }}
                      onFocus={() => setFocusedField('mobile')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {errors.mobile && <span style={styles.fieldError}>{errors.mobile}</span>}
                  </div>

                  <div style={styles.halfInputGroup}>
                    <label style={styles.label}>City</label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Your city"
                      value={formData.city}
                      onChange={handleChange}
                      style={{
                        ...styles.input,
                        borderColor: errors.city ? "#ef4444" : focusedField === 'city' ? "#4158D0" : "#e2e8f0",
                      }}
                      onFocus={() => setFocusedField('city')}
                      onBlur={() => setFocusedField(null)}
                    />
                    {errors.city && <span style={styles.fieldError}>{errors.city}</span>}
                  </div>
                </div>

                <button
                  type="submit"
                  style={styles.submitButton}
                  disabled={isSubmitting}
                  onMouseEnter={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "translateY(-2px)";
                      e.target.style.boxShadow = "0 15px 30px rgba(65, 88, 208, 0.4)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubmitting) {
                      e.target.style.transform = "translateY(0)";
                      e.target.style.boxShadow = "0 10px 25px rgba(65, 88, 208, 0.3)";
                    }
                  }}
                >
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </button>
              </form>
            )}

            <div style={styles.footer}>
              <p style={styles.footerText}>
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  style={styles.footerLink}
                  onClick={toggleMode}
                  disabled={isAnimating}
                >
                  {isLogin ? "Sign Up" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap');

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideLeft {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.15;
          }
        }

        @keyframes splitLeft {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(-100%); opacity: 0; }
        }

        @keyframes splitRight {
          0% { transform: translateX(0); opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        @keyframes splitUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100%); opacity: 0; }
        }

        @keyframes splitDown {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(100%); opacity: 0; }
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        input:focus {
          outline: none;
        }

        button {
          cursor: pointer;
          font-family: inherit;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 480px) {
          .otp-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>,
    document.body
  );
};

export default LoginRegister;