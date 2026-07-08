/**
 * Spacing scale for layout consistency
 * Generous spacing for outdoor fat-finger usability
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Minimum tap target size (accessibility + fat-finger friendly)
  minTouchTarget: 48,
} as const;

export type Spacing = typeof spacing;
