// Sidebar.jsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false); // เพิ่ม State สำหรับเปิด-ปิดเมนู

  const menuItems = [
    { path: '/dashboard', label: '📊 ภาพรวมสวน' },
    { path: '/inventory', label: '🌳 จัดการต้นทุเรียน' },
    { path: '/activities/fertilizer', label: '🧪 ระบบปุ๋ย' },
    { path: '/activities/pest-disease', label: '🦠 โรค & แมลง' },
    { path: '/production/yield', label: '🌸 การออกดอก/ผล' },
    { path: '/fertilizer-stock', label: '💰 ปุ๋ย/ราคา' },
    { path: '/reports', label: '📈 รายงานสรุป' },
  ];

  return (
    <>
      {/* ปุ่ม Hamburger สำหรับมือถือ */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed', top: '15px', left: '15px', zIndex: 10001,
          padding: '10px', borderRadius: '8px', background: '#2ecc71', color: '#fff',
          border: 'none', display: window.innerWidth <= 768 ? 'block' : 'none'
        }}
      >
        {isOpen ? '✖ ปิด' : '☰ เมนู'}
      </button>

      <aside style={{
        width: '260px',
        background: '#1a2a3a',
        color: '#fff',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        position: window.innerWidth <= 768 ? 'fixed' : 'relative',
        left: isOpen || window.innerWidth > 768 ? '0' : '-260px',
        transition: '0.3s',
        height: '100vh',
        zIndex: 10000
      }}>
        <div style={{ marginBottom: '40px', textAlign: 'center', marginTop: '40px' }}>
          <h2 style={{ color: '#2ecc71', margin: 0 }}>สวนทุเรียน (เตย)</h2>
          <small style={{ opacity: 0.6 }}>Expert Management System</small>
        </div>

        <nav>
          {menuItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)} // กดแล้วปิดเมนูอัตโนมัติ
              style={({ isActive }) => ({
                display: 'block', padding: '12px 15px', color: '#fff',
                textDecoration: 'none', borderRadius: '8px', marginBottom: '5px',
                backgroundColor: isActive ? '#2ecc71' : 'transparent'
              })}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      
      {/* Overlay พื้นหลังดำเวลาเปิดเมนูในมือถือ */}
      {isOpen && window.innerWidth <= 768 && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999 }} 
        />
      )}
    </>
  );
};

export default Sidebar;