/**
 * Premium typography scale
 * Clean, modern hierarchy with refined weights
 */

export const typography = {
  // Hero display (titles, branding)
  display: {
    fontSize: 48,
    fontWeight: '800' as const,
    lineHeight: 56,
    letterSpacing: -1,
  },

  // Massive score counters
  scoreDisplay: {
    fontSize: 64,
    fontWeight: '700' as const,
    lineHeight: 72,
    letterSpacing: -0.5,
  },

  // Large headings
  heading1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },

  heading2: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },

  heading3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },

  // Body text
  bodyLarge: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 26,
  },

  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },

  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },

  // Labels and captions
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 20,
    textTransform: 'uppercase' as const,
    letterSpacing: 0.5,
  },

  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
  },

  // Button text
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: 0.5,
  },

  buttonLarge: {
    fontSize: 18,
    fontWeight: '700' as const,
    lineHeight: 28,
    letterSpacing: 0.5,
  },
} as const;

export type Typography = typeof typography;
