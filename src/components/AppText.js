import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function AppText({ style, decorative, ...props }) {
  return <Text {...props} style={[decorative ? styles.decorativeFont : styles.defaultFont, style]} />;
}

const styles = StyleSheet.create({
  defaultFont: {
    fontFamily: 'Times New Roman',
  },
  decorativeFont: {
    fontFamily: 'Times New Roman',
  },
});