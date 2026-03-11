// Prestige.js
import React, { useContext } from "react";
import { GameContext } from "./GameContext";

const Prestige = () => {
  const { balance, prestige, doPrestige } = useContext(GameContext);

  const earnedPrestige = Math.floor(balance / 1000);

  return (
    <div className="container">
      <h1>Prestige</h1>
      <p>Current Prestige: {prestige}</p>
      <p>Balance: {balance} AFC</p>
      <button
        className={`prestige-button ${earnedPrestige > 0 ? "" : "disabled"}`}
        onClick={doPrestige}
        disabled={earnedPrestige <= 0}
      >
        {earnedPrestige > 0
          ? `Prestige (+${earnedPrestige})`
          : "Earn more AFC to Prestige"}
      </button>
    </div>
  );
};

export default Prestige;
