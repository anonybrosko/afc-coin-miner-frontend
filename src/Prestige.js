// Prestige.js
import React, { useContext } from "react";
import { GameContext } from "./GameContext";
import { getPrestigeCost } from "./GameMath"

const Prestige = () => {
  const roundCrypto = (num) => Number(num.toFixed(8));
  const { balance, prestige, doPrestige } = useContext(GameContext);

  const basePrestigeCost = 0.0001;
  const prestigeMultiplier = 1.6;

  // const nextPrestigeLevel = prestige + 1;
  const prestigeThreshold = roundCrypto(getPrestigeCost(prestige));

  const canPrestige = balance >= prestigeThreshold;
  const remaining = canPrestige ? 0 : roundCrypto(prestigeThreshold - balance);
  const earnedPrestige = Math.floor(balance / prestigeThreshold);

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
          ? `Prestiging now will give you ${earnedPrestige} prestige points.`
          : `You need ${remaining.toFixed(8)} more AFC to prestige.`}
      </p>
      <button
        className={`prestige-button ${!canPrestige ? "disabled" : ""}`}
        onClick={doPrestige}
        disabled={!canPrestige}
      >
        Prestige
      </button>
    </div>
  );
};

export default Prestige;
