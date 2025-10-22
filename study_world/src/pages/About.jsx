import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-950 to-indigo-950 text-white text-center p-6">
      <motion.h1
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        About StudyWorld
      </motion.h1>

      <motion.p
        className="max-w-2xl mb-6 leading-relaxed"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        StudyWorld began as a simple idea: make studying feel less like a chore and more like an adventure. 
        We believe productivity doesn’t have to mean burnout — it can be fun, rewarding, and maybe even a little competitive.
      </motion.p>

      <motion.h2
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Mission
      </motion.h2>

      <motion.p
        className="max-w-2xl mb-10 leading-relaxed opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      > 
        To make studying feel less like punishment and more like progress—helping students stay motivated, 
        connected, and confident in their goals.
      </motion.p>

      <motion.h2
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Our Story
      </motion.h2>

      <motion.p
        className="max-w-2xl mb-10 leading-relaxed opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      > 
        Founded in 2025 by students who were tired of the “grind culture,” StudyWorld started as a small experiment 
        — part game, part study app, part rebellion against academic burnout. 
        Now it’s growing into a platform where learning meets creativity, and where your goals actually matter.
      </motion.p>

      <motion.h2
        className="text-4xl font-bold mb-4"
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        The Team
      </motion.h2>

      <motion.p
        className="max-w-2xl mb-10 leading-relaxed opacity-90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      > 
        We’re a small, caffeine-fueled group of developers, 
        designers, and dreamers who care about helping you make the most of your time — without losing your sanity in the process.
      </motion.p>

      <Link
        to="/"
        className="bg-white text-indigo-800 font-semibold px-6 py-2 rounded-xl shadow hover:bg-gray-100 transition"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
