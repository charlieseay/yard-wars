/**
 * Premium spacing scale
 * Refined scale with more granularity for polished layouts
 */

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,

  // Minimum tap target size (accessibility + outdoor usability)
  minTouchTarget: 48,

  // Layout padding
  screenPadding: 20,
  cardPadding: 16,
  sectionSpacing: 32,

  // Border radius
  radiusSmall: 8,
  radiusMedium: 12,
  radiusLarge: 16,
  radiusXLarge: 24,
  radiusFull: 9999,
} as const;

export type Spacing = typeof spacing;
