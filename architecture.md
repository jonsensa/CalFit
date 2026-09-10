# Architecture

Iteration 0 is an Expo React Native app with strict TypeScript and no application data.

- `index.ts` registers the root component with Expo.
- `App.tsx` renders the navigator and status bar.
- `src/navigation/AppNavigator.tsx` defines a typed native stack with Onboarding and Home routes.
- `src/screens/` contains the two empty screen components.
- Onboarding opens first. Both screens have a white background and hidden headers.
- React Navigation uses `react-native-screens` and `react-native-safe-area-context`.
- ESLint checks code with Expo's configuration; Prettier handles formatting.

There is no backend, storage, authentication, onboarding form, or calorie tracking yet.
