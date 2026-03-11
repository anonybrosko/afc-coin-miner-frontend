// Home.js
import React, { useContext } from "react";
import { GameContext } from "./GameContext";

const Home = () => {
  const { balance, clicks, isMobile } = useContext(GameContext);

  return (
    <div className={`container ${isMobile ? "mobile" : "desktop"}`}>
      <div className="balance-top-right">Balance: {balance} AFC</div>
      <h1>Home</h1>
      <p>Total Clicks: {clicks}</p>
      <p>{isMobile ? "Mobile layout active" : "Desktop layout active"}</p>
      <p>Welcome to AFC Coin Miner! Mine, upgrade, and prestige to grow your fortune.</p>
    </div>
  );
};

export default Home;
