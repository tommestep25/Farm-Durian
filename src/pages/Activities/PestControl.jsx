import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { treeService } from '../../services/treeService';
import { supabase } from '../../supabaseClient'; // ✅ อย่าลืมนำเข้า supabase client ของคุณ

const PestControl = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialTreeId = queryParams.get('treeId') || '';

  const [history, setHistory] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null); // ✅ สำหรับเก็บไฟล์ภาพที่เลือก
  const [uploading, setUploading] = useState(false); // ✅ สถานะการอัปโหลด

  const [report, setReport] = useState({
    treeId: initialTreeId,
    foundDate: new Date().toISOString().split('T')[0],
    symptom: 'ใบเหลือง',
    diseaseName: '',
    treatment: '',
    medicine: '',
    status: 'กำลังรักษา',
    imageUrl: '' // ✅ เพิ่มฟิลด์ imageUrl
  });
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
const loadHistory = async () => {
  if (initialTreeId) {
    try {
      // ✅ เปลี่ยนจาก localhost เป็นตัวแปร API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/pest-disease/history?treeId=${initialTreeId}`);
      
      const data = await response.json();
      console.log('data', data);
      setHistory(data || []);
    } catch (error) {
      console.error("Failed to load pest history:", error);
    }
  }
};

  useEffect(() => {
    loadHistory();

    if (initialTreeId) {
      setReport(prev => ({ ...prev, treeId: initialTreeId }));
    }
  }, [initialTreeId]);

  // ✅ ฟังก์ชันจัดการการอัปโหลดรูปภาพ
  const uploadImage = async () => {
    if (!selectedFile) return "";

    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `pest-images/${fileName}`;

      // อัปโหลดไปที่ Bucket ชื่อ 'pest-logs' (ต้องไปสร้างใน Supabase ก่อนนะครับ)
      const { error: uploadError } = await supabase.storage
        .from('pest-logs')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('pest-logs').getPublicUrl(filePath);
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      // 1. อัปโหลดรูปก่อน (ถ้ามี)
      const finalImageUrl = await uploadImage();

      // 2. ส่งข้อมูลบันทึกพร้อม URL รูป
      const finalReport = { ...report, imageUrl: finalImageUrl };
      const result = await treeService.addPestLog(finalReport);

      if (result) {
        alert("✅ บันทึกรายงานโรคและแมลงสำเร็จ!");
        setReport(prev => ({ ...prev, diseaseName: '', treatment: '', medicine: '', imageUrl: '' }));
        setSelectedFile(null);
        loadHistory();
      }
    } catch (error) {
      alert("❌ เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '850px', margin: '20px auto', padding: '0 15px' }}>
      <div style={formCardStyle}>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0 }}>
          🦠 ระบบบันทึกโรค & แมลง
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>รหัสต้น (Tree ID):</label>
              <input type="text" value={report.treeId} style={{ ...inputStyle, background: '#f9f9f9' }} disabled />
            </div>
            <div>
              <label style={labelStyle}>วันที่พบ:</label>
              <input type="date" value={report.foundDate} style={inputStyle} onChange={(e) => setReport({ ...report, foundDate: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>อาการที่สังเกตเห็น:</label>
              <select style={inputStyle} value={report.symptom} onChange={(e) => setReport({ ...report, symptom: e.target.value })}>
                <option value="ใบเหลือง">ใบเหลือง</option>
                <option value="ใบไหม้">ใบไหม้</option>
                <option value="รากเน่า">รากเน่า</option>
                <option value="ยอดแห้ง">ยอดแห้ง</option>
                <option value="ผลแตก">ผลแตก</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            {/* ✅ เพิ่มส่วนเลือกรูปภาพ */}
            <div>
              <label style={labelStyle}>📷 ถ่ายภาพ/แนบรูปอาการ:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                style={{ ...inputStyle, padding: '8px' }}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>ชนิดโรค/แมลง (ระบุถ้าทราบ):</label>
            <input type="text" value={report.diseaseName} placeholder="เช่น รากเน่าโคนเน่า" style={inputStyle} onChange={(e) => setReport({ ...report, diseaseName: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={labelStyle}>วิธีรักษา:</label>
              <textarea placeholder="ระบุขั้นตอน" value={report.treatment} style={{ ...inputStyle, height: '80px', resize: 'none' }} onChange={(e) => setReport({ ...report, treatment: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>ตัวยาที่ใช้:</label>
              <textarea placeholder="ชื่อยา" value={report.medicine} style={{ ...inputStyle, height: '80px', resize: 'none' }} onChange={(e) => setReport({ ...report, medicine: e.target.value })} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', alignItems: 'end' }}>
            <div>
              <label style={labelStyle}>สถานะปัจจุบัน:</label>
              <select style={inputStyle} value={report.status} onChange={(e) => setReport({ ...report, status: e.target.value })}>
                <option value="กำลังรักษา">กำลังรักษา</option>
                <option value="หายแล้ว">หายแล้ว</option>
                <option value="เฝ้าระวัง">เฝ้าระวัง</option>
                <option value="เสียหาย (ตัดทิ้ง/ตาย)">เสียหาย (ตัดทิ้ง/ตาย)</option>
              </select>
            </div>
            <button type="submit" disabled={uploading} style={{ ...submitBtnStyle, opacity: uploading ? 0.7 : 1 }}>
              {uploading ? 'กำลังบันทึกและอัปโหลดรูป...' : 'บันทึกข้อมูลการพบโรค'}
            </button>
          </div>
        </form>
      </div>

      <div style={historyCardStyle}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
          📅 ประวัติสุขภาพย้อนหลัง (ต้น {initialTreeId})
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', color: '#7f8c8d', fontSize: '14px', borderBottom: '1px solid #eee' }}>
                <th style={{ padding: '10px' }}>รูปภาพ</th>
                <th style={{ padding: '10px' }}>วันที่พบ</th>
                <th style={{ padding: '10px' }}>อาการ/ชื่อโรค</th>
                <th style={{ padding: '10px' }}>การรักษา/ยา</th>
                <th style={{ padding: '10px' }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? history.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid #f9f9f9', fontSize: '14px' }}>
                  <td style={{ padding: '10px' }}>
                    {item.imageUrl ? (
                      /* เพิ่ม display: 'inline-block' เพื่อให้ขนาด div เท่ากับรูปพอดี */
                      <div style={{ position: 'relative', cursor: 'pointer', display: 'inline-block' }}
                        onClick={() => window.open(item.imageUrl, '_blank')}>
                        <img
                          src={item.imageUrl}
                          alt="symptom"
                          style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            border: '1px solid #ddd'
                          }}
                        />
                        
                      </div>
                    ) : (
                      /* ... กรณีไม่มีรูป ... */
                      <div style={{ width: '60px', height: '60px', background: '#f5f5f5', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📷</div>
                    )}
                  </td>
                  <td style={{ padding: '10px' }}>{item.foundDate}</td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 'bold' }}>{item.symptom}</div>
                    <div style={{ fontSize: '12px', color: '#7f8c8d' }}>{item.diseaseName || '-'}</div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontSize: '13px' }}>{item.treatment || '-'}</div>
                    <div style={{ fontSize: '12px', color: '#e74c3c' }}>💊 {item.medicine || '-'}</div>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 'bold',
                      background: item.status === 'หายแล้ว' ? '#d4edda' : '#fff3cd',
                      color: item.status === 'หายแล้ว' ? '#155724' : '#856404'
                    }}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#ccc' }}>ไม่พบประวัติโรคและแมลงของต้นนี้</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// สไตล์ต่างๆ
const formCardStyle = { background: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(231, 76, 60, 0.1)', borderTop: '5px solid #e74c3c' };
const historyCardStyle = { marginTop: '30px', background: '#fff', padding: '20px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' };
const labelStyle = { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#34495e', fontSize: '14px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '14px' };
const submitBtnStyle = { background: '#e74c3c', color: '#fff', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '15px', fontWeight: 'bold', width: '100%' };

export default PestControl;