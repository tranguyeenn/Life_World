export default function Dashboard() {
  const stats = JSON.parse(localStorage.getItem("petStats") || "{}");

  return (
    <div className="w-full flex flex-wrap justify-center gap-6 items-center text-sm font-medium py-2 px-4 bg-white/70 backdrop-blur-md border-b border-gray-300 shadow-sm text-gray-900">
      <span>
        😊 <strong className="text-yellow-600">Happiness:</strong>{" "}
        {stats.happiness ?? 0}
      </span>
      <span>
        ⚡ <strong className="text-amber-600">Energy:</strong>{" "}
        {stats.energy ?? 0}
      </span>
      <span>
        💰 <strong className="text-green-600">Coins:</strong>{" "}
        {stats.coins ?? 0}
      </span>
      <span>
        ⭐ <strong className="text-blue-600">XP:</strong> {stats.xp ?? 0}
      </span>
      <span>
        ⬆ <strong className="text-indigo-600">Level:</strong>{" "}
        {stats.level ?? 1}
      </span>

      <button
        onClick={() => {
          localStorage.clear();
          location.reload();
        }}
        className="ml-4 bg-red-500 text-white px-3 py-1 rounded-md text-xs hover:bg-red-600 transition"
      >
        Reset
      </button>
    </div>
  );
}

