import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from '../theme/ThemeContext';

export default function Lifelines({
  onHint, onFiftyFifty, onCallFriend,
  usedFifty, usedCall, hintLevel,
  coins, hintCost, fiftyCost, callCost,
}) {
  const { colors: C } = useTheme();

  const hintLabel = hintLevel === 0 ? 'Hint' : hintLevel === 1 ? 'Hint+ (10)' : 'Hint done';
  const hintIcon = hintLevel === 0 ? 'bulb-outline' : hintLevel === 1 ? 'bulb' : 'checkmark-circle';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.lifeline, { backgroundColor: C.card, borderColor: C.cardBorder }, hintLevel >= 2 && styles.used]}
        onPress={onHint}
        disabled={hintLevel >= 2}
      >
        <Ionicons name={hintIcon} size={20} color={hintLevel >= 2 ? C.textMuted : C.warning} />
        <AppText style={[styles.label, { color: C.textLight }, hintLevel >= 2 && { color: C.textMuted }]}>
          {hintLabel}
        </AppText>
        {coins < hintCost && hintLevel === 1 && (
          <Ionicons name="lock-closed" size={12} color={C.danger} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.lifeline, { backgroundColor: C.card, borderColor: C.cardBorder }, usedFifty && styles.used]}
        onPress={onFiftyFifty}
        disabled={usedFifty}
      >
        <Ionicons name="cut-outline" size={20} color={usedFifty ? C.textMuted : C.mana} />
        <AppText style={[styles.label, { color: C.textLight }, usedFifty && { color: C.textMuted }]}>
          50/50{fiftyCost > 0 ? ` (${fiftyCost})` : ''}
        </AppText>
        {coins < fiftyCost && !usedFifty && (
          <Ionicons name="lock-closed" size={12} color={C.danger} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.lifeline, { backgroundColor: C.card, borderColor: C.cardBorder }, usedCall && styles.used]}
        onPress={onCallFriend}
        disabled={usedCall}
      >
        <Ionicons name="people-outline" size={20} color={usedCall ? C.textMuted : C.secondary} />
        <AppText style={[styles.label, { color: C.textLight }, usedCall && { color: C.textMuted }]}>
          Friend{callCost > 0 ? ` (${callCost})` : ''}
        </AppText>
        {coins < callCost && !usedCall && (
          <Ionicons name="lock-closed" size={12} color={C.danger} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    gap: 8,
  },
  lifeline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  used: {
    opacity: 0.4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
});
