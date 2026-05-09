import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { path: '/dashboard', label: '📊 ภาพรวมสวน', category: 'Main' },
    { path: '/inventory', label: '🌳 จัดการต้นทุเรียน', category: 'Management' },
    { path: '/activities/fertilizer', label: '🧪 ระบบปุ๋ย', category: 'Care' },
    { path: '/activities/pest-disease', label: '🦠 โรค & แมลง', category: 'Care' },
    { path: '/production/yield', label: '🌸 การออกดอก/ผล', category: 'Production' },
    { path: '/fertilizer-stock', label: '💰 ปุ๋ย/ราคา', category: 'Production' },
    { path: '/reports', label: '📈 รายงานสรุป', category: 'Analytics' },
  ];

  return (
    <aside style={{
      width: '260px',
      background: '#1a2a3a',
      color: '#fff',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h2 style={{ color: '#2ecc71', margin: 0 }}>สวนทุเรียน (เตย)</h2>
        <small style={{ opacity: 0.6 }}>Expert Management System</small>
      </div>

      <nav>
        {menuItems.map((item) => (
          <NavLink 
            key={item.path}
            to={item.path}
            style={({ isActive }) => ({
              display: 'block',
              padding: '12px 15px',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              marginBottom: '5px',
              backgroundColor: isActive ? '#2ecc71' : 'transparent',
              transition: '0.3s'
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
        <p style={{ fontSize: '12px', margin: 0 }}>Status: Online</p>
        <p style={{ fontSize: '12px', margin: 0 }}>v1.0.0 (Stable)</p>
      </div>
    </aside>
  );
};

export default Sidebar;