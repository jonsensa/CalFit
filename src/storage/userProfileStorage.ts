import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ProfileStats, UserProfile } from '../types/userProfile';

const USER_PROFILE_KEY = 'userProfile';

export async function loadUserProfile(): Promise<ProfileStats | null> {
  try {
    const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return storedProfile ? (JSON.parse(storedProfile) as ProfileStats) : null;
  } catch {
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
}
