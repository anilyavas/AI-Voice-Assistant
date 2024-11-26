import { LinearGradient } from 'expo-linear-gradient';
import { View, useWindowDimensions, Text } from 'react-native';
import { useState } from 'react';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';

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
        <LottieView
          source={
            isRecording
              ? require('../../assets/lottie/voice.json')
              : require('../../assets/lottie/mic.json')
          }
          style={{ width: '100%', height: '100%' }}
          loop
        />
      </LinearGradient>
    </View>
  );
}
