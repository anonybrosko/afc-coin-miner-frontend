import React, { createContext, useState, useEffect } from "react";
import { allUpgrades } from "./UpgradesTable";
import { GameContext } from "./GameContext";
import { getPrestigeCost } from "./GameMath";
import FallingCoins from "./FallingCoins";

export const GameProvider = ({ children }) => {
  const API = "https://afc-coin-miner-backend.onrender.com";
  const roundCrypto = (num) => Number(num.toFixed(8));

  // Load saved state
  const saved = JSON.parse(localStorage.getItem("afcGame")) || {};

  const [balance, setBalance] = useState(saved.balance || 0);
  const [clicks, setClicks] = useState(saved.clicks || 0);
  const [upgrades, setUpgrades] = useState(saved.upgrades || {});
  const [psuStates, setPsuStates] = useState(saved.psuStates || {});
  const [activePsu, setActivePsu] = useState(saved.activePsu || null);
  const [prestige, setPrestige] = useState(saved.prestige || 0);
  const [activeNetworks, setActiveNetworks] = useState(saved.activeNetworks || []);

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
      // 1️⃣ Compute reward
      let autoReward = 0;
      const updatedPsu = { ...psuStates };

      Object.entries(upgrades).forEach(([name, level]) => {
        const upg = allUpgrades[name];
        if (!upg) return;

        // PSU
        if (upg.type === "psu") {
          const remaining = updatedPsu[name]?.energyLeft || 0;
          if (remaining > 0 && activePsu === name) {
            autoReward += upg.effect * level;
            updatedPsu[name] = {
              ...updatedPsu[name],
              energyLeft: Math.max(0, remaining - 0.00001),
              paused: false
            };
          }
        }

        // GPU
        if (upg.type === "gpu") autoReward += upg.effect * level;
      });

      // 2️⃣ Compute network multiplier
      const totalMultiplier = activeNetworks.reduce((acc, n) => acc * n.multiplier, 1);
      const finalReward = roundCrypto(autoReward * totalMultiplier);

      // 3️⃣ Apply reward
      if (finalReward > 0) setBalance(prev => roundCrypto(prev + finalReward));

      // 4️⃣ Update PSU states
      setPsuStates(updatedPsu);

      // 5️⃣ Decrease network durations
      setActiveNetworks(prevNetworks =>
        prevNetworks
          .map(n => ({ ...n, duration: n.duration - 1 }))
          .filter(n => n.duration > 0)
      );

    }, 1000);

    return () => clearInterval(interval);
  }, [upgrades, activePsu, psuStates, activeNetworks]);

  // Compute auto-mining AFC/sec
  const autoMiningRate = Object.entries(upgrades).reduce((sum, [name, level]) => {
    const upg = allUpgrades[name];
    if (!upg) return sum;

    let base = 0;
    if (upg.type === "gpu") base = upg.effect * level;
    if (upg.type === "psu" && activePsu === name) {
      const energyLeft = psuStates[name]?.energyLeft || 0;
      if (energyLeft > 0) base = upg.effect * level;
    }
    return sum + base;
  }, 0);

  // Apply active network multipliers
  const networkMultiplier = activeNetworks.reduce((acc, n) => acc * n.multiplier, 1);
  const autoMiningAFCPerSec = roundCrypto(autoMiningRate * networkMultiplier);

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
    return manualReward;
  };

  // Activate network
  const activateNetwork = (name) => {
    const upg = allUpgrades[name];
    if (!upg || upg.type !== "network") return;

    // Avoid duplicates
    setActiveNetworks(prev => {
      if (prev.some(n => n.name === name)) return prev;
      return [...prev, { name, multiplier: upg.effect, duration: upg.duration }];
    });
  };

  // Buy/upgrade
  const buyUpgrade = (name, cost) => {
    if (balance < cost) return;
    const upg = allUpgrades[name];
    if (!upg) return;

    setBalance(prev => roundCrypto(prev - cost));
    setUpgrades(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));

    if (upg.type === "psu") {
      setPsuStates(prev => {
        const existing = prev[name] || { energyLeft: 0, paused: true, effect: upg.effect, totalEnergy: 0 };
        const newTotalEnergy = (existing.totalEnergy || 0) + upg.energy;
        return {
          ...prev,
          [name]: {
            ...existing,
            energyLeft: newTotalEnergy,
            totalEnergy: newTotalEnergy,
            paused: false,
            effect: upg.effect
          }
        };
      });
      setActivePsu(name);
    }
  };

  // Activate PSU
  const activatePsu = (name) => {
    if (!allUpgrades[name] || allUpgrades[name].type !== "psu") return;

    // Pause current
    if (activePsu && activePsu !== name) {
      setPsuStates(prev => ({
        ...prev,
        [activePsu]: { ...prev[activePsu], paused: true }
      }));
    }

    setActivePsu(name);
    setPsuStates(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        paused: false,
        energyLeft: prev[name]?.energyLeft || allUpgrades[name].energy
      }
    }));
  };

  // Compute manual click AFC per click
  const manualClickPower = Object.entries(upgrades).reduce((sum, [name, level]) => {
    const upg = allUpgrades[name];
    if (!upg) return sum;
    if (upg.type === "cpu") sum += upg.effect * level;
    return sum;
  }, 0);

  // Base click reward
  const totalClickPower = roundCrypto(manualClickPower + 0.0000005); // include base click reward
  // Prestige
  const doPrestige = () => {
    const prestigeThreshold = getPrestigeCost(prestige);
    const earnedPrestige = Math.floor(balance / prestigeThreshold);
    if (earnedPrestige <= 0) return;

    setBalance(0);
    setClicks(0);
    setUpgrades({});
    setPsuStates({});
    setActivePsu(null);
    setPrestige(prev => prev + earnedPrestige);
    setActiveNetworks([]);
  };

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("afcGame", JSON.stringify({
      balance, clicks, upgrades, psuStates, activePsu, prestige, activeNetworks
    }));
  }, [balance, clicks, upgrades, psuStates, activePsu, prestige, activeNetworks]);

  // Compute stats
  const autoMinerCount = Object.entries(upgrades)
    .filter(([name]) => allUpgrades[name]?.type === "gpu")
    .reduce((sum, [, level]) => sum + level, 0);

  const hashrate = autoMinerCount;
  const miningPower = Object.entries(upgrades).reduce((sum, [name, level]) => {
    const upg = allUpgrades[name];
    if (!upg) return sum;
    if (upg.type === "cpu" || upg.type === "gpu") return sum + level;
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
      miningPower: totalClickPower,
      psuStates,
      activePsu,
      activatePsu,
      activeNetworks,
      activateNetwork,
      autoMiningAFCPerSec,
    }}>
      <FallingCoins />
      {children}
    </GameContext.Provider>
  );
};
