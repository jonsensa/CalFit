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

export const GOALS = [
  {
    value: 'loseWeight',
    label: 'Lose weight',
    adjustment: -500,
    description: 'Maintenance − 500 calories',
  },
  {
    value: 'gainWeight',
    label: 'Gain weight',
    adjustment: 300,
    description: 'Maintenance + 300 calories',
  },
  { value: 'justTrack', label: 'Just track', adjustment: 0, description: 'Same as maintenance' },
] as const;

export type Goal = (typeof GOALS)[number]['value'];

export type ProfileStats = {
  age: number;
  heightCm: number;
  weightKg: number;
  sex: Sex;
  activityLevel: ActivityLevel;
  bmi: number;
  maintenanceCalories: number;
};

export type UserProfile = ProfileStats & {
  goal: Goal;
  dailyTarget: number;
  bufferRange: { min: number; max: number };
};

export function hasGoal(profile: ProfileStats): profile is UserProfile {
  const saved = profile as Partial<UserProfile>;
  return (
    GOALS.some((goal) => goal.value === saved.goal) &&
    Number.isFinite(saved.dailyTarget) &&
    Number.isFinite(saved.bufferRange?.min) &&
    Number.isFinite(saved.bufferRange?.max)
  );
}

export function calculateGoalTarget(
  maintenanceCalories: number,
  goal: Goal,
): Pick<UserProfile, 'goal' | 'dailyTarget' | 'bufferRange'> {
  const dailyTarget =
    maintenanceCalories + GOALS.find((option) => option.value === goal)!.adjustment;
  return { goal, dailyTarget, bufferRange: { min: dailyTarget - 100, max: dailyTarget + 100 } };
}

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
