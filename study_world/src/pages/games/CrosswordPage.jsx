import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../../components/Dashboard";

// === FETCH WORDS FROM DATAMUSE ===
const getWordList = async (len = 5, count = 4) => {
  try {
    const res = await fetch(`https://api.datamuse.com/words?sp=${"?".repeat(len)}&max=${count * 2}`);
    const data = await res.json();
    const words = data
      .map((w) => w.word.toLowerCase())
      .filter((w) => /^[a-z]+$/.test(w))
      .slice(0, count);
    return words;
  } catch {
    return ["apple", "chair", "water", "smile"];
  }
};

// === FETCH CLUES FROM FREE DICTIONARY OR DATAMUSE ===
const getClue = async (word) => {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if (!res.ok) throw new Error();
    const data = await res.json();
    const defs = data[0]?.meanings?.[0]?.definitions || [];
    return defs[0]?.definition || "No clue found.";
  } catch {
    const r = await fetch(`https://api.datamuse.com/words?ml=${word}&max=1`);
    const d = await r.json();
    return d[0]?.word ? `Synonym for ${d[0].word}` : "No clue found.";
  }
};

export default function CrosswordPage() {
  const [grid, setGrid] = useState([]);
  const [clues, setClues] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [inputGrid, setInputGrid] = useState([]);
  const [solved, setSolved] = useState(false);

  // === INITIALIZE MINI CROSSWORD ===
  useEffect(() => {
    (async () => {
      const words = await getWordList(5, 4);
      const selected = words.slice(0, 4);
      const cluesArr = await Promise.all(selected.map((w) => getClue(w)));

      // Simple layout (5x5 cross structure)
      const g = Array(5)
        .fill(null)
        .map(() => Array(5).fill("#"));
      const ans = Array(5)
        .fill(null)
        .map(() => Array(5).fill(""));

      // Word placements (rudimentary pattern)
      for (let i = 0; i < 5; i++) {
        g[0][i] = selected[0][i];
        ans[0][i] = selected[0][i];
      }
      for (let i = 0; i < 5; i++) {
        g[i][2] = selected[1][i];
        ans[i][2] = selected[1][i];
      }
      for (let i = 0; i < 5; i++) {
        g[3][i] = selected[2][i];
        ans[3][i] = selected[2][i];
      }
      for (let i = 0; i < 5; i++) {
        g[i][4] = selected[3][i];
        ans[i][4] = selected[3][i];
      }

      setGrid(g);
      setAnswers(ans);
      setInputGrid(
        g.map((row) => row.map((c) => (c === "#" ? "#" : "")))
      );
      setClues([
        { num: 1, dir: "Across", word: selected[0], clue: cluesArr[0] },
        { num: 2, dir: "Down", word: selected[1], clue: cluesArr[1] },
        { num: 3, dir: "Across", word: selected[2], clue: cluesArr[2] },
        { num: 4, dir: "Down", word: selected[3], clue: cluesArr[3] },
      ]);
    })();
  }, []);

  const handleInput = (r, c, val) => {
    if (grid[r][c] === "#") return;
    const v = val.toLowerCase().slice(-1);
    const newGrid = inputGrid.map((row) => [...row]);
    newGrid[r][c] = /^[a-z]$/.test(v) ? v : "";
    setInputGrid(newGrid);
  };

  const checkAnswers = () => {
    let correct = true;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (answers[r][c] !== "#" && inputGrid[r][c] !== answers[r][c])
          correct = false;
      }
    }
    setSolved(correct);
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-white bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.08),_transparent_70%)] pointer-events-none" />
      <div className="w-full z-20">
        <Dashboard />
      </div>

      <h1 className="text-4xl font-semibold mt-8 mb-3 text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
        mini crossword 🧩
      </h1>
      <p className="text-slate-400 mb-8 italic text-sm">
        fill in the boxes using clues below — all real words & definitions
      </p>

      {/* === GRID === */}
      <div className="grid grid-cols-5 gap-1 mb-6">
        {inputGrid.map((row, r) =>
          row.map((cell, c) => (
            <input
              key={`${r}-${c}`}
              maxLength={1}
              value={cell === "#" ? "" : cell.toUpperCase()}
              disabled={cell === "#"}
              onChange={(e) => handleInput(r, c, e.target.value)}
              className={`w-12 h-12 text-center text-xl font-bold rounded-md border ${
                cell === "#"
                  ? "bg-slate-800 border-slate-900"
                  : "bg-slate-700 border-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              }`}
            />
          ))
        )}
      </div>

      <button
        onClick={checkAnswers}
        className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-6 py-2 rounded-md font-semibold transition-all active:scale-[0.97]"
      >
        Check Answers
      </button>

      {solved && (
        <p className="mt-4 text-emerald-400 font-semibold text-lg">
          All correct! You solved the crossword 🎉
        </p>
      )}

      {/* === CLUES === */}
      <div className="mt-10 bg-slate-800/60 rounded-xl p-6 w-[90%] max-w-xl shadow-lg border border-slate-700/60">
        <h2 className="text-emerald-300 font-semibold text-xl mb-3">Clues</h2>
        {clues.map((c) => (
          <div key={c.num} className="mb-2">
            <p className="text-slate-300">
              <span className="text-emerald-400 font-semibold">
                {c.num}. ({c.dir})
              </span>{" "}
              {c.clue}
            </p>
          </div>
        ))}
      </div>

      <Link
        to="/games"
        className="mt-12 mb-8 flex items-center gap-1 text-emerald-300/90 font-medium hover:text-emerald-300 transition-all"
      >
        ← back to games room
      </Link>
    </div>
  );
}
