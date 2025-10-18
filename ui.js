function updateDashboard() {
    document.getElementById("happiness").textContent = petStats.happiness;
    document.getElementById("energy").textContent = petStats.energy;
    document.getElementById("coins").textContent = petStats.coins;
    document.getElementById("xp").textContent = petStats.xp;
    document.getElementById("level").textContent = petStats.level;
}

const resetBtn = document.getElementById("reset-stats-btn");
if (resetBtn) {
  resetBtn.onclick = () => {
    if (confirm("Reset all stats and inventory?")) {
      localStorage.removeItem("petStats");
      localStorage.removeItem("inventory");
      petStats = loadStats(); // from avatar.js
      updateDashboard();
      alert("Game reset!");
    }
  };
}

updateDashboard();