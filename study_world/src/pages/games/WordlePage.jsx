import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../../components/Dashboard";

// === FETCH RANDOM 5-LETTER WORD FROM DATAMUSE ===
const fetchWord = async () => {
  try {
    const res = await fetch("https://api.datamuse.com/words?sp=?????&max=1000");
    const data = await res.json();
    const words = data
      .map((w) => w.word.toLowerCase())
      .filter((w) => /^[a-z]+$/.test(w));
    return words[Math.floor(Math.random() * words.length)];
  } catch (err) {
    console.error("Datamuse failed:", err);
    const fallback = ["apple", "chair", "light", "plant", "smile", "table"];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
};

// === VALIDATE WORD USING DICTIONARYAPI.DEV ===
const isRealWord = async (word) => {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return res.ok;
  } catch {
    return false;
  }
};

export default function WordlePage() {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameStatus, setGameStatus] = useState("playing");
  const [lockedLetters, setLockedLetters] = useState({});
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetchWord().then(setTargetWord);
  }, []);

  // === PHYSICAL KEYBOARD HANDLING ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== "playing") return;
      const key = e.key.toLowerCase();

      if (key === "enter") {
        submitGuess();
      } else if (key === "backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
      } else if (/^[a-z]$/.test(key) && currentGuess.length < 5) {
        if (lockedLetters[key] === "absent") return;
        setCurrentGuess((prev) => prev + key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStatus, currentGuess, guesses, targetWord, lockedLetters]);

  // === SUBMIT GUESS ===
  const submitGuess = async () => {
    if (currentGuess.length !== 5) return;
    const valid = await isRealWord(currentGuess);
    if (!valid) {
      setErrorMsg("Not a real word!");
      setTimeout(() => setErrorMsg(""), 1500);
      return;
    }

    const updated = [...guesses, currentGuess];
    setGuesses(updated);

    // Update keyboard color states
    const updatedLocked = { ...lockedLetters };
    currentGuess.split("").forEach((letter, i) => {
      if (letter === targetWord[i]) updatedLocked[letter] = "correct";
      else if (targetWord.includes(letter)) {
        if (updatedLocked[letter] !== "correct") updatedLocked[letter] = "present";
      } else {
        updatedLocked[letter] = "absent";
      }
    });
    setLockedLetters(updatedLocked);

    if (currentGuess === targetWord) setGameStatus("won");
    else if (updated.length === 6) setGameStatus("lost");

    setCurrentGuess("");
  };

  const restart = () => {
    setGuesses([]);
    setCurrentGuess("");
    setGameStatus("playing");
    setLockedLetters({});
    setErrorMsg("");
    fetchWord().then(setTargetWord);
  };

  // === TILE COLOR LOGIC ===
  const getTileColor = (letter, index, guess) => {
    if (!targetWord || !guess) return "bg-slate-700/50";
    if (letter === targetWord[index]) return "bg-emerald-500";
    if (targetWord.includes(letter)) return "bg-yellow-500";
    return "bg-red-500";
  };

  // === KEYBOARD COLOR ===
  const getKeyColor = (letter) => {
    const state = lockedLetters[letter];
    if (state === "correct") return "bg-emerald-500";
    if (state === "present") return "bg-yellow-500";
    if (state === "absent") return "bg-red-600 opacity-70 cursor-not-allowed";
    return "bg-slate-600 hover:bg-slate-500";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      <div className="w-full z-20">
        <Dashboard />
      </div>

      <h1 className="text-4xl font-semibold mt-6 mb-4 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
        wordle 🎯
      </h1>
      <p className="text-slate-400 italic text-sm mb-6">
        green = right spot, yellow = wrong spot, red = not in word
      </p>

      {/* === BOARD === */}
      <div className="grid gap-2 mb-4">
        {Array.from({ length: 6 }).map((_, rowIndex) => {
          const guess = guesses[rowIndex] || "";
          const isCurrent = rowIndex === guesses.length;
          const letters = isCurrent ? currentGuess.padEnd(5) : guess.padEnd(5);

          return (
            <div key={rowIndex} className="flex gap-2 justify-center">
              {letters.split("").map((letter, i) => (
                <div
                  key={i}
                  className={`w-12 h-12 border border-slate-600 flex items-center justify-center text-xl font-semibold rounded-md transition-colors ${
                    guess
                      ? getTileColor(letter, i, guess)
                      : "bg-slate-700/50"
                  }`}
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {errorMsg && (
        <div className="text-red-400 font-semibold text-sm mb-2 animate-pulse">
          {errorMsg}
        </div>
      )}

      {/* === ON-SCREEN KEYBOARD === */}
      <div className="flex flex-wrap justify-center gap-2 max-w-md">
        {"qwertyuiopasdfghjklzxcvbnm".split("").map((key) => (
          <button
            key={key}
            disabled={lockedLetters[key] === "absent"}
            onClick={() => {
              if (
                currentGuess.length < 5 &&
                gameStatus === "playing" &&
                lockedLetters[key] !== "absent"
              ) {
                setCurrentGuess((prev) => prev + key);
              }
            }}
            className={`${getKeyColor(key)} rounded-md w-8 h-10 font-semibold text-sm transition-colors`}
          >
            {key.toUpperCase()}
          </button>
        ))}
        <button
          onClick={submitGuess}
          className="bg-emerald-500 hover:bg-emerald-400 rounded-md px-3 font-semibold text-sm"
        >
          Enter
        </button>
        <button
          onClick={() => setCurrentGuess((prev) => prev.slice(0, -1))}
          className="bg-red-500 hover:bg-red-400 rounded-md px-3 font-semibold text-sm"
        >
          ⌫
        </button>
      </div>

      {/* === GAME END === */}
      {gameStatus !== "playing" && (
        <div className="mt-8 text-center">
          {gameStatus === "won" ? (
            <p className="text-emerald-400 text-lg font-semibold">
              You guessed it! 🎉
            </p>
          ) : (
            <p className="text-red-400 text-lg font-semibold">
              You lost. The word was{" "}
              <span className="text-white">{targetWord.toUpperCase()}</span>.
            </p>
          )}
          <button
            onClick={restart}
            className="mt-4 bg-emerald-400/90 hover:bg-emerald-300 text-slate-900 px-6 py-2 rounded-md font-semibold transition-all active:scale-[0.97]"
          >
            Play Again
          </button>
        </div>
      )}

      <Link
        to="/games"
        className="mt-10 mb-8 flex items-center gap-1 text-emerald-300/90 font-medium hover:text-emerald-300 transition-all"
      >
        ← back to games room
      </Link>
    </div>
  );
}