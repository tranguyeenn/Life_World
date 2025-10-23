import { useState, useEffect, useRef } from "react";
import { usePetStats } from "../utils/stats";
import Dashboard from "../components/Dashboard";
import { Link } from "react-router-dom";
import avatarImg from "../assets/avatar.png";

export default function StudyPage() {
  const [stats, setStats] = usePetStats();

  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [remaining, setRemaining] = useState(25 * 60);
  const [duration, setDuration] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [reward, setReward] = useState(null);
  const [petMood, setPetMood] = useState("happy");
  const [studyStartTime, setStudyStartTime] = useState(null);
  const [isLockedIn, setIsLockedIn] = useState(false);
  const intervalRef = useRef(null);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // timer handling
  useEffect(() => {
    if (running && remaining > 0) {
      if (!studyStartTime) setStudyStartTime(Date.now());
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
    if (total > 120 * 60)
      return alert("Time cannot exceed 120 minutes (2 hours).");
    setDuration(total);
    setRemaining(total);
    setReward(null);
  };

  const start = () => {
    setRunning(true);
    setIsLockedIn(true);
    setPetMood("focused");
  };

  const pause = () => {
    setRunning(false);
    setIsLockedIn(false);
    setPetMood(getMoodFromStats(stats)); // relax back to normal mood
  };

  const reset = () => {
    setRunning(false);
    setIsLockedIn(false);
    setRemaining(duration);
    setReward(null);
    setStudyStartTime(null);
    setPetMood(getMoodFromStats(stats)); // return to baseline mood
  };

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
      energy: Math.max(0, stats.energy - totalMinutes * 0.5),
    };

    let required = updated.level * 100;
    while (updated.xp >= required) {
      updated.xp -= required;
      updated.level++;
      updated.happiness = Math.min(100, updated.happiness + 5);
      required = updated.level * 100;
    }

    setStats(updated);
    localStorage.setItem("petStats", JSON.stringify(updated));
    setReward({ coins: Math.floor(coins), xp: Math.floor(xp) });

    setIsLockedIn(false);
    setPetMood("happy"); // cheerful after completion
  };

  // helper: baseline mood from stats
  const getMoodFromStats = (stats) => {
    if (stats.energy > 70 && stats.happiness > 70) return "happy";
    if (stats.energy > 40) return "tired";
    if (stats.energy > 15) return "sleepy";
    return "burntout";
  };

  // background mood adjustment if not locked
  useEffect(() => {
    if (isLockedIn) return;
    const interval = setInterval(() => {
      setPetMood(getMoodFromStats(stats));
    }, 10000);
    return () => clearInterval(interval);
  }, [isLockedIn, stats]);

  const moodEmoji = {
    happy: "😸",
    focused: "🧠",
    tired: "😐",
    sleepy: "😴",
    burntout: "🥲",
  }[petMood];

  const moodText = {
    happy: "ready to learn!",
    focused: "locked in.",
    tired: "needs a short break",
    sleepy: "running low on energy",
    burntout: "totally drained. take a rest.",
  }[petMood];

  return (
    <div className="min-h-screen flex flex-col items-center text-white bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.1),_transparent_70%)] pointer-events-none" />

      <div className="w-full z-20">
        <Dashboard />
      </div>

      <h1 className="text-4xl font-semibold mt-10 mb-2 text-indigo-300 tracking-tight drop-shadow-[0_0_10px_rgba(129,140,248,0.3)]">
        study room
      </h1>
      <p className="text-slate-400 mb-8 italic text-sm">focus. earn. grow.</p>

      {/* Layout container */}
      <div className="flex flex-row items-start justify-center gap-10 w-full max-w-5xl px-6">
        {/* Pet panel */}
        <div className="flex flex-col items-center gap-2 sticky top-32">
          <div className="rounded-full border-[2px] border-indigo-300/70 shadow-[0_0_25px_rgba(129,140,248,0.5)] overflow-hidden w-24 h-24 transition-all">
            <img
              src={avatarImg}
              alt="pet avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-3xl">{moodEmoji}</span>
          <p className="text-xs text-slate-400 text-center w-28">{moodText}</p>
        </div>

        {/* Timer Box */}
        <div className="bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.4)] p-8 flex flex-col items-center text-center w-[90%] max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex flex-col items-center">
              <label className="text-xs text-slate-300 mb-1">minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                min="0"
                className="text-black w-16 px-2 py-1 rounded-md text-center outline-none"
              />
            </div>

            <div className="flex flex-col items-center">
              <label className="text-xs text-slate-300 mb-1">seconds</label>
              <input
                type="number"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                min="0"
                max="59"
                className="text-black w-16 px-2 py-1 rounded-md text-center outline-none"
              />
            </div>

            <button
              onClick={applyTime}
              className="bg-indigo-500/90 hover:bg-indigo-400 px-4 py-2 rounded-md text-white font-medium transition-all active:scale-[0.97]"
            >
              set
            </button>
          </div>

          <p className="text-6xl font-mono mb-6 drop-shadow-sm tracking-widest text-indigo-100">
            {formatTime(remaining)}
          </p>

          <div className="flex gap-4">
            <button
              onClick={start}
              className="bg-emerald-400/90 hover:bg-emerald-300 text-slate-900 px-4 py-2 rounded-md font-semibold transition-all active:scale-[0.97]"
            >
              start
            </button>
            <button
              onClick={pause}
              className="bg-amber-400/90 hover:bg-amber-300 text-slate-900 px-4 py-2 rounded-md font-semibold transition-all active:scale-[0.97]"
            >
              pause
            </button>
            <button
              onClick={reset}
              className="bg-rose-500/90 hover:bg-rose-400 text-white px-4 py-2 rounded-md font-semibold transition-all active:scale-[0.97]"
            >
              reset
            </button>
          </div>

          {reward && (
            <div className="mt-6 bg-emerald-400/20 text-emerald-200 rounded-xl py-3 px-6 font-medium border border-emerald-300/30 shadow-[0_0_12px_rgba(52,211,153,0.2)]">
              +{reward.coins} coins • +{reward.xp} xp
            </div>
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
