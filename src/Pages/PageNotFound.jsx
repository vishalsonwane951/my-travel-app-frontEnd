import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PageNotFound() {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setVisible(false);
    navigate(-1); // goes back to previous page
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "2.5rem 2rem",
          maxWidth: "400px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#FFF3CD",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.25rem",
            fontSize: 28,
          }}
        >
          🔧
        </div>

        <h2
          style={{
            fontSize: 20,
            fontWeight: 600,
            margin: "0 0 0.5rem",
            color: "#1a1a1a",
          }}
        >
          Under Development
        </h2>

        <p
          style={{
            fontSize: 15,
            color: "#6b7280",
            margin: "0 0 1.75rem",
            lineHeight: 1.6,
          }}
        >
          This feature is currently being built.
          <br />
          We'll have it ready for you soon!
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button
            onClick={handleClose}
            style={{
              padding: "9px 24px",
              fontSize: 14,
              borderRadius: 8,
              border: "1px solid #d1d5db",
              background: "#f9fafb",
              cursor: "pointer",
              color: "#374151",
            }}
          >
            Go back
          </button>
          <button
            onClick={handleClose}
            style={{
              padding: "9px 24px",
              fontSize: 14,
              borderRadius: 8,
              border: "1px solid #f59e0b",
              background: "#fef3c7",
              cursor: "pointer",
              color: "#92400e",
              fontWeight: 600,
            }}
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
