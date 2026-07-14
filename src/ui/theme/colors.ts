/**
 * Premium OLED-optimized color palette
 * True black (#000000) pixels are powered OFF on OLED screens = massive battery savings
 * Refined gradient accents with depth and sophistication
 */

export const colors = {
  // Backgrounds - OLED optimized layers
  background: '#000000',      // Pure black = pixels off
  surface: '#0a0a0a',        // Subtle elevation
  surfaceElevated: '#141414', // Card backgrounds
  surfaceHighlight: '#1a1a1a', // Interactive states

  // Text hierarchy (refined grays)
  textPrimary: '#FFFFFF',
  textSecondary: '#a0a0a0',
  textTertiary: '#707070',
  textDisabled: '#4a4a4a',

  // Primary brand (premium teal-green)
  primary: '#00FF88',
  primaryDim: '#00CC6A',
  primaryDark: '#00994F',
  primaryGlow: 'rgba(0, 255, 136, 0.2)',

  // Semantic colors (refined from harsh neon)
  success: '#00FF88',
  error: '#FF3B5C',
  warning: '#FFB020',
  info: '#00D9FF',

  // Chips
  chipPositive: '#00FF88',
  chipNegative: '#FF3B5C',
  chipNeutral: '#FFB020',

  // Borders & dividers (subtle depth)
  borderSubtle: '#1a1a1a',
  border: '#2a2a2a',
  borderAccent: '#3a3a3a',
  divider: '#1a1a1a',

  // Glass morphism
  glassBg: 'rgba(20, 20, 20, 0.85)',
  glassHighlight: 'rgba(255, 255, 255, 0.05)',
  glassBorder: 'rgba(255, 255, 255, 0.08)',

  // Shadows & glows (premium depth)
  shadowHeavy: 'rgba(0, 0, 0, 0.8)',
  glowPrimary: 'rgba(0, 255, 136, 0.25)',
  glowError: 'rgba(255, 59, 92, 0.25)',
  glowWarning: 'rgba(255, 176, 32, 0.25)',

  // Player colors (vibrant but refined)
  playerColors: [
    '#00FF88',  // Teal-green
    '#00D9FF',  // Cyan
    '#FF3B5C',  // Pink-red
    '#FFB020',  // Amber
    '#A78BFA',  // Purple
    '#FB923C',  // Orange
  ],

  // Legacy neon (keep for backward compat)
  neonGreen: '#00FF88',
  neonRed: '#FF3B5C',
  neonCyan: '#00D9FF',
  neonYellow: '#FFB020',
  neonPurple: '#A78BFA',

  // Skins and penalties (game-specific accents)
  accentSkins: '#00FF88',      // Success/green for skins
  accentPenalties: '#FF3B5C',  // Error/red for penalties
} as const;

export type Colors = typeof colors;
