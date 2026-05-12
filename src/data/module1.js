import { buildQuestions } from './questionBankUtils';

const multiplicationLevel1 = [
  { q: '3 × 4 = ___', a: '12' },
  { q: '6 × 7 = ___', a: '42' },
  { q: '8 × 9 = ___', a: '72' },
  { q: '5 × 6 = ___', a: '30' },
  { q: '7 × 8 = ___', a: '56' },
  { q: '9 × 9 = ___', a: '81' },
  { q: '4 × 7 = ___', a: '28' },
  { q: '6 × 8 = ___', a: '48' },
  { q: '3 × 9 = ___', a: '27' },
  { q: '7 × 7 = ___', a: '49' },
  { q: '8 × 6 = ___', a: '48' },
  { q: '9 × 4 = ___', a: '36' },
  { q: '5 × 9 = ___', a: '45' },
  { q: '8 × 8 = ___', a: '64' },
  { q: '6 × 6 = ___', a: '36' },
];

const divisionLevel1 = [
  { q: '42 ÷ 6 = ___', a: '7', e: '7 × 6 = 42.' },
  { q: '56 ÷ 8 = ___', a: '7', e: '7 × 8 = 56.' },
  { q: '63 ÷ 9 = ___', a: '7', e: '7 × 9 = 63.' },
  { q: '48 ÷ 6 = ___', a: '8' },
  { q: '72 ÷ 8 = ___', a: '9' },
  { q: '81 ÷ 9 = ___', a: '9' },
  { q: '36 ÷ 4 = ___', a: '9' },
  { q: '45 ÷ 5 = ___', a: '9' },
  { q: '28 ÷ 7 = ___', a: '4' },
  { q: '54 ÷ 6 = ___', a: '9' },
  { q: '49 ÷ 7 = ___', a: '7' },
  { q: '64 ÷ 8 = ___', a: '8' },
  { q: '35 ÷ 5 = ___', a: '7' },
  { q: '27 ÷ 3 = ___', a: '9' },
  { q: '32 ÷ 4 = ___', a: '8' },
];

const integerLevel1 = [
  { q: '(+5) + (+3) = ___', a: '8', e: 'Same signs: add and keep the sign.' },
  { q: '(−4) + (−6) = ___', a: '−10', e: 'Same signs: add and keep negative.' },
  { q: '(+7) + (−3) = ___', a: '4', e: 'Different signs: subtract and keep the sign of the larger absolute value.' },
  { q: '(−8) + (+5) = ___', a: '−3' },
  { q: '(+9) − (+4) = ___', a: '5' },
  { q: '(+6) − (−2) = ___', a: '8', e: 'Subtracting a negative becomes adding a positive.' },
  { q: '(−5) − (+3) = ___', a: '−8' },
  { q: '(−7) − (−4) = ___', a: '−3', e: '−7 − (−4) = −7 + 4 = −3.' },
  { q: '(−3) + (−3) + (+6) = ___', a: '0' },
  { q: '(+8) − (+9) = ___', a: '−1' },
  { q: '(−9) + (+9) = ___', a: '0', e: 'Opposites add to zero.' },
  { q: '(+4) + (−7) + (+2) = ___', a: '−1' },
];

const fractionLevel1 = [
  { q: '1/4 + 2/4 = ___', a: '3/4' },
  { q: '2/5 + 1/5 = ___', a: '3/5' },
  { q: '3/8 + 4/8 = ___', a: '7/8' },
  { q: '1/6 + 3/6 = ___', a: '4/6 = 2/3' },
  { q: '2/9 + 4/9 = ___', a: '6/9 = 2/3' },
  { q: '5/8 + 2/8 = ___', a: '7/8' },
  { q: '3/10 + 5/10 = ___', a: '8/10 = 4/5' },
  { q: '4/7 + 2/7 = ___', a: '6/7' },
  { q: 'Subtract: 5/6 − 2/6 = ___', a: '3/6 = 1/2' },
  { q: 'Subtract: 7/8 − 3/8 = ___', a: '4/8 = 1/2' },
  { q: 'Subtract: 9/10 − 4/10 = ___', a: '5/10 = 1/2' },
  { q: 'Subtract: 11/12 − 5/12 = ___', a: '6/12 = 1/2' },
];

