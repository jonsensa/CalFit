# Architecture

CalFit is an Expo React Native app with strict TypeScript and a two-state onboarding flow.

- `index.ts` registers the root component with Expo.
- `App.tsx` restores the saved profile before rendering the navigator.
- `src/navigation/AppNavigator.tsx` shows Home for a profile with a goal and target; otherwise it shows Onboarding.
- `src/screens/OnboardingScreen.tsx` validates stats, then asks for a goal before saving. Back to stats preserves inputs. Existing profiles without a goal start at goal selection.
- `src/screens/HomeScreen.tsx` displays the saved goal, daily target, ±100-calorie range, BMI, and maintenance calories.
- `src/types/userProfile.ts` owns the profile types, activity multipliers, goals, and calculations. `UserProfile` extends `ProfileStats` with `goal`, `dailyTarget`, and `bufferRange: { min, max }`.
- `src/storage/userProfileStorage.ts` reads and writes one JSON object under `userProfile`.
- React Navigation uses `react-native-screens` and `react-native-safe-area-context`.
- ESLint checks code with Expo's configuration; Prettier handles formatting.

There is no backend, authentication, food logging, or calorie tracking yet.
