import { buildQuestions } from './questionBankUtils';

const mixedReview = [
  { q: 'f(x)=2x+5. Cost of 7 notebooks? Is it linear? Slope?', a: '₱19; yes; m=2' },
  { q: '∠A=(3x+10)°, ∠B=(5x+10)°, co-interior. Find x and both angles.', a: 'x=20; ∠A=70°, ∠B=110°' },
  { q: '{(1,2),(2,3),(3,4)} — domain, range, is it a function, and equation?', a: 'D={1,2,3}; R={2,3,4}; yes; f(x)=x+1' },
  { q: 'Line through (0,−3), slope=4. Find equation, zero, and f(5).', a: 'f(x)=4x−3; zero x=0.75; f(5)=17' },
  { q: 'Alternate interior angles are (7x−5)° and (4x+19)°. Solve x and find the angle.', a: 'x=8; angle=51°' },
  { q: 'f(x)=3x−2. Find f(6), the zero, and the slope.', a: 'f(6)=16; zero x=2/3; m=3' },
];

const tindahanSetup = [
  { q: 'Lola Nena sells puto at ₱8 each. Daily ingredient cost is ₱300. Write the profit function P(n).', a: 'P(n) = 8n − 300' },
  { q: 'For P(n)=8n−300, complete the table when n = 0, 25, 50, 75, 100.', a: 'P: −300, −100, 100, 300, 500' },
  { q: 'For P(n)=8n−300, find the profit when n = 40.', a: '₱20' },
  { q: 'Lola sells 60 puto at ₱8 each. What is the revenue before ingredient cost?', a: '₱480' },
  { q: 'If daily ingredient cost becomes ₱360 and puto sells for ₱8 each, write the new profit function.', a: 'P(n)=8n−360' },
  { q: 'For P(n)=8n−300, complete the table when n = 10, 20, 30.', a: 'P: −220, −140, −60' },
];

const tindahanMeaning = [
  { q: 'For P(n)=8n−300, what is the zero of the function and what does it mean?', a: 'n=37.5 → 38 puto to break even' },
  { q: 'For P(n)=8n−300, what is the slope and what does it represent?', a: 'm=8; each puto earns ₱8 profit' },
  { q: 'For P(n)=8n−300, what is the y-intercept and what does it represent?', a: '(0,−300); daily loss with 0 sales = ₱300' },
  { q: 'For P(n)=8n−300, give the domain and range for the real-life situation.', a: 'Domain: n≥0; Range: P≥−300' },
  { q: 'For P(n)=8n−300, what does P(25)=−100 mean?', a: 'Lola loses ₱100 when she sells 25 puto' },
  { q: 'In P(n)=8n−300, what does n represent?', a: 'number of puto sold' },
];

const tindahanBoss = [
  { q: 'Lola wants ₱500 profit with P(n)=8n−300. How many puto must she sell?', a: '100 puto' },
  { q: 'If the price is raised to ₱10, what is the new function and break-even point?', a: 'P(n)=10n−300; break-even=30 puto' },
  { q: 'Using P(n)=8n−300, what is the profit when n=75?', a: '₱300' },
  { q: 'Using P(n)=10n−300, what is the profit when n=100?', a: '₱700' },
  { q: 'Lola wants ₱300 profit with P(n)=8n−300. How many puto must she sell?', a: '75 puto' },
  { q: 'If the price is raised to ₱12, what is the new function and break-even point?', a: 'P(n)=12n−300; break-even=25 puto' },
];

const module5 = {
  id: 5,
  title: 'Mixed Review & Performance Tasks',
  theme: 'Capstone Market',
  levels: [
    {
      id: 1,
      title: 'Mixed Topic Review',
      description: 'Review functions, angles, slope, domain, range, and equations',
      difficulty: 'medium',
      questions: buildQuestions(5, 1, 'medium', mixedReview, {
        hint: 'Identify the topic first, then apply its rule carefully.',
      }),
    },
    {
      id: 2,
      title: 'Tindahan ni Lola',
      description: 'Build and read Lola Nena’s puto profit function',
      difficulty: 'medium',
      questions: buildQuestions(5, 2, 'medium', tindahanSetup, {
        hint: 'Profit equals earnings minus fixed ingredient cost.',
      }),
    },
    {
      id: 3,
      title: 'Break-Even Meanings',
      description: 'Interpret zeros, slope, intercepts, domain, and range in context',
      difficulty: 'hard',
      questions: buildQuestions(5, 3, 'hard', tindahanMeaning, {
        hint: 'Connect each part of the graph to the story of sales and profit.',
      }),
    },
    {
      id: 4,
      title: 'Boss: Capstone Profit',
      description: 'Solve target-profit and changed-price performance tasks',
      difficulty: 'hard',
      isBoss: true,
      questions: buildQuestions(5, 4, 'hard', tindahanBoss, {
        hint: 'Substitute the target value into the profit function, then solve.',
      }),
    },
  ],
};

export default module5;
