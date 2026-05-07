import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { treeService } from '../../services/treeService';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalTrees: 0, normal: 0, risk: 0, urgent: 0 });
  const [urgentTrees, setUrgentTrees] = useState([]); // เก็บรายชื่อต้นไม้ที่มีปัญหา
  const [showModal, setShowModal] = useState(false); // State ควบคุม Pop-up
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // 1. ดึงข้อมูลสถิติจาก API
      const data = await treeService.getDashboardStats();
      if (data) setStats(data);
      
      // 2. ดึงข้อมูลต้นไม้ทั้งหมดมาเพื่อกรองเฉพาะต้นที่มีปัญหา
      // (ตรวจสอบว่าใน treeService มีฟังก์ชัน getAllTrees แล้วนะครับ)
      const allTrees = await treeService.getAllTrees(); 
      if (allTrees) {
        const filtered = allTrees.filter(t => t.status === 'URGENT');
        setUrgentTrees(filtered);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>กำลังโหลดข้อมูล...</div>;

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, color: '#0f172a' }}>🌴 ภาพรวมสวนทุเรียน</h2>
          <p style={{ color: '#64748b' }}>สรุปสถานะล่าสุดจากฐานข้อมูล</p>
        </div>
        <button onClick={fetchDashboardData} style={refreshBtnStyle}>🔄 รีเฟรชข้อมูล</button>
      </div>

      {/* 4 Cards แสดงสถิติ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <StatCard title="ต้นไม้ทั้งหมด" value={stats.totalTrees} color="#3b82f6" icon="🌳" />
        <StatCard title="ปกติ" value={stats.normal} color="#10b981" icon="✅" />
        <StatCard title="เสี่ยง" value={stats.risk} color="#f59e0b" icon="⚠️" />
        <StatCard title="ต้องดูแลด่วน" value={stats.urgent} color="#ef4444" icon="🚨" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '25px' }}>
        {/* กราฟสัดส่วน */}
        <div style={cardContainerStyle}>
          <h3 style={{ margin: '0 0 15px 0' }}>📊 สัดส่วนสถานะสุขภาพ</h3>
          <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '20px', padding: '0 40px' }}>
            <div style={{ ...barStyle, height: `${stats.totalTrees > 0 ? (stats.normal / stats.totalTrees) * 100 : 0}%`, background: '#10b981' }}></div>
            <div style={{ ...barStyle, height: `${stats.totalTrees > 0 ? (stats.risk / stats.totalTrees) * 100 : 0}%`, background: '#f59e0b' }}></div>
            <div style={{ ...barStyle, height: `${stats.totalTrees > 0 ? (stats.urgent / stats.totalTrees) * 100 : 0}%`, background: '#ef4444' }}></div>
          </div>
        </div>

        {/* กล่องแจ้งเตือน */}
        <div style={cardContainerStyle}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ef4444' }}>⚠️ แจ้งเตือนล่าสุด</h3>
          <p style={{ fontSize: '14px', color: '#64748b' }}>
            มีต้นไม้สถานะ URGENT ทั้งหมด {stats.urgent} ต้น
          </p>
          <button 
            onClick={() => setShowModal(true)} 
            style={viewAllBtnStyle}
          >
            ดูรายชื่อต้นที่มีปัญหา
          </button>
        </div>
      </div>

      {/* --- MODAL POP-UP --- */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#ef4444' }}>🚨 รายชื่อต้นที่ต้องดูแลด่วน</h3>
              <button onClick={() => setShowModal(false)} style={closeBtnStyle}>✕</button>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {urgentTrees.length > 0 ? urgentTrees.map((tree) => (
                <div 
                  key={tree.treeId} 
                  style={treeItemStyle}
                  onClick={() => navigate(`/tree-actions?treeId=${tree.treeId}`)}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#1e293b' }}>{tree.treeId}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{tree.species} | {tree.currentStage}</div>
                  </div>
                  <div style={{ color: '#ef4444', fontSize: '12px', fontWeight: 'bold' }}>ดูข้อมูล →</div>
                </div>
              )) : (
                <p style={{ textAlign: 'center', color: '#94a3b8', padding: '20px' }}>ไม่พบข้อมูลต้นไม้ที่มีปัญหา</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Components ย่อย ---
const StatCard = ({ title, value, color, icon }) => (
  <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', borderLeft: `6px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div><p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>{title}</p><h3 style={{ margin: '5px 0 0 0', fontSize: '28px' }}>{value}</h3></div>
    <span style={{ fontSize: '32px' }}>{icon}</span>
  </div>
);

// --- CSS Styles ---
const barStyle = { flex: 1, borderRadius: '8px 8px 0 0', minHeight: '5px', transition: 'height 0.5s ease' };
const cardContainerStyle = { background: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' };
const refreshBtnStyle = { padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#fff', cursor: 'pointer', fontWeight: '500' };
const viewAllBtnStyle = { width: '100%', marginTop: '20px', padding: '12px', borderRadius: '10px', border: 'none', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' };

const modalOverlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
  justifyContent: 'center', alignItems: 'center', zIndex: 1000
};

const modalContentStyle = {
  backgroundColor: '#fff', padding: '25px', borderRadius: '20px',
  width: '90%', maxWidth: '450px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
};

const treeItemStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  padding: '15px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
  borderRadius: '10px', transition: 'background 0.2s'
};

const closeBtnStyle = {
  background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#94a3b8'
};

export default DashboardPage;