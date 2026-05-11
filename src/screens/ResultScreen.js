import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo } from 'react';
import { SHADOWS } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { getXPProgress, getPlayerTitle, calculatePlayerLevel } from '../utils/gameLogic';
import { PLAY_MODES, MISSION_TOTAL, getMissionById, getStoryDifficultyPath } from '../data/storyMissions';
import LevelUpModal from '../components/LevelUpModal';
import ScreenBackground from '../components/ScreenBackground';

export default function ResultScreen({ route, navigation }) {
  const { moduleId, levelId, missionId, mode, score, total, correctCount, accuracy, coins, badge, xpEarned } = route.params;
  const { colors: C } = useTheme();
  const styles = useMemo(() => createStyles(C), [C]);
  const { state } = useGame();
  const { showToast } = useToast();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const activeMode = PLAY_MODES[mode || state.activeMode || 'story'] || PLAY_MODES.story;
  const storyPath = getStoryDifficultyPath(state.difficulty);
  const mission = missionId ? getMissionById(missionId) : null;
  const nextMission = missionId && missionId < MISSION_TOTAL ? getMissionById(Number(missionId) + 1) : null;

  const oldLevel = calculatePlayerLevel(state.xp - (xpEarned || 0));
  const newLevel = state.xp ? calculatePlayerLevel(state.xp) : oldLevel;
  const leveledUp = newLevel > oldLevel;

  React.useEffect(() => {
    if (leveledUp) {
      showToast(`Level Up! You're now Level ${newLevel}!`, 'xp', 'arrow-up-circle');
      const timer = setTimeout(() => setShowLevelUp(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const getStarCount = () => {
    if (accuracy >= 90) return 3;
    if (accuracy >= 70) return 2;
    if (accuracy >= 40) return 1;
    return 0;
  };

  const stars = getStarCount();
  const messages = [
    { icon: 'fitness', text: "Keep practicing! You'll get better!" },
    { icon: 'thumbs-up', text: 'Good effort! Review the solutions and try again.' },
    { icon: 'star', text: 'Great job! You really know your stuff!' },
    { icon: 'trophy', text: 'Perfect! You are a true Math Hero!' },
  ];
  const msg = messages[Math.min(stars, 3)];

  const isModuleComplete = state.moduleProgress[moduleId]?.completed;

  return (
    <View style={styles.wrapper}>
      <ScreenBackground preset="result" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.starsRow}>
          {[1, 2, 3].map(s => (
            <Ionicons
              key={s}
              name={s <= stars ? 'star' : 'star-outline'}
              size={40}
              color={C.gold}
            />
          ))}
        </View>
        <AppText style={styles.title} decorative>{mission ? 'Mission Complete!' : 'Level Complete!'}</AppText>
        <View style={styles.messageRow}>
          <Ionicons name={msg.icon} size={18} color={C.textLight} />
          <AppText style={styles.message}>{msg.text}</AppText>
        </View>
      </View>

      {mission && (
        <View style={[styles.missionCard, { borderColor: `${mission.color}60` }]}>
          <View style={[styles.missionIcon, { backgroundColor: `${mission.color}20` }]}>
            <Ionicons name={mission.icon} size={22} color={mission.color} />
          </View>
          <View style={styles.missionCopy}>
            <AppText style={styles.missionKicker}>Mission {mission.id}/100 - {activeMode.title} - {storyPath.label}</AppText>
              <AppText style={styles.missionTitle} decorative>{mission.shortTitle}</AppText>
            <AppText style={styles.missionStory} numberOfLines={2}>
              {nextMission ? `Path opened: ${nextMission.shortTitle}` : 'The Lost Kingdom of Numeria is restored.'}
            </AppText>
          </View>
        </View>
      )}

      <View style={[styles.statsCard, SHADOWS.medium]}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Ionicons name="checkmark-circle" size={24} color={C.success} />
            <AppText style={styles.statValue}>{correctCount}/{total}</AppText>
            <AppText style={styles.statLabel}>Correct</AppText>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Ionicons name="analytics" size={24} color={C.info} />
            <AppText style={styles.statValue}>{accuracy}%</AppText>
            <AppText style={styles.statLabel}>Accuracy</AppText>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={24} color={C.gold} />
            <AppText style={styles.statValue}>{score}</AppText>
            <AppText style={styles.statLabel}>Score</AppText>
          </View>
        </View>
      </View>

      {xpEarned > 0 && (
        <View style={[styles.xpCard, SHADOWS.small]}>
          <Ionicons name="flash" size={22} color={C.xp} />
          <AppText style={styles.xpText}>+{xpEarned} XP</AppText>
          {leveledUp && (
            <View style={styles.levelUpBadge}>
              <Ionicons name="arrow-up-circle" size={16} color={C.success} />
              <AppText style={styles.levelUpText}>Level Up!</AppText>
            </View>
          )}
        </View>
      )}

      {coins > 0 && (
        <View style={[styles.rewardCard, SHADOWS.small]}>
          <Ionicons name="cash-outline" size={22} color={C.gold} />
          <AppText style={styles.rewardText}>+{coins} Coins earned!</AppText>
        </View>
      )}

      {badge && (
        <View style={[styles.badgeCard, SHADOWS.small]}>
          <Ionicons name={badge.icon} size={28} color={C.gold} />
          <View>
            <AppText style={styles.badgeName}>New Badge: {badge.name}</AppText>
            <AppText style={styles.badgeDesc}>{badge.desc}</AppText>
          </View>
        </View>
      )}

      <View style={styles.buttonSection}>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.replace('Quiz', { moduleId, levelId, missionId, mode: activeMode.id })}
        >
          <Ionicons name="refresh" size={20} color={C.primary} />
          <AppText style={styles.retryBtnText}>Retry Level</AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextBtn}
          onPress={() => {
            if (nextMission) {
              navigation.replace('Quiz', {
                moduleId: nextMission.moduleId,
                levelId: nextMission.levelId,
                missionId: nextMission.id,
                mode: activeMode.id,
              });
            } else if (mission) {
              navigation.navigate('Map');
            } else if (isModuleComplete && moduleId < 4) {
              navigation.navigate('Level', { moduleId: moduleId + 1 });
            } else if (levelId < 4) {
              navigation.navigate('Level', { moduleId });
            } else {
              navigation.navigate('Map');
            }
          }}
        >
          <AppText style={styles.nextBtnText}>
            {nextMission
              ? 'Next Mission'
              : mission
                ? 'Back to Map'
                : isModuleComplete && moduleId < 4
              ? 'Next Module'
              : levelId < 4
                ? 'Next Level'
                : 'Back to Map'}
          </AppText>
          <Ionicons name="arrow-forward" size={20} color={C.white} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() => navigation.navigate('Map')}
        >
          <AppText style={styles.mapBtnText}>Adventure Map</AppText>
        </TouchableOpacity>
      </View>

      <LevelUpModal
        visible={showLevelUp}
        level={newLevel}
        xp={state.xp}
        onClose={() => setShowLevelUp(false)}
      />

      <View style={styles.bottomPadding} />
    </ScrollView>
    </View>
  );
}

const createStyles = (C) => StyleSheet.create({
  wrapper: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: C.card,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: C.text,
    marginTop: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  message: {
    fontSize: 15,
    color: C.textLight,
    textAlign: 'center',
  },
  missionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.card,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
  },
  missionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionCopy: {
    flex: 1,
  },
  missionKicker: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: C.textMuted,
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: C.text,
    marginTop: 2,
  },
  missionStory: {
    fontSize: 12,
    lineHeight: 17,
    color: C.textMuted,
    marginTop: 2,
  },
  statsCard: {
    backgroundColor: C.card,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  divider: {
    width: 1,
    backgroundColor: C.backgroundLight,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: C.text,
  },
  statLabel: {
    fontSize: 12,
    color: C.textMuted,
  },
  xpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${C.xp}20`,
    marginHorizontal: 20,
    marginTop: 12,
    padding: 14,
    borderRadius: 14,
    gap: 10,
  },
  xpText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: C.xp,
    flex: 1,
  },
  levelUpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: C.successLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  levelUpText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: C.success,
  },
  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${C.gold}20`,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    gap: 10,
  },
  rewardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: C.gold,
  },
  badgeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${C.module3}30`,
    marginHorizontal: 20,
    marginTop: 8,
    padding: 14,
    borderRadius: 14,
    gap: 12,
  },
  badgeName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: C.text,
  },
  badgeDesc: {
    fontSize: 12,
    color: C.textMuted,
    marginTop: 2,
  },
  buttonSection: {
    paddingHorizontal: 20,
    marginTop: 24,
    gap: 10,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.card,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.primary,
    gap: 8,
  },
  retryBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: C.primary,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.primary,
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  nextBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: C.white,
  },
  mapBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  mapBtnText: {
    fontSize: 14,
    color: C.textMuted,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
