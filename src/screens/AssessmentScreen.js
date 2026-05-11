import { View, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import AppText from '../components/AppText';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useMemo, useEffect } from 'react';
import { useTheme } from '../theme/ThemeContext';
import { useGame } from '../context/GameContext';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';
import ScreenBackground from '../components/ScreenBackground';

const MODULE_DATA = {
  1: require('../data/module1').default,
  2: require('../data/module2').default,
  3: require('../data/module3').default,
  4: require('../data/module4').default,
};

const ASSESSMENT_COUNT = 10;
const ASSESSMENT_TIME = 60;

export default function AssessmentScreen({ route, navigation }) {
  const isPostTest = route.params?.type === 'post';
  const { colors: C } = useTheme();
  const styles = useMemo(() => createStyles(C), [C]);
  const { state, setPreTest, setPostTest } = useGame();
  const [questions, setQuestions] = useState([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timerRunning, setTimerRunning] = useState(true);
  const [timerKey, setTimerKey] = useState(0);

  useEffect(() => {
    const pool = [];
    Object.values(MODULE_DATA).forEach(mod => {
      mod.levels.forEach(level => {
        level.questions.forEach(q => {
          pool.push(q);
        });
      });
    });
    const shuffled = pool.sort(() => Math.random() - 0.5).slice(0, ASSESSMENT_COUNT);
    setQuestions(shuffled);
  }, []);

  const currentQ = questions[qIndex];
  const isLast = qIndex >= questions.length - 1;

  const stopTimer = () => setTimerRunning(false);

  const handleTimerExpiry = () => {
    if (showCorrect || finished) return;
    setSelected(-1);
    setShowCorrect(true);
    stopTimer();
  };

  useEffect(() => {
    if (currentQ && !showCorrect && !finished) {
      setTimerKey(k => k + 1);
      setTimerRunning(true);
    }
  }, [qIndex, showCorrect, finished]);

  const finishAssessment = () => {
    const total = questions.length;
    const pct = Math.round((correctCount / total) * 100);
    if (isPostTest) {
      setPostTest(pct);
    } else {
      setPreTest(pct);
    }
    setFinished(true);
  };

  const handleSelect = (idx) => {
    if (showCorrect) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    stopTimer();
    const correct = selected === currentQ.correct;
    setShowCorrect(true);
    if (correct) setCorrectCount(c => c + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowCorrect(false);
    if (isLast) {
      finishAssessment();
    } else {
      setQIndex(i => i + 1);
    }
  };

  if (finished) {
    const total = questions.length;
    const pct = Math.round((correctCount / total) * 100);
    return (
      <View style={styles.wrapper}>
      <ScreenBackground preset="assessment" />
      <View style={styles.container}>
        <View style={styles.resultCard}>
          <Ionicons name={pct >= 75 ? 'trophy' : 'school'} size={56} color={pct >= 75 ? C.gold : C.warning} />
          <AppText style={styles.resultTitle} decorative>{isPostTest ? 'Post-Test' : 'Pre-Test'} Complete!</AppText>
          <AppText style={styles.resultScore}>{correctCount}/{total}</AppText>
          <AppText style={styles.resultPct}>{pct}%</AppText>
          <View style={styles.resultBadge}>
            <Ionicons name={pct >= 75 ? 'checkmark-circle' : 'information-circle'} size={18} color={pct >= 75 ? C.success : C.info} />
            <AppText style={[styles.resultBadgeText, { color: pct >= 75 ? C.success : C.info }]}>
              {pct >= 75 ? 'Passed!' : 'Keep practicing!'}
            </AppText>
          </View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.goBack()}>
            <AppText style={styles.doneBtnText}>Back to Profile</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    );
  }

  if (!currentQ) {
    return (
      <View style={styles.wrapper}>
      <ScreenBackground preset="assessment" />
      <View style={styles.container}>
        <AppText style={{ color: C.text }}>Loading...</AppText>
      </View>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScreenBackground preset="assessment" />
      <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={22} color={C.textLight} />
        </TouchableOpacity>
        <View style={styles.topCenter}>
          <ProgressBar current={qIndex + (showCorrect ? 1 : 0)} total={questions.length} color={C.primary} showLabel={false} />
          <Timer seconds={ASSESSMENT_TIME} onExpire={handleTimerExpiry} running={timerRunning} resetKey={timerKey} />
        </View>
        <AppText style={styles.questionNum}>{qIndex + 1}/{questions.length}</AppText>
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <AppText style={styles.headerLabel}>{isPostTest ? 'Post-Test' : 'Pre-Test'}</AppText>
          <AppText style={styles.headerTitle}>{currentQ.question}</AppText>
        </View>

        <View style={styles.options}>
          {currentQ.options.map((opt, i) => {
            const isSelected = selected === i;
            const isCorrect = showCorrect && i === currentQ.correct;
            const isWrong = showCorrect && isSelected && i !== currentQ.correct;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.option,
                  { backgroundColor: isCorrect ? `${C.success}25` : isWrong ? `${C.danger}25` : isSelected ? `${C.info}20` : C.card, borderColor: isCorrect ? C.success : isWrong ? C.danger : isSelected ? C.info : C.cardBorder },
                ]}
                onPress={() => handleSelect(i)}
                disabled={showCorrect}
                activeOpacity={0.7}
              >
                <AppText style={[styles.letter, { color: isCorrect ? C.success : isWrong ? C.danger : isSelected ? C.info : C.textMuted, fontWeight: 'bold' }]}>
                  {String.fromCharCode(65 + i)}
                </AppText>
                <AppText style={[styles.optionText, { color: C.text }]}>{opt}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {showCorrect && (
          <View style={[styles.explanationBox, { backgroundColor: `${C.info}20`, borderLeftColor: C.info }]}>
            <AppText style={[styles.explanationTitle, { color: C.info }]}>Explanation</AppText>
            <AppText style={[styles.explanationText, { color: C.textLight }]}>{currentQ.explanation}</AppText>
          </View>
        )}

        <View style={styles.bottomSection}>
          {!showCorrect ? (
            <TouchableOpacity
              style={[styles.submitBtn, selected === null && styles.btnDisabled]}
              onPress={handleSubmit}
              disabled={selected === null}
            >
              <Ionicons name="shield-checkmark" size={20} color={C.white} />
              <AppText style={styles.submitBtnText}>Confirm Answer</AppText>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <AppText style={styles.nextBtnText}>{isLast ? 'Finish' : 'Next'}</AppText>
              <Ionicons name="arrow-forward" size={20} color={C.white} />
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
    </View>
  );
}

const createStyles = (C) => StyleSheet.create({
  wrapper: { flex: 1 },
  container: { flex: 1, backgroundColor: 'transparent' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.backgroundLight,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: C.backgroundLight, justifyContent: 'center', alignItems: 'center',
  },
  topCenter: { flex: 1 },
  questionNum: { fontSize: 13, color: C.textMuted, fontWeight: '600' },
  body: { flex: 1 },
  header: { padding: 20, paddingBottom: 12 },
  headerLabel: { fontSize: 11, fontWeight: '700', color: C.primary, letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: C.text, marginTop: 8, lineHeight: 26 },
  options: { paddingHorizontal: 20, gap: 10 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderRadius: 12, borderWidth: 1,
  },
  letter: {
    width: 28, height: 28, borderRadius: 8,
    textAlign: 'center', lineHeight: 28, fontSize: 13,
  },
  optionText: { fontSize: 15, flex: 1, lineHeight: 20 },
  explanationBox: {
    marginHorizontal: 20, marginTop: 16, padding: 14,
    borderRadius: 12, borderLeftWidth: 3,
  },
  explanationTitle: { fontSize: 13, fontWeight: 'bold', marginBottom: 4 },
  explanationText: { fontSize: 13, lineHeight: 19 },
  bottomSection: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 30 },
  submitBtn: {
    backgroundColor: C.primary, paddingVertical: 14, borderRadius: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  btnDisabled: { opacity: 0.4 },
  submitBtnText: { color: C.white, fontSize: 15, fontWeight: 'bold' },
  nextBtn: {
    backgroundColor: C.success, paddingVertical: 14, borderRadius: 14,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
  },
  nextBtnText: { color: C.white, fontSize: 15, fontWeight: 'bold' },
  resultCard: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 30,
  },
  resultTitle: { fontSize: 22, fontWeight: 'bold', color: C.text, marginTop: 16 },
  resultScore: { fontSize: 48, fontWeight: 'bold', color: C.text, marginTop: 12 },
  resultPct: { fontSize: 20, color: C.textMuted, marginTop: 4 },
  resultBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 12 },
  resultBadgeText: { fontSize: 16, fontWeight: '600' },
  doneBtn: {
    marginTop: 30, backgroundColor: C.primary, paddingVertical: 14,
    paddingHorizontal: 40, borderRadius: 25,
  },
  doneBtnText: { color: C.white, fontSize: 16, fontWeight: 'bold' },
});
