import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function QuestionCard({ question, selected, onSelect, showCorrect, usedFifty, disabled = false }) {
  const { colors: C } = useTheme();
  const choicesLocked = showCorrect || disabled;

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
    <View style={styles.container}>
      <View style={[styles.questionBox, { backgroundColor: C.card, borderColor: C.cardBorder }]}>
        <View style={[styles.questionIcon, { backgroundColor: C.primary }]}>
          <AppText style={[styles.questionIconText, { color: C.white }]}>?</AppText>
        </View>
        <AppText style={[styles.questionText, { color: C.text }]}>{question.question}</AppText>
      </View>

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
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },
  questionBox: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    gap: 12,
    alignItems: 'flex-start',
  },
  questionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionIconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    flex: 1,
  },
  optionsContainer: {
    gap: 8,
  },
  option: {
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
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
