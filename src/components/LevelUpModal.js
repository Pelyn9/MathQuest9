import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useMemo } from 'react';
import { Animated } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { getPlayerTitle } from '../utils/gameLogic';

export default function LevelUpModal({ visible, level, xp, onClose }) {
  const { colors: C } = useTheme();
  const styles = useMemo(() => createStyles(C), [C]);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 3, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ]).start();
    }
  }, [visible]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const title = getPlayerTitle(level);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { transform: [{ scale: scaleAnim }] }]}>
          <Animated.View style={{ transform: [{ rotate: spin }] }}>
            <Ionicons name="trophy" size={64} color={C.gold} />
          </Animated.View>

          <AppText style={styles.levelUp} decorative>LEVEL UP!</AppText>
          <AppText style={styles.level} decorative>Level {level}</AppText>
          <AppText style={styles.title}>{title}</AppText>

          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Ionicons name="flash" size={18} color={C.xp} />
              <AppText style={styles.statText}>{xp} XP</AppText>
            </View>
            <View style={styles.stat}>
              <Ionicons name="diamond" size={18} color={C.gold} />
              <AppText style={styles.statText}>+50 Coins</AppText>
            </View>
          </View>

          <View style={styles.unlockRow}>
            <Ionicons name="lock-open" size={16} color={C.success} />
            <AppText style={styles.unlockText}>New title unlocked: {title}</AppText>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose}>
            <AppText style={styles.buttonText}>Continue</AppText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (C) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: C.card,
    borderRadius: 24,
    padding: 32,
    marginHorizontal: 30,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.gold,
    width: '80%',
  },
  levelUp: {
    fontSize: 14,
    color: C.gold,
    fontWeight: 'bold',
    letterSpacing: 4,
    marginTop: 12,
  },
  level: {
    fontSize: 42,
    fontWeight: 'bold',
    color: C.text,
    marginTop: 4,
  },
  title: {
    fontSize: 18,
    color: C.textLight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 24,
    marginTop: 20,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 15,
    color: C.text,
    fontWeight: '600',
  },
  unlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 16,
    backgroundColor: C.successLight,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 10,
  },
  unlockText: {
    fontSize: 13,
    color: C.success,
    fontWeight: '500',
  },
  button: {
    backgroundColor: C.gold,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 24,
  },
  buttonText: {
    color: C.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
