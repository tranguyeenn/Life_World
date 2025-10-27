import { useEffect, useState } from "react";
import "../styles/map.css";
import { useNavigate } from "react-router-dom";
import { usePetStats } from "../utils/stats";

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

export default function MapRoom() {
  const rows = MAP.length;
  const cols = MAP[0].length;
  const navigate = useNavigate();
  const [stats, setStats] = usePetStats();

  // Player position, persisted in localStorage
  const [player, setPlayer] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("playerPos") || "null");
    if (saved && typeof saved.row === "number" && typeof saved.col === "number")
      return saved;
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        if (MAP[r][c] === "A") return { row: r, col: c };
    return { row: 1, col: 1 };
  });

  const [tileLabel, setTileLabel] = useState("");

  const tileCode = (r, c) =>
    r < 0 || r >= rows || c < 0 || c >= cols ? "W" : MAP[r][c];

  const labelFor = (code) =>
    ({
      B: "Bed",
      S: "Study Portal",
      I: "Inventory Portal",
      H: "Shop Portal",
      W: "Wall",
    }[code] || "Floor");

  const isBlocked = (r, c) => tileCode(r, c) === "W";

  const move = (dr, dc) => {
    setPlayer((prev) => {
      const nr = prev.row + dr;
      const nc = prev.col + dc;
      if (isBlocked(nr, nc)) return prev;
      const code = tileCode(nr, nc);
      setTileLabel(labelFor(code));
      const newPos = { row: nr, col: nc };
      localStorage.setItem("playerPos", JSON.stringify(newPos));
      return newPos;
    });
  };

  const interact = () => {
    const code = tileCode(player.row, player.col);
    if (code === "S") navigate("/study");
    else if (code === "I") navigate("/inventory");
    else if (code === "H") navigate("/shop");
    else if (code === "B") {
      const updated = {
        ...stats,
        happiness: Math.min(100, stats.happiness + 10),
        energy: Math.min(100, stats.energy + 5),
      };
      setStats(updated);
      alert("Resting in bed successful!");
    } else alert("Nothing here.");
  };

  // Keyboard controls
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "ArrowUp") move(-1, 0);
      if (e.key === "ArrowDown") move(1, 0);
      if (e.key === "ArrowLeft") move(0, -1);
      if (e.key === "ArrowRight") move(0, 1);
      if (e.key === "Enter") interact();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  });

  const TILE = 48; // match your CSS
  const index = player.row * cols + player.col;

  return (
    <div className="flex flex-col items-center">
      <div id="hud" className="mb-2 font-semibold text-gray-700">
        {tileLabel || "Use arrow keys or tap to move"}
      </div>

      <div id="room">
        <div id="tiles">
          {MAP.map((row, r) =>
            row.split("").map((cell, c) => {
              let cls = "tile ";
              if (cell === "W") cls += "tile-wall";
              else if (cell === "B") cls += "tile-bed";
              else if (cell === "S") cls += "tile-study";
              else if (cell === "I") cls += "tile-inv";
              else if (cell === "H") cls += "tile-shop";
              else cls += "tile-floor";
              if (r * cols + c === index) cls += " active-tile";
              return <div key={`${r}-${c}`} className={cls}></div>;
            })
          )}
        </div>

        <div
          id="avatar"
          style={{
            top: `${player.row * TILE}px`,
            left: `${player.col * TILE}px`,
          }}
        ></div>
      </div>

      <button
        onClick={interact}
        className="mt-3 bg-white/70 backdrop-blur-sm px-4 py-2 rounded shadow"
      >
        Enter
      </button>
    </div>
  );
}