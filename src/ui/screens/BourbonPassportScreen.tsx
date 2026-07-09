/**
 * Bourbon Passport Screen
 * Career stats, distillery check-ins, expeditions
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { theme } from '../theme';
import { RoundState, DistilleryCheckIn, Expedition } from '../../types/game';
import { RoundRepository } from '../../storage/RoundRepository';

interface BourbonPassportScreenProps {
  onBack: () => void;
}

export function BourbonPassportScreen({ onBack }: BourbonPassportScreenProps) {
  const [completedRounds, setCompletedRounds] = useState<RoundState[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const rounds = await RoundRepository.listCompletedRounds();
    setCompletedRounds(rounds);
    setLoading(false);
  };

  // Calculate career stats
  const totalRounds = completedRounds.length;
  const totalHoles = totalRounds * 18;

  // This would calculate actual earnings from ledgers
  const lifetimeEarnings = 0; // TODO: Sum from round ledgers

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.backButton}>← BACK</Text>
        </TouchableOpacity>
        <Text style={styles.title}>BOURBON & BIRDIES PASSPORT</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Career Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Career Stats</Text>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalRounds}</Text>
              <Text style={styles.statLabel}>Rounds</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalHoles}</Text>
              <Text style={styles.statLabel}>Holes</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={[styles.statValue, styles.statValueCurrency]}>
                ${lifetimeEarnings.toFixed(0)}
              </Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
          </View>
        </View>

        {/* Recent Rounds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Rounds</Text>

          {loading ? (
            <Text style={styles.emptyText}>Loading...</Text>
          ) : completedRounds.length === 0 ? (
            <Text style={styles.emptyText}>
              No completed rounds yet. Play your first round to see stats here!
            </Text>
          ) : (
            completedRounds.slice(0, 10).map((round) => (
              <View key={round.roundId} style={styles.roundCard}>
                <View style={styles.roundHeader}>
                  <Text style={styles.roundCourse}>{round.courseName}</Text>
                  <Text style={styles.roundDate}>
                    {new Date(round.completedAt!).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={styles.roundPlayers}>
                  {Object.keys(round.players).length} players
                </Text>
              </View>
            ))
          )}
        </View>

        {/* Distillery Passport */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Distillery Passport</Text>
          <Text style={styles.emptyText}>
            🥃 No distillery check-ins yet.{'\n'}
            Complete a round near a distillery to unlock!
          </Text>
        </View>

        {/* Expeditions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expeditions</Text>
          <Text style={styles.emptyText}>
            🗺️ Multi-course trips coming soon!
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    ...theme.typography.body,
    color: theme.colors.neonCyan,
    marginBottom: theme.spacing.sm,
  },
  title: {
    ...theme.typography.heading1,
    color: theme.colors.textPrimary,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    ...theme.typography.heading2,
    color: theme.colors.neonYellow,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  statValue: {
    ...theme.typography.scoreDisplay,
    fontSize: 36,
    color: theme.colors.neonGreen,
    marginBottom: theme.spacing.xs,
  },
  statValueCurrency: {
    fontSize: 28,
  },
  statLabel: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    padding: theme.spacing.lg,
  },
  roundCard: {
    backgroundColor: theme.colors.border,
    borderRadius: 8,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  roundHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  roundCourse: {
    ...theme.typography.body,
    color: theme.colors.textPrimary,
    fontWeight: '600',
  },
  roundDate: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  roundPlayers: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
});
