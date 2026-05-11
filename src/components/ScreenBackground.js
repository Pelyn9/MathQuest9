import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getScreenBackground, getLevelBackground } from '../utils/backgrounds';
import { useTheme } from '../theme/ThemeContext';

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
    config = { colors: ['#F5EDE0', '#FFF8EF'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };
  }

  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      <LinearGradient
        colors={config.colors}
        start={config.start}
        end={config.end}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
