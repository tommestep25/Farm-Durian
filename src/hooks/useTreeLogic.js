export const useTreeLogic = () => {
  // ฟังก์ชันคำนวณอายุแบบละเอียด
  const calculateAge = (plantDate) => {
    const today = new Date();
    const start = new Date(plantDate);
    let years = today.getFullYear() - start.getFullYear();
    let months = today.getMonth() - start.getMonth();
    
    if (months < 0) {
      years--;
      months += 12;
    }
    return { years, months, text: `${years} ปี ${months} เดือน` };
  };

  // ฟังก์ชันคำนวณ Yield คาดการณ์
  const estimateYield = (fruitCount, avgWeight = 3.5) => {
    return (fruitCount * avgWeight).toFixed(2);
  };

  return { calculateAge, estimateYield };
};