export const MISSION_TOTAL = 100;

export const STORY_DIFFICULTY_PATHS = {
  easy: {
    id: 'easy',
    label: 'Apprentice Trail',
    progressLabel: 'Apprentice Progress',
    characterName: 'Lira',
    characterRole: 'Royal Guide',
    characterIcon: 'sparkles',
    sceneIcon: 'leaf',
    color: '#4CAF50',
    sky: '#DDF7F0',
    hill: '#82C772',
    ridge: '#3E8F58',
    road: '#C8914C',
    clearBonusXP: 8,
    storyPrefix: 'On the Apprentice Trail, the kingdom keeps the danger low while Lira teaches the first method.',
    storyTwist: 'Your goal is to learn the pattern, protect the people nearby, and earn steady XP.',
    guide: 'Read the clue, identify the topic, then answer at a relaxed pace before the timer runs out.',
  },
  normal: {
    id: 'normal',
    label: 'Knight Route',
    progressLabel: 'Knight Progress',
    characterName: 'Sir Caldus',
    characterRole: 'Battle Tutor',
    characterIcon: 'shield-checkmark',
    sceneIcon: 'shield',
    color: '#2196F3',
    sky: '#DCEEFF',
    hill: '#6AA7D9',
    ridge: '#2C6BA2',
    road: '#9A7751',
    clearBonusXP: 14,
    storyPrefix: 'On the Knight Route, Numeria sends you into the main campaign where lessons and battles stay balanced.',
    storyTwist: 'Clear the mission to advance your knight progress and gain stronger XP rewards.',
    guide: 'Study the guide, listen to the tutor, then solve each challenge with balanced time pressure.',
  },
  hard: {
    id: 'hard',
    label: 'Warden March',
    progressLabel: 'Warden Progress',
    characterName: 'Mira',
    characterRole: 'Tactical Mage',
    characterIcon: 'flame',
    sceneIcon: 'flame',
    color: '#FF9800',
    sky: '#FFEBD1',
    hill: '#C87936',
    ridge: '#884E24',
    road: '#6F4A2E',
    clearBonusXP: 24,
    storyPrefix: 'On the Warden March, enemies change the rules faster and every lesson must be used with precision.',
    storyTwist: 'Survive the tougher route to push a separate hard-mode progress path and earn higher XP.',
    guide: 'Use the topic rule quickly, check each option, and protect your lives because mistakes cost more here.',
  },
  extreme: {
    id: 'extreme',
    label: 'Crown Trial',
    progressLabel: 'Crown Progress',
    characterName: 'Astra',
    characterRole: 'Crown Oracle',
    characterIcon: 'skull',
    sceneIcon: 'skull',
    color: '#F44336',
    sky: '#F8D8D1',
    hill: '#A6473E',
    ridge: '#5C1F22',
    road: '#3D2415',
    clearBonusXP: 40,
    storyPrefix: 'On the Crown Trial, the corrupted relic tests your mastery with the most dangerous version of the story.',
    storyTwist: 'Only this difficulty records Crown progress, and victory grants the largest XP reward.',
    guide: 'Plan before tapping, use hints wisely, and treat every question like a boss strike.',
  },
};

export const PLAY_MODES = {
  story: {
    id: 'story',
    label: 'Story',
    title: 'Story Mode',
    icon: 'book',
    color: '#7C3AED',
    description: 'Follow the kingdom quest and unlock missions one by one.',
  },
  survival: {
    id: 'survival',
    label: 'Survival',
    title: 'Survival Mode',
    icon: 'heart',
    color: '#EF4444',
    description: 'Hold your ground through longer battles with no countdown.',
  },
  timer: {
    id: 'timer',
    label: 'Timer',
    title: 'Timer Mode',
    icon: 'timer',
    color: '#0EA5E9',
    description: 'Race the clock with faster questions and bonus pressure.',
  },
};