const decimalLevel1 = [
  { q: '3.4 + 2.5 = ___', a: '5.9' },
  { q: '7.8 + 1.6 = ___', a: '9.4' },
  { q: '4.7 + 3.8 = ___', a: '8.5' },
  { q: '12.5 + 6.9 = ___', a: '19.4' },
  { q: '0.6 + 0.7 = ___', a: '1.3' },
  { q: '9.3 − 4.1 = ___', a: '5.2' },
  { q: '6.0 − 2.7 = ___', a: '3.3' },
  { q: '8.5 − 3.9 = ___', a: '4.6' },
  { q: '15.4 − 8.7 = ___', a: '6.7' },
  { q: '20.0 − 13.5 = ___', a: '6.5' },
  { q: '₱45.50 + ₱32.30 = ___', a: '₱77.80' },
  { q: '₱100.00 − ₱67.80 = ___', a: '₱32.20' },
];

const pemdasLevel1 = [
  { q: '3 + 4 × 2 = ___', a: '11', e: 'Multiply first: 4 × 2 = 8, then 3 + 8 = 11.' },
  { q: '(3 + 4) × 2 = ___', a: '14', e: 'Parentheses first: 3 + 4 = 7, then 7 × 2 = 14.' },
  { q: '5² − 3 × 4 + 2 = ___', a: '15', e: '25 − 12 + 2 = 15.' },
];

const literacyLevel1 = [
  { q: 'Ana bought 3 pandesal at ₱5 each + juice for ₱25. Total spent?', a: '₱40' },
  { q: 'Jeepney: ₱13 for first 4 km + ₱1.50/km after. Fare for 10 km?', a: '₱22' },
  { q: 'Mang Jose sells banana cue at ₱10 per stick. Sold 85 sticks. Earnings?', a: '₱850' },
];

const multiplicationLevel2 = [
  { q: '34 × 6 = ___', a: '204', e: '30 × 6 = 180 and 4 × 6 = 24, total = 204.' },
  { q: '25 × 8 = ___', a: '200', e: '20 × 8 = 160 and 5 × 8 = 40, total = 200.' },
  { q: '47 × 5 = ___', a: '235' },
  { q: '63 × 7 = ___', a: '441' },
  { q: '82 × 4 = ___', a: '328' },
  { q: '56 × 9 = ___', a: '504' },
  { q: '71 × 8 = ___', a: '568' },
  { q: '38 × 6 = ___', a: '228' },
  { q: '94 × 5 = ___', a: '470' },
  { q: '27 × 7 = ___', a: '189' },
  { q: '65 × 3 = ___', a: '195' },
  { q: '49 × 8 = ___', a: '392' },
  { q: '78 × 4 = ___', a: '312' },
  { q: '36 × 9 = ___', a: '324' },
  { q: '54 × 7 = ___', a: '378' },
];

const divisionLevel2 = [
  { q: '84 ÷ 6 = ___', a: '14', e: '8 ÷ 6 = 1 r2, then 24 ÷ 6 = 4, so the answer is 14.' },
  { q: '96 ÷ 8 = ___', a: '12' },
  { q: '91 ÷ 7 = ___', a: '13' },
  { q: '75 ÷ 5 = ___', a: '15' },
  { q: '92 ÷ 4 = ___', a: '23' },
  { q: '78 ÷ 6 = ___', a: '13' },
  { q: '88 ÷ 8 = ___', a: '11' },
  { q: '95 ÷ 5 = ___', a: '19' },
  { q: '72 ÷ 6 = ___', a: '12' },
  { q: '98 ÷ 7 = ___', a: '14' },
  { q: '84 ÷ 7 = ___', a: '12' },
  { q: '96 ÷ 6 = ___', a: '16' },
  { q: '76 ÷ 4 = ___', a: '19' },
  { q: '90 ÷ 6 = ___', a: '15' },
  { q: '85 ÷ 5 = ___', a: '17' },
];

