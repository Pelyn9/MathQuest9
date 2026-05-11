import { View, TouchableOpacity, StyleSheet, Animated, ScrollView } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
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
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
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
          <Ionicons name="shield-checkmark" size={42} color={C.gold} />
        </View>
        <AppText style={styles.title} decorative>Choose Your Difficulty</AppText>
        <AppText style={styles.subtitle}>
          The harder the path, the greater the rewards.
        </AppText>

        {DIFF_ORDER.map((key, idx) => {
          const d = DIFFICULTY[key];
          const path = getStoryDifficultyPath(key);
          const icons = ['leaf', 'shield', 'flame', 'skull'];
          return (
            <TouchableOpacity
              key={key}
              style={[styles.card, { borderColor: d.color, backgroundColor: `${d.color}12` }]}
              onPress={() => handleSelect(key)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${d.color}25` }]}>
                <Ionicons name={icons[idx]} size={22} color={d.color} />
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <AppText style={[styles.cardTitle, { color: d.color }]}>{d.label}</AppText>
                  <View style={styles.cardLivesRow}>
                    <AppText style={[styles.cardLives, { color: C.heart }]}>{d.lives}</AppText>
                    <Ionicons name="heart" size={14} color={C.heart} />
                  </View>
                </View>
                <AppText style={[styles.cardDesc, { color: C.textMuted }]}>{d.desc}</AppText>
                <AppText style={[styles.pathDesc, { color: path.color }]}>
                  {path.label}: separate progress, +{path.clearBonusXP} clear XP
                </AppText>
                <View style={styles.multRow}>
                  <AppText style={[styles.multText, { color: C.textLight }]}>XP: {d.xpMult}x</AppText>
                  <AppText style={[styles.multText, { color: C.textLight }]}>Score: {d.scoreMult}x</AppText>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={17} color={d.color} />
            </TouchableOpacity>
          );
        })}
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
    width: '90%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: C.text,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
    lineHeight: 17,
    color: C.textMuted,
  },
  card: {
    width: '92%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1.5,
    padding: 12,
    marginBottom: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 11,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardLivesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cardLives: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardDesc: {
    fontSize: 11,
    marginTop: 3,
  },
  pathDesc: {
    fontSize: 10,
    lineHeight: 13,
    marginTop: 4,
    fontWeight: '800',
  },
  multRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  multText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
