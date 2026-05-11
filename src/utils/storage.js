import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  GAME_STATE: '@mathquest_game_state',
};

const createMissionProgress = () => ({
  completed: [],
  bestScores: {},
  accuracy: {},
  stars: {},
});

const createMissionProgressByDifficulty = () => ({
  easy: createMissionProgress(),
  normal: createMissionProgress(),
  hard: createMissionProgress(),
  extreme: createMissionProgress(),
});

const DEFAULT_STATE = {
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
  moduleProgress: {
    1: { completed: false, levelsCompleted: [], bestScores: {}, accuracy: {}, stars: {} },
    2: { completed: false, levelsCompleted: [], bestScores: {}, accuracy: {}, stars: {} },
    3: { completed: false, levelsCompleted: [], bestScores: {}, accuracy: {}, stars: {} },
    4: { completed: false, levelsCompleted: [], bestScores: {}, accuracy: {}, stars: {} },
  },
  missionProgress: createMissionProgress(),
  missionProgressByDifficulty: createMissionProgressByDifficulty(),
  totalCorrect: 0,
  totalAnswered: 0,
  streak: 0,
  longestStreak: 0,
  preTestScore: null,
  postTestScore: null,
  weeklyPlayTime: 0,
  completedLevelsOnExtreme: [],
  soundEnabled: true,
  lastDailyReward: null,
};

export const loadGameState = async () => {
  try {
    const json = await Promise.race([
      AsyncStorage.getItem(KEYS.GAME_STATE),
      new Promise(resolve => setTimeout(() => resolve(null), 2000)),
    ]);
    if (json) {
      const saved = JSON.parse(json);
      return { ...DEFAULT_STATE, ...saved };
    }
    return { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
};

export const saveGameState = async (state) => {
  try {
    const json = JSON.stringify(state);
    await AsyncStorage.setItem(KEYS.GAME_STATE, json);
  } catch (e) {
    console.warn('Failed to save game state:', e);
  }
};

export const resetProgress = async () => {
  try {
    await AsyncStorage.removeItem(KEYS.GAME_STATE);
    return { ...DEFAULT_STATE };
  } catch {
    return { ...DEFAULT_STATE };
  }
};
