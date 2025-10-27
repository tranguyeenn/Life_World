import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// === Entry + Core Pages ===
import HomePage from "./pages/HomePage.jsx";   // cinematic intro
import Home from "./pages/Home.jsx";           // actual map/dashboard
import About from "./pages/About.jsx";
import StudyPage from "./pages/StudyPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import GamesPage from "./pages/GamesPage.jsx";

// === Game Pages ===
import TypingPage from "./pages/games/TypingPage.jsx";
import WordlePage from "./pages/games/WordlePage.jsx";
import MathPage from "./pages/games/MathPage.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* === Genshin-style Intro === */}
        <Route path="/" element={<HomePage />} />

        {/* === Core World Navigation === */}
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />

        {/* === Games === */}
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/typing" element={<TypingPage />} />
        <Route path="/games/wordle" element={<WordlePage />} />
        <Route path="/games/math" element={<MathPage />} />
      </Routes>
    </Router>
  );
}