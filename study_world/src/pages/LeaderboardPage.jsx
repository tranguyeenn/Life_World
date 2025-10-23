import { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import LeaderboardTable from "../components/LeaderboardTable";
import { sortUsersByScore, calculateScore } from "../utils/leaderboard";
import { Link } from "react-router-dom";

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const currentUser = "Trang"; // replace with your real logged-in username later

  useEffect(() => {
    // sample mock users – you’ll replace this with real data eventually
    const sampleUsers = [
      {
        username: "Nora",
        avatar: "/avatar.png",
        level: 5,
        xp: 420,
        coins: 300,
        studyTime: 8000,
        musicHours: 12,
        gamesPlayed: 5,
      },
      {
        username: "Dylan",
        avatar: "/avatar.png",
        level: 7,
        xp: 620,
        coins: 100,
        studyTime: 6500,
        musicHours: 20,
        gamesPlayed: 3,
      },
      {
        username: "Luna",
        avatar: "/avatar.png",
        level: 2,
        xp: 24,
        coins: 250,
        studyTime: 4000,
        musicHours: 6,
        gamesPlayed: 8,
      },
    ];

    // calculate composite score + sort users
    const scoredUsers = sampleUsers.map((u) => ({
      ...u,
      score: calculateScore(u),
    }));

    setUsers(sortUsersByScore(scoredUsers));
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-10 relative overflow-hidden">
      {/* background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.07),_transparent_70%)] pointer-events-none" />

      {/* top dashboard */}
      <div className="w-full mb-6 z-20">
        <Dashboard />
      </div>

      <h1 className="text-4xl font-bold text-emerald-300 mb-2 tracking-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
        leaderboard
      </h1>
      <p className="text-slate-400 text-sm mb-8 italic">
        monthly reset • gold, silver, and bronze tiers
      </p>

      {/* main leaderboard table */}
      <LeaderboardTable users={users} currentUser={currentUser} />

      {/* back home button */}
      <Link
        to="/"
        className="mt-10 text-emerald-300/80 hover:text-emerald-200 font-medium transition"
      >
        ← back home
      </Link>
    </div>
  );
}
