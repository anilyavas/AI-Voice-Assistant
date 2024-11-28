import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, View, useWindowDimensions, Text } from 'react-native';
import { useState } from 'react';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { scale, verticalScale } from 'react-native-size-matters';

export default function Home() {
  const { height, width } = useWindowDimensions();
  const [isRecording, setIsRecording] = useState(false);
  const [loading, isLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const [response, setResponse] = useState(false);
  return (
    <View className='flex-1'>
      <LinearGradient
        colors={['#000000', '#097943', '#ffa200']}
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
        <View style={{ marginTop: verticalScale(-40) }}>
          <Pressable
            style={{
              width: scale(110),
              height: scale(110),
              alignItems: 'center',
              backgroundColor: '#fff',
              justifyContent: 'center',
              borderRadius: scale(100),
            }}
          >
            <FontAwesome name='microphone' size={scale(50)} color={'#2b3356'} />
          </Pressable>
        </View>
        <View
          style={{
            alignItems: 'center',
            position: 'absolute',
            width: scale(350),
            bottom: verticalScale(90),
          }}
        >
          <Text
            style={{
              color: '#fff',
              fontSize: scale(16),
              width: scale(269),
              textAlign: 'center',
              lineHeight: 25,
            }}
          >
            Press the microphone to start recording!
          </Text>
        </View>
        {/* <LottieView
          source={
            isRecording
              ? require('../../assets/lottie/voice.json')
              : require('../../assets/lottie/mic.json')
          }
          style={{ width: '100%', height: '100%' }}
          loop
        />*/}
      </LinearGradient>
    </View>
  );
}
