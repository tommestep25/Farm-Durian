// MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const MainLayout = () => {
  return (
    // เปลี่ยนจาก flex เป็น block ในมือถือเพื่อไม่ให้ Sidebar เบียดเนื้อหา
    <div style={{ 
      display: 'flex', 
      flexDirection: window.innerWidth <= 768 ? 'column' : 'row', 
      minHeight: '100vh', 
      width: '100%' 
    }}>
      <Sidebar />
      <div style={{ 
        flex: 1, 
        backgroundColor: '#f5f7fb',
        paddingBottom: '60px' // เผื่อพื้นที่ด้านล่าง
      }}>
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainLayout;