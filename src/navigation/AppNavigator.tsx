import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { HomeScreen } from '../screens/HomeScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import type { UserProfile } from '../types/userProfile';

export type RootStackParamList = {
  Onboarding: undefined;
  Home: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

type AppNavigatorProps = {
  userProfile: UserProfile | null;
  onProfileSaved: (profile: UserProfile) => void;
};

export function AppNavigator({ userProfile, onProfileSaved }: AppNavigatorProps) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userProfile ? (
          <Stack.Screen name="Home">{() => <HomeScreen userProfile={userProfile} />}</Stack.Screen>
        ) : (
          <Stack.Screen name="Onboarding">
            {() => <OnboardingScreen onProfileSaved={onProfileSaved} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
