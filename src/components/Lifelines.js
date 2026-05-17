import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { useTheme } from '../theme/ThemeContext';

function Lifelines({
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
        style={[styles.lifeline, { backgroundColor: `${C.card}E0`, borderColor: `${C.warning}35` }, hintLevel >= 2 && styles.used]}
        onPress={onHint}
        disabled={hintLevel >= 2}
      >
        <Ionicons name={hintIcon} size={18} color={hintLevel >= 2 ? C.textMuted : C.warning} />
        <AppText
          style={[styles.label, { color: C.textLight }, hintLevel >= 2 && { color: C.textMuted }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {hintLabel}
        </AppText>
        {coins < hintCost && hintLevel === 1 && (
          <Ionicons name="lock-closed" size={11} color={C.danger} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.lifeline, { backgroundColor: `${C.card}E0`, borderColor: `${C.mana}35` }, usedFifty && styles.used]}
        onPress={onFiftyFifty}
        disabled={usedFifty}
      >
        <Ionicons name="cut-outline" size={18} color={usedFifty ? C.textMuted : C.mana} />
        <AppText
          style={[styles.label, { color: C.textLight }, usedFifty && { color: C.textMuted }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          50/50{fiftyCost > 0 ? ` (${fiftyCost})` : ''}
        </AppText>
        {coins < fiftyCost && !usedFifty && (
          <Ionicons name="lock-closed" size={11} color={C.danger} />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.lifeline, { backgroundColor: `${C.card}E0`, borderColor: `${C.secondary}35` }, usedCall && styles.used]}
        onPress={onCallFriend}
        disabled={usedCall}
      >
        <Ionicons name="people-outline" size={18} color={usedCall ? C.textMuted : C.secondary} />
        <AppText
          style={[styles.label, { color: C.textLight }, usedCall && { color: C.textMuted }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          Friend{callCost > 0 ? ` (${callCost})` : ''}
        </AppText>
        {coins < callCost && !usedCall && (
          <Ionicons name="lock-closed" size={11} color={C.danger} />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  lifeline: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  used: {
    opacity: 0.4,
  },
  label: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default memo(Lifelines);
