import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TreeActionCenter = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const treeId = queryParams.get('treeId') || 'Unknown';

const menuItems = [
    { 
      title: 'บันทึกใส่ปุ๋ย', 
      // แก้ไข path ให้ตรงกับที่คุณใช้ใน App.js (เช่น /activities/fertilizer)
      path: `/activities/fertilizer?treeId=${treeId}`, 
      color: '#27ae60', 
      icon: '🌿 🧪' 
    },
    { 
      title: 'บันทึกโรค/แมลง', 
      // แก้ไข path ให้ตรงกับที่คุณใช้ใน App.js (เช่น /activities/pest-disease)
      path: `/activities/pest-disease?treeId=${treeId}`, 
      color: '#e74c3c', 
      icon: '🐛 🦠' 
    }
  ];

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', textAlign: 'center' }}>
<div style={{ background: '#2c3e50', padding: '30px', borderRadius: '20px', color: '#fff', marginBottom: '20px' }}>
  <h1 style={{ margin: 0, fontSize: '28px' }}>ต้นทุเรียน: <span style={{ color: '#f1c40f' }}>{treeId}</span></h1>
  <p style={{ opacity: 0.8, marginTop: '10px', fontSize: '14px' }}>สแกนจาก QR Code ประจำต้น</p>
</div>

      <div style={{ display: 'grid', gap: '15px' }}>
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            style={{
              padding: '25px',
              borderRadius: '15px',
              border: 'none',
              background: '#fff',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '18px',
              fontWeight: 'bold',
              color: item.color,
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <span>{item.icon} {item.title}</span>
            <span style={{ fontSize: '20px' }}>→</span>
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => navigate('/inventory')}
        style={{ marginTop: '30px', background: 'none', border: 'none', color: '#7f8c8d', cursor: 'pointer' }}
      >
        กลับหน้าคลังต้นไม้
      </button>
    </div>
  );
};

export default TreeActionCenter;