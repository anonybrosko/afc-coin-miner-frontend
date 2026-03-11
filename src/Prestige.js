// Prestige.js
import React, { useContext } from "react";
import { GameContext } from "./GameContext";

const Prestige = () => {
  const roundCrypto = (num) => Number(num.toFixed(8));
  const { balance, prestige, doPrestige } = useContext(GameContext);

  const prestigeThreshold = 0.0001;
  const canPrestige = balance >= prestigeThreshold;
  const remaining = canPrestige ? 0 : roundCrypto(prestigeThreshold - balance);
  // const earnedPrestige = Math.floor(balance / 1000);

  return (
    <div className="card">
      <div className="blockchain-float">
        <div className="block" style={{ left: "20%", animationDelay: "0s" }}></div>
        <div className="block" style={{ left: "50%", animationDelay: "1s" }}></div>
      </div>
      <h1>Prestige</h1>
      <p>Current Prestige: {prestige}</p>
      <p>Balance: {balance.toFixed(8)} AFC</p>
      <p>
        {canPrestige 
          ? `Prestiging now will give you ${Math.floor(balance / prestigeThreshold)} prestige points.`
          : `You need ${remaining.toFixed(8)} more AFC to prestige.`}
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
