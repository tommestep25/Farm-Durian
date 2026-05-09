import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react'; 
import { useTreeLogic } from '../hooks/useTreeLogic';
import { HEALTH_STATUS } from '../constants/durianTypes';

const TreeCard = ({ tree }) => {
  const { calculateAge } = useTreeLogic();
  const age = calculateAge(tree.plantDate);
  const navigate = useNavigate();
  const [showQR, setShowQR] = useState(false);

  // ตั้งค่า URL สำหรับ QR Code (อย่าลืมเปลี่ยน localhost เป็น IP เครื่องตอนใช้งานจริง)
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
};

const actionUrl = `${getBaseUrl()}/tree-actions?treeId=${tree.treeId}`;

  const handleManage = (type) => {
    if (type === 'fertilizer') {
      navigate(`/activities/fertilizer?treeId=${tree.treeId}`);
    } else if (type === 'pest') {
      navigate(`/activities/pest-disease?treeId=${tree.treeId}`);
    }
  };

  return (
    <div className="tree-card" style={{
      borderLeft: `8px solid ${HEALTH_STATUS[tree.status].color}`,
      padding: '1.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      borderRadius: '15px',
      backgroundColor: '#fff',
      position: 'relative',
      transition: 'transform 0.2s'
    }}>
      {/* ส่วนหัว: ID และ สถานะ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <span style={{ background: '#eee', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', color: '#666' }}>
            #{tree.treeId}
          </span>
          <h3 style={{ margin: '5px 0', color: '#2c3e50', fontSize: '1.4rem' }}>{tree.species}</h3>
        </div>
        <div style={{ color: HEALTH_STATUS[tree.status].color, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ fontSize: '12px' }}>●</span> {HEALTH_STATUS[tree.status].label}
        </div>
      </div>
      
      {/* ส่วนรายละเอียดกลางการ์ด */}
      <div style={{ margin: '20px 0', textAlign: 'center' }}>
        <p style={{ margin: '5px 0', fontSize: '15px', color: '#2c3e50' }}>
          <strong>อายุ:</strong> {age.text}
        </p>
        <p style={{ margin: '5px 0', fontSize: '14px', color: '#7f8c8d' }}>
          <strong>ระยะ:</strong> {tree.currentStage}
        </p>
      </div>

      {/* กลุ่มปุ่มกด: แบ่งเป็น 3 คอลัมน์ให้เท่ากัน */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr 1fr', 
        gap: '8px', 
        marginTop: '15px' 
      }}>
        <button 
          onClick={() => handleManage('fertilizer')}
          style={{ ...actionBtnStyle, background: '#27ae60' }}
        >
          🧪 ใส่ปุ๋ย
        </button>
        <button 
          onClick={() => handleManage('pest')}
          style={{ ...actionBtnStyle, background: '#e74c3c' }}
        >
          🦠 พบโรค
        </button>
        <button 
          onClick={() => setShowQR(true)}
          style={{ ...actionBtnStyle, background: '#34495e' }}
        >
          📷 QR
        </button>
      </div>

      {/* --- Modal สำหรับแสดง QR Code --- */}
      {showQR && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <div id="printable-area" style={labelTemplate}>
              <h2 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '18px' }}>ทุเรียนมือโปร</h2>
              <QRCodeCanvas value={actionUrl} size={180} includeMargin={true} />
              <h1 style={{ fontSize: '40px', margin: '10px 0', color: '#333' }}>{tree.treeId}</h1>
              <p style={{ margin: 0, color: '#7f8c8d', fontSize: '12px' }}>แสกนเพื่อบันทึกการดูแล</p>
            </div>
            
            <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
              <button onClick={() => window.print()} style={printBtnStyle}>🖨️ พิมพ์ป้าย</button>
              <button onClick={() => setShowQR(false)} style={closeBtnStyle}>ปิด</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles สำหรับปุ่มและ Modal
const actionBtnStyle = {
  padding: window.innerWidth <= 768 ? '15px 5px' : '10px 5px', // เพิ่มพื้นที่กดในมือถือ
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: window.innerWidth <= 768 ? '14px' : '12px', // ขยายตัวอักษรให้อ่านง่าย
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '4px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const modalOverlay = { 
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
  background: 'rgba(0,0,0,0.7)', display: 'flex', 
  alignItems: 'center', justifyContent: 'center', zIndex: 9999 
};

const modalContent = { 
  background: '#fff', padding: '25px', borderRadius: '20px', textAlign: 'center' 
};

const labelTemplate = { 
  border: '2px dashed #ccc', padding: '20px', borderRadius: '10px', background: '#fff' 
};

const printBtnStyle = { 
  flex: 1, padding: '12px', background: '#2ecc71', color: '#fff', 
  border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' 
};

const closeBtnStyle = { 
  flex: 1, padding: '12px', background: '#95a5a6', color: '#fff', 
  border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' 
};

export default TreeCard;