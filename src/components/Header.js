import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import { useTheme } from '../theme/ThemeContext';

export default function Header({ title, subtitle, color }) {
  const { colors: C } = useTheme();
  const accent = color || C.primary;

  return (
    <View style={[styles.container, { borderBottomColor: accent, backgroundColor: C.card }]}>
      <AppText style={[styles.title, { color: accent }]}>{title}</AppText>
      {subtitle && <AppText style={[styles.subtitle, { color: C.textMuted }]}>{subtitle}</AppText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
});
