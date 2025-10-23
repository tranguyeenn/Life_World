import { Link } from "react-router-dom";
import Dashboard from "../components/Dashboard";

export default function GamesPage() {
  return (
    <div className="min-h-screen flex flex-col items-center text-white bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.08),_transparent_70%)] pointer-events-none" />

      <div className="w-full z-20">
        <Dashboard />
      </div>

      <h1 className="text-4xl font-semibold mt-8 mb-3 text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
        games room 🎮
      </h1>
      <p className="text-slate-400 mb-8 italic text-sm">
        take a break without totally slacking off
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full px-8">
        <Link to="/games/wordle" className="bg-slate-800/60 hover:bg-slate-700/70 border border-emerald-400/20 rounded-2xl p-6 text-center font-medium text-emerald-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-[1.03] transition-all">
          🧩 wordle challenge
        </Link>

        <Link to="/games/typing" className="bg-slate-800/60 hover:bg-slate-700/70 border border-emerald-400/20 rounded-2xl p-6 text-center font-medium text-emerald-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-[1.03] transition-all">
          ⌨️ typing test
        </Link>

        <Link to="/games/crossword" className="bg-slate-800/60 hover:bg-slate-700/70 border border-emerald-400/20 rounded-2xl p-6 text-center font-medium text-emerald-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:scale-[1.03] transition-all">
          🧠 mini crossword
        </Link>
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