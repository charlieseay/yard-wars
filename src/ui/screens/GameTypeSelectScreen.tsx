/**
 * Game Type Select Screen
 * Starting screen - user picks which game they're playing
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { GameType, GAME_TYPE_LABELS, GAME_TYPE_DESCRIPTIONS } from '../../types/gameTypes';
import { theme } from '../theme';
import {
  DiscGolfIcon,
  CornholeIcon,
  HorseshoesIcon,
  CustomGameIcon,
} from '../icons';

interface GameTypeSelectScreenProps {
  onSelectGame: (gameType: GameType) => void;
}

export function GameTypeSelectScreen({ onSelectGame }: GameTypeSelectScreenProps) {
  const gameTypes = [
    { type: GameType.DISC_GOLF, Icon: DiscGolfIcon },
    { type: GameType.CORNHOLE, Icon: CornholeIcon },
    { type: GameType.HORSESHOES, Icon: HorseshoesIcon },
    { type: GameType.CUSTOM, Icon: CustomGameIcon },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>YARD WARS</Text>
        <Text style={styles.tagline}>Friendly games. Serious stakes.</Text>
      </View>

      <Text style={styles.prompt}>What are you playing today?</Text>

      <View style={styles.gameGrid}>
        {gameTypes.map(({ type, Icon }) => (
          <TouchableOpacity
            key={type}
            style={styles.gameCard}
            onPress={() => onSelectGame(type)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              <Icon size={64} color={theme.colors.accentSkins} />
            </View>
            <Text style={styles.gameTitle}>{GAME_TYPE_LABELS[type]}</Text>
            <Text style={styles.gameDescription}>{GAME_TYPE_DESCRIPTIONS[type]}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Track scores • Side games • Settle up
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xxl,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
    fontSize: 48,
    letterSpacing: 2,
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    ...theme.typography.body,
    color: theme.colors.accentSkins,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  prompt: {
    ...theme.typography.heading2,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontSize: 20,
  },
  gameGrid: {
    gap: theme.spacing.md,
  },
  gameCard: {
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: 16,
    padding: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    alignItems: 'center',
    minHeight: 180,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  gameTitle: {
    ...theme.typography.heading3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    fontSize: 20,
  },
  gameDescription: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    marginTop: theme.spacing.xxl,
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.bodySmall,
    color: theme.colors.textDisabled,
    fontSize: 12,
  },
});
