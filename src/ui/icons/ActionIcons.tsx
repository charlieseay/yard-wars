/**
 * Action Icons
 * Icons for in-game actions (scoring, cards, chips, etc.)
 */

import React from 'react';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface IconProps {
  size?: number;
  color?: string;
}

/**
 * Score Increment (+1)
 */
export function ScorePlusIcon({ size = 32, color = theme.colors.textPrimary }: IconProps) {
  return <Ionicons name="add-circle" size={size} color={color} />;
}

/**
 * Score Decrement (-1)
 */
export function ScoreMinusIcon({ size = 32, color = theme.colors.textPrimary }: IconProps) {
  return <Ionicons name="remove-circle" size={size} color={color} />;
}

/**
 * Card Draw
 */
export function CardDrawIcon({ size = 32, color = theme.colors.textPrimary }: IconProps) {
  return <MaterialCommunityIcons name="cards-outline" size={size} color={color} />;
}

/**
 * Chip/Token
 */
export function ChipIcon({ size = 32, color = theme.colors.textPrimary }: IconProps) {
  return <MaterialCommunityIcons name="poker-chip" size={size} color={color} />;
}

/**
 * Ace Celebration (trophy)
 */
export function AceIcon({ size = 48, color = theme.colors.accentSkins }: IconProps) {
  return <Ionicons name="trophy" size={size} color={color} />;
}

/**
 * Settlement/Payout (dollar sign)
 */
export function SettlementIcon({ size = 32, color = theme.colors.accentSkins }: IconProps) {
  return <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />;
}

/**
 * Undo Action
 */
export function UndoIcon({ size = 24, color = theme.colors.textSecondary }: IconProps) {
  return <Ionicons name="arrow-undo" size={size} color={color} />;
}

/**
 * Settings/Config
 */
export function SettingsIcon({ size = 24, color = theme.colors.textPrimary }: IconProps) {
  return <Ionicons name="settings-outline" size={size} color={color} />;
}

/**
 * History/Stats
 */
export function HistoryIcon({ size = 24, color = theme.colors.textPrimary }: IconProps) {
  return <Ionicons name="stats-chart" size={size} color={color} />;
}

/**
 * Watch Sync
 */
export function WatchIcon({ size = 24, color = theme.colors.textPrimary }: IconProps) {
  return <Ionicons name="watch" size={size} color={color} />;
}

/**
 * Home/Dashboard
 */
export function HomeIcon({ size = 24, color = theme.colors.textPrimary }: IconProps) {
  return <Ionicons name="home" size={size} color={color} />;
}

/**
 * Active Round (play button)
 */
export function ActiveRoundIcon({ size = 24, color = theme.colors.accentSkins }: IconProps) {
  return <Ionicons name="play-circle" size={size} color={color} />;
}

/**
 * Player Indicator (person)
 */
export function PlayerIcon({ size = 24, color = theme.colors.textPrimary }: IconProps) {
  return <Ionicons name="person" size={size} color={color} />;
}

/**
 * Check/Confirm
 */
export function CheckIcon({ size = 24, color = theme.colors.accentSkins }: IconProps) {
  return <Ionicons name="checkmark-circle" size={size} color={color} />;
}

/**
 * Close/Cancel
 */
export function CloseIcon({ size = 24, color = theme.colors.accentPenalties }: IconProps) {
  return <Ionicons name="close-circle" size={size} color={color} />;
}

/**
 * Info/Help
 */
export function InfoIcon({ size = 24, color = theme.colors.textSecondary }: IconProps) {
  return <Ionicons name="information-circle" size={size} color={color} />;
}
