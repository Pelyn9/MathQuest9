import { View, ScrollView, StyleSheet, Switch, Pressable, TouchableOpacity, Animated } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { SHADOWS } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { BADGES, getPlayerTitle, getXPProgress, getFullDisplayTitle, getUnlockedTitles, DIFFICULTY } from '../utils/gameLogic';
import { soundManager } from '../utils/SoundManager';
import ScreenBackground from '../components/ScreenBackground';

const DIFF_ORDER = ['easy', 'normal', 'hard', 'extreme'];

export default function ProfileScreen({ navigation }) {
  const { colors: C } = useTheme();
  const { showToast } = useToast();
  const { state, playerLevel, setDifficulty, setSoundEnabled } = useGame();
  const activeDifficulty = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
  const styles = useMemo(() => createStyles(C, activeDifficulty.color), [C, activeDifficulty.color]);

  const diffAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    diffAnim.setValue(0);
    Animated.timing(diffAnim, {
      toValue: 1, duration: 400, useNativeDriver: false,
    }).start();
  }, [state.difficulty, diffAnim]);

  const allBadges = Object.values(BADGES);
  const earnedCount = allBadges.filter(b => state.badges.includes(b.id)).length;
  const { currentXP, neededXP } = getXPProgress(state.xp);
  const title = getPlayerTitle(playerLevel);
  const fullTitle = getFullDisplayTitle(playerLevel, state.badges || []);
  const unlockedTitles = getUnlockedTitles(state.badges || []);
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

  const renderStat = ({ icon, label, value, color, detail }) => (
    <View style={[styles.statCard, { borderColor: `${color}55` }]}>
      <View style={[styles.statIcon, { backgroundColor: `${color}18` }]}>
        <Ionicons name={icon} size={20} color={color} />
      </View>
      <View style={styles.statCopy}>
        <AppText style={styles.statValue}>{value}</AppText>
        <AppText style={styles.statLabel}>{label}</AppText>
        {detail}
      </View>
    </View>
  );

  const heartDetail = (
    <View style={styles.heartRow}>
      {Array.from({ length: state.maxLives || 3 }, (_, i) => (
        <Ionicons
          key={i}
          name={i < state.lives ? 'heart' : 'heart-outline'}
          size={13}
          color={i < state.lives ? C.heart : C.textMuted}
        />
      ))}
    </View>
  );

  const diffBgColor = diffAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.card, activeDifficulty.color],
  });

  return (
    <View style={styles.wrapper}>
      <ScreenBackground preset="profile" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <Animated.View style={[styles.heroAccent, { backgroundColor: activeDifficulty.color }]} />
        <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate('Shop')}>
          <Ionicons name="cart-outline" size={20} color={C.white} />
          <AppText style={styles.shopText}>Shop</AppText>
        </TouchableOpacity>

        <View style={styles.avatarWrap}>
          <View style={[styles.avatarCircle, { backgroundColor: activeDifficulty.color }]}>
            <Ionicons name={activeAvatar.icon} size={38} color={C.white} />
          </View>
        </View>
        <AppText style={styles.heroName} decorative>{activeAvatar.name}</AppText>
        <AppText style={styles.heroTitle}>Level {playerLevel} {title}</AppText>

        <View style={[styles.difficultyPill, { backgroundColor: `${activeDifficulty.color}26`, borderColor: activeDifficulty.color }]}>
          <Ionicons name={activeDifficulty.icon} size={15} color={activeDifficulty.color} />
          <AppText style={[styles.difficultyPillText, { color: activeDifficulty.color }]}>{activeDifficulty.label} Mode</AppText>
        </View>
      </View>

      <View style={[styles.xpPanel, { borderColor: `${activeDifficulty.color}40` }]}>
        <View style={styles.xpTop}>
          <View>
            <AppText style={styles.panelEyebrow}>Hero Progress</AppText>
            <AppText style={styles.panelTitle} decorative>{state.xp} XP</AppText>
          </View>
          <View style={[styles.levelBadge, { backgroundColor: `${activeDifficulty.color}18` }]}>
            <Ionicons name="sparkles" size={15} color={activeDifficulty.color} />
            <AppText style={[styles.levelBadgeText, { color: activeDifficulty.color }]}>Lv. {playerLevel}</AppText>
          </View>
        </View>
        <View style={styles.xpTrack}>
          <View style={[styles.xpFill, { width: `${xpPct}%`, backgroundColor: activeDifficulty.color }]} />
        </View>
        <AppText style={styles.xpDetail}>{currentXP}/{neededXP} XP to next level</AppText>
      </View>

      <View style={styles.statsGrid}>
        {renderStat({ icon: 'cash-outline', label: 'Coins', value: state.coins, color: C.gold })}
        {renderStat({ icon: 'heart', label: 'Lives', value: `${state.lives}/${state.maxLives}`, color: C.heart, detail: heartDetail })}
        {renderStat({ icon: 'checkmark-done', label: 'Accuracy', value: `${accuracy}%`, color: C.success })}
        {renderStat({ icon: 'flame', label: 'Best Streak', value: state.longestStreak, color: C.warning })}
      </View>

      <View style={styles.sectionHeader}>
        <Ionicons name="options" size={17} color={activeDifficulty.color} />
        <AppText style={styles.sectionTitle} decorative>Difficulty Theme</AppText>
        <View style={[styles.sectionPill, { backgroundColor: `${activeDifficulty.color}20` }]}>
          <AppText style={[styles.sectionPillText, { color: activeDifficulty.color }]}>{activeDifficulty.label}</AppText>
        </View>
      </View>
      <View style={styles.diffGrid}>
        {DIFF_ORDER.map((key) => {
          const d = DIFFICULTY[key];
          const active = state.difficulty === key;
          return (
            <Pressable
              key={key}
              onPress={() => handleDifficultyChange(key)}
              style={({ pressed }) => [
                styles.diffOption,
                { borderColor: active ? d.color : C.cardBorder, backgroundColor: active ? d.color : `${d.color}10` },
                pressed && styles.pressed,
              ]}
            >
              <View style={[styles.diffIcon, { backgroundColor: active ? 'rgba(255,255,255,0.22)' : `${d.color}20` }]}>
                <Ionicons name={d.icon} size={19} color={active ? C.white : d.color} />
              </View>
              <View style={styles.diffCopy}>
                <AppText style={[styles.diffLabel, { color: active ? C.white : d.color }]}>{d.label}</AppText>
                <AppText style={[styles.diffDesc, { color: active ? 'rgba(255,255,255,0.82)' : C.textMuted }]}>{d.desc}</AppText>
              </View>
              {active && <View style={[styles.diffCheck, { backgroundColor: 'rgba(255,255,255,0.25)' }]}>
                <Ionicons name="checkmark" size={16} color={C.white} />
              </View>}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.sectionHeader}>
        <Ionicons name="settings-outline" size={17} color={C.textLight} />
        <AppText style={styles.sectionTitle} decorative>Settings</AppText>
      </View>
      <View style={styles.settingsPanel}>
        <View style={styles.settingRow}>
          <View style={styles.settingLeft}>
            <View style={[styles.settingIcon, { backgroundColor: `${C.secondary}20` }]}>
              <Ionicons name={state.soundEnabled ? 'volume-high' : 'volume-mute'} size={18} color={C.secondary} />
            </View>
            <View>
              <AppText style={styles.settingLabel}>Sound</AppText>
              <AppText style={styles.settingHint}>{state.soundEnabled ? 'Effects enabled' : 'Muted'}</AppText>
            </View>
          </View>
          <Switch
            value={state.soundEnabled}
            onValueChange={handleSoundChange}
            trackColor={{ false: C.backgroundLight, true: `${C.secondary}75` }}
            thumbColor={state.soundEnabled ? C.secondary : C.textMuted}
          />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Ionicons name="analytics" size={17} color={C.info} />
        <AppText style={styles.sectionTitle} decorative>Assessment</AppText>
      </View>
      <View style={styles.assessmentPanel}>
        <Pressable style={({ pressed }) => [styles.assessmentRow, pressed && styles.pressed]} onPress={() => navigation.navigate('Assessment', { type: 'pre' })}>
          <View style={styles.assessmentLeft}>
            <Ionicons name="document-text-outline" size={19} color={C.info} />
            <AppText style={styles.assessmentLabel}>Pre-Test</AppText>
          </View>
          <AppText style={[styles.assessmentScore, { color: state.preTestScore !== null ? C.success : C.textMuted }]}>
            {state.preTestScore !== null ? `${state.preTestScore}%` : 'Not taken'}
          </AppText>
          <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
        </Pressable>
        <View style={styles.settingsDivider} />
        <Pressable style={({ pressed }) => [styles.assessmentRow, pressed && styles.pressed]} onPress={() => navigation.navigate('Assessment', { type: 'post' })}>
          <View style={styles.assessmentLeft}>
            <Ionicons name="document-text-outline" size={19} color={C.warning} />
            <AppText style={styles.assessmentLabel}>Post-Test</AppText>
          </View>
          <AppText style={[styles.assessmentScore, { color: state.postTestScore !== null ? C.success : C.textMuted }]}>
            {state.postTestScore !== null ? `${state.postTestScore}%` : 'Not taken'}
          </AppText>
          <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
        </Pressable>
        {state.preTestScore !== null && state.postTestScore !== null && (
          <>
            <View style={styles.settingsDivider} />
            <View style={styles.assessmentRow}>
              <View style={styles.assessmentLeft}>
                <Ionicons name="trending-up" size={19} color={C.success} />
                <AppText style={styles.assessmentLabel}>Improvement</AppText>
              </View>
              <AppText style={[styles.assessmentScore, { color: C.success }]}>+{Math.max(0, state.postTestScore - state.preTestScore)}%</AppText>
            </View>
          </>
        )}
      </View>

      <View style={styles.sectionHeader}>
        <Ionicons name="trophy" size={17} color={C.gold} />
        <AppText style={styles.sectionTitle} decorative>Badges ({earnedCount}/{allBadges.length})</AppText>
      </View>
      {earnedCount > 0 ? (
        <View style={styles.badgeGrid}>
          {allBadges.map((badge) => {
            const earned = state.badges.includes(badge.id);
            return (
              <View key={badge.id} style={[styles.badgeCard, { borderColor: earned ? C.gold : C.cardBorder }]}>
                <View style={[styles.badgeIconWrap, { backgroundColor: earned ? `${C.gold}20` : C.backgroundLight }]}>
                  <Ionicons name={earned ? badge.icon : 'lock-closed'} size={20} color={earned ? C.gold : C.textMuted} />
                </View>
                <AppText style={[styles.badgeName, !earned && { color: C.textMuted }]} numberOfLines={2}>{badge.name}</AppText>
                <AppText style={styles.badgeDesc} numberOfLines={3}>{badge.desc}</AppText>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyBadges}>
          <Ionicons name="trophy-outline" size={40} color={C.textMuted} />
          <AppText style={styles.emptyBadgesText}>Complete levels to earn badges</AppText>
        </View>
      )}
    </ScrollView>
    </View>
  );
}

const createStyles = (C, accent) => StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  content: {
    width: '100%', maxWidth: 940, alignSelf: 'center',
    paddingHorizontal: 16, paddingTop: 16, paddingBottom: 110,
  },
  hero: {
    position: 'relative', alignItems: 'center', overflow: 'hidden',
    borderRadius: 18, paddingTop: 46, paddingHorizontal: 20, paddingBottom: 24,
    backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder,
    shadowColor: C.black, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12, shadowRadius: 16, elevation: 4,
  },
  heroAccent: {
    position: 'absolute', top: 0, left: 0, right: 0, height: 7,
  },
  shopBtn: {
    position: 'absolute', top: 20, right: 16, minHeight: 36, borderRadius: 18,
    paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: accent,
  },
  shopText: { color: C.white, fontSize: 12, fontWeight: '800' },
  avatarWrap: {
    width: 94, height: 94, borderRadius: 47, justifyContent: 'center', alignItems: 'center',
    backgroundColor: `${accent}18`, borderWidth: 1, borderColor: `${accent}55`,
  },
  avatarCircle: {
    width: 74, height: 74, borderRadius: 37, justifyContent: 'center', alignItems: 'center',
  },
  heroName: {
    color: C.text, fontSize: 24, lineHeight: 30, fontWeight: '900', marginTop: 14, textAlign: 'center',
  },
  heroTitle: {
    color: C.textMuted, fontSize: 14, fontWeight: '700', marginTop: 3, textAlign: 'center',
  },
  difficultyPill: {
    marginTop: 14, minHeight: 34, borderRadius: 17, borderWidth: 1,
    paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 7,
  },
  difficultyPillText: { fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  xpPanel: {
    marginTop: 14, borderRadius: 16, padding: 16, backgroundColor: C.card,
    borderWidth: 1, borderColor: C.cardBorder,
  },
  xpTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  panelEyebrow: { color: C.textMuted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  panelTitle: { color: C.text, fontSize: 22, fontWeight: '900', marginTop: 2 },
  levelBadge: { minHeight: 34, borderRadius: 17, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 6 },
  levelBadgeText: { fontSize: 12, fontWeight: '900' },
  xpTrack: { height: 10, backgroundColor: C.backgroundLight, borderRadius: 5, overflow: 'hidden', marginTop: 14 },
  xpFill: { height: '100%', borderRadius: 5 },
  xpDetail: { color: C.textMuted, fontSize: 12, fontWeight: '600', marginTop: 8 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 12 },
  statCard: {
    width: '48%', minHeight: 92, borderRadius: 14, padding: 12, borderWidth: 1,
    borderColor: C.cardBorder, backgroundColor: C.card, flexDirection: 'row', alignItems: 'center', gap: 10,
    ...SHADOWS.small,
  },
  statIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  statCopy: { flex: 1, minWidth: 0 },
  statValue: { color: C.text, fontSize: 18, lineHeight: 23, fontWeight: '900' },
  statLabel: { color: C.textMuted, fontSize: 11, fontWeight: '800', marginTop: 1 },
  heartRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 1, marginTop: 5 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 7, marginTop: 22, marginBottom: 10 },
  sectionTitle: { color: C.text, fontSize: 16, fontWeight: '900' },
  sectionPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  sectionPillText: { fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  diffGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  diffOption: {
    width: '48%', minHeight: 74, borderRadius: 14, borderWidth: 1.5,
    padding: 12, flexDirection: 'row', alignItems: 'center', gap: 10,
  },
  diffIcon: { width: 38, height: 38, borderRadius: 11, justifyContent: 'center', alignItems: 'center' },
  diffCopy: { flex: 1, minWidth: 0 },
  diffLabel: { fontSize: 14, fontWeight: '900' },
  diffDesc: { fontSize: 11, fontWeight: '700', marginTop: 2 },
  diffCheck: { width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  pressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
  settingsPanel: { borderRadius: 16, padding: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder },
  settingRow: { minHeight: 58, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  settingIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  settingLabel: { color: C.text, fontSize: 14, fontWeight: '900' },
  settingHint: { color: C.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 },
  settingsDivider: { height: 1, backgroundColor: C.backgroundLight, marginVertical: 8 },
  assessmentPanel: { borderRadius: 16, padding: 14, backgroundColor: C.card, borderWidth: 1, borderColor: C.cardBorder },
  assessmentRow: { minHeight: 46, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 10 },
  assessmentLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 9 },
  assessmentLabel: { color: C.textLight, fontSize: 14, fontWeight: '800' },
  assessmentScore: { fontSize: 13, fontWeight: '900' },
  badgeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  badgeCard: {
    width: '48%', minHeight: 126, borderRadius: 14, padding: 12, borderWidth: 1,
    alignItems: 'center', backgroundColor: C.card,
  },
  badgeIconWrap: { width: 42, height: 42, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  badgeName: { color: C.text, fontSize: 12, lineHeight: 15, fontWeight: '900', textAlign: 'center', marginBottom: 4 },
  badgeDesc: { color: C.textMuted, fontSize: 10, lineHeight: 14, textAlign: 'center' },
  emptyBadges: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  emptyBadgesText: { color: C.textMuted, fontSize: 14, fontWeight: '600' },
});
