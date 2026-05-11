import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Platform,
  StatusBar,
} from 'react-native';

const heroImage = require('../image/hero.png');

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const barAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(barAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();
  }, []);

  const loadPct = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Background Image */}
      <Animated.Image
        source={heroImage}
        resizeMode="cover"
        style={[
          styles.hero,
          {
            opacity: fadeAnim,
          },
        ]}
      />

      {/* Dark overlay */}
      <View style={styles.scrim} />

      {/* Bottom fade */}
      <View style={styles.bottomFade} />

      {/* Loading bar */}
      <View style={styles.loadingLineWrap}>
        <View style={styles.loadingLineTrack}>
          <Animated.View
            style={[
              styles.loadingLineFill,
              {
                width: loadPct,
              },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050814',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },

  // ✅ FIXED IMAGE SIZE (no overflow, no zoom issue)
  hero: {
    position: 'absolute',
    width: SCREEN_W,
    height: SCREEN_H,
  },

  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4, 8, 20, 0.15)',
  },

  bottomFade: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: SCREEN_H * 0.25,
    backgroundColor: 'rgba(5, 8, 20, 0.45)',
  },

  loadingLineWrap: {
    width: '78%',
    maxWidth: 420,
    marginBottom: Platform.OS === 'ios'
      ? SCREEN_H * 0.07
      : SCREEN_H * 0.05,
  },

  loadingLineTrack: {
    width: '100%',
    height: 7,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.38)',
  },

  loadingLineFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#ffd45a',
  },
});