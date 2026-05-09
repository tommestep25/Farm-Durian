import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; 
import { treeService } from '../../services/treeService'; 

const FertilizerLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTreeId = queryParams.get('treeId') || ''; 
  
  const [history, setHistory] = useState([]); // สำหรับเก็บประวัติจาก Database
  const [log, setLog] = useState({
    treeId: initialTreeId, 
    date: new Date().toISOString().split('T')[0],
    formula: '15-15-15',
    type: 'เคมี',
    amount: '',
    target: 'เร่งใบ'
  });

  // --- 1. ฟังก์ชันดึงประวัติการใส่ปุ๋ย ---
const loadHistory = async () => {
  if (initialTreeId) {
    try {
      // ดึงค่า URL มาจากตัวแปรที่ตั้งไว้ หรือถ้าไม่มีให้ใช้ localhost
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      
      const response = await fetch(`${API_BASE_URL}/api/fertilizer/history?treeId=${initialTreeId}`);
      
      const data = await response.json();
      setHistory(data || []);
    } catch (error) {
      console.error("Failed to load fertilizer history:", error);
    }
  }
};

  useEffect(() => {
    loadHistory();
    if (initialTreeId) {
      setLog(prev => ({ ...prev, treeId: initialTreeId }));
    }
  }, [initialTreeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...log,
        amount: Number(log.amount)
      };

      const result = await treeService.addFertilizer(dataToSubmit);
      
      if (result) {
        alert("✅ บันทึกข้อมูลปุ๋ยสำเร็จ!");
        loadHistory(); // รีโหลดประวัติให้เห็นข้อมูลใหม่ทันที
        // หากต้องการค้างไว้หน้าเดิมให้เอา navigate ออก หรือใช้ alert แล้วค่อยไป
      }
    } catch (error) {
      console.error("Error saving fertilizer log:", error);
      alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div style={{ maxWidth: '700px', margin: '10px auto', padding: '0 10px' }}>
      <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#27ae60', borderBottom: '2px solid #27ae60', paddingBottom: '10px', marginTop: 0, fontSize: '1.2rem' }}>
          🧪 บันทึกการใส่ปุ๋ย
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '15px' }}>
          {/* ปรับ Grid ให้เป็น 1 คอลัมน์ในมือถือ */}
          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontWeight: 'bold' }}>รหัสต้นทุเรียน:</label>
              <input type="text" value={log.treeId} style={{...inputStyle, background: '#f9f9f9'}} disabled />
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>วันที่ใส่:</label>
              <input type="date" value={log.date} style={inputStyle} onChange={(e) => setLog({...log, date: e.target.value})} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth <= 768 ? '1fr' : '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontWeight: 'bold' }}>สูตรปุ๋ย:</label>
              <input type="text" value={log.formula} style={inputStyle} onChange={(e) => setLog({...log, formula: e.target.value})} />
            </div>
            <div>
              <label style={{ fontWeight: 'bold' }}>ปริมาณ (กก./ต้น):</label>
              <input type="number" step="0.1" value={log.amount} style={inputStyle} onChange={(e) => setLog({...log, amount: e.target.value})} required />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>เป้าหมาย:</label>
            <select style={{...inputStyle, height: '45px'}} value={log.target} onChange={(e) => setLog({...log, target: e.target.value})}>
              <option value="เร่งใบ">เร่งใบ</option>
              <option value="เร่งดอก">เร่งดอก</option>
              <option value="ขยายผล">ขยายผล</option>
            </select>
          </div>

          <button type="submit" style={{...buttonStyle, height: '50px', fontSize: '18px'}}>บันทึกข้อมูลปุ๋ย</button>
        </form>
      </div>

      {/* --- ส่วนแสดงประวัติย้อนหลัง --- */}
      <div style={{ marginTop: '30px', background: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px', display: 'flex', justifyContent: 'space-between' }}>
          <span>📅 ประวัติล่าสุด (ต้น {initialTreeId})</span>
          <span style={{ fontSize: '14px', color: '#7f8c8d' }}>ทั้งหมด {history.length} รายการ</span>
        </h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee', color: '#7f8c8d', fontSize: '14px' }}>
                <th style={{ padding: '10px' }}>วันที่</th>
                <th style={{ padding: '10px' }}>สูตร</th>
                <th style={{ padding: '10px' }}>ปริมาณ</th>
                <th style={{ padding: '10px' }}>เป้าหมาย</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? history.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f9f9f9', fontSize: '14px' }}>
                  <td style={{ padding: '10px' }}>{item.date}</td>
                  <td style={{ padding: '10px' }}>{item.formula}</td>
                  <td style={{ padding: '10px' }}>{item.amount} กก.</td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '2px 8px', borderRadius: '4px', fontSize: '12px' }}>
                      {item.target}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#ccc' }}>ยังไม่มีประวัติการใส่ปุ๋ยสำหรับต้นนี้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Styles (เหมือนเดิม)
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc', marginTop: '5px', boxSizing: 'border-box' };
const buttonStyle = { padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' };

export default FertilizerLog;