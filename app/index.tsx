import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isOnboarding, setIsOnboarding] = useState(true);
  useEffect(() => {}, []);

  return <Redirect href={'/(onboarding)'} />;
}
