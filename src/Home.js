// Home.js
import React, { useContext } from "react";
import { GameContext } from "./GameContext";

const Home = () => {
  const { balance, clicks } = useContext(GameContext);

  return (
    <div className="container">
      <div className="balance-top-right">
        Balance: {balance} AFC
      </div>
      <h1>Home</h1>
      <p>Total Clicks: {clicks}</p>
      <p>Welcome to AFC Coin Miner! Mine, upgrade, and prestige to grow your fortune.</p>
    </div>
  );
};

export default Home;
