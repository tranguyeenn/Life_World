import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/HomePage.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <motion.h1
        className="title"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        StudyWorld
      </motion.h1>

      <motion.p
        className="subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Study Like You Mean It
      </motion.p>

      <motion.button
        className="enter-btn"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        onClick={() => navigate("/about")}
      >
        Enter World
      </motion.button>

      <div className="floating-icons"></div>
    </div>
  );
}