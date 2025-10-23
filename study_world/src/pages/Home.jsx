import { useState, useEffect, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePetStats } from "../utils/stats";
import Dashboard from "../components/Dashboard";
import { Dialog, Transition } from "@headlessui/react";
import { Info, ArrowRight } from "lucide-react";
import Lottie from "lottie-react";
import confetti from "../assets/confetti.json";
import avatarImg from "../assets/avatar.png";

export default function Home() {
  const navigate = useNavigate();
  const [stats, setStats] = usePetStats();
  const [avatar, setAvatar] = useState(() => {
    const saved = localStorage.getItem("avatarPos");
    return saved ? JSON.parse(saved) : { x: 4, y: 1 };
  });
  const [showReward, setShowReward] = useState(false);
  const [petMood, setPetMood] = useState("happy");
  const tileSize = 50;
  const gridSize = 10;

  const rooms = [
    { name: "study", x: 1, y: 2, link: "/study" },
    { name: "inventory", x: 7, y: 2, link: "/inventory" },
    { name: "shop", x: 7, y: 7, link: "/shop" },
    { name: "rest", x: 1, y: 7 },
    { name: "games", x: 4, y: 7, link: "/games" },
  ];

  // Save avatar position persistently
  useEffect(() => {
    localStorage.setItem("avatarPos", JSON.stringify(avatar));
  }, [avatar]);

  // Movement
  useEffect(() => {
    const handleKey = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        e.preventDefault();

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

  // Mood logic
  useEffect(() => {
    if (stats.energy > 80 && stats.happiness > 80) setPetMood("excited");
    else if (stats.energy < 40) setPetMood("sleepy");
    else if (stats.happiness < 40) setPetMood("sad");
    else setPetMood("happy");
  }, [stats]);

  // Interactions
  function handleInteraction() {
    const currentRoom = rooms.find(
      (r) => Math.abs(r.x - avatar.x) <= 1 && Math.abs(r.y - avatar.y) <= 1
    );
    if (!currentRoom) return;

    if (currentRoom.name === "rest") {
      const updated = {
        ...stats,
        happiness: Math.min(100, stats.happiness + 5),
        energy: Math.min(100, stats.energy + 10),
      };
      setStats(updated);
      localStorage.setItem("petStats", JSON.stringify(updated));
      setShowReward(true);
    } else if (currentRoom.link) {
      document.body.classList.add("fade-out");
      setTimeout(() => navigate(currentRoom.link), 400);
    }
  }

  const handleMobileEnter = () => handleInteraction();

  const moodEmoji = {
    happy: "😸",
    sad: "😿",
    sleepy: "😴",
    excited: "🐾",
  }[petMood];

  return (
    <div
      className="min-h-screen flex flex-col items-center text-white relative overflow-hidden fade-in"
      style={{ animation: "fadeIn 0.8s ease-in forwards" }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#0a0f1e,_#182a3b,_#101820)] pointer-events-none" />

      {/* Dashboard */}
      <div className="w-full flex flex-col items-center mt-0 z-20">
        <Dashboard />
      </div>

      {/* Floating tip */}
      <div
        className="absolute top-[6.5rem] left-1/2 -translate-x-1/2 
        flex items-center gap-2 text-sm font-medium text-white/80 
        bg-white/5 border border-white/10 rounded-full 
        backdrop-blur-md px-4 py-1.5 z-20 shadow-[0_0_12px_rgba(52,211,153,0.15)]
        animate-float"
      >
        <ArrowRight className="w-4 h-4 text-emerald-300 animate-pulse-slow" />
        <span className="tracking-wide">use arrow keys to move</span>
      </div>

      {/* Map */}
      <div
        className="relative rounded-[40px] border-[5px] border-slate-700 
        bg-gradient-to-b from-slate-800/70 to-slate-900/90 shadow-[0_4px_25px_rgba(0,0,0,0.6)] 
        mt-10 overflow-hidden z-10"
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
            />
          );
        })}

        {/* Rooms */}
        {rooms.map((r, i) => {
          const isNear =
            Math.abs(r.x - avatar.x) <= 1 && Math.abs(r.y - avatar.y) <= 1;
          return (
            <div
              key={i}
              className={`absolute flex items-center justify-center text-xs font-semibold rounded-lg 
              text-center transition-all tracking-wide ${
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

        {/* Avatar */}
        <div
          className="absolute transition-all duration-150 ease-linear"
          style={{
            left: avatar.x * tileSize + tileSize * 0.15,
            top: avatar.y * tileSize + tileSize * 0.15,
          }}
        >
          <img
            src={avatarImg}
            alt="avatar"
            className="rounded-full w-[27px] h-[27px] border-[2px] border-white/70 shadow-[0_0_20px_rgba(52,211,153,0.8)]"
          />
          <span
            className="absolute text-lg"
            style={{
              top: "50%",
              left: "120%",
              transform: "translateY(-50%)",
            }}
          >
            {moodEmoji}
          </span>
        </div>
      </div>

      {/* Enter button centered */}
      <div className="w-full flex justify-center mt-10 mb-16 z-30">
      <button
        onClick={handleMobileEnter}
        className="px-10 py-3 bg-white/90 text-slate-900 text-lg font-semibold rounded-xl 
        shadow-[0_4px_20px_rgba(71,85,105,0.4)] hover:bg-white transition-all active:scale-[0.97]"
      >
        enter
      </button>
    </div>

      {/* Floating About (bottom-left) */}
      <Link
        to="/about"
        className="fixed bottom-6 left-6 flex items-center gap-1 bg-white/90 text-slate-900 font-medium rounded-md px-3 py-1.5 shadow-md hover:bg-white transition-all"
        style={{ whiteSpace: "nowrap" }}
      >
        <Info className="w-4 h-4 opacity-80 shrink-0" />
        <span>about</span>
      </Link>

      {/* Floating Leaderboard (bottom-right) */}
      <Link
        to="/leaderboard"
        className="fixed bottom-6 right-6 bg-emerald-400/90 text-slate-900 font-semibold rounded-full px-5 py-3 shadow-[0_4px_20px_rgba(52,211,153,0.4)] hover:bg-emerald-300 hover:scale-105 transition-all"
      >
        🏆
      </Link>

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
                you're well-rested.
              </Dialog.Title>
              <Dialog.Description className="text-sm text-slate-300 mt-2">
                +10 energy • +5 happiness
              </Dialog.Description>
              <button
                onClick={() => setShowReward(false)}
                className="mt-5 bg-emerald-300/90 text-slate-900 px-6 py-2 rounded-lg font-medium hover:bg-emerald-300 transition-all active:scale-[0.97]"
              >
                continue
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}