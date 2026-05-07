import React, { useState, useEffect } from 'react';
import { treeService } from '../../services/treeService';
import TreeCard from '../../components/TreeCard';

const TreeListPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTree, setNewTree] = useState({
    treeId: '', 
    species: 'หมอนทอง',
    plantDate: new Date().toISOString().split('T')[0],
    status: 'NORMAL',
    currentStage: 'ระยะใบอ่อน'
  });

  const loadTrees = async () => {
    try {
      setLoading(true);
      const data = await treeService.getAllTrees();
      setTrees(data || []);
      const nextId = (data?.length || 0) + 1;
      setNewTree(prev => ({ ...prev, treeId: `T${String(nextId).padStart(3, '0')}` }));
    } catch (error) {
      console.error("Failed to load trees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrees();
  }, []);

  const handleAddTree = async (e) => {
    e.preventDefault();
    try {
      const result = await treeService.createTree(newTree);
      if (result) {
        alert("ลงทะเบียนต้นไม้ใหม่สำเร็จ!");
        setShowAddForm(false);
        loadTrees();
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const filteredTrees = trees.filter(tree => 
    tree.treeId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div style={{ padding: '20px' }}>กำลังโหลดข้อมูลจากสวน...</div>;

  return (
    <div className="page-container" style={{ padding: '30px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      
      {/* --- ส่วนหัว (Header) แก้ไขให้ไม่ทับกัน --- */}
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-end', // จัดให้ฐานตัวหนังสือตรงกัน
        marginBottom: '25px',
        borderBottom: '2px solid #edf2f7',
        paddingBottom: '20px'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#1e293b', fontSize: '32px', fontWeight: 'bold' }}>
            🌳 จัดการต้นทุเรียน
          </h1>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '16px' }}>
            จำนวนทั้งหมดในระบบ: <span style={{ color: '#27ae60', fontWeight: 'bold' }}>{trees.length}</span> ต้น
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          style={{ 
            padding: '12px 24px', 
            background: '#27ae60', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '12px', 
            cursor: 'pointer', 
            fontWeight: 'bold',
            boxShadow: '0 4px 6px rgba(39, 174, 96, 0.2)'
          }}
        >
          + เพิ่มต้นทุเรียนใหม่
        </button>
      </header>

      {/* --- ส่วนค้นหา (Search Bar) แยกออกมาให้เด่นชัด --- */}
      <div style={{ position: 'relative', marginBottom: '30px' }}>
        <span style={{ position: 'absolute', left: '15px', top: '12px', color: '#94a3b8' }}>🔍</span>
        <input 
          type="text" 
          placeholder="ค้นหาด้วยรหัสต้น (เช่น T001)..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', 
            padding: '12px 12px 12px 45px', 
            borderRadius: '12px', 
            border: '1px solid #e2e8f0', 
            fontSize: '16px',
            boxSizing: 'border-box',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
            outline: 'none'
          }} 
        />
      </div>

      {/* --- ส่วนแสดง Card --- */}
      <div className="tree-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '25px' 
      }}>
        {filteredTrees.length > 0 ? filteredTrees.map(tree => (
          <TreeCard key={tree.treeId} tree={tree} />
        )) : (
          <div style={{ textAlign: 'center', gridColumn: '1/-1', padding: '50px', color: '#94a3b8' }}>
             ไม่พบรหัสต้นไม้ที่คุณกำลังค้นหา
          </div>
        )}
      </div>

      {/* --- Modal ลงทะเบียน (คงเดิมแต่ปรับความสวยงามเล็กน้อย) --- */}
      {showAddForm && (
        <div style={modalOverlayStyle}>
          <form onSubmit={handleAddTree} style={modalContentStyle}>
            <h2 style={{ margin: '0 0 20px 0', color: '#27ae60', textAlign: 'center' }}>🌱 ลงทะเบียนต้นใหม่</h2>
            
            <label style={labelStyle}>รหัสต้น (Tree ID):</label>
            <input type="text" value={newTree.treeId} onChange={(e) => setNewTree({...newTree, treeId: e.target.value})} style={modalInputStyle} />

            <label style={labelStyle}>สายพันธุ์:</label>
            <select style={modalInputStyle} value={newTree.species} onChange={(e) => setNewTree({...newTree, species: e.target.value})}>
              <option>หมอนทอง</option>
              <option>ชะนี</option>
              <option>ก้านยาว</option>
              <option>พวงมณี</option>
            </select>

            <label style={labelStyle}>วันที่ปลูก:</label>
            <input type="date" value={newTree.plantDate} style={modalInputStyle} onChange={(e) => setNewTree({...newTree, plantDate: e.target.value})} />

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button type="submit" style={saveBtnStyle}>บันทึกข้อมูล</button>
              <button type="button" onClick={() => setShowAddForm(false)} style={cancelBtnStyle}>ยกเลิก</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

// --- Styles ภายนอกเพื่อให้โค้ดสะอาด ---
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
const modalContentStyle = { background: '#fff', padding: '35px', borderRadius: '20px', width: '400px', display: 'flex', flexDirection: 'column', gap: '10px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' };
const labelStyle = { fontSize: '14px', fontWeight: 'bold', color: '#475569', marginBottom: '2px' };
const modalInputStyle = { padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', marginBottom: '10px', outline: 'none' };
const saveBtnStyle = { flex: 1, padding: '12px', background: '#27ae60', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };
const cancelBtnStyle = { flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' };

export default TreeListPage;