const integerLevel2 = [
  { q: '(−6) × (+7) = ___', a: '−42', e: 'Different signs give a negative product.' },
  { q: '(−5) × (−8) = ___', a: '40', e: 'Same signs give a positive product.' },
  { q: '(+4) × (−9) = ___', a: '−36' },
  { q: '(−3) × (−3) = ___', a: '9' },
  { q: '(−48) ÷ (+6) = ___', a: '−8' },
  { q: '(+72) ÷ (−9) = ___', a: '−8' },
  { q: '(−56) ÷ (−7) = ___', a: '8' },
  { q: '(+81) ÷ (−9) = ___', a: '−9' },
  { q: '(−7) × (+6) × (−1) = ___', a: '42' },
  { q: '(−4)² = ___', a: '16' },
  { q: '−4² = ___', a: '−16', e: '−4² means −(4²), so the value is −16.' },
  { q: '(−2)³ = ___', a: '−8' },
];

const fractionLevel2 = [
  { q: '1/2 + 1/3 = ___', a: '5/6', e: 'LCD = 6: 3/6 + 2/6 = 5/6.' },
  { q: '3/4 + 1/6 = ___', a: '11/12' },
  { q: '2/3 + 1/4 = ___', a: '11/12' },
  { q: '1/5 + 3/10 = ___', a: '5/10 = 1/2' },
  { q: '3/8 + 1/4 = ___', a: '5/8' },
  { q: '2/5 + 1/3 = ___', a: '11/15' },
  { q: 'Subtract: 3/4 − 1/3 = ___', a: '5/12' },
  { q: 'Subtract: 5/6 − 1/4 = ___', a: '7/12' },
  { q: 'Subtract: 7/8 − 1/3 = ___', a: '13/24' },
  { q: 'Subtract: 9/10 − 2/5 = ___', a: '5/10 = 1/2' },
];

const decimalLevel2 = [
  { q: '2.4 × 3 = ___', a: '7.2', e: '24 × 3 = 72, then shift one decimal place: 7.2.' },
  { q: '3.5 × 6 = ___', a: '21.0 = 21' },
  { q: '4.8 × 5 = ___', a: '24.0 = 24' },
  { q: '1.7 × 8 = ___', a: '13.6' },
  { q: '6.3 × 4 = ___', a: '25.2' },
  { q: '0.9 × 7 = ___', a: '6.3' },
  { q: '12.5 × 4 = ___', a: '50.0 = 50' },
  { q: '₱15.50 × 6 = ___', a: '₱93.00' },
  { q: 'A jeepney travels 4.5 km per trip. After 8 trips, total distance?', a: '36 km' },
  { q: '0.25 × 12 = ___', a: '3.0 = 3' },
];

const pemdasLevel2 = [
  { q: '2 × (8 − 3)² = ___', a: '50', e: '(8 − 3)² = 25, then 2 × 25 = 50.' },
  { q: '48 ÷ 6 + 3 × 2 − 1 = ___', a: '13' },
  { q: '4² + 3 × (10 − 6) ÷ 2 = ___', a: '22' },
];

const literacyLevel2 = [
  { q: 'Class of 45 students. 18 are boys. What % are girls?', a: '60%' },
  { q: 'Shoes at ₱1,200, 25% off. Sale price?', a: '₱900' },
  { q: 'Family uses 180 kWh. Meralco: ₱11/kWh + ₱250 fixed. Total bill?', a: '₱2,230' },
];

const multiplicationLevel3 = [
  { q: '23 × 14 = ___', a: '322', e: '23 × 10 = 230 and 23 × 4 = 92, total = 322.' },
  { q: '35 × 12 = ___', a: '420' },
  { q: '46 × 15 = ___', a: '690' },
  { q: '27 × 13 = ___', a: '351' },
  { q: '52 × 11 = ___', a: '572' },
  { q: '38 × 21 = ___', a: '798' },
  { q: '64 × 12 = ___', a: '768' },
  { q: '45 × 16 = ___', a: '720' },
  { q: '53 × 18 = ___', a: '954' },
  { q: '72 × 13 = ___', a: '936' },
  { q: '29 × 14 = ___', a: '406' },
  { q: '43 × 21 = ___', a: '903' },
  { q: '56 × 12 = ___', a: '672' },
  { q: '67 × 11 = ___', a: '737' },
  { q: '84 × 15 = ___', a: '1,260' },
];

