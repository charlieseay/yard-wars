/**
 * OLED-optimized color palette for Birdies and Bourbon
 * True black (#000000) pixels are powered OFF on OLED screens = massive battery savings
 * High-contrast neon accents for outdoor sunlight visibility
 */

export const colors = {
  // Primary - OLED True Black
  background: '#000000', // Pixels literally off = battery saver

  // Text
  textPrimary: '#FFFFFF', // Pure white for maximum contrast
  textSecondary: '#CCCCCC', // Slightly dimmed for secondary info
  textDisabled: '#666666', // Dimmed for disabled states

  // Neon Accents - High visibility in sunlight
  neonGreen: '#00FF00', // Skins indicator
  neonRed: '#FF0044', // Penalty chips
  neonCyan: '#00FFFF', // Reward chips
  neonYellow: '#FFFF00', // Active modifiers
  neonPurple: '#FF00FF', // Special actions

  // Borders & Dividers
  border: '#333333', // Subtle gray for structure
  divider: '#222222', // Even more subtle

  // Semantic Colors
  success: '#00FF00',
  error: '#FF0044',
  warning: '#FFFF00',
  info: '#00FFFF',

  // Player Color Options (high-contrast neons)
  playerColors: [
    '#00FF00', // Green
    '#FF0044', // Red
    '#00FFFF', // Cyan
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#FF8800', // Orange
  ],
} as const;

export type Colors = typeof colors;
