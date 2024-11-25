import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { onBoardingDataType } from '../../constants/global';
import { onBoardingData } from '../../constants/constants';
import { useRef, useState } from 'react';

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { height, width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffSetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(
      contentOffSetX / event.nativeEvent.layoutMeasurement.width
    );
    setActiveIndex(currentIndex);
  };

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
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
      >
        {onBoardingData.map((item: onBoardingDataType, index: number) => (
          <View
            key={index}
            style={{
              width: width,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {item.image}
            <View className='p-3 gap-8'>
              <Text className='text-white text-center font-extrabold text-3xl'>
                {item.title}
              </Text>
              <Text className='text-gray-300  text-2xl text-center'>
                {item.subtitle}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
