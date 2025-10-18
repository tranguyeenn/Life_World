let duration = 25 * 60; // default 25 minutes
let remaining = duration;
let timerInterval = null;

const display = document.getElementById("time-display");
const rewardBox = document.getElementById("reward-box");
const rewardText = document.getElementById("reward-text");

const startBtn = document.getElementById("start-btn");
const pauseBtn = document.getElementById("pause-btn");
// ✅ renamed to avoid conflict
const resetTimerBtn = document.getElementById("reset-btn");
const applyTimeBtn = document.getElementById("apply-time-btn");
const minInput = document.getElementById("minutes-input");
const secInput = document.getElementById("seconds-input");

// Format time
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// Update display
function updateDisplay() {
  display.textContent = formatTime(remaining);
}

// ✅ SET TIME BUTTON FIXED
applyTimeBtn.onclick = () => {
  const mins = parseInt(minInput.value) || 0;
  const secs = parseInt(secInput.value) || 0;

  const total = mins * 60 + secs;
  if (total <= 0) {
    alert("Please enter a time greater than 0.");
    return;
  }

  duration = total;
  remaining = total;
  rewardBox.style.display = "none";
  updateDisplay();
  console.log("New duration set to:", duration);
};

// Start Timer
function startTimer() {
  if (timerInterval) return;
  timerInterval = setInterval(() => {
    remaining--;
    updateDisplay();
    if (remaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      sessionComplete();
    }
  }, 1000);
}

// Pause Timer
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
}

// Reset Timer
function resetTimer() {
  pauseTimer();
  remaining = duration;
  rewardBox.style.display = "none";
  updateDisplay();
}

// XP Leveling Logic
function addXP(amount) {
  petStats.xp += amount;
  let required = petStats.level * 100;
  while (petStats.xp >= required) {
    petStats.xp -= required;
    petStats.level++;
    petStats.happiness = Math.min(100, petStats.happiness + 5);
    flashMessage("Level Up! 🎉");
    required = petStats.level * 100;
  }
}

// Flash Message
function flashMessage(msg) {
  const note = document.createElement("div");
  note.textContent = msg;
  note.style.position = "fixed";
  note.style.top = "10px";
  note.style.left = "50%";
  note.style.transform = "translateX(-50%)";
  note.style.background = "rgba(0,0,0,0.8)";
  note.style.color = "white";
  note.style.padding = "6px 10px";
  note.style.borderRadius = "8px";
  note.style.fontSize = "14px";
  note.style.zIndex = "9999";
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 1500);
}

// Rewards Logic
function sessionComplete() {
  rewardBox.style.display = "block";

  const totalMinutes = duration / 60;
  let coinsEarned = totalMinutes * 1;
  let xpEarned = totalMinutes * 2;

  if (totalMinutes >= 30) {
    coinsEarned += 5;
    xpEarned += 5;
  }
  if (totalMinutes >= 60) {
    coinsEarned += 10;
    xpEarned += 10;
    petStats.happiness = Math.min(100, petStats.happiness + 5);
  }

  petStats.coins += Math.floor(coinsEarned);
  addXP(Math.floor(xpEarned));

  saveStats(petStats);
  updateDashboard();

  rewardText.textContent = `+${Math.floor(coinsEarned)} Coins, +${Math.floor(xpEarned)} XP`;
}

startBtn.onclick = startTimer;
pauseBtn.onclick = pauseTimer;
resetTimerBtn.onclick = resetTimer; // ✅ fixed

// Init
updateDisplay();
updateDashboard();