export const MISSION_REGIONS = [
  {
    id: 1,
    moduleId: 1,
    name: 'Village of Traders',
    title: 'The Broken Ledger',
    color: '#4CAF50',
    icon: 'storefront',
    boss: 'The Debt Warden',
    topic: 'arithmetic and math literacy',
    opening: 'Coins vanish from market stalls as Numeria\'s ledgers turn blank.',
    arc: [
      'Balance the first trade books and earn the trust of the market scouts.',
      'Trace the missing coins through old invoices and merchant riddles.',
      'Repair the village exchange board before panic reaches the gates.',
      'Expose the false taxes hidden inside the royal caravan records.',
      'Break the Debt Warden\'s seal and restore honest trade to Numeria.',
    ],
  },
  {
    id: 2,
    moduleId: 2,
    name: 'City of Architects',
    title: 'The Shattered Blueprint',
    color: '#2196F3',
    icon: 'shapes',
    boss: 'The Angle Wraith',
    topic: 'geometry',
    opening: 'The capital walls twist out of shape after the royal compass is stolen.',
    arc: [
      'Read the mason marks and rebuild the city\'s first safe crossing.',
      'Follow angle clues through towers that rotate under moonlight.',
      'Restore the plaza grid before the bridge stones drift apart.',
      'Use hidden measurements to seal cracks in the crystal dome.',
      'Defeat the Angle Wraith and return order to the city plans.',
    ],
  },
  {
    id: 3,
    moduleId: 3,
    name: 'Data Kingdom',
    title: 'The Vanishing Pattern',
    color: '#9C27B0',
    icon: 'git-branch',
    boss: 'The Function Phantom',
    topic: 'relations and functions',
    opening: 'Maps, codes, and royal messages lose their patterns overnight.',
    arc: [
      'Reconnect scattered pairs so the messenger routes make sense again.',
      'Decode input and output runes in the archives beneath the palace.',
      'Find the rule that links the broken signals across the data towers.',
      'Separate true functions from illusions in the Phantom\'s hall.',
      'Trap the Function Phantom inside its own perfect mapping.',
    ],
  },
  {
    id: 4,
    moduleId: 4,
    name: 'City of Motion',
    title: 'The Frozen Road',
    color: '#F44336',
    icon: 'trending-up',
    boss: 'The Slope Shadow',
    topic: 'linear functions',
    opening: 'Roads stop moving, carts hang in midair, and every path loses direction.',
    arc: [
      'Restart the road markers by reading change in every step.',
      'Track moving carts through tables, graphs, and steady rates.',
      'Recover the lost intercepts hidden in the city watch routes.',
      'Use slope spells to reopen the royal highway.',
      'Face the Slope Shadow and set Numeria in motion again.',
    ],
  },
];

export const TOPIC_LESSONS = {
  1: {
    title: 'Trade Math Briefing',
    topic: 'arithmetic and math literacy',
    rule: 'For money problems, find the quantity, price, percent, or total first before choosing an operation.',
    activity: 'You will solve market, budget, graph, and interest problems to repair Numeria\'s ledgers.',
    dialog: {
      easy: 'Start with the numbers you can see. Multiply for totals, subtract for change, and slow down when a percent appears.',
      normal: 'Read the situation like a receipt. Label each value, build the equation, then check if the answer makes sense in pesos.',
      hard: 'The trick is usually hidden in the order. Find the original value, apply markup or discount, then compare the result.',
      extreme: 'Do not chase the first answer. Convert the percent, write the relationship, and protect every life with a full check.',
    },
  },
  2: {
    title: 'Geometry Briefing',
    topic: 'angle relationships',
    rule: 'Classify the angle first, then use the relationship: complementary is 90, supplementary is 180, and vertical angles are equal.',
    activity: 'You will inspect buildings, bridges, and transversals to restore the city blueprint.',
    dialog: {
      easy: 'Look at the angle type before computing. Right, acute, obtuse, complementary, and supplementary clues guide the answer.',
      normal: 'Turn the geometry clue into an equation. If angles share a line, they sum to 180; if they complete a corner, they sum to 90.',
      hard: 'Parallel lines create matching and supplementary pairs. Name the pair first so the equation becomes clear.',
      extreme: 'Every mark matters. Prove which angle pair you are using before solving for x.',
    },
  },
  3: {
    title: 'Pattern Briefing',
    topic: 'relations and functions',
    rule: 'Track each input to its output. A relation is a function only when every input has exactly one output.',
    activity: 'You will reconnect pairs, read mappings, and expose false functions in the data towers.',
    dialog: {
      easy: 'Match each input with its output and look for repeats. A repeated input with two outputs breaks the function rule.',
      normal: 'Use a table, mapping, or graph as evidence. One input can never send two different messages.',
      hard: 'Search for the hidden rule between x and y. Once the rule is known, predictions become safer.',
      extreme: 'Separate pattern from illusion. Test every pair and reject any mapping that gives one input two destinies.',
    },
  },
  4: {
    title: 'Motion Briefing',
    topic: 'linear functions',
    rule: 'For a line, slope is the rate of change and the intercept is where the pattern starts.',
    activity: 'You will read tables, graphs, rates, and intercepts to restart the roads of Numeria.',
    dialog: {
      easy: 'Find how much y changes when x changes. That steady change is the slope.',
      normal: 'Use rise over run, then look for the starting value. Together they describe the road.',
      hard: 'Tables, graphs, and equations tell the same story. Convert between them to expose the missing value.',
      extreme: 'Lock onto slope and intercept first. The wrong options usually confuse rate, start, and direction.',
    },
  },
};

const missionActions = [
  'Awaken', 'Scout', 'Defend', 'Decode', 'Restore',
  'Gather', 'Trace', 'Forge', 'Unlock', 'Challenge',
  'Rescue', 'Chart', 'Cleanse', 'Measure', 'Reveal',
  'Guard', 'Solve', 'Rebuild', 'Guide', 'Seal',
  'Rally', 'Cross', 'Confront', 'Storm', 'Liberate',
];

