import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function LivesDisplay({ lives, maxLives }) {
  const { colors: C } = useTheme();
  const max = maxLives || 5;
  const size = max > 3 ? 14 : 18;

  return (
    <View style={styles.container}>
      {Array.from({ length: max }, (_, i) => (
        <Ionicons
          key={i}
          name={i < lives ? 'heart' : 'heart-outline'}
          size={size}
          color={i < lives ? C.heart : C.textMuted}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 1,
  },
});
