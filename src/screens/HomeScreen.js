import { View, TouchableOpacity, ScrollView, StyleSheet, useWindowDimensions } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { MODULES } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { getXPProgress, getPlayerTitle, getFullDisplayTitle, DIFFICULTY } from '../utils/gameLogic';
import {
  PLAY_MODES,
  getDifficultyMissionProgress,
  getDifficultyMissionStory,
  getMissionById,
  getMissionStats,
  getNextMissionId,
  getStoryDifficultyPath,
} from '../data/storyMissions';
import LivesDisplay from '../components/LivesDisplay';
import ModuleCard from '../components/ModuleCard';
import DailyRewardModal from '../components/DailyRewardModal';
import ScreenBackground from '../components/ScreenBackground';
import useScreenMusic from '../hooks/useScreenMusic';
import { soundManager } from '../utils/SoundManager';

export default function HomeScreen({ navigation }) {
  const { colors: C } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const titleSize = Math.min(22, Math.round(screenWidth * 0.05));
  const styles = useMemo(() => createStyles(C, titleSize), [C, titleSize]);
  const { state, playerLevel, claimDailyReward, setPlayMode } = useGame();
  const { currentXP, neededXP } = getXPProgress(state.xp);
  const title = getPlayerTitle(playerLevel);
  const diffConfig = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
  const activeModeKey = state.activeMode || 'story';
  const activeMode = PLAY_MODES[activeModeKey] || PLAY_MODES.story;
  const storyPath = getStoryDifficultyPath(state.difficulty);
  const missionProgress = getDifficultyMissionProgress(state, state.difficulty);
  const missionStats = getMissionStats(missionProgress);
  const nextMission = getMissionById(getNextMissionId(missionProgress));
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
  useScreenMusic('menu');

  const [showDaily, setShowDaily] = useState(false);

  const openStackScreen = (screen, params) => {
    const parent = navigation.getParent?.();
    if (parent) {
      parent.navigate(screen, params);
    } else {
      navigation.navigate(screen, params);
    }
  };

  useEffect(() => {
    if (dailyInfo.available) setShowDaily(true);
  }, [dailyInfo.available]);

  const calcStreak = () => {
    return dailyInfo.streak;
  };

  const getModuleProgress = (modId) => {
    const m = state.moduleProgress[modId];
    const mod = MODULES.find(x => x.id === modId);
    return { ...m, totalLevels: mod.levels, color: mod.color, lightColor: mod.lightColor, icon: mod.icon, title: mod.title, subtitle: mod.subtitle };
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
    } else {
      // survival / timer — pick a random module/level
      const randomModule = MODULES[Math.floor(Math.random() * MODULES.length)].id;
      const randomLevel = Math.floor(Math.random() * 4) + 1;
      openStackScreen('Quiz', {
        moduleId: randomModule,
        levelId: randomLevel,
        mode: activeModeKey,
      });
    }
  };

  return (
    <View style={styles.wrapper}>
      <ScreenBackground preset="home" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={styles.titleOrnament}>
              <View style={styles.ornamentLine} />
              <Ionicons name="compass" size={18} color={C.gold} />
              <View style={styles.ornamentLine} />
            </View>
            <View style={styles.titleRow}>
              <AppText style={styles.greeting} decorative>Derivative Chronicles</AppText>
              <View style={[styles.diffBadge, { backgroundColor: `${diffConfig.color}20` }]}>
                <Ionicons name={diffConfig.icon} size={12} color={diffConfig.color} />
                <AppText style={[styles.diffText, { color: diffConfig.color }]}>{diffConfig.label}</AppText>
              </View>
            </View>
            <AppText style={styles.subtitle}>MathQuest 9 - The Lost Kingdom of Numeria</AppText>
          </View>
          <View style={styles.headerRight}>
            <LivesDisplay lives={state.lives} maxLives={state.maxLives} />
            <TouchableOpacity
              style={styles.coinBadge}
              onPress={() => {
                soundManager.play('coin');
                openStackScreen('Shop');
              }}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityLabel="Open coin shop"
            >
              <Ionicons name="cash-outline" size={14} color={C.gold} />
              <AppText style={styles.coinText}>{state.coins}</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.playerCard}>
          <View style={styles.playerInfo}>
            <View style={styles.avatarSmall}>
              <Ionicons name="shield-checkmark" size={22} color={C.primary} />
            </View>
            <View style={styles.playerText}>
              <AppText style={styles.playerName} decorative>Level {playerLevel} {title}</AppText>
              <AppText style={styles.playerSub}>Math Hero</AppText>
            </View>
          </View>
          <View style={styles.xpSection}>
            <View style={styles.xpHeader}>
              <Ionicons name="flash" size={14} color={C.xp} />
              <AppText style={styles.xpLabel}>XP</AppText>
              <AppText style={styles.xpValue}>{state.xp}</AppText>
            </View>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${(currentXP / neededXP) * 100}%` }]} />
            </View>
            <AppText style={styles.xpDetail}>{currentXP}/{neededXP}</AppText>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.dailyRewardCard,
            { borderColor: dailyInfo.available ? `${C.gold}70` : `${C.cardBorder}90` },
          ]}
          onPress={() => {
            soundManager.play(dailyInfo.available ? 'open' : 'click');
            setShowDaily(true);
          }}
          activeOpacity={0.78}
          accessibilityRole="button"
          accessibilityLabel="Open daily reward"
        >
          <View style={[styles.dailyGiftIcon, { backgroundColor: dailyInfo.available ? `${C.gold}24` : `${C.backgroundLight}D0` }]}>
            <Ionicons name={dailyInfo.available ? 'gift' : 'checkmark-circle'} size={22} color={dailyInfo.available ? C.gold : C.success} />
          </View>
          <View style={styles.dailyRewardCopy}>
            <AppText style={styles.dailyRewardTitle} decorative>Daily Reward</AppText>
            <AppText style={styles.dailyRewardText}>
              {dailyInfo.available ? 'Coins and XP are ready to claim.' : 'Reward claimed today. Come back tomorrow.'}
            </AppText>
          </View>
          <View style={[styles.dailyRewardAction, { backgroundColor: dailyInfo.available ? C.gold : `${C.success}22` }]}>
            <AppText style={[styles.dailyRewardActionText, { color: dailyInfo.available ? C.black : C.success }]}>
              {dailyInfo.available ? 'Claim' : 'View'}
            </AppText>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.modePanel}>
        <View style={styles.modeHeader}>
          <View style={styles.modeHeaderText}>
            <AppText style={styles.modeTitle} decorative>Quest Mode</AppText>
            <AppText style={styles.modeSubtitle}>
              {activeMode.description} {storyPath.label} keeps its own mission progress and XP bonus.
            </AppText>
          </View>
          <View style={[styles.activeModePill, { backgroundColor: `${activeMode.color}18` }]}>
            <Ionicons name={activeMode.icon} size={13} color={activeMode.color} />
            <AppText style={[styles.activeModeText, { color: activeMode.color }]}>{activeMode.label}</AppText>
          </View>
        </View>
        <View style={styles.modeGrid}>
          {Object.values(PLAY_MODES).map((mode) => {
            const selected = activeModeKey === mode.id;
            return (
              <TouchableOpacity
                key={mode.id}
                style={[
                  styles.modeButton,
                  {
                    borderColor: selected ? mode.color : C.cardBorder,
                    backgroundColor: selected ? `${mode.color}18` : C.card,
                  },
                ]}
                onPress={() => {
                  soundManager.play(selected ? 'click' : 'select');
                  setPlayMode(mode.id);
                }}
                activeOpacity={0.75}
              >
                <Ionicons name={mode.icon} size={18} color={selected ? mode.color : C.textMuted} />
                <AppText style={[styles.modeButtonText, { color: selected ? mode.color : C.text }]}>
                  {mode.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {activeModeKey === 'story' && nextMission && (
        <View style={[styles.missionCard, { borderColor: `${activeMode.color}55` }]}>
          <View style={styles.missionTop}>
            <View style={[styles.missionIcon, { backgroundColor: `${nextMission.color}20` }]}>
              <Ionicons name={nextMission.icon} size={22} color={nextMission.color} />
            </View>
            <View style={styles.missionInfo}>
              <AppText style={styles.missionKicker}>
                {missionStats.completed >= 100 ? `${storyPath.progressLabel} Cleared` : `Next Mission ${nextMission.id}/100 - ${storyPath.label}`}
              </AppText>
              <AppText style={styles.missionTitle} decorative>{nextMission.shortTitle}</AppText>
              <AppText style={styles.missionStory} numberOfLines={3}>
                {getDifficultyMissionStory(nextMission, state.difficulty)}
              </AppText>
            </View>
          </View>
          <View style={styles.missionActions}>
            <TouchableOpacity
              style={[styles.primaryMissionBtn, { backgroundColor: activeMode.color }]}
              onPress={startMission}
              activeOpacity={0.8}
            >
              <Ionicons name="play" size={17} color={C.white} />
              <AppText style={styles.primaryMissionText}>
                {missionStats.completed >= 100 ? 'Replay Finale' : 'Continue'}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryMissionBtn}
              onPress={() => {
                soundManager.play('click');
                navigation.navigate('Map');
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="map" size={17} color={C.primary} />
              <AppText style={styles.secondaryMissionText}>Mission Map</AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* survival / timer — generic challenge card */}
      {activeModeKey !== 'story' && (
        <View style={[styles.missionCard, { borderColor: `${activeMode.color}55` }]}>
          <View style={styles.missionTop}>
            <View style={[styles.missionIcon, { backgroundColor: `${activeMode.color}20` }]}>
              <Ionicons name={activeMode.icon} size={24} color={activeMode.color} />
            </View>
            <View style={styles.missionInfo}>
              <AppText style={styles.missionKicker}>{activeMode.label} Challenge</AppText>
              <AppText style={styles.missionTitle} decorative>Random Skirmish</AppText>
              <AppText style={styles.missionStory}>
                {activeModeKey === 'survival'
                  ? 'Endless questions with no timer. Hold your ground as long as you can. Every correct answer keeps you alive.'
                  : 'Race against the clock. Answer fast and accurate to survive the countdown pressure.'}
              </AppText>
            </View>
          </View>
          <View style={styles.missionActions}>
            <TouchableOpacity
              style={[styles.primaryMissionBtn, { backgroundColor: activeMode.color }]}
              onPress={startMission}
              activeOpacity={0.8}
            >
              <Ionicons name="play" size={17} color={C.white} />
              <AppText style={styles.primaryMissionText}>Battle</AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.statsRow}>
        <View style={styles.statCardGold}>
          <Ionicons name="star" size={18} color={C.gold} />
          <AppText style={styles.statValue}>{missionStats.totalStars}/{missionStats.totalPossibleStars}</AppText>
          <AppText style={styles.statLabel}>Stars</AppText>
        </View>
        <View style={styles.statCardSuccess}>
          <Ionicons name="checkmark-circle" size={18} color={C.success} />
          <AppText style={styles.statValue}>
            {state.totalAnswered > 0 ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0}%
          </AppText>
          <AppText style={styles.statLabel}>Accuracy</AppText>
        </View>
        <View style={styles.statCardWarning}>
          <Ionicons name="flag" size={18} color={C.warning} />
          <AppText style={styles.statValue}>{missionStats.completed}/100</AppText>
          <AppText style={styles.statLabel}>Missions</AppText>
        </View>
      </View>

      <AppText style={styles.sectionTitle} decorative>Training Realms</AppText>

      {MODULES.map((mod) => (
        <ModuleCard
          key={mod.id}
          module={getModuleProgress(mod.id)}
          onPress={() => {
            soundManager.play('click');
            openStackScreen('Level', { moduleId: mod.id });
          }}
        />
      ))}

      <TouchableOpacity
        style={styles.profileBtn}
        onPress={() => {
          soundManager.play('click');
          navigation.navigate('Profile');
        }}
      >
        <Ionicons name="person-circle-outline" size={20} color={C.primary} />
        <AppText style={styles.profileBtnText}>View Profile & Achievements</AppText>
        <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
      </TouchableOpacity>

      <View style={styles.spacer} />

      <DailyRewardModal
        visible={showDaily}
        streak={calcStreak()}
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
    </ScrollView>
    </View>
  );
}

const createStyles = (C, titleSize) => StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { paddingHorizontal: 20, paddingTop: 48, paddingBottom: 16, backgroundColor: 'transparent' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  headerLeft: { flexShrink: 1, minWidth: 0 },
  titleOrnament: { flexDirection: 'row', alignItems: 'center', gap: 8, width: 210, maxWidth: '100%', marginBottom: 6 },
  ornamentLine: { flex: 1, height: 1, backgroundColor: `${C.gold}70` },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  greeting: { fontSize: titleSize, fontWeight: '900', color: C.gold, textAlign: 'left', includeFontPadding: false, flexShrink: 1, letterSpacing: 2, textTransform: 'uppercase', textShadowColor: 'rgba(244,197,106,0.35)', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 10 },
  diffBadge: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: `${C.primary}55`, flexShrink: 0 },
  diffText: { fontSize: 9, fontWeight: 'bold', textTransform: 'uppercase' },
  subtitle: { fontSize: 14, marginTop: 4, color: C.textLight, fontStyle: 'italic' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 0 },
  coinBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, gap: 4, marginRight: 8, backgroundColor: `${C.gold}18`, borderWidth: 1, borderColor: `${C.gold}45` },
  coinText: { fontWeight: 'bold', fontSize: 13, color: C.gold },
  playerCard: { flexDirection: 'row', alignItems: 'center', marginTop: 18, borderRadius: 14, padding: 14, borderWidth: 1, backgroundColor: `${C.card}E8`, borderColor: `${C.gold}45`, shadowColor: C.gold, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 12, elevation: 4 },
  playerInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  avatarSmall: { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center', backgroundColor: `${C.primary}20`, borderWidth: 1, borderColor: `${C.gold}50` },
  playerText: { flex: 1 },
  playerName: { fontSize: 14, fontWeight: 'bold', color: C.text },
  playerSub: { fontSize: 11, color: C.textMuted },
  xpSection: { width: 120 },
  xpHeader: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  xpLabel: { fontSize: 11, fontWeight: '600', flex: 1, color: C.textMuted },
  xpValue: { fontSize: 12, fontWeight: 'bold', color: C.xp },
  xpTrack: { height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 5, backgroundColor: `${C.black}55`, borderWidth: 1, borderColor: `${C.rune || C.primary}25` },
  xpFill: { height: '100%', borderRadius: 3, backgroundColor: C.xp },
  xpDetail: { fontSize: 9, textAlign: 'right', marginTop: 2, color: C.textMuted },
  dailyRewardCard: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12, borderRadius: 12, padding: 12, borderWidth: 1.5, backgroundColor: `${C.card}E6`, shadowColor: C.gold, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14, shadowRadius: 9, elevation: 3 },
  dailyGiftIcon: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: `${C.gold}35` },
  dailyRewardCopy: { flex: 1, minWidth: 0 },
  dailyRewardTitle: { fontSize: 14, fontWeight: '900', color: C.text },
  dailyRewardText: { fontSize: 11, lineHeight: 15, color: C.textMuted, marginTop: 2 },
  dailyRewardAction: { minWidth: 58, minHeight: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 },
  dailyRewardActionText: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  modePanel: { marginHorizontal: 20, marginTop: 16, borderRadius: 12, padding: 14, borderWidth: 1, backgroundColor: `${C.card}E0`, borderColor: `${C.rune || C.primary}40` },
  modeHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 },
  modeHeaderText: { flex: 1 },
  modeTitle: { fontSize: 15, fontWeight: '900', color: C.text },
  modeSubtitle: { fontSize: 11, lineHeight: 16, marginTop: 2, color: C.textMuted },
  activeModePill: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 10 },
  activeModeText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  modeGrid: { flexDirection: 'row', gap: 8, marginTop: 12 },
  modeButton: { flex: 1, minHeight: 48, borderRadius: 10, borderWidth: 1.5, justifyContent: 'center', alignItems: 'center', gap: 4 },
  modeButtonText: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  missionCard: { marginHorizontal: 20, marginTop: 12, borderRadius: 12, padding: 14, borderWidth: 1.5, backgroundColor: `${C.card}E8`, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.16, shadowRadius: 12, elevation: 4 },
  missionTop: { flexDirection: 'row', gap: 12 },
  missionIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: `${C.gold}35` },
  missionInfo: { flex: 1 },
  missionKicker: { fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase', color: C.textMuted },
  missionTitle: { fontSize: 16, fontWeight: '900', marginTop: 2, color: C.text },
  missionStory: { fontSize: 12, lineHeight: 17, marginTop: 3, color: C.textMuted, textAlign: 'justify' },
  missionActions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  primaryMissionBtn: { flex: 1, minHeight: 44, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, borderWidth: 1, borderColor: `${C.gold}55` },
  primaryMissionText: { fontSize: 14, fontWeight: '900', color: C.white },
  secondaryMissionBtn: { flex: 1, minHeight: 44, borderRadius: 10, borderWidth: 1, borderColor: `${C.primary}70`, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7, backgroundColor: `${C.primary}14` },
  secondaryMissionText: { fontSize: 14, fontWeight: '900', color: C.primary },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginTop: 16 },
  statCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4 },
  statCardGold: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', gap: 4, backgroundColor: `${C.gold}12`, borderWidth: 1, borderColor: `${C.gold}35` },
  statCardSuccess: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', gap: 4, backgroundColor: `${C.success}12`, borderWidth: 1, borderColor: `${C.success}35` },
  statCardWarning: { flex: 1, borderRadius: 12, padding: 12, alignItems: 'center', gap: 4, backgroundColor: `${C.warning}12`, borderWidth: 1, borderColor: `${C.warning}35` },
  statValue: { fontSize: 16, fontWeight: 'bold', color: C.text },
  statLabel: { fontSize: 10, color: C.textMuted },
  sectionTitle: { fontSize: 17, fontWeight: 'bold', marginTop: 24, marginBottom: 8, marginHorizontal: 20, color: C.gold, letterSpacing: 1.2, textTransform: 'uppercase' },
  profileBtn: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, marginTop: 12, borderRadius: 12, padding: 14, gap: 10, borderWidth: 1, backgroundColor: `${C.card}DD`, borderColor: `${C.gold}35` },
  profileBtnText: { flex: 1, fontSize: 14, fontWeight: '500', color: C.textLight },
  spacer: { height: 40 },
});
