import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import StudyPage from "./pages/StudyPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import About from "./pages/About.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import GamesPage from "./pages/GamesPage.jsx";
import TypingPage from "./pages/games/TypingPage.jsx"; // 👈 add this

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/typing" element={<TypingPage />} /> {/* 👈 add this */}
      </Routes>
    </Router>
  );
}