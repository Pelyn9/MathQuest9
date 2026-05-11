import React, { useRef, useEffect } from 'react';
import { View, Modal, TouchableOpacity, StyleSheet, Animated, Easing, Platform } from 'react-native';
import AppText from './AppText';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const FANTASY_FONT = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';

export default function StoryIntroModal({ visible, onContinue, mission, storyPath, missionStats }) {
  const { colors: C } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      fadeAnim.setValue(0);
      slideAnim.setValue(30);
      glowAnim.setValue(0);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]).start();
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(glowAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }
  }, [visible, fadeAnim, slideAnim, glowAnim]);

  if (!mission || !storyPath) return null;

  const accent = storyPath.color;
  const progressText = missionStats?.completed >= 100
    ? `${storyPath.progressLabel} Cleared`
    : `Mission ${mission.id}/100`;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.modal, { opacity: fadeAnim, transform: [{ translateY: slideAnim }], backgroundColor: C.card, borderColor: `${accent}66` }]}>
          {/* top decorative bar */}
          <View style={[styles.accentBar, { backgroundColor: accent }]} />

          {/* level and mission progress */}
          <View style={styles.topRow}>
            <View style={[styles.levelPill, { backgroundColor: `${accent}18` }]}>
              <MaterialCommunityIcons name="star-four-points" size={12} color={accent} />
              <AppText style={[styles.levelText, { color: accent }]}>Level 1</AppText>
            </View>
            <View style={[styles.missionPill, { backgroundColor: `${C.textMuted}15` }]}>
              <Ionicons name="flag" size={11} color={C.textMuted} />
              <AppText style={styles.missionText}>{progressText}</AppText>
            </View>
          </View>

          {/* decorative divider */}
          <View style={styles.dividerLine}>
            <View style={[styles.dividerOrnament, { backgroundColor: `${accent}30` }]} />
            <MaterialCommunityIcons name="diamond" size={6} color={accent} />
            <View style={[styles.dividerOrnament, { backgroundColor: `${accent}30` }]} />
          </View>

          {/* title */}
          <AppText style={[styles.title, { fontFamily: FANTASY_FONT }]}>{mission.shortTitle}</AppText>

          {/* story */}
          <View style={[styles.storyBox, { backgroundColor: C.backgroundLight, borderColor: C.cardBorder }]}>
            <Ionicons name="book" size={14} color={accent} style={{ marginBottom: 6 }} />
            <AppText style={styles.storyText}>{mission.story}</AppText>
          </View>

          {/* continue button with glow */}
          <Animated.View style={{ opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }}>
            <TouchableOpacity style={[styles.continueBtn, { backgroundColor: accent }]} onPress={onContinue} activeOpacity={0.8}>
              <AppText style={styles.continueText}>Continue</AppText>
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 22,
  },
  modal: {
    width: '100%', maxWidth: 420,
    borderRadius: 24, borderWidth: 1.5,
    overflow: 'hidden', paddingBottom: 22,
  },
  accentBar: { height: 6 },
  topRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 10,
    paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4,
  },
  levelPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10,
  },
  levelText: { fontSize: 11, fontWeight: '900' },
  missionPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 10,
  },
  missionText: { fontSize: 11, fontWeight: '700', color: '#A0A4A8' },
  dividerLine: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 40, marginTop: 8, marginBottom: 10,
  },
  dividerOrnament: { flex: 1, height: 1, borderRadius: 1 },
  title: {
    fontSize: 24, fontWeight: '900', color: '#F0E6D3',
    textAlign: 'center', marginBottom: 12, letterSpacing: -0.3,
  },
  storyBox: {
    marginHorizontal: 18, borderRadius: 14, borderWidth: 1,
    padding: 14, marginBottom: 18,
  },
  storyText: {
    fontSize: 13, lineHeight: 20, color: '#D0C8B0',
  },
  continueBtn: {
    marginHorizontal: 18, minHeight: 50, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});