import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const HoursDropdown = () => {
  const hours = [
    { day: "Monday", open: 11, close: 19 },
    { day: "Tuesday", open: 11, close: 19 },
    { day: "Wednesday", open: 11, close: 19 },
    { day: "Thursday", open: 11, close: 19 },
    { day: "Friday", open: 11, close: 19 },
    { day: "Saturday", open: 11, close: 19 },
    { day: "Sunday", open: 11, close: 19 },
  ];

  // Get today's day index (Mon=0, Sun=6)
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  const today = hours[todayIndex];

  const now = new Date();
  const currentHour = now.getHours();
  const isOpen = currentHour >= today.open && currentHour < today.close;

  const [open, setOpen] = useState(false);

  // Get remaining days (excluding today)
  const remainingDays = [
    ...hours.slice(todayIndex + 1),
    ...hours.slice(0, todayIndex),
  ];

  return (
    <div style={styles.container}>
      {/* Dropdown arrow */}
      <div style={styles.dropdownHeader} onClick={() => setOpen(!open)}>
        <span>{open ? "Hide Full Hours" : "See Full Hours"}</span>
        {open ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {/* Open/Close status */}
      <p
        style={{
          color: isOpen ? "green" : "red",
          fontWeight: "bold",
          marginBottom: "10px",
        }}
      >
        {isOpen ? "🟢 Open Now" : "🔴 Closed"}
      </p>

      <table style={styles.table}>
        <tbody>
          {/* Always show today's hours */}
          <tr style={styles.todayRow}>
            <td style={styles.dayCell}>
              <strong>{today.day}</strong>
            </td>
            <td style={styles.timeCell}>
              {formatTime(today.open)} - {formatTime(today.close)}
            </td>
          </tr>

          {/* Toggle for other days */}
          {open &&
            remainingDays.map((h, i) => (
              <tr key={i}>
                <td style={styles.dayCell}>{h.day}</td>
                <td style={styles.timeCell}>
                  {formatTime(h.open)} - {formatTime(h.close)}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

function formatTime(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const formatted = hour % 12 === 0 ? 12 : hour % 12;
  return `${formatted}:00 ${suffix}`;
}

const styles = {
  container: {
    padding: "16px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    background: "#fff",
    width: "280px",
    boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "18px",
    color: "#2c3e50",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "10px",
  },
  dayCell: {
    padding: "6px 8px",
    fontWeight: "500",
    color: "#34495e",
  },
  timeCell: {
    padding: "6px 8px",
    textAlign: "right",
    color: "#555",
  },
  todayRow: {
    background: "#f0f8ff",
    fontWeight: "bold",
  },
  dropdownHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    padding: "6px 4px",
    fontWeight: "bold",
    color: "#007BFF",
    borderTop: "1px solid #eee",
  },
};

export default HoursDropdown;
