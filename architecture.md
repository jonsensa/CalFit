# Architecture

CalFit is an Expo React Native app with strict TypeScript and a two-state onboarding flow.

- `index.ts` registers the root component with Expo.
- `App.tsx` restores the saved profile before rendering the navigator.
- `src/navigation/AppNavigator.tsx` shows Onboarding when no profile exists and Home when one does.
- `src/screens/OnboardingScreen.tsx` validates profile inputs, calculates results, and saves them.
- `src/screens/HomeScreen.tsx` displays the saved BMI and maintenance calories.
- `src/types/userProfile.ts` owns the profile type, activity multipliers, and calculations.
- `src/storage/userProfileStorage.ts` reads and writes one JSON object under `userProfile`.
- React Navigation uses `react-native-screens` and `react-native-safe-area-context`.
- ESLint checks code with Expo's configuration; Prettier handles formatting.

There is no backend, authentication, food logging, or calorie tracking yet.
