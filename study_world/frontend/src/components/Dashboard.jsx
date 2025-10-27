export default function Dashboard() {
  const stats = JSON.parse(localStorage.getItem("petStats") || "{}");

  return (
    <div className="w-full flex flex-wrap justify-center gap-8 items-center text-sm font-medium py-3 px-6 bg-white/10 backdrop-blur-md border-b border-white/10 text-white shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <span className="flex items-center gap-1.5">
        <span className="text-yellow-300 text-base">😊</span>
        <span className="opacity-90">happiness:</span>
        <strong className="text-yellow-200">{stats.happiness ?? 0}</strong>
      </span>

      <span className="flex items-center gap-1.5">
        <span className="text-amber-300 text-base">⚡</span>
        <span className="opacity-90">energy:</span>
        <strong className="text-amber-200">{stats.energy ?? 0}</strong>
      </span>

      <span className="flex items-center gap-1.5">
        <span className="text-emerald-300 text-base">💰</span>
        <span className="opacity-90">coins:</span>
        <strong className="text-emerald-200">{stats.coins ?? 0}</strong>
      </span>

      <span className="flex items-center gap-1.5">
        <span className="text-indigo-300 text-base">⭐</span>
        <span className="opacity-90">xp:</span>
        <strong className="text-indigo-200">{stats.xp ?? 0}</strong>
      </span>

      <span className="flex items-center gap-1.5">
        <span className="text-sky-300 text-base">⬆</span>
        <span className="opacity-90">level:</span>
        <strong className="text-sky-200">{stats.level ?? 1}</strong>
      </span>
    </div>
  );
}


