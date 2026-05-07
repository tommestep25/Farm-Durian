import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const QRScanner = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    });

    scanner.render((decodedText) => {
      // สมมติว่า QR เก็บค่า URL เป็น: domain.com/inventory/T001
      // เราจะดึงเอาแค่รหัสหลังสุดออกมา
      const treeId = decodedText.split('/').pop();
      scanner.clear(); // ปิดกล้อง
      onClose(); // ปิดหน้าต่างสแกน
      navigate(`/inventory/${treeId}`); // พาไปที่หน้าต้นไม้นั้นทันที
    }, (error) => {
      // console.warn(error);
    });

    return () => scanner.clear();
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div id="reader" style={{ width: '300px', background: '#fff' }}></div>
      <button onClick={onClose} style={{ marginTop: '20px', padding: '10px 20px', background: '#fff', border: 'none', borderRadius: '5px' }}>ปิดหน้าต่าง</button>
    </div>
  );
};

export default QRScanner;