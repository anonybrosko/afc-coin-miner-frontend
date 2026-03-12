import React, { useState, useContext } from "react";
import { GameContext } from "./GameContext";

export default function Mine() {
  const { mineCoin, upgrades } = useContext(GameContext);
  const [clicks, setClicks] = useState([]);

  const handleClick = (e) => {
    const reward = mineCoin();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const id = Date.now();
    setClicks(prev => [...prev, { id, x, y, value: reward }]);
    
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== id));
    }, 800);
  };

  return (
    <div className="mine-page">
      <div className="mine-area" onClick={handleClick}>
        <h1 className="mine-heading">Mine AFC</h1>
        <div className="mine-content-wrapper">
          <span className="mine-content">Tap Here</span>
          {/* Click Popups */}
          {clicks.map((c) => (
            <div
              key={c.id}
              className="click-popup"
              style={{ left: c.x, top: c.y }}
            >
              +{c.value.toFixed(8)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
