export const ACTIVITY_LEVELS = [
  {
    value: 'sedentary',
    label: 'Sedentary',
    description: 'Little or no exercise',
    multiplier: 1.2,
  },
  {
    value: 'light',
    label: 'Lightly active',
    description: 'Exercise 1–3 days per week',
    multiplier: 1.375,
  },
  {
    value: 'moderate',
    label: 'Moderately active',
    description: 'Exercise 3–5 days per week',
    multiplier: 1.55,
  },
  {
    value: 'veryActive',
    label: 'Very active',
    description: 'Exercise 6–7 days per week',
    multiplier: 1.725,
  },
] as const;

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number]['value'];
export type Sex = 'male' | 'female';

export type UserProfile = {
  age: number;
  heightCm: number;
  weightKg: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  bmi: number;
  maintenanceCalories: number;
};

type HealthMetricInputs = Pick<
  UserProfile,
  'age' | 'heightCm' | 'weightKg' | 'sex' | 'activityLevel'
>;

export function calculateHealthMetrics({
  age,
  heightCm,
  weightKg,
  sex,
  activityLevel,
}: HealthMetricInputs): Pick<UserProfile, 'bmi' | 'maintenanceCalories'> {
  const heightMetres = heightCm / 100;
  const bmi = weightKg / heightMetres ** 2;
  const sexAdjustment = sex === 'male' ? 5 : -161;
  const basalMetabolicRate = 10 * weightKg + 6.25 * heightCm - 5 * age + sexAdjustment;
  const activityMultiplier = ACTIVITY_LEVELS.find(
    (level) => level.value === activityLevel,
  )!.multiplier;

  return {
    bmi: Math.round(bmi * 10) / 10,
    maintenanceCalories: Math.round(basalMetabolicRate * activityMultiplier),
  };
}
