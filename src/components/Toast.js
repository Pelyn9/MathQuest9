import { View, StyleSheet, Animated } from 'react-native';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';

const ICONS = {
  success: 'checkmark-circle',
  badge: 'medal',
  coin: 'cash',
  xp: 'flash',
  info: 'information-circle',
};

export default function Toast({ visible, message, type = 'success', icon, onHide }) {
  const { colors: C } = useTheme();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, friction: 6, useNativeDriver: true }).start();
      const timer = setTimeout(() => {
        Animated.timing(slideAnim, { toValue: -100, duration: 300, useNativeDriver: true }).start(() => onHide?.());
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const getColor = () => {
    switch (type) {
      case 'success': return C.success;
      case 'badge': return C.gold;
      case 'coin': return C.gold;
      case 'xp': return C.xp;
      case 'info': return C.info;
      default: return C.primary;
    }
  };

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { backgroundColor: C.card, borderColor: getColor(), transform: [{ translateY: slideAnim }] }]}>
      <Ionicons name={icon || ICONS[type] || 'checkmark-circle'} size={22} color={getColor()} />
      <AppText style={[styles.message, { color: C.text }]}>{message}</AppText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', top: 50, left: 20, right: 20,
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, borderRadius: 14, borderWidth: 1,
    zIndex: 9999, elevation: 10,
  },
  message: { fontSize: 14, fontWeight: '600', flex: 1 },
});
