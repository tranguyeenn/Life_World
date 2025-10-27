import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../../components/Dashboard"; // keep your pet stats bar!

// === FETCH RANDOM 5-LETTER WORD FROM DATAMUSE ===
const fetchWord = async () => {
  try {
    const res = await fetch("https://api.datamuse.com/words?sp=?????&max=1000");
    const data = await res.json();
    const words = data
      .map((w) => w.word.toLowerCase())
      .filter((w) => /^[a-z]{5}$/.test(w));
    return words[Math.floor(Math.random() * words.length)];
  } catch {
    const fallback = ["apple", "chair", "light", "plant", "smile", "table"];
    return fallback[Math.floor(Math.random() * fallback.length)];
  }
};

// === VALIDATE WORD ===
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

  // === Handle keyboard input ===
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== "playing") return;
      const key = e.key.toLowerCase();

      if (key === "enter") submitGuess();
      else if (key === "backspace") setCurrentGuess((prev) => prev.slice(0, -1));
      else if (/^[a-z]$/.test(key) && currentGuess.length < 5) {
        if (lockedLetters[key] !== "absent") setCurrentGuess((prev) => prev + key);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameStatus, currentGuess, lockedLetters]);

  // === Submit guess ===
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

    const updatedLocked = { ...lockedLetters };
    currentGuess.split("").forEach((letter, i) => {
      if (letter === targetWord[i]) updatedLocked[letter] = "correct";
      else if (targetWord.includes(letter)) {
        if (updatedLocked[letter] !== "correct") updatedLocked[letter] = "present";
      } else updatedLocked[letter] = "absent";
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

  const getTileColor = (letter, index, guess) => {
    if (!targetWord || !guess) return "bg-slate-700/50";
    if (letter === targetWord[index]) return "bg-emerald-500";
    if (targetWord.includes(letter)) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getKeyColor = (letter) => {
    const state = lockedLetters[letter];
    if (state === "correct") return "bg-emerald-500 text-slate-900";
    if (state === "present") return "bg-yellow-500 text-slate-900";
    if (state === "absent") return "bg-red-600 opacity-70 cursor-not-allowed";
    return "bg-slate-600 hover:bg-slate-500";
  };

  const handleKeyPress = (key) => {
    if (gameStatus !== "playing") return;
    if (key === "enter") return submitGuess();
    if (key === "⌫") return setCurrentGuess((prev) => prev.slice(0, -1));
    if (/^[a-z]$/.test(key) && currentGuess.length < 5 && lockedLetters[key] !== "absent") {
      setCurrentGuess((prev) => prev + key);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start text-white bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 relative">
      {/* === STICKY DASHBOARD BAR === */}
      <div className="fixed top-0 left-0 w-full bg-slate-900/70 backdrop-blur-md border-b border-slate-700 z-50">
        <Dashboard />
      </div>

      {/* === MAIN CONTENT === */}
      <div className="pt-20 flex flex-col items-center w-full">
        <h1 className="text-3xl font-semibold mb-2 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">
          wordle 🎯
        </h1>
        <p className="text-slate-400 italic text-xs mb-4">
          green = correct • yellow = misplaced • red = absent
        </p>

        {/* === BOARD === */}
        <div className="grid gap-1 mb-2 scale-[0.95] md:scale-100">
          {Array.from({ length: 6 }).map((_, rowIndex) => {
            const guess = guesses[rowIndex] || "";
            const isCurrent = rowIndex === guesses.length;
            const letters = isCurrent ? currentGuess.padEnd(5) : guess.padEnd(5);

            return (
              <div key={rowIndex} className="flex gap-1 justify-center">
                {letters.split("").map((letter, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 md:w-12 md:h-12 border border-slate-600 flex items-center justify-center text-lg md:text-xl font-semibold rounded-md transition-colors ${
                      guess ? getTileColor(letter, i, guess) : "bg-slate-700/50"
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
          <div className="text-red-400 font-semibold text-xs mb-2 animate-pulse">
            {errorMsg}
          </div>
        )}

        {/* === QWERTY KEYBOARD === */}
        <div className="mt-2 flex flex-col items-center gap-1 md:gap-2">
          {[
            ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
            ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
            ["enter", "z", "x", "c", "v", "b", "n", "m", "⌫"],
          ].map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-1 justify-center">
              {row.map((key) => (
                <button
                  key={key}
                  disabled={lockedLetters[key] === "absent"}
                  onClick={() => handleKeyPress(key)}
                  className={`rounded-md font-semibold text-xs md:text-sm px-2 md:px-3 py-2 md:py-2.5 transition-all shadow-sm ${
                    key === "enter"
                      ? "bg-emerald-500 text-slate-900 hover:bg-emerald-400 w-[50px] md:w-[60px]"
                      : key === "⌫"
                      ? "bg-rose-500 text-slate-900 hover:bg-rose-400 w-[50px] md:w-[60px]"
                      : `${getKeyColor(key)} w-[30px] md:w-[36px]`
                  }`}
                >
                  {key.toUpperCase()}
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* === GAME END === */}
        {gameStatus !== "playing" && (
          <div className="mt-5 text-center">
            {gameStatus === "won" ? (
              <p className="text-emerald-400 text-base font-semibold">
                You guessed it! 🎉
              </p>
            ) : (
              <p className="text-red-400 text-base font-semibold">
                You lost. The word was{" "}
                <span className="text-white">{targetWord.toUpperCase()}</span>.
              </p>
            )}
            <button
              onClick={restart}
              className="mt-3 bg-emerald-400/90 hover:bg-emerald-300 text-slate-900 px-5 py-2 rounded-md font-semibold text-sm transition-all active:scale-[0.97]"
            >
              Play Again
            </button>
          </div>
        )}

        <Link
          to="/games"
          className="mt-5 mb-8 flex items-center gap-1 text-emerald-300/90 font-medium hover:text-emerald-300 transition-all text-sm"
        >
          ← back to games room
        </Link>
      </div>
    </div>
  );
}
