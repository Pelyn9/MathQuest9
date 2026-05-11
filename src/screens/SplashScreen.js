import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  View,
  StatusBar,
  Platform,
  useWindowDimensions,
} from 'react-native';

const heroImage = require('../image/hero.png');

export default function SplashScreen() {
  const { width, height } = useWindowDimensions();
  const barAnim = useRef(new Animated.Value(0)).current;
  const loadingTextAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
  const posterRatio = 942 / 1536;
  const frameRatio = width / height;
  const posterStyle = frameRatio > posterRatio
    ? { height: '100%', width: height * posterRatio }
    : { width: '100%', height: width / posterRatio };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* Background Image */}
      <Animated.Image
        source={heroImage}
        resizeMode="contain"
        style={[styles.hero, posterStyle]}
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
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
  },

  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(2,8,23,0.08)',
  },

  // 🎮 Loading text (fixed position + Times New Roman)
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
