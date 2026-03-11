import React, { useState, useEffect, useContext } from "react";
import { GameContext } from "./GameContext";

const FallingCoins = () => {
  const { setBalance } = useContext(GameContext);
  const [coins, setCoins] = useState([]);
  const randomRange = (min, max) => Math.random() * (max - min) + min;

  // Spawn coins every 2s
  useEffect(() => {
    const spawnCoin = () => {
      const newCoin = {
        id: Date.now() + Math.random(),
        x: randomRange(0,90),      // 0-90% horizontal
        y: 0,
        type: Math.random() < 0.5 ? "BTC" : "AFC",
        speed: randomRange(1,3) // pixels per frame
      };
      setCoins(prev => [...prev, newCoin]);
      const nextSpawn = randomRange(300_000, 600_000);
      setTimeout(spawnCoin, nextSpawn);
    };
    spawnCoin()
    return () => {
      active = false; 
    };
  }, []);

  // Animate coins
  useEffect(() => {
    const animation = setInterval(() => {
      setCoins(prev =>
        prev
          .map(c => ({ ...c, y: c.y + c.speed }))
          .filter(c => c.y < window.innerHeight) // remove if fallen off
      );
    }, 16); // ~60fps
    return () => clearInterval(animation);
  }, []);

  // Click handler
  const collectCoin = (id, type) => {
    if (type === "BTC") {
      const btcValue = 0.00001; // could be live API
      setBalance(prev => prev + btcValue);
    } else {
      const afcValue = 0.0001;
      setBalance(prev => prev + afcValue);
    }
    setCoins(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {coins.map(c => (
        <div
          key={c.id}
          onClick={() => collectCoin(c.id, c.type)}
          style={{
            position: "absolute",
            left: `${c.x}%`,
            top: `${c.y}px`,
            fontSize: 24,
            cursor: "pointer",
            userSelect: "none"
          }}
        >
          {c.type === "BTC" ? "₿" : "🪙"}
        </div>
      ))}
    </div>
  );
};

export default FallingCoins;
