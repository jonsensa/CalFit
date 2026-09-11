import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppNavigator } from './src/navigation/AppNavigator';
import { loadUserProfile } from './src/storage/userProfileStorage';
import type { UserProfile } from './src/types/userProfile';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>();

  useEffect(() => {
    void loadUserProfile().then(setUserProfile);
  }, []);

  if (userProfile === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator userProfile={userProfile} onProfileSaved={setUserProfile} />
      <StatusBar style="dark" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },
});
