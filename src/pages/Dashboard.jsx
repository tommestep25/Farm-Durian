import Card from "../components/Card";

export default function Dashboard() {
  return (
    <div className="space-y-4">
      <Card title="ต้นทั้งหมด" value="120" />
      <Card title="ต้องรดน้ำ" value="15" />
      <Card title="เสี่ยง" value="3" />
    </div>
  );
}