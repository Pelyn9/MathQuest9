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
    color: '#38D996',
    sky: '#061B28',
    hill: '#123D34',
    ridge: '#0D3041',
    road: '#3C2A17',
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
    color: '#42D9FF',
    sky: '#061B35',
    hill: '#123855',
    ridge: '#0A2B58',
    road: '#3C2A17',
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
    color: '#F4C56A',
    sky: '#1A1522',
    hill: '#463119',
    ridge: '#2A2032',
    road: '#4A2E19',
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
    color: '#FF5D63',
    sky: '#140914',
    hill: '#431C24',
    ridge: '#2A1018',
    road: '#2B1720',
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
    color: '#9B8CFF',
    description: 'Follow the kingdom quest and unlock missions one by one.',
  },
  survival: {
    id: 'survival',
    label: 'Survival',
    title: 'Survival Mode',
    icon: 'heart',
    color: '#FF5D63',
    description: 'Hold your ground through longer battles with no countdown.',
  },
  timer: {
    id: 'timer',
    label: 'Timer',
    title: 'Timer Mode',
    icon: 'timer',
    color: '#42D9FF',
    description: 'Race the clock with faster questions and bonus pressure.',
  },
};

export const MISSION_REGIONS = [
  {
    id: 1,
    moduleId: 1,
    name: 'Village of Traders',
    title: 'The Broken Ledger',
    color: '#38D996',
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
    // Story bridges — each land connects to the next in the saga
    bridgeOut: 'With the markets restored, the villagers whisper of a deeper curse spreading toward the capital. Sir Caldus arrives with a warning: the royal compass has been stolen.',
  },
  {
    id: 2,
    moduleId: 2,
    name: 'City of Architects',
    title: 'The Shattered Blueprint',
    color: '#42D9FF',
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
    bridgeOut: 'The city stands again, but the Queen\'s messengers bring troubling news — maps across the Data Kingdom have begun erasing themselves, patterns vanishing one by one.',
  },
  {
    id: 3,
    moduleId: 3,
    name: 'Data Kingdom',
    title: 'The Vanishing Pattern',
    color: '#9B8CFF',
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
    bridgeOut: 'With the patterns restored, the tragic truth emerges — the corrupted relic at the heart of Numeria is freezing every road in the City of Motion. The final land must be saved.',
  },
  {
    id: 4,
    moduleId: 4,
    name: 'City of Motion',
    title: 'The Frozen Road',
    color: '#FF7A5C',
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
    bridgeOut: null, // Final land — no bridge out
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

// Connected saga narrative for each mission — ties all 100 missions into one story
const SAGA_OVERVIEW = {
  1: 'A dark curse has fallen upon the kingdom of Numeria. The legendary Crown of Numeria — Source of all wisdom and order — has been shattered into four fragments. Each fragment was entrusted to a guardian of a different land. But the fragments have awakened twisted versions of the guardians. You must journey across all four lands, defeat each corrupted guardian, recover the fragments, and face the final boss — the Corrupted Crown itself — to restore peace to Numeria.',
};

const SAGA_LAND_INTRODUCTION = {
  1: 'Your journey begins in the Village of Traders, where the coin ledgers have turned blank and merchants cannot do business. The first Crown fragment lies with the Debt Warden.',
  2: 'With the first fragment recovered, you travel to the City of Architects. The city walls twist in impossible angles — the second guardian, the Angle Wraith, holds the next fragment.',
  3: 'Two fragments in hand, you enter the Data Kingdom. Maps erase themselves, messages lose meaning, and patterns dissolve into chaos. The Function Phantom guards the third fragment.',
  4: 'Three fragments restored, the Crown begins to glow — but the final land, the City of Motion, is frozen solid. Roads stand still, carts hang in midair. The Slope Shadow holds the last fragment.',
};

const REGION_BOSS_STORY = {
  1: 'You face the Debt Warden in his treasury fortress. He demands the coins of every villager as tribute. Defeat him to reclaim the first Crown fragment and restore honest trade to Numeria.',
  2: 'The Angle Wraith guards the second fragment within the Spire of Shifting Walls. She twists every corner into a maze. Defeat her to restore the city plans and claim the next piece of the Crown.',
  3: 'The Function Phantom lurks in the Archive of Lost Data. It feeds on confusion and broken patterns. Trap it in its own logic and free the third Crown fragment.',
  4: 'The Slope Shadow rules the frozen highways of the City of Motion. It drains all change and direction from the world. Defeat it to claim the final Crown fragment.',
};

const FINAL_BOSS_STORY = 'All four fragments are yours. But as they merge, the Crown awakens — not as a savior, but as the Corrupted Crown, the true source of Numeria\'s curse. It speaks in a voice of shattered numbers: "You have gathered the pieces, child. Now face the sum of your fears." The final battle begins. Every lesson you learned across the 100 missions — arithmetic, geometry, patterns, and motion — will be tested in one ultimate trial. Defeat the Corrupted Crown and restore Numeria forever!';

const buildMission = (_, index) => {
  const id = index + 1;
  const region = MISSION_REGIONS[Math.floor(index / 25)];
  const localId = ((id - 1) % 25) + 1;
  const chapter = getChapter(localId);
  const isBoss = localId === 25;
  const isGate = localId % 5 === 0;
  const isUltimateBoss = id === MISSION_TOTAL; // Mission 100 — final ultimate boss
  const title = isUltimateBoss
    ? `Mission 100: The Corrupted Crown`
    : isBoss
      ? `Mission ${id}: ${region.boss}'s Keep`
      : `Mission ${id}: ${missionActions[localId - 1]} ${missionObjects[localId - 1]}`;

  // Build a connected story for this mission
  let story = '';

  if (isUltimateBoss) {
    // Mission 100 — the final ultimate boss
    story = FINAL_BOSS_STORY;
  } else if (localId === 1) {
    // First mission of a region — introduce the land
    story = `${SAGA_LAND_INTRODUCTION[region.id]}`;
    if (region.id > 1) {
      // Reference previous region's bridge
      const prevRegion = MISSION_REGIONS.find(r => r.id === region.id - 1);
      if (prevRegion?.bridgeOut) {
        story = `${prevRegion.bridgeOut} ${story}`;
      }
    }
    story += ` ${region.arc[chapter - 1]}`;
  } else if (isBoss) {
    // Boss mission of a region
    story = `${REGION_BOSS_STORY[region.id]}`;
    if (region.bridgeOut) {
      story += ` ${region.bridgeOut}`;
    }
  } else {
    // Regular mission
    const intro = localId === 1 ? SAGA_LAND_INTRODUCTION[region.id] : '';
    const arcText = region.arc[chapter - 1];
    story = `${intro ? intro + ' ' : ''}${region.opening} ${arcText}`;
  }

  // For regular missions, add the saga overview reference for the very first mission
  if (id === 1) {
    story = `${SAGA_OVERVIEW[1]} ${story}`;
  }

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
    icon: isUltimateBoss ? 'skull' : isBoss ? 'skull' : isGate ? 'flag' : region.icon,
    title,
    shortTitle: isUltimateBoss ? 'The Corrupted Crown' : isBoss ? `${region.boss}'s Keep` : missionObjects[localId - 1],
    objective: isUltimateBoss ? 'Face the Corrupted Crown in the ultimate battle for Numeria!' : `Win a ${region.topic} battle to recover a Numerian relic.`,
    story,
    isBoss: isBoss || isUltimateBoss,
    isGate,
    isUltimateBoss,
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
