// Prestige.js
import React, { useContext } from "react";
import { GameContext } from "./GameContext";

const Prestige = () => {
  const { balance, prestige, doPrestige } = useContext(GameContext);

  const prestigeThreshold = 1000;
  const canPrestige = balance >= prestigeThreshold;
  const remaining = canPrestige ? 0 : prestigeThreshold - balance;
  // const earnedPrestige = Math.floor(balance / 1000);

  return (
    <div className="card">
      <div className="blockchain-float">
        <div className="block" style={{ left: "20%", animationDelay: "0s" }}></div>
        <div className="block" style={{ left: "50%", animationDelay: "1s" }}></div>
      </div>
      <h1>Prestige</h1>
      <p>Current Prestige: {prestige}</p>
      <p>Balance: {balance} AFC</p>
      <p>
        {canPrestige 
          ? `Prestiging now will give you ${Math.floor(balance / prestigeThreshold)} prestige points.`
          : `You need ${remaining} more AFC to prestige.`}
      </p>
      <button
        className={`prestige-button ${!canPrestige ? "disabled" : ""}`}
        onClick={doPrestige}
        // disabled={earnedPrestige <= 0}
      >
        Prestige
      </button>
    </div>
  );
};

export default Prestige;
