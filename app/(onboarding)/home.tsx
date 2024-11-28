import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  View,
  useWindowDimensions,
  Text,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { FontAwesome } from '@expo/vector-icons';
import { scale, verticalScale } from 'react-native-size-matters';
import { setAudioModeAsync } from 'expo-av/build/Audio';
import axios from 'axios';

export default function Home() {
  const [text, setText] = useState('');
  const { height, width } = useWindowDimensions();
  const [isRecording, setIsRecording] = useState(false);
  const [loading, isLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const [response, setResponse] = useState(false);

  const getMicrophonePermission = async () => {
    try {
      const { granted } = await Audio.getPermissionsAsync();

      if (!granted) {
        Alert.alert(
          'Permission denied, Please grant permission to access the microphone'
        );
        return false;
      }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const recordingOptions: any = {
    android: {
      extension: '.wav',
      outPutFormat: Audio.AndroidOutputFormat.MPEG_4,
      androidEncoder: Audio.AndroidAudioEncoder.AAC,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.wav',
      audioQuality: Audio.IOSAudioQuality.HIGH,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };

  const startRecording = async () => {
    const hasPermission = await getMicrophonePermission();
    if (!hasPermission) return;
    try {
      await setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
    } catch (error) {
      console.log('Failed to start recording', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };
  const stopRecording = async () => {
    try {
      setIsRecording(false);
      isLoading(true);
      await recording?.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });
      const uri = await recording?.getURI();
      //send it to whisper api
      const transcript = await sendAudioToWhisper(uri);
      setText(transcript);
    } catch (error) {
      console.log('Failed to stop recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const sendAudioToWhisper = async (uri: string) => {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri,
        type: 'audio/wav',
        name: 'recording.wav',
      });
      formData.append('model', 'whisper-1');
      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.text;
    } catch (error) {
      console.log(error);
    }
  };
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
            onPress={startRecording}
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
