// components/LeaderboardProfileCard.jsx
import { calculateTier } from "../utils/leaderboard";

export default function LeaderboardProfileCard({ user, rank }) {
  const tier = calculateTier(rank);

  return (
    <div className="absolute opacity-0 group-hover:opacity-100 transition-all duration-300 
      bg-slate-900/95 border border-slate-700 rounded-xl p-4 text-xs 
      shadow-[0_8px_25px_rgba(0,0,0,0.4)] w-48 z-50 left-12 top-[-10px]
      backdrop-blur-md pointer-events-none">
      <div className="flex items-center gap-2 mb-2">
        <img
          src={user.avatar}
          alt="avatar"
          className="w-7 h-7 rounded-full border border-emerald-400/30"
        />
        <div>
          <p className="font-semibold text-emerald-300 leading-tight">{user.username}</p>
          <p className="text-[10px] text-slate-400 capitalize">{tier} tier</p>
        </div>
      </div>

      <div className="space-y-1 text-slate-300/90">
        <p>Level: {user.level}</p>
        <p>XP: {user.xp}</p>
        <p>Coins: {user.coins}</p>
        <p>Study: {(user.studyTime / 60).toFixed(1)}h</p>
        <p>Music: {user.musicHours}h</p>
        <p>Games: {user.gamesPlayed}</p>
        <p>Pet mood: 😸 happy</p>
      </div>
    </div>
  );
}
