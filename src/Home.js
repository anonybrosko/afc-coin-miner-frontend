// Home.js
import React, { useContext } from "react";
import { GameContext } from "./GameContext";

const Home = () => {
  const { balance, clicks, hashrate, miningPower, autoMinerCount, prestige, isMobile } = useContext(GameContext);

  return (
    <>
      {/* Floating blockchain background */}
      <div className="blockchain-float">
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="block"
            style={{ left: `${i * 10}%`, animationDelay: `${i * 0.5}s` }}
          ></div>
        ))}
      </div>

      {/* Main container */}
      <div className={`container ${isMobile ? "mobile" : "desktop"}`}>
        <h1>Home</h1>
        <div className="card">
          <h2>Balance</h2>
          <p>{balance.toFixed(8)} AFC</p>
        </div>
        <div className="card">
          <h2>Total Clicks</h2>
          <p>{clicks}</p>
        </div>
        <div className="card">
          <h2>Hashrate</h2>
          <p>{hashrate}</p>
        </div>
        <div className="card">
          <h2>Mining Power</h2>
          <p>{miningPower}</p>
        </div>
        <div className="card">
          <h2>Prestige</h2>
          <p>{prestige}</p>
        </div>

        <p style={{ marginTop: "2rem", fontSize: isMobile ? "3vw" : "1rem" }}>
          {isMobile ? "Mobile layout active" : "Desktop layout active"}
        </p>
        <p>Welcome to AFC Coin Miner! Mine, upgrade, and prestige to grow your fortune.</p>
      </div>
    </>
  );
};

export default Home;
