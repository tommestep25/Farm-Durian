import React, { useState, useEffect } from 'react';
import { treeService } from '../../services/treeService';

const PerformanceReport = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await treeService.getReportSummary();
        setReports(data || []);
      } catch (error) {
        console.error("Failed to fetch summary report:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  // คำนวณค่าทางสถิติภาพรวมสำหรับ Stats Cards
  const totalTrees = reports.length;
  const urgentCount = reports.filter(r => r.healthStatus === 'URGENT').length;
  const totalFertilizerAll = reports.reduce((sum, r) => sum + (r.totalFertilizer || 0), 0);

  const getStatusBadge = (status) => {
    const styles = {
      Excellent: { bg: '#dcfce7', color: '#166534', label: 'ดีเยี่ยม' },
      Good: { bg: '#f0fdf4', color: '#15803d', label: 'ดี' },
      NORMAL: { bg: '#eff6ff', color: '#1e40af', label: 'ปกติ' },
      URGENT: { bg: '#fef2f2', color: '#991b1b', label: 'ต้องดูแล' }
    };
    const style = styles[status] || styles.NORMAL;
    
    return (
      <span style={{ 
        padding: '6px 12px', 
        borderRadius: '30px', 
        background: style.bg, 
        color: style.color, 
        fontSize: '13px',
        fontWeight: '600',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px'
      }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: style.color }}></span>
        {style.label}
      </span>
    );
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: '#64748b' }}>
      <p>กำลังรวบรวมข้อมูลสรุปในสวน...</p>
    </div>
  );

  return (
    <div style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Sarabun, sans-serif' }}>
      
      {/* Header Section */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#0f172a', margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
          📈 รายงานภาพรวมสวนทุเรียน
        </h2>
        <p style={{ color: '#64748b', marginTop: '5px' }}>ข้อมูลอัปเดตล่าสุดจากระบบบันทึกรายวัน</p>
      </div>

      {/* Stats Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div style={statsCardStyle('#eff6ff')}>
          <span style={{ fontSize: '24px' }}>🌳</span>
          <div>
            <p style={statsTitleStyle}>จำนวนต้นทั้งหมด</p>
            <h3 style={statsValueStyle}>{totalTrees} ต้น</h3>
          </div>
        </div>
        <div style={statsCardStyle('#fef2f2')}>
          <span style={{ fontSize: '24px' }}>⚠️</span>
          <div>
            <p style={statsTitleStyle}>ต้องดูแลเป็นพิเศษ</p>
            <h3 style={{ ...statsValueStyle, color: '#991b1b' }}>{urgentCount} ต้น</h3>
          </div>
        </div>
        <div style={statsCardStyle('#f0fdf4')}>
          <span style={{ fontSize: '24px' }}>🧪</span>
          <div>
            <p style={statsTitleStyle}>ปุ๋ยที่ใช้รวม</p>
            <h3 style={statsValueStyle}>{totalFertilizerAll.toFixed(1)} กก.</h3>
          </div>
        </div>
      </div>
      
      {/* Table Section */}
      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        overflow: 'hidden',
        boxShadow: '0 4px 25px rgba(0,0,0,0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ padding: '20px 25px', borderBottom: '1px solid #f1f5f9', background: '#fff' }}>
          <h4 style={{ margin: 0, color: '#334155' }}>รายการแยกตามรายต้น</h4>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', background: '#f8fafc', color: '#64748b', fontSize: '14px' }}>
                <th style={thStyle}>รหัสต้น</th>
                <th style={thStyle}>สายพันธุ์</th>
                <th style={thStyle}>ผลผลิตคาดการณ์</th>
                <th style={thStyle}>ปุ๋ยสะสม (กก.)</th>
                <th style={thStyle}>สถานะสุขภาพ</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? reports.map((item, index) => (
                <tr key={index} style={trStyle}>
                  <td style={{ ...tdStyle, fontWeight: 'bold', color: '#1e293b' }}>
                    <span style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px' }}>{item.treeId}</span>
                  </td>
                  <td style={tdStyle}>{item.species}</td>
                  <td style={{ ...tdStyle, color: '#16a34a', fontWeight: 'bold' }}>
                    {item.latestYield ? `${item.latestYield.toFixed(2)} kg` : '0 kg'}
                  </td>
                  <td style={tdStyle}>{item.totalFertilizer ? item.totalFertilizer.toFixed(2) : '0.00'}</td>
                  <td style={tdStyle}>{getStatusBadge(item.healthStatus)}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                    ไม่พบข้อมูลต้นไม้ในระบบ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '20px', fontSize: '13px', color: '#94a3b8', textAlign: 'right' }}>
        * ระบบคำนวณข้อมูลอัตโนมัติอ้างอิงตามฐานข้อมูลรายวัน
      </div>
    </div>
  );
};

// Styles สำหรับ Dashboard
const thStyle = { padding: '16px 25px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle = { padding: '16px 25px', color: '#475569', fontSize: '15px' };
const trStyle = { borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' };

const statsCardStyle = (bgColor) => ({
  background: bgColor,
  padding: '20px',
  borderRadius: '16px',
  display: 'flex',
  alignItems: 'center',
  gap: '15px',
  boxShadow: '0 2px 10px rgba(0,0,0,0.02)'
});

const statsTitleStyle = { margin: 0, fontSize: '14px', color: '#64748b' };
const statsValueStyle = { margin: '2px 0 0 0', fontSize: '22px', fontWeight: 'bold', color: '#0f172a' };

export default PerformanceReport;