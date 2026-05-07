const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const treeService = {
  // --- ส่วนจัดการต้นไม้ (Tree Management) ---
  
  // ดึงข้อมูลต้นไม้ทั้งหมด
  getAllTrees: async () => {
    try {
      const response = await fetch(`${API_BASE}/trees`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      return [];
    }
  },

  // ส่งข้อมูลต้นไม้ใหม่ไปบันทึก
  createTree: async (treeData) => {
    const response = await fetch(`${API_BASE}/trees`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(treeData)
    });
    return await response.json();
  },

  // --- ส่วนจัดการปุ๋ย (Fertilizer Management) ---

  // บันทึกการใส่ปุ๋ย
  addFertilizer: async (fertilizerData) => {
    const response = await fetch(`${API_BASE}/fertilizer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fertilizerData)
    });
    return await response.json();
  },

  // --- ส่วนจัดการโรคและแมลง (Pest & Disease) ---

  // บันทึกการพบโรค/แมลง
  addPestLog: async (pestData) => {
    const response = await fetch(`${API_BASE}/pest-disease`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pestData)
    });
    console.log('response',response);
    return await response.json();
  },

  // --- ส่วนรายงาน (Reports) ---
getDashboardStats: async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return await response.json();
    } catch (error) {
      console.error("Dashboard Stats error:", error);
      return null;
    }
  },
  getFertilizerInventory: async () => {
    try {
      const response = await fetch(`${API_BASE}/fertilizer/inventory`);
      if (!response.ok) throw new Error('Failed to fetch inventory');
      return await response.json();
    } catch (error) {
      console.error("getFertilizerInventory error:", error);
      throw error;
    }
  },

  // ✅ 2. เพิ่มยี่ห้อปุ๋ยใหม่เข้าคลัง
  addFertilizerToInventory: async (itemData) => {
    try {
      const response = await fetch(`${API_BASE}/fertilizer/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) throw new Error('Failed to add fertilizer');
      return await response.json();
    } catch (error) {
      console.error("addFertilizerToInventory error:", error);
      throw error;
    }
  },

  // ✅ 3. ดึงสรุปยอดการใช้ปุ๋ยรายเดือน (กี่กิโล/กี่บาท)
  getMonthlyUsage: async () => {
    try {
      const response = await fetch(`${API_BASE}/reports/monthly-usage`);
      if (!response.ok) throw new Error('Failed to fetch monthly usage');
      return await response.json();
    } catch (error) {
      console.error("getMonthlyUsage error:", error);
      throw error;
    }
  },
  // ดึงข้อมูลสรุปสำหรับหน้า Dashboard หรือรายงานสรุป
  getReportSummary: async () => {
    try {
      const response = await fetch(`${API_BASE}/reports/summary`);
      if (!response.ok) throw new Error('Failed to fetch summary');
      return await response.json();
    } catch (error) {
      console.error("Report Fetch error:", error);
      return [];
    }
  }
};