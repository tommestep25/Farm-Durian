import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import TreeListPage from './pages/Inventory/TreeListPage';
import FertilizerLog from './pages/Activities/FertilizerLog';
import PestControl from './pages/Activities/PestControl';
import YieldTracker from './pages/Production/YieldTracker';
import PerformanceReport from './pages/Reports/PerformanceReport';
import TreeActionCenter from './pages/Inventory/TreeActionCenter';
import FertilizerInventory from './pages/Inventory/FertilizerInventory';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* ✅ แก้ไขจุดนี้: ต้องใช้ <Route index ... /> เท่านั้น */}
          <Route index element={<DashboardPage />} />
          
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inventory" element={<TreeListPage />} />
          <Route path="inventory/:treeId" element={<TreeListPage />} />
          <Route path="activities/fertilizer" element={<FertilizerLog />} />
          <Route path="activities/pest-disease" element={<PestControl />} />
          <Route path="production/yield" element={<YieldTracker />} />
          <Route path="reports" element={<PerformanceReport />} />
          <Route path="/fertilizer-stock" element={<FertilizerInventory />} />
          <Route path="/tree-actions" element={<TreeActionCenter />} />
        </Route>

        {/* กรณีใส่ URL ผิด ให้ดีดกลับไปหน้าแรก */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;