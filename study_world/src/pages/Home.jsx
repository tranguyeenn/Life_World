import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { usePetStats } from "../utils/stats";

export default function Home() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState({ x: 4, y: 4 });
  const [stats, setStats] = usePetStats();
  const tileSize = 50;
  const gridSize = 10;

  // Rooms (INV moved farther)
  const rooms = [
    { name: "STUDY", x: 1, y: 2, link: "/study" },
    { name: "BED", x: 1, y: 7 },
    { name: "SHOP", x: 7, y: 7, link: "/shop" },
    { name: "INV", x: 7, y: 2, link: "/inventory" },
  ];

  // Movement logic — block walls (edges of grid)
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

      if (e.key === "Enter") handleEnter();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [avatar]);

  // Interactions
  const handleEnter = () => {
    const nearby = rooms.find(
      (r) => Math.abs(r.x - avatar.x) <= 1 && Math.abs(r.y - avatar.y) <= 1
    );
    if (!nearby) return;

    if (nearby.name === "BED") {
      const updated = {
        ...stats,
        energy: Math.min(100, stats.energy + 5),
        happiness: Math.min(100, stats.happiness + 5),
      };
      setStats(updated);
      alert("You rested! +5 Energy, +5 Happiness ✨");
    } else if (nearby.link) {
      navigate(nearby.link);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center relative">
      {/* HUD */}
      <div className="absolute top-4 flex gap-4 text-sm bg-white/10 px-4 py-2 rounded-md">
        <span>😊 Happiness: {stats.happiness}</span>
        <span>⚡ Energy: {stats.energy}</span>
        <span>💰 Coins: {stats.coins}</span>
        <span>⭐ XP: {stats.xp}</span>
        <span>⬆ Level: {stats.level}</span>
      </div>

      <p className="mt-16 text-gray-300">
        Use Arrow keys or Swipe. Press Enter to interact.
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
    </div>
  );
}