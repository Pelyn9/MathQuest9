import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from '../components/AppText';
import DailyRewardModal from '../components/DailyRewardModal';
import LivesDisplay from '../components/LivesDisplay';
import ScreenBackground from '../components/ScreenBackground';
import { useGame } from '../context/GameContext';
import {
  PLAY_MODES,
  getDifficultyMissionProgress,
  getMissionById,
  getMissionStats,
  getNextMissionId,
  getStoryDifficultyPath,
} from '../data/storyMissions';
import useScreenMusic from '../hooks/useScreenMusic';
import { useTheme } from '../theme/ThemeContext';
import { MODULES } from '../theme/colors';
import { soundManager } from '../utils/SoundManager';
import { DIFFICULTY, getPlayerTitle, getXPProgress } from '../utils/gameLogic';

const HomeScreen = React.memo(function HomeScreen({ navigation }) {
  const { colors: C } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isNarrow = screenWidth < 360;
  const isWide = screenWidth >= 600;
  const styles = useMemo(() => createStyles(C, { isNarrow, isWide }), [C, isNarrow, isWide]);

  const { state, playerLevel, claimDailyReward, setPlayMode } = useGame();
  const { currentXP, neededXP } = getXPProgress(state.xp);
  const playerTitle = getPlayerTitle(playerLevel);
  const diffConfig = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
  const activeModeKey = state.activeMode || 'story';
  const activeMode = PLAY_MODES[activeModeKey] || PLAY_MODES.story;
  const storyPath = getStoryDifficultyPath(state.difficulty);
  const missionProgress = getDifficultyMissionProgress(state, state.difficulty);
  const missionStats = getMissionStats(missionProgress);
  const nextMission = getMissionById(getNextMissionId(missionProgress));
  const accuracy = state.totalAnswered > 0
    ? Math.round((state.totalCorrect / state.totalAnswered) * 100)
    : 0;
  const xpPercent = neededXP > 0
    ? Math.min(100, Math.max(0, (currentXP / neededXP) * 100))
    : 100;

  const dailyInfo = useMemo(() => {
    if (!state.lastDailyReward) {
      return { available: true, streak: 0, claimedToday: false };
    }

    const last = new Date(state.lastDailyReward);
    const now = new Date();
    const lastDay = new Date(last.getFullYear(), last.getMonth(), last.getDate()).getTime();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const diffDays = Math.max(0, Math.floor((today - lastDay) / (1000 * 60 * 60 * 24)));

    return {
      available: diffDays > 0,
      streak: diffDays <= 1 ? 1 : 0,
      claimedToday: diffDays === 0,
    };
  }, [state.lastDailyReward]);

  const [showDaily, setShowDaily] = useState(false);

  useScreenMusic('menu');

  const openStackScreen = (screen, params) => {
    const parent = navigation.getParent?.();
    if (parent) {
      parent.navigate(screen, params);
    } else {
      navigation.navigate(screen, params);
    }
  };

  const getModuleProgress = (modId) => {
    const savedProgress = state.moduleProgress?.[modId] || {};
    const module = MODULES.find(item => item.id === modId);

    return {
      ...savedProgress,
      levelsCompleted: Array.isArray(savedProgress.levelsCompleted) ? savedProgress.levelsCompleted : [],
      totalLevels: module.levels,
      color: module.color,
      icon: module.icon,
      title: module.title,
    };
  };

  const startMission = () => {
    soundManager.play('start');

    if (activeModeKey === 'story') {
      if (!nextMission) return;
      openStackScreen('Quiz', {
        moduleId: nextMission.moduleId,
        levelId: nextMission.levelId,
        missionId: nextMission.id,
        mode: 'story',
      });
      return;
    }

    const randomModule = MODULES[Math.floor(Math.random() * MODULES.length)].id;
    const randomLevel = Math.floor(Math.random() * 4) + 1;
    openStackScreen('Quiz', {
      moduleId: randomModule,
      levelId: randomLevel,
      mode: activeModeKey,
    });
  };

  const missionTitle = activeModeKey === 'story'
    ? nextMission?.shortTitle || 'Final Mission'
    : `${activeMode.label} Challenge`;
  const missionMeta = activeModeKey === 'story'
    ? `${storyPath.label} - Mission ${nextMission?.id || 100}/100`
    : activeModeKey === 'survival'
      ? 'Random practice - no timer'
      : 'Random practice - timed';
  const missionButtonText = activeModeKey === 'story'
    ? missionStats.completed >= 100 ? 'Replay Finale' : 'Continue'
    : 'Start';

  const summaryStats = [
    { icon: 'flag', label: 'Missions', value: `${missionStats.completed}/100`, color: C.warning },
    { icon: 'star', label: 'Stars', value: missionStats.totalStars, color: C.gold },
    { icon: 'checkmark-circle', label: 'Accuracy', value: `${accuracy}%`, color: C.success },
  ];

  return (
    <View style={styles.wrapper}>
      <ScreenBackground preset="home" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.topBar}>
            <View style={styles.brandBlock}>
              <AppText style={styles.appName}>MathQuest 9</AppText>
              <AppText style={styles.appSubtitle} numberOfLines={1}>The Lost Kingdom of Numeria</AppText>
            </View>

            <View style={styles.topStatus}>
              <LivesDisplay lives={state.lives} maxLives={state.maxLives} />
              <TouchableOpacity
                style={styles.coinButton}
                onPress={() => {
                  soundManager.play('coin');
                  openStackScreen('Shop');
                }}
                activeOpacity={0.75}
                accessibilityRole="button"
                accessibilityLabel="Open shop"
              >
                <Ionicons name="cash-outline" size={15} color={C.gold} />
                <AppText style={styles.coinText}>{state.coins}</AppText>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.heroPanel}>
            <View style={styles.levelRow}>
              <View style={styles.avatar}>
                <Ionicons name="shield-checkmark" size={22} color={C.primary} />
              </View>
              <View style={styles.levelCopy}>
                <AppText style={styles.levelText}>Level {playerLevel}</AppText>
                <AppText style={styles.playerTitle} numberOfLines={1}>{playerTitle}</AppText>
              </View>
              <View style={[styles.difficultyPill, { backgroundColor: `${diffConfig.color}18`, borderColor: `${diffConfig.color}45` }]}>
                <Ionicons name={diffConfig.icon} size={13} color={diffConfig.color} />
                <AppText style={[styles.difficultyText, { color: diffConfig.color }]}>{diffConfig.label}</AppText>
              </View>
            </View>

            <View style={styles.xpBlock}>
              <View style={styles.xpLabels}>
                <AppText style={styles.xpLabel}>XP</AppText>
                <AppText style={styles.xpValue}>
                  {neededXP > 0 ? `${currentXP}/${neededXP}` : 'Max'}
                </AppText>
              </View>
              <View style={styles.xpTrack}>
                <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
              </View>
            </View>

            <View style={styles.metricRow}>
              {summaryStats.map(stat => (
                <View key={stat.label} style={styles.metricItem}>
                  <Ionicons name={stat.icon} size={16} color={stat.color} />
                  <AppText style={styles.metricValue}>{stat.value}</AppText>
                  <AppText style={styles.metricLabel}>{stat.label}</AppText>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                soundManager.play(dailyInfo.available ? 'open' : 'click');
                setShowDaily(true);
              }}
              activeOpacity={0.76}
              accessibilityRole="button"
              accessibilityLabel="Open daily reward"
            >
              <View style={[styles.quickIcon, { backgroundColor: dailyInfo.available ? `${C.gold}20` : `${C.success}18` }]}>
                <Ionicons
                  name={dailyInfo.available ? 'gift' : 'checkmark-circle'}
                  size={18}
                  color={dailyInfo.available ? C.gold : C.success}
                />
              </View>
              <View style={styles.quickTextWrap}>
                <AppText style={styles.quickTitle}>Daily Reward</AppText>
                <AppText style={styles.quickMeta}>{dailyInfo.available ? 'Ready' : 'Claimed'}</AppText>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickButton}
              onPress={() => {
                soundManager.play('click');
                navigation.navigate('Profile');
              }}
              activeOpacity={0.76}
              accessibilityRole="button"
              accessibilityLabel="Open profile"
            >
              <View style={[styles.quickIcon, { backgroundColor: `${C.primary}18` }]}>
                <Ionicons name="person-circle-outline" size={19} color={C.primary} />
              </View>
              <View style={styles.quickTextWrap}>
                <AppText style={styles.quickTitle}>Profile</AppText>
                <AppText style={styles.quickMeta}>Badges</AppText>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.modeSelector}>
            {Object.values(PLAY_MODES).map((mode) => {
              const selected = activeModeKey === mode.id;

              return (
                <TouchableOpacity
                  key={mode.id}
                  style={[
                    styles.modeButton,
                    {
                      borderColor: selected ? mode.color : `${C.cardBorder}75`,
                      backgroundColor: selected ? `${mode.color}18` : 'transparent',
                    },
                  ]}
                  onPress={() => {
                    soundManager.play(selected ? 'click' : 'select');
                    setPlayMode(mode.id);
                  }}
                  activeOpacity={0.76}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${mode.label} mode`}
                >
                  <Ionicons name={mode.icon} size={17} color={selected ? mode.color : C.textMuted} />
                  <AppText style={[styles.modeText, { color: selected ? mode.color : C.textLight }]}>
                    {mode.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[styles.missionPanel, { borderColor: `${activeMode.color}55` }]}>
            <View style={styles.missionMain}>
              <View style={[styles.missionIcon, { backgroundColor: `${activeMode.color}18` }]}>
                <Ionicons name={activeMode.icon} size={22} color={activeMode.color} />
              </View>
              <View style={styles.missionCopy}>
                <AppText style={styles.missionMeta} numberOfLines={1}>{missionMeta}</AppText>
                <AppText style={styles.missionTitle} numberOfLines={2}>{missionTitle}</AppText>
              </View>
            </View>

            <View style={styles.missionActions}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: activeMode.color }]}
                onPress={startMission}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel={missionButtonText}
              >
                <Ionicons name="play" size={18} color={C.white} />
                <AppText style={styles.primaryButtonText}>{missionButtonText}</AppText>
              </TouchableOpacity>

              {activeModeKey === 'story' && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    soundManager.play('click');
                    navigation.navigate('Map');
                  }}
                  activeOpacity={0.82}
                  accessibilityRole="button"
                  accessibilityLabel="Open mission map"
                >
                  <Ionicons name="map-outline" size={18} color={C.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <AppText style={styles.sectionTitle}>Practice</AppText>
            <AppText style={styles.sectionMeta}>Choose a module</AppText>
          </View>

          <View style={styles.moduleGrid}>
            {MODULES.map((module, index) => (
              <ModuleTile
                key={module.id}
                module={getModuleProgress(module.id)}
                spanFull={index === MODULES.length - 1 && MODULES.length % 2 === 1}
                styles={styles}
                colors={C}
                onPress={() => {
                  soundManager.play('click');
                  openStackScreen('Level', { moduleId: module.id });
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <DailyRewardModal
        visible={showDaily}
        streak={dailyInfo.streak}
        claimable={dailyInfo.available}
        onClaim={(coins, xp) => {
          soundManager.play('coin');
          claimDailyReward(coins, xp);
        }}
        onClose={() => {
          soundManager.play('close');
          setShowDaily(false);
        }}
      />
    </View>
  );
});

export default HomeScreen;

function ModuleTile({ module, spanFull, onPress, styles, colors: C }) {
  const completed = module.levelsCompleted.length;
  const total = module.totalLevels || 1;
  const progress = Math.min(100, Math.max(0, (completed / total) * 100));

  return (
    <TouchableOpacity
      style={[styles.moduleTile, spanFull && styles.moduleTileFull, { borderColor: `${module.color}52` }]}
      onPress={onPress}
      activeOpacity={0.76}
      accessibilityRole="button"
      accessibilityLabel={`Open ${module.title}`}
    >
      <View style={styles.moduleTop}>
        <View style={[styles.moduleIcon, { backgroundColor: `${module.color}18` }]}>
          <Ionicons name={module.icon} size={20} color={module.color} />
        </View>
        {completed >= total && <Ionicons name="checkmark-circle" size={17} color={C.success} />}
      </View>
      <View style={styles.moduleTextBlock}>
        <AppText style={[styles.moduleNumber, { color: module.color }]}>Module</AppText>
        <AppText style={styles.moduleTitle} numberOfLines={2}>{module.title}</AppText>
      </View>
      <View style={styles.moduleProgressRow}>
        <View style={styles.moduleTrack}>
          <View style={[styles.moduleFill, { width: `${progress}%`, backgroundColor: module.color }]} />
        </View>
        <AppText style={styles.moduleCount}>{completed}/{total}</AppText>
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (C, { isNarrow, isWide }) => StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollContent: {
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 118,
  },
  content: {
    width: '100%',
    paddingHorizontal: isWide ? 40 : isNarrow ? 10 : 20,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brandBlock: {
    flex: 1,
    minWidth: 0,
  },
  appName: {
    color: C.gold,
    fontSize: 25,
    fontWeight: '900',
    lineHeight: 30,
  },
  appSubtitle: {
    color: C.textLight,
    fontSize: 12,
    lineHeight: 16,
    marginTop: 1,
  },
  topStatus: {
    alignItems: 'flex-end',
    gap: 7,
    flexShrink: 0,
  },
  coinButton: {
    minHeight: 30,
    minWidth: 58,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${C.gold}38`,
    backgroundColor: `${C.gold}12`,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  coinText: {
    color: C.gold,
    fontSize: 13,
    fontWeight: '800',
  },
  heroPanel: {
    marginTop: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${C.cardBorder}75`,
    backgroundColor: `${C.card}E6`,
    padding: 14,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${C.primary}45`,
    backgroundColor: `${C.primary}16`,
  },
  levelCopy: {
    flex: 1,
    minWidth: 0,
  },
  levelText: {
    color: C.textMuted,
    fontSize: 12,
    lineHeight: 15,
  },
  playerTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  difficultyPill: {
    minHeight: 30,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    flexShrink: 0,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '900',
  },
  xpBlock: {
    marginTop: 14,
  },
  xpLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  xpLabel: {
    color: C.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  xpValue: {
    color: C.xp,
    fontSize: 12,
    fontWeight: '800',
  },
  xpTrack: {
    height: 7,
    borderRadius: 6,
    overflow: 'hidden',
    backgroundColor: `${C.black}55`,
    borderWidth: 1,
    borderColor: `${C.primary}24`,
  },
  xpFill: {
    height: '100%',
    borderRadius: 6,
    backgroundColor: C.xp,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 14,
  },
  metricItem: {
    flex: 1,
    minHeight: 62,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${C.cardBorder}55`,
    backgroundColor: `${C.backgroundLight}88`,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 8,
  },
  metricValue: {
    color: C.text,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
    marginTop: 3,
  },
  metricLabel: {
    color: C.textMuted,
    fontSize: 10,
    lineHeight: 13,
  },
  quickActions: {
    flexDirection: isNarrow ? 'column' : 'row',
    gap: 10,
    marginTop: 12,
  },
  quickButton: {
    flex: 1,
    minHeight: 58,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${C.cardBorder}60`,
    backgroundColor: `${C.card}D8`,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
  },
  quickIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  quickTitle: {
    color: C.text,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 17,
  },
  quickMeta: {
    color: C.textMuted,
    fontSize: 11,
    lineHeight: 14,
  },
  modeSelector: {
    marginTop: 14,
    padding: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${C.cardBorder}60`,
    backgroundColor: `${C.black}20`,
    flexDirection: 'row',
    gap: 5,
  },
  modeButton: {
    flex: 1,
    minHeight: 42,
    borderRadius: 7,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: isNarrow ? 'column' : 'row',
    gap: isNarrow ? 2 : 5,
    paddingHorizontal: 5,
  },
  modeText: {
    fontSize: isNarrow ? 10 : 12,
    fontWeight: '800',
    lineHeight: 15,
  },
  missionPanel: {
    marginTop: 12,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: `${C.card}E8`,
    padding: 13,
  },
  missionMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
  },
  missionIcon: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missionCopy: {
    flex: 1,
    minWidth: 0,
  },
  missionMeta: {
    color: C.textMuted,
    fontSize: 11,
    lineHeight: 14,
  },
  missionTitle: {
    color: C.text,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 23,
    marginTop: 1,
  },
  missionActions: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 13,
  },
  primaryButton: {
    flex: 1,
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  primaryButtonText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryButton: {
    width: 48,
    minHeight: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: `${C.primary}55`,
    backgroundColor: `${C.primary}12`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginTop: 24,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    color: C.textLight,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
  },
  sectionMeta: {
    color: C.textMuted,
    fontSize: 12,
    lineHeight: 16,
  },
  moduleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: isNarrow ? 8 : 12,
  },
  moduleTile: {
    width: isNarrow ? '47.5%' : '48%',
    minHeight: isNarrow ? 160 : 182,
    borderRadius: 8,
    borderWidth: 1,
    backgroundColor: `${C.card}C8`,
    padding: isNarrow ? 10 : 15,
    justifyContent: 'space-between',
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 3,
  },
  moduleTileFull: {
    width: '100%',
    minHeight: isNarrow ? 160 : 182,
  },
  moduleTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: isNarrow ? 38 : 44,
  },
  moduleIcon: {
    width: isNarrow ? 38 : 44,
    height: isNarrow ? 38 : 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTextBlock: {
    marginTop: 12,
    flex: 1,
    justifyContent: 'flex-start',
  },
  moduleNumber: {
    fontSize: isNarrow ? 11 : 12,
    fontWeight: '900',
    lineHeight: 15,
  },
  moduleTitle: {
    color: C.textLight,
    fontSize: isNarrow ? 13 : 16,
    fontWeight: '900',
    lineHeight: isNarrow ? 17 : 20,
    marginTop: 3,
  },
  moduleProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
  },
  moduleTrack: {
    flex: 1,
    height: 6,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: `${C.black}78`,
  },
  moduleFill: {
    height: '100%',
    borderRadius: 5,
  },
  moduleCount: {
    color: C.textMuted,
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 14,
  },
});
