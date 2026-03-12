export const BASE_PRESTIGE_COST = 0.0001;
export const PRESTIGE_MULTIPLIER = 1.6;

export const getPrestigeCost = (prestige) => 
BASE_PRESTIGE_COST * Math.pow(PRESTIGE_MULTIPLIER, prestige)
