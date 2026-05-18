export const Badge = ({ children, color, bg }) => (
  <span style={{
    background: bg, color, fontSize: 11, fontWeight: 800,
    padding: '3px 10px', borderRadius: 20, whiteSpace: 'nowrap',
  }}>{children}</span>
);

export const Card = ({ children, style }) => (
  <div style={{
    background: '#fff', borderRadius: 18, border: '1px solid #EBEBF5',
    padding: 20, ...style,
  }}>{children}</div>
);

export const SectionTitle = ({ children }) => (
  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111', marginBottom: 20 }}>{children}</h2>
);

export const Toggle = ({ enabled, onChange, color }) => (
  <div
    onClick={onChange}
    style={{
      width: 44, height: 24, borderRadius: 12, cursor: 'pointer',
      background: enabled ? color : '#E5E7EB',
      display: 'flex', alignItems: 'center',
      padding: '0 3px', transition: 'background 0.2s',
      flexShrink: 0,
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: 9, background: '#fff',
      transform: enabled ? 'translateX(20px)' : 'translateX(0)',
      transition: 'transform 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
    }} />
  </div>
);


import React from "react";

const styles = {
  containerSpinner: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
  },
  spinner: {
    width: "35px",
    height: "35px",
    border: "4px solid #ddd",
    borderTop: "4px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  containerError: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "12px 16px",
    borderRadius: "8px",
    margin: "10px 0",
    fontWeight: "500",
  },
};

export const LoadingSpinner = () => {
  return (
    <div style={styles.containerSpinner}>
      <div style={styles.spinner} />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};


export const ErrorBanner = ({ message }) => {
  if (!message) return null;

  return (
    <div style={styles.containerError}>
      ⚠️ {message}
    </div>
  );
};
