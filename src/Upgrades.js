// Upgrades.js
import React, { useContext } from "react";
import { GameContext } from "./GameContext";

const Upgrades = () => {
  const { balance, upgrades, buyUpgrade } = useContext(GameContext);

  // Define available upgrades with their base costs
  const upgradeList = [
    { name: "pickaxe", label: "Pickaxe", baseCost: 100 },
    { name: "drill", label: "Drill", baseCost: 500 },
    { name: "excavator", label: "Excavator", baseCost: 2000 },
    { name: "autoMiner", label: "Auto Miner", baseCost: 250 },
  ];

  return (
    <div className="card">
      <h1>Upgrades</h1>
      {upgradeList.map((upg) => {
        const level = upgrades[upg.name] || 0;
        const cost = upg.baseCost * (level + 1); // cost scales with level
        const canBuy = balance >= cost;

        return (
          <div key={upg.name} style={{ marginBottom: 20 }}>
            <h2>{upg.label} (Level {level})</h2>
            <button
              onClick={() => buyUpgrade(upg.name, cost)}
              className={`upgrade-button ${!canBuy ? "disabled" : ""}`}>
              {upg.name === "autoMiner" ? `Add Auto Miner (${cost} AFC)` : `Upgrade (${cost} AFC)`}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Upgrades;
