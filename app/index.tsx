import AsyncStorage from '@react-native-async-storage/async-storage';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isOnboarding, setIsOnboarding] = useState(true);
  useEffect(() => {
    const checkOnboarding = async () => {
      const isOnboarding = await AsyncStorage.getItem('onboarding');
      if (isOnboarding) {
        setIsOnboarding(false);
      }
    };
    checkOnboarding();
  }, []);

  return (
    <Redirect href={isOnboarding ? '/(onboarding)' : '/(onboarding)/home'} />
  );
}
