import React from 'react';
import { View, Modal, ScrollView, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import AppText from './AppText';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

const FANTASY_FONT = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';

export default function MissionGuideModal({ visible, onClose, onContinue, lesson }) {
  const { colors: C } = useTheme();
  const { height } = useWindowDimensions();

  if (!lesson) return null;

  const {
    path,
    title,
    guide,
    rule,
    activityText,
    dialog,
    progressLabel,
    rewardText,
  } = lesson;
  const modalMaxHeight = Math.min(height - 48, 560);
  const scrollMaxHeight = Math.max(210, modalMaxHeight - 82);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modal,
            {
              maxHeight: modalMaxHeight,
              backgroundColor: `${C.card}F2`,
              borderColor: `${path.color}66`,
            },
          ]}
        >
          {/* header with close */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={20} color={C.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={[styles.scrollArea, { maxHeight: scrollMaxHeight }]}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
          >
            {/* character portrait */}
            <View style={styles.characterRow}>
              <View style={[styles.characterAvatar, { backgroundColor: `${path.color}20` }]}>
                <Ionicons name={path.characterIcon} size={28} color={path.color} />
              </View>
              <View style={styles.characterInfo}>
                <AppText style={[styles.characterName, { color: path.color }]} numberOfLines={1}>{path.characterName}</AppText>
                <AppText style={[styles.characterRole, { color: C.textMuted }]} numberOfLines={1}>{path.characterRole}</AppText>
              </View>
            </View>

            {/* lesson title */}
            <View style={[styles.titleBadge, { backgroundColor: `${path.color}12`, borderColor: `${path.color}30` }]}>
              <MaterialCommunityIcons name="scroll" size={14} color={path.color} />
              <AppText style={[styles.titleText, { color: path.color }]} numberOfLines={2}>{title}</AppText>
            </View>

            {/* guide */}
            <AppText style={[styles.sectionLabel, { color: C.textMuted }]}>Guide</AppText>
            <AppText style={[styles.paragraph, { color: C.textLight }]}>{guide}</AppText>

            {/* rule */}
            <AppText style={[styles.sectionLabel, { color: C.textMuted }]}>Rule</AppText>
            <View style={[styles.ruleBox, { backgroundColor: `${C.backgroundLight}D0`, borderColor: `${C.gold}25` }]}>
              <Ionicons name="bulb-outline" size={15} color={C.warning} style={{ marginRight: 6 }} />
              <AppText style={[styles.ruleText, { color: C.textLight }]}>{rule}</AppText>
            </View>

            {/* activity */}
            <AppText style={[styles.sectionLabel, { color: C.textMuted }]}>Activity</AppText>
            <AppText style={[styles.paragraph, { color: C.textLight }]}>{activityText}</AppText>

            {/* dialog quote */}
            <View style={[styles.quoteBox, { borderLeftColor: path.color }]}>
              <AppText style={[styles.quoteText, { color: C.textMuted }]}>{path.characterName}</AppText>
              <AppText style={[styles.quoteBody, { color: C.textLight }]}>{dialog}</AppText>
            </View>

            {/* bottom info */}
            <View style={styles.footerInfo}>
              <View style={[styles.footerPill, { backgroundColor: `${path.color}14` }]}>
                <Ionicons name="flag" size={12} color={path.color} />
                <AppText style={[styles.footerPillText, { color: path.color }]}>{progressLabel}</AppText>
              </View>
              <View style={[styles.footerPill, { backgroundColor: `${C.gold}14` }]}>
                <Ionicons name="star" size={12} color={C.gold} />
                <AppText style={[styles.footerPillText, { color: C.gold }]}>{rewardText}</AppText>
              </View>
            </View>
          </ScrollView>

          {/* continue / start button */}
          <TouchableOpacity
            style={[styles.continueBtn, { backgroundColor: path.color }]}
            onPress={onContinue}
            activeOpacity={0.8}
          >
            <Ionicons name="play" size={18} color="#FFF" />
            <AppText style={styles.continueText}>Continue</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.6)',
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
    paddingTop: 8, paddingHorizontal: 14, paddingBottom: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row', justifyContent: 'flex-end',
    marginBottom: 4,
  },
  closeBtn: {
    width: 32, height: 32, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  scrollArea: {
    flexShrink: 1,
    flexGrow: 0,
  },
  scrollContent: { paddingBottom: 8 },
  characterRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginBottom: 16,
  },
  characterAvatar: {
    width: 48, height: 48, borderRadius: 24,
    justifyContent: 'center', alignItems: 'center',
  },
  characterInfo: { flex: 1, minWidth: 0 },
  characterName: { fontSize: 17, fontWeight: '800', fontFamily: FANTASY_FONT },
  characterRole: { fontSize: 12, fontWeight: '600', marginTop: 1 },
  titleBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10,
    borderWidth: 1, marginBottom: 16,
  },
  titleText: { fontSize: 13, lineHeight: 17, fontWeight: '800', flex: 1, minWidth: 0 },
  sectionLabel: {
    fontSize: 10, fontWeight: '800', textTransform: 'uppercase',
    letterSpacing: 0.8, marginBottom: 4, marginTop: 10,
  },
  paragraph: {
    fontSize: 13, lineHeight: 19,
    marginBottom: 4,
    flexShrink: 1,
  },
  ruleBox: {
    flexDirection: 'row', alignItems: 'flex-start',
    padding: 12, borderRadius: 10, borderWidth: 1,
    minWidth: 0,
  },
  ruleText: { fontSize: 12, lineHeight: 17, flex: 1, minWidth: 0 },
  quoteBox: {
    borderLeftWidth: 3, paddingLeft: 12, marginTop: 14,
    paddingVertical: 4,
  },
  quoteText: { fontSize: 12, fontWeight: '800', marginBottom: 3 },
  quoteBody: { fontSize: 13, lineHeight: 18, fontStyle: 'italic' },
  footerInfo: {
    flexDirection: 'row', gap: 8, marginTop: 16,
    flexWrap: 'wrap',
  },
  footerPill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingVertical: 5, paddingHorizontal: 10, borderRadius: 8,
    maxWidth: '100%',
  },
  footerPillText: { fontSize: 10, fontWeight: '800', flexShrink: 1 },
  continueBtn: {
    marginTop: 16, minHeight: 46, borderRadius: 10,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  continueText: { color: '#FFF', fontSize: 15, fontWeight: '900' },
});
