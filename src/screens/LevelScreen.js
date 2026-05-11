import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { MODULES } from '../theme/colors';
import { useGame } from '../context/GameContext';
import ScreenBackground from '../components/ScreenBackground';

const MODULE_DATA = {
  1: require('../data/module1').default,
  2: require('../data/module2').default,
  3: require('../data/module3').default,
  4: require('../data/module4').default,
};

export default function LevelScreen({ route, navigation }) {
  const { moduleId } = route.params;
  const { colors: C } = useTheme();
  const styles = useMemo(() => createStyles(C), [C]);
  const { state } = useGame();
  const mod = MODULES.find(m => m.id === moduleId);
  const data = MODULE_DATA[moduleId];
  const progress = state.moduleProgress[moduleId];

  const isLevelUnlocked = (levelId) => {
    if (levelId === 1) return true;
    return progress.levelsCompleted.includes(levelId - 1);
  };

  const getStars = (levelId) => progress.stars[levelId] || 0;

  if (!data) {
    return (
      <View style={styles.wrapper}>
      <ScreenBackground moduleId={moduleId} />
      <View style={styles.container}>
        <AppText style={styles.errorText}>Module data not found</AppText>
      </View>
      </View>
    );
  }

  const completedCount = progress.levelsCompleted.length;

  return (
    <View style={styles.wrapper}>
      <ScreenBackground moduleId={moduleId} levelId={1} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { borderBottomColor: mod.color }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
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
          const completed = progress.levelsCompleted.includes(level.id);
          const stars = getStars(level.id);
          const icons = ['school', 'book', 'bulb', 'trophy'];

          return (
            <TouchableOpacity
              key={level.id}
              style={[
                styles.levelCard,
                { backgroundColor: C.card, borderColor: completed ? mod.color : C.cardBorder },
                !unlocked && { opacity: 0.5 },
              ]}
              onPress={() => unlocked && navigation.navigate('Quiz', { moduleId, levelId: level.id })}
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
  container: { flex: 1, backgroundColor: 'transparent' },
  errorText: { color: C.text },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20, borderBottomWidth: 3, backgroundColor: C.card },
  backBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 14, backgroundColor: C.backgroundLight },
  headerInfo: { flex: 1 },
  moduleLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: C.textMuted },
  headerTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 2, color: C.text },
  headerSubtitle: { fontSize: 13, marginTop: 2, color: C.textMuted },
  progressCircle: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  progressNum: { fontSize: 16, fontWeight: 'bold' },
  progressDen: { fontSize: 12, color: C.textMuted },
  bossInfo: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 16, padding: 14, borderRadius: 14, gap: 12, borderWidth: 1, backgroundColor: C.card, borderColor: C.cardBorder },
  bossIconWrap: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: C.backgroundLight },
  bossLabel: { fontSize: 10, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase', color: C.textMuted },
  bossName: { fontSize: 15, fontWeight: 'bold', marginTop: 2, color: C.text },
  levelsList: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  levelCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 14, gap: 12, borderWidth: 1 },
  levelIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
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
  spacer: { height: 40 },
});
