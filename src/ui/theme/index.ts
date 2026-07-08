/**
 * Central theme export for Birdies and Bourbon
 * OLED-optimized, high-contrast, outdoor-friendly design system
 */

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing,
} as const;

export type Theme = typeof theme;

export * from './colors';
export * from './typography';
export * from './spacing';
