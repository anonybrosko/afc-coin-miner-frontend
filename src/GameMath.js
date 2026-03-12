export const BASE_PRESTIGE_COST = 0.01000000;
export const PRESTIGE_MULTIPLIER = 1.2;

/**
 * Returns the current prestige cost based on the number of prestige points
 */
export const getPrestigeCost = (prestige) => {
  return BASE_PRESTIGE_COST * Math.pow(PRESTIGE_MULTIPLIER, prestige);
};
