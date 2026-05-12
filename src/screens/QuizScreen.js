import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Animated, Easing, Image, Pressable, View, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../theme/ThemeContext';
import { calculateScore, calculateXP, calculateStarsFromAccuracy, BADGES, DIFFICULTY } from '../utils/gameLogic';
import {
  PLAY_MODES,
  getMissionById,
  getStoryDifficultyPath,
  getStoryLesson,
  getStoryQuestionPrompt,
  getMissionStats,
  getDifficultyMissionProgress,
} from '../data/storyMissions';
import { soundManager } from '../utils/SoundManager';
import LivesDisplay from '../components/LivesDisplay';
import Lifelines from '../components/Lifelines';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';
import RewardModal from '../components/RewardModal';
import StoryIntroModal from '../components/StoryIntroModal';
import RoyalGuideModal from '../components/RoyalGuideModal';
import BossLoadingScreen from '../components/BossLoadingScreen';
import ScreenBackground from '../components/ScreenBackground';
import useScreenMusic from '../hooks/useScreenMusic';

const MODULES = {
  1: require('../data/module1').default,
  2: require('../data/module2').default,
  3: require('../data/module3').default,
  4: require('../data/module4').default,
  5: require('../data/module5').default,
};

const shuffleQuestions = (items) => [...items].sort(() => Math.random() - 0.5);

const usesFullLevelBank = (difficulty) => difficulty === 'hard' || difficulty === 'extreme';

const limitQuestionsForDifficulty = (items, difficulty, count) => {
  if (usesFullLevelBank(difficulty)) return items;
  return items.slice(0, Math.min(items.length, count || 5));
};

const getAllModuleQuestions = () => {
  const pool = [];
  Object.values(MODULES).forEach(module => {
    module.levels.forEach(moduleLevel => {
      moduleLevel.questions.forEach(question => {
        pool.push({
          ...question,
          difficulty: question.difficulty || moduleLevel.difficulty,
          sourceModuleId: module.id,
          sourceLevelId: moduleLevel.id,
        });
      });
    });
  });
  return pool;
};

const bossBackground = require('../image/boss.png');
const timerLoadingBackground = require('../image/mathmage.jpg');
const storyLoadingBackground = require('../image/storymode.png');

export default function QuizScreen({ route, navigation }) {
  const { moduleId, levelId, missionId, mode } = route.params;
  const modData = MODULES[moduleId];
  const level = modData?.levels.find(l => l.id === levelId);

  const { state, useLife, refillLives, addCoins, answerCorrect, answerWrong, completeLevel } = useGame();
  const { showToast } = useToast();
  const { colors: C } = useTheme();
  const styles = useMemo(() => createStyles(C), [C]);
  const initialMission = missionId ? getMissionById(missionId) : null;
  const initialActiveModeKey = initialMission ? 'story' : mode || state.activeMode || 'story';
  const startsWithLoadingScreen = initialActiveModeKey === 'survival'
    || initialActiveModeKey === 'timer'
    || initialActiveModeKey === 'story'
    || Boolean(initialMission ? initialMission.isBoss : level?.isBoss);

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [streak, setStreak] = useState(0);
  const [usedFifty, setUsedFifty] = useState(false);
  const [usedCall, setUsedCall] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showRoyalGuide, setShowRoyalGuide] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [lastBadge, setLastBadge] = useState(null);
  const [lastCoins, setLastCoins] = useState(0);
  const [awardedXP, setAwardedXP] = useState(0);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [localLives, setLocalLives] = useState(state.lives);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [battleStatus, setBattleStatus] = useState('playing');
  const [onboardingStep, setOnboardingStep] = useState('story'); // story -> gameplay
  const [showBossLoading, setShowBossLoading] = useState(startsWithLoadingScreen);
  const bossLoadingKeyRef = useRef(null);
  const gameOverTriggeredRef = useRef(false);
  const answerLockedRef = useRef(false);
  const mountedRef = useRef(true);
  const timerExpiryRef = useRef(null);
  const damageFlashOpacity = useRef(new Animated.Value(0)).current;
  const gameOverOpacity = useRef(new Animated.Value(0)).current;
  const brokenHeartScale = useRef(new Animated.Value(0.7)).current;
  const brokenHeartTilt = useRef(new Animated.Value(0)).current;
  const gameOverGlowAnim = useRef(new Animated.Value(0)).current;

  const diffConfig = DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
  const activeModeKey = initialActiveModeKey;
  const activeMode = PLAY_MODES[activeModeKey] || PLAY_MODES.story;
  const mission = initialMission;
  const storyPath = getStoryDifficultyPath(state.difficulty);
  const isStoryMode = activeModeKey === 'story';
  const isStoryMission = activeModeKey === 'story' && !!mission;
  const isSurvivalMode = activeModeKey === 'survival';
  const isTimerMode = activeModeKey === 'timer';
  const isBossEncounter = isSurvivalMode || Boolean(mission ? mission.isBoss : level?.isBoss);
  const loadingScreenKey = (isBossEncounter || isTimerMode || isStoryMode)
    ? `${activeModeKey}-${mission?.id || `${moduleId}-${levelId}`}`
    : null;
  const missionProgress = isStoryMission ? getDifficultyMissionProgress(state, state.difficulty) : null;
  const missionStats = isStoryMission ? getMissionStats(missionProgress) : null;
  const storyLesson = isStoryMission
    ? getStoryLesson({ mission, level, difficulty: state.difficulty, questionCount: questions.length })
    : null;
  const usesTimer = activeModeKey !== 'survival';
  const baseTimePerQ = diffConfig.timePerQuestion || 45;
  const timePerQ = activeModeKey === 'timer' ? Math.max(15, Math.round(baseTimePerQ * 0.65)) : baseTimePerQ;
  const musicTrack = useMemo(() => {
    if (!level) return 'menu';
    if (activeModeKey === 'survival') return 'survival';
    if (activeModeKey === 'timer') return 'timer';
    if (isBossEncounter) return 'boss';
    return onboardingStep === 'gameplay' ? 'story' : 'menu';
  }, [activeModeKey, isBossEncounter, level, onboardingStep]);

  const isBattleLocked = battleStatus === 'gameOver' || finished || gameOverTriggeredRef.current;
  useScreenMusic(musicTrack);

  useEffect(() => {
    if (loadingScreenKey && bossLoadingKeyRef.current !== loadingScreenKey) {
      bossLoadingKeyRef.current = loadingScreenKey;
      setShowBossLoading(true);
      return;
    }

    if (!loadingScreenKey) {
      setShowBossLoading(false);
    }
  }, [loadingScreenKey]);

  useEffect(() => {
    if (isStoryMission && mission && level) {
      setOnboardingStep('story');
    } else {
      setOnboardingStep('gameplay');
    }
  }, [isStoryMission, mission, level]);

  useEffect(() => {
    return () => { mountedRef.current = false; };
  }, []);

  const buildQuestionSet = useCallback(() => {
    if (!level) return [];

    if (activeModeKey === 'survival' || activeModeKey === 'timer') {
      return shuffleQuestions(getAllModuleQuestions());
    }

    const questionLimit = diffConfig.questionsCount || 5;

    if (isStoryMission && mission) {
      const startIndex = (mission.id - 1) % level.questions.length;
      const orderedQuestions = [
        ...level.questions.slice(startIndex),
        ...level.questions.slice(0, startIndex),
      ];
      const missionQuestions = limitQuestionsForDifficulty(orderedQuestions, state.difficulty, questionLimit);

      return missionQuestions.map((question, index) => ({
        ...question,
        id: `${mission.id}-${question.id || index}`,
        difficulty: question.difficulty || level.difficulty,
        storyContext: mission.isBoss
          ? `Boss Mission ${mission.id}: ${mission.shortTitle}`
          : `Mission ${mission.id}: ${mission.shortTitle}`,
        storyPrompt: getStoryQuestionPrompt(mission, index),
      }));
    }

    const levelQuestions = shuffleQuestions(
      level.questions.map(question => ({
        ...question,
        difficulty: question.difficulty || level.difficulty,
        sourceModuleId: modData.id,
        sourceLevelId: level.id,
      }))
    );

    return limitQuestionsForDifficulty(levelQuestions, state.difficulty, questionLimit);
  }, [activeModeKey, diffConfig.questionsCount, isStoryMission, level, mission, modData, state.difficulty]);

  useEffect(() => {
    setQuestions(buildQuestionSet());
  }, [buildQuestionSet]);

  const stopTimer = useCallback(() => setTimerRunning(false), []);

  const triggerGameOver = useCallback(() => {
    if (gameOverTriggeredRef.current) return;
    gameOverTriggeredRef.current = true;
    answerLockedRef.current = true;
    setBattleStatus('gameOver');
    setLocalLives(0);
    setSelected(null);
    setShowCorrect(false);
    stopTimer();

    damageFlashOpacity.stopAnimation();
    gameOverOpacity.stopAnimation();
    gameOverGlowAnim.stopAnimation();
    brokenHeartScale.stopAnimation();
    brokenHeartTilt.stopAnimation();
    damageFlashOpacity.setValue(0);
    gameOverOpacity.setValue(0);
    gameOverGlowAnim.setValue(0);
    brokenHeartScale.setValue(0.7);
    brokenHeartTilt.setValue(0);

    soundManager.play('gameover');

    Animated.sequence([
      Animated.timing(damageFlashOpacity, {
        toValue: 1, duration: 120, easing: Easing.out(Easing.quad), useNativeDriver: true,
      }),
      Animated.timing(damageFlashOpacity, {
        toValue: 0, duration: 300, easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
    ]).start();

    Animated.parallel([
      Animated.timing(gameOverOpacity, {
        toValue: 1, duration: 400, delay: 150, easing: Easing.out(Easing.cubic), useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(gameOverGlowAnim, {
            toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true,
          }),
          Animated.timing(gameOverGlowAnim, {
            toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: true,
          }),
        ])
      ),
      Animated.sequence([
        Animated.delay(160),
        Animated.spring(brokenHeartScale, {
          toValue: 1, friction: 5, tension: 90, useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(brokenHeartTilt, {
          toValue: -1, duration: 100, delay: 160, useNativeDriver: true,
        }),
        Animated.timing(brokenHeartTilt, {
          toValue: 1, duration: 140, useNativeDriver: true,
        }),
        Animated.timing(brokenHeartTilt, {
          toValue: 0, duration: 130, useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [brokenHeartScale, brokenHeartTilt, damageFlashOpacity, gameOverGlowAnim, gameOverOpacity, stopTimer]);

  const currentQ = questions[qIndex];
  const isLast = qIndex >= questions.length - 1;

  const applyWrongAnswer = useCallback(() => {
    if (gameOverTriggeredRef.current) return true;
    const nextLives = Math.max(0, localLives - 1);
    soundManager.play('wrong');
    setStreak(0);
    setLocalLives(nextLives);
    useLife();
    answerWrong();
    if (nextLives <= 0) {
      triggerGameOver();
      return true;
    }
    return false;
  }, [answerWrong, localLives, triggerGameOver, useLife]);

  const handleTimerExpiry = useCallback(() => {
    if (isBattleLocked || answerLockedRef.current || showCorrect || !currentQ) return;
    answerLockedRef.current = true;
    stopTimer();
    const defeated = applyWrongAnswer();
    if (defeated) return;
    setSelected(-1);
    setShowCorrect(true);
  }, [isBattleLocked, showCorrect, currentQ, stopTimer, applyWrongAnswer]);

  timerExpiryRef.current = handleTimerExpiry;

  useEffect(() => {
    if (usesTimer && currentQ && localLives > 0 && !showCorrect && !finished && battleStatus !== 'gameOver') {
      setTimerKey(k => k + 1);
      setTimerRunning(true);
    } else {
      setTimerRunning(false);
    }
  }, [qIndex, showCorrect, finished, battleStatus, currentQ, localLives, usesTimer]);

  useEffect(() => {
    if (localLives <= 0 && questions.length > 0 && !finished && !gameOverTriggeredRef.current) {
      triggerGameOver();
    }
  }, [battleStatus, finished, localLives, questions.length, triggerGameOver]);

  useEffect(() => {
    if (state.lives <= 0 && localLives > 0 && !gameOverTriggeredRef.current) {
      setLocalLives(0);
      triggerGameOver();
    }
  }, [state.lives, localLives, triggerGameOver]);

  const handleSelect = (idx) => {
    if (showCorrect || isBattleLocked || answerLockedRef.current || !currentQ) return;
    setSelected(idx);
    soundManager.play('click');
  };

  const handleSubmit = () => {
    if (selected === null || isBattleLocked || answerLockedRef.current || !currentQ) return;
    answerLockedRef.current = true;
    stopTimer();
    const correct = selected === currentQ.correct;
    const scoringDifficulty = currentQ.difficulty || level.difficulty;
    const timeBonus = Math.floor(timePerQ * 10 * (1 - (0.5)));
    const pts = calculateScore({
      correct, difficulty: scoringDifficulty, streak: correct ? streak : 0, timeBonus: correct ? timeBonus : 0,
    });
    const xp = calculateXP({ correct, difficulty: scoringDifficulty, streak: correct ? streak : 0 });

    if (correct) {
      soundManager.play('correct');
      setShowCorrect(true);
      setScore(s => s + pts);
      setCorrectCount(c => c + 1);
      setStreak(s => s + 1);
      setTotalXP(t => t + xp);
      answerCorrect();
    } else {
      const defeated = applyWrongAnswer();
      if (!defeated) setShowCorrect(true);
    }
  };

  const cycleQuestions = useCallback(() => {
    const newSet = buildQuestionSet();
    setQuestions(newSet);
    setQIndex(0);
  }, [buildQuestionSet]);

  const handleNext = () => {
    if (isBattleLocked || gameOverTriggeredRef.current) return;
    soundManager.play('click');
    answerLockedRef.current = false;
    setSelected(null);
    setShowCorrect(false);
    setShowHint(false);
    setShowRoyalGuide(false);
    setHintLevel(0);
    if (isLast) {
      if (activeModeKey === 'survival' || activeModeKey === 'timer') {
        cycleQuestions();
      } else {
        finishLevel();
      }
    } else {
      setQIndex(i => i + 1);
    }
  };

  const finishLevel = () => {
    if (isBattleLocked || gameOverTriggeredRef.current) return;
    answerLockedRef.current = true;
    soundManager.play('victory');
    soundManager.play('coin');
    const total = questions.length;
    const accuracy = Math.round((correctCount / total) * 100);
    const starsEarned = calculateStarsFromAccuracy(accuracy);
    const maxScore = total * 100 * 2;
    const coinsEarned = Math.round(score / 20) + (accuracy === 100 ? 50 : 0);
    const xpAward = totalXP + (isStoryMission && starsEarned > 0 ? storyPath.clearBonusXP : 0);
    completeLevel({
      moduleId,
      levelId,
      missionId,
      mode: activeModeKey,
      score,
      maxScore,
      accuracy,
      xpEarned: xpAward,
      difficulty: state.difficulty,
    });
    addCoins(coinsEarned);
    setLastCoins(coinsEarned);
    setAwardedXP(xpAward);
    setFinished(true);
    setBattleStatus('finished');
    const badgeToShow = [];
    if (accuracy === 100 && !state.badges.includes(BADGES.perfectScore.id)) badgeToShow.push(BADGES.perfectScore);
    if (streak >= 5 && !state.badges.includes(BADGES.onFire.id)) badgeToShow.push(BADGES.onFire);
    if (badgeToShow.length > 0) {
      soundManager.play('badge');
      showToast(`Badge earned: ${badgeToShow[0].name}!`, 'badge', badgeToShow[0].icon);
      setLastBadge(badgeToShow[0]);
    }
    setShowReward(true);
  };

  const handleFiftyFifty = () => {
    if (isBattleLocked || answerLockedRef.current || showCorrect || !currentQ) return;
    if (usedFifty) return;
    if (state.coins < 20) { soundManager.play('wrong'); showToast('Need 20 coins for 50/50!', 'info', 'cash'); return; }
    soundManager.play('lifeline');
    addCoins(-20);
    const incorrectIndices = currentQ.options.map((_, i) => i).filter(i => i !== currentQ.correct);
    const shuffled = incorrectIndices.sort(() => Math.random() - 0.5);
    const toEliminate = shuffled.slice(0, 2);
    currentQ.eliminated = toEliminate;
    setUsedFifty(true);
    showToast('Two wrong answers eliminated!', 'success', 'cut');
  };

  const handleCallFriend = () => {
    if (isBattleLocked || answerLockedRef.current || showCorrect || !currentQ) return;
    if (usedCall) return;
    if (state.coins < 40) { soundManager.play('wrong'); showToast('Need 40 coins for Call Friend!', 'info', 'cash'); return; }
    soundManager.play('lifeline');
    addCoins(-40);
    setUsedCall(true);
    showToast('Friend is helping! Check the hint above.', 'info', 'people');
  };

  const handleHint = () => {
    if (isBattleLocked || answerLockedRef.current || showCorrect || !currentQ) return;
    if (hintLevel === 0) {
      soundManager.play('open');
      setShowHint(true); setHintLevel(1);
      showToast('Hint revealed! Click again to eliminate a wrong answer (10 coins).', 'info', 'bulb'); return;
    }
    if (hintLevel === 1) {
      if (state.coins < 10) { soundManager.play('wrong'); showToast('Need 10 coins for the advanced hint!', 'info', 'cash'); return; }
      soundManager.play('lifeline');
      addCoins(-10);
      const incorrect = currentQ.options.map((_, i) => i).filter(i => i !== currentQ.correct);
      if (!currentQ.eliminated) currentQ.eliminated = [];
      currentQ.eliminated.push(incorrect[0]);
      setHintLevel(2);
      showToast('One wrong answer eliminated!', 'success', 'bulb');
    }
  };

  const handleRewardClose = () => {
    soundManager.play('click');
    setShowReward(false);
    navigation.replace('Result', {
      moduleId, levelId, score, total: questions.length, correctCount,
      accuracy: Math.round((correctCount / questions.length) * 100),
      coins: lastCoins, badge: lastBadge, xpEarned: awardedXP || totalXP, missionId, mode: activeModeKey,
    });
  };

  const resetBattleState = useCallback((nextLives = state.maxLives) => {
    answerLockedRef.current = false;
    gameOverTriggeredRef.current = false;
    damageFlashOpacity.stopAnimation();
    gameOverOpacity.stopAnimation();
    gameOverGlowAnim.stopAnimation();
    brokenHeartScale.stopAnimation();
    brokenHeartTilt.stopAnimation();
    damageFlashOpacity.setValue(0);
    gameOverOpacity.setValue(0);
    gameOverGlowAnim.setValue(0);
    brokenHeartScale.setValue(0.7);
    brokenHeartTilt.setValue(0);
    setQuestions(buildQuestionSet());
    setQIndex(0);
    setSelected(null);
    setShowCorrect(false);
    setScore(0);
    setCorrectCount(0);
    setTotalXP(0);
    setStreak(0);
    setUsedFifty(false);
    setUsedCall(false);
    setHintLevel(0);
    setShowHint(false);
    setShowRoyalGuide(false);
    setShowReward(false);
    setLastBadge(null);
    setLastCoins(0);
    setAwardedXP(0);
    setFinished(false);
    setLocalLives(nextLives);
    setBattleStatus('playing');
    setTimerKey(k => k + 1);
  }, [brokenHeartScale, brokenHeartTilt, buildQuestionSet, damageFlashOpacity, gameOverGlowAnim, gameOverOpacity, state.maxLives]);

  const handleTryAgain = useCallback(() => {
    const fullLives = state.maxLives || diffConfig.lives || 3;
    soundManager.play('click');
    refillLives();
    resetBattleState(fullLives);
  }, [diffConfig.lives, refillLives, resetBattleState, state.maxLives]);

  const handleHome = useCallback(() => {
    soundManager.play('click');
    refillLives();
    resetBattleState(state.maxLives || diffConfig.lives || 3);
    navigation.reset({
      index: 0, routes: [{ name: 'Main', params: { screen: 'Home' } }],
    });
  }, [diffConfig.lives, navigation, refillLives, resetBattleState, state.maxLives]);

  const handleStoryContinue = () => {
    soundManager.play('click');
    setOnboardingStep('gameplay');
  };

  const handleRoyalGuideOpen = () => {
    soundManager.play('open');
    setShowRoyalGuide(true);
  };

  const handleRoyalGuideClose = () => {
    soundManager.play('close');
    setShowRoyalGuide(false);
  };

  const handleBossLoadingFinish = useCallback(() => {
    setShowBossLoading(false);
  }, []);

  if (!level) {
    return (
      <View style={styles.wrapper}>
        <ScreenBackground moduleId={moduleId} />
        <View style={styles.container}>
          <AppText style={{ color: C.text }}>Level not found</AppText>
        </View>
      </View>
    );
  }

  const friendHint = currentQ?.hint ? `Here's a hint: ${currentQ.hint}. Let's work through this step by step!` : '';
  const progressColor = level.isBoss ? C.warning : C.xp;
  const brokenHeartRotation = brokenHeartTilt.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });
  const titleGlow = gameOverGlowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  if (showBossLoading && (isBossEncounter || isTimerMode || isStoryMode)) {
    return (
      <BossLoadingScreen
        title={isTimerMode ? 'Timer Mode' : isSurvivalMode ? 'Survival Boss Battle' : isStoryMode ? 'Story Mode' : mission?.shortTitle || level?.title || 'Boss Battle'}
        finalBoss={!!mission?.isUltimateBoss}
        backgroundSource={isTimerMode ? timerLoadingBackground : isStoryMode ? storyLoadingBackground : undefined}
        loadingText={isTimerMode ? 'Time Challenge Loading...' : isStoryMode ? 'Story Quest Loading...' : undefined}
        accentColor={isTimerMode || isSurvivalMode || isStoryMode ? '#FFF1A8' : undefined}
        titleShadowColor={isTimerMode || isSurvivalMode || isStoryMode ? 'rgba(0, 0, 0, 0.96)' : undefined}
        copyBlockStyle={isTimerMode || isSurvivalMode || isStoryMode ? {
          backgroundColor: 'rgba(2, 7, 17, 0.68)',
          borderColor: 'rgba(255, 241, 168, 0.42)',
          borderWidth: 1,
          borderRadius: 12,
          paddingVertical: 12,
        } : undefined}
        onFinish={handleBossLoadingFinish}
      />
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScreenBackground moduleId={moduleId} levelId={levelId} />
      {isSurvivalMode && (
        <>
          <Image pointerEvents="none" source={bossBackground} resizeMode="cover" style={styles.survivalBossImage} />
          <View pointerEvents="none" style={styles.survivalBossRedWash} />
          <View pointerEvents="none" style={styles.survivalBossShade} />
        </>
      )}
      <View style={[styles.container, (isStoryMission || isSurvivalMode) && { backgroundColor: 'transparent' }]}>
      {isStoryMission && (
        <View style={[styles.rpgBackdrop, { pointerEvents: 'none' }]}>
          <View style={[styles.rpgSky, { backgroundColor: storyPath.sky }]} />
          <View style={[styles.rpgSunsetBand, { backgroundColor: `${storyPath.color}24` }]} />
          <View style={[styles.rpgRidge, { backgroundColor: storyPath.ridge }]} />
          <View style={[styles.rpgHillBack, { backgroundColor: storyPath.hill }]} />
          <View style={[styles.rpgHillFront, { backgroundColor: C.backgroundLight }]} />
          <View style={[styles.rpgRoad, { backgroundColor: storyPath.road }]} />
          <View style={styles.rpgCastle}>
            <View style={[styles.rpgTower, { backgroundColor: storyPath.ridge }]} />
            <View style={[styles.rpgKeep, { backgroundColor: storyPath.ridge }]} />
            <View style={[styles.rpgTower, { backgroundColor: storyPath.ridge }]} />
          </View>
          <View style={[styles.rpgPathGlow, { borderColor: `${storyPath.color}55` }]} />
        </View>
      )}

      {/* ── Step 1: Story Intro Modal ── */}
      <StoryIntroModal
        visible={onboardingStep === 'story'}
        onContinue={handleStoryContinue}
        mission={mission}
        storyPath={storyPath}
        missionStats={missionStats}
      />

      {/* Gameplay Royal Guide */}
      <RoyalGuideModal
        visible={showRoyalGuide && onboardingStep === 'gameplay'}
        onClose={handleRoyalGuideClose}
        lesson={storyLesson}
        mission={mission}
        question={currentQ}
        showCorrect={showCorrect}
      />

      {/* Gameplay */}
      {onboardingStep === 'gameplay' && !finished && (
        <>
          <View style={[styles.topBar, isStoryMission && { borderBottomColor: `${storyPath.color}45` }, isSurvivalMode && styles.survivalTopBar]}>
            <TouchableOpacity onPress={() => {
              if (onboardingStep === 'gameplay') {
                navigation.navigate('Main', { screen: 'Home' });
              }
            }} style={styles.closeBtn}>
              <Ionicons name="close" size={22} color={C.textLight} />
            </TouchableOpacity>

            <View style={styles.topCenter}>
              <View style={styles.progressRow}>
                {activeModeKey !== 'survival' && activeModeKey !== 'timer' && (
                  <ProgressBar current={qIndex + (showCorrect ? 1 : 0)} total={questions.length} color={progressColor} showLabel={false} />
                )}
                <AppText style={styles.questionNum}>{activeModeKey === 'survival' || activeModeKey === 'timer' ? `Q${qIndex + 1}` : `${qIndex + 1}/${questions.length}`}</AppText>
              </View>
              {usesTimer ? (
                <Timer seconds={timePerQ} onExpire={timerExpiryRef.current} running={timerRunning} resetKey={timerKey} />
              ) : (
                <View style={[styles.modeTimerBadge, { backgroundColor: `${activeMode.color}18` }]}>
                  <Ionicons name={activeMode.icon} size={12} color={activeMode.color} />
                  <AppText style={[styles.modeTimerText, { color: activeMode.color }]}>No Countdown</AppText>
                </View>
              )}
              <View style={[styles.modeTag, { backgroundColor: `${activeMode.color}18` }]}>
                <Ionicons name={activeMode.icon} size={12} color={activeMode.color} />
                <AppText style={[styles.modeTagText, { color: activeMode.color }]}>{activeMode.title}</AppText>
              </View>
              {isBossEncounter && (
                <View style={styles.bossTag}>
                  <Ionicons name="trophy" size={12} color={C.warning} />
                  <AppText style={styles.bossTagText}>{isSurvivalMode ? 'SURVIVAL BOSS' : 'BOSS'}</AppText>
                </View>
              )}
            </View>

            <View style={styles.topRight}>
              <LivesDisplay lives={localLives} maxLives={state.maxLives} />
              <View style={styles.coinBadge}>
                <Ionicons name="cash-outline" size={14} color={C.gold} />
                <AppText style={styles.coinText}>{state.coins}</AppText>
              </View>
            </View>
          </View>

          <ScrollView
            style={[styles.body, isSurvivalMode && styles.survivalBody]}
            contentContainerStyle={[styles.bodyContent, isSurvivalMode && styles.survivalBodyContent]}
            showsVerticalScrollIndicator={false}
            bounces={false}
            alwaysBounceVertical={false}
            overScrollMode="never"
          >
            <View style={styles.statsBar}>
              <View style={styles.statChip}>
                <Ionicons name="flash" size={14} color={C.xp} />
                <AppText style={styles.statChipText}>+{totalXP} XP</AppText>
              </View>
              <View style={styles.statChip}>
                <Ionicons name="flame" size={14} color={streak >= 3 ? C.warning : C.textMuted} />
                <AppText style={[styles.statChipText, streak >= 3 && { color: C.warning }]}>{streak} streak</AppText>
              </View>
              <View style={styles.statChip}>
                <Ionicons name="trophy" size={14} color={C.gold} />
                <AppText style={styles.statChipText}>{score} pts</AppText>
              </View>
            </View>

            {showHint && currentQ?.hint && (
              <View style={styles.hintBanner}>
                <Ionicons name="bulb" size={16} color={C.warning} />
                <AppText style={styles.hintText}>{currentQ.hint}</AppText>
              </View>
            )}

            {usedCall && (
              <View style={styles.callBanner}>
                <Ionicons name="people" size={16} color={C.secondary} />
                <AppText style={styles.hintText}>{friendHint}</AppText>
              </View>
            )}

            {currentQ && (
              <QuestionCard
                question={currentQ}
                selected={selected}
                onSelect={handleSelect}
                showCorrect={showCorrect}
                usedFifty={usedFifty}
                disabled={isBattleLocked}
                onOpenGuide={handleRoyalGuideOpen}
              />
            )}

            {showCorrect && currentQ && (
              <View style={[styles.explanationBox, selected === currentQ.correct ? styles.correctBox : styles.wrongBox]}>
                <View style={styles.explanationHeader}>
                  <Ionicons
                    name={selected === currentQ.correct ? 'checkmark-circle' : 'close-circle'}
                    size={20}
                    color={selected === currentQ.correct ? C.success : C.danger}
                  />
                  <AppText style={[styles.explanationTitle, { color: selected === currentQ.correct ? C.success : C.danger }]}>
                    {selected === currentQ.correct ? 'Correct!' : 'Incorrect!'}
                  </AppText>
                  {selected !== currentQ.correct && (
                    <Ionicons name="heart-dislike" size={16} color={C.heart} style={{ marginLeft: 4 }} />
                  )}
                </View>
                <AppText style={styles.explanationText}>{currentQ.explanation}</AppText>
              </View>
            )}

            <View style={styles.bottomSection}>
              {!showCorrect ? (
                <>
                  <Lifelines
                    onHint={handleHint}
                    onFiftyFifty={handleFiftyFifty}
                    onCallFriend={handleCallFriend}
                    usedFifty={usedFifty}
                    usedCall={usedCall}
                    hintLevel={hintLevel}
                    coins={state.coins}
                    hintCost={10}
                    fiftyCost={20}
                    callCost={40}
                  />
                  <TouchableOpacity
                    style={[styles.submitBtn, (selected === null || isBattleLocked) && styles.btnDisabled]}
                    onPress={handleSubmit}
                    disabled={selected === null || isBattleLocked}
                  >
                    <Ionicons name="shield-checkmark" size={20} color={C.white} />
                    <AppText style={styles.submitBtnText}>Confirm Answer</AppText>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={[styles.nextBtn, isBattleLocked && styles.btnDisabled]} onPress={handleNext} disabled={isBattleLocked}>
                  <AppText style={styles.nextBtnText}>{isLast && activeModeKey !== 'survival' && activeModeKey !== 'timer' ? 'Claim Rewards' : 'Next Challenge'}</AppText>
                  <Ionicons name="arrow-forward" size={20} color={C.white} />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </>
      )}

      <RewardModal visible={showReward} coins={lastCoins} badge={lastBadge} onClose={handleRewardClose} />

      <Animated.View style={[styles.damageFlash, { opacity: damageFlashOpacity, pointerEvents: 'none' }]} />

    </View>
      {battleStatus === 'gameOver' && (
        <Animated.View style={[styles.gameOverOverlay, { opacity: gameOverOpacity, pointerEvents: 'auto' }]}>
          <View style={styles.gameOverPanel}>
            <View style={styles.gameOverRune} />
            <Animated.View
              style={[
                styles.brokenHeartWrap,
                { transform: [{ scale: brokenHeartScale }, { rotate: brokenHeartRotation }] },
              ]}
            >
              <Ionicons name="heart-dislike" size={76} color={C.heart} />
            </Animated.View>

            <AppText decorative style={[styles.gameOverTitle, { opacity: titleGlow }]}>
              GAME OVER
            </AppText>

            <AppText style={styles.gameOverSubtitle}>
              You were defeated. Try again to continue your adventure.
            </AppText>

            <View style={styles.gameOverButtons}>
              <Pressable
                onPress={handleTryAgain}
                style={({ pressed }) => [
                  styles.gameOverButton,
                  styles.tryAgainButton,
                  pressed && styles.gameOverButtonActive,
                ]}
              >
                <Ionicons name="refresh" size={22} color={C.white} />
                <AppText style={styles.gameOverButtonText}>Try Again</AppText>
              </Pressable>
              <Pressable
                onPress={handleHome}
                style={({ pressed }) => [
                  styles.gameOverButton,
                  styles.homeButton,
                  pressed && styles.gameOverButtonActive,
                ]}
              >
                <Ionicons name="home" size={22} color={C.white} />
                <AppText style={styles.gameOverButtonText}>Home</AppText>
              </Pressable>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
}

const createStyles = (C) => StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: C.background },
  container: { flex: 1, backgroundColor: 'transparent' },
  survivalBossImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    opacity: 0.24,
  },
  survivalBossRedWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(120, 0, 18, 0.54)',
  },
  survivalBossShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 2, 8, 0.56)',
  },
  rpgBackdrop: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  rpgSky: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 230,
  },
  rpgSunsetBand: {
    position: 'absolute',
    top: 112,
    left: -30,
    right: -30,
    height: 120,
    borderTopLeftRadius: 90,
    borderTopRightRadius: 90,
  },
  rpgRidge: {
    position: 'absolute',
    top: 160,
    left: -40,
    right: -40,
    height: 145,
    borderTopLeftRadius: 180,
    borderTopRightRadius: 180,
    opacity: 0.82,
  },
  rpgHillBack: {
    position: 'absolute',
    top: 210,
    left: -70,
    right: -70,
    height: 165,
    borderTopLeftRadius: 220,
    borderTopRightRadius: 220,
    opacity: 0.9,
  },
  rpgHillFront: {
    position: 'absolute',
    top: 310,
    left: -80,
    right: -80,
    bottom: -70,
    borderTopLeftRadius: 240,
    borderTopRightRadius: 240,
    opacity: 0.88,
  },
  rpgRoad: {
    position: 'absolute',
    top: 318,
    bottom: -40,
    left: '34%',
    right: '34%',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    opacity: 0.28,
  },
  rpgCastle: {
    position: 'absolute',
    top: 96,
    right: 26,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    opacity: 0.3,
  },
  rpgTower: {
    width: 18,
    height: 56,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  rpgKeep: {
    width: 38,
    height: 40,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  rpgPathGlow: {
    position: 'absolute',
    top: 336,
    bottom: -20,
    left: '39%',
    right: '39%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    opacity: 0.5,
  },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: `${C.card}E6`, borderBottomWidth: 1, borderBottomColor: `${C.gold}30`,
  },
  survivalTopBar: {
    backgroundColor: 'rgba(45, 5, 12, 0.9)',
    borderBottomColor: 'rgba(255, 93, 99, 0.55)',
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: `${C.backgroundLight}D0`, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: `${C.gold}30`,
  },
  topCenter: { flex: 1, marginHorizontal: 10, alignItems: 'center', gap: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '100%' },
  questionNum: { fontSize: 13, color: C.textMuted, fontWeight: '600' },
  bossTag: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: `${C.warning}30`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6,
  },
  bossTagText: { fontSize: 10, color: C.warning, fontWeight: 'bold', letterSpacing: 1 },
  modeTag: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  modeTagText: { fontSize: 10, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  modeTimerBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  modeTimerText: { fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 0 },
  coinBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: `${C.gold}14`,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, gap: 4, marginRight: 8,
    borderWidth: 1, borderColor: `${C.gold}35`,
  },
  coinText: { fontSize: 12, color: C.gold, fontWeight: 'bold' },
  body: { flex: 1, backgroundColor: C.background, overscrollBehavior: 'none' },
  bodyContent: { paddingBottom: 28, backgroundColor: C.background },
  survivalBody: { backgroundColor: 'transparent' },
  survivalBodyContent: { backgroundColor: 'transparent' },
  statsBar: {
    flexDirection: 'row', justifyContent: 'center', gap: 12,
    paddingVertical: 10, paddingHorizontal: 16,
  },
  statChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: `${C.card}D8`, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10,
    borderWidth: 1, borderColor: `${C.rune || C.primary}25`,
  },
  statChipText: { fontSize: 11, color: C.textLight, fontWeight: '600' },
  hintBanner: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: `${C.warning}18`,
    marginHorizontal: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, gap: 8, marginBottom: 8,
    borderWidth: 1, borderColor: `${C.warning}35`,
  },
  hintText: { fontSize: 13, color: C.textLight, flex: 1, lineHeight: 18 },
  callBanner: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: `${C.secondary}18`,
    marginHorizontal: 16, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10, gap: 8, marginBottom: 8,
    borderWidth: 1, borderColor: `${C.secondary}35`,
  },
  explanationBox: { marginHorizontal: 16, marginTop: 12, padding: 14, borderRadius: 12, borderWidth: 1 },
  correctBox: { backgroundColor: `${C.success}20`, borderColor: `${C.success}45`, borderLeftWidth: 3, borderLeftColor: C.success },
  wrongBox: { backgroundColor: `${C.danger}20`, borderColor: `${C.danger}45`, borderLeftWidth: 3, borderLeftColor: C.danger },
  explanationHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  explanationTitle: { fontSize: 15, fontWeight: 'bold' },
  explanationText: { fontSize: 13, color: C.textLight, lineHeight: 19 },
  bottomSection: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20 },
  submitBtn: {
    backgroundColor: C.primary, paddingVertical: 14, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 4,
    borderWidth: 1, borderColor: `${C.gold}55`,
  },
  btnDisabled: { opacity: 0.4 },
  submitBtnText: { color: C.white, fontSize: 15, fontWeight: 'bold' },
  nextBtn: {
    backgroundColor: C.success, paddingVertical: 14, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    borderWidth: 1, borderColor: `${C.gold}45`,
  },
  nextBtnText: { color: C.white, fontSize: 15, fontWeight: 'bold' },
  damageFlash: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(244, 67, 54, 0.65)',
    zIndex: 20, elevation: 20,
  },
  gameOverOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(10, 4, 8, 0.92)',
    justifyContent: 'center', alignItems: 'center', paddingHorizontal: 22,
    zIndex: 30, elevation: 30,
  },
  gameOverPanel: {
    width: '100%', maxWidth: 460, alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 32, borderRadius: 16, borderWidth: 2,
    borderColor: `${C.heart}90`, backgroundColor: 'rgba(26, 15, 10, 0.96)',
    shadowColor: C.heart, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45, shadowRadius: 18, elevation: 12, overflow: 'hidden',
  },
  gameOverRune: {
    position: 'absolute', top: -70, width: 180, height: 180, borderRadius: 90,
    borderWidth: 2, borderColor: 'rgba(255, 215, 0, 0.16)',
    backgroundColor: 'rgba(244, 67, 54, 0.08)',
  },
  brokenHeartWrap: {
    width: 116, height: 116, borderRadius: 58, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(244, 67, 54, 0.14)', borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.35)', marginBottom: 16,
  },
  gameOverTitle: {
    fontSize: 40, lineHeight: 48, color: C.white, fontWeight: '900', textAlign: 'center',
    textShadowColor: C.heart, textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 18,
  },
  gameOverSubtitle: {
    maxWidth: 330, color: '#F0D9C7', fontSize: 15, lineHeight: 22,
    textAlign: 'center', marginTop: 10, marginBottom: 26,
  },
  gameOverButtons: { width: '100%', gap: 12 },
  gameOverButton: {
    minHeight: 54, borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.45)',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: C.black, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.26, shadowRadius: 8, elevation: 4,
  },
  tryAgainButton: { backgroundColor: C.danger },
  homeButton: { backgroundColor: C.primaryDark || C.primary },
  gameOverButtonActive: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  gameOverButtonText: { color: C.white, fontSize: 17, fontWeight: '800' },
});
