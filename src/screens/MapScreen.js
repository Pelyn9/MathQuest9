import React, { useMemo } from 'react';
import { View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { useGame } from '../context/GameContext';
import {
  PLAY_MODES,
  STORY_MISSIONS,
  MISSION_REGIONS,
  getDifficultyMissionProgress,
  getDifficultyMissionStory,
  getMissionStats,
  getNextMissionId,
  getMissionStars,
  getStoryDifficultyPath,
  isMissionCompleted,
  isMissionUnlocked,
} from '../data/storyMissions';
import ScreenBackground from '../components/ScreenBackground';

export default function MapScreen({ navigation }) {
  const { colors: C } = useTheme();
  const styles = useMemo(() => createStyles(C), [C]);
  const { state, playerLevel } = useGame();
  const activeMode = PLAY_MODES[state.activeMode || 'story'] || PLAY_MODES.story;
  const storyPath = getStoryDifficultyPath(state.difficulty);
  const missionProgress = getDifficultyMissionProgress(state, state.difficulty);
  const missionStats = getMissionStats(missionProgress);
  const nextMissionId = getNextMissionId(missionProgress);

  const startMission = (mission) => {
    navigation.navigate('Quiz', {
      moduleId: mission.moduleId,
      levelId: mission.levelId,
      missionId: mission.id,
      mode: state.activeMode || 'story',
    });
  };

  const getRegionCompleteCount = (regionId) => (
    STORY_MISSIONS.filter(mission => mission.regionId === regionId && isMissionCompleted(missionProgress, mission.id)).length
  );

  return (
    <View style={styles.wrapper}>
      <ScreenBackground preset="map" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerCopy}>
            <AppText style={styles.headerTitle} decorative>Numeria Mission Map</AppText>
            <AppText style={styles.headerSubtitle}>
              {storyPath.label} - a separate 100-mission RPG path through the lost kingdom
            </AppText>
          </View>
          <View style={styles.levelBadge}>
            <Ionicons name="shield" size={14} color={C.gold} />
            <AppText style={styles.levelText}>Lv.{playerLevel}</AppText>
          </View>
        </View>

        <View style={styles.mapStats}>
          <View style={styles.mapStat}>
            <Ionicons name="flag" size={16} color={activeMode.color} />
            <AppText style={styles.mapStatValue}>{missionStats.completed}/100</AppText>
            <AppText style={styles.mapStatLabel}>Missions</AppText>
          </View>
          <View style={styles.mapStat}>
            <Ionicons name="star" size={16} color={C.gold} />
            <AppText style={styles.mapStatValue}>{missionStats.totalStars}/{missionStats.totalPossibleStars}</AppText>
            <AppText style={styles.mapStatLabel}>Stars</AppText>
          </View>
          <View style={styles.mapStat}>
            <Ionicons name={activeMode.icon} size={16} color={activeMode.color} />
            <AppText style={styles.mapStatValue}>{activeMode.label}</AppText>
            <AppText style={styles.mapStatLabel}>Mode</AppText>
          </View>
          <View style={styles.mapStat}>
            <Ionicons name={storyPath.sceneIcon} size={16} color={storyPath.color} />
            <AppText style={styles.mapStatValue}>{storyPath.label}</AppText>
            <AppText style={styles.mapStatLabel}>Route</AppText>
          </View>
        </View>
      </View>

      <View style={styles.pathWrap}>
        {STORY_MISSIONS.map((mission, idx) => {
          const unlocked = isMissionUnlocked(missionProgress, mission.id);
          const completed = isMissionCompleted(missionProgress, mission.id);
          const current = mission.id === nextMissionId && !completed;
          const stars = getMissionStars(missionProgress, mission.id);
          const region = MISSION_REGIONS.find(r => r.id === mission.regionId);
          const showRegion = idx % 25 === 0;
          const rowLeft = idx % 2 === 0;

          return (
            <View key={mission.id}>
              {showRegion && (
                <View style={[styles.regionCard, { borderColor: `${region.color}55` }]}>
                  <View style={[styles.regionIcon, { backgroundColor: `${region.color}20` }]}>
                    <Ionicons name={region.icon} size={22} color={region.color} />
                  </View>
                  <View style={styles.regionText}>
                    <AppText style={styles.regionKicker}>Chapter {region.id} / 4</AppText>
                    <AppText style={styles.regionTitle} decorative>{region.name}</AppText>
                    <AppText style={styles.regionSubtitle}>{region.title}</AppText>
                  </View>
                  <View style={styles.regionProgress}>
                    <AppText style={[styles.regionProgressValue, { color: region.color }]}>
                      {getRegionCompleteCount(region.id)}/25
                    </AppText>
                  </View>
                </View>
              )}

              <View style={[styles.missionRow, rowLeft ? styles.missionRowLeft : styles.missionRowRight]}>
                <TouchableOpacity
                  style={[
                    styles.missionNode,
                    {
                      borderColor: completed || current ? mission.color : C.cardBorder,
                      backgroundColor: unlocked ? C.card : C.backgroundLight,
                    },
                    current && { shadowColor: mission.color, shadowOpacity: 0.35, shadowRadius: 10, elevation: 5 },
                    !unlocked && styles.lockedNode,
                  ]}
                  onPress={() => unlocked && startMission(mission)}
                  disabled={!unlocked}
                  activeOpacity={0.75}
                >
                  <View style={[styles.nodeIconWrap, { backgroundColor: unlocked ? `${mission.color}20` : C.card }]}>
                    <Ionicons
                      name={completed ? 'checkmark-circle' : unlocked ? mission.icon : 'lock-closed'}
                      size={21}
                      color={completed ? C.success : unlocked ? mission.color : C.textMuted}
                    />
                  </View>
                  <AppText style={[styles.nodeNumber, { color: unlocked ? C.text : C.textMuted }]}>
                    {mission.id}
                  </AppText>
                  <View style={styles.nodeStars}>
                    {[1, 2, 3].map(star => (
                      <Ionicons
                        key={star}
                        name={star <= stars ? 'star' : 'star-outline'}
                        size={10}
                        color={star <= stars ? C.gold : C.textMuted}
                      />
                    ))}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.storyBubble,
                    {
                      borderColor: current ? `${mission.color}80` : C.cardBorder,
                      backgroundColor: unlocked ? C.card : C.backgroundLight,
                    },
                  ]}
                  onPress={() => unlocked && startMission(mission)}
                  disabled={!unlocked}
                  activeOpacity={0.75}
                >
                  <View style={styles.storyTitleRow}>
                    <AppText style={[styles.storyKicker, { color: unlocked ? mission.color : C.textMuted }]}>
                      {mission.isBoss ? 'Boss Mission' : current ? 'Current Mission' : `Mission ${mission.id}`}
                    </AppText>
                    {completed && <Ionicons name="checkmark-circle" size={14} color={C.success} />}
                  </View>
                  <AppText style={[styles.storyTitle, { color: unlocked ? C.text : C.textMuted }]} numberOfLines={1} decorative>
                    {mission.shortTitle}
                  </AppText>
                  <AppText style={styles.storyText} numberOfLines={2}>
                    {unlocked ? getDifficultyMissionStory(mission, state.difficulty) : 'Clear the previous mission on this difficulty to unlock this part of the kingdom.'}
                  </AppText>
                </TouchableOpacity>
              </View>

              {mission.id < STORY_MISSIONS.length && (
                <View style={styles.connector}>
                  <View style={[styles.connectorLine, { backgroundColor: completed ? mission.color : C.backgroundLight }]} />
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <Ionicons name="lock-closed" size={14} color={C.textMuted} />
          <AppText style={styles.legendText}>Locked</AppText>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="checkmark-circle" size={14} color={C.success} />
          <AppText style={styles.legendText}>Cleared</AppText>
        </View>
        <View style={styles.legendItem}>
          <Ionicons name="star" size={14} color={C.gold} />
          <AppText style={styles.legendText}>Stars</AppText>
        </View>
      </View>

      <View style={styles.bottomPadding} />
    </ScrollView>
    </View>
  );
}

const createStyles = (C) => StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  header: { backgroundColor: C.card, paddingHorizontal: 20, paddingTop: 50, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: C.backgroundLight },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 },
  headerCopy: { flex: 1 },
  headerTitle: { fontSize: 24, fontWeight: '900', color: C.text },
  headerSubtitle: { fontSize: 13, color: C.textMuted, marginTop: 4, lineHeight: 18 },
  levelBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: `${C.gold}20`, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  levelText: { fontSize: 12, color: C.gold, fontWeight: '900' },
  mapStats: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 16 },
  mapStat: { flexGrow: 1, flexBasis: '47%', minHeight: 62, borderRadius: 12, alignItems: 'center', justifyContent: 'center', gap: 2, backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder, shadowColor: C.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  mapStatValue: { fontSize: 13, fontWeight: '900', color: C.text },
  mapStatLabel: { fontSize: 10, color: C.textMuted },
  pathWrap: { paddingHorizontal: 16, paddingTop: 16 },
  regionCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1.5, padding: 14, marginVertical: 10, backgroundColor: C.card },
  regionIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  regionText: { flex: 1 },
  regionKicker: { fontSize: 10, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase', color: C.textMuted },
  regionTitle: { fontSize: 16, fontWeight: '900', marginTop: 2, color: C.text },
  regionSubtitle: { fontSize: 12, marginTop: 1, color: C.textMuted },
  regionProgress: { minWidth: 48, alignItems: 'center' },
  regionProgressValue: { fontSize: 13, fontWeight: '900' },
  missionRow: { flexDirection: 'row', alignItems: 'center', gap: 10, minHeight: 104 },
  missionRowLeft: { justifyContent: 'flex-start' },
  missionRowRight: { flexDirection: 'row-reverse', justifyContent: 'flex-start' },
  missionNode: { width: 82, height: 82, borderRadius: 18, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  lockedNode: { opacity: 0.58 },
  nodeIconWrap: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  nodeNumber: { fontSize: 14, fontWeight: '900', marginTop: 3 },
  nodeStars: { flexDirection: 'row', gap: 1, marginTop: 2 },
  storyBubble: { flex: 1, minHeight: 86, borderRadius: 14, borderWidth: 1, padding: 11, justifyContent: 'center' },
  storyTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  storyKicker: { fontSize: 9, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  storyTitle: { fontSize: 13, fontWeight: '900', marginTop: 3 },
  storyText: { fontSize: 11, lineHeight: 16, marginTop: 3, color: C.textMuted },
  connector: { alignItems: 'center', height: 16 },
  connectorLine: { width: 3, height: 16, borderRadius: 2 },
  legend: { flexDirection: 'row', justifyContent: 'center', gap: 18, paddingVertical: 14, marginHorizontal: 20, backgroundColor: C.card, borderRadius: 12, marginTop: 8 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendText: { fontSize: 11, color: C.textMuted },
  bottomPadding: { height: 44 },
});
