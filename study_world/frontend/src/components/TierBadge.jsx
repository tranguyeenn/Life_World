export default function TierBadge({ tier }) {
  const styles = {
    Gold: "text-yellow-300 border-yellow-400/40 bg-yellow-300/10",
    Silver: "text-gray-300 border-gray-400/40 bg-gray-300/10",
    Bronze: "text-amber-500 border-amber-400/40 bg-amber-400/10",
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full border ${styles[tier] || "text-white border-white/30 bg-white/10"}`}
    >
      {tier}
    </span>
  );
}
