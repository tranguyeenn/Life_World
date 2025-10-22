import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <motion.div
      className="max-w-3xl mx-auto text-center px-6 py-12"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-4xl font-bold mb-6 text-gray-800">About StudyWorld</h1>

      <p className="text-gray-700 mb-6 leading-relaxed">
        StudyWorld began as a simple idea: make studying feel less like a chore and more like an adventure. 
        We believe productivity doesn’t have to mean burnout — it can be fun, rewarding, and maybe even a little competitive.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-800">Our Mission</h2>
      <p className="text-gray-700 mb-6 leading-relaxed">
        To make studying feel less like punishment and more like progress — helping students stay
        motivated, connected, and confident in their goals.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-800">Our Story</h2>
      <p className="text-gray-700 mb-6 leading-relaxed">
        Founded in 2025 by students who were tired of the “grind culture,” StudyWorld started as a small
        experiment — part game, part study app, part rebellion against academic burnout. Backed by research
        in motivation and cognitive psychology, it rethinks how students focus, rest, and grow, turning
        productivity into something sustainable. Now it’s growing into a platform where learning meets
        creativity, and where your goals actually matter.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-800">The Team</h2>
      <p className="text-gray-700 mb-6 leading-relaxed">
        We’re a small, caffeine-fueled group of developers, designers, and dreamers who care about helping
        you make the most of your time — without losing your sanity in the process.
      </p>

      <h2 className="text-2xl font-semibold mt-10 mb-3 text-gray-800">What’s Next</h2>
      <p className="text-gray-700 mb-10 leading-relaxed">
        Expect expansions: new maps, new features, new ways to learn.
        StudyWorld is still evolving — just like the people using it.
      </p>

      <Link
        to="/"
        className="text-blue-700 underline hover:text-blue-900 transition text-lg font-medium"
      >
        ← Back to Home
      </Link>
    </motion.div>
  );
}
