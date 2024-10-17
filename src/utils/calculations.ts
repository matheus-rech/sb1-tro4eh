export function calculateSampleSize(
  effectSize: number,
  sigma: number,
  alpha: number,
  power: number,
  dropoutRate: number,
  designEffect: number
): number {
  // Calculate z-scores for alpha and power
  const zAlpha = -0.862 + Math.sqrt(0.743 - 2.404 * Math.log(alpha));
  const zBeta = -0.862 + Math.sqrt(0.743 - 2.404 * Math.log(1 - power));

  // Calculate basic sample size
  const n = Math.ceil(
    2 * Math.pow((zAlpha + zBeta) / (effectSize / sigma), 2)
  );

  // Adjust for dropout rate and design effect
  const adjustedN = Math.ceil(n / (1 - dropoutRate) * designEffect);

  return adjustedN;
}