import { useState } from "react";

export default function AddTree({ onAdd }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = () => {
    if (!name || !age) return;

    onAdd({
      id: Date.now(),
      name,
      age: Number(age),
    });

    setName("");
    setAge("");
  };

  return (
    <div className="space-y-3">
      <input
        placeholder="ชื่อต้น"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 rounded-xl border"
      />

      <input
        placeholder="อายุ (ปี)"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        className="w-full p-3 rounded-xl border"
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 text-white p-3 rounded-xl"
      >
        บันทึก
      </button>
    </div>
  );
}