export const DIFFICULTY = {
  easy: {
    label: 'Easy',
    color: '#4CAF50',
    icon: 'leaf',
    lives: 5,
    xpMult: 1.0,
    scoreMult: 1.0,
    questionsCount: 4,
    timePerQuestion: 60,
    desc: '5 lives, 4 questions, relaxed pace',
  },
  normal: {
    label: 'Normal',
    color: '#2196F3',
    icon: 'shield',
    lives: 3,
    xpMult: 1.5,
    scoreMult: 1.5,
    questionsCount: 6,
    timePerQuestion: 45,
    desc: '3 lives, 6 questions, balanced challenge',
  },
  hard: {
    label: 'Hard',
    color: '#FF9800',
    icon: 'flame',
    lives: 3,
    xpMult: 2.0,
    scoreMult: 2.0,
    questionsCount: 8,
    timePerQuestion: 30,
    desc: '3 lives, 8 questions, tougher',
  },
  extreme: {
    label: 'Extreme',
    color: '#F44336',
    icon: 'skull',
    lives: 1,
    xpMult: 3.0,
    scoreMult: 3.0,
    questionsCount: 10,
    timePerQuestion: 20,
    desc: '1 life, 10 questions, highest stakes',
  },
};

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 800, 1200, 1700, 2300, 3000, 3800,
  4700, 5700, 6800, 8000, 9300, 10700, 12200, 13800, 15500, 17300,
];

export const PLAYER_TITLES = [
  'Novice', 'Apprentice', 'Math Cadet', 'Number Knight',
  'Algebra Adept', 'Geometry Guardian', 'Calculus Crusader',
  'Function Master', 'Math Sage', 'Grand Numerian',
  'Derivative Lord', 'Integral King', 'Math Overlord',
  'Supreme Solver', 'Legend of Numeria',
];

// Maps badge IDs to unlockable title suffixes earned through achievements
export const TITLE_UNLOCKS = {
  firstSteps: { title: 'the Beginner', desc: 'Complete your first level to unlock this title' },
  onFire: { title: 'the Blazing', desc: 'Get 5 consecutive correct answers to unlock this title' },
  perfectScore: { title: 'the Perfect', desc: 'Score 100% on a level to unlock this title' },
  moduleMaster: { title: 'Module Master', desc: 'Complete all levels in a module to unlock this title' },
  savior: { title: "Numeria's Chosen", desc: 'Complete all 100 missions to unlock this title' },
  trader: { title: 'the Wealthy', desc: 'Collect 1000 coins to unlock this title' },
  extremeSurvivor: { title: 'the Unbroken', desc: 'Complete a level on Extreme difficulty to unlock this title' },
};

// Maps badge IDs to avatar IDs for free achievement-based unlocks
export const BADGE_AVATAR_UNLOCKS = {
  firstSteps: 1,      // Number Ninja
  perfectScore: 2,    // Geo Explorer
  moduleMaster: 3,    // Function Pro
  onFire: 4,          // Blazing Hero
  trader: 5,          // Trader Tycoon
  extremeSurvivor: 6, // Extreme Survivor
  savior: 7,          // Savior of Numeria
};

export const calculatePlayerLevel = (xp) => {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return i + 1;
  }
  return 1;
};

export const getXPForLevel = (level) => {
  return LEVEL_THRESHOLDS[Math.min(level - 1, LEVEL_THRESHOLDS.length - 1)] || 0;
};

export const getXPToNextLevel = (level) => {
  const idx = Math.min(level, LEVEL_THRESHOLDS.length - 1);
  return LEVEL_THRESHOLDS[idx] - LEVEL_THRESHOLDS[idx - 1];
};

export const getXPProgress = (xp) => {
  const level = calculatePlayerLevel(xp);
  const current = getXPForLevel(level);
  const next = LEVEL_THRESHOLDS[Math.min(level, LEVEL_THRESHOLDS.length - 1)] || current + 500;
  return { level, currentXP: xp - current, neededXP: next - current, title: getPlayerTitle(level) };
};

export const getPlayerTitle = (level) => {
  return PLAYER_TITLES[Math.min(level - 1, PLAYER_TITLES.length - 1)] || 'Legend of Numeria';
};

// Returns all achievement-based titles the player has unlocked
export const getUnlockedTitles = (badges) => {
  const titles = [];
  for (const [badgeId, unlock] of Object.entries(TITLE_UNLOCKS)) {
    if (badges.includes(badgeId)) {
      titles.push({ badgeId, ...unlock });
    }
  }
  return titles;
};

