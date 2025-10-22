import { useState, useEffect, useRef } from "react";
import { usePetStats } from "../utils/stats";
import Dashboard from "../components/Dashboard";
import { Link } from "react-router-dom";

export default function StudyPage() {
  const [stats, setStats] = usePetStats();

  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(25 * 60);
  const [duration, setDuration] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [reward, setReward] = useState(null);
  const intervalRef = useRef(null);

  // Format display
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Timer logic
  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => prev - 1);
      }, 1000);
    } else if (remaining <= 0) {
      clearInterval(intervalRef.current);
      sessionComplete();
      setRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, remaining]);

  const applyTime = () => {
    const total = minutes * 60 + seconds;
    if (total <= 0) return alert("Please enter a time greater than 0.");
    if (total > 120 * 60) return alert("Time cannot exceed 120 minutes (2 hours).");
    setDuration(total);
    setRemaining(total);
    setReward(null);
  };

  const start = () => setRunning(true);
  const pause = () => setRunning(false);
  const reset = () => {
    setRunning(false);
    setRemaining(duration);
    setReward(null);
  };

  // XP & reward logic
  const sessionComplete = () => {
    const totalMinutes = duration / 60;
    let coins = totalMinutes * 1;
    let xp = totalMinutes * 2;

    if (totalMinutes >= 30) {
      coins += 5;
      xp += 5;
    }
    if (totalMinutes >= 60) {
      coins += 10;
      xp += 10;
      stats.happiness = Math.min(100, stats.happiness + 5);
    }

    const updated = {
      ...stats,
      coins: stats.coins + Math.floor(coins),
      xp: stats.xp + Math.floor(xp),
    };

    // Handle leveling
    let required = updated.level * 100;
    while (updated.xp >= required) {
      updated.xp -= required;
      updated.level++;
      updated.happiness = Math.min(100, updated.happiness + 5);
      required = updated.level * 100;
    }

    setStats(updated);
    setReward({ coins: Math.floor(coins), xp: Math.floor(xp) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 to-indigo-800 text-white flex flex-col items-center">
      <Dashboard />

      <h1 className="text-4xl font-bold mt-10 mb-6">Study Room</h1>

      {/* Timer Box */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center text-center w-[90%] max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-200">Minutes</label>
            <input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              min="0"
              className="text-black w-16 px-2 py-1 rounded-md text-center"
            />
          </div>

          <div className="flex flex-col items-center">
            <label className="text-sm text-gray-200">Seconds</label>
            <input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
              min="0"
              max="59"
              className="text-black w-16 px-2 py-1 rounded-md text-center"
            />
          </div>

          <button
            onClick={applyTime}
            className="bg-sky-500 hover:bg-sky-600 px-4 py-2 rounded-md text-white font-medium transition"
          >
            Set Time
          </button>
        </div>

        <p className="text-6xl font-mono mb-6 drop-shadow">{formatTime(remaining)}</p>

        <div className="flex gap-4">
          <button
            onClick={start}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md text-white font-semibold transition"
          >
            Start
          </button>
          <button
            onClick={pause}
            className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-md text-black font-semibold transition"
          >
            Pause
          </button>
          <button
            onClick={reset}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-white font-semibold transition"
          >
            Reset
          </button>
        </div>

        {reward && (
          <div className="mt-6 bg-green-400/20 text-green-200 rounded-xl py-3 px-6 font-medium">
            +{reward.coins} Coins • +{reward.xp} XP
          </div>
        )}
      </div>

      <Link
        to="/"
        className="mt-8 text-blue-200 underline hover:text-blue-400 transition"
      >
        ← Back
      </Link>
    </div>
  );
}
