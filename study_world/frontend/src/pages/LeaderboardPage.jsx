import React, { useState, useEffect } from "react";
import Dashboard from "../components/Dashboard";
import LeaderboardTable from "../components/LeaderboardTable";
import { sortUsersByScore, calculateScore } from "../utils/leaderboard";
import { Link } from "react-router-dom";
import supabase from '/src/utils/supabaseClient.js'

export default function LeaderboardPage() {
  const [users, setUsers] = useState([]);
  const currentUser = "Trang"; // you’ll replace this later with Supabase Auth user data
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      setLoading(true);
      try {
        // Fetch users from your Supabase 'users' table
        const { data, error } = await supabase
          .from("users")
          .select("id, name, xp, coins, level, created_at");

        if (error) throw error;

        // If users exist, compute composite scores
        const scoredUsers = data.map((u) => ({
          username: u.name || "Unknown",
          avatar: "/avatar.png",
          level: u.level || 1,
          xp: u.xp || 0,
          coins: u.coins || 0,
          studyTime: 0, // placeholder until you track it
          musicHours: 0,
          gamesPlayed: 0,
          score: calculateScore(u),
        }));

        // Sort by total score
        const sorted = sortUsersByScore(scoredUsers);
        setUsers(sorted);
      } catch (err) {
        console.error("Error fetching leaderboard:", err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center py-10 relative overflow-hidden">
      {/* background gradient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.07),_transparent_70%)] pointer-events-none" />

      <div className="w-full mb-6 z-20">
        <Dashboard />
      </div>

      <h1 className="text-4xl font-bold text-emerald-300 mb-2 tracking-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
        leaderboard
      </h1>
      <p className="text-slate-400 text-sm mb-8 italic">
        monthly reset • gold, silver, and bronze tiers
      </p>

      {loading ? (
        <p className="text-slate-400 italic mt-10">loading leaderboard...</p>
      ) : (
        <LeaderboardTable users={users} currentUser={currentUser} />
      )}

      <Link
        to="/home"
        className="z-50 mt-12 mb-8 flex items-center gap-2 text-emerald-300/90 font-medium hover:text-emerald-300 transition-all"
      >
        ← back to map
      </Link>
    </div>
  );
}
