const MAP = [
  "WWWWWWWWWW",
  "WA SSSS  W",
  "W   SS   W",
  "W        W",
  "WBBB     W",
  "W        W",
  "W     IH W",
  "W        W",
  "W        W",
  "WWWWWWWWWW",
];

const ROWS = MAP.length;
const COLS = MAP[0].length;

const tiles = document.getElementById("tiles");
const avatarEl = document.getElementById("avatar");
const tileLabel = document.getElementById("tile-label");
const interactBtn = document.getElementById("interact-btn");

function getTileSize() {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--tile").trim();
  return parseFloat(v) || 48;
}
let TILE = getTileSize();
window.addEventListener("resize", () => {
  TILE = getTileSize();
  setAvatarPosition();
});

/* ==== BUILD GRID with center-study detection ==== */
(function buildGrid() {
  tiles.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const t = document.createElement("div");
      t.classList.add("tile");

      const code = MAP[r][c];

      if (code === "W") {
        t.classList.add("tile-wall");
      } else if (code === "B") {
        t.classList.add("tile-bed");
      } else if (code === "S") {
        // Check if this S is center of SSS (left S and right S)
        const left = MAP[r][c - 1] === "S";
        const right = MAP[r][c + 1] === "S";
        const center = left && right; // middle S
        t.classList.add("tile-study");
        if (center) t.classList.add("tile-study-label");  // ONLY middle one will show "STUDY"
      } else if (code === "I") {
        t.classList.add("tile-inv");
      } else if (code === "H") {
        t.classList.add("tile-shop");
      } else {
        t.classList.add("tile-floor");
      }

      t.dataset.row = r;
      t.dataset.col = c;
      tiles.appendChild(t);
    }
  }
})();

/* ==== FIND PLAYER START ==== */
let player = { row: 0, col: 0 };
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (MAP[r][c] === "A") {
      player.row = r;
      player.col = c;
    }
  }
}

/* ==== HELPERS ==== */
function tileCode(r,c) {
  if (r<0 || r>=ROWS || c<0 || c>=COLS) return "W";
  const code = MAP[r][c];
  return code === "A" ? " " : code;
}

function labelFor(code) {
  switch(code) {
    case "B": return "Bed";
    case "S": return "Study Portal";
    case "I": return "Inventory Portal";
    case "H": return "Shop Portal";
    case "W": return "Wall";
    default:  return "Floor";
  }
}

function updateLabel() {
  const code = tileCode(player.row, player.col);
  tileLabel.textContent = labelFor(code);
}

function highlightTile() {
  document.querySelectorAll('.tile').forEach(t => t.classList.remove('active-tile'));
  const index = player.row * COLS + player.col;
  const tile = tiles.children[index];
  if (tile) tile.classList.add('active-tile');
}

function setAvatarPosition() {
  avatarEl.style.top = `${player.row * TILE}px`;
  avatarEl.style.left = `${player.col * TILE}px`;
  updateLabel();
  highlightTile();
}

function isBlocked(r,c) {
  return tileCode(r,c) === "W";
}

/* ==== MOVEMENT ==== */
let isMoving = false;
function tryMove(dr,dc) {
  if (isMoving) return;
  const nr = player.row + dr;
  const nc = player.col + dc;
  if (isBlocked(nr,nc)) return;

  isMoving = true;
  player.row = nr;
  player.col = nc;
  setAvatarPosition();

  const unlock = () => {
    isMoving = false;
    avatarEl.removeEventListener("transitionend", unlock);
  };
  avatarEl.addEventListener("transitionend", unlock);
  setTimeout(unlock, 200);
}

/* ==== INTERACT ==== */
function interact() {
  const code = tileCode(player.row, player.col);

  localStorage.setItem("playerPos", JSON.stringify({row: player.row, col: player.col }));

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
    petStats.happiness = Math.min(100, petStats.happiness + 10);
    petStats.energy = Math.min(100, petStats.energy + 5);

    saveStats(petStats)
    updateDashboard();
  
    flashMessage("Resting in bed successful!");
    return;
  }
  flashMessage("Nothing here.");
}

let players = {row: 0, col: 0};
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    if (MAP[r][c] === "A") {
      player.row = r;
      player.col = c;
    }
  }
}

const savedPos = JSON.parse(localStorage.getItem("playerPos") || "null");
if (savedPos && typeof savedPos.row === "number" && typeof savedPos.col === "number") {
  player.row = savedPos.row;
  player.col = savedPos.col;
}

function flashMessage(msg) {
  const note = document.createElement("div");
  note.textContent = msg;
  note.style.position = "absolute";
  note.style.left = "50%";
  note.style.top = "8px";
  note.style.transform = "translateX(-50%)";
  note.style.background = "rgba(0,0,0,0.7)";
  note.style.color = "#fff";
  note.style.padding = "6px 12px";
  note.style.borderRadius = "6px";
  note.style.fontSize = "12px";
  note.style.zIndex = "50";
  document.body.appendChild(note);
  setTimeout(() => note.remove(), 1500);
}

/* ==== CONTROLS ==== */
document.addEventListener("keydown", e => {
  if (e.key === "ArrowUp") tryMove(-1,0);
  if (e.key === "ArrowDown") tryMove(1,0);
  if (e.key === "ArrowLeft") tryMove(0,-1);
  if (e.key === "ArrowRight") tryMove(0,1);
  if (e.key === "Enter") interact();
});

// Swipe support
let startX=0, startY=0;
window.addEventListener("touchstart", e => {
  const t = e.changedTouches[0];
  startX = t.screenX;
  startY = t.screenY;
}, {passive:true});

window.addEventListener("touchend", e => {
  const t = e.changedTouches[0];
  const dx = t.screenX - startX;
  const dy = t.screenY - startY;
  const threshold=30;

  if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) tryMove(0,1);
    else        tryMove(0,-1);
  } else {
    if (dy > 0) tryMove(1,0);
    else        tryMove(-1,0);
  }
}, {passive:true});

// Mobile Enter button
if (interactBtn) {
  interactBtn.addEventListener("click", interact);
}

// Init
setAvatarPosition();
if (typeof updateDashboard === "function") updateDashboard();