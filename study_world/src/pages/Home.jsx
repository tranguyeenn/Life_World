import { useState, useEffect, Fragment } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Dialog, Transition, Menu } from "@headlessui/react";
import { MoreVertical, ArrowRight, Info, Trophy } from "lucide-react";
import Lottie from "lottie-react";
import confetti from "../assets/confetti.json";
import avatarImg from "../assets/avatar.png";
import Dashboard from "../components/Dashboard";
import { usePetStats } from "../utils/stats";

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

  // Save avatar position
  useEffect(() => {
    localStorage.setItem("avatarPos", JSON.stringify(avatar));
  }, [avatar]);

  // Movement controls
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

  // Energy drain
  useEffect(() => {
    const interval = setInterval(() => {
      const restZone = rooms.find((r) => r.name === "rest");
      const isResting =
        Math.abs(avatar.x - restZone.x) <= 1 &&
        Math.abs(avatar.y - restZone.y) <= 1;

      if (!isResting) {
        const updated = {
          ...stats,
          energy: Math.max(0, stats.energy - 2),
          happiness: Math.max(0, stats.happiness - 2),
        };
        setStats(updated);
        localStorage.setItem("petStats", JSON.stringify(updated));
      }
    }, 600000);
    return () => clearInterval(interval);
  }, [avatar, stats]);

  function handleInteraction(targetRoom) {
    const currentRoom =
      targetRoom ||
      rooms.find(
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

  const handleTileClick = (tileX, tileY) => {
    const targetRoom = rooms.find((r) => r.x === tileX && r.y === tileY);
    setAvatar({ x: tileX, y: tileY });
    if (targetRoom) setTimeout(() => handleInteraction(targetRoom), 300);
  };

  const moodEmoji = {
    happy: "😸",
    sad: "😿",
    sleepy: "😴",
    excited: "🐾",
  }[petMood];

  return (
    <div className="min-h-screen flex flex-col items-center text-white relative overflow-hidden fade-in">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#0a0f1e,_#182a3b,_#101820)] pointer-events-none" />

      {/* Dashboard */}
      <div className="w-full flex flex-col items-center fixed top-0 z-20 bg-slate-900/70 backdrop-blur-md border-b border-slate-700 shadow-md">
        <Dashboard />
      </div>

      {/* Tip */}
      <div className="absolute top-[6.5rem] left-1/2 -translate-x-1/2 flex items-center gap-2 text-sm font-medium text-white/80 bg-white/5 border border-white/10 rounded-full backdrop-blur-md px-4 py-1.5 z-20 shadow-[0_0_12px_rgba(52,211,153,0.15)] animate-float hidden sm:flex">
        <ArrowRight className="w-4 h-4 text-emerald-300 animate-pulse-slow" />
        <span className="tracking-wide">use arrow keys to move</span>
      </div>

      {/* Map */}
      <div
        className="relative rounded-[40px] border-[5px] border-slate-700 bg-gradient-to-b from-slate-800/70 to-slate-900/90 shadow-[0_4px_25px_rgba(0,0,0,0.6)] mt-28 overflow-hidden z-10"
        style={{
          width: tileSize * gridSize,
          height: tileSize * gridSize,
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {[...Array(gridSize * gridSize)].map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);
          const isWall =
            x === 0 || y === 0 || x === gridSize - 1 || y === gridSize - 1;
          return (
            <div
              key={i}
              onClick={() => !isWall && handleTileClick(x, y)}
              className={`transition-all duration-300 cursor-pointer ${
                isWall
                  ? "bg-slate-700/70 cursor-default"
                  : "bg-slate-800/40 hover:bg-slate-700/60"
              }`}
            />
          );
        })}

        {rooms.map((r, i) => {
          const isNear =
            Math.abs(r.x - avatar.x) <= 1 && Math.abs(r.y - avatar.y) <= 1;
          return (
            <div
              key={i}
              onClick={() => handleTileClick(r.x, r.y)}
              className={`absolute flex items-center justify-center text-xs font-semibold rounded-lg text-center transition-all tracking-wide cursor-pointer ${
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

      {/* Three-dot dropdown */}
      <Menu as="div" className="fixed bottom-6 right-6 z-50 text-left">
        <Menu.Button className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-full shadow-lg border border-slate-600 transition-all hover:scale-105">
          <MoreVertical className="w-5 h-5" />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute bottom-14 right-0 mt-2 w-40 origin-bottom-right rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl focus:outline-none">
            <div className="p-2 flex flex-col gap-1">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/leaderboard"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-emerald-400/90 text-slate-900"
                        : "text-slate-200 hover:bg-slate-700/60"
                    }`}
                  >
                    <Trophy className="w-4 h-4" />
                    Leaderboard
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/about"
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      active
                        ? "bg-white/90 text-slate-900"
                        : "text-slate-200 hover:bg-slate-700/60"
                    }`}
                  >
                    <Info className="w-4 h-4" />
                    About
                  </Link>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>

      {/* Reward Modal */}
      <Transition appear show={showReward} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={() => setShowReward(false)}>
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
              <Lottie animationData={confetti} loop={false} className="w-32 h-32 mx-auto" />
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
