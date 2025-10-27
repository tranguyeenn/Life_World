// components/LeaderboardTable.jsx
import TierBadge from "./TierBadge";
import LeaderboardProfileCard from "./LeaderboardProfileCard";
import { calculateTier } from "../utils/leaderboard";

export default function LeaderboardTable({ users, currentUser }) {
  return (
    <div className="relative bg-slate-900/60 border border-slate-800/70 rounded-2xl w-[90%] max-w-4xl backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.4)] overflow-visible z-10">
      <table className="w-full border-collapse text-sm md:text-base">
        <thead className="bg-slate-800/70 text-emerald-400 uppercase tracking-wide text-xs">
          <tr>
            <th className="py-3 px-4 text-left">Rank</th>
            <th className="py-3 px-4 text-left">User</th>
            <th className="py-3 px-4 text-left">Tier</th>
            <th className="py-3 px-4 text-left">XP</th>
            <th className="py-3 px-4 text-left">Coins</th>
            <th className="py-3 px-4 text-left">Study Time</th>
            <th className="py-3 px-4 text-left">Music / Games</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, i) => (
            <tr
              key={user.username}
              className={`transition ${
                user.username === currentUser
                  ? "bg-emerald-400/20 font-semibold"
                  : "hover:bg-slate-800/40"
              }`}
            >
              <td className="py-3 px-4">{i + 1}</td>

              <td className="py-3 px-4 flex items-center gap-3">
                <div className="relative group">
                  <img
                    src={user.avatar}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border border-emerald-300/40"
                  />
                  <LeaderboardProfileCard user={user} rank={i + 1} />
                </div>
                <span>{user.username}</span>
              </td>

              <td className="py-3 px-4">
                <TierBadge tier={calculateTier(i + 1)} />
              </td>
              <td className="py-3 px-4">{user.xp}</td>
              <td className="py-3 px-4">{user.coins}</td>
              <td className="py-3 px-4">{(user.studyTime / 60).toFixed(1)}h</td>
              <td className="py-3 px-4">
                🎧 {user.musicHours}h / 🎮 {user.gamesPlayed}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

