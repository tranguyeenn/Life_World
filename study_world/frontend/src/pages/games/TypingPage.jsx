import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../../components/Dashboard";
import { usePetStats } from "../../utils/stats";

export default function TypingPage() {
  // === FETCH WORDS ===
  const fetchWords = async (count = 50) => {
    try {
      const res = await fetch(`https://api.datamuse.com/words?sp=?????&max=${count * 2}`);
      const data = await res.json();

      const clean = data
        .map((w) => w.word.toLowerCase())
        .filter((w) => /^[a-z]+$/.test(w));

      // shuffle words
      for (let i = clean.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [clean[i], clean[j]] = [clean[j], clean[i]];
      }

      return clean.slice(0, count);
    } catch (err) {
      console.error("Datamuse failed, falling back to local list:", err);
      const fallback = ["apple", "chair", "table", "water", "music", "plant", "light", "dream", "train", "green"];
      return fallback.sort(() => Math.random() - 0.5).slice(0, count);
    }
  };

  // === STATES ===
  const [stats, setStats] = usePetStats();
  const [words, setWords] = useState([]);
  const [input, setInput] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correctWords, setCorrectWords] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [petReaction, setPetReaction] = useState(null);

  // === REFS ===
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const wordRefs = useRef([]);

  // === INITIAL FETCH ===
  useEffect(() => {
    (async () => {
      setWords(await fetchWords(50));
    })();
  }, []);

  // === TIMER HANDLER ===
  useEffect(() => {
    if (!started) return;
    if (timeLeft <= 0) return finishTest();

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [started, timeLeft]);

  // === SCROLL HANDLER ===
  const ensureActiveWordVisible = (index) => {
    const container = containerRef.current;
    const el = wordRefs.current[index];
    if (!container || !el) return;

    const padding = 40;
    const elLeft = el.offsetLeft;
    const elRight = elLeft + el.offsetWidth;
    const viewLeft = container.scrollLeft;
    const viewRight = viewLeft + container.clientWidth;

    if (elLeft < viewLeft + padding) {
      container.scrollLeft = Math.max(0, elLeft - padding);
    } else if (elRight > viewRight - padding) {
      container.scrollLeft = elRight - container.clientWidth + padding;
    }
  };

  // === INPUT HANDLER ===
  const handleInput = (e) => {
    if (!started) setStarted(true);
    const val = e.target.value;
    setInput(val);

    if (val.endsWith(" ")) {
      checkWord(val.trim());
      setInput("");

      setCurrentWordIndex((i) => {
        const next = i + 1;
        if (next >= words.length - 10) {
          fetchWords(40).then((newWords) => setWords((prev) => [...prev, ...newWords]));
        }
        setTimeout(() => ensureActiveWordVisible(next), 0);
        return next;
      });
    }
  };

  // === WORD CHECK ===
  const checkWord = (typed) => {
    setTotalTyped((prev) => prev + 1);
    if (typed === words[currentWordIndex]) setCorrectWords((prev) => prev + 1);
  };

  // === END TEST ===
  const finishTest = () => {
    setFinished(true);
    const elapsed = 60 - timeLeft || 1;
    const wpm = Math.round((totalTyped / elapsed) * 60);
    const accuracy = totalTyped ? Math.round((correctWords / totalTyped) * 100) : 0;

    let xpGain, coinGain, reaction;
    if (wpm > 85) {
      xpGain = Math.floor(wpm * (accuracy / 100));
      coinGain = Math.floor(wpm / 4);
      reaction = "“you type like a caffeinated god.” 😼";
    } else if (wpm >= 60) {
      xpGain = Math.floor(wpm * 0.5);
      coinGain = Math.floor(wpm / 8);
      reaction = "“not bad, keyboard warrior.” 😏";
    } else {
      xpGain = 1;
      coinGain = 1;
      reaction = "“slow and steady still counts.” 😿";
    }

    const updated = {
      ...stats,
      xp: stats.xp + xpGain,
      coins: stats.coins + coinGain,
      happiness: Math.min(100, stats.happiness + 5),
    };
    setStats(updated);
    localStorage.setItem("petStats", JSON.stringify(updated));

    setPetReaction({ text: reaction, xpGain, coinGain, wpm, accuracy });
  };

  // === RESTART ===
  const restart = async () => {
    setFinished(false);
    setStarted(false);
    setCorrectWords(0);
    setTotalTyped(0);
    setTimeLeft(60);
    setInput("");
    setCurrentWordIndex(0);
    setWords(await fetchWords(50));
    if (containerRef.current) containerRef.current.scrollLeft = 0;
    wordRefs.current = [];
  };

  // === RENDER ===
  return (
    <div className="min-h-screen flex flex-col items-center text-white bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.08),_transparent_70%)] pointer-events-none" />

      <div className="w-full z-20">
        <Dashboard />
      </div>

      <h1 className="text-4xl font-semibold mt-8 mb-3 text-emerald-300 drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]">
        typing test ⌨️
      </h1>
      <p className="text-slate-400 mb-8 italic text-sm">
        keep typing until the clock mercy-kills the round
      </p>

      {!finished && (
        <div className="flex gap-8 mb-6 text-slate-300 text-sm font-medium">
          <p>
            Time left:{" "}
            <span className="text-emerald-300 font-semibold">{timeLeft}s</span>
          </p>
          <p>
            Words:{" "}
            <span className="text-emerald-300 font-semibold">
              {correctWords}/{totalTyped}
            </span>
          </p>
        </div>
      )}

      {/* === WORD STRIP === */}
      <div
        ref={containerRef}
        className="w-[90%] max-w-3xl h-[140px] rounded-xl p-6 text-lg md:text-xl leading-relaxed tracking-wide bg-slate-800/40 border border-slate-700/60 shadow-[0_0_25px_rgba(0,0,0,0.3)] select-none overflow-x-auto whitespace-nowrap"
        onClick={() => inputRef.current?.focus()}
        style={{ scrollbarWidth: "none" }}
      >
        {words.map((w, i) => {
          const color =
            i < currentWordIndex
              ? "text-emerald-400"
              : i === currentWordIndex
              ? "text-white underline underline-offset-4"
              : "text-slate-400";
          return (
            <span key={i} ref={(el) => (wordRefs.current[i] = el)} className={`${color} mx-[8px] inline-block`}>
              {w}
            </span>
          );
        })}
      </div>

      {!finished && (
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInput}
          className="mt-6 text-black text-center text-lg font-medium rounded-lg px-4 py-2 w-64 outline-none shadow-inner"
          placeholder="start typing..."
        />
      )}

      {finished && petReaction && (
        <div className="mt-8 bg-white/10 border border-white/10 backdrop-blur-md rounded-2xl p-8 text-center shadow-[0_8px_30px_rgba(0,0,0,0.4)] w-[90%] max-w-md">
          <h2 className="text-2xl font-semibold text-emerald-300 mb-2">
            Test Complete
          </h2>
          <p className="text-slate-300 mb-1">
            WPM: <span className="font-semibold text-white">{petReaction.wpm}</span>
          </p>
          <p className="text-slate-300 mb-1">
            Accuracy: <span className="font-semibold text-white">{petReaction.accuracy}%</span>
          </p>
          <p className="text-slate-400 mb-3 text-sm">
            +{petReaction.xpGain} xp • +{petReaction.coinGain} coins
          </p>
          <p className="italic text-emerald-200 mt-2">{petReaction.text}</p>

          <button
            onClick={restart}
            className="mt-6 bg-emerald-400/90 hover:bg-emerald-300 text-slate-900 px-6 py-2 rounded-md font-semibold transition-all active:scale-[0.97]"
          >
            try again
          </button>
        </div>
      )}

      <Link
        to="/games"
        className="mt-12 mb-8 flex items-center gap-1 text-emerald-300/90 font-medium hover:text-emerald-300 transition-all"
      >
        ← back to games room
      </Link>
    </div>
  );
}
