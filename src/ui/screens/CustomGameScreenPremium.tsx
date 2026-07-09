/**
 * Premium Custom Game Builder Screen
 * Professional workshop for creating custom decks
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { theme } from '../theme';
import { GameDeck, Chip, CardModifier } from '../../types/game';
import { generateUUID } from '../../utils/uuid';

interface CustomGameScreenPremiumProps {
  onSaveDeck: (deck: GameDeck) => void;
  onBack: () => void;
}

export function CustomGameScreenPremium({ onSaveDeck, onBack }: CustomGameScreenPremiumProps) {
  const [deckName, setDeckName] = useState('');
  const [deckDescription, setDeckDescription] = useState('');
  const [chips, setChips] = useState<Chip[]>([]);
  const [cards, setCards] = useState<Omit<CardModifier, 'id' | 'isExpired' | 'targetPlayerId'>[]>([]);

  const addChip = () => {
    const newChip: Chip = {
      id: `chip-${generateUUID()}`,
      name: 'New Chip',
      type: 'negative',
      weight: 1,
      icon: '•',
    };
    setChips([...chips, newChip]);
  };

  const addCard = () => {
    const newCard = {
      name: 'New Card',
      description: 'Card description',
      timingWindow: 'currentHole' as const,
      targetVector: 'single' as const,
      engineModification: 'addStroke' as const,
    };
    setCards([...cards, newCard]);
  };

  const handleSave = () => {
    if (!deckName.trim()) {
      Alert.alert('Error', 'Please enter a deck name');
      return;
    }

    const deck: GameDeck = {
      id: `custom-${generateUUID()}`,
      name: deckName.trim(),
      description: deckDescription.trim() || 'Custom game deck',
      isCustom: true,
      chips,
      cardTemplates: cards,
    };

    onSaveDeck(deck);
    Alert.alert('Success', 'Custom deck saved!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} activeOpacity={0.7}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Custom Game Builder</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Deck Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>DECK INFO</Text>

          <TextInput
            style={styles.input}
            placeholder="Deck Name"
            placeholderTextColor={theme.colors.textTertiary}
            value={deckName}
            onChangeText={setDeckName}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            placeholderTextColor={theme.colors.textTertiary}
            value={deckDescription}
            onChangeText={setDeckDescription}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Chips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>CHIPS ({chips.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={addChip} activeOpacity={0.7}>
              <Text style={styles.addButtonText}>+ Add Chip</Text>
            </TouchableOpacity>
          </View>

          {chips.map((chip, index) => (
            <View key={chip.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>Chip #{index + 1}</Text>
                <View
                  style={[
                    styles.chipTypeBadge,
                    chip.type === 'positive' ? styles.chipPositive : styles.chipNegative,
                  ]}
                >
                  <Text style={styles.chipTypeText}>{chip.type}</Text>
                </View>
              </View>

              <TextInput
                style={styles.itemInput}
                placeholder="Chip name"
                placeholderTextColor={theme.colors.textTertiary}
                value={chip.name}
                onChangeText={(text) => {
                  const updated = [...chips];
                  updated[index].name = text;
                  setChips(updated);
                }}
              />

              <View style={styles.itemMeta}>
                <Text style={styles.itemMetaLabel}>Weight: ${chip.weight}</Text>
              </View>
            </View>
          ))}

          {chips.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No chips yet. Add your first chip!</Text>
            </View>
          )}
        </View>

        {/* Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionLabel}>CARDS ({cards.length})</Text>
            <TouchableOpacity style={styles.addButton} onPress={addCard} activeOpacity={0.7}>
              <Text style={styles.addButtonText}>+ Add Card</Text>
            </TouchableOpacity>
          </View>

          {cards.map((card, index) => (
            <View key={index} style={styles.itemCard}>
              <Text style={styles.itemTitle}>Card #{index + 1}</Text>

              <TextInput
                style={styles.itemInput}
                placeholder="Card name"
                placeholderTextColor={theme.colors.textTertiary}
                value={card.name}
                onChangeText={(text) => {
                  const updated = [...cards];
                  updated[index].name = text;
                  setCards(updated);
                }}
              />

              <TextInput
                style={[styles.itemInput, styles.textArea]}
                placeholder="Description"
                placeholderTextColor={theme.colors.textTertiary}
                value={card.description}
                onChangeText={(text) => {
                  const updated = [...cards];
                  updated[index].description = text;
                  setCards(updated);
                }}
                multiline
                numberOfLines={2}
              />

              <View style={styles.itemMeta}>
                <Text style={styles.itemMetaLabel}>
                  {card.timingWindow} · {card.targetVector}
                </Text>
              </View>
            </View>
          ))}

          {cards.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No cards yet. Add your first card!</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.primaryButton} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.primaryButtonText}>Save Deck</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.screenPadding,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderSubtle,
  },
  backButton: {
    ...theme.typography.body,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.screenPadding,
  },
  section: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sectionSpacing,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  sectionLabel: {
    ...theme.typography.label,
    color: theme.colors.primary,
  },
  input: {
    ...theme.typography.bodyLarge,
    backgroundColor: theme.colors.surfaceElevated,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.spacing.radiusMedium,
    padding: theme.spacing.lg,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.radiusSmall,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  addButtonText: {
    ...theme.typography.label,
    color: theme.colors.background,
    fontSize: 12,
  },
  itemCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.radiusMedium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  itemTitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  chipTypeBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: theme.spacing.radiusSmall,
  },
  chipPositive: {
    backgroundColor: theme.colors.primaryGlow,
  },
  chipNegative: {
    backgroundColor: 'rgba(255, 59, 92, 0.15)',
  },
  chipTypeText: {
    ...theme.typography.caption,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  itemInput: {
    ...theme.typography.body,
    backgroundColor: theme.colors.surfaceElevated,
    borderRadius: theme.spacing.radiusSmall,
    padding: theme.spacing.md,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  itemMeta: {
    marginTop: theme.spacing.xs,
  },
  itemMetaLabel: {
    ...theme.typography.caption,
    color: theme.colors.textTertiary,
  },
  emptyState: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.spacing.radiusMedium,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: theme.spacing.xxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textTertiary,
  },
  bottomActions: {
    padding: theme.spacing.screenPadding,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderSubtle,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.spacing.radiusLarge,
    paddingVertical: theme.spacing.lg,
    alignItems: 'center',
    shadowColor: theme.colors.glowPrimary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonText: {
    ...theme.typography.buttonLarge,
    color: theme.colors.background,
  },
});