const divisionLevel3 = [
  { q: '252 ÷ 7 = ___', a: '36' },
  { q: '336 ÷ 8 = ___', a: '42' },
  { q: '405 ÷ 9 = ___', a: '45' },
  { q: '312 ÷ 6 = ___', a: '52' },
  { q: '455 ÷ 5 = ___', a: '91' },
  { q: '492 ÷ 4 = ___', a: '123' },
  { q: '378 ÷ 7 = ___', a: '54' },
  { q: '504 ÷ 6 = ___', a: '84' },
  { q: '432 ÷ 8 = ___', a: '54' },
  { q: '270 ÷ 9 = ___', a: '30' },
  { q: '364 ÷ 7 = ___', a: '52' },
  { q: '480 ÷ 6 = ___', a: '80' },
  { q: '315 ÷ 5 = ___', a: '63' },
  { q: '288 ÷ 4 = ___', a: '72' },
  { q: '567 ÷ 7 = ___', a: '81' },
];

const integerLevel3 = [
  { q: '3 + (−4) × 2 = ___', a: '−5', e: 'Multiply first: −4 × 2 = −8, then 3 + (−8) = −5.' },
  { q: '(−5)² − 3 × (−4) = ___', a: '37' },
  { q: '−2 × (8 − 3) + 6 = ___', a: '−4' },
  { q: '(−6 + 4) × (−3) = ___', a: '6' },
  { q: '48 ÷ (−6) + (−5) × 2 = ___', a: '−18' },
  { q: '4 × (−3)² − 20 = ___', a: '16' },
  { q: '(−3) + (−4) × (−5) − 7 = ___', a: '10' },
  { q: '(−2)⁴ − 5 × (−3) = ___', a: '31' },
];

const fractionLevel3 = [
  { q: '1/2 × 3/4 = ___', a: '3/8' },
  { q: '2/3 × 3/5 = ___', a: '6/15 = 2/5' },
  { q: '4/5 × 5/8 = ___', a: '20/40 = 1/2' },
  { q: '3/7 × 7/9 = ___', a: '21/63 = 1/3' },
  { q: '2/5 × 3/4 = ___', a: '6/20 = 3/10' },
  { q: '5/6 × 3/10 = ___', a: '15/60 = 1/4' },
  { q: '3/8 × 4/9 = ___', a: '12/72 = 1/6' },
  { q: '7/8 × 4/7 = ___', a: '28/56 = 1/2' },
  { q: 'A recipe needs 3/4 cup of sugar. If you make 2/3 of the recipe, how much sugar?', a: '1/2 cup' },
  { q: '2/5 of 45 students passed. How many passed?', a: '18' },
];

const decimalLevel3 = [
  { q: '1.2 × 0.3 = ___', a: '0.36' },
  { q: '2.4 × 0.5 = ___', a: '1.20 = 1.2' },
  { q: '3.6 × 1.5 = ___', a: '5.40 = 5.4' },
  { q: '0.8 × 0.9 = ___', a: '0.72' },
  { q: '4.2 × 2.5 = ___', a: '10.50 = 10.5' },
  { q: '1.5 × 1.5 = ___', a: '2.25' },
  { q: '0.6 × 0.06 = ___', a: '0.036' },
  { q: '3.14 × 2.0 = ___', a: '6.28' },
  { q: 'Area of rectangle: length = 3.5 m, width = 2.4 m. Area = ___', a: '8.4 m²' },
  { q: '0.25 × 0.4 = ___', a: '0.10 = 0.1' },
];

const pemdasLevel3 = [
  { q: '√49 + 3² − 5 = ___', a: '11' },
  { q: '100 − 4(5 + 3) = ___', a: '68' },
  { q: '(−3)² + 2 × (−4) = ___', a: '1' },
];

