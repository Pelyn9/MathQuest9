import { View, ScrollView, StyleSheet, Switch, Pressable, TouchableOpacity, Platform } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useMemo } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { BADGES, getPlayerTitle, getXPProgress, DIFFICULTY } from '../utils/gameLogic';
import { soundManager } from '../utils/SoundManager';
import ScreenBackground from '../components/ScreenBackground';

const DIFF_ORDER = ['easy', 'normal', 'hard', 'extreme'];
const FANTASY_FONT = Platform.OS === 'ios' ? 'Times New Roman' : 'serif';

export default function ProfileScreen({ navigation }) {
  const { colors: C } = useTheme();
  const { showToast } = useToast();
  const { state, playerLevel, setDifficulty, setSoundEnabled } = useGame();
  const activeDifficulty = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
  const accent = activeDifficulty.color;
  const styles = useMemo(() => createStyles(C, accent), [C, accent]);

  const allBadges = Object.values(BADGES);
  const earnedCount = allBadges.filter(b => state.badges.includes(b.id)).length;
  const { currentXP, neededXP } = getXPProgress(state.xp);
  const title = getPlayerTitle(playerLevel);
  const xpPct = Math.min((currentXP / neededXP) * 100, 100);
  const accuracy = state.totalAnswered > 0 ? Math.round((state.totalCorrect / state.totalAnswered) * 100) : 0;

  const avatars = [
    { name: 'Math Knight', icon: 'shield-checkmark' },
    { name: 'Number Ninja', icon: 'flash' },
    { name: 'Geo Explorer', icon: 'compass' },
    { name: 'Function Pro', icon: 'trending-up' },
    { name: 'Blazing Hero', icon: 'flame' },
    { name: 'Trader Tycoon', icon: 'cash' },
    { name: 'Extreme Survivor', icon: 'skull' },
    { name: "Numeria's Savior", icon: 'crown' },
    { name: 'Ancient Hero', icon: 'star' },
    { name: 'Golden Sage', icon: 'ribbon' },
  ];
  const activeAvatar = avatars[state.avatarIndex] || avatars[0];

  const handleSoundChange = useCallback((enabled) => {
    soundManager.setEnabled(enabled);
    setSoundEnabled(enabled);
    if (enabled) soundManager.play('click');
    showToast(enabled ? 'Sound enabled' : 'Sound muted', 'info', enabled ? 'volume-high' : 'volume-mute');
  }, [setSoundEnabled, showToast]);

  const handleDifficultyChange = useCallback((key) => {
    if (key === state.difficulty) return;
    const next = DIFFICULTY[key] || DIFFICULTY.normal;
    setDifficulty(key);
    soundManager.play('click');
    showToast(`${next.label} difficulty equipped`, 'info', next.icon);
  }, [setDifficulty, showToast, state.difficulty]);

  return (
    <View style={styles.screen}>
      <ScreenBackground preset="profile" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ═══════════════════════════════════════
            CHARACTER PORTRAIT · HERO BANNER
           ═══════════════════════════════════════ */}
        <View style={styles.heroParchment} pointerEvents="box-none">
          {/* ornate corner flourishes */}
          <Ionicons name="leaf" size={14} color={`${accent}55`} style={styles.cornerTL} pointerEvents="none" />
          <Ionicons name="leaf" size={14} color={`${accent}55`} style={styles.cornerTR} pointerEvents="none" />
          <Ionicons name="leaf" size={14} color={`${accent}55`} style={styles.cornerBL} pointerEvents="none" />
          <Ionicons name="leaf" size={14} color={`${accent}55`} style={styles.cornerBR} pointerEvents="none" />

          {/* level ribbon */}
          <View style={[styles.levelRibbon, { backgroundColor: accent }]} pointerEvents="none">
            <MaterialCommunityIcons name="star-four-points" size={10} color={C.white} />
            <AppText style={styles.levelRibbonText}>LV.{playerLevel}</AppText>
          </View>

          {/* merchant / shop button (top right) */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Shop')}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={styles.merchantBtn}
          >
            <MaterialCommunityIcons name="swap-horizontal-bold" size={16} color={C.white} />
            <AppText style={styles.merchantLabel}>Shop</AppText>
          </TouchableOpacity>

          {/* portrait with ornate frame */}
          <View style={styles.portraitFrame}>
            <View style={[styles.portraitOuter, { borderColor: C.gold }]}>
              <View style={[styles.portraitInner, { backgroundColor: `${accent}20` }]}>
                <Ionicons name={activeAvatar.icon} size={42} color={accent} />
              </View>
            </View>
          </View>

          <AppText style={styles.heroTitle}>{activeAvatar.name}</AppText>
          <AppText style={styles.heroSubtitle}>&#8216;{title}&#8217;</AppText>

          {/* class / rank divider */}
          <View style={styles.dividerLine}>
            <View style={[styles.dividerOrnament, { backgroundColor: `${accent}30` }]} />
            <MaterialCommunityIcons name="diamond" size={8} color={accent} />
            <View style={[styles.dividerOrnament, { backgroundColor: `${accent}30` }]} />
          </View>

          {/* quick stat row */}
          <View style={styles.quickStats}>
            <View style={styles.quickStat}>
              <Ionicons name="cash-outline" size={13} color={C.gold} />
              <AppText style={[styles.quickStatValue, { color: C.gold }]}>{state.coins}</AppText>
            </View>
            <View style={styles.quickStat}>
              <Ionicons name="heart" size={13} color={C.heart} />
              <AppText style={[styles.quickStatValue, { color: C.heart }]}>{state.lives}/{state.maxLives}</AppText>
            </View>
            <View style={styles.quickStat}>
              <Ionicons name="flame" size={13} color={C.warning} />
              <AppText style={[styles.quickStatValue, { color: C.warning }]}>{state.longestStreak}</AppText>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════
            EXPERIENCE BAR
           ═══════════════════════════════════════ */}
        <View style={styles.parchmentCard}>
          <View style={styles.expHeader}>
            <MaterialCommunityIcons name="lightning-bolt" size={14} color={accent} />
            <AppText style={styles.expLabel}>Experience</AppText>
            <AppText style={styles.expCount}>{state.xp} XP</AppText>
          </View>
          <View style={styles.expTrackBg}>
            <View style={[styles.expTrackFill, { width: `${xpPct}%`, backgroundColor: accent }]} />
            <View style={[styles.expGlow, { backgroundColor: accent, shadowColor: accent }]} />
          </View>
          <AppText style={styles.expDetail}>{currentXP} / {neededXP} to next level</AppText>
        </View>

        {/* ═══════════════════════════════════════
            ATTRIBUTES · STAT BLOCK
           ═══════════════════════════════════════ */}
        <View style={styles.parchmentCard}>
          <View style={styles.attrGrid}>
            <View style={styles.attrCell}>
              <MaterialCommunityIcons name="sword-cross" size={16} color={C.warning} />
              <AppText style={[styles.attrValue, { color: C.text }]}>STR</AppText>
              <AppText style={styles.attrNumber}>{state.longestStreak}</AppText>
            </View>
            <View style={styles.attrCell}>
              <MaterialCommunityIcons name="target" size={16} color={C.success} />
              <AppText style={[styles.attrValue, { color: C.text }]}>ACC</AppText>
              <AppText style={styles.attrNumber}>{accuracy}%</AppText>
            </View>
            <View style={styles.attrCell}>
              <MaterialCommunityIcons name="shield-star" size={16} color={C.gold} />
              <AppText style={[styles.attrValue, { color: C.text }]}>DEF</AppText>
              <AppText style={styles.attrNumber}>{state.lives}</AppText>
            </View>
            <View style={styles.attrCell}>
              <MaterialCommunityIcons name="run-fast" size={16} color={C.info} />
              <AppText style={[styles.attrValue, { color: C.text }]}>SPD</AppText>
              <AppText style={styles.attrNumber}>{state.totalAnswered}</AppText>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════
            DIFFICULTY · EQUIPMENT SLOTS
           ═══════════════════════════════════════ */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="axe" size={14} color={C.textMuted} />
          <AppText style={styles.sectionLabel}>Equip Difficulty</AppText>
        </View>
        <View style={styles.diffGrid}>
          {DIFF_ORDER.map((key) => {
            const d = DIFFICULTY[key];
            const active = state.difficulty === key;
            return (
              <Pressable
                key={key}
                onPress={() => handleDifficultyChange(key)}
                style={[
                  styles.diffSlot,
                  active
                    ? { backgroundColor: d.color, borderColor: C.gold }
                    : { backgroundColor: `${C.card}`, borderColor: C.cardBorder },
                ]}
              >
                {active && <MaterialCommunityIcons name="crown" size={10} color={C.white} style={styles.diffCrown} />}
                <Ionicons name={d.icon} size={16} color={active ? C.white : d.color} />
                <AppText style={[styles.diffSlotLabel, { color: active ? C.white : C.text }]}>
                  {d.label}
                </AppText>
              </Pressable>
            );
          })}
        </View>

        {/* ═══════════════════════════════════════
            QUEST LOG · ASSESSMENT
           ═══════════════════════════════════════ */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="scroll-outline" size={14} color={C.textMuted} />
          <AppText style={styles.sectionLabel}>Quest Log</AppText>
        </View>
        <View style={styles.scrollCard}>
          <Pressable style={styles.questRow} onPress={() => navigation.navigate('Assessment', { type: 'pre' })}>
            <View style={[styles.questMarker, { borderColor: `${C.info}55` }]}>
              <Ionicons name="document-text-outline" size={14} color={C.info} />
            </View>
            <View style={styles.questInfo}>
              <AppText style={styles.questName}>The Beginning</AppText>
              <AppText style={styles.questHint}>Pre-Test Assessment</AppText>
            </View>
            <AppText style={[styles.questScore, { color: state.preTestScore !== null ? C.success : C.textMuted }]}>
              {state.preTestScore !== null ? `${state.preTestScore}%` : 'Pending'}
            </AppText>
          </Pressable>
          <View style={styles.questDivider} />
          <Pressable style={styles.questRow} onPress={() => navigation.navigate('Assessment', { type: 'post' })}>
            <View style={[styles.questMarker, { borderColor: `${C.warning}55` }]}>
              <Ionicons name="document-text-outline" size={14} color={C.warning} />
            </View>
            <View style={styles.questInfo}>
              <AppText style={styles.questName}>The Final Stand</AppText>
              <AppText style={styles.questHint}>Post-Test Assessment</AppText>
            </View>
            <AppText style={[styles.questScore, { color: state.postTestScore !== null ? C.success : C.textMuted }]}>
              {state.postTestScore !== null ? `${state.postTestScore}%` : 'Pending'}
            </AppText>
          </Pressable>
          {state.preTestScore !== null && state.postTestScore !== null && (
            <>
              <View style={styles.questDivider} />
              <View style={styles.questRow}>
                <View style={[styles.questMarker, { borderColor: `${C.success}55` }]}>
                  <Ionicons name="trending-up" size={14} color={C.success} />
                </View>
                <View style={styles.questInfo}>
                  <AppText style={styles.questName}>Growth</AppText>
                  <AppText style={styles.questHint}>Improvement</AppText>
                </View>
                <AppText style={[styles.questScore, { color: C.success }]}>
                  +{Math.max(0, state.postTestScore - state.preTestScore)}%
                </AppText>
              </View>
            </>
          )}
        </View>

        {/* ═══════════════════════════════════════
            TROPHY HALL · BADGES
           ═══════════════════════════════════════ */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="trophy-award" size={14} color={C.textMuted} />
          <AppText style={styles.sectionLabel}>Trophy Hall · {earnedCount}/{allBadges.length}</AppText>
        </View>
        {earnedCount > 0 ? (
          <View style={styles.trophyGrid}>
            {allBadges.map((badge) => {
              const earned = state.badges.includes(badge.id);
              return (
                <View key={badge.id} style={[styles.trophyItem, earned && { borderColor: C.gold }]}>
                  <View style={[styles.trophyIconWrap, earned && { backgroundColor: `${C.gold}14` }]}>
                    <Ionicons
                      name={earned ? badge.icon : 'lock-closed'}
                      size={18}
                      color={earned ? C.gold : `${C.textMuted}50`}
                    />
                  </View>
                  <AppText style={[styles.trophyName, !earned && { color: `${C.textMuted}77` }]} numberOfLines={1}>
                    {badge.name}
                  </AppText>
                  {!earned && <MaterialCommunityIcons name="lock" size={8} color={`${C.textMuted}44`} style={styles.trophyLock} />}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyTrophy}>
            <MaterialCommunityIcons name="trophy-outline" size={28} color={`${C.textMuted}44`} />
            <AppText style={styles.emptyText}>Complete quests to earn trophies</AppText>
          </View>
        )}

        {/* ═══════════════════════════════════════
            REST AREA · SETTINGS
           ═══════════════════════════════════════ */}
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="campfire" size={14} color={C.textMuted} />
          <AppText style={styles.sectionLabel}>Rest Area</AppText>
        </View>
        <View style={styles.scrollCard}>
          <View style={styles.questRow}>
            <View style={[styles.questMarker, { borderColor: `${C.secondary}55` }]}>
              <Ionicons name={state.soundEnabled ? 'volume-high' : 'volume-mute'} size={14} color={C.secondary} />
            </View>
            <View style={styles.questInfo}>
              <AppText style={styles.questName}>Sound</AppText>
              <AppText style={styles.questHint}>{state.soundEnabled ? 'Effects enabled' : 'Muted'}</AppText>
            </View>
            <Switch
              value={state.soundEnabled}
              onValueChange={handleSoundChange}
              trackColor={{ false: C.backgroundLight, true: `${C.secondary}55` }}
              thumbColor={state.soundEnabled ? C.secondary : C.textMuted}
              style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
            />
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const createStyles = (C, accent) => StyleSheet.create({
  screen: { flex: 1 },
  scroll: {
    width: '100%', maxWidth: 480, alignSelf: 'center',
    paddingHorizontal: 16, paddingTop: 24, paddingBottom: 110,
  },

  /* ── HERO PARCHMENT ── */
  heroParchment: {
    backgroundColor: C.card, borderRadius: 24, borderWidth: 1.5, borderColor: C.gold,
    paddingTop: 18, paddingHorizontal: 20, paddingBottom: 18,
    marginBottom: 14, position: 'relative', overflow: 'visible',
    shadowColor: C.gold, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 6,
  },
  cornerTL: { position: 'absolute', top: 6, left: 8, transform: [{ rotate: '-45deg' }] },
  cornerTR: { position: 'absolute', top: 6, right: 8, transform: [{ rotate: '45deg' }] },
  cornerBL: { position: 'absolute', bottom: 6, left: 8, transform: [{ rotate: '45deg' }] },
  cornerBR: { position: 'absolute', bottom: 6, right: 8, transform: [{ rotate: '-45deg' }] },

  levelRibbon: {
    position: 'absolute', top: 18, left: -4,
    paddingVertical: 4, paddingHorizontal: 12, borderRadius: 10,
    borderTopLeftRadius: 4, borderBottomLeftRadius: 4,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    shadowColor: accent, shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.4, shadowRadius: 4, elevation: 4,
  },
  levelRibbonText: { color: '#FFF', fontSize: 11, fontWeight: '900', letterSpacing: 1 },

  merchantBtn: {
    position: 'absolute', top: 14, right: 10, zIndex: 99,
    borderRadius: 16, paddingVertical: 6, paddingHorizontal: 12,
    backgroundColor: `${accent}CC`,
    flexDirection: 'row', alignItems: 'center', gap: 4,
    shadowColor: accent, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5, shadowRadius: 5, elevation: 5,
    minWidth: 60,
  },
  merchantLabel: { color: '#FFF', fontSize: 11, fontWeight: '800' },

  portraitFrame: { alignItems: 'center', marginTop: 8 },
  portraitOuter: {
    width: 86, height: 86, borderRadius: 43, borderWidth: 2.5,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: C.card, shadowColor: C.gold,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 6,
  },
  portraitInner: {
    width: 68, height: 68, borderRadius: 34,
    justifyContent: 'center', alignItems: 'center',
  },

  heroTitle: {
    fontFamily: FANTASY_FONT, color: C.text, fontSize: 22, fontWeight: '900',
    textAlign: 'center', marginTop: 10, letterSpacing: 0.5,
  },
  heroSubtitle: {
    fontFamily: FANTASY_FONT, color: C.textMuted, fontSize: 14, fontStyle: 'italic',
    textAlign: 'center', marginTop: 2,
  },

  dividerLine: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 12, marginBottom: 10, paddingHorizontal: 40,
  },
  dividerOrnament: { flex: 1, height: 1.5, borderRadius: 1 },

  quickStats: {
    flexDirection: 'row', justifyContent: 'center', gap: 20,
  },
  quickStat: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  quickStatValue: { fontSize: 13, fontWeight: '800' },

  /* ── PARCHMENT CARD ── */
  parchmentCard: {
    backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.cardBorder,
    padding: 14, marginBottom: 14,
    shadowColor: C.black, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 10, elevation: 3,
  },

  /* ── EXP BAR ── */
  expHeader: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  expLabel: { color: C.textMuted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6, flex: 1 },
  expCount: { color: C.text, fontSize: 13, fontWeight: '800' },
  expTrackBg: {
    height: 10, backgroundColor: C.backgroundLight, borderRadius: 5,
    overflow: 'visible', marginTop: 10, position: 'relative',
  },
  expTrackFill: { height: '100%', borderRadius: 5 },
  expGlow: {
    position: 'absolute', right: -4, top: -3,
    width: 16, height: 16, borderRadius: 8,
    opacity: 0.5, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 8,
  },
  expDetail: { color: C.textMuted, fontSize: 11, fontWeight: '600', marginTop: 7 },

  /* ── ATTRIBUTES ── */
  attrGrid: { flexDirection: 'row', gap: 8 },
  attrCell: {
    flex: 1, borderRadius: 12, borderWidth: 1, borderColor: C.cardBorder,
    paddingVertical: 10, alignItems: 'center', gap: 3,
    backgroundColor: C.cardLight,
  },
  attrValue: { fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  attrNumber: { color: C.textMuted, fontSize: 14, fontWeight: '800' },

  /* ── SECTION HEADER ── */
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  sectionLabel: {
    color: C.text, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6,
  },

  /* ── DIFFICULTY SLOTS ── */
  diffGrid: { flexDirection: 'row', gap: 6, marginBottom: 18 },
  diffSlot: {
    flex: 1, borderRadius: 12, borderWidth: 1.5,
    paddingVertical: 10, alignItems: 'center', gap: 5, position: 'relative',
  },
  diffCrown: { position: 'absolute', top: -6, right: -4 },
  diffSlotLabel: { fontSize: 9, fontWeight: '800' },

  /* ── SCROLL / QUEST CARD ── */
  scrollCard: {
    borderRadius: 14, borderWidth: 1, borderColor: C.cardBorder,
    backgroundColor: C.card, paddingHorizontal: 14, paddingVertical: 4,
    marginBottom: 18,
  },
  questRow: {
    minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  questMarker: {
    width: 32, height: 32, borderRadius: 8, borderWidth: 1,
    justifyContent: 'center', alignItems: 'center',
  },
  questInfo: { flex: 1 },
  questName: { color: C.text, fontSize: 13, fontWeight: '800' },
  questHint: { color: C.textMuted, fontSize: 10, fontWeight: '600', marginTop: 1 },
  questScore: { fontSize: 12, fontWeight: '800' },
  questDivider: { height: 1, backgroundColor: C.backgroundLight },

  /* ── TROPHY HALL ── */
  trophyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  trophyItem: {
    width: '30.5%', borderRadius: 10, borderWidth: 1, borderColor: C.cardBorder,
    backgroundColor: C.card, paddingVertical: 10, alignItems: 'center', gap: 4,
  },
  trophyIconWrap: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  trophyName: { color: C.text, fontSize: 9, fontWeight: '700', textAlign: 'center', paddingHorizontal: 4 },
  trophyLock: { position: 'absolute', top: 5, right: 6 },
  emptyTrophy: { alignItems: 'center', paddingVertical: 20, marginBottom: 18, gap: 8 },
  emptyText: { color: C.textMuted, fontSize: 12, fontWeight: '600', textAlign: 'center' },
});