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
  ];

  return (
    <div className="container">
      <h1>Upgrades</h1>
      <p>Balance: {balance} AFC</p>

      {upgradeList.map((upg) => {
        const level = upgrades[upg.name] || 0;
        const cost = upg.baseCost * (level + 1); // cost scales with level
        const canBuy = balance >= cost;

        return (
          <div key={upg.name} style={{ marginBottom: 20 }}>
            <h2>{upg.label} (Level {level})</h2>
            <button
              onClick={() => buyUpgrade(upg.name, cost)}
              disabled={!canBuy}
              style={{
                background: canBuy ? "#00ff99" : "#555",
                color: "#000",
                padding: "10px 20px",
                borderRadius: 8,
                border: "none",
                cursor: canBuy ? "pointer" : "not-allowed",
                boxShadow: canBuy ? "3px 3px 8px #00cc77" : "none",
                fontWeight: "bold"
              }}
            >
              Upgrade ({cost} AFC)
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Upgrades;
