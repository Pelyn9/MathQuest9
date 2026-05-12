import { useEffect, useRef } from 'react';
import { Animated, Easing, ImageBackground, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

const castleBackground = require('../image/castle.png');

export default function QuestionCard({ question, selected, onSelect, showCorrect, usedFifty, disabled = false, onOpenGuide }) {
  const { colors: C } = useTheme();
  const choicesLocked = showCorrect || disabled;
  const cardFade = useRef(new Animated.Value(1)).current;
  const cardSlide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    cardFade.setValue(0);
    cardSlide.setValue(8);
    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(cardSlide, {
        toValue: 0,
        duration: 180,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardFade, cardSlide, question?.question]);

  const getOptionStyle = (index) => {
    if (showCorrect) {
      if (index === question.correct) return [styles.option, { backgroundColor: `${C.success}25`, borderColor: C.success, borderWidth: 1.5 }];
      if (index === selected && index !== question.correct) return [styles.option, { backgroundColor: `${C.danger}25`, borderColor: C.danger, borderWidth: 1.5 }];
      return [styles.option, { backgroundColor: C.cardLight, borderColor: C.cardBorder }];
    }
    if (index === selected) return [styles.option, { backgroundColor: `${C.info}20`, borderColor: C.info, borderWidth: 1.5 }];
    if (usedFifty && question.eliminated?.includes(index)) return styles.optionEliminated;
    return [styles.option, { backgroundColor: C.cardLight, borderColor: C.cardBorder }];
  };

  const getLetterStyle = (index) => {
    if (showCorrect && index === question.correct) return [styles.letter, { backgroundColor: `${C.success}50` }];
    if (showCorrect && index === selected && index !== question.correct) return [styles.letter, { backgroundColor: `${C.danger}50` }];
    if (index === selected) return [styles.letter, { backgroundColor: `${C.info}40` }];
    return [styles.letter, { backgroundColor: C.backgroundLight }];
  };

  const getLetterText = (index) => {
    if (showCorrect && index === question.correct) return { color: C.white, fontWeight: 'bold' };
    if (showCorrect && index === selected && index !== question.correct) return { color: C.white, fontWeight: 'bold' };
    if (index === selected) return { color: C.info, fontWeight: 'bold' };
    return { color: C.textMuted };
  };

  return (
    <Animated.View style={[styles.container, { opacity: cardFade, transform: [{ translateY: cardSlide }] }]}>
      <ImageBackground
        source={castleBackground}
        resizeMode="cover"
        style={[styles.questionBox, { backgroundColor: `${C.card}E8`, borderColor: `${C.gold}45`, shadowColor: C.primary }]}
        imageStyle={styles.cardImage}
      >
        <View pointerEvents="none" style={styles.cardTint} />
        <View style={[styles.questionIcon, { backgroundColor: `${C.primary}22`, borderColor: `${C.gold}45` }]}>
          <AppText style={[styles.questionIconText, { color: C.white }]}>?</AppText>
        </View>
        <View style={styles.questionCopy}>
          {!!question.storyContext && (
            <View style={[styles.storyBadge, { borderColor: `${C.gold}38`, backgroundColor: `${C.gold}14` }]}>
              <Ionicons name="flag-outline" size={12} color={C.gold} />
              <AppText style={[styles.storyBadgeText, { color: C.gold }]} numberOfLines={1}>
                {question.storyContext}
              </AppText>
            </View>
          )}
          {!!question.storyPrompt && (
            <AppText style={[styles.storyPrompt, { color: C.textMuted }]} numberOfLines={2}>
              {question.storyPrompt}
            </AppText>
          )}
          <AppText style={[styles.questionText, { color: C.text }]}>{question.question}</AppText>
        </View>
        {!!onOpenGuide && (
          <TouchableOpacity
            style={[styles.guideBtn, { backgroundColor: `${C.gold}18`, borderColor: `${C.gold}45` }]}
            onPress={onOpenGuide}
            activeOpacity={0.78}
            accessibilityRole="button"
            accessibilityLabel="Open Royal Guide"
          >
            <Ionicons name="book-outline" size={17} color={C.gold} />
          </TouchableOpacity>
        )}
      </ImageBackground>

      <View style={styles.optionsContainer}>
        {question.options.map((opt, i) => {
          const isEliminated = usedFifty && question.eliminated?.includes(i);
          if (isEliminated && !showCorrect) return null;

          return (
            <TouchableOpacity
              key={i}
              style={[getOptionStyle(i), disabled && styles.optionDisabled]}
              onPress={() => !choicesLocked && onSelect(i)}
              disabled={choicesLocked || isEliminated}
              activeOpacity={0.7}
            >
              <ImageBackground
                source={castleBackground}
                resizeMode="cover"
                style={styles.optionBackground}
                imageStyle={styles.optionImage}
              >
                <View pointerEvents="none" style={styles.optionTint} />
                <View style={styles.optionRow}>
                  <View style={getLetterStyle(i)}>
                    <AppText style={[{ fontSize: 13 }, getLetterText(i)]}>
                      {String.fromCharCode(65 + i)}
                    </AppText>
                  </View>
                  <AppText style={[styles.optionText, { color: C.text }, selected === i && !showCorrect && { fontWeight: '600' }]}>
                    {opt}
                  </AppText>
                  {showCorrect && i === question.correct && (
                    <View style={[styles.correctCheck, { backgroundColor: C.success }]}>
                      <AppText style={[styles.correctCheckText, { color: C.white }]}>&#10003;</AppText>
                    </View>
                  )}
                </View>
              </ImageBackground>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  questionBox: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
  },
  cardImage: {
    borderRadius: 12,
    opacity: 0.28,
  },
  cardTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 11, 22, 0.55)',
  },
  questionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  questionIconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
  },
  questionCopy: {
    flex: 1,
    minWidth: 0,
  },
  storyBadge: {
    alignSelf: 'flex-start',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 7,
  },
  storyBadgeText: {
    flexShrink: 1,
    minWidth: 0,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  storyPrompt: {
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 7,
  },
  guideBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    borderRadius: 10,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionBackground: {
    padding: 14,
  },
  optionImage: {
    borderRadius: 10,
    opacity: 0.2,
  },
  optionTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(8, 11, 22, 0.48)',
  },
  optionDisabled: {
    opacity: 0.55,
  },
  optionEliminated: {
    opacity: 0,
    height: 0,
    padding: 0,
    margin: 0,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  letter: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(244,197,106,0.2)',
  },
  optionText: {
    fontSize: 15,
    flex: 1,
    lineHeight: 20,
  },
  correctCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctCheckText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
