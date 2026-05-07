export default function TreePage({ trees, onWater }) {
  return (
    <div className="space-y-3">
      {trees.map((tree) => (
        <div key={tree.id} className="bg-white p-4 rounded-2xl shadow">
          <p className="font-bold">{tree.name}</p>
          <p className="text-sm text-gray-500">อายุ {tree.age} ปี</p>

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onWater(tree.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              รดน้ำ
            </button>

            <button className="bg-yellow-500 text-white px-3 py-1 rounded">
              ใส่ปุ๋ย
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}