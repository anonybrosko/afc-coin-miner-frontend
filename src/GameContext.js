import React, { createContext, useState, useEffect } from "react";

export const GameContext = createContext();

const API = "https://afc-coin-miner-backend.onrender.com";

export const GameProvider = ({ children }) => {
  // Load state from localStorage if present
  const saved = JSON.parse(localStorage.getItem("afcGame")) || {};

  const [balance, setBalance] = useState(saved.balance || 0);
  const [clicks, setClicks] = useState(saved.clicks || 0);
  const [upgrades, setUpgrades] = useState(saved.upgrades || { pickaxe: 1, autoMiner: 0 });
  const [prestige, setPrestige] = useState(saved.prestige || 0);

  const detectMobile = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const mobileUA = /android|iphone|ipad|ipod|mobile|tablet|iemobile|ipad/i.test(ua);
    const smallScreen = typeof window !== "undefined" && window.innerWidth <= 768;
    return mobileUA || smallScreen;
  };

  const [isMobile, setIsMobile] = useState(detectMobile());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(detectMobile());
    }; 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Save state to localStorage on every change
  useEffect(() => {
    localStorage.setItem(
      "afcGame",
      JSON.stringify({ balance, clicks, upgrades, prestige })
    );
  }, [balance, clicks, upgrades, prestige]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (upgrades.autoMiner > 0) {
        const reward = upgrades.autoMiner * upgrades.pickaxe;

        setBalance(prev => prev + reward);
        setClicks(prev => prev + upgrades.autoMiner);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [upgrades]);

  const hashrate = ((upgrades.autoMiner || 0) * 2 + (upgrades.pickaxe || 1)) * 1;
  const miningPower = (upgrades.pickaxe || 1) + (upgrades.autoMiner || 0);
  const autoMinerCount = upgrades.autoMiner || 0;

  const mineCoin = async () => {
    const baseReward = Math.floor(Math.random() * 5) + 1;
    const totalReward = baseReward * (upgrades.pickaxe || 1);
    setBalance((prev) => prev + totalReward);
    setClicks((prev) => prev + 1);

    fetch(`${API}/mine`).catch(err => console.error("Backend unreachable", err));
  };

  const buyUpgrade = (name, cost) => {
    if (balance >= cost) {
      setBalance((prev) => prev - cost);
      setUpgrades((prev) => ({
        ...prev,
        [name]: (prev[name] || 0) + 1,
      }));
    }
  };

  const doPrestige = () => {
    const earnedPrestige = Math.floor(balance / 1000);
    if (earnedPrestige > 0) {
      setBalance(0);
      setClicks(0);
      setUpgrades({ pickaxe: 1 });
      setPrestige((prev) => prev + earnedPrestige);
    }
  };

  return (
    <GameContext.Provider
      value={{ balance, clicks, upgrades, prestige, mineCoin, buyUpgrade, doPrestige, isMobile, hashrate, miningPower, autoMinerCount }}
    >
      {children}
    </GameContext.Provider>
  );
};
