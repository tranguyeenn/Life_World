import Dashboard from "../components/Dashboard";
import { Link } from "react-router-dom";

export default function InventoryPage() {
  const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-slate-900 to-slate-800 text-white">
      <Dashboard />

      <h1 className="text-3xl font-bold mt-6 mb-4">Inventory</h1>

      <div className="w-full max-w-xl mt-4 grid grid-cols-2 md:grid-cols-3 gap-4 px-6">
        {inventory.length === 0 ? (
          <p className="col-span-full text-center text-gray-300 font-semibold py-8 bg-slate-700/40 rounded-lg">
            No items owned.
          </p>
        ) : (
          inventory.map((item, index) => (
            <div
              key={index}
              className="bg-slate-700/60 rounded-lg px-4 py-3 text-center shadow hover:bg-slate-600/60 transition"
            >
              {item.name}
            </div>
          ))
        )}
      </div>

      <Link
        to="/"
        className="mt-10 mb-6 text-blue-300 underline hover:text-blue-400 transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
}


