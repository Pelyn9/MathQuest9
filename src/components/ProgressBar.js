import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function ProgressBar({ current, total, color, showLabel = true }) {
  const { colors: C } = useTheme();
  const pct = total > 0 ? current / total : 0;
  const fillColor = color || C.primary;

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: C.backgroundLight }]}>
        <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: fillColor }]} />
      </View>
      {showLabel && (
        <AppText style={[styles.label, { color: C.textMuted }]}>
          {current} / {total}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  track: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 40,
    textAlign: 'right',
  },
});
