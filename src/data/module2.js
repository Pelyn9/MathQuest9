import { buildQuestions } from './questionBankUtils';

const figureOptions = ['Point', 'Line', 'Ray', 'Line segment', 'Angle', 'Plane', 'Vertex', 'Sides'];
const angleOptions = ['Right angle', 'Acute angle', 'Obtuse angle', 'Straight angle', 'Reflex angle'];
const lineOptions = ['Parallel (l ∥ m)', 'Perpendicular (p ⊥ q)', 'Neither', 'Intersecting lines'];
const relationshipOptions = [
  'Corresponding Angles',
  'Alternate Interior Angles',
  'Alternate Exterior Angles',
  'Co-interior Angles',
  'Vertical Angles',
  'Linear Pair (Supplementary)',
];

const geometryConcepts = [
  { q: 'A location in space with no size or dimension, represented by a dot.', a: 'Point', o: figureOptions },
  { q: 'A straight path that extends infinitely in both directions. Notation: ↔AB', a: 'Line', o: figureOptions },
  { q: 'A part of a line with one endpoint that extends infinitely in one direction. Notation: →AB', a: 'Ray', o: figureOptions },
  { q: 'A part of a line with two endpoints. Notation: AB̄', a: 'Line segment', o: figureOptions },
  { q: 'Formed by two rays with a common endpoint called the vertex. Notation: ∠ABC', a: 'Angle', o: figureOptions },
  { q: 'A flat surface that extends infinitely in all directions.', a: 'Plane', o: figureOptions },
  { q: 'The common endpoint of two rays forming an angle.', a: 'Vertex', o: figureOptions },
  { q: 'Two rays that form an angle are called ___ of the angle.', a: 'Sides', o: figureOptions },
  { q: 'Which angle type measures exactly 90°?', a: 'Right angle', o: angleOptions },
  { q: 'Which angle type measures less than 90°?', a: 'Acute angle', o: angleOptions },
  { q: 'Which angle type is more than 90° but less than 180°?', a: 'Obtuse angle', o: angleOptions },
  { q: 'Which angle type measures exactly 180°?', a: 'Straight angle', o: angleOptions },
  { q: 'Which angle type is more than 180° but less than 360°?', a: 'Reflex angle', o: angleOptions },
  { q: '∠XYZ = 47°. What type?', a: 'Acute angle', o: angleOptions },
  { q: '∠PQR = 115°. What type?', a: 'Obtuse angle', o: angleOptions },
  { q: '∠ABC = 90°. What type?', a: 'Right angle', o: angleOptions },
];

const parallelPerpendicular = [
  { q: 'Lines l and m never meet and are always the same distance apart.', a: 'Parallel (l ∥ m)', o: lineOptions },
  { q: 'Lines p and q intersect at a 90° angle.', a: 'Perpendicular (p ⊥ q)', o: lineOptions },
  { q: 'Lines r and s intersect at a 65° angle.', a: 'Neither', o: lineOptions },
  { q: 'Classify y = 3x + 1 and y = 3x − 5.', a: 'Parallel (l ∥ m)', o: lineOptions, e: 'The equations have the same slope, so the lines are parallel.' },
  { q: 'Classify y = 2x + 1 and y = −½x + 3.', a: 'Perpendicular (p ⊥ q)', o: lineOptions, e: 'The slopes 2 and −1/2 are negative reciprocals, so the lines are perpendicular.' },
  { q: 'Classify y = −2x + 4 and y = −2x − 1.', a: 'Parallel (l ∥ m)', o: lineOptions, e: 'Both equations have slope −2.' },
  { q: 'Classify y = 4x − 3 and y = ¼x + 2.', a: 'Neither', o: lineOptions, e: 'The slopes are not equal and are not negative reciprocals.' },
  { q: 'Classify y = −3x + 5 and y = ⅓x − 2.', a: 'Perpendicular (p ⊥ q)', o: lineOptions, e: 'The slopes −3 and 1/3 are negative reciprocals.' },
];

