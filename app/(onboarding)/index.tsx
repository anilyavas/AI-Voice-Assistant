import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { View, Text, useWindowDimensions } from 'react-native';
import Onboarding1 from '../../assets/svgs/onboarding1';

export default function OnboardingScreen() {
  const { height } = useWindowDimensions();
  return (
    <LinearGradient
      colors={['#250252', '#000000']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        top: 0,
        left: 0,
        right: 0,
        height: height,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}
    >
      <StatusBar style='light' />
      <Onboarding1 />
      <Text></Text>
    </LinearGradient>
  );
}
