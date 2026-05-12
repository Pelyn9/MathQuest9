import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  StatusBar,
  Platform,
} from 'react-native';
import { soundManager } from '../utils/SoundManager';

const heroImage = require('../image/hero.png');

export default function SplashScreen() {
  const barAnim = useRef(new Animated.Value(0)).current;
  const loadingTextAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    soundManager.playMusic('menu');

    // Loading bar animation
    Animated.timing(barAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    // Loading text pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(loadingTextAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(loadingTextAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
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
        style={styles.hero}
      />

      {/* Light overlay */}
      <View style={styles.scrim} />

      {/* Loading Text */}
      <Animated.Text
        style={[
          styles.loadingText,
          { opacity: loadingTextAnim },
        ]}
      >
        Loading Game...
      </Animated.Text>

      {/* Loading Bar */}
      <View style={styles.loadingLineWrap}>
        <View style={styles.loadingLineTrack}>
          <Animated.View
            style={[
              styles.loadingLineFill,
              { width: loadPct },
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
    backgroundColor: '#020817',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },

  hero: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,8,23,0.08)',
  },

  // Loading text uses a fixed position so it stays clear of the artwork.
  loadingText: {
    position: 'absolute',
    bottom: 60,
    fontSize: 14,
    letterSpacing: 1,
    color: '#ffffff',
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },

  loadingLineWrap: {
    width: '78%',
    maxWidth: 420,
    marginBottom: 40,
  },

  loadingLineTrack: {
    width: '100%',
    height: 7,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.28)',
  },

  loadingLineFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#ffd45a',
  },
});
