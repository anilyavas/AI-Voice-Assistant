import { LinearGradient } from 'expo-linear-gradient';
import {
  Pressable,
  View,
  useWindowDimensions,
  Text,
  Alert,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';
import LottieView from 'lottie-react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { setAudioModeAsync } from 'expo-av/build/Audio';
import axios from 'axios';
import * as Speech from 'expo-speech';

export default function Home() {
  const [text, setText] = useState('');
  const { height, width } = useWindowDimensions();
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording>();
  const [AIResponse, setAIResponse] = useState(false);
  const [AISpeaking, setAISpeaking] = useState(false);
  const lottieRef = useRef<LottieView>(null);

  const getMicrophonePermission = async () => {
    try {
      const { granted } = await Audio.requestPermissionsAsync();

      if (!granted) {
        Alert.alert(
          'Permission',
          'Please grant permission to access microphone'
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
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      setIsRecording(true);
      const { recording } = await Audio.Recording.createAsync(recordingOptions);
      setRecording(recording);
    } catch (error) {
      console.log('Failed to start Recording', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setLoading(true);
      await recording?.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
      });

      const uri = recording?.getURI();

      const transcript = await sendAudioToWhisper(uri!);

      setText(transcript);

      await sendToGpt(transcript);
    } catch (error) {
      console.log('Failed to stop Recording', error);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const sendAudioToWhisper = async (uri: string) => {
    try {
      const formData: any = new FormData();
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

  const sendToGpt = async (text: string) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content:
                'You are an AI Assistant, a friendly AI assistant who responds naturally and refers to yourself as Assistant when asked for your name. You are a hepful assistant who can answer questions and help with tasks.',
            },
            {
              role: 'user',
              content: text,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setText(response.data.choices[0].message.content);
      setLoading(false);
      setAIResponse(true);
      await speechToText(response.data.choices[0].message.content);
      return response.data.choices[0].message.content;
    } catch (error) {
      console.log('Error sending text to GPT-4', error);
    }
  };

  const speechToText = async (text: string) => {
    setAISpeaking(true);
    const options = {
      voice: 'com.apple.ttsbundle.Samantha-compact',
      labguage: 'en-US',
      pitch: 1.5,
      rate: 1,
      onDone: () => setAISpeaking(false),
    };
    Speech.speak(text, options);
  };

  useEffect(() => {
    if (AISpeaking) {
      lottieRef.current?.play();
    } else {
      lottieRef.current?.reset();
    }
  }, [AISpeaking]);

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
          {loading ? (
            <Pressable onPress={() => speechToText(text)}>
              <LottieView
                source={require('../../assets/lottie/loading.json')}
                style={{ width: scale(250), height: scale(250) }}
                autoPlay
                loop
                speed={1.3}
              />
            </Pressable>
          ) : (
            <>
              {!isRecording ? (
                <Pressable
                  onPress={startRecording}
                  style={{
                    width: scale(110),
                    height: scale(110),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: scale(100),
                  }}
                >
                  <LottieView
                    source={require('../../assets/lottie/mic.json')}
                    style={{ width: scale(250), height: scale(250) }}
                    loop
                    speed={1.3}
                  />
                </Pressable>
              ) : (
                <Pressable
                  onPress={stopRecording}
                  style={{
                    width: scale(110),
                    height: scale(110),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: scale(100),
                  }}
                >
                  <LottieView
                    source={require('../../assets/lottie/voice.json')}
                    style={{ width: scale(250), height: scale(250) }}
                    loop
                    speed={1.3}
                  />
                </Pressable>
              )}
            </>
          )}
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
            {loading
              ? '...'
              : text || 'Press the microphone to start recording!'}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}
