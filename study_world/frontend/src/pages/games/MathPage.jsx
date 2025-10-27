import { useState } from "react";
import { Link } from "react-router-dom";
import { evaluate, derivative, simplify, fraction } from "mathjs";
import Dashboard from "../../components/Dashboard";
import { usePetStats } from "../../utils/stats";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export default function MathPage() {
  const [stats, setStats] = usePetStats();
  const [level, setLevel] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);

  // === QUESTION GENERATOR ===
  const generateQuestion = (lvl = level) => {
    let expr = "";
    switch (lvl) {
      case 1:
        expr = `${rand(1, 10)} + ${rand(1, 10)}`;
        break;
      case 2:
        expr = `${rand(2, 12)} × ${rand(2, 12)}`;
        break;
      case 3: {
        const a = rand(1, 9);
        const b = rand(1, 9);
        const c = rand(5, 30);
        expr = `${a}x + ${b} = ${c}`;
        break;
      }
      case 4: {
        const p = rand(10, 50);
        const total = rand(50, 200);
        expr = `${p}% of ${total}`;
        break;
      }
      case 5: {
        const mode = pick(["derivative", "integral", "sequence", "series"]);
        if (mode === "derivative") {
          expr = `d/dx(${rand(1, 6)}x^2 + ${rand(1, 6)}x + ${rand(1, 6)})`;
        } else if (mode === "integral") {
          const a = rand(1, 5);
          const b = rand(1, 5);
          const c = rand(1, 5);
          expr = `∫(${a}x^2 + ${b}x + ${c}) dx`;
        } else if (mode === "sequence") {
          const a1 = rand(1, 5);
          const d = rand(1, 5);
          const n = rand(3, 8);
          expr = `nth term (n=${n}) of sequence: a₁=${a1}, d=${d}`;
        } else {
          const a1 = rand(1, 3);
          const r = rand(2, 4);
          const n = rand(3, 6);
          expr = `sum of first ${n} terms: a₁=${a1}, r=${r}`;
        }
        break;
      }
      default:
        expr = "1 + 1";
    }
    setQuestion(expr);
  };

  // === SUBMIT HANDLER ===
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!question) return;

    let correctVal = NaN;
    let correctDisplay = "";

    try {
      if (level === 5) {
        const q = question;

        // --- DERIVATIVE ---
        if (q.startsWith("d/dx")) {
          const expr = q.replace(/d\/dx\(/, "").replace(/\)/, "");
          const raw = derivative(expr, "x").toString();
          correctDisplay = simplify(raw)
            .toString()
            .replace(/\*/g, "")      // remove *
            .replace(/\s*\+\s*/g, " + ") // keep clean plus signs
            .replace(/\s*-\s*/g, " - ")  // same for minus
            .replace(/\s*x/g, "x");  // remove space before x
          correctVal = NaN;
        }

        // --- INTEGRAL ---
        else if (q.startsWith("∫")) {
          const expr = q.replace(/[∫()]/g, "").replace(/\s*dx/, "").trim();
          const integralExpr = expr
            .split("+")
            .map((term) => {
              term = term.trim();
              const match = term.match(/^(\d*)x\^(\d+)$/);
              const matchLinear = term.match(/^(\d*)x$/);

              // Quadratic or higher term
              if (match) {
                const coef = parseFloat(match[1] || "1");
                const power = parseFloat(match[2]);
                const frac = fraction(coef, power + 1);
                let coefStr;
                if (frac.d === 1) {
                  coefStr = frac.n === 1 ? "" : `${frac.n}`;
                } else {
                  coefStr = `${frac.n}/${frac.d}`;
                }
                return `${coefStr}x^${power + 1}`;
              }

              // Linear term
              else if (matchLinear) {
                const coef = parseFloat(matchLinear[1] || "1");
                const frac = fraction(coef, 2);
                let coefStr;
                if (frac.d === 1) {
                  coefStr = frac.n === 1 ? "" : `${frac.n}`;
                } else {
                  coefStr = `${frac.n}/${frac.d}`;
                }
                return `${coefStr}x^2`;
              }

              // Constant term
              else if (/^\d+$/.test(term)) {
                return `${term}x`;
              } else return term;
            })
            .join(" + ");
          correctDisplay = `${integralExpr} + C`;
          correctVal = NaN;
        }

        // --- SEQUENCE ---
        else if (q.startsWith("nth term")) {
          const [n, a1, d] = q.match(/\d+/g).map(Number);
          correctVal = a1 + (n - 1) * d;
          correctDisplay = correctVal.toString();
        }

        // --- SERIES ---
        else if (q.startsWith("sum of first")) {
          const [n, a1, r] = q.match(/\d+/g).map(Number);
          correctVal = a1 * ((r ** n - 1) / (r - 1));
          correctDisplay = correctVal.toFixed(2);
        }
      }

      // --- LINEAR EQUATION ---
      else if (question.includes("x")) {
        const [a, b, c] = question.match(/\d+/g).map(Number);
        correctVal = (c - b) / a;
        correctDisplay = correctVal.toFixed(4);
      }

      // --- PERCENTAGE ---
      else if (question.includes("%")) {
        const [p, total] = question.match(/\d+/g).map(Number);
        correctVal = (p / 100) * total;
        correctDisplay = correctVal.toFixed(2);
      }

      // --- BASIC MATH ---
      else {
        const expr = question.replace(/×/g, "*").replace(/\^/g, "**");
        correctVal = evaluate(expr);
        correctDisplay = correctVal.toFixed(4);
      }

      // --- USER INPUT ---
      let userVal = answer.trim();
      if (/^\d+\/\d+$/.test(userVal)) {
        const [num, den] = userVal.split("/").map(Number);
        userVal = num / den;
      } else {
        userVal = parseFloat(userVal);
      }

      // --- COMPARE ---
      if (!isNaN(correctVal)) {
        checkAnswer(Math.abs(userVal - correctVal) < 0.001, correctDisplay);
      } else {
        checkAnswer(answer.trim().toLowerCase() === correctDisplay.toLowerCase(), correctDisplay);
      }
    } catch {
      setFeedback("⚠️ invalid input — try again");
    }

    setAnswer("");
  };

  // === CHECK RESULT ===
  const checkAnswer = (right, correct) => {
    setCount((c) => c + 1);
    if (right) {
      setFeedback("✅ correct!");
      setScore((s) => s + 1);
      setStats((prev) => ({
        ...prev,
        xp: prev.xp + 5,
        coins: prev.coins + 2,
        happiness: Math.min(100, prev.happiness + 3),
      }));
    } else {
      setFeedback(`❌ nope. correct: ${correct}`);
      setStats((prev) => ({
        ...prev,
        energy: Math.max(0, prev.energy - 1),
        happiness: Math.max(0, prev.happiness - 1),
      }));
    }

    setTimeout(() => {
      setFeedback("");
      generateQuestion();
    }, 1000);
  };

  const startLevel = (lvl) => {
    setLevel(lvl);
    setScore(0);
    setCount(0);
    setFeedback("");
    generateQuestion(lvl);
  };

  const reset = () => {
    setLevel(null);
    setQuestion("");
    setAnswer("");
    setScore(0);
    setCount(0);
    setFeedback("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-white bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 relative overflow-hidden">
      <Dashboard />
      <h1 className="text-4xl font-semibold mt-8 mb-2 text-emerald-300 tracking-tight">
        math quest 🧮
      </h1>

      {!level ? (
        <div className="mt-6 text-center">
          <p className="text-slate-400 italic mb-4">choose your level</p>
          <div className="flex flex-wrap justify-center gap-3">
            {[1, 2, 3, 4, 5].map((lvl) => (
              <button
                key={lvl}
                onClick={() => startLevel(lvl)}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg px-5 py-2 font-medium transition-all"
              >
                Level {lvl}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mt-8 bg-white/5 border border-white/10 rounded-xl p-6 text-center w-[90%] max-w-xl shadow-[0_0_20px_rgba(0,0,0,0.4)]">
            <p className="text-2xl font-semibold tracking-wide">{question}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-3">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="your answer..."
              className="text-black text-center text-lg font-medium rounded-lg px-4 py-2 w-64 outline-none shadow-inner"
            />
            <button
              type="submit"
              className="bg-emerald-400/90 hover:bg-emerald-300 text-slate-900 px-6 py-2 rounded-lg font-semibold transition-all active:scale-[0.97]"
            >
              submit
            </button>
          </form>

          {feedback && (
            <p
              className={`mt-4 text-sm font-medium ${
                feedback.startsWith("✅")
                  ? "text-emerald-300"
                  : feedback.startsWith("❌")
                  ? "text-rose-400"
                  : "text-slate-300"
              }`}
            >
              {feedback}
            </p>
          )}

          <p className="mt-6 text-slate-400 text-sm">
            Score: <span className="text-emerald-300 font-semibold">{score}</span> / {count}
          </p>

          <button onClick={reset} className="mt-6 text-sm text-slate-400 hover:text-emerald-300 underline">
            ← change level
          </button>
        </>
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
