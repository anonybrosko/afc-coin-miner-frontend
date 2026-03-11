import React, { createContext, useState, useEffect } from "react";
import FallingCoins from "./FallingCoins"

export const GameContext = createContext();

const API = "https://afc-coin-miner-backend.onrender.com";

const roundCrypto = (num) => Number(num.toFixed(8));

export const allUpgrades = {
  // PSU
  "evga-psu": {
    type: "psu",
    label: "EVGA PSU",
    baseCost: 0.00001,   // starting cost
    energy: 0.001,        // per PSU
    effect: 0.000001,      // auto-mining per second
    description: "Boosts auto-mining while energy lasts"
  },
  "corsair-psu": {
    type: "psu",
    label: "Corsair PSU",
    baseCost: 0.000025,
    energy: 0.002,
    effect: 0.000015,
    description: "Stronger PSU, more energy per second"
  },
  // GPU
  "nvidia-rtx": {
    type: "gpu",
    label: "NVIDIA RTX",
    baseCost: 0.00005,
    effect: 0.00002,
    description: "Increases auto-mining speed"
  },
  "amd-radeon": {
    type: "gpu",
    label: "AMD Radeon",
    baseCost: 0.00003,
    effect: 0.000018,
    description: "Slightly slower, cheaper GPU boost"
  },
  // CPU
  "intel-i9": {
    type: "cpu",
    label: "Intel i9",
    baseCost: 0.00001,
    effect: 0.000005,
    description: "Boosts manual mining per click"
  },
  "amd-ryzen": {
    type: "cpu",
    label: "AMD Ryzen",
    baseCost: 0.000007,
    effect: 0.000004,
    description: "Boosts manual mining slightly less"
  },
  // Network
  "fiber-network": {
    type: "network",
    label: "Fiber Network",
    baseCost: 0.0001,
    duration: 60,
    effect: 1.2,
    description: "Increases mining output for a limited time"
  },
  "dsl-network": {
    type: "network",
    label: "DSL Network",
    baseCost: 0.00005,
    duration: 30,
    effect: 1.05,
    description: "Small mining boost for short time"
  },
};

export const GameProvider = ({ children }) => {
  // Load saved state
  const saved = JSON.parse(localStorage.getItem("afcGame")) || {};

  const [balance, setBalance] = useState(saved.balance || 0);
  const [clicks, setClicks] = useState(saved.clicks || 0);
  const [upgrades, setUpgrades] = useState(saved.upgrades || {});
  const [psuStates, setPsuStates] = useState(saved.psuStates || {});
  const [activePsu, setActivePsu] = useState(saved.activePsu || null);
  const [prestige, setPrestige] = useState(saved.prestige || 0);

  // Detect mobile
  const detectMobile = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    return /android|iphone|ipad|ipod|mobile|tablet|iemobile|ipad/i.test(ua)
      || (typeof window !== "undefined" && window.innerWidth <= 768);
  };
  const [isMobile, setIsMobile] = useState(detectMobile());
  useEffect(() => {
    const handleResize = () => setIsMobile(detectMobile());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-mining
  useEffect(() => {
    const interval = setInterval(() => {
      let autoReward = 0;

      Object.entries(upgrades).forEach(([name, level]) => {
        const upg = allUpgrades[name];
        if (!upg) return;

        if (upg.type === "psu") {
          const remaining = psuStates[name]?.energyLeft || 0;
          if (remaining > 0 && activePsu === name) {
            autoReward += upg.effect * level;
            setPsuStates(prev => ({
              ...prev,
              [name]: { ...prev[name], energyLeft: Math.max(0, remaining - 0.00001), paused: false }
            }));
          }
        }

        if (upg.type === "gpu") autoReward += upg.effect * level;
      });

      if (autoReward > 0) setBalance(prev => roundCrypto(prev + autoReward));
    }, 1000);

    return () => clearInterval(interval);
  }, [upgrades, psuStates, activePsu]);

  // Manual mining
  const mineCoin = () => {
    let manualReward = 0.0000005;
    Object.entries(upgrades).forEach(([name, level]) => {
      const upg = allUpgrades[name];
      if (!upg) return;
      if (upg.type === "cpu") manualReward += upg.effect * level;
    });

    setBalance(prev => roundCrypto(prev + manualReward));
    setClicks(prev => prev + 1);
    fetch(`${API}/mine`).catch(() => {});
  };

  // Buy/upgrade
  const buyUpgrade = (name, cost) => {
    if (balance < cost) return;
    const upg = allUpgrades[name];
    if (!upg) return;

    setBalance(prev => roundCrypto(prev - cost));
    setUpgrades(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));

    if (upg.type === "psu") {
      // Initialize PSU state if not present
      setPsuStates(prev => {
        const existing = prev[name] || { energyLeft: upg.energy, paused: true, effect: upg.effect, totalEnergy: 0 };
        const newEnergyLeft = existing.energyLeft + upg.energy;
        const newTotalEnergy = (existing.totalEnergy || 0) + upg.energy; // cumulative total

        return {
          ...prev,
          [name]: { ...existing, energyLeft: existing.energyLeft, totalEnergy: newTotalEnergy, paused: false, effect: upg.effect }
        };
      });
      setActivePsu(name);
    }
  };

  // Activate/switch PSU
  const activatePsu = (name) => {
    if (!allUpgrades[name] || allUpgrades[name].type !== "psu") return;

    // Pause current
    if (activePsu && activePsu !== name) {
      setPsuStates(prev => ({
        ...prev,
        [activePsu]: { ...prev[activePsu], paused: true }
      }));
    }

    // Activate new PSU
    setActivePsu(name);
    setPsuStates(prev => ({
      ...prev,
      [name]: { ...prev[name], paused: false, energyLeft: prev[name]?.energyLeft || allUpgrades[name].energy }
    }));
  };

  // Prestige
  const doPrestige = () => {
    const earnedPrestige = Math.floor(balance / 0.0001);
    if (earnedPrestige <= 0) return;

    setBalance(0);
    setClicks(0);
    setUpgrades({});
    setPsuStates({});
    setActivePsu(null);
    setPrestige(prev => prev + earnedPrestige);
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("afcGame", JSON.stringify({
      balance, clicks, upgrades, psuStates, activePsu, prestige
    }));
  }, [balance, clicks, upgrades, psuStates, activePsu, prestige]);

  // Compute stats
  const autoMinerCount = Object.entries(upgrades)
    .filter(([name]) => allUpgrades[name]?.type === "gpu").reduce((sum, [, level]) => sum + level, 0);

  const hashrate = autoMinerCount; // simple metric
  const miningPower = Object.entries(upgrades).reduce((sum, [name, level]) => {
    const upg = allUpgrades[name];
    if (!upg) return sum;
    if (upg.type === "cpu") return sum + level;
    if (upg.type === "gpu") return sum + level;
    return sum;
  }, 0);

  return (
    <GameContext.Provider value={{
      balance,
      clicks,
      setBalance,
      upgrades,
      prestige,
      mineCoin,
      buyUpgrade,
      doPrestige,
      isMobile,
      autoMinerCount,
      hashrate,
      miningPower,
      psuStates,
      activePsu,
      activatePsu,
    }}>
      <FallingCoins />
      {children}
      <button
        onClick={() => {
          localStorage.removeItem("afcGame"); // clear save
          window.location.reload();            // reload game
        }}
        >
          Reset Game
          </button>
    </GameContext.Provider>
  );
};
