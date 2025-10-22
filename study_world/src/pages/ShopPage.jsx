import { usePetStats } from "../utils/stats";
import Dashboard from "../components/Dashboard";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ShopPage() {
  const [stats, setStats] = usePetStats();
  const [message, setMessage] = useState("");

  const itemsForSale = [
    { id: 1, name: "Paper", price: 30 },
    { id: 2, name: "Pen", price: 20 },
    { id: 3, name: "Notebook", price: 25 },
    { id: 4, name: "Calculator", price: 50 },
  ];

  const handleBuy = (item) => {
    if (stats.coins >= item.price) {
      const updated = { ...stats, coins: stats.coins - item.price };
      setStats(updated);

      const inv = JSON.parse(localStorage.getItem("inventory") || "[]");
      inv.push(item);
      localStorage.setItem("inventory", JSON.stringify(inv));

      setMessage(`Bought ${item.name}!`);
    } else {
      setMessage("Not enough coins!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-blue-100">
      <Dashboard />
      <h1 className="text-3xl font-bold mt-6 mb-4">Shop</h1>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {itemsForSale.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg shadow-md p-4 text-center hover:scale-105 transition"
          >
            <strong className="block text-lg">{item.name}</strong>
            <p className="text-gray-700 mb-2">Price: {item.price} coins</p>
            <button
              onClick={() => handleBuy(item)}
              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition"
            >
              Buy
            </button>
          </div>
        ))}
      </div>

      {message && (
        <p className="mt-4 text-sm font-medium text-gray-800">{message}</p>
      )}

      <Link
        to="/"
        className="mt-8 text-blue-700 underline hover:text-blue-900 transition"
      >
        ← Back
      </Link>
    </div>
  );
}