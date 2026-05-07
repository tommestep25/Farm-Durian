import React, { useState, useEffect } from 'react';
import { treeService } from '../../services/treeService';

const FertilizerInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [monthlyUsage, setMonthlyUsage] = useState({ totalKg: 0, estimatedCost: 0 });
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // ข้อมูลสำหรับปุ๋ยใหม่
  const [newItem, setNewItem] = useState({
    brandName: '',
    formula: '',
    pricePerKg: 0,
    stockQuantity: 0
  });

  const loadData = async () => {
    try {
      setLoading(true);
      // ดึงข้อมูลคลังปุ๋ย
      const invData = await treeService.getFertilizerInventory();
      setInventory(invData || []);
      
      // ดึงข้อมูลสรุปยอดรายเดือน (ฟังก์ชันใหม่ที่เราเพิ่มใน Backend)
      const usageData = await treeService.getMonthlyUsage();
      if (usageData && usageData.length > 0) {
        setMonthlyUsage(usageData[0]); // เอาข้อมูลเดือนล่าสุด
      }
    } catch (error) {
      console.error("Load Inventory Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddInventory = async (e) => {
    e.preventDefault();
    try {
      const result = await treeService.addFertilizerToInventory(newItem);
      if (result) {
        alert("เพิ่มข้อมูลปุ๋ยสำเร็จ!");
        setShowAddModal(false);
        loadData();
      }
    } catch (error) {
      alert("ไม่สามารถบันทึกได้");
    }
  };

  if (loading) return <div style={{ padding: '30px' }}>กำลังโหลดข้อมูลคลังปุ๋ย...</div>;

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* ส่วนหัวหน้าจอ */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e293b' }}>📦 คลังปุ๋ยและต้นทุน</h2>
          <p style={{ color: '#64748b' }}>จัดการยี่ห้อ ราคา และเช็คสต็อกปุ๋ย</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={addBtnStyle}>+ เพิ่มปุ๋ยใหม่</button>
      </div>

      {/* บัตรสรุปรายเดือน (Summary Cards) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={summaryCardStyle('#27ae60')}>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>เดือนนี้ใช้ปุ๋ยไปแล้ว</p>
          <h2 style={{ margin: '5px 0 0 0' }}>{monthlyUsage.totalKg.toFixed(1)} กก.</h2>
        </div>
        <div style={summaryCardStyle('#e67e22')}>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>ต้นทุนปุ๋ยเดือนนี้ (ประมาณการ)</p>
          <h2 style={{ margin: '5px 0 0 0' }}>฿ {monthlyUsage.estimatedCost.toLocaleString()}</h2>
        </div>
      </div>

      {/* ตารางรายการปุ๋ย */}
      <div style={{ background: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
              <th style={thStyle}>ยี่ห้อ</th>
              <th style={thStyle}>สูตร</th>
              <th style={thStyle}>ราคา / กก.</th>
              <th style={thStyle}>คงเหลือในคลัง</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? inventory.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}><strong>{item.brandName}</strong></td>
                <td style={tdStyle}>{item.formula}</td>
                <td style={tdStyle}>฿{item.pricePerKg.toFixed(2)}</td>
                <td style={{ ...tdStyle, color: item.stockQuantity < 5 ? '#e74c3c' : '#2c3e50' }}>
                  {item.stockQuantity} กก.
                </td>
              </tr>
            )) : (
              <tr><td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>ยังไม่มีข้อมูลปุ๋ยในคลัง</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal สำหรับเพิ่มปุ๋ยใหม่ */}
      {showAddModal && (
        <div style={modalOverlay}>
          <form onSubmit={handleAddInventory} style={modalContent}>
            <h3 style={{ marginTop: 0, color: '#27ae60' }}>➕ เพิ่มปุ๋ยใหม่เข้าคลัง</h3>
            
            <div style={inputGroup}>
              <label>ยี่ห้อปุ๋ย:</label>
              <input required type="text" placeholder="เช่น ยารามีร่า" onChange={e => setNewItem({...newItem, brandName: e.target.value})} style={inputStyle} />
            </div>

            <div style={inputGroup}>
              <label>สูตรปุ๋ย:</label>
              <input required type="text" placeholder="เช่น 16-16-16" onChange={e => setNewItem({...newItem, formula: e.target.value})} style={inputStyle} />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
              <div style={inputGroup}>
                <label>ราคาต่อกิโลกรัม:</label>
                <input required type="number" step="0.01" onChange={e => setNewItem({...newItem, pricePerKg: parseFloat(e.target.value)})} style={inputStyle} />
              </div>
              <div style={inputGroup}>
                <label>จำนวนสต็อก (กก.):</label>
                <input required type="number" onChange={e => setNewItem({...newItem, stockQuantity: parseFloat(e.target.value)})} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button type="submit" style={saveBtnStyle}>บันทึกเข้าคลัง</button>
              <button type="button" onClick={() => setShowAddModal(false)} style={cancelBtnStyle}>ยกเลิก</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// --- Styles ---
const thStyle = { padding: '15px 20px', color: '#64748b', fontSize: '14px' };
const tdStyle = { padding: '15px 20px', fontSize: '15px' };
const summaryCardStyle = (color) => ({ background: color, color: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' });
const addBtnStyle = { background: '#27ae60', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' };
const modalOverlay = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modalContent = { background: '#fff', padding: '30px', borderRadius: '20px', width: '400px', display: 'flex', flexDirection: 'column', gap: '15px' };
const inputGroup = { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 };
const inputStyle = { padding: '10px', borderRadius: '8px', border: '1px solid #ddd' };
const saveBtnStyle = { flex: 1, padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { flex: 1, padding: '12px', background: '#f1f5f9', border: 'none', borderRadius: '10px', cursor: 'pointer' };

export default FertilizerInventory;