const missionObjects = [
  'the First Gate', 'the Hidden Stall', 'the Dawn Bridge', 'the Cipher Stone', 'the Market Bell',
  'the Lost Receipt', 'the Silver Route', 'the Trial Forge', 'the Moon Lock', 'the Watch Post',
  'the Lantern Path', 'the Archive Wall', 'the Shadow Ledger', 'the Compass Ring', 'the Secret Rule',
  'the Outer Ward', 'the Elder Puzzle', 'the Broken Span', 'the Hero Trail', 'the Royal Seal',
  'the Last Beacon', 'the High Crossing', 'the Dark Court', 'the Boss Keep', 'the Crown Road',
];

const getChapter = (localId) => Math.ceil(localId / 5);

const getLevelId = (localId) => ((localId - 1) % 4) + 1;

const buildMission = (_, index) => {
  const id = index + 1;
  const region = MISSION_REGIONS[Math.floor(index / 25)];
  const localId = ((id - 1) % 25) + 1;
  const chapter = getChapter(localId);
  const isBoss = localId === 25;
  const isGate = localId % 5 === 0;
  const title = isBoss
    ? `Mission ${id}: ${region.boss}'s Keep`
    : `Mission ${id}: ${missionActions[localId - 1]} ${missionObjects[localId - 1]}`;

  return {
    id,
    localId,
    chapter,
    regionId: region.id,
    regionName: region.name,
    regionTitle: region.title,
    moduleId: region.moduleId,
    levelId: getLevelId(localId),
    color: region.color,
    icon: isBoss ? 'skull' : isGate ? 'flag' : region.icon,
    title,
    shortTitle: isBoss ? `${region.boss}'s Keep` : missionObjects[localId - 1],
    objective: `Win a ${region.topic} battle to recover a Numerian relic.`,
    story: `${region.opening} ${region.arc[chapter - 1]}`,
    isBoss,
    isGate,
  };
};

export const STORY_MISSIONS = Array.from({ length: MISSION_TOTAL }, buildMission);

const createEmptyMissionProgress = () => ({
  completed: [],
  bestScores: {},
  accuracy: {},
  stars: {},
});

export const normalizeMissionProgress = (progress) => ({
  completed: Array.isArray(progress?.completed) ? progress.completed : [],
  bestScores: progress?.bestScores || {},
  accuracy: progress?.accuracy || {},
  stars: progress?.stars || {},
});

export const getStoryDifficultyPath = (difficulty) => (
  STORY_DIFFICULTY_PATHS[difficulty] || STORY_DIFFICULTY_PATHS.normal
);

export const getDifficultyMissionProgress = (state, difficulty) => {
  const key = difficulty || state?.difficulty || 'normal';
  const byDifficulty = state?.missionProgressByDifficulty;
  if (byDifficulty?.[key]) return normalizeMissionProgress(byDifficulty[key]);
  if (key === 'normal' && state?.missionProgress) return normalizeMissionProgress(state.missionProgress);
  return createEmptyMissionProgress();
};

export const getDifficultyMissionStory = (mission, difficulty) => {
  if (!mission) return '';
  const path = getStoryDifficultyPath(difficulty);
  return `${path.storyPrefix} ${mission.story} ${path.storyTwist}`;
};

export const getStoryLesson = ({ mission, level, difficulty, questionCount = 0 }) => {
  if (!mission) return null;
  const path = getStoryDifficultyPath(difficulty);
  const lesson = TOPIC_LESSONS[mission.moduleId];
  const count = questionCount || level?.questions?.length || 0;

  return {
    path,
    title: lesson?.title || 'Mission Briefing',
    topic: lesson?.topic || mission.topic,
    guide: path.guide,
    rule: lesson?.rule || mission.objective,
    activity: lesson?.activity || mission.objective,
    dialog: lesson?.dialog?.[path.id] || lesson?.dialog?.normal || mission.story,
    progressLabel: path.progressLabel,
    rewardText: `Clear bonus: +${path.clearBonusXP} XP`,
    activityText: `Proceed through ${count} challenge${count === 1 ? '' : 's'} in ${level?.title || mission.shortTitle}.`,
  };
};

export const getMissionById = (missionId) => {
  const id = Number(missionId);
  return STORY_MISSIONS.find(mission => mission.id === id) || null;
};

export const getMissionStars = (missionProgress, missionId) => (
  missionProgress?.stars?.[missionId] || 0
);

export const isMissionCompleted = (missionProgress, missionId) => (
  missionProgress?.completed?.includes(Number(missionId)) || false
);

export const isMissionUnlocked = (missionProgress, missionId) => {
  const id = Number(missionId);
  if (id <= 1) return true;
  return isMissionCompleted(missionProgress, id - 1);
};

export const getNextMissionId = (missionProgress) => {
  const completed = missionProgress?.completed || [];
  const next = STORY_MISSIONS.find(mission => !completed.includes(mission.id));
  return next?.id || MISSION_TOTAL;
};

export const getMissionStats = (missionProgress) => {
  const completed = missionProgress?.completed?.length || 0;
  const totalStars = Object.values(missionProgress?.stars || {}).reduce((sum, stars) => sum + stars, 0);
  return {
    completed,
    totalStars,
    totalPossibleStars: MISSION_TOTAL * 3,
    percent: Math.round((completed / MISSION_TOTAL) * 100),
  };
};
