import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100 text-center px-6 py-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(99,102,241,0.08),_transparent_60%)]" />

      {/* Header */}
      <motion.h1
        className="text-5xl font-semibold mb-6 text-emerald-300 tracking-tight drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        StudyWorld
      </motion.h1>

      {/* Tagline */}
      <motion.p
        className="text-lg text-slate-300/90 max-w-2xl mb-10 italic"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        built by tired students who wanted studying to feel like a game again.
      </motion.p>

      {/* About */}
      <motion.div
        className="max-w-2xl text-slate-300/90 leading-relaxed text-base space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <section>
          <h2 className="text-xl font-medium text-emerald-300 mb-2">
            what it is
          </h2>
          <p>
            StudyWorld is an indie web app that turns studying into a small, cozy game. 
            you start focus sessions, earn coins for every chunk of real work you do, 
            and use them to feed or upgrade your digital study pet. 
            the more consistent you are, the more your world grows. 
            it’s half productivity tracker, half gentle RPG — and 100% made by people who hate burnout.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-emerald-300 mb-2">
            how it works
          </h2>
          <p>
            you hit start, focus, and StudyWorld handles the rest. 
            each completed session adds to your streak and earns coins. 
            those coins unlock shop items, cosmetics, and upgrades that make your world feel alive. 
            between sessions, you can hop into tiny word games — typing, wordle, crossword — 
            to reset your brain without losing focus. 
            stats, streaks, and a leaderboard keep you grounded but not pressured.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-emerald-300 mb-2">
            why we built it
          </h2>
          <p>
            the internet turned learning into a race. 
            We wanted a slower lane — a place where showing up counts more than speed. 
            StudyWorld rewards small effort, not endless grind. 
            It’s for students, artists, and anyone trying to rebuild their attention span one study session at a time.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-emerald-300 mb-2">
            who made it
          </h2>
          <p>
            a few students with too much caffeine and not enough discipline. 
            We coded, designed, and broke this thing until it started working. 
            It’s not a corporation — it’s a passion project. 
            Every line of code was written between classes and late-night playlists.
          </p>
        </section>
      </motion.div>

      {/* Enter World Button */}
      <motion.div
        className="mt-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          to="/home"
          className="flex items-center gap-2 bg-white/10 border border-white/20 text-slate-100 font-medium px-6 py-2 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
        >
          <span className="text-emerald-300">←</span> enter world
        </Link>
      </motion.div>
    </div>
  );
}