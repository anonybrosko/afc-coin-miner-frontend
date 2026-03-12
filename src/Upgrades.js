import React, { useContext, useState } from "react";
import { allUpgrades } from "./UpgradesTable";
import { GameContext } from "./GameContext";

const Upgrades = () => {
  const { balance, upgrades, psuStates, activePsu, buyUpgrade, activatePsu } = useContext(GameContext);
  const [activeCategory, setActiveCategory] = useState("gpu");

  // Organize upgrades by category
  const categories = {
    gpu: Object.entries(allUpgrades).filter(([_, upg]) => upg.type === "gpu"),
    cpu: Object.entries(allUpgrades).filter(([_, upg]) => upg.type === "cpu"),
    psu: Object.entries(allUpgrades).filter(([_, upg]) => upg.type === "psu"),
    network: Object.entries(allUpgrades).filter(([_, upg]) => upg.type === "network"),
  };

  const currentUpgrades = categories[activeCategory];

  return (
    <div className="card">
      <h1>Upgrades</h1>

      {/* Sub-navbar */}
      <div style={{ display: "flex", marginBottom: 20 }}>
        {Object.keys(categories).map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              flex: 1,
              padding: "10px 0",
              marginRight: 5,
              backgroundColor: activeCategory === cat ? "#4caf50" : "#ccc",
              color: activeCategory === cat ? "#fff" : "#000",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))} </div>

      {/* Upgrades list */}
      {currentUpgrades.map(([name, upg]) => {
        const level = upgrades[name] || 0;
        const cost = (upg.baseCost || 0.0000001) * Math.pow(3, level);
        const canBuy = balance >= cost;

        // PSU progress bar
        const psuState = psuStates[name] || { energyLeft: 0, paused: true, totalEnergy: upg.energy || 0.000001 };
      
        const totalEnergy = psuState.totalEnergy || upg.energy || 0.000001;
        const progressPercent = upg.type === "psu" ? Math.min((psuState.energyLeft / totalEnergy)* 100, 100) : 0;

        return (
          <div key={name} style={{ marginBottom: 20, borderBottom: "1px solid #ddd", paddingBottom: 10 }}>
            <h2>{upg.label} (Level {level})</h2>
            <p style={{ fontSize: "0.9em" }}>{upg.description}</p>
            <p>Cost: {cost.toFixed(8)} AFC</p>
            <p>Effect: {upg.effect.toFixed(8)} {upg.type === "cpu" ? "per click" : "per second"}</p>

            {/* PSU energy bar */}
            {upg.type === "psu" && (
              <div style={{ margin: "5px 0" }}>
                <div style={{ background: "#eee", width: "100%", height: 10, borderRadius: 5 }}>
                  <div
                    style={{
                      width: `${progressPercent}%`,
                      height: "100%",
                      background: activePsu === name ? "#4caf50" : "#999",
                      borderRadius: 5,
                      transition: "width 0.3s ease"
                    }}
                  />
                </div>
                <p style={{ fontSize: "0.8em" }}>
                  Energy: {psuState.energyLeft.toFixed(8)} / {totalEnergy.toFixed(8)} {activePsu === name ? "(Active)" : "(Paused)"}
                </p>
                {activePsu !== name && psuState.energyLeft > 0 && (
                  <button
                    onClick={() => activatePsu(name)}
                    style={{
                      padding: "4px 8px",
                      borderRadius: 4,
                      border: "none",
                      backgroundColor: "#2196f3",
                      color: "#fff",
                      cursor: "pointer"
                    }}
                  >
                    Activate PSU
                  </button>
                )}
              </div>
            )}

            <button
              onClick={() => buyUpgrade(name, cost)}
              className={`upgrade-button ${!canBuy ? "disabled" : ""}`}
              style={{
                padding: "8px 12px",
                border: "none",
                borderRadius: 4,
                cursor: canBuy ? "pointer" : "not-allowed",
                backgroundColor: canBuy ? "#2196f3" : "#999",
                color: "#fff"
              }}
            >
              {canBuy ? "Buy/Upgrade" : "Cannot Afford"}
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Upgrades;