const literacyLevel3 = [
  { q: 'Carlo saves ₱50 every school day. 5 school days. Total savings?', a: '₱250' },
  { q: 'Tank holds 500 L, loses 20 L/hr. After 6 hours, water remaining?', a: '380 liters' },
  { q: 'Store buys 10 dozen eggs at ₱180/dozen, sells at ₱20 each. Profit?', a: '₱360' },
];

const multiplicationLevel4 = [
  { q: '124 × 7 = ___', a: '868' },
  { q: '253 × 6 = ___', a: '1,518' },
  { q: '407 × 5 = ___', a: '2,035' },
  { q: '318 × 9 = ___', a: '2,862' },
  { q: '625 × 8 = ___', a: '5,000' },
  { q: '741 × 4 = ___', a: '2,964' },
  { q: '536 × 7 = ___', a: '3,752' },
  { q: '892 × 3 = ___', a: '2,676' },
  { q: '164 × 9 = ___', a: '1,476' },
  { q: '275 × 6 = ___', a: '1,650' },
  { q: '348 × 5 = ___', a: '1,740' },
  { q: '916 × 8 = ___', a: '7,328' },
  { q: '473 × 7 = ___', a: '3,311' },
  { q: '682 × 4 = ___', a: '2,728' },
  { q: '539 × 6 = ___', a: '3,234' },
];

const divisionLevel4 = [
  { q: '1,248 ÷ 6 = ___', a: '208' },
  { q: '2,835 ÷ 9 = ___', a: '315' },
  { q: '4,032 ÷ 8 = ___', a: '504' },
  { q: '3,654 ÷ 7 = ___', a: '522' },
  { q: '5,460 ÷ 5 = ___', a: '1,092' },
  { q: '2,496 ÷ 4 = ___', a: '624' },
  { q: '6,318 ÷ 6 = ___', a: '1,053' },
  { q: '3,528 ÷ 8 = ___', a: '441' },
  { q: '₱1,260 shared equally among 9 students. Each receives ___', a: '₱140' },
  { q: 'A rope 2,856 cm long is cut into 7 equal pieces. Each piece = ___', a: '408 cm' },
  { q: '840 ÷ 24 = ___', a: '35' },
  { q: '2,250 ÷ 45 = ___', a: '50' },
  { q: '1,080 ÷ 36 = ___', a: '30' },
  { q: '4,560 ÷ 48 = ___', a: '95' },
  { q: '7,560 ÷ 63 = ___', a: '120' },
];

const integerLevel4 = [
  { q: 'A submarine is at −350 m. It rises 120 m, then descends 75 m. Final depth?', a: '−305 m' },
  { q: 'Temperature was −8°C. It rose 15°C then dropped 6°C. Final temperature?', a: '1°C' },
  { q: '(−4) × (3 − 7) ÷ (−2) = ___', a: '−8' },
  { q: 'A diver descends 30 m below sea level 3 times. Total depth in meters?', a: '−90 m' },
  { q: '(−3)³ + 4 × (−5) − (−10) = ___', a: '−37' },
  { q: '2 × (−6)² − 3 × (−4)³ = ___', a: '264' },
];

const fractionLevel4 = [
  { q: '1/2 ÷ 1/4 = ___', a: '2', e: 'Keep-change-flip: 1/2 × 4/1 = 2.' },
  { q: '3/4 ÷ 1/2 = ___', a: '3/2 = 1½' },
  { q: '2/3 ÷ 4/9 = ___', a: '3/2 = 1½' },
  { q: '5/6 ÷ 5/12 = ___', a: '2' },
  { q: '3/8 ÷ 3/4 = ___', a: '1/2' },
  { q: '7/9 ÷ 7/3 = ___', a: '1/3' },
  { q: '4/5 ÷ 2/15 = ___', a: '6' },
  { q: 'A rope 3/4 m long is cut into pieces of 1/8 m each. How many pieces?', a: '6 pieces' },
  { q: '3/4 ÷ 2/3 = ___', a: '9/8 = 1 1/8' },
  { q: '5/7 ÷ 10/21 = ___', a: '3/2 = 1½' },
];

