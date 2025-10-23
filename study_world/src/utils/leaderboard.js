export function calculateTier(user) {
  const xp = user.xp || 0;
  if (xp >= 5000) return "Gold";
  if (xp >= 2500) return "Silver";
  return "Bronze";
}

export function calculateScore(user) {
  return (
    user.xp * 1.5 +
    user.coins * 0.3 +
    user.studyTime / 60 +
    (user.musicHours || 0) * 2 +
    (user.gamesPlayed || 0) * 5
  );
}

export function sortUsersByScore(users) {
  return [...users]
    .map((u) => ({ ...u, score: calculateScore(u) }))
    .sort((a, b) => b.score - a.score);
}

