import { useState, useEffect } from "react";
import "../styles/popup.css";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false);
  const [showMini, setShowMini] = useState(false);

  // Open popup when page first loads
  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setShowMini(true);
  };

  const handleReopen = () => {
    setIsOpen(true);
    setShowMini(false);
  };

  return (
    <>
      {/* Overlay */}
      <div id="popup-overlay" className={isOpen ? "active" : ""}>
        <div id="popup-box">
          <button id="popup-close" onClick={handleClose}>
            &times;
          </button>

          <h2>Future Feature ✨</h2>
          <p>- Mobile Responsive</p>
          <p>- Game Portal</p>
          <p>- Extension Map</p>
          <p>- Leaderboard</p>
          <p>- To-Do List</p>
          <p>- Discussion Board</p>
          <p>- Daily Challenges</p>
          <p>- Avatar Customization</p>
        </div>
      </div>

      {/* Mini Button */}
      {showMini && (
        <button id="popup-mini" onClick={handleReopen}>
          Future Feature
        </button>
      )}
    </>
  );
}