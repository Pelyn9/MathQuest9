import React, { useMemo } from 'react';
import { Image, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { MODULES } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { STORY_MISSIONS, isMissionCompleted } from '../data/storyMissions';
import ScreenBackground from '../components/ScreenBackground';
import { useRpgTransition } from '../components/RpgRouteTransition';
import useScreenMusic from '../hooks/useScreenMusic';
import { soundManager } from '../utils/SoundManager';

const castleBackground = require('../image/castle.png');

const MODULE_DATA = {
  1: require('../data/module1').default,
  2: require('../data/module2').default,
  3: require('../data/module3').default,
  4: require('../data/module4').default,
  5: require('../data/module5').default,
};

export default function LevelScreen({ route, navigation }) {
  const { moduleId } = route.params;
  const { colors: C } = useTheme();
  const styles = useMemo(() => createStyles(C), [C]);
  const { state } = useGame();
  const playRpgTransition = useRpgTransition();
  const mod = MODULES.find(m => m.id === moduleId);
  const data = MODULE_DATA[moduleId];
  const progress = state.moduleProgress[moduleId];
  useScreenMusic('menu');

  const hasPassingStars = (levelId) => {
    const stars = progress.stars[levelId] || 0;
    const hasStarRecord = Object.prototype.hasOwnProperty.call(progress.stars || {}, levelId);
    return stars > 0 || (progress.levelsCompleted.includes(levelId) && !hasStarRecord);
  };

  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) return true;
    return hasPassingStars(levelId - 1);
  };

  const getStars = (levelId) => progress.stars[levelId] || 0;

  if (!data || !mod) {
    return (
      <View style={styles.wrapper}>
        <ScreenBackground moduleId={moduleId} />
        <Image pointerEvents="none" source={castleBackground} resizeMode="cover" style={styles.castleBackdrop} />
        <View style={styles.container}>
          <AppText style={styles.errorText}>Module data not found</AppText>
        </View>
      </View>
    );
  }

  const completedCount = data.levels.filter(level => hasPassingStars(level.id)).length;

  const getMissionIdForLevel = (lid) => {
    // Find first uncompleted mission matching this moduleId and levelId
    const diffProgress = state.missionProgressByDifficulty?.[state.difficulty];
    const uncompleted = STORY_MISSIONS.filter(m =>
      m.moduleId === moduleId && m.levelId === lid &&
      !isMissionCompleted(diffProgress, m.id)
    );
    if (uncompleted.length > 0) return uncompleted[0].id;
    // Fallback: first mission matching this moduleId and levelId
    const first = STORY_MISSIONS.find(m => m.moduleId === moduleId && m.levelId === lid);
    return first ? first.id : null;
  };

  return (
    <View style={styles.wrapper}>
      <ScreenBackground moduleId={moduleId} levelId={1} />
      <Image pointerEvents="none" source={castleBackground} resizeMode="cover" style={styles.castleBackdrop} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.header, { borderBottomColor: mod.color }]}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              soundManager.play('close');
              playRpgTransition();
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <AppText style={styles.moduleLabel}>Module {mod.id}</AppText>
            <AppText style={styles.headerTitle} decorative>{mod.title}</AppText>
            <AppText style={styles.headerSubtitle}>{mod.subtitle}</AppText>
          </View>
          <View style={[styles.progressCircle, { borderColor: mod.color }]}>
            <AppText style={[styles.progressNum, { color: mod.color }]}>{completedCount}</AppText>
            <AppText style={styles.progressDen}>/4</AppText>
          </View>
        </View>

        <View style={styles.bossInfo}>
          <View style={styles.bossIconWrap}>
            <Ionicons name="skull-outline" size={18} color={C.textMuted} />
          </View>
          <View>
            <AppText style={styles.bossLabel}>Realm Boss</AppText>
            <AppText style={styles.bossName} decorative>{mod.boss}</AppText>
          </View>
        </View>

        <View style={styles.levelsList}>
          {data.levels.map((level, idx) => {
            const unlocked = isLevelUnlocked(level.id);
            const completed = hasPassingStars(level.id);
            const stars = getStars(level.id);
            const icons = ['school', 'book', 'bulb', 'trophy'];

            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.levelCard,
                  { backgroundColor: `${C.card}E6`, borderColor: completed ? mod.color : `${C.cardBorder}80` },
                  !unlocked && { opacity: 0.5 },
                ]}
                onPress={() => {
                  soundManager.play('start');
                  const mid = getMissionIdForLevel(level.id);
                  const params = { moduleId, levelId: level.id };
                  if (mid) params.missionId = mid;
                  navigation.navigate('Quiz', params);
                }}
                disabled={!unlocked}
                activeOpacity={0.7}
              >
              <View style={[styles.levelIcon, { backgroundColor: unlocked ? `${mod.color}20` : C.backgroundLight }]}>
                <Ionicons name={level.isBoss ? 'trophy' : icons[idx]} size={22} color={unlocked ? mod.color : C.textMuted} />
              </View>
              <View style={styles.levelInfo}>
                <View style={styles.levelTitleRow}>
                  <AppText style={[styles.levelNum, { color: unlocked ? C.textMuted : C.textMuted }]}>
                    {level.isBoss ? 'FINAL CHALLENGE' : `Level ${level.id}`}
                  </AppText>
                  {completed && !level.isBoss && <Ionicons name="checkmark-circle" size={16} color={C.success} />}
                </View>
                <AppText style={[styles.levelTitle, { color: unlocked ? C.text : C.textMuted }]}>{level.title}</AppText>
                <AppText style={[styles.levelDesc, { color: C.textMuted }]}>{level.description}</AppText>
                <View style={styles.levelMeta}>
                  <View style={[styles.diffBadge, { backgroundColor: unlocked ? `${C.warning}20` : C.backgroundLight }]}>
                    <AppText style={[styles.diffText, { color: unlocked ? C.warning : C.textMuted }]}>{level.difficulty}</AppText>
                  </View>
                  <AppText style={[styles.qCount, { color: C.textMuted }]}>{level.questions.length} questions</AppText>
                </View>
                {completed && stars > 0 && (
                  <View style={styles.starsRow}>
                    {[1, 2, 3].map(s => (
                      <Ionicons key={s} name={s <= stars ? 'star' : 'star-outline'} size={12} color={C.gold} />
                    ))}
                  </View>
                )}
              </View>
              <Ionicons name={unlocked ? 'chevron-forward' : 'lock-closed'} size={18} color={C.textMuted} />
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.spacer} />
    </ScrollView>
    </View>
  );
}

