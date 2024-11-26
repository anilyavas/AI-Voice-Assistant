import { LinearGradient } from 'expo-linear-gradient';
import { View, useWindowDimensions } from 'react-native';

export default function Home() {
  const { height, width } = useWindowDimensions();
  return (
    <View className='flex-1'>
      <LinearGradient
        colors={['#000000', '#097943', '#00d4ff']}
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
      ></LinearGradient>
    </View>
  );
}
