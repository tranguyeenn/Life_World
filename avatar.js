const defaultStats = {
    happiness: 50,
    energy: 50,
    coins: 50,
    xp: 0,
    level: 1,
};

function loadStats() {
    const saved = localStorage.getItem("petStats");
    if (saved) return JSON.parse(saved);
    localStorage.setItem("petStats", JSON.stringify(defaultStats));
    return { ...defaultStats };
}

function saveStats(stats) {
    localStorage.setItem("petStats", JSON.stringify(stats));
}

let petStats = loadStats();

function updateDashboard() {
    document.getElementById("happiness").textContent = petStats.happiness;
    document.getElementById("energy").textContent = petStats.energy;
    document.getElementById("coins").textContent = petStats.coins;
    document.getElementById("xp").textContent = petStats.xp;
    document.getElementById("level").textContent = petStats.level;
}

function addXP(amount) {
  petStats.xp += amount;

  const required = petStats.level * 100;
  if (petStats.xp >= required) {
    petStats.xp -= required;
    petStats.level++;
    // (Optional) reward for leveling up
    petStats.happiness += 5;
    flashMessage("Level Up! 🎉");
  }

  saveStats(petStats);
  updateDashboard();
}

updateDashboard();