import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../theme/ThemeContext';

export default function Timer({ seconds, onExpire, running, resetKey }) {
  const { colors: C } = useTheme();
  const [remaining, setRemaining] = useState(seconds);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);
  const runningRef = useRef(running);
  const destroyedRef = useRef(false);

  onExpireRef.current = onExpire;
  runningRef.current = running;

  useEffect(() => {
    setRemaining(seconds);
  }, [resetKey, seconds]);

  useEffect(() => {
    return () => { destroyedRef.current = true; };
  }, []);

  useEffect(() => {
    if (!running) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (destroyedRef.current) return prev;
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (!destroyedRef.current && runningRef.current) {
            onExpireRef.current?.();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running, resetKey]);

  const pct = remaining / seconds;
  const isLow = remaining <= 10;
  const color = isLow ? C.danger : remaining <= 20 ? C.warning : C.primary;

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: C.backgroundLight }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
      <Ionicons name="time-outline" size={14} color={color} />
      <AppText style={[styles.text, { color }]}>{remaining}s</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1, marginRight: 8,
  },
  track: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3 },
  text: { fontSize: 12, fontWeight: 'bold', minWidth: 26 },
});
