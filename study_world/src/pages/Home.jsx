import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePetStats } from "../utils/stats";
import Dashboard from "../components/Dashboard";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = usePetStats();
  const [avatar, setAvatar] = useState({ x: 4, y: 1 });
  const tileSize = 50;
  const gridSize = 10;

  const rooms = [
    { name: "STUDY", x: 1, y: 1, link: "/study" },
    { name: "INV", x: 7, y: 1, link: "/inventory" },
    { name: "SHOP", x: 7, y: 8, link: "/shop" },
    { name: "BED", x: 1, y: 8 },
  ];

  // Movement with wall collision
  useEffect(() => {
    const handleKey = (e) => {
      setAvatar((prev) => {
        let { x, y } = prev;
        if (e.key === "ArrowUp" && y > 1) y--;
        if (e.key === "ArrowDown" && y < gridSize - 2) y++;
        if (e.key === "ArrowLeft" && x > 1) x--;
        if (e.key === "ArrowRight" && x < gridSize - 2) x++;
        return { x, y };
      });
      if (e.key === "Enter") handleInteraction();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [avatar]);

  function handleInteraction() {
    const currentRoom = rooms.find(
    (r) => Math.abs(r.x - avatar.x) <= 1 && Math.abs(r.y - avatar.y) <= 1
    );
    if (!currentRoom) return;

    if (currentRoom.name === "BED") {
      const updated = {
        ...stats,
        happiness: Math.min(100, stats.happiness + 5),
        energy: Math.min(100, stats.energy + 5),
      };
      setStats(updated);
      localStorage.setItem("petStats", JSON.stringify(updated));
    } else if (currentRoom.link) {
      navigate(currentRoom.link);
    }
  }

  const handleMobileEnter = () => handleInteraction();

  return (
    <div className="min-h-screen flex flex-col items-center bg-slate-900 text-white relative">
      {/* Top section (Dashboard + About) */}
      <div className="flex items-center justify-center gap-3 mt-4 mb-4">
        <Dashboard />
        <Link
          to="/about"
          className="bg-white text-slate-900 font-medium rounded-md px-4 py-1 shadow-sm hover:bg-gray-200 transition"
        >
          About
        </Link>
      </div>

      {/* Instructions */}
      <p className="text-sm opacity-80 mb-2">
        Use Arrow keys or Swipe. Press Enter or tap the button to interact.
      </p>

      {/* Map */}
      <div
        className="relative bg-gradient-to-b from-slate-200 to-slate-300 rounded-[40px] shadow-2xl border-[6px] border-slate-600 mt-6 overflow-hidden"
        style={{
          width: tileSize * gridSize,
          height: tileSize * gridSize,
          boxShadow: "0 8px 20px rgba(0,0,0,0.4)",
        }}
      >
        {/* Soft floor grid */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
          {[...Array(gridSize * gridSize)].map((_, i) => {
            const x = i % gridSize;
            const y = Math.floor(i / gridSize);
            const isWall =
              x === 0 || y === 0 || x === gridSize - 1 || y === gridSize - 1;
            return (
              <div
                key={i}
                className={`w-full h-full transition-all ${
                  isWall
                    ? "bg-slate-700"
                    : "bg-gradient-to-br from-slate-100 to-slate-200"
                }`}
              ></div>
            );
          })}
        </div>

        {/* Rooms */}
        {rooms.map((r, i) => {
          const isNear =
            Math.abs(r.x - avatar.x) <= 1 && Math.abs(r.y - avatar.y) <= 1;
          return (
            <div
              key={i}
              className={`absolute text-sm font-semibold px-2 py-1 rounded-xl text-center shadow-md transition-all ${
                isNear
                  ? "bg-green-400 text-black scale-110 shadow-lg"
                  : "bg-white/90 text-gray-800"
              }`}
              style={{
                left: r.x * tileSize + tileSize / 6,
                top: r.y * tileSize + tileSize / 6,
                width: tileSize * 1.5,
              }}
            >
              {r.name}
            </div>
          );
        })}

        {/* Avatar */}
        <div
          id="avatar"
          className="absolute bg-gradient-to-br from-green-400 to-emerald-500 border-[3px] border-white rounded-full shadow-2xl transition-all duration-150"
          style={{
            width: tileSize * 0.8,
            height: tileSize * 0.8,
            left: avatar.x * tileSize + tileSize * 0.1,
            top: avatar.y * tileSize + tileSize * 0.1,
          }}
        ></div>
      </div>

      {/* Mobile Enter Button */}
      <button
        onClick={handleMobileEnter}
        className="mt-8 mb-6 px-8 py-3 bg-white text-slate-900 text-lg font-semibold rounded-xl shadow-md hover:bg-gray-200 transition"
      >
        Enter
      </button>
    </div>
  );
}