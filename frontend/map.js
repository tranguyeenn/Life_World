const TILE = 48;
const ROWS = 10;
const COLS = 10;

// Tile codes: 'F' floor, 'W' wall, 'B' bed, 'S' study, 'I' inventory, 'H' shop
// Border walls + interior layout. Player starts at (3,3).
const MAP = [
  "WWWWWWWWWW",
  "W  BBB   W",
  "W    BB  W",
  "W  A     W",
  "WSSS  IH W",
  "W        W",
  "W        W",
  "W        W",
  "W        W",
  "WWWWWWWWWW",
];

// DOM refs
const room = document.getElementById("room");
const tiles = document.getElementById("tiles");
const avatarEl = document.getElementById("avatar");
const tileLabel = document.getElementById("tile-label");

// Build the grid
function buildGrid() {
  tiles.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = document.createElement("div");
      t.classList.add("tile");
      const code = MAP[r][c];
      // Assign visual class
      if (code === "W") t.classList.add("tile-wall");
      else if (code === "B") t.classList.add("tile-bed");
      else if (code === "S") t.classList.add("tile-study");
      else if (code === "I") t.classList.add("tile-inv");
      else if (code === "H") t.classList.add("tile-shop");
      else t.classList.add("tile-floor");
      t.dataset.row = r;
      t.dataset.col = c;
      tiles.appendChild(t);
    }
  }
}

buildGrid();

// Find start position (A)
let player = { row: 0, col: 0 };
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (MAP[r][c] === "A") {
      player.row = r;
      player.col = c;
    }
  }
}

// Utility
function tileCodeAt(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return "W";
  return MAP[r][c] === "A" ? "F" : MAP[r][c]; // treat A as floor for movement
}

function isBlocked(r, c) {
  return tileCodeAt(r, c) === "W";
}

function setAvatarPosition() {
  avatarEl.style.top = `${player.row * TILE}px`;
  avatarEl.style.left = `${player.col * TILE}px`;
  updateTileLabel();
}

function currentTileType() {
  return tileCodeAt(player.row, player.col);
}

function labelFor(code) {
  switch (code) {
    case "B": return "Bed";
    case "S": return "Study Portal";
    case "I": return "Inventory Portal";
    case "H": return "Shop Portal";
    case "W": return "Wall";
    default: return "Floor";
  }
}

function updateTileLabel() {
  tileLabel.textContent = labelFor(currentTileType());
}

// Movement: 1 tile per arrow key
function tryMove(dr, dc) {
  const nr = player.row + dr;
  const nc = player.col + dc;
  if (!isBlocked(nr, nc)) {
    player.row = nr;
    player.col = nc;
    setAvatarPosition();
  }
}

function interact() {
  const code = currentTileType();
  if (code === "S") {
    window.location.href = "study.html";
    return;
  }
  if (code === "I") {
    window.location.href = "inventory.html";
    return;
  }
  if (code === "H") {
    window.location.href = "shop.html";
    return;
  }
  if (code === "B") {
    // Bed restores energy a bit and boosts happiness
    petStats.energy = Math.min(100, petStats.energy + 10);
    petStats.happiness = Math.min(100, petStats.happiness + 3);
    saveStats(petStats);
    updateDashboard();
    flashMessage("Rested in bed: +10 Energy, +3 Happiness");
  }
}

function flashMessage(msg) {
  const n = document.createElement("div");
  n.textContent = msg;
  n.style.position = "absolute";
  n.style.left = "50%";
  n.style.top = "8px";
  n.style.transform = "translateX(-50%)";
  n.style.background = "rgba(0,0,0,0.75)";
  n.style.color = "white";
  n.style.padding = "6px 10px";
  n.style.borderRadius = "8px";
  n.style.fontSize = "12px";
  n.style.zIndex = "10";
  room.appendChild(n);
  setTimeout(() => n.remove(), 1600);
}

// Controls
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") tryMove(-1, 0);
  if (e.key === "ArrowDown") tryMove(1, 0);
  if (e.key === "ArrowLeft") tryMove(0, -1);
  if (e.key === "ArrowRight") tryMove(0, 1);
  if (e.key === "Enter") interact();
});

// Focus the avatar for accessibility key events on some browsers
avatarEl.focus();
setAvatarPosition();
updateDashboard();