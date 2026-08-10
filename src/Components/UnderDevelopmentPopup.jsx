// components/UnderDevelopmentModal.jsx
import React from 'react';

export default function UnderDevelopmentModal({ visible, onClose, featureName }) {
  if (!visible) return null;

  return (
    <>
      <style>{`
        .udm-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: udm-fade 0.15s ease-out;
        }
        .udm-card {
          width: 300px;
          background: #fff;
          border-radius: 16px;
          padding: 28px 24px;
          text-align: center;
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
        }
        .udm-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #FEF3C7;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 16px;
        }
        .udm-title {
          margin: 0 0 8px;
          font-size: 17px;
          font-weight: 600;
          color: #111827;
        }
        .udm-body {
          font-size: 14px;
          color: #6B7280;
          line-height: 1.5;
          margin: 0 0 20px;
        }
        .udm-button {
          width: 100%;
          background: #111827;
          color: #fff;
          border: none;
          padding: 12px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
        .udm-button:hover {
          background: #1F2937;
        }
        @keyframes udm-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="udm-overlay" onClick={onClose}>
        <div className="udm-card" onClick={(e) => e.stopPropagation()}>
          <div className="udm-icon-wrap">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#B45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          <h3 className="udm-title">Coming soon</h3>
          <p className="udm-body">
            {featureName ? `${featureName} is` : 'This feature is'} still under development.
            We're working hard to bring it to you.
          </p>
          <button className="udm-button" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </>
  );
}