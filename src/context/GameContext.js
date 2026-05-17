import React, { createContext, useContext, useReducer, useEffect, useCallback, useState, useRef } from 'react';
import { AppState } from 'react-native';
import { loadGameState, saveGameState } from '../utils/storage';
import { calculateStars, regenLives, checkBadges, calculatePlayerLevel, DIFFICULTY, BADGE_AVATAR_UNLOCKS } from '../utils/gameLogic';
import { soundManager } from '../utils/SoundManager';
import { useTheme } from '../theme/ThemeContext';

const GameContext = createContext();

const DIFFICULTY_KEYS = ['easy', 'normal', 'hard', 'extreme'];

const createDefaultMissionProgress = () => ({
  completed: [],
  bestScores: {},
  accuracy: {},
  stars: {},
});

const createDefaultModuleProgress = () => ({
  completed: false,
  levelsCompleted: [],
  bestScores: {},
  accuracy: {},
  stars: {},
});

const createModuleProgress = () => ({
  1: createDefaultModuleProgress(),
  2: createDefaultModuleProgress(),
  3: createDefaultModuleProgress(),
  4: createDefaultModuleProgress(),
  5: createDefaultModuleProgress(),
});

const normalizeModuleProgress = (progress) => {
  const normalized = createModuleProgress();
  Object.keys(normalized).forEach((key) => {
    normalized[key] = {
      ...normalized[key],
      ...(progress?.[key] || {}),
      bestScores: progress?.[key]?.bestScores || {},
      accuracy: progress?.[key]?.accuracy || {},
      stars: progress?.[key]?.stars || {},
      levelsCompleted: Array.isArray(progress?.[key]?.levelsCompleted) ? progress[key].levelsCompleted : [],
    };
  });
  return normalized;
};

const normalizeMissionProgress = (progress) => ({
  completed: Array.isArray(progress?.completed) ? progress.completed : [],
  bestScores: progress?.bestScores || {},
  accuracy: progress?.accuracy || {},
  stars: progress?.stars || {},
});

const createMissionProgressByDifficulty = () => (
  DIFFICULTY_KEYS.reduce((acc, key) => {
    acc[key] = createDefaultMissionProgress();
    return acc;
  }, {})
);

const normalizeMissionProgressByDifficulty = (progressByDifficulty, fallbackProgress) => {
  const normalized = createMissionProgressByDifficulty();
  let hasDifficultyProgress = false;
  DIFFICULTY_KEYS.forEach((key) => {
    if (progressByDifficulty?.[key]) {
      normalized[key] = normalizeMissionProgress(progressByDifficulty[key]);
      hasDifficultyProgress = hasDifficultyProgress
        || normalized[key].completed.length > 0
        || Object.keys(normalized[key].bestScores).length > 0
        || Object.keys(normalized[key].stars).length > 0;
    }
  });

  if (!hasDifficultyProgress && fallbackProgress) {
    normalized.normal = normalizeMissionProgress(fallbackProgress);
  }

  return normalized;
};

