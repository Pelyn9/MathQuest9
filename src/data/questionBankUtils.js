const GENERIC_WRONG = [
  'Not enough information',
  'Cannot be determined',
  'None of these',
  'All of these',
];

const CONCEPT_POOLS = [
  ['Point', 'Line', 'Ray', 'Line segment', 'Angle', 'Plane', 'Vertex', 'Sides'],
  ['Right angle', 'Acute angle', 'Obtuse angle', 'Straight angle', 'Reflex angle'],
  ['Parallel (l ∥ m)', 'Perpendicular (p ⊥ q)', 'Neither', 'Intersecting lines'],
  ['Corresponding Angles', 'Alternate Interior Angles', 'Alternate Exterior Angles', 'Co-interior Angles', 'Vertical Angles', 'Linear Pair (Supplementary)'],
  ['FUNCTION', 'NOT A FUNCTION', 'Domain only', 'Range only'],
  ['Domain', 'Range', 'Slope', 'Zero'],
];

const FRACTION_WRONG = [
  '1/2',
  '2/3',
  '3/4',
  '5/6',
  '7/8',
  '3/2 = 1½',
  '1/3',
  '2',
  '6',
];

const unique = (values) => {
  const seen = new Set();
  return values.filter((value) => {
    const key = String(value);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const hashString = (value) => (
  String(value).split('').reduce((total, char) => total + char.charCodeAt(0), 0)
);

const formatNumberLike = (value, original) => {
  const decimalPart = String(original).split('.')[1];
  const decimals = decimalPart ? decimalPart.length : 0;
  const rounded = decimals > 0 ? value.toFixed(decimals) : String(Math.round(value));
  const [whole, decimal] = rounded.split('.');
  const needsCommas = String(original).includes(',') || Math.abs(value) >= 1000;
  const wholeText = needsCommas ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : whole;
  return decimal ? `${wholeText}.${decimal}` : wholeText;
};

const makeNumberDistractors = (answer) => {
  const text = String(answer);
  if (text.includes('/') || text.includes('½') || text.includes('⅓') || text.includes('⅔')) return [];
  const match = text.match(/^(.*?)([-−]?\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return [];

  const [, prefix, rawNumber, suffix] = match;
  const normalized = rawNumber.replace(/,/g, '').replace('−', '-');
  const number = Number(normalized);
  if (!Number.isFinite(number)) return [];

  const magnitude = Math.max(1, Math.abs(number));
  const step = magnitude >= 1000 ? 100 : magnitude >= 100 ? 10 : magnitude >= 10 ? 2 : 1;
  const candidates = [
    number + step,
    number - step,
    number + step * 2,
    Math.max(number - step * 2, number < 0 ? number - step * 2 : 0),
    number * 2,
  ];

  return candidates
    .filter(candidate => candidate !== number)
    .map(candidate => `${prefix}${formatNumberLike(candidate, rawNumber)}${suffix}`);
};

const makeDistractors = (answer, supplied = []) => {
  const answerText = String(answer);
  const suppliedChoices = supplied.map(String).filter(choice => choice !== answerText);
  const conceptPool = CONCEPT_POOLS.find(pool => pool.includes(answerText)) || [];
  const fractionPool = answerText.includes('/') || answerText.includes('½') || answerText.includes('⅓') || answerText.includes('⅔')
    ? FRACTION_WRONG
    : [];

  return unique([
    ...suppliedChoices,
    ...makeNumberDistractors(answerText),
    ...conceptPool,
    ...fractionPool,
    ...GENERIC_WRONG,
  ]).filter(choice => choice !== answerText).slice(0, 3);
};

export const buildQuestion = (moduleId, levelId, index, difficulty, item, defaults = {}) => {
  const id = item.id || `m${moduleId}l${levelId}q${index + 1}`;
  const answer = String(item.a);
  const wrong = makeDistractors(answer, item.o);
  while (wrong.length < 3) {
    wrong.push(GENERIC_WRONG[wrong.length]);
  }

  const correct = hashString(id) % 4;
  const options = wrong.slice(0, 3);
  options.splice(correct, 0, answer);

  return {
    id,
    difficulty: item.difficulty || difficulty,
    question: item.q,
    options,
    correct,
    explanation: item.e || defaults.explanation || `Correct answer: ${answer}.`,
    hint: item.h || defaults.hint || 'Use the lesson rule, then check which option matches your result.',
  };
};

export const buildQuestions = (moduleId, levelId, difficulty, items, defaults) => (
  items.map((item, index) => buildQuestion(moduleId, levelId, index, difficulty, item, defaults))
);
