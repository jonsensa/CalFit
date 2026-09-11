import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { saveUserProfile } from '../storage/userProfileStorage';
import {
  ACTIVITY_LEVELS,
  calculateHealthMetrics,
  type ActivityLevel,
  type Sex,
  type UserProfile,
} from '../types/userProfile';

type OnboardingScreenProps = {
  onProfileSaved: (profile: UserProfile) => void;
};

export function OnboardingScreen({ onProfileSaved }: OnboardingScreenProps) {
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  async function handleContinue() {
    const parsedAge = Number(age);
    const parsedHeight = Number(heightCm.replace(',', '.'));
    const parsedWeight = Number(weightKg.replace(',', '.'));

    if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
      setErrorMessage('Enter your age as a whole number greater than zero.');
      return;
    }
    if (!Number.isFinite(parsedHeight) || parsedHeight <= 0) {
      setErrorMessage('Enter a valid height in centimetres.');
      return;
    }
    if (!Number.isFinite(parsedWeight) || parsedWeight <= 0) {
      setErrorMessage('Enter a valid weight in kilograms.');
      return;
    }

    const results = calculateHealthMetrics({
      age: parsedAge,
      heightCm: parsedHeight,
      weightKg: parsedWeight,
      sex,
      activityLevel,
    });
    const profile: UserProfile = {
      age: parsedAge,
      heightCm: parsedHeight,
      weightKg: parsedWeight,
      sex,
      activityLevel,
      ...results,
    };

    setErrorMessage('');
    setIsSaving(true);
    try {
      await saveUserProfile(profile);
      onProfileSaved(profile);
    } catch {
      setErrorMessage('Your profile could not be saved. Please try again.');
      setIsSaving(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.eyebrow}>CALFIT</Text>
          <Text style={styles.title}>Let’s calculate your daily target</Text>
          <Text style={styles.subtitle}>
            Enter a few details to estimate your BMI and maintenance calories.
          </Text>

          <Field
            label="Age"
            value={age}
            onChangeText={setAge}
            placeholder="25"
            keyboardType="number-pad"
          />
          <Field
            label="Height (cm)"
            value={heightCm}
            onChangeText={setHeightCm}
            placeholder="175"
            keyboardType="decimal-pad"
          />
          <Field
            label="Weight (kg)"
            value={weightKg}
            onChangeText={setWeightKg}
            placeholder="70"
            keyboardType="decimal-pad"
          />

          <Text style={styles.label}>Sex used for the calorie estimate</Text>
          <View style={styles.choiceRow}>
            <ChoiceButton label="Male" selected={sex === 'male'} onPress={() => setSex('male')} />
            <ChoiceButton
              label="Female"
              selected={sex === 'female'}
              onPress={() => setSex('female')}
            />
          </View>

          <Text style={styles.label}>Activity level</Text>
          <View style={styles.activityList}>
            {ACTIVITY_LEVELS.map((option) => {
              const isSelected = activityLevel === option.value;
              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  onPress={() => setActivityLevel(option.value)}
                  style={[styles.activityButton, isSelected && styles.selectedActivityButton]}
                >
                  <View style={styles.activityText}>
                    <Text style={styles.activityLabel}>{option.label}</Text>
                    <Text style={styles.activityDescription}>{option.description}</Text>
                  </View>
                  <View style={[styles.radio, isSelected && styles.selectedRadio]} />
                </Pressable>
              );
            })}
          </View>

          {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
          <Pressable
            accessibilityRole="button"
            disabled={isSaving}
            onPress={() => void handleContinue()}
            style={({ pressed }) => [
              styles.continueButton,
              pressed && styles.pressedButton,
              isSaving && styles.disabledButton,
            ]}
          >
            <Text style={styles.continueText}>{isSaving ? 'Saving…' : 'Calculate & continue'}</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType: 'number-pad' | 'decimal-pad';
};

function Field({ label, value, onChangeText, placeholder, keyboardType }: FieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        style={styles.input}
      />
    </View>
  );
}

type ChoiceButtonProps = { label: string; selected: boolean; onPress: () => void };

function ChoiceButton({ label, selected, onPress }: ChoiceButtonProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={[styles.choiceButton, selected && styles.selectedChoiceButton]}
    >
      <Text style={[styles.choiceText, selected && styles.selectedChoiceText]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  keyboardView: { flex: 1 },
  content: { padding: 24, paddingBottom: 40 },
  eyebrow: { color: '#2563eb', fontSize: 13, fontWeight: '800', letterSpacing: 2 },
  title: { marginTop: 10, color: '#0f172a', fontSize: 30, fontWeight: '800', lineHeight: 36 },
  subtitle: { marginTop: 10, marginBottom: 28, color: '#64748b', fontSize: 16, lineHeight: 24 },
  field: { marginBottom: 18 },
  label: { marginBottom: 8, color: '#334155', fontSize: 14, fontWeight: '700' },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    color: '#0f172a',
    fontSize: 17,
  },
  choiceRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
  choiceButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  selectedChoiceButton: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  choiceText: { color: '#475569', fontSize: 16, fontWeight: '700' },
  selectedChoiceText: { color: '#1d4ed8' },
  activityList: { gap: 10 },
  activityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  selectedActivityButton: { borderColor: '#2563eb', backgroundColor: '#eff6ff' },
  activityText: { flex: 1 },
  activityLabel: { color: '#0f172a', fontSize: 15, fontWeight: '700' },
  activityDescription: { marginTop: 3, color: '#64748b', fontSize: 13 },
  radio: { width: 18, height: 18, borderWidth: 2, borderColor: '#94a3b8', borderRadius: 9 },
  selectedRadio: { borderWidth: 5, borderColor: '#2563eb' },
  error: { marginTop: 18, color: '#b91c1c', fontSize: 14, lineHeight: 20 },
  continueButton: {
    alignItems: 'center',
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: '#2563eb',
  },
  pressedButton: { opacity: 0.85 },
  disabledButton: { opacity: 0.6 },
  continueText: { color: '#fff', fontSize: 16, fontWeight: '800' },
});
