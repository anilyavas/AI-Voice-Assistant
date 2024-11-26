import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import {
  View,
  Text,
  useWindowDimensions,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from 'react-native';
import { onBoardingDataType } from '../../constants/global';
import { onBoardingData } from '../../constants/constants';
import { useRef, useState } from 'react';
import { scale, verticalScale } from 'react-native-size-matters';
import { router, useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { height, width } = useWindowDimensions();
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffSetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(
      contentOffSetX / event.nativeEvent.layoutMeasurement.width
    );
    if (currentIndex !== activeIndex) {
      setActiveIndex(currentIndex);
    }
  };

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
      >
        <StatusBar style='light' />
        <Pressable
          style={{
            position: 'absolute',
            top: verticalScale(50),
            right: scale(20),
            zIndex: 10,
          }}
          onPress={() => console.log('Pressed skip')}
        >
          <Text className='text-white text-lg font-bold'>Skip</Text>
        </Pressable>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          ref={scrollViewRef}
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
        <View
          style={{
            bottom: verticalScale(70),
            position: 'absolute',
            gap: scale(8),
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
          }}
        >
          {onBoardingData.map((_, index) => (
            <View
              key={index}
              style={[
                {
                  width: scale(8),
                  height: scale(8),
                  borderRadius: 1000,
                  backgroundColor: '#fff',
                  marginHorizontal: scale(2),
                },
                { opacity: activeIndex === index ? 1 : 0.3 },
              ]}
            />
          ))}
        </View>
      </LinearGradient>
    </View>
  );
}
