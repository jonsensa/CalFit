import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GOALS, type UserProfile } from '../types/userProfile';

type HomeScreenProps = { userProfile: UserProfile };

export function HomeScreen({ userProfile }: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.eyebrow}>YOUR DAILY BASELINE</Text>
        <Text style={styles.title}>Welcome to CalFit</Text>
        <Text style={styles.subtitle}>
          Your saved estimates are ready whenever you reopen the app.
        </Text>

        <View style={styles.card}>
          <Text style={styles.metricLabel}>
            {GOALS.find((goal) => goal.value === userProfile.goal)?.label} · Daily target
          </Text>
          <View style={styles.calorieRow}>
            <Text style={styles.metricValue}>{userProfile.dailyTarget}</Text>
            <Text style={styles.unit}>kcal/day</Text>
          </View>
          <Text style={styles.note}>
            Range: {userProfile.bufferRange.min}–{userProfile.bufferRange.max} kcal (±100)
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.metricLabel}>BMI</Text>
          <Text style={styles.metricValue}>{userProfile.bmi.toFixed(1)}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.metricLabel}>Maintenance calories</Text>
          <View style={styles.calorieRow}>
            <Text style={styles.metricValue}>{userProfile.maintenanceCalories}</Text>
            <Text style={styles.unit}>kcal/day</Text>
          </View>
        </View>

        <Text style={styles.note}>
          These numbers are estimates based on the Mifflin–St Jeor equation and your selected
          activity level.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  container: { padding: 24, paddingBottom: 40 },
  eyebrow: {
    marginTop: 20,
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  title: { marginTop: 10, color: '#0f172a', fontSize: 30, fontWeight: '800' },
  subtitle: {
    marginTop: 10,
    marginBottom: 28,
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    marginBottom: 16,
    padding: 22,
    borderWidth: 1,
    borderColor: '#dbeafe',
    borderRadius: 18,
    backgroundColor: '#fff',
  },
  metricLabel: { marginBottom: 8, color: '#64748b', fontSize: 15, fontWeight: '700' },
  metricValue: { color: '#0f172a', fontSize: 38, fontWeight: '800' },
  calorieRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  unit: { color: '#64748b', fontSize: 16, fontWeight: '600' },
  note: { marginTop: 8, color: '#64748b', fontSize: 13, lineHeight: 20 },
});
