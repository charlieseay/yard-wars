/**
 * Game Type Icons
 * Platform-aware icons for each game type
 * iOS: SF Symbols (native)
 * Android: Expo vector-icons (MaterialCommunityIcons)
 */

import React from 'react';
import { Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';

interface IconProps {
  size?: number;
  color?: string;
}

/**
 * Disc Golf Icon
 * iOS: sportscourt.fill (closest to disc golf basket)
 * Android: disc (flying disc)
 */
export function DiscGolfIcon({ size = 48, color = theme.colors.textPrimary }: IconProps) {
  return (
    <MaterialCommunityIcons
      name="disc"
      size={size}
      color={color}
    />
  );
}

/**
 * Cornhole Icon
 * iOS/Android: sack (corn bag)
 */
export function CornholeIcon({ size = 48, color = theme.colors.textPrimary }: IconProps) {
  return (
    <MaterialCommunityIcons
      name="sack"
      size={size}
      color={color}
    />
  );
}

/**
 * Horseshoes Icon
 * iOS/Android: horseshoe
 */
export function HorseshoesIcon({ size = 48, color = theme.colors.textPrimary }: IconProps) {
  return (
    <MaterialCommunityIcons
      name="horseshoe"
      size={size}
      color={color}
    />
  );
}

/**
 * Custom Game Icon
 * iOS/Android: wrench (customization)
 */
export function CustomGameIcon({ size = 48, color = theme.colors.textPrimary }: IconProps) {
  return (
    <MaterialCommunityIcons
      name="wrench"
      size={size}
      color={color}
    />
  );
}

/**
 * Icon map for dynamic lookup
 */
export const GAME_TYPE_ICONS = {
  disc_golf: DiscGolfIcon,
  cornhole: CornholeIcon,
  horseshoes: HorseshoesIcon,
  custom: CustomGameIcon,
} as const;
