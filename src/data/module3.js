import { buildQuestions } from './questionBankUtils';

const functionOptions = ['FUNCTION', 'NOT A FUNCTION', 'Domain only', 'Range only'];

const identifyingFunctions = [
  { q: 'Classify { (1,3),(2,5),(3,7),(4,9) }.', a: 'FUNCTION', o: functionOptions, e: 'Each x maps to exactly one y.' },
  { q: 'Classify { (1,2),(1,4),(3,6) }.', a: 'NOT A FUNCTION', o: functionOptions, e: 'x = 1 maps to y = 2 and y = 4.' },
  { q: 'Classify { (−2,4),(0,4),(2,4) }.', a: 'FUNCTION', o: functionOptions, e: 'Different x-values can share the same y-value.' },
  { q: 'Classify { (5,1),(6,2),(7,3),(5,4) }.', a: 'NOT A FUNCTION', o: functionOptions, e: 'x = 5 has two y-values.' },
  { q: 'Classify { (0,0),(1,1),(2,4),(3,9) }.', a: 'FUNCTION', o: functionOptions },
  { q: 'Classify { (2,3),(3,2),(4,5),(5,4) }.', a: 'FUNCTION', o: functionOptions },
  { q: 'Classify { (1,5),(2,5),(3,5),(1,3) }.', a: 'NOT A FUNCTION', o: functionOptions, e: 'x = 1 has two y-values.' },
  { q: "Classify { (a,1),(b,2),(c,3),(a,4) }.", a: 'NOT A FUNCTION', o: functionOptions, e: "'a' maps to 1 and 4." },
  { q: 'Classify { (2,1),(2,1),(3,4),(4,7) }.', a: 'FUNCTION', o: functionOptions, e: 'The repeated x = 2 still maps to the same y-value.' },
  { q: 'Classify { (0,2),(1,4),(0,5),(2,6) }.', a: 'NOT A FUNCTION', o: functionOptions, e: 'x = 0 maps to two different y-values.' },
];

const domainRange = [
  { q: 'Find the domain and range of { (1,4),(2,6),(3,8),(4,10) }.', a: 'Domain: {1,2,3,4} | Range: {4,6,8,10}' },
  { q: 'Find the domain and range of { (−2,3),(0,5),(2,7),(4,9) }.', a: 'Domain: {−2,0,2,4} | Range: {3,5,7,9}' },
  { q: 'For f(x) = 2x + 5, identify the domain and range.', a: 'Domain: all real numbers; Range: all real numbers' },
  { q: 'For f(x) = x², identify the domain and range.', a: 'Domain: all real numbers; Range: y ≥ 0' },
  { q: 'For f(x) = 50x as a wage function, identify the domain and range.', a: 'Domain: x ≥ 0; Range: f(x) ≥ 0' },
  { q: 'Find the domain and range of { (−1,2),(1,2),(3,6),(5,10) }.', a: 'Domain: {−1,1,3,5} | Range: {2,6,10}' },
  { q: 'Find the domain and range of { (2,−3),(4,−1),(6,1),(8,3) }.', a: 'Domain: {2,4,6,8} | Range: {−3,−1,1,3}' },
  { q: 'For f(x) = −3x + 1, identify the domain and range.', a: 'Domain: all real numbers; Range: all real numbers' },
  { q: 'For f(x) = |x|, identify the domain and range.', a: 'Domain: all real numbers; Range: y ≥ 0' },
];

const functionNotation = [
  { q: 'f(x) = 2x + 3. Find f(0).', a: '3' },
  { q: 'f(x) = 2x + 3. Find f(4).', a: '11' },
  { q: 'f(x) = 2x + 3. Find f(−2).', a: '−1' },
  { q: 'g(x) = 3x − 5. Find g(3).', a: '4' },
  { q: 'h(x) = −x + 10. Find h(7).', a: '3' },
  { q: 'h(x) = −x + 10. Find h(−3).', a: '13' },
  { q: 'f(x) = ½x + 4. Find f(6).', a: '7' },
  { q: 'p(x) = 15x + 50. Find p(10).', a: '200' },
  { q: 'f(x) = x² − 1. Find f(5).', a: '24' },
  { q: 'g(x) = −2x + 8. Find g(−1).', a: '10' },
  { q: 'h(x) = x/3 − 2. Find h(12).', a: '2' },
  { q: 'p(x) = 50 + 12x. Find p(5).', a: '110' },
];

const mixedFunctions = [
  ...identifyingFunctions.slice(0, 4),
  ...domainRange.slice(0, 3),
  ...functionNotation.slice(0, 5),
];

const module3 = {
  id: 3,
  title: 'Relations and Functions',
  theme: 'Data Kingdom',
  levels: [
    {
      id: 1,
      title: 'Identifying Functions',
      description: 'Decide whether ordered-pair relations are functions',
      difficulty: 'easy',
      questions: buildQuestions(3, 1, 'easy', identifyingFunctions, {
        hint: 'A relation is a function when each input x has exactly one output y.',
      }),
    },
    {
      id: 2,
      title: 'Domain & Range',
      description: 'Find input sets, output sets, and real-life restrictions',
      difficulty: 'medium',
      questions: buildQuestions(3, 2, 'medium', domainRange, {
        hint: 'Domain means x-values or allowed inputs. Range means y-values or possible outputs.',
      }),
    },
    {
      id: 3,
      title: 'Function Notation',
      description: 'Evaluate f(x), g(x), h(x), and real-life function rules',
      difficulty: 'hard',
      questions: buildQuestions(3, 3, 'hard', functionNotation, {
        hint: 'Substitute the given input for x, then simplify.',
      }),
    },
    {
      id: 4,
      title: 'Boss: Function Mastery',
      description: 'Mixed function, domain, range, and notation questions',
      difficulty: 'hard',
      isBoss: true,
      questions: buildQuestions(3, 4, 'hard', mixedFunctions, {
        hint: 'Check the input-output rule first, then evaluate or list the sets carefully.',
      }),
    },
  ],
};

export default module3;
