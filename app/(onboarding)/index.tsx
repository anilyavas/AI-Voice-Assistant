import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { View, Text, useWindowDimensions } from 'react-native';

export default function OnboardingScreen() {
  const { height } = useWindowDimensions();
  return (
    <View>
      <LinearGradient
        colors={['#250252', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ top: 0, left: 0, right: 0, height: height }}
      >
        <Text>Hello screen 1</Text>
        <StatusBar style='light' />
      </LinearGradient>
    </View>
  );
}
