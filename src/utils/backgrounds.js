const LIGHT_SCREEN = {
  home: { colors: ['#FDF0D5', '#F8E0B0', '#F0D098'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  map: { colors: ['#D0DCF0', '#C0CCE8', '#B0BCE0'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  profile: { colors: ['#E8D0F0', '#DCBCE8', '#D0A8E0'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  shop: { colors: ['#F5E6D0', '#F0D6B0', '#E8C498'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  difficulty: { colors: ['#D0ECE8', '#C0E0DC', '#B0D4D0'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  assessment: { colors: ['#D0E8F0', '#C0DCE8', '#B0D0E0'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  result: { colors: ['#FFF5CC', '#F8E8A0', '#F0D888'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
};

const DARK_SCREEN = {
  home: { colors: ['#0D0805', '#1A0F0A', '#241510'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  map: { colors: ['#050510', '#0A0A1A', '#0D0D20'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  profile: { colors: ['#0D050D', '#1A0A1A', '#241020'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  shop: { colors: ['#150A05', '#241008', '#321A0E'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  difficulty: { colors: ['#040208', '#08050E', '#0D0815'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  assessment: { colors: ['#050A0D', '#0A0F15', '#0D1520'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  result: { colors: ['#140D05', '#1A0F0A', '#241510'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
};

const FOREST_SCREEN = {
  home: { colors: ['#E8F0D5', '#D8E8C0', '#C8DAA8'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  map: { colors: ['#D0E8C0', '#C0DCB0', '#B0D0A0'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  profile: { colors: ['#E0ECD0', '#D0E4C0', '#C0DAB0'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  shop: { colors: ['#EAF0D8', '#DCE8C0', '#C8DAA8'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  difficulty: { colors: ['#D0E8D8', '#C0DCCC', '#B0D0C0'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  assessment: { colors: ['#D8E8D0', '#C8DCC0', '#B8D0B0'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  result: { colors: ['#F0F0CC', '#E8E8A0', '#DCDC88'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
};

const OCEAN_SCREEN = {
  home: { colors: ['#0A0D1A', '#0F1528', '#141D36'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  map: { colors: ['#050A18', '#0A1025', '#0F1832'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  profile: { colors: ['#0A0E20', '#101830', '#162040'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  shop: { colors: ['#0D1225', '#121C38', '#182A4A'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  difficulty: { colors: ['#040A18', '#081025', '#0C1832'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  assessment: { colors: ['#050E1A', '#0A1828', '#0F2236'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  result: { colors: ['#141D30', '#1A2540', '#203050'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
};

const EMBER_SCREEN = {
  home: { colors: ['#1A0A05', '#281008', '#361A0C'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  map: { colors: ['#1A0805', '#281008', '#36180C'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  profile: { colors: ['#1A0A08', '#281210', '#361C18'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  shop: { colors: ['#200A05', '#301408', '#442210'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
  difficulty: { colors: ['#1A0505', '#280808', '#360C0C'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
  assessment: { colors: ['#1A0805', '#281008', '#36180C'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  result: { colors: ['#281005', '#361808', '#44200C'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
};

const LIGHT_MODULE = {
  1: [
    { colors: ['#E0F0D8', '#D0E8C8', '#C0E0B8'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#D8ECD0', '#C8E4C0', '#B8DCB0'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#E4F0DC', '#D4E8CC', '#C4E0BC'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#DCEED4', '#CCE6C4', '#BCDEB4'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  2: [
    { colors: ['#D0DCF0', '#C0D0E8', '#B0C4E0'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#C8D8EC', '#B8CCE4', '#A8C0DC'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#D4E0F0', '#C4D4E8', '#B4C8E0'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#CCD8EC', '#BCCEE4', '#ACC4DC'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  3: [
    { colors: ['#E8D8F0', '#DCC8E8', '#D0B8E0'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#E0D0EC', '#D4C0E4', '#C8B0DC'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#ECDCEC', '#E0CCE4', '#D4BCDC'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#E4D4EC', '#D8C4E4', '#CCB4DC'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  4: [
    { colors: ['#F0E0D0', '#E8D0B8', '#E0C0A0'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#ECD8C8', '#E4CCB0', '#DCC098'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#F0E4D4', '#E8D4BC', '#E0C4A4'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#ECDCCC', '#E4D0B4', '#DCC49C'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
};

const DARK_MODULE = {
  1: [
    { colors: ['#0A140A', '#0F1C0F', '#142414'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#080F08', '#0D180D', '#122012'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0C180C', '#102010', '#162816'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0A140A', '#0F1C0F', '#142414'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  2: [
    { colors: ['#0A0A18', '#0E0E20', '#121228'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#080818', '#0C0C20', '#101028'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0C0C1C', '#101024', '#14142C'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0A0A18', '#0E0E20', '#121228'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  3: [
    { colors: ['#140A14', '#1C0E1C', '#241224'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#100810', '#180C18', '#201020'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#180C18', '#201020', '#281428'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#140A14', '#1C0E1C', '#241224'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  4: [
    { colors: ['#1A0A0A', '#240E0E', '#2C1212'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#140808', '#1C0C0C', '#241010'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#1C0C0C', '#281010', '#301414'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#180A0A', '#221010', '#2C1414'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
};

const FOREST_MODULE = {
  1: [
    { colors: ['#D8ECD0', '#C8E4C0', '#B8DCB0'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#D0E8C8', '#C0E0B8', '#B0D8A8'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#E0F0D8', '#D0E8C8', '#C0E0B8'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#D4ECD0', '#C4E4C0', '#B4DCB0'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  2: [
    { colors: ['#C8DCF0', '#B8D0E8', '#A8C4E0'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#C0D8EC', '#B0CCE4', '#A0C0DC'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#D0E0F0', '#C0D4E8', '#B0C8E0'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#C4D8EC', '#B4CEE4', '#A4C4DC'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  3: [
    { colors: ['#E0D0EC', '#D4C0E4', '#C8B0DC'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#DCC8E8', '#D0BCE0', '#C4ACD8'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#E8D8F0', '#DCC8E8', '#D0B8E0'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#E0D0E8', '#D4C0E0', '#C8B0D8'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  4: [
    { colors: ['#E8DCCC', '#E0D0B8', '#D8C4A4'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#E4D8C4', '#DCCCB0', '#D4C09C'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#ECE0D0', '#E4D4BC', '#DCC8A8'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#E4D8C8', '#DCD0B4', '#D4C4A0'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
};

const OCEAN_MODULE = {
  1: [
    { colors: ['#0A180A', '#0F200F', '#142814'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#081408', '#0D1C0D', '#122412'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0C1C0C', '#102410', '#162C16'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0A180A', '#0F200F', '#142814'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  2: [
    { colors: ['#0A0E20', '#0E1428', '#121C30'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#080C1C', '#0C1024', '#10182C'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0C1024', '#10182C', '#142034'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0A0E20', '#0E1428', '#121C30'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  3: [
    { colors: ['#140A18', '#1C0E20', '#241228'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#100814', '#180C1C', '#201024'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#180C1C', '#201024', '#28142C'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#140A18', '#1C0E20', '#241228'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  4: [
    { colors: ['#1A0A0A', '#240E0E', '#2C1212'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#140808', '#1C0C0C', '#241010'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#1C0C0C', '#281010', '#301414'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#180A0A', '#221010', '#2C1414'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
};

const EMBER_MODULE = {
  1: [
    { colors: ['#0A140A', '#0F1C0F', '#142414'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#080F08', '#0D180D', '#122012'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0C180C', '#102010', '#162816'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0A140A', '#0F1C0F', '#142414'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  2: [
    { colors: ['#0A0A18', '#0E0E20', '#121228'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#080818', '#0C0C20', '#101028'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0C0C1C', '#101024', '#14142C'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#0A0A18', '#0E0E20', '#121228'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  3: [
    { colors: ['#140A14', '#1C0E1C', '#241224'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#100810', '#180C18', '#201020'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#180C18', '#201020', '#281428'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#140A14', '#1C0E1C', '#241224'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
  4: [
    { colors: ['#1A0805', '#241008', '#2C180C'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    { colors: ['#140605', '#1C0C08', '#24140C'], start: { x: 0, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#1C0C08', '#28140C', '#301C10'], start: { x: 1, y: 0 }, end: { x: 0, y: 1 } },
    { colors: ['#180A05', '#221008', '#2C180C'], start: { x: 0, y: 0 }, end: { x: 1, y: 0 } },
  ],
};

const SCREEN_BG = {
  light: LIGHT_SCREEN,
  dark: DARK_SCREEN,
  forest: FOREST_SCREEN,
  ocean: OCEAN_SCREEN,
  ember: EMBER_SCREEN,
};

const MODULE_BG = {
  light: LIGHT_MODULE,
  dark: DARK_MODULE,
  forest: FOREST_MODULE,
  ocean: OCEAN_MODULE,
  ember: EMBER_MODULE,
};

export function getScreenBackground(screen, themeId) {
  const bg = SCREEN_BG[themeId] || LIGHT_SCREEN;
  return bg[screen] || null;
}

export function getLevelBackground(moduleId, levelId, themeId) {
  const variants = MODULE_BG[themeId] || LIGHT_MODULE;
  const module = variants[moduleId];
  if (!module) return null;
  return module[(levelId - 1) % module.length];
}
