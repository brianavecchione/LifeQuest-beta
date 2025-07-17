// Feature flags configuration
// Set to false to disable features in production

export const FEATURE_FLAGS = {
  ENABLE_AI_SIDEKICK: false,
  // Add other feature flags here as needed
} as const;

export type FeatureFlag = keyof typeof FEATURE_FLAGS;

export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  return FEATURE_FLAGS[flag];
};