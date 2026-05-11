import { View, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { SHADOWS } from '../theme/colors';
import { useGame } from '../context/GameContext';
import { getUnlockedTitles } from '../utils/gameLogic';
import ScreenBackground from '../components/ScreenBackground';

const TABS = [
  { id: 'avatars', label: 'Avatars', icon: 'person' },
  { id: 'themes', label: 'Themes', icon: 'color-palette' },
];

const AVATARS = [
  // Achievement-based (free, unlocked via badges)
  { id: 0, name: 'Math Knight', icon: 'shield-checkmark', price: 0, type: 'achievement', unlockBadge: null },
  { id: 1, name: 'Number Ninja', icon: 'flash', price: 0, type: 'achievement', unlockBadge: 'firstSteps' },
  { id: 2, name: 'Geo Explorer', icon: 'compass', price: 0, type: 'achievement', unlockBadge: 'perfectScore' },
  { id: 3, name: 'Function Pro', icon: 'trending-up', price: 0, type: 'achievement', unlockBadge: 'moduleMaster' },
  { id: 4, name: 'Blazing Hero', icon: 'flame', price: 0, type: 'achievement', unlockBadge: 'onFire' },
  { id: 5, name: 'Trader Tycoon', icon: 'cash', price: 0, type: 'achievement', unlockBadge: 'trader' },
  { id: 6, name: 'Extreme Survivor', icon: 'skull', price: 0, type: 'achievement', unlockBadge: 'extremeSurvivor' },
  { id: 7, name: "Numeria's Savior", icon: 'crown', price: 0, type: 'achievement', unlockBadge: 'savior' },
  // Coin-purchasable avatars
  { id: 8, name: 'Ancient Hero', icon: 'star', price: 300, type: 'coin' },
  { id: 9, name: 'Golden Sage', icon: 'ribbon', price: 600, type: 'coin' },
  { id: 10, name: 'Shadow Assassin', icon: 'eye', price: 450, type: 'coin' },
  { id: 11, name: 'Crystal Mage', icon: 'diamond', price: 800, type: 'coin' },
];

const BADGE_LABELS = {
  firstSteps: 'Complete first level',
  onFire: '5 streak',
  perfectScore: '100% accuracy',
  moduleMaster: 'Clear a module',
  trader: '1000 coins',
  extremeSurvivor: 'Extreme clear',
  savior: 'All missions',
};

const THEME_PREVIEW = {
  light: ['#6C5CE7', '#F0F2F5', '#FFFFFF', '#FFD700', '#2ED573', '#FF6B8A'],
  dark: ['#6C5CE7', '#1A0F0A', '#3D2415', '#FFD700', '#66BB6A', '#FF6584'],
  forest: ['#4CAF50', '#F0F5E8', '#FFFFFF', '#D4A017', '#2ED573', '#8BC34A'],
  ocean: ['#00BCD4', '#0A0E1A', '#141C2E', '#FFD740', '#00BFA5', '#26C6DA'],
  ember: ['#FF6B35', '#1A0A05', '#3D1C10', '#FFD740', '#66BB6A', '#FF8A65'],
  midnight: ['#7C4DFF', '#0D0D2B', '#1E1E42', '#FFD740', '#00E676', '#00E5FF'],
  crimson: ['#D32F2F', '#1A0A0A', '#3D1A1A', '#FFD740', '#66BB6A', '#FF9800'],
  aurora: ['#00E676', '#0A1A2E', '#142840', '#FFD740', '#69F0AE', '#E040FB'],
  candy: ['#FF80AB', '#FFF0F5', '#FFFFFF', '#FFD740', '#69F0AE', '#B388FF'],
};

const THEMES = [
  { id: 'light', name: 'Royal Dawn', icon: 'sunny', price: 0, desc: 'Bright castle colors for daily quests.' },
  { id: 'dark', name: 'Shadow Keep', icon: 'moon', price: 250, desc: 'A darker RPG theme for night battles.' },
  { id: 'forest', name: 'Feral Woods', icon: 'leaf', price: 250, desc: 'Deep forest greens for nature lovers.' },
  { id: 'ocean', name: 'Abyssal Depths', icon: 'water', price: 250, desc: 'Dark ocean blues for deep focus.' },
  { id: 'ember', name: 'Ember Peak', icon: 'flame', price: 250, desc: 'Fiery oranges for intense battles.' },
  { id: 'midnight', name: 'Midnight Eclipse', icon: 'cloudy-night', price: 350, desc: 'Deep purples and starry blacks.' },
  { id: 'crimson', name: 'Crimson Storm', icon: 'thunderstorm', price: 350, desc: 'Bold reds and stormy grays.' },
  { id: 'aurora', name: 'Aurora Veil', icon: 'rainbow', price: 500, desc: 'Shifting northern lights palette.' },
  { id: 'candy', name: 'Candy Land', icon: 'ice-cream', price: 500, desc: 'Playful pastels for a sweet vibe.' },
];

export default function ShopScreen({ navigation }) {
  const { colors: C } = useTheme();
  const styles = useMemo(() => createStyles(C), [C]);
  const { state, addCoins, unlockAvatar, setAvatar, unlockTheme, setThemePreference } = useGame();
  const [activeTab, setActiveTab] = useState('avatars');

  const unlockedTitles = getUnlockedTitles(state.badges || []);

  const handlePurchase = (avatar) => {
    // Achievement-based avatar
    if (avatar.unlockBadge) {
      const hasBadge = state.badges.includes(avatar.unlockBadge);
      if (!hasBadge) {
        Alert.alert('Locked', `Earn the achievement to unlock: ${BADGE_LABELS[avatar.unlockBadge]}`);
        return;
      }
      if (state.avatarIndex === avatar.id) return;
      setAvatar(avatar.id);
      return;
    }

    // Free avatar
    if (avatar.price === 0) {
      setAvatar(avatar.id);
      return;
    }

    // Already owned
    const owned = state.unlockedAvatars.includes(avatar.id);
    if (owned) {
      setAvatar(avatar.id);
      return;
    }

    // Coin purchase
    if (state.coins < avatar.price) {
      Alert.alert('Not enough coins', `You need ${avatar.price - state.coins} more coins.`);
      return;
    }
    Alert.alert(
      `Buy ${avatar.name}?`,
      `This will cost ${avatar.price} coins. You have ${state.coins} coins.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy', onPress: () => {
            addCoins(-avatar.price);
            unlockAvatar(avatar.id);
            setAvatar(avatar.id);
          },
        },
      ]
    );
  };

  const handleThemePurchase = (theme) => {
    const owned = state.unlockedThemes?.includes(theme.id);
    if (owned) {
      setThemePreference(theme.id);
      return;
    }

    // Royal Dawn is free starter
    if (theme.price === 0) {
      unlockTheme(theme.id);
      setThemePreference(theme.id);
      return;
    }

    if (state.coins < theme.price) {
      Alert.alert('Not enough coins', `You need ${theme.price - state.coins} more coins.`);
      return;
    }

    Alert.alert(
      `Buy ${theme.name}?`,
      `This will cost ${theme.price} coins. You have ${state.coins} coins.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Buy', onPress: () => {
            addCoins(-theme.price);
            unlockTheme(theme.id);
            setThemePreference(theme.id);
          },
        },
      ]
    );
  };

  const renderBadgeStatus = (avatar) => {
    if (!avatar.unlockBadge) return null;
    const hasBadge = state.badges.includes(avatar.unlockBadge);
    const owned = state.unlockedAvatars.includes(avatar.id);

    if (owned) {
      return (
        <View style={styles.badgeReq}>
          <Ionicons name="checkmark-circle" size={12} color={C.success} />
          <AppText style={[styles.badgeReqText, { color: C.success }]}>Unlocked</AppText>
        </View>
      );
    }

    return (
      <View style={styles.badgeReq}>
        <Ionicons name="lock-closed" size={12} color={C.textMuted} />
        <AppText style={[styles.badgeReqText, { color: C.textMuted }]}>
          {BADGE_LABELS[avatar.unlockBadge]}
        </AppText>
      </View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <ScreenBackground preset="shop" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={C.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <AppText style={styles.headerTitle} decorative>Hero Shop</AppText>
          <AppText style={styles.headerSubtitle}>Customize your hero and theme</AppText>
        </View>
        <View style={styles.coinDisplay}>
          <Ionicons name="cash-outline" size={16} color={C.gold} />
          <AppText style={styles.coinText}>{state.coins}</AppText>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, active && { backgroundColor: C.primary, borderColor: C.primary }]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.75}
            >
              <Ionicons name={tab.icon} size={16} color={active ? C.white : C.textMuted} />
              <AppText style={[styles.tabLabel, { color: active ? C.white : C.text }]}>
                {tab.label}
              </AppText>
              <View style={[styles.tabCount, { backgroundColor: active ? 'rgba(255,255,255,0.2)' : C.backgroundLight }]}>
                <AppText style={[styles.tabCountText, { color: active ? C.white : C.textMuted }]}>
                  {tab.id === 'avatars'
                    ? `${state.unlockedAvatars.length}/${AVATARS.length}`
                    : `${state.unlockedThemes?.length || 1}/${THEMES.length}`
                  }
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* AVATARS TAB */}
      {activeTab === 'avatars' && (
        <>
          {/* Achievement Titles */}
          {unlockedTitles.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <View style={[styles.sectionAccent, { backgroundColor: C.gold }]} />
                <AppText style={styles.sectionTitle} decorative>Unlocked Titles</AppText>
                <View style={styles.sectionCount}>
                  <AppText style={styles.sectionCountText}>{unlockedTitles.length}/{unlockedTitles.length}</AppText>
                </View>
              </View>
              <View style={styles.titlesWrap}>
                {unlockedTitles.map((ut) => (
                  <View key={ut.badgeId} style={[styles.titleChip, { backgroundColor: `${C.gold}18`, borderColor: `${C.gold}40` }]}>
                    <Ionicons name="medal" size={14} color={C.gold} />
                    <AppText style={styles.titleChipText}>{ut.title}</AppText>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Achievement Avatars */}
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionAccent, { backgroundColor: C.gold }]} />
            <AppText style={styles.sectionTitle} decorative>Achievement Avatars</AppText>
            <View style={styles.sectionCount}>
              <AppText style={styles.sectionCountText}>
                {state.unlockedAvatars.filter(id => AVATARS.some(a => a.id === id && a.type === 'achievement')).length}
                /{AVATARS.filter(a => a.type === 'achievement').length}
              </AppText>
            </View>
          </View>

          {AVATARS.filter(a => a.type === 'achievement').map((avatar) => {
            const owned = state.unlockedAvatars.includes(avatar.id);
            const equipped = state.avatarIndex === avatar.id;
            const hasBadge = !avatar.unlockBadge || state.badges.includes(avatar.unlockBadge);
            return (
              <View key={avatar.id} style={[styles.card, owned && { borderColor: C.gold }, !hasBadge && !owned && { opacity: 0.7 }]}>
                <View style={[styles.iconWrap, { backgroundColor: owned ? `${C.gold}20` : C.backgroundLight }]}>
                  <Ionicons name={avatar.icon} size={36} color={owned ? C.gold : C.textMuted} />
                </View>
                <View style={styles.cardInfo}>
                  <AppText style={styles.cardName}>{avatar.name}</AppText>
                  {avatar.type === 'achievement' && renderBadgeStatus(avatar)}
                  {owned && equipped && (
                    <View style={[styles.badge, styles.badgeEquipped]}>
                      <Ionicons name="checkmark-circle" size={12} color={C.white} />
                      <AppText style={[styles.badgeText, { color: C.white }]}>Equipped</AppText>
                    </View>
                  )}
                  {owned && !equipped && (
                    <AppText style={styles.ownedText}>Owned</AppText>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.actionBtn, {
                    backgroundColor: equipped ? C.success : owned || hasBadge ? 'transparent' : C.backgroundLight,
                    borderColor: equipped ? C.success : owned || hasBadge ? C.gold : C.cardBorder,
                  }]}
                  onPress={() => handlePurchase(avatar)}
                  disabled={!hasBadge && !owned}
                >
                  <AppText style={[styles.actionBtnText, {
                    color: equipped ? C.white : owned || hasBadge ? C.gold : C.textMuted,
                  }]}>
                    {equipped ? 'Equipped' : owned ? 'Equip' : hasBadge ? 'Claim' : 'Locked'}
                  </AppText>
                </TouchableOpacity>
              </View>
            );
          })}

          {/* Coin Avatars */}
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionAccent, { backgroundColor: C.primary }]} />
            <AppText style={styles.sectionTitle} decorative>Coin Avatars</AppText>
            <View style={styles.sectionCount}>
              <AppText style={styles.sectionCountText}>
                {state.unlockedAvatars.filter(id => AVATARS.some(a => a.id === id && a.type === 'coin')).length}
                /{AVATARS.filter(a => a.type === 'coin').length}
              </AppText>
            </View>
          </View>

          {AVATARS.filter(a => a.type === 'coin').map((avatar) => {
            const owned = state.unlockedAvatars.includes(avatar.id);
            const equipped = state.avatarIndex === avatar.id;
            return (
              <View key={avatar.id} style={[styles.card, owned && { borderColor: C.gold }]}>
                <View style={[styles.iconWrap, { backgroundColor: owned ? `${C.gold}20` : C.backgroundLight }]}>
                  <Ionicons name={avatar.icon} size={36} color={owned ? C.gold : C.textMuted} />
                </View>
                <View style={styles.cardInfo}>
                  <AppText style={styles.cardName}>{avatar.name}</AppText>
                  {!owned && (
                    <View style={styles.priceRow}>
                      <Ionicons name="cash-outline" size={14} color={C.gold} />
                      <AppText style={styles.priceText}>{avatar.price} coins</AppText>
                    </View>
                  )}
                  {owned && equipped && (
                    <View style={[styles.badge, styles.badgeEquipped]}>
                      <Ionicons name="checkmark-circle" size={12} color={C.white} />
                      <AppText style={[styles.badgeText, { color: C.white }]}>Equipped</AppText>
                    </View>
                  )}
                  {owned && !equipped && (
                    <AppText style={styles.ownedText}>Owned</AppText>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.actionBtn, {
                    backgroundColor: equipped ? C.success : owned ? 'transparent' : C.primary,
                    borderColor: equipped ? C.success : owned ? C.gold : C.primary,
                  }]}
                  onPress={() => handlePurchase(avatar)}
                >
                  <AppText style={[styles.actionBtnText, {
                    color: equipped ? C.white : owned ? C.gold : C.white,
                  }]}>
                    {equipped ? 'Equipped' : owned ? 'Equip' : avatar.price === 0 ? 'Free' : 'Buy'}
                  </AppText>
                </TouchableOpacity>
              </View>
            );
          })}
        </>
      )}

      {/* THEMES TAB */}
      {activeTab === 'themes' && (
        <>
          <View style={styles.sectionHeader}>
            <View style={[styles.sectionAccent, { backgroundColor: C.primary }]} />
            <AppText style={styles.sectionTitle} decorative>All Themes</AppText>
            <View style={styles.sectionCount}>
              <AppText style={styles.sectionCountText}>
                {state.unlockedThemes?.length || 1}/{THEMES.length}
              </AppText>
            </View>
          </View>

          {THEMES.map((theme) => {
            const owned = state.unlockedThemes?.includes(theme.id);
            const equipped = (state.selectedTheme || 'light') === theme.id;
            const previewColors = THEME_PREVIEW[theme.id] || ['#888', '#888', '#888', '#888', '#888', '#888'];
            return (
              <View key={theme.id} style={[styles.card, owned && { borderColor: C.gold }]}>
                <View style={[styles.iconWrap, { backgroundColor: owned ? `${C.gold}20` : C.backgroundLight }]}>
                  <Ionicons name={theme.icon} size={34} color={owned ? C.gold : C.textMuted} />
                </View>
                <View style={styles.cardInfo}>
                  <AppText style={styles.cardName}>{theme.name}</AppText>
                  <AppText style={styles.themeDesc}>{theme.desc}</AppText>
                  <View style={styles.previewRow}>
                    {previewColors.map((pc, i) => (
                      <View key={i} style={[styles.previewDot, { backgroundColor: pc }]} />
                    ))}
                  </View>
                  {!owned && theme.price > 0 && (
                    <View style={styles.priceRow}>
                      <Ionicons name="cash-outline" size={14} color={C.gold} />
                      <AppText style={styles.priceText}>{theme.price} coins</AppText>
                    </View>
                  )}
                  {owned && equipped && (
                    <View style={[styles.badge, styles.badgeEquipped]}>
                      <Ionicons name="checkmark-circle" size={12} color={C.white} />
                      <AppText style={[styles.badgeText, { color: C.white }]}>Active</AppText>
                    </View>
                  )}
                  {owned && !equipped && (
                    <AppText style={styles.ownedText}>Owned</AppText>
                  )}
                </View>
                <TouchableOpacity
                  style={[styles.actionBtn, {
                    backgroundColor: equipped ? C.success : owned ? 'transparent' : C.primary,
                    borderColor: equipped ? C.success : owned ? C.gold : C.primary,
                  }]}
                  onPress={() => handleThemePurchase(theme)}
                >
                  <AppText style={[styles.actionBtnText, {
                    color: equipped ? C.white : owned ? C.gold : C.white,
                  }]}>
                    {equipped ? 'Active' : owned ? 'Equip' : theme.price === 0 ? 'Free' : theme.price + 'c'}
                  </AppText>
                </TouchableOpacity>
              </View>
            );
          })}
        </>
      )}

      <View style={styles.spacer} />
    </ScrollView>
    </View>
  );
}

