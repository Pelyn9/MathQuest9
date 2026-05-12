import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

const bossImage = require('../image/boss.png');

export default function BossLoadingScreen({
  title = 'Boss Battle',
  finalBoss = false,
  onFinish,
  backgroundSource = bossImage,
  loadingText,
  accentColor = '#FFD45A',
  titleShadowColor = 'rgba(255, 64, 96, 0.65)',
  copyBlockStyle,
}) {
  const barAnim = useRef(new Animated.Value(0)).current;
  const loadingTextAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    barAnim.setValue(0);
    loadingTextAnim.setValue(0);

    Animated.timing(barAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: false,
    }).start();

    const textLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(loadingTextAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(loadingTextAnim, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );

    textLoop.start();
    const finishTimer = setTimeout(() => onFinish?.(), 3200);

    return () => {
      textLoop.stop();
      clearTimeout(finishTimer);
    };
  }, [barAnim, loadingTextAnim, onFinish]);

  const loadPct = barAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.Image
        source={backgroundSource}
        resizeMode="cover"
        style={styles.bossImage}
      />
      <View style={styles.scrim} />
      <View style={styles.vignetteTop} />
      <View style={styles.vignetteBottom} />

      <View style={[styles.copyBlock, copyBlockStyle]}>
        <Animated.Text style={[styles.loadingText, { opacity: loadingTextAnim }]}>
          {loadingText || (finalBoss ? 'Final Boss Loading...' : 'Boss Battle Loading...')}
        </Animated.Text>
        <Animated.Text style={[styles.titleText, { color: accentColor, textShadowColor: titleShadowColor, opacity: loadingTextAnim }]}>
          {title}
        </Animated.Text>
      </View>

      <View style={styles.loadingLineWrap}>
        <View style={styles.loadingLineTrack}>
          <Animated.View style={[styles.loadingLineFill, { width: loadPct, backgroundColor: accentColor }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#07030A',
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bossImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8,3,10,0.04)',
  },
  vignetteTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '36%',
    backgroundColor: 'rgba(7,3,10,0.12)',
  },
  vignetteBottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '28%',
    backgroundColor: 'rgba(7,3,10,0.1)',
  },
  copyBlock: {
    position: 'absolute',
    bottom: 72,
    alignItems: 'center',
    paddingHorizontal: 22,
  },
  loadingText: {
    fontSize: 14,
    letterSpacing: 1,
    color: '#FFFFFF',
    fontWeight: '400',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
  },
  titleText: {
    marginTop: 8,
    maxWidth: 340,
    textAlign: 'center',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Times New Roman' : 'serif',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
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
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  loadingLineFill: {
    height: '100%',
    borderRadius: 999,
  },
});
