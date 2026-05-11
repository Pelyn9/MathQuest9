import React, { useRef, useEffect } from 'react';
import { View, Modal, ScrollView, TouchableOpacity, StyleSheet, Animated, Easing, Platform, useWindowDimensions } from 'react-native';
import AppText from './AppText';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const FANTASY_FONT = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';

export default function StoryIntroModal({ visible, onContinue, mission, storyPath, missionStats }) {
  const { colors: C } = useTheme();
  const { height } = useWindowDimensions();
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
  const modalMaxHeight = Math.min(height - 48, 560);
  const scrollMaxHeight = Math.max(190, modalMaxHeight - 78);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => {}}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.modal,
            {
              maxHeight: modalMaxHeight,
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
              backgroundColor: `${C.card}F2`,
              borderColor: `${accent}66`,
            },
          ]}
        >
          {/* top decorative bar */}
          <View style={[styles.accentBar, { backgroundColor: accent }]} />

          <ScrollView
            style={[styles.contentScroll, { maxHeight: scrollMaxHeight }]}
            contentContainerStyle={styles.contentInner}
            showsVerticalScrollIndicator={false}
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
          >
            {/* level and mission progress */}
            <View style={styles.topRow}>
              <View style={[styles.levelPill, { backgroundColor: `${accent}18` }]}>
                <MaterialCommunityIcons name="star-four-points" size={12} color={accent} />
                <AppText style={[styles.levelText, { color: accent }]}>Level {mission.levelId || 1}</AppText>
              </View>
              <View style={[styles.missionPill, { backgroundColor: `${C.textMuted}15` }]}>
                <Ionicons name="flag" size={11} color={C.textMuted} />
                <AppText style={styles.missionText} numberOfLines={1}>{progressText}</AppText>
              </View>
            </View>

            {/* decorative divider */}
            <View style={styles.dividerLine}>
              <View style={[styles.dividerOrnament, { backgroundColor: `${accent}30` }]} />
              <MaterialCommunityIcons name="diamond" size={6} color={accent} />
              <View style={[styles.dividerOrnament, { backgroundColor: `${accent}30` }]} />
            </View>

            {/* title */}
            <AppText style={[styles.title, { fontFamily: FANTASY_FONT }]} numberOfLines={2}>
              {mission.shortTitle}
            </AppText>

            {/* story */}
            <View style={[styles.storyBox, { backgroundColor: `${C.backgroundLight}D0`, borderColor: `${C.gold}25` }]}>
              <Ionicons name="book" size={14} color={accent} style={styles.storyIcon} />
              <AppText style={styles.storyText}>{mission.story}</AppText>
            </View>
          </ScrollView>

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
    paddingHorizontal: 12,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  modal: {
    width: '100%',
    maxWidth: 390,
    borderRadius: 16, borderWidth: 1.5,
    overflow: 'hidden', paddingBottom: 22,
  },
  accentBar: { height: 6 },
  contentScroll: {
    flexShrink: 1,
    flexGrow: 0,
  },
  contentInner: {
    paddingBottom: 2,
  },
  topRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 8,
    paddingHorizontal: 14, paddingTop: 16, paddingBottom: 4,
    flexWrap: 'wrap',
  },
  levelPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8,
  },
  levelText: { fontSize: 11, fontWeight: '900' },
  missionPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8,
    maxWidth: '100%',
  },
  missionText: { fontSize: 11, fontWeight: '700', color: '#A0A4A8', flexShrink: 1 },
  dividerLine: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 30, marginTop: 8, marginBottom: 10,
  },
  dividerOrnament: { flex: 1, height: 1, borderRadius: 1 },
  title: {
    fontSize: 20, lineHeight: 26, fontWeight: '900', color: '#F0E6D3',
    textAlign: 'center', marginBottom: 12, paddingHorizontal: 16,
  },
  storyBox: {
    marginHorizontal: 14, borderRadius: 12, borderWidth: 1,
    padding: 12, marginBottom: 18,
    minWidth: 0,
  },
  storyIcon: {
    marginBottom: 6,
  },
  storyText: {
    width: '100%',
    minWidth: 0,
    flexShrink: 1,
    fontSize: 12, lineHeight: 19, color: '#D0C8B0',
  },
  continueBtn: {
    marginHorizontal: 14, minHeight: 48, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 6,
  },
  continueText: { color: '#FFF', fontSize: 16, fontWeight: '900' },
});
