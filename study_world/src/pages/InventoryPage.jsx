import Dashboard from "../components/Dashboard";

export default function InventoryPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center">
      <Dashboard />
      <h1 className="text-3xl mt-6">Inventory</h1>
    </div>
  );
}

