export default function BottomNav({ setPage }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2">
      <button onClick={() => setPage("dashboard")}>🏠</button>
      <button onClick={() => setPage("trees")}>🌳</button>
      <button onClick={() => setPage("add")}>➕</button>
    </div>
  );
}