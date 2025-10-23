import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import { Link } from "react-router-dom";
import avatarImg from "../assets/avatar.png";

export default function InventoryPage() {
  const inventory = JSON.parse(localStorage.getItem("inventory") || "[]");
  const [stats, setStats] = useState(
    JSON.parse(localStorage.getItem("petStats") || "{}")
  );
  const [petMood, setPetMood] = useState("happy");

  // live mood updates based on stored stats
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedStats = JSON.parse(localStorage.getItem("petStats") || "{}");
      setStats(updatedStats);

      if (updatedStats.energy > 70 && updatedStats.happiness > 70)
        setPetMood("happy");
      else if (updatedStats.energy > 40)
        setPetMood("tired");
      else if (updatedStats.energy > 15)
        setPetMood("sleepy");
      else setPetMood("burntout");
    }, 5000); // update every 5s to reflect background stat changes

    return () => clearInterval(interval);
  }, []);

  const moodEmoji = {
    happy: "😸",
    tired: "😐",
    sleepy: "😴",
    burntout: "🥲",
  }[petMood];

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.06),_transparent_70%)] pointer-events-none" />

      {/* Dashboard */}
      <div className="z-20 w-full">
        <Dashboard />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-semibold mt-8 mb-2 text-emerald-300 tracking-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.2)]">
        inventory
      </h1>
      <p className="text-sm text-slate-400 mb-8 italic">
        your collected items live here
      </p>

      {/* Inventory grid */}
      <div className="flex flex-row items-start justify-center gap-10 w-full max-w-5xl px-6">
        {/* Avatar and mood side panel */}
        <div className="flex flex-col items-center gap-2 sticky top-32">
          <div className="rounded-full border-[2px] border-emerald-300/70 shadow-[0_0_25px_rgba(52,211,153,0.5)] overflow-hidden w-24 h-24 transition-all">
            <img
              src={avatarImg}
              alt="pet avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-3xl">{moodEmoji}</span>
          <p className="text-xs text-slate-400">
            {petMood === "happy" && "in good spirits!"}
            {petMood === "tired" && "needs a short break"}
            {petMood === "sleepy" && "running low on energy"}
            {petMood === "burntout" && "totally exhausted..."}
          </p>
        </div>

        {/* Inventory grid proper */}
        <div className="w-full grid grid-cols-2 md:grid-cols-3 gap-5 z-10">
          {inventory.length === 0 ? (
            <p className="col-span-full text-center text-slate-400 font-medium py-10 bg-slate-800/40 border border-slate-700/60 rounded-2xl backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.3)]">
              no items owned yet.
            </p>
          ) : (
            inventory.map((item, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-slate-800/70 to-slate-700/60 border border-white/10 rounded-2xl px-4 py-5 text-center font-medium text-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.25)] hover:shadow-[0_0_15px_rgba(52,211,153,0.3)] hover:border-emerald-400/30 hover:scale-[1.03] transition-all"
              >
                {item.name}
              </div>
            ))
          )}
        </div>
      </div>

      <Link
        to="/home"
        className="z-50 mt-12 mb-8 flex items-center gap-2 text-emerald-300/90 font-medium hover:text-emerald-300 transition-all"
      >
        ← back to map
      </Link>
    </div>
  );
}