// Returns a display title string combining level title and earned achievement title
export const getFullDisplayTitle = (playerLevel, badges) => {
  const baseTitle = getPlayerTitle(playerLevel);
  const unlocked = getUnlockedTitles(badges);
  if (unlocked.length > 0) {
    // Use the most prestigious title (last one earned)
    const bestTitle = unlocked[unlocked.length - 1];
    return `${baseTitle} - ${bestTitle.title}`;
  }
  return baseTitle;
};

export const calculateScore = ({ correct, difficulty, streak, timeBonus }) => {
  const config = DIFFICULTY[difficulty] || DIFFICULTY.normal;
  const basePoints = 100;
  const streakMultiplier = Math.min(1.0 + streak * 0.1, 2.0);
  return Math.round(basePoints * config.scoreMult * streakMultiplier * (correct ? 1 : 0) + (timeBonus || 0));
};

export const calculateXP = ({ correct, difficulty, streak }) => {
  if (!correct) return 0;
  const config = DIFFICULTY[difficulty] || DIFFICULTY.normal;
  const baseXP = 20;
  const streakBonus = Math.min(streak * 2, 10);
  return Math.round((baseXP + streakBonus) * config.xpMult);
};

export const calculateStars = (score, maxScore) => {
  const ratio = maxScore > 0 ? score / maxScore : 0;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.4) return 1;
  return 0;
};

export const regenLives = (lives, lastRegen, maxLives = 3, regenMinutes = 30) => {
  if (lives >= maxLives) return { lives, lastRegen };
  const now = Date.now();
  const elapsed = now - lastRegen;
  const regenMs = regenMinutes * 60 * 1000;
  const newLives = Math.min(lives + Math.floor(elapsed / regenMs), maxLives);
  const newLastRegen = newLives >= maxLives ? now : lastRegen + (elapsed % regenMs);
  return { lives: newLives, lastRegen: newLastRegen };
};

export const timeUntilNextLife = (lastRegen, regenMinutes = 30) => {
  const elapsed = Date.now() - lastRegen;
  const regenMs = regenMinutes * 60 * 1000;
  const remaining = regenMs - (elapsed % regenMs);
  return Math.max(0, remaining);
};

export const formatTime = (ms) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
};

export const BADGES = {
  firstSteps: { id: 'firstSteps', name: 'First Steps', desc: 'Complete your first level', icon: 'medal' },
  onFire: { id: 'onFire', name: 'On Fire', desc: 'Get 5 consecutive correct answers', icon: 'flame' },
  perfectScore: { id: 'perfectScore', name: 'Perfect Score', desc: 'Complete a level with 100% accuracy', icon: 'checkmark-done' },
  speedDemon: { id: 'speedDemon', name: 'Speed Demon', desc: 'Complete timed challenge with full marks', icon: 'flash' },
  moduleMaster: { id: 'moduleMaster', name: 'Module Master', desc: 'Complete all levels in a module', icon: 'shield' },
  savior: { id: 'savior', name: "Numeria's Savior", desc: 'Complete the entire game', icon: 'crown' },
  trader: { id: 'trader', name: 'Trader Tycoon', desc: 'Collect 1000 coins', icon: 'cash' },
  bookworm: { id: 'bookworm', name: 'Bookworm', desc: 'View 10 solution explanations', icon: 'book' },
  comeback: { id: 'comeback', name: 'Comeback King', desc: 'Complete a level without losing lives', icon: 'repeat' },
  extremeSurvivor: { id: 'extremeSurvivor', name: 'Extreme Survivor', desc: 'Complete a level on Extreme difficulty', icon: 'skull' },
};

export const checkBadges = (state, newState) => {
  const earned = [];
  const allBadges = Object.values(BADGES);

  for (const badge of allBadges) {
    if (newState.badges.includes(badge.id)) continue;
    let earnedIt = false;

    switch (badge.id) {
      case 'firstSteps':
        earnedIt = Object.values(newState.moduleProgress).some(m => m.levelsCompleted.length > 0);
        break;
      case 'onFire':
        earnedIt = newState.longestStreak >= 5;
        break;
      case 'perfectScore':
        earnedIt = Object.values(newState.moduleProgress).some(m =>
          Object.values(m.stars).some(s => s === 3)
        );
        break;
      case 'trader':
        earnedIt = newState.coins >= 1000;
        break;
      case 'comeback':
        earnedIt = Object.values(newState.moduleProgress).some(m =>
          Object.values(m.bestScores).length > 0
        );
        break;
      case 'moduleMaster':
        earnedIt = Object.values(newState.moduleProgress).some(m => m.completed);
        break;
      case 'savior':
        earnedIt = (newState.missionProgress?.completed?.length || 0) >= 100;
        break;
    }

    if (earnedIt) {
      earned.push(badge);
    }
  }

  return earned;
};