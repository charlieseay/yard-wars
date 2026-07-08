/**
 * Chip Tray Component
 * Displays available chips that can be assigned to players
 * Drag-drop functionality for assigning chips
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Chip } from '../../types/game';

interface ChipTrayProps {
  chips: Chip[];
  onChipPress: (chipId: string) => void;
}

export function ChipTray({ chips, onChipPress }: ChipTrayProps) {
  if (chips.length === 0) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CHIPS</Text>
      <View style={styles.chipContainer}>
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip.id}
            style={[
              styles.chip,
              chip.type === 'positive' ? styles.chipPositive : styles.chipNegative,
            ]}
            onPress={() => onChipPress(chip.id)}
          >
            <Text style={styles.chipIcon}>{chip.icon || '•'}</Text>
            <Text style={styles.chipName}>{chip.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  title: {
    ...theme.typography.caption,
    color: theme.colors.neonYellow,
    marginBottom: theme.spacing.sm,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 16,
    borderWidth: 2,
    gap: theme.spacing.xs,
  },
  chipPositive: {
    backgroundColor: '#001100',
    borderColor: theme.colors.neonGreen,
  },
  chipNegative: {
    backgroundColor: '#110000',
    borderColor: theme.colors.neonRed,
  },
  chipIcon: {
    fontSize: 20,
  },
  chipName: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
  },
});
