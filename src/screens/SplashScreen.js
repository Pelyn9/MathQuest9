import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  StatusBar,
  Text,
  Platform,
} from 'react-native';

const heroImage = require('../image/hero.png');

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export default function SplashScreen() {
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
    backgroundColor: '#000',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  hero: {
    position: 'absolute',
    width: SCREEN_W,
    height: SCREEN_H,
  },

  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)', // very light overlay
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