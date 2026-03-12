// upgradesTable.js

const scaleCosts = (base, tiers, minMultiplier = 1.6, maxMultiplier = 2.3) => {
  const costs = [];
  for (let i = 0; i < tiers; i++){
    const multiplier = minMultiplier + Math.random() * (maxMultiplier - minMultiplier);
    const prev = costs[i-1] || base;
    costs.push(Number((prev * multiplier).toFixed(8)));
  }
  return costs;
};

const psuTiers = [
  "EVGA PSU", "Corsair PSU", "ASUS PSU", "Thermaltake PSU", "AMD Vega",
  "NVIDIA Titan", "AMD RX", "NVIDIA 3090"
];


const gpuTiers = [
  "NVIDIA RTX", "AMD Radeon", "NVIDIA GTX", "AMD Vega",
  "NVIDIA Titan", "AMD RX", "NVIDIA 3090"
];

const cpuTiers = [
  "Intel i9", "AMD Ryzen", "Intel i7", "AMD Ryzen 7",
  "Intel i5", "AMD Ryzen 5", "Intel Xeon"
];

const networkTiers = [
  "Fiber Network", "DSL Network", "5G Network", "Satellite Network",
  "Optic Network", "LTE Network", "Quantum Network"
];

const psuCosts = scaleCosts(0.00001, psuTiers.length);
const gpuCosts = scaleCosts(0.00003, gpuTiers.length);
const cpuCosts = scaleCosts(0.000007, cpuTiers.length);
const networkCosts = scaleCosts(0.00005, networkTiers.length);

export const allUpgrades = {
  // --- PSU ---
  "evga-psu": { type: "psu", label: psuTiers[0], baseCost: psuCosts[0], energy: 0.001, effect: 0.000001, description: "Boosts auto-mining while energy lasts" },
  "corsair-psu": { type: "psu", label: psuTiers[1], baseCost: psuCosts[1], energy: 0.002, effect: 0.000015, description: "Stronger PSU, more energy per second" },
  "asus-psu": { type: "psu", label: psuTiers[2], baseCost: psuCosts[2], energy: 0.003, effect: 0.000025, description: "High-end PSU with longer energy" },
  "thermaltake-psu": { type: "psu", label: psuTiers[3], baseCost: psuCosts[3], energy: 0.004, effect: 0.000035, description: "Premium PSU, fast auto-mining" },
  "cooler-master-psu": { type: "psu", label: psuTiers[4], baseCost: psuCosts[4], energy: 0.005, effect: 0.000045, description: "Massive energy for continuous mining" },
  "silverstone-psu": { type: "psu", label: psuTiers[5], baseCost: psuCosts[5], energy: 0.006, effect: 0.00006, description: "High capacity PSU, elite auto-mining" },
  "seasonic-psu": { type: "psu", label: psuTiers[6], baseCost: psuCosts[6], energy: 0.008, effect: 0.00008, description: "Top-tier PSU, max auto-mining" },

  // --- GPU ---
  "nvidia-rtx": { type: "gpu", label: gpuTiers[0], baseCost: gpuCosts[0], effect: 0.00002, description: "Increases auto-mining speed" },
  "amd-radeon": { type: "gpu", label: gpuTiers[1], baseCost: gpuCosts[1], effect: 0.000018, description: "Slightly slower, cheaper GPU boost" },
  "nvidia-gtx": { type: "gpu", label: gpuTiers[2], baseCost: gpuCosts[2], effect: 0.000025, description: "Good GPU boost for early game" },
  "amd-vega": { type: "gpu", label: gpuTiers[3], baseCost: gpuCosts[3], effect: 0.00003, description: "Mid-tier GPU for faster mining" },
  "nvidia-titan": { type: "gpu", label: gpuTiers[4], baseCost: gpuCosts[4], effect: 0.00004, description: "High-end GPU with strong auto-mining" },
  "amd-rx": { type: "gpu", label: gpuTiers[5], baseCost: gpuCosts[5], effect: 0.000035, description: "Premium GPU, fast mining" },
  "nvidia-3090": { type: "gpu", label: gpuTiers[6], baseCost: gpuCosts[6], effect: 0.00005, description: "Top GPU, elite auto-mining" },

  // --- CPU ---
  "intel-i9": { type: "cpu", label: cpuTiers[0], baseCost: cpuCosts[0], effect: 0.000005, description: "Boosts manual mining per click" },
  "amd-ryzen": { type: "cpu", label: cpuTiers[1], baseCost: cpuCosts[1], effect: 0.000004, description: "Boosts manual mining slightly less" },
  "intel-i7": { type: "cpu", label: cpuTiers[2], baseCost: cpuCosts[2], effect: 0.000007, description: "Mid-tier CPU for manual mining" },
  "amd-ryzen-7": { type: "cpu", label: cpuTiers[3], baseCost: cpuCosts[3], effect: 0.000006, description: "Good CPU for click mining" },
  "intel-i5": { type: "cpu", label: cpuTiers[4], baseCost: cpuCosts[4], effect: 0.000009, description: "Fast CPU, decent clicks" },
  "amd-ryzen-5": { type: "cpu", label: cpuTiers[5], baseCost: cpuCosts[5], effect: 0.000008, description: "Balanced CPU for manual mining" },
  "intel-xeon": { type: "cpu", label: cpuTiers[6], baseCost: cpuCosts[6], effect: 0.000012, description: "High-end CPU, strong click power" },

  // --- Network ---
  "fiber-network": { type: "network", label: networkTiers[0], baseCost: networkCosts[0], duration: 60, effect: 1.2, description: "Increases mining output for a limited time" },
  "dsl-network": { type: "network", label: networkTiers[1], baseCost: networkCosts[1], duration: 30, effect: 1.05, description: "Small mining boost for short time" },
  "5g-network": { type: "network", label: networkTiers[2], baseCost: networkCosts[2], duration: 45, effect: 1.3, description: "Fast 5G network boost" },
  "satellite-network": { type: "network", label: networkTiers[3], baseCost: networkCosts[3], duration: 50, effect: 1.4, description: "Strong network for mining boost" },
  "optic-network": { type: "network", label: networkTiers[4], baseCost: networkCosts[4], duration: 40, effect: 1.35, description: "Premium fiber optic boost" },
  "lte-network": { type: "network", label: networkTiers[5], baseCost: networkCosts[5], duration: 35, effect: 1.1, description: "Small LTE network boost" },
  "quantum-network": { type: "network", label: networkTiers[6], baseCost: networkCosts[6], duration: 60, effect: 1.5, description: "Top-tier network with massive boost" },
};
