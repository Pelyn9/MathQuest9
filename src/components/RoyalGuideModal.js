import React from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function RoyalGuideModal({
  visible,
  onClose,
  lesson,
  mission,
  question,
  showCorrect,
}) {
  const { colors: C } = useTheme();
  const { height } = useWindowDimensions();

  if (!question) return null;

  const path = lesson?.path || {
    color: C.gold,
    characterName: 'Royal Guide',
    characterRole: 'Math Guide',
    characterIcon: 'book',
  };
  const accent = path.color || C.gold;
  const guideText = lesson?.dialog || lesson?.guide || mission?.objective || 'The Royal Guide is ready to help you read this challenge carefully.';
  const ruleText = lesson?.rule || mission?.objective || 'Look for the important numbers and decide which operation the problem needs.';
  const hintText = question.hint || lesson?.activity || 'Read the clue slowly, label the given values, then compare your work with the choices.';
  const noteText = showCorrect && question.explanation
    ? question.explanation
    : 'Use these clues to narrow the choices. The guide gives direction, not the answer.';
  const modalMaxHeight = Math.min(height - 44, 600);
  const scrollMaxHeight = Math.max(260, modalMaxHeight - 70);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={[styles.card, { maxHeight: modalMaxHeight, backgroundColor: `${C.card}F5`, borderColor: `${accent}70` }]}>
          <View style={[styles.accentBar, { backgroundColor: accent }]} />

          <View style={styles.header}>
            <View style={[styles.avatar, { backgroundColor: `${accent}20`, borderColor: `${accent}45` }]}>
              <Ionicons name={path.characterIcon || 'book'} size={22} color={accent} />
            </View>
            <View style={styles.headerText}>
              <AppText style={[styles.title, { color: accent }]}>Royal Guide</AppText>
              <AppText style={[styles.subtitle, { color: C.textMuted }]} numberOfLines={1}>
                {path.characterName} - {path.characterRole}
              </AppText>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={20} color={C.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={[styles.scrollArea, { maxHeight: scrollMaxHeight }]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
          >
            <View style={[styles.sectionCard, { backgroundColor: `${C.backgroundLight}D4`, borderColor: `${C.gold}25` }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="compass-outline" size={15} color={accent} />
                <AppText style={[styles.sectionLabel, { color: accent }]}>Guide</AppText>
              </View>
              <AppText style={[styles.bodyText, styles.justifyText, { color: C.textLight }]}>{guideText}</AppText>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: `${C.backgroundLight}D4`, borderColor: `${accent}30` }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="school-outline" size={15} color={accent} />
                <AppText style={[styles.sectionLabel, { color: accent }]}>Key Rule</AppText>
              </View>
              <AppText style={[styles.bodyText, { color: C.textLight }]}>{ruleText}</AppText>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: `${C.backgroundLight}D4`, borderColor: `${C.gold}25` }]}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bulb-outline" size={15} color={accent} />
                <AppText style={[styles.sectionLabel, { color: accent }]}>Hint</AppText>
              </View>
              <AppText style={[styles.bodyText, { color: C.textLight }]}>{hintText}</AppText>
            </View>

            <View style={[styles.noteBox, { backgroundColor: `${accent}14`, borderColor: `${accent}35` }]}>
              <Ionicons name={showCorrect ? 'reader-outline' : 'sparkles-outline'} size={15} color={accent} />
              <View style={styles.noteTextWrap}>
                <AppText style={[styles.noteTitle, { color: accent }]}>
                  {showCorrect ? 'After Check' : 'Royal Guide Note'}
                </AppText>
                <AppText style={[styles.bodyText, { color: C.textLight }]}>{noteText}</AppText>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  card: {
    width: '100%',
    maxWidth: 394,
    borderRadius: 16,
    borderWidth: 1.5,
    overflow: 'hidden',
  },
  accentBar: {
    height: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  headerText: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 17,
    fontWeight: '900',
  },
  subtitle: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 1,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollArea: {
    flexShrink: 1,
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    gap: 10,
  },
  sectionCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 7,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  bodyText: {
    fontSize: 12,
    lineHeight: 18,
  },
  justifyText: {
    textAlign: 'justify',
  },
  questionText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: '700',
  },
  answerRow: {
    minHeight: 42,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    marginTop: 7,
  },
  answerLetter: {
    width: 27,
    height: 27,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerLetterText: {
    fontSize: 12,
    fontWeight: '900',
  },
  answerText: {
    flex: 1,
    minWidth: 0,
    fontSize: 12,
    lineHeight: 17,
  },
  noteBox: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  noteTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  noteTitle: {
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
});
