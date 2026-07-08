/**
 * Typography scale optimized for outdoor readability
 * Large sizes for fat-finger targets and sunlight visibility
 */

export const typography = {
  // Massive score counters
  scoreDisplay: {
    fontSize: 72,
    fontWeight: '700' as const,
    lineHeight: 80,
  },

  // Large headings for hole info
  heading1: {
    fontSize: 32,
    fontWeight: '600' as const,
    lineHeight: 40,
  },

  heading2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },

  // Player names and labels
  body: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 24,
  },

  // Chip badges and secondary info
  caption: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18,
  },

  // Button text
  button: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
} as const;

export type Typography = typeof typography;
