import { useState } from "react";
import Dashboard from "../components/Dashboard";
import Popup from "../components/Popup";
import { Link } from "react-router-dom";

export default function Home() {
  const [hint] = useState(
    "Use Arrow keys or Swipe. Press Enter or tap button to interact."
  );

  return (
    <div className="min-h-screen flex flex-col items-center bg-purple-100 text-gray-900 relative">
      <Dashboard />

      <div id="hud" className="flex flex-col items-center mt-4 text-sm">
        <span id="hint" className="opacity-80">{hint}</span>
        <span id="tile-label" className="font-semibold"></span>
      </div>

      <div
        id="room"
        className="relative w-80 h-80 bg-violet-200 rounded-xl shadow-lg mt-6 overflow-hidden flex items-center justify-center"
      >
        <div
          id="tiles"
          className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-px"
        ></div>
        <div
          id="avatar"
          className="absolute w-10 h-10 bg-green-200 rounded-full shadow-inner border border-white"
        ></div>
        <p className="text-sm text-gray-600 absolute bottom-2">(Map placeholder)</p>
      </div>

      <button
        id="interact-btn"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 text-lg rounded-lg bg-white/60 text-black shadow-lg z-50"
      >
        Enter
      </button>

      <Popup />

      <div className="flex gap-4 mt-10">
        <Link to="/study" className="bg-white/70 px-4 py-2 rounded-xl font-medium hover:bg-white transition">Study</Link>
        <Link to="/shop" className="bg-white/70 px-4 py-2 rounded-xl font-medium hover:bg-white transition">Shop</Link>
        <Link to="/inventory" className="bg-white/70 px-4 py-2 rounded-xl font-medium hover:bg-white transition">Inventory</Link>
        <Link to="/about" className="bg-white/70 px-4 py-2 rounded-xl font-medium hover:bg-white transition">About</Link>
      </div>
    </div>
  );
}