const createStyles = (C) => StyleSheet.create({
  wrapper: { flex: 1 },
  castleBackdrop: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.12,
    transform: [{ scale: 1.08 }],
  },
  container: { flex: 1, backgroundColor: 'transparent' },
  errorText: { color: C.text },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, borderBottomWidth: 1.5, backgroundColor: `${C.card}D8`, borderBottomColor: `${C.gold}35` },
  backBtn: { width: 36, height: 36, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 14, backgroundColor: `${C.backgroundLight}D0`, borderWidth: 1, borderColor: `${C.gold}30` },
  headerInfo: { flex: 1 },
  moduleLabel: { fontSize: 11, fontWeight: '800', letterSpacing: 1.2, textTransform: 'uppercase', color: C.gold },
  headerTitle: { fontSize: 20, fontWeight: '900', marginTop: 2, color: C.text },
  headerSubtitle: { fontSize: 13, marginTop: 2, color: C.textMuted },
  progressCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', backgroundColor: `${C.black}30` },
  progressNum: { fontSize: 16, fontWeight: 'bold' },
  progressDen: { fontSize: 12, color: C.textMuted },
  bossInfo: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 16, padding: 14, borderRadius: 12, gap: 12, borderWidth: 1, backgroundColor: `${C.card}E0`, borderColor: `${C.gold}35` },
  bossIconWrap: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: `${C.backgroundLight}D0`, borderWidth: 1, borderColor: `${C.gold}25` },
  bossLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: C.textMuted },
  bossName: { fontSize: 15, fontWeight: 'bold', marginTop: 2, color: C.text },
  levelsList: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  levelCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, gap: 12, borderWidth: 1, shadowColor: C.primary, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14, shadowRadius: 9, elevation: 3 },
  levelIcon: { width: 44, height: 44, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: `${C.gold}25` },
  levelInfo: { flex: 1 },
  levelTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelNum: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },
  levelTitle: { fontSize: 15, fontWeight: 'bold', marginTop: 2 },
  levelDesc: { fontSize: 11, marginTop: 2 },
  levelMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 10 },
  diffBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  diffText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  qCount: { fontSize: 10, color: C.textMuted },
  starsRow: { flexDirection: 'row', gap: 2, marginTop: 4 },
  spacer: { height: 20 },
});
