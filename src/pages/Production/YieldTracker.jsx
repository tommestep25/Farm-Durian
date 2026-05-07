import React, { useState } from 'react';

const YieldTracker = () => {
  const [data, setData] = useState({
    treeId: '',
    flowerDate: '',
    fruitCount: 0,
    avgWeight: 3.5, // น้ำหนักมาตรฐานทุเรียนต่อลูก (กก.)
  });

  // สูตรคำนวณผลผลิตคาดการณ์
  const estimatedYield = (data.fruitCount * data.avgWeight).toFixed(2);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
      <h2 style={{ color: '#f39c12', borderBottom: '2px solid #f39c12', paddingBottom: '10px' }}>
        🌸 ติดตามการออกดอกและผลผลิต
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
        <div>
          <label>รหัสต้น:</label>
          <input type="text" placeholder="T001" style={inputStyle} onChange={(e) => setData({...data, treeId: e.target.value})} />
          
          <label style={{ marginTop: '15px', display: 'block' }}>จำนวนผลบนกิ่ง (ลูก):</label>
          <input type="number" style={inputStyle} onChange={(e) => setData({...data, fruitCount: e.target.value})} />
        </div>

        <div style={{ background: '#fef9e7', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
          <h4 style={{ margin: 0, color: '#7e5109' }}>ผลผลิตคาดการณ์ (Yield)</h4>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#d35400', margin: '10px 0' }}>
            {estimatedYield} <span style={{ fontSize: '18px' }}>กก.</span>
          </div>
          <p style={{ fontSize: '12px', color: '#9e7d46' }}>*คำนวณจากค่าเฉลี่ย {data.avgWeight} กก./ลูก</p>
        </div>
      </div>

      <button style={{ ...buttonStyle, background: '#f39c12', marginTop: '20px' }}>บันทึกข้อมูลผลผลิต</button>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', marginTop: '5px' };
const buttonStyle = { width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' };

export default YieldTracker;