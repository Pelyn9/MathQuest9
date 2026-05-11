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
      style={[styles.card, { backgroundColor: `${C.card}E6`, borderColor: `${module.color}55`, shadowColor: module.color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${module.color}20`, borderColor: `${C.gold}35` }]}>
        <Ionicons name={module.icon} size={28} color={module.color} />
      </View>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <AppText style={[styles.moduleNum, { color: module.color }]}>Module {module.id}</AppText>
          {isComplete && <Ionicons name="checkmark-circle" size={16} color={C.success} />}
        </View>
        <AppText style={[styles.title, { color: C.text }]} decorative>{module.title}</AppText>
        <AppText style={[styles.subtitle, { color: C.textMuted }]}>{module.subtitle}</AppText>
        <View style={styles.progressRow}>
          <View style={[styles.track, { backgroundColor: `${C.black}55`, borderColor: `${module.color}30` }]}>
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
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginVertical: 5,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1,
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
    borderWidth: 1,
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
