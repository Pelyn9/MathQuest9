import { buildQuestions } from './questionBankUtils';

const slopeFromPoints = [
  { q: 'Find the slope through (2,4) and (5,10).', a: 'm = 2' },
  { q: 'Find the slope through (1,3) and (4,9).', a: 'm = 2' },
  { q: 'Find the slope through (0,5) and (3,2).', a: 'm = −1' },
  { q: 'Find the slope through (2,7) and (6,7).', a: 'm = 0 (horizontal)' },
  { q: 'Find the slope through (3,1) and (3,8).', a: 'm = undefined (vertical)' },
  { q: 'Find the slope through (0,0) and (5,15).', a: 'm = 3' },
  { q: 'Find the slope through (1,8) and (4,2).', a: 'm = −2' },
  { q: 'Find the slope through (−3,10) and (2,0).', a: 'm = −2' },
  { q: 'Find the slope through (−1,−2) and (3,6).', a: 'm = 2' },
  { q: 'Find the slope through (4,9) and (8,1).', a: 'm = −2' },
];

const slopeFromEquations = [
  { q: 'Find the slope of y = 3x + 2.', a: 'm = 3' },
  { q: 'Find the slope of y = −4x + 7.', a: 'm = −4' },
  { q: 'Find the slope of y = ½x − 3.', a: 'm = ½' },
  { q: 'Find the slope of y = 7.', a: 'm = 0' },
  { q: 'Find the slope of 2y = 6x + 4.', a: 'm = 3', e: 'Divide by 2 to get y = 3x + 2.' },
  { q: 'Find the slope of y = −⅔x + 1.', a: 'm = −⅔' },
  { q: 'Find the slope of 3y = −9x + 12.', a: 'm = −3', e: 'Divide by 3 to get y = −3x + 4.' },
  { q: 'Find the slope of y = 1.5x − 6.', a: 'm = 1.5' },
];

const zeros = [
  { q: 'Find the zero of f(x) = 2x − 8.', a: 'x = 4' },
  { q: 'Find the zero of f(x) = 3x + 9.', a: 'x = −3' },
  { q: 'Find the zero of f(x) = 4x − 20.', a: 'x = 5' },
  { q: 'Find the zero of f(x) = −2x + 14.', a: 'x = 7' },
  { q: 'Find the zero of f(x) = 5x + 25.', a: 'x = −5' },
  { q: 'Find the zero of f(x) = ½x − 3.', a: 'x = 6' },
  { q: 'Find the break-even zero of f(x) = 25x − 500.', a: 'x = 20 items' },
  { q: 'Find the zero of f(x) = 6x − 18.', a: 'x = 3' },
  { q: 'Find the zero of f(x) = −5x − 15.', a: 'x = −3' },
  { q: 'Find the zero of f(x) = 0.25x − 5.', a: 'x = 20' },
];

const intercepts = [
  { q: 'For f(x) = 2x + 4, find the slope, y-intercept, and x-intercept.', a: 'm=2, y-int=(0,4), x-int=(−2,0)' },
  { q: 'For f(x) = −3x + 6, find the slope, y-intercept, and x-intercept.', a: 'm=−3, y-int=(0,6), x-int=(2,0)' },
  { q: 'For f(x) = 4x − 12, find the slope, y-intercept, and x-intercept.', a: 'm=4, y-int=(0,−12), x-int=(3,0)' },
  { q: 'For f(x) = −2x + 8, find the slope, y-intercept, and x-intercept.', a: 'm=−2, y-int=(0,8), x-int=(4,0)' },
  { q: 'For f(x) = x + 5, find the slope, y-intercept, and x-intercept.', a: 'm=1, y-int=(0,5), x-int=(−5,0)' },
  { q: 'For f(x) = 3x − 9, find the slope, y-intercept, and x-intercept.', a: 'm=3, y-int=(0,−9), x-int=(3,0)' },
  { q: 'For f(x) = −x − 4, find the slope, y-intercept, and x-intercept.', a: 'm=−1, y-int=(0,−4), x-int=(−4,0)' },
  { q: 'For f(x) = ½x + 2, find the slope, y-intercept, and x-intercept.', a: 'm=½, y-int=(0,2), x-int=(−4,0)' },
];

const realLifeLinear = [
  { q: 'Jeepney: ₱13 base + ₱1.50/km after 4 km. Write F(d).', a: 'F(d) = 1.5d + 7', e: 'The first 4 km cost ₱13, so F(d)=13+1.5(d−4)=1.5d+7.' },
  { q: 'Savings: ₱75/week. Write S(w) and find savings after 8 weeks.', a: 'S(w)=75w; ₱600' },
  { q: 'Electric bill: ₱11/kWh + ₱250 fixed. Write C(k) and find bill for 120 kWh.', a: 'C(k)=11k+250; ₱1,570' },
  { q: 'Water tank: 800 L, leaks 40 L/hr. Write W(h) and find when empty.', a: 'W(h)=800−40h; 20 hrs' },
  { q: 'Candle: 20 cm, burns 2 cm/hr. Write L(h) and find when out.', a: 'L(h)=20−2h; 10 hrs' },
  { q: 'Student saves for ₱3,500 shoes at ₱175/week. Weeks needed?', a: 'S(w)=175w; 20 weeks' },
  { q: 'Phone load: ₱20 starting balance plus ₱15 per day saved. Write L(d) and find after 6 days.', a: 'L(d)=15d+20; ₱110' },
  { q: 'Water delivery: ₱50 service fee + ₱30 per container. Write C(n) and find cost for 8 containers.', a: 'C(n)=30n+50; ₱290' },
  { q: 'A plant is 12 cm tall and grows 3 cm/week. Write H(w) and find height after 9 weeks.', a: 'H(w)=12+3w; 39 cm' },
  { q: 'A 100-page reviewer has 8 pages studied per day. Write R(d), pages remaining after d days, and find after 5 days.', a: 'R(d)=100−8d; 60 pages' },
];

const module4 = {
  id: 4,
  title: 'Linear Functions',
  theme: 'City of Motion',
  levels: [
    {
      id: 1,
      title: 'Slope as Rate of Change',
      description: 'Find slope from two points and from linear equations',
      difficulty: 'easy',
      questions: buildQuestions(4, 1, 'easy', [
        ...slopeFromPoints,
        ...slopeFromEquations,
      ], {
        hint: 'Use m = (y₂ − y₁) / (x₂ − x₁), or read m from y = mx + b.',
      }),
    },
    {
      id: 2,
      title: 'Zeros of Linear Functions',
      description: 'Set f(x) = 0 and solve for x',
      difficulty: 'medium',
      questions: buildQuestions(4, 2, 'medium', zeros, {
        hint: 'To find a zero, replace f(x) with 0 and solve for x.',
      }),
    },
    {
      id: 3,
      title: 'Intercepts & Slope',
      description: 'Identify slope, y-intercept, x-intercept, domain, and range clues',
      difficulty: 'hard',
      questions: buildQuestions(4, 3, 'hard', intercepts, {
        hint: 'The y-intercept happens when x = 0. The x-intercept happens when y = 0.',
      }),
    },
    {
      id: 4,
      title: 'Boss: Real-Life Linear Models',
      description: 'Build linear equations for fare, savings, bills, leaks, candles, and goals',
      difficulty: 'hard',
      isBoss: true,
      questions: buildQuestions(4, 4, 'hard', realLifeLinear, {
        hint: 'Identify the starting amount as the intercept and the constant change as the slope.',
      }),
    },
  ],
};

export default module4;
