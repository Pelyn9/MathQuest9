import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const RpgTransitionContext = createContext(() => {});

export function RpgTransitionProvider({ children }) {
  const [triggerKey, setTriggerKey] = useState(0);
  const playRpgTransition = useCallback(() => {
    setTriggerKey(key => key + 1);
  }, []);

  return (
    <RpgTransitionContext.Provider value={playRpgTransition}>
      {children}
      <RpgRouteTransition triggerKey={triggerKey} />
    </RpgTransitionContext.Provider>
  );
}

export function useRpgTransition() {
  return useContext(RpgTransitionContext);
}

function RpgRouteTransition({ triggerKey }) {
  const { colors: C } = useTheme();
  const { width } = useWindowDimensions();
  const styles = useMemo(() => createStyles(C), [C]);
  const [visible, setVisible] = useState(false);
  const progress = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!triggerKey) return undefined;

    progress.stopAnimation();
    progress.setValue(0);
    setVisible(true);

    const animation = Animated.sequence([
      Animated.timing(progress, {
        toValue: 0.48,
        duration: 210,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 440,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) setVisible(false);
    });

    return () => animation.stop();
  }, [progress, triggerKey]);

  if (!visible) return null;

  const gateOffset = Math.max(width, 430) * 0.62;
  const overlayOpacity = progress.interpolate({
    inputRange: [0, 0.08, 0.72, 1],
    outputRange: [0, 1, 0.92, 0],
  });
  const leftGateX = progress.interpolate({
    inputRange: [0, 0.34, 0.58, 1],
    outputRange: [-gateOffset, 0, 0, -gateOffset],
  });
  const rightGateX = progress.interpolate({
    inputRange: [0, 0.34, 0.58, 1],
    outputRange: [gateOffset, 0, 0, gateOffset],
  });
  const runeOpacity = progress.interpolate({
    inputRange: [0, 0.18, 0.64, 1],
    outputRange: [0, 1, 0.9, 0],
  });
  const runeScale = progress.interpolate({
    inputRange: [0, 0.42, 1],
    outputRange: [0.55, 1.08, 1.45],
  });
  const slashX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.7, width * 0.7],
  });

  return (
    <Animated.View pointerEvents="none" style={[styles.overlay, { opacity: overlayOpacity }]}>
      <Animated.View style={[styles.leftGate, { transform: [{ translateX: leftGateX }] }]}>
        <View style={styles.gateGlow} />
        <View style={[styles.gateLine, styles.gateLineTop]} />
        <View style={[styles.gateLine, styles.gateLineMid]} />
        <View style={[styles.gateLine, styles.gateLineBottom]} />
      </Animated.View>

      <Animated.View style={[styles.rightGate, { transform: [{ translateX: rightGateX }] }]}>
        <View style={styles.gateGlow} />
        <View style={[styles.gateLine, styles.gateLineTop]} />
        <View style={[styles.gateLine, styles.gateLineMid]} />
        <View style={[styles.gateLine, styles.gateLineBottom]} />
      </Animated.View>

      <Animated.View style={[styles.slash, { transform: [{ translateX: slashX }, { rotate: '-22deg' }] }]} />
      <Animated.View style={[styles.slash, styles.slashAlt, { transform: [{ translateX: slashX }, { rotate: '22deg' }] }]} />

      <Animated.View style={[styles.runeCircle, { opacity: runeOpacity, transform: [{ scale: runeScale }] }]}>
        <View style={styles.runeRing} />
        <Ionicons name="shield-outline" size={36} color={C.gold} />
        <Ionicons name="sparkles" size={15} color={C.primary} style={styles.runeTop} />
        <Ionicons name="diamond" size={12} color={C.primary} style={styles.runeBottom} />
      </Animated.View>
    </Animated.View>
  );
}

export default RpgRouteTransition;

const createStyles = (C) => StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(2, 7, 17, 0.22)',
  },
  leftGate: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: '56%',
    backgroundColor: `${C.black}F5`,
    borderRightWidth: 1,
    borderRightColor: `${C.gold}80`,
    overflow: 'hidden',
  },
  rightGate: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '56%',
    backgroundColor: `${C.black}F5`,
    borderLeftWidth: 1,
    borderLeftColor: `${C.gold}80`,
    overflow: 'hidden',
  },
  gateGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${C.primary}20`,
  },
  gateLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: `${C.gold}42`,
  },
  gateLineTop: {
    top: '24%',
  },
  gateLineMid: {
    top: '50%',
    backgroundColor: `${C.primary}45`,
  },
  gateLineBottom: {
    bottom: '24%',
  },
  slash: {
    position: 'absolute',
    width: '145%',
    height: 3,
    borderRadius: 3,
    backgroundColor: `${C.primary}A8`,
    shadowColor: C.primary,
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  slashAlt: {
    height: 2,
    backgroundColor: `${C.gold}A8`,
  },
  runeCircle: {
    width: 124,
    height: 124,
    borderRadius: 62,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${C.card}DD`,
    borderWidth: 1,
    borderColor: `${C.gold}80`,
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
  },
  runeRing: {
    position: 'absolute',
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 1,
    borderColor: `${C.primary}80`,
  },
  runeTop: {
    position: 'absolute',
    top: 18,
  },
  runeBottom: {
    position: 'absolute',
    bottom: 20,
  },
});