const angleRelationships = [
  { q: 'For l ∥ m cut by transversal t, identify ∠1 and ∠5.', a: 'Corresponding Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠3 and ∠6.', a: 'Alternate Interior Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠1 and ∠8.', a: 'Alternate Exterior Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠3 and ∠5.', a: 'Co-interior Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠4 and ∠8.', a: 'Corresponding Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠4 and ∠5.', a: 'Co-interior Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠1 and ∠4.', a: 'Vertical Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠1 and ∠2.', a: 'Linear Pair (Supplementary)', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠2 and ∠6.', a: 'Corresponding Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠2 and ∠7.', a: 'Alternate Exterior Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠3 and ∠7.', a: 'Corresponding Angles', o: relationshipOptions },
  { q: 'For l ∥ m cut by transversal t, identify ∠2 and ∠3.', a: 'Linear Pair (Supplementary)', o: relationshipOptions },
];

const angleMeasures = [
  { q: '∠1 = 70°. Find ∠5 if they are corresponding angles.', a: '70°', e: 'Corresponding angles are congruent when the lines are parallel.' },
  { q: '∠3 = 55°. Find ∠6 if they are alternate interior angles.', a: '55°', e: 'Alternate interior angles are congruent.' },
  { q: '∠4 = 110°. Find ∠5 if they are co-interior angles.', a: '70°', e: 'Co-interior angles are supplementary: 180° − 110° = 70°.' },
  { q: '∠3 = 72°. Find ∠5 if they are co-interior angles.', a: '108°', e: 'Co-interior angles are supplementary: 180° − 72° = 108°.' },
  { q: '∠6 = 95°. Find ∠2 if they are corresponding angles.', a: '95°' },
  { q: 'Corresponding angles are (2x+10)° and (3x−5)°. Find x.', a: 'x=15; angles=40° each', e: '2x + 10 = 3x − 5, so x = 15.' },
  { q: 'Alternate interior angles are (4x−8)° and (2x+12)°. Find x.', a: 'x=10; angles=32° each', e: '4x − 8 = 2x + 12, so x = 10.' },
  { q: 'Co-interior angles are (5x+20)° and (3x+40)°. Find x.', a: 'x=15; angles 95° and 85°', e: 'The angles are supplementary: 5x+20+3x+40=180.' },
  { q: 'Co-interior angles are (3x+10)° and (2x+30)°. Find x and both angles.', a: 'x=28; angles 94° and 86°' },
  { q: 'Vertical angles are (5x−20)° and (3x+10)°. Find x.', a: 'x=15; angle=55°' },
  { q: '∠2 = 120°. Find ∠6 if they are corresponding angles.', a: '120°', e: 'Corresponding angles are congruent.' },
  { q: 'Alternate interior angles are (3x+5)° and (5x−25)°. Find x.', a: 'x=15; angles=50° each', e: 'Set the congruent angles equal: 3x+5=5x−25.' },
  { q: 'Co-interior angles are (2x+40)° and (4x−10)°. Find x and both angles.', a: 'x=25; angles 90° and 90°', e: 'Co-interior angles are supplementary.' },
];

const module2 = {
  id: 2,
  title: 'Geometry',
  theme: 'City of Architects',
  levels: [
    {
      id: 1,
      title: 'Geometric Concepts',
      description: 'Identify points, lines, rays, segments, planes, vertices, sides, and angle types',
      difficulty: 'easy',
      questions: buildQuestions(2, 1, 'easy', geometryConcepts, {
        hint: 'Match the description or angle measure to the correct geometry term.',
      }),
    },
    {
      id: 2,
      title: 'Parallel & Perpendicular',
      description: 'Classify lines by intersection, distance, and slope relationships',
      difficulty: 'medium',
      questions: buildQuestions(2, 2, 'medium', parallelPerpendicular, {
        hint: 'Parallel lines have equal slopes; perpendicular lines meet at 90° or have negative reciprocal slopes.',
      }),
    },
    {
      id: 3,
      title: 'Transversal Relations',
      description: 'Recognize corresponding, alternate, co-interior, vertical, and linear-pair angles',
      difficulty: 'hard',
      questions: buildQuestions(2, 3, 'hard', angleRelationships, {
        hint: 'Picture two parallel lines cut by one transversal and compare the angle positions.',
      }),
    },
    {
      id: 4,
      title: 'Boss: Angle Algebra',
      description: 'Find missing angle measures and solve for x using angle relationships',
      difficulty: 'hard',
      isBoss: true,
      questions: buildQuestions(2, 4, 'hard', angleMeasures, {
        hint: 'Congruent angle pairs are equal; supplementary angle pairs add to 180°.',
      }),
    },
  ],
};

export default module2;
