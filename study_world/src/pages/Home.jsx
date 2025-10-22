import { useState, useEffect, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePetStats } from "../utils/stats";
import Dashboard from "../components/Dashboard";
import { Dialog, Transition } from "@headlessui/react";
import { Info, ArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import confetti from "../assets/confetti.json"; // add gentle confetti Lottie

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = usePetStats();
  const [avatar, setAvatar] = useState({ x: 4, y: 1 });
  const [showReward, setShowReward] = useState(false);
  const tileSize = 50;
  const gridSize = 10;

  const rooms = [
    { name: "Study", x: 1, y: 2, link: "/study" },
    { name: "Inv", x: 7, y: 2, link: "/inventory" },
    { name: "Shop", x: 7, y: 7, link: "/shop" },
    { name: "Rest", x: 1, y: 7 },
  ];

  // movement logic
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

    if (currentRoom.name === "Rest") {
      const updated = {
        ...stats,
        happiness: Math.min(100, stats.happiness + 5),
        energy: Math.min(100, stats.energy + 5),
      };
      setStats(updated);
      localStorage.setItem("petStats", JSON.stringify(updated));
      setShowReward(true);
    } else if (currentRoom.link) {
      navigate(currentRoom.link);
    }
  }

  const handleMobileEnter = () => handleInteraction();

  return (
    <div className="min-h-screen flex flex-col items-center justify-start text-white relative overflow-hidden">
      {/* Background: slow gradient shift for a dreamy look */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#0a0f1e,_#182a3b,_#101820)] animate-breathe opacity-100"></div>

      {/* HUD */}
      <div className="z-10 flex items-center justify-center gap-4 mt-6 mb-2">
        <Dashboard />
        <Link
          to="/about"
          className="flex items-center gap-1 bg-white/90 text-slate-900 font-medium rounded-md px-4 py-1 shadow-sm hover:bg-white transition-all"
        >
          <Info className="w-4 h-4 opacity-80" />
          About
        </Link>
      </div>

      {/* Floating tip (unchanged position) */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 text-sm text-white/80 font-medium animate-float z-10 flex items-center gap-1 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
        <ArrowRight className="w-4 h-4 text-emerald-300 animate-pulse" />
        <span>Use arrow keys to move</span>
      </div>

      {/* Map */}
      <div
        className="relative rounded-[40px] border-[5px] border-slate-700 bg-gradient-to-b from-slate-800/70 to-slate-900/90 shadow-[0_4px_25px_rgba(0,0,0,0.6)] mt-10 overflow-hidden z-10"
        style={{
          width: tileSize * gridSize,
          height: tileSize * gridSize,
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {/* Ground tiles */}
        {[...Array(gridSize * gridSize)].map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isWall =
            x === 0 || y === 0 || x === gridSize - 1 || y === gridSize - 1;
          return (
            <div
              key={i}
              className={`transition-all duration-300 ${
                isWall
                  ? "bg-slate-700/70"
                  : "bg-slate-800/40 hover:bg-slate-700/60"
              }`}
            ></div>
          );
        })}

        {/* Room icons */}
        {rooms.map((r, i) => {
          const isNear =
            Math.abs(r.x - avatar.x) <= 1 && Math.abs(r.y - avatar.y) <= 1;
          return (
            <div
              key={i}
              className={`absolute flex items-center justify-center text-xs font-semibold rounded-lg text-center transition-all tracking-wide ${
                isNear
                  ? "bg-emerald-300 text-slate-900 scale-110 shadow-[0_0_10px_rgba(52,211,153,0.6)]"
                  : "bg-white/20 text-white/80 hover:bg-white/30"
              }`}
              style={{
                left: r.x * tileSize + tileSize / 6,
                top: r.y * tileSize + tileSize / 6,
                width: tileSize * 1.5,
                height: tileSize * 0.8,
              }}
            >
              {r.name}
            </div>
          );
        })}

        {/* Avatar — glowing soft circle */}
        <div
          id="avatar"
          className="absolute bg-gradient-to-br from-emerald-300 via-green-400 to-teal-500 border-[2px] border-white/70 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.8)] transition-all duration-150 ease-linear"
          style={{
            width: tileSize * 0.55,
            height: tileSize * 0.55,
            left: avatar.x * tileSize + tileSize * 0.15,
            top: avatar.y * tileSize + tileSize * 0.15,
          }}
        ></div>
      </div>

      {/* Mobile Enter */}
      <button
        onClick={handleMobileEnter}
        className="z-10 mt-8 mb-8 px-8 py-3 bg-emerald-300/90 text-slate-900 text-lg font-semibold rounded-xl shadow-[0_4px_20px_rgba(52,211,153,0.5)] hover:bg-emerald-300 transition-all active:scale-[0.97]"
      >
        Enter
      </button>

      {/* Reward Modal */}
      <Transition appear show={showReward} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50"
          onClose={() => setShowReward(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="relative bg-slate-900 text-white rounded-2xl p-8 text-center shadow-2xl w-[90%] max-w-sm border border-emerald-400/30">
              <Lottie
                animationData={confetti}
                loop={false}
                className="w-32 h-32 mx-auto"
              />
              <Dialog.Title className="text-xl font-semibold text-emerald-300">
                You feel well-rested.
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-300 mt-2">
                +5 Happiness • +5 Energy
              </Dialog.Description>
              <button
                onClick={() => setShowReward(false)}
                className="mt-5 bg-emerald-300/90 text-slate-900 px-6 py-2 rounded-lg font-medium hover:bg-emerald-300 transition-all active:scale-[0.97]"
              >
                Continue
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
