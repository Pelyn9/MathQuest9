import { View, TouchableOpacity, StyleSheet } from 'react-native';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function ModuleCard({ module, onPress }) {
  const { colors: C } = useTheme();
  const isComplete = module.levelsCompleted.length >= module.totalLevels;
  const pct = module.totalLevels > 0 ? module.levelsCompleted.length / module.totalLevels : 0;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: C.card, borderColor: C.cardBorder }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${module.color}20` }]}>
        <Ionicons name={module.icon} size={28} color={module.color} />
      </View>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <AppText style={[styles.moduleNum, { color: C.textMuted }]}>Module {module.id}</AppText>
          {isComplete && <Ionicons name="checkmark-circle" size={16} color={C.success} />}
        </View>
        <AppText style={[styles.title, { color: C.text }]} decorative>{module.title}</AppText>
        <AppText style={[styles.subtitle, { color: C.textMuted }]}>{module.subtitle}</AppText>
        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: C.backgroundLight }]}>
            <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: module.color }]} />
          </View>
          <AppText style={[styles.progressText, { color: C.textMuted }]}>
            {module.levelsCompleted.length}/{module.totalLevels}
          </AppText>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color={C.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    marginHorizontal: 20,
    marginVertical: 5,
    borderWidth: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moduleNum: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 2,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 1,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  track: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
  },
});
