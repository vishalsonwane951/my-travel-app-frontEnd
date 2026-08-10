import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const WHATSAPP_NUMBER = "919999999999"; // TODO: replace with the real business number

const WhatsAppButton = () => {
  const message = encodeURIComponent("Hi Desivdesi! I'd like help planning a trip.");
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 999,
        width: 56, height: 56, borderRadius: "50%", background: "#25D366",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 14px rgba(0,0,0,0.25)", color: "#fff", fontSize: 28,
        textDecoration: "none",
      }}
    >
      <FaWhatsapp />
    </a>
  );
};

export default WhatsAppButton;
