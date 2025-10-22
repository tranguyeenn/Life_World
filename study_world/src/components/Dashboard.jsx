import { usePetStats } from "../utils/stats";

export default function Dashboard() {
  const [stats, setStats] = usePetStats();

  const handleReset = () => {
    if (window.confirm("Reset all stats and inventory?")) {
      localStorage.removeItem("petStats");
      localStorage.removeItem("inventory");
      setStats({
        happiness: 50,
        energy: 50,
        coins: 50,
        xp: 0,
        level: 1,
      });
      alert("Game reset!");
    }
  };

  return (
    <div id="dashboard" className="flex flex-wrap items-center justify-center gap-4 bg-white rounded-lg shadow-md px-6 py-3 mt-4">
      <div className="stat">😊 Happiness: <span>{stats.happiness}</span></div>
      <div className="stat">⚡ Energy: <span>{stats.energy}</span></div>
      <div className="stat">💰 Coins: <span>{stats.coins}</span></div>
      <div className="stat">⭐ XP: <span>{stats.xp}</span></div>
      <div className="stat">⬆ Level: <span>{stats.level}</span></div>

      <button
        id="reset-stats-btn"
        onClick={handleReset}
        className="bg-gray-900 text-white px-3 py-1 rounded-md hover:bg-gray-700 transition"
      >
        Reset
      </button>
    </div>
  );
}

