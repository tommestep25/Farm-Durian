import React from 'react';

const StatBox = ({ title, value, color }) => (
  <div style={{
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    borderTop: `4px solid ${color}`
  }}>
    <h4 style={{ margin: '0 0 10px 0', color: '#7f8c8d', fontSize: '14px' }}>{title}</h4>
    <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' }}>{value}</span>
  </div>
);

export default StatBox;