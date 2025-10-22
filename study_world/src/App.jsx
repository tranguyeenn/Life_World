import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import StudyPage from "./pages/StudyPage.jsx";
import ShopPage from "./pages/ShopPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import About from "./pages/About.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}