const initialState = {
  lives: 3,
  maxLives: 3,
  lastLifeRegen: Date.now(),
  coins: 0,
  badges: [],
  xp: 0,
  difficulty: 'normal',
  activeMode: 'story',
  hasChosenDifficulty: false,
  currentModule: 1,
  currentLevel: 1,
  avatarIndex: 0,
  unlockedAvatars: [0],
  selectedTheme: 'light',
  unlockedThemes: ['light'],
  moduleProgress: createModuleProgress(),
  missionProgress: createDefaultMissionProgress(),
  missionProgressByDifficulty: createMissionProgressByDifficulty(),
  totalCorrect: 0,
  totalAnswered: 0,
  longestStreak: 0,
  streak: 0,
  preTestScore: null,
  postTestScore: null,
  completedLevelsOnExtreme: [],
  survivalTrophy: 0,
  timeTrophy: 0,
  soundEnabled: true,
  lastDailyReward: null,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE': {
      const payload = action.payload || {};
      const missionProgress = normalizeMissionProgress(payload.missionProgress || state.missionProgress);
      return {
        ...state,
        ...payload,
        moduleProgress: normalizeModuleProgress(payload.moduleProgress || state.moduleProgress),
        missionProgress,
        missionProgressByDifficulty: normalizeMissionProgressByDifficulty(
          payload.missionProgressByDifficulty,
          missionProgress
        ),
      };
    }

    case 'SET_DIFFICULTY': {
      const diff = action.payload;
      const config = DIFFICULTY[diff] || DIFFICULTY.normal;
      return { ...state, difficulty: diff, maxLives: config.lives, lives: config.lives, hasChosenDifficulty: true };
    }

    case 'SET_PLAY_MODE':
      return { ...state, activeMode: action.payload || 'story' };

    case 'USE_LIFE':
      return { ...state, lives: Math.max(0, state.lives - 1) };

    case 'REFILL_LIVES':
      return { ...state, lives: state.maxLives };

    case 'ADD_COINS':
      return { ...state, coins: state.coins + action.payload };

    case 'ADD_XP':
      return { ...state, xp: state.xp + action.payload };

    case 'REGEN_LIVES':
      return { ...state, lives: action.payload.lives, lastLifeRegen: action.payload.lastRegen };

    case 'ANSWER_CORRECT': {
      const newStreak = state.streak + 1;
      return {
        ...state,
        totalCorrect: state.totalCorrect + 1,
        totalAnswered: state.totalAnswered + 1,
        streak: newStreak,
        longestStreak: Math.max(state.longestStreak, newStreak),
      };
    }

    case 'ANSWER_WRONG':
      return {
        ...state,
        totalAnswered: state.totalAnswered + 1,
        streak: 0,
      };

    case 'COMPLETE_LEVEL': {
      const { moduleId, levelId, missionId, score, maxScore, accuracy, xpEarned, difficulty } = action.payload;
      const difficultyKey = difficulty || state.difficulty || 'normal';
      const mod = state.moduleProgress[moduleId] || createDefaultModuleProgress();
      const stars = calculateStars(score, maxScore, accuracy);
      const passed = stars > 0;
      const prevBest = mod.bestScores[levelId] || 0;
      const newLevels = !passed || mod.levelsCompleted.includes(levelId)
        ? mod.levelsCompleted
        : [...mod.levelsCompleted, levelId];
      const newScores = { ...mod.bestScores, [levelId]: Math.max(prevBest, score) };
      const newAccuracy = { ...mod.accuracy, [levelId]: accuracy };
      const newStars = { ...mod.stars, [levelId]: Math.max(mod.stars[levelId] || 0, stars) };
      const allLevelsDone = newLevels.length >= 4;

      let newExtreme = state.completedLevelsOnExtreme;
      if (passed && state.difficulty === 'extreme') {
        newExtreme = state.completedLevelsOnExtreme.includes(`${moduleId}-${levelId}`)
          ? state.completedLevelsOnExtreme
          : [...state.completedLevelsOnExtreme, `${moduleId}-${levelId}`];
      }

      const currentProgressByDifficulty = normalizeMissionProgressByDifficulty(
        state.missionProgressByDifficulty,
        state.missionProgress
      );
      const currentMissionProgress = normalizeMissionProgress(
        currentProgressByDifficulty[difficultyKey] || state.missionProgress
      );
      let newMissionProgress = currentMissionProgress;
      let newMissionProgressByDifficulty = currentProgressByDifficulty;

      if (missionId) {
        const missionKey = Number(missionId);
        const prevMissionBest = currentMissionProgress.bestScores?.[missionKey] || 0;
        const completedMissions = currentMissionProgress.completed || [];
        newMissionProgress = {
          ...currentMissionProgress,
          completed: !passed || completedMissions.includes(missionKey)
            ? completedMissions
            : [...completedMissions, missionKey],
          bestScores: {
            ...(currentMissionProgress.bestScores || {}),
            [missionKey]: Math.max(prevMissionBest, score),
          },
          accuracy: {
            ...(currentMissionProgress.accuracy || {}),
            [missionKey]: accuracy,
          },
          stars: {
            ...(currentMissionProgress.stars || {}),
            [missionKey]: Math.max(currentMissionProgress.stars?.[missionKey] || 0, stars),
          },
        };
        newMissionProgressByDifficulty = {
          ...currentProgressByDifficulty,
          [difficultyKey]: newMissionProgress,
        };
      }

      return {
        ...state,
        xp: state.xp + (xpEarned || 0),
        moduleProgress: {
          ...state.moduleProgress,
          [moduleId]: {
            ...mod,
            completed: allLevelsDone,
            levelsCompleted: newLevels,
            bestScores: newScores,
            accuracy: newAccuracy,
            stars: newStars,
          },
        },
        missionProgress: newMissionProgress,
        missionProgressByDifficulty: newMissionProgressByDifficulty,
        completedLevelsOnExtreme: newExtreme,
      };
    }

    case 'ADD_BADGE':
      return {
        ...state,
        badges: state.badges.includes(action.payload) ? state.badges : [...state.badges, action.payload],
      };

    case 'UNLOCK_AVATAR':
      return {
        ...state,
        unlockedAvatars: state.unlockedAvatars.includes(action.payload)
          ? state.unlockedAvatars
          : [...state.unlockedAvatars, action.payload],
      };

    case 'SET_AVATAR':
      return { ...state, avatarIndex: action.payload };

    case 'UNLOCK_THEME':
      return {
        ...state,
        unlockedThemes: (state.unlockedThemes || ['light']).includes(action.payload)
          ? (state.unlockedThemes || ['light'])
          : [...(state.unlockedThemes || ['light']), action.payload],
      };

    case 'SET_THEME':
      return {
        ...state,
        selectedTheme: (state.unlockedThemes || ['light']).includes(action.payload) ? action.payload : state.selectedTheme,
      };

    case 'SET_PRE_TEST':
      return { ...state, preTestScore: action.payload };

    case 'SET_POST_TEST':
      return { ...state, postTestScore: action.payload };

    case 'SET_CURRENT_LEVEL':
      return { ...state, currentModule: action.payload.moduleId, currentLevel: action.payload.levelId };

    case 'TOGGLE_SOUND':
      return { ...state, soundEnabled: !state.soundEnabled };

    case 'SET_SOUND_ENABLED':
      return { ...state, soundEnabled: action.payload };

    case 'CLAIM_DAILY_REWARD':
      return { ...state, coins: state.coins + action.payload.coins, xp: state.xp + action.payload.xp, lastDailyReward: Date.now() };

    case 'SET_MODE_TROPHY': {
      const { mode, score } = action.payload;
      if (mode === 'survival') {
        return { ...state, survivalTrophy: Math.max(state.survivalTrophy, score) };
      }
      if (mode === 'timer') {
        return { ...state, timeTrophy: Math.max(state.timeTrophy, score) };
      }
      return state;
    }

    case 'RESET':
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [loaded, setLoaded] = useState(false);
  const { setDifficultyAccent, setThemeMode } = useTheme();

  useEffect(() => {
    (async () => {
      const saved = await loadGameState();
      const regen = regenLives(saved.lives, saved.lastLifeRegen, saved.maxLives);
      dispatch({ type: 'LOAD_STATE', payload: { ...saved, lives: regen.lives, lastLifeRegen: regen.lastRegen } });
      soundManager.init();
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) {
      const regen = regenLives(state.lives, state.lastLifeRegen, state.maxLives);
      if (regen.lives !== state.lives) {
        dispatch({ type: 'REGEN_LIVES', payload: regen });
      }
      const interval = setInterval(() => {
        const r = regenLives(state.lives, state.lastLifeRegen, state.maxLives);
        if (r.lives !== state.lives) {
          dispatch({ type: 'REGEN_LIVES', payload: r });
        }
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [loaded, state.lives, state.lastLifeRegen, state.maxLives]);

  useEffect(() => {
    setDifficultyAccent(state.difficulty);
  }, [state.difficulty, setDifficultyAccent]);

  useEffect(() => {
    setThemeMode(state.selectedTheme || 'light');
  }, [state.selectedTheme, setThemeMode]);

  const saveTimeoutRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;
  const lastBadgeCheckRef = useRef(0);

  useEffect(() => {
    if (loaded) {
      soundManager.setEnabled(state.soundEnabled);
    }
  }, [loaded, state.soundEnabled]);

  useEffect(() => {
    if (!loaded) return;
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      saveGameState(stateRef.current);
    }, 1500);
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [loaded, state]);

  useEffect(() => {
    if (!loaded) return;
    const now = Date.now();
    if (now - lastBadgeCheckRef.current < 3000) return;
    lastBadgeCheckRef.current = now;
    const newBadges = checkBadges(state, state);
    for (const badge of newBadges) {
      dispatch({ type: 'ADD_BADGE', payload: badge.id });
      const avatarId = BADGE_AVATAR_UNLOCKS[badge.id];
      if (avatarId !== undefined && !state.unlockedAvatars.includes(avatarId)) {
        dispatch({ type: 'UNLOCK_AVATAR', payload: avatarId });
      }
    }
  }, [loaded, state.xp, state.coins, state.longestStreak, state.moduleProgress, state.missionProgress, state.badges]);

  useEffect(() => {
    if (!loaded || !saveTimeoutRef.current) return;
    const sub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'background' || nextState === 'inactive') {
        if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
        saveGameState(stateRef.current);
      }
    });
    return () => sub?.remove();
  }, [loaded]);

  const setDifficulty = useCallback((d) => dispatch({ type: 'SET_DIFFICULTY', payload: d }), []);
  const setPlayMode = useCallback((mode) => dispatch({ type: 'SET_PLAY_MODE', payload: mode }), []);
  const useLife = useCallback(() => dispatch({ type: 'USE_LIFE' }), []);
  const refillLives = useCallback(() => dispatch({ type: 'REFILL_LIVES' }), []);
  const addCoins = useCallback((amount) => dispatch({ type: 'ADD_COINS', payload: amount }), []);
  const addXP = useCallback((amount) => dispatch({ type: 'ADD_XP', payload: amount }), []);
  const answerCorrect = useCallback(() => dispatch({ type: 'ANSWER_CORRECT' }), []);
  const answerWrong = useCallback(() => dispatch({ type: 'ANSWER_WRONG' }), []);
  const completeLevel = useCallback((data) => dispatch({ type: 'COMPLETE_LEVEL', payload: data }), []);
  const addBadge = useCallback((id) => dispatch({ type: 'ADD_BADGE', payload: id }), []);
  const unlockAvatar = useCallback((idx) => dispatch({ type: 'UNLOCK_AVATAR', payload: idx }), []);
  const setAvatar = useCallback((idx) => dispatch({ type: 'SET_AVATAR', payload: idx }), []);
  const unlockTheme = useCallback((themeId) => dispatch({ type: 'UNLOCK_THEME', payload: themeId }), []);
  const setThemePreference = useCallback((themeId) => dispatch({ type: 'SET_THEME', payload: themeId }), []);
  const setPreTest = useCallback((s) => dispatch({ type: 'SET_PRE_TEST', payload: s }), []);
  const setPostTest = useCallback((s) => dispatch({ type: 'SET_POST_TEST', payload: s }), []);
  const setCurrentLevel = useCallback((m, l) => dispatch({ type: 'SET_CURRENT_LEVEL', payload: { moduleId: m, levelId: l } }), []);
  const resetProgress = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const toggleSound = useCallback(() => dispatch({ type: 'TOGGLE_SOUND' }), []);
  const setSoundEnabled = useCallback((enabled) => dispatch({ type: 'SET_SOUND_ENABLED', payload: enabled }), []);

  const claimDailyReward = useCallback((coins, xp) => {
    dispatch({ type: 'CLAIM_DAILY_REWARD', payload: { coins, xp } });
  }, []);

  const setModeTrophy = useCallback((mode, score) => {
    dispatch({ type: 'SET_MODE_TROPHY', payload: { mode, score } });
  }, []);

  const playerLevel = calculatePlayerLevel(state.xp);

  return (
    <GameContext.Provider
      value={{
        state,
        loaded,
        playerLevel,
        setDifficulty,
        setPlayMode,
        useLife,
        refillLives,
        addCoins,
        addXP,
        answerCorrect,
        answerWrong,
        completeLevel,
        addBadge,
        unlockAvatar,
        setAvatar,
        unlockTheme,
        setThemePreference,
        setPreTest,
        setPostTest,
        setCurrentLevel,
        resetProgress,
        toggleSound,
        setSoundEnabled,
        claimDailyReward,
        setModeTrophy,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within GameProvider');
  return context;
}
