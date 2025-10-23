import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100 text-center px-6 py-16 relative overflow-hidden">
      {/* Subtle floating glow */}
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
        built by dreamers who believe studying doesn’t have to hurt.
      </motion.p>

      {/* About section */}
      <motion.div
        className="max-w-2xl text-slate-300/90 leading-relaxed text-base space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <section>
          <h2 className="text-xl font-medium text-emerald-300 mb-2">
            What We’re About
          </h2>
          <p>
            StudyWorld began as a small rebellion against burnout. We wanted to
            turn progress into something you could feel good about — a quiet
            victory each time you show up for yourself. It’s not about grinding
            harder. It’s about growing slower, steadier, better.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-emerald-300 mb-2">
            Why It Exists
          </h2>
          <p>
            The internet loves hustle. We don’t. We wanted a place where
            students could build habits without breaking themselves — where
            rewards, rest, and reflection actually matter. StudyWorld is a cozy
            corner of the web for progress that feels human.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-medium text-emerald-300 mb-2">
            Who We Are
          </h2>
          <p>
            We’re a small, caffeine-fueled team of students and designers who
            accidentally made a productivity game at 3 a.m. and decided it
            shouldn’t just stay a joke. Now we’re building tools for people like
            us — restless, curious, and just trying to stay kind to our brains.
          </p>
        </section>
      </motion.div>

      {/* Back Button */}
      <motion.div
        className="mt-14"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 bg-white/10 border border-white/20 text-slate-100 font-medium px-6 py-2 rounded-xl hover:bg-white/20 transition-all backdrop-blur-sm"
        >
          <span className="text-emerald-300">←</span> back home
        </Link>
      </motion.div>
    </div>
  );
}
