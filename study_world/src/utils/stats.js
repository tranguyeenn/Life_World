import { useState, useEffect } from "react";

const defaultStats = {
  happiness: 50,
  energy: 50,
  coins: 50,
  xp: 0,
  level: 1,
};

export function usePetStats() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem("petStats");
    return saved ? JSON.parse(saved) : defaultStats;
  });

  useEffect(() => {
    localStorage.setItem("petStats", JSON.stringify(stats));
  }, [stats]);

  return [stats, setStats];
}