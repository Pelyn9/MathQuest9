import { View, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import AppText from './AppText';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

export default function RewardModal({ visible, coins, badge, onClose }) {
  const { colors: C } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={[styles.overlay]}>
        <View style={[styles.modal, { backgroundColor: C.card, borderColor: C.gold }]}>
          <View style={styles.starsRow}>
            <Ionicons name="star" size={28} color={C.gold} />
            <Ionicons name="star" size={36} color={C.gold} />
            <Ionicons name="star" size={28} color={C.gold} />
          </View>

          <AppText style={[styles.title, { color: C.gold }]}>Rewards Earned!</AppText>

          {coins > 0 && (
            <View style={[styles.rewardRow, { backgroundColor: C.backgroundLight, borderColor: C.cardBorder }]}>
              <Ionicons name="cash-outline" size={22} color={C.gold} />
              <AppText style={[styles.rewardText, { color: C.text }]}>+{coins} Coins</AppText>
            </View>
          )}

          {badge && (
            <View style={[styles.rewardRow, { backgroundColor: C.backgroundLight, borderColor: C.cardBorder }]}>
              <Ionicons name={badge.icon} size={24} color={C.gold} />
              <View style={styles.badgeInfo}>
                <AppText style={[styles.badgeName, { color: C.text }]}>{badge.name}</AppText>
                <AppText style={[styles.badgeDesc, { color: C.textMuted }]}>{badge.desc}</AppText>
              </View>
            </View>
          )}

          <TouchableOpacity style={[styles.button, { backgroundColor: C.primary }]} onPress={onClose}>
            <AppText style={[styles.buttonText, { color: C.white }]}>Continue</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 30,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 20,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    width: '100%',
    borderWidth: 1,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  badgeInfo: {
    flex: 1,
  },
  badgeName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  badgeDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
