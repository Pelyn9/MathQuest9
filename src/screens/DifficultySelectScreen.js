import { View, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useRef, useEffect, useMemo } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { DIFFICULTY } from '../utils/gameLogic';
import { getStoryDifficultyPath } from '../data/storyMissions';
import { useGame } from '../context/GameContext';
import ScreenBackground from '../components/ScreenBackground';

const DIFF_ORDER = ['easy', 'normal', 'hard', 'extreme'];

export default function DifficultySelectScreen({ navigation }) {
  const { colors: C } = useTheme();
  const styles = useMemo(() => createStyles(C), [C]);
  const { setDifficulty } = useGame();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, easing: Easing.out(Easing.back(1.2)), useNativeDriver: true }),
    ]).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(glowAnim, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleSelect = (diff) => {
    setDifficulty(diff);
    navigation.replace('Main');
  };

  return (
    <View style={styles.wrapper}>
      <ScreenBackground preset="difficulty" />
      <ScrollView style={styles.container} contentContainerStyle={styles.contentWrap} showsVerticalScrollIndicator={false}>
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.iconWrap}>
          <Animated.View style={{ opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }}>
            <View style={[styles.iconCircleBg, { backgroundColor: `${C.primary}20` }]}>
              <Ionicons name="shield-checkmark" size={48} color={C.primary} />
            </View>
          </Animated.View>
        </View>
        <AppText style={styles.title} decorative>Choose Your Difficulty</AppText>
        <AppText style={styles.subtitle}>
          The harder the path, the greater the rewards.
        </AppText>
        <AppText style={styles.subtitle2}>
          Each path has its own story, allies, and challenges.
        </AppText>

        {DIFF_ORDER.map((key, idx) => {
          const d = DIFFICULTY[key];
          const path = getStoryDifficultyPath(key);
          const containerGrad = `${d.color}18`;
          const borderGrad = `${d.color}60`;
          return (
            <TouchableOpacity
              key={key}
              style={[styles.card, { borderColor: borderGrad, backgroundColor: containerGrad }]}
              onPress={() => handleSelect(key)}
              activeOpacity={0.75}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${d.color}25` }]}>
                <Ionicons name={d.icon} size={24} color={d.color} />
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <AppText style={[styles.cardTitle, { color: d.color }]}>{d.label}</AppText>
                  <View style={styles.cardLivesRow}>
                    {Array.from({ length: d.lives }, (_, i) => (
                      <Ionicons key={i} name="heart" size={12} color={C.heart} />
                    ))}
                  </View>
                </View>
                <AppText style={[styles.cardDesc, { color: C.textMuted }]}>{d.desc}</AppText>
                <View style={styles.pathRow}>
                  <Ionicons name={path.icon} size={12} color={path.color} />
                  <AppText style={[styles.pathDesc, { color: path.color }]}>
                    {path.label}
                  </AppText>
                </View>
                <View style={styles.multRow}>
                  <View style={styles.multBadge}>
                    <Ionicons name="speedometer" size={10} color={C.xp} />
                    <AppText style={[styles.multText, { color: C.xp }]}>XP {d.xpMult}x</AppText>
                  </View>
                  <View style={styles.multBadge}>
                    <Ionicons name="trophy" size={10} color={C.gold} />
                    <AppText style={[styles.multText, { color: C.gold }]}>Score {d.scoreMult}x</AppText>
                  </View>
                </View>
                <View style={styles.clearBonus}>
                  <Ionicons name="flag" size={10} color={path.color} />
                  <AppText style={[styles.clearBonusText, { color: path.color }]}>Clear bonus: +{path.clearBonusXP} XP</AppText>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={d.color} />
            </TouchableOpacity>
          );
        })}

        <View style={styles.legendRow}>
          <View style={[styles.legendItem, { borderColor: `${C.primary}30` }]}>
            <MaterialCommunityIcons name="star-four-points" size={12} color={C.xp} />
            <AppText style={[styles.legendText, { color: C.textMuted }]}>Separate progress per path</AppText>
          </View>
          <View style={[styles.legendItem, { borderColor: `${C.primary}30` }]}>
            <Ionicons name="shield" size={12} color={C.success} />
            <AppText style={[styles.legendText, { color: C.textMuted }]}>Unique story & rewards</AppText>
          </View>
        </View>
      </Animated.View>
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
  contentWrap: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 28,
  },
  content: {
    width: '92%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 6,
  },
  iconCircleBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: `${C.primary}40`,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: C.text,
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 2,
    lineHeight: 18,
    color: C.textMuted,
  },
  subtitle2: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 18,
    lineHeight: 16,
    color: C.textMuted,
    fontStyle: 'italic',
  },
  card: {
    width: '94%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 12,
    shadowColor: C.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  cardLivesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  cardDesc: {
    fontSize: 11,
    marginTop: 2,
    lineHeight: 15,
  },
  pathRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  pathDesc: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700',
  },
  multRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },
  multBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: `${C.backgroundLight}80`,
  },
  multText: {
    fontSize: 10,
    fontWeight: '700',
  },
  clearBonus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  clearBonusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 16,
    paddingHorizontal: 10,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  legendText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
