import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getScreenBackground, getLevelBackground } from '../utils/backgrounds';
import { useTheme } from '../theme/ThemeContext';

const heroImage = require('../image/hero.png');
const presetBackdropImages = {
  home: require('../image/homepage.png'),
  difficulty: require('../image/selectdifficulty.png'),
  map: require('../image/castle.png'),
  profile: require('../image/profile.png'),
  shop: require('../image/heroshop.png'),
};

const presetBackdropOverlays = {
  home: ['rgba(2,7,17,0.48)', 'rgba(2,7,17,0.64)', 'rgba(2,7,17,0.9)'],
  difficulty: ['rgba(2,7,17,0.46)', 'rgba(2,7,17,0.62)', 'rgba(2,7,17,0.9)'],
  map: ['rgba(2,7,17,0.44)', 'rgba(2,7,17,0.6)', 'rgba(2,7,17,0.86)'],
  profile: ['rgba(2,7,17,0.42)', 'rgba(2,7,17,0.58)', 'rgba(2,7,17,0.86)'],
  shop: ['rgba(2,7,17,0.44)', 'rgba(2,7,17,0.6)', 'rgba(2,7,17,0.88)'],
};

const GLYPHS = [
  { value: '1', top: '21%', left: '9%' },
  { value: '2', top: '28%', left: '73%' },
  { value: '4', top: '42%', left: '84%' },
  { value: '8', top: '53%', left: '12%' },
  { value: '0', top: '17%', left: '58%' },
];

const SPARKS = [
  { top: '12%', left: '82%', size: 3 },
  { top: '24%', left: '17%', size: 2 },
  { top: '36%', left: '91%', size: 2 },
  { top: '58%', left: '7%', size: 3 },
  { top: '70%', left: '78%', size: 2 },
  { top: '82%', left: '18%', size: 2 },
];

export default function ScreenBackground({ preset, moduleId, levelId }) {
  const { theme } = useTheme();
  let config = null;

  if (moduleId) {
    if (levelId) {
      config = getLevelBackground(moduleId, levelId, theme);
    } else {
      config = getLevelBackground(moduleId, 1, theme);
    }
  }

  if (!config && preset) {
    config = getScreenBackground(preset, theme);
  }

  if (!config) {
    config = { colors: ['#020817', '#082A58', '#07101E'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
  }

  const presetBackdropImage = !moduleId && preset ? presetBackdropImages[preset] : null;

  if (presetBackdropImage) {
    return (
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.photoBackdropBase]}>
        <Image
          source={presetBackdropImage}
          resizeMode="cover"
          style={styles.photoBackdrop}
        />
        <LinearGradient
          colors={presetBackdropOverlays[preset]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>
    );
  }

  const imageOpacity = preset === 'home' ? 0.18 : preset === 'difficulty' ? 0.16 : 0.1;

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Image
        source={heroImage}
        resizeMode="cover"
        style={[
          styles.heroImage,
          { opacity: imageOpacity },
          moduleId && styles.heroImageLevel,
        ]}
      />
      <LinearGradient
        colors={config.colors}
        start={config.start}
        end={config.end}
        style={[StyleSheet.absoluteFill, styles.baseGradient]}
      />
      <LinearGradient
        colors={['rgba(2,7,17,0.28)', 'rgba(2,7,17,0.58)', 'rgba(2,7,17,0.92)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.skyGlow} />
      <View style={[styles.runeRing, styles.runeRingLarge]} />
      <View style={[styles.runeRing, styles.runeRingSmall]} />
      <View style={styles.leftTower} />
      <View style={styles.rightTower} />
      {GLYPHS.map((glyph) => (
        <Text key={`${glyph.value}-${glyph.top}`} style={[styles.glyph, { top: glyph.top, left: glyph.left }]}>
          {glyph.value}
        </Text>
      ))}
      {SPARKS.map((spark, index) => (
        <View
          key={index}
          style={[
            styles.spark,
            {
              top: spark.top,
              left: spark.left,
              width: spark.size,
              height: spark.size,
              borderRadius: spark.size / 2,
            },
          ]}
        />
      ))}
      <View style={styles.bottomStone} />
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    transform: [{ scale: 1.05 }],
  },
  heroImageLevel: {
    transform: [{ scale: 1.15 }],
  },
  photoBackdropBase: {
    backgroundColor: '#020711',
  },
  photoBackdrop: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.42,
    transform: [{ scale: 1.04 }],
  },
  baseGradient: {
    opacity: 0.83,
  },
  skyGlow: {
    position: 'absolute',
    top: '20%',
    alignSelf: 'center',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(66,217,255,0.14)',
    shadowColor: '#42D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
  },
  runeRing: {
    position: 'absolute',
    borderWidth: 1,
    borderColor: 'rgba(66,217,255,0.22)',
    shadowColor: '#42D9FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
  },
  runeRingLarge: {
    top: '20%',
    left: '-22%',
    width: '118%',
    height: 260,
    borderRadius: 180,
    transform: [{ rotate: '-14deg' }],
  },
  runeRingSmall: {
    top: '30%',
    right: '-16%',
    width: '74%',
    height: 160,
    borderRadius: 120,
    transform: [{ rotate: '18deg' }],
  },
  glyph: {
    position: 'absolute',
    color: 'rgba(87,229,255,0.42)',
    fontSize: 22,
    fontFamily: 'Times New Roman',
    fontWeight: '700',
    textShadowColor: 'rgba(66,217,255,0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  spark: {
    position: 'absolute',
    backgroundColor: '#F4C56A',
    shadowColor: '#F4C56A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  leftTower: {
    position: 'absolute',
    left: -28,
    top: 0,
    width: 58,
    height: '42%',
    borderBottomRightRadius: 18,
    backgroundColor: 'rgba(2,7,17,0.32)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(244,197,106,0.16)',
  },
  rightTower: {
    position: 'absolute',
    right: -32,
    top: '12%',
    width: 54,
    height: '34%',
    borderBottomLeftRadius: 18,
    backgroundColor: 'rgba(2,7,17,0.28)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(244,197,106,0.14)',
  },
  bottomStone: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: 'rgba(2,7,17,0.36)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(244,197,106,0.12)',
  },
});