const createStyles = (C) => StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingTop: 55, paddingBottom: 18,
    backgroundColor: C.card,
    borderBottomWidth: 1, borderBottomColor: C.backgroundLight,
    ...SHADOWS.small,
  },
  backBtn: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: C.backgroundLight, justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: C.text },
  headerSubtitle: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  coinDisplay: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: `${C.gold}20`, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 16,
    borderWidth: 1, borderColor: `${C.gold}40`,
  },
  coinText: { fontSize: 15, fontWeight: 'bold', color: C.gold },
  tabBar: {
    flexDirection: 'row', marginHorizontal: 20, marginTop: 16, marginBottom: 4,
    backgroundColor: C.backgroundLight, borderRadius: 14, padding: 4, gap: 4,
  },
  tab: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: 'transparent',
  },
  tabLabel: { fontSize: 14, fontWeight: '900' },
  tabCount: {
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8,
  },
  tabCountText: { fontSize: 11, fontWeight: '800' },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginTop: 24, marginBottom: 4, gap: 10,
  },
  sectionAccent: {
    width: 3, height: 18, borderRadius: 2,
  },
  sectionTitle: { fontSize: 17, fontWeight: '800', color: C.text },
  sectionCount: {
    marginLeft: 'auto',
    backgroundColor: C.backgroundLight, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10,
  },
  sectionCountText: { fontSize: 12, fontWeight: '700', color: C.textMuted },
  titlesWrap: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 8,
    marginHorizontal: 20, marginTop: 8,
  },
  titleChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
    borderWidth: 1,
  },
  titleChipText: { fontSize: 12, fontWeight: '800', color: C.text },
  card: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: 20, marginTop: 12, padding: 16,
    backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.cardBorder,
  },
  iconWrap: {
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center', marginRight: 14,
  },
  cardInfo: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: 'bold', color: C.text },
  themeDesc: { fontSize: 12, color: C.textMuted, marginTop: 2 },
  previewRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  previewDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 0.5, borderColor: 'rgba(0,0,0,0.1)' },
  badgeReq: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  badgeReqText: { fontSize: 11, fontWeight: '700' },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  priceText: { fontSize: 13, color: C.gold, fontWeight: '700' },
  ownedText: { fontSize: 12, color: C.textMuted, marginTop: 4 },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    alignSelf: 'flex-start', marginTop: 4,
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8,
  },
  badgeEquipped: {
    backgroundColor: `${C.success}20`,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: C.white },
  actionBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12,
    borderWidth: 1.5, marginLeft: 8,
  },
  actionBtnText: { fontSize: 13, fontWeight: '800' },
  spacer: { height: 50 },
});