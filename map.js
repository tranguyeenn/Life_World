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

// Derived sizes
const ROWS = MAP.length;
const COLS = MAP[0].length;

// DOM
const room = document.getElementById("room");
const tiles = document.getElementById("tiles");
const avatarEl = document.getElementById("avatar");
const tileLabel = document.getElementById("tile-label");

// Read CSS --tile so mobile scaling stays in sync
function getTileSize() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--tile").trim();
  // strip px
  const n = parseFloat(v.replace("px",""));
  return Number.isFinite(n) ? n : 48;
}
let TILE = getTileSize();
window.addEventListener("resize", () => {
  TILE = getTileSize();
  setAvatarPosition(); // keep avatar aligned after media-query changes
});

// Build grid from MAP
function buildGrid() {
  tiles.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = document.createElement("div");
      t.classList.add("tile");
      const code = MAP[r][c];
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

// Find start position (A). Treat A as floor afterward.
let player = { row: 0, col: 0 };
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (MAP[r][c] === "A") {
      player.row = r;
      player.col = c;
    }
  }
}

function tileCodeAt(r, c) {
  if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return "W"; // outside = wall
  const code = MAP[r][c];
  return code === "A" ? "F" : code; // treat A as floor for logic
}

function labelFor(code) {
  switch (code) {
    case "B": return "Bed";
    case "S": return "Study Portal";
    case "I": return "Inventory Portal";
    case "H": return "Shop Portal";
    case "W": return "Wall";
    default:  return "Floor";
  }
}

function currentTileType() {
  return tileCodeAt(player.row, player.col);
}

function updateTileLabel() {
  tileLabel && (tileLabel.textContent = labelFor(currentTileType()));
}

// Smoothly position avatar
function setAvatarPosition() {
  avatarEl.style.top  = `${player.row * TILE}px`;
  avatarEl.style.left = `${player.col * TILE}px`;
  updateTileLabel();
}

// Walls block movement
function isBlocked(r, c) {
  return tileCodeAt(r, c) === "W";
}

// Smooth tile-based movement
let isMoving = false;
function tryMove(dr, dc) {
  if (isMoving) return; // prevent spamming during transition
  const nr = player.row + dr;
  const nc = player.col + dc;
  if (isBlocked(nr, nc)) return;

  isMoving = true;
  player.row = nr;
  player.col = nc;
  setAvatarPosition();

  // end movement lock after CSS transition ends (fallback timeout too)
  const unlock = () => { isMoving = false; avatarEl.removeEventListener("transitionend", unlock); };
  avatarEl.addEventListener("transitionend", unlock);
  setTimeout(unlock, 180); // safety
}

// Interactions
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
    // Bed: small restore
    petStats.energy = Math.min(100, petStats.energy + 10);
    petStats.happiness = Math.min(100, petStats.happiness + 3);
    saveStats(petStats);
    updateDashboard();
    flashMessage("Rested in bed: +10 Energy, +3 Happiness");
  }
}

// Tiny toast
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
  setTimeout(() => n.remove(), 1500);
}

/* ===== 2) CONTROLS ===== */

// Arrow keys
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp") tryMove(-1, 0);
  if (e.key === "ArrowDown") tryMove(1, 0);
  if (e.key === "ArrowLeft") tryMove(0, -1);
  if (e.key === "ArrowRight") tryMove(0, 1);
  if (e.key === "Enter") interact();
});

// Swipe (correct direction)
let touchStartX = 0, touchStartY = 0;
let touchEndX = 0, touchEndY = 0;
const swipeThreshold = 30; // px

window.addEventListener("touchstart", (e) => {
  const t = e.changedTouches[0];
  touchStartX = t.screenX;
  touchStartY = t.screenY;
}, { passive: true });

window.addEventListener("touchend", (e) => {
  const t = e.changedTouches[0];
  touchEndX = t.screenX;
  touchEndY = t.screenY;

  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;

  if (Math.abs(dx) < swipeThreshold && Math.abs(dy) < swipeThreshold) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    // horizontal
    if (dx > 0) tryMove(0, 1);   // right
    else        tryMove(0, -1);  // left
  } else {
    // vertical
    if (dy > 0) tryMove(1, 0);   // down
    else        tryMove(-1, 0);  // up
  }
}, { passive: true });

/* ===== 3) INIT ===== */
setAvatarPosition();
updateDashboard(); // from ui.js