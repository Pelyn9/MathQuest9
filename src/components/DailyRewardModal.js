import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const STREAK_REWARDS = [
  { day: 1, coins: 50, xp: 20 },
  { day: 2, coins: 75, xp: 30 },
  { day: 3, coins: 100, xp: 40 },
  { day: 4, coins: 125, xp: 50 },
  { day: 5, coins: 150, xp: 60 },
  { day: 6, coins: 175, xp: 70 },
  { day: 7, coins: 300, xp: 150 },
];

export default function DailyRewardModal({ visible, streak, onClaim, onClose }) {
  const { colors: C } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }).start();
    }
  }, [visible]);

  const reward = STREAK_REWARDS[Math.min(streak, STREAK_REWARDS.length - 1)];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { backgroundColor: C.card, borderColor: C.gold, transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.starsRow}>
            <Ionicons name="star" size={24} color={C.gold} />
            <Ionicons name="gift" size={40} color={C.gold} />
            <Ionicons name="star" size={24} color={C.gold} />
          </View>

          <AppText style={[styles.title, { color: C.text }]}>Daily Reward!</AppText>
          <AppText style={[styles.subtitle, { color: C.textMuted }]}>Day {streak + 1} streak</AppText>

          <View style={styles.rewardsRow}>
            <View style={styles.rewardItem}>
              <Ionicons name="cash-outline" size={28} color={C.gold} />
              <AppText style={[styles.rewardValue, { color: C.gold }]}>+{reward.coins}</AppText>
              <AppText style={[styles.rewardLabel, { color: C.textMuted }]}>Coins</AppText>
            </View>
            <View style={styles.rewardItem}>
              <Ionicons name="flash" size={28} color={C.xp} />
              <AppText style={[styles.rewardValue, { color: C.xp }]}>+{reward.xp}</AppText>
              <AppText style={[styles.rewardLabel, { color: C.textMuted }]}>XP</AppText>
            </View>
          </View>

          <View style={[styles.streakBar, { backgroundColor: C.backgroundLight }]}>
            {STREAK_REWARDS.map((r, i) => (
              <View key={i} style={[styles.streakDot, {
                backgroundColor: i <= streak ? C.gold : C.textMuted,
                opacity: i <= streak ? 1 : 0.3,
              }]}>
                <AppText style={[styles.streakDotText, { color: i <= streak ? C.black : C.white }]}>{i + 1}</AppText>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={[styles.claimBtn, { backgroundColor: C.gold }]}
            onPress={() => {
              onClaim(reward.coins, reward.xp);
              onClose();
            }}
          >
            <AppText style={[styles.claimBtnText, { color: C.black }]}>Claim Reward</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipBtn} onPress={onClose}>
            <AppText style={[styles.skipText, { color: C.textMuted }]}>Maybe Later</AppText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center', alignItems: 'center',
  },
  modal: {
    borderRadius: 24, padding: 28, marginHorizontal: 30,
    alignItems: 'center', width: '85%', borderWidth: 2,
  },
  starsRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 24, fontWeight: 'bold', marginTop: 12 },
  subtitle: { fontSize: 14, marginTop: 4 },
  rewardsRow: { flexDirection: 'row', gap: 40, marginTop: 20 },
  rewardItem: { alignItems: 'center', gap: 4 },
  rewardValue: { fontSize: 22, fontWeight: 'bold' },
  rewardLabel: { fontSize: 12 },
  streakBar: {
    flexDirection: 'row', gap: 8, marginTop: 20,
    padding: 12, borderRadius: 14,
  },
  streakDot: {
    width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  streakDotText: { fontSize: 11, fontWeight: 'bold' },
  claimBtn: {
    paddingVertical: 14, paddingHorizontal: 50,
    borderRadius: 25, marginTop: 20,
  },
  claimBtnText: { fontSize: 16, fontWeight: 'bold' },
  skipBtn: { marginTop: 12, paddingVertical: 6 },
  skipText: { fontSize: 13 },
});