const decimalLevel4 = [
  { q: '7.2 ÷ 0.9 = ___', a: '8' },
  { q: '6.4 ÷ 0.8 = ___', a: '8' },
  { q: '4.5 ÷ 1.5 = ___', a: '3' },
  { q: '12.6 ÷ 0.6 = ___', a: '21' },
  { q: '9.0 ÷ 0.3 = ___', a: '30' },
  { q: '3.6 ÷ 1.2 = ___', a: '3' },
  { q: '0.81 ÷ 0.9 = ___', a: '0.9' },
  { q: '₱360 ÷ ₱1.50 per item = ___', a: '240 items' },
  { q: 'A ribbon 4.8 m long is cut into pieces of 0.6 m each. How many pieces?', a: '8 pieces' },
  { q: '25.5 ÷ 0.5 = ___', a: '51' },
  { q: 'Total bill ₱7.20 ÷ 0.9 = ___', a: '8' },
  { q: '2.496 ÷ 0.8 = ___', a: '3.12' },
];

const pemdasLevel4 = [
  { q: '−2³ + 5 × (−3) = ___', a: '−23' },
  { q: '(4 + 6) ÷ 2 × 3 − 5 = ___', a: '10' },
  { q: '3 × [(8 − 5)² + 1] = ___', a: '30' },
];

const literacyLevel4 = [
  { q: 'Tricycle: ₱15 flag-down + ₱5/km. Fare for 7 km?', a: '₱50' },
  { q: '1 USD = ₱56.50. How much is $35?', a: '₱1,977.50' },
  { q: 'Student reads 25 pages/day. Days to finish 300-page novel?', a: '12 days' },
];

const module1 = {
  id: 1,
  title: 'Arithmetic Operations',
  theme: 'Village of Traders',
  levels: [
    {
      id: 1,
      title: 'Arithmetic Facts',
      description: 'Multiplication tables, basic division, integers, fractions, decimals, PEMDAS, and peso word problems',
      difficulty: 'easy',
      questions: buildQuestions(1, 1, 'easy', [
        ...multiplicationLevel1,
        ...divisionLevel1,
        ...integerLevel1,
        ...fractionLevel1,
        ...decimalLevel1,
        ...pemdasLevel1,
        ...literacyLevel1,
      ], {
        hint: 'Use the basic operation rule first, then compare your result with the choices.',
      }),
    },
    {
      id: 2,
      title: 'Multi-Digit Operations',
      description: 'Two-digit operations, integer signs, unlike denominators, and decimal multiplication',
      difficulty: 'medium',
      questions: buildQuestions(1, 2, 'medium', [
        ...multiplicationLevel2,
        ...divisionLevel2,
        ...integerLevel2,
        ...fractionLevel2,
        ...decimalLevel2,
        ...pemdasLevel2,
        ...literacyLevel2,
      ], {
        hint: 'Break the numbers apart, follow sign rules, or find the LCD depending on the item.',
      }),
    },
    {
      id: 3,
      title: 'Applied Operations',
      description: 'Two-digit products, long division, mixed integers, fraction multiplication, and decimals',
      difficulty: 'hard',
      questions: buildQuestions(1, 3, 'hard', [
        ...multiplicationLevel3,
        ...divisionLevel3,
        ...integerLevel3,
        ...fractionLevel3,
        ...decimalLevel3,
        ...pemdasLevel3,
        ...literacyLevel3,
      ], {
        hint: 'Follow order of operations and show each step before choosing an answer.',
      }),
    },
    {
      id: 4,
      title: 'Boss: Numerian Arithmetic',
      description: 'Advanced multiplication, extended division, multi-step integers, fraction division, decimals, and real-life problems',
      difficulty: 'hard',
      isBoss: true,
      questions: buildQuestions(1, 4, 'hard', [
        ...multiplicationLevel4,
        ...divisionLevel4,
        ...integerLevel4,
        ...fractionLevel4,
        ...decimalLevel4,
        ...pemdasLevel4,
        ...literacyLevel4,
      ], {
        hint: 'For boss items, write the operation in order and simplify one step at a time.',
      }),
    },
  ],
};

export default module1;
