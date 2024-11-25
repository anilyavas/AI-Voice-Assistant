import Onboarding1 from '../assets/svgs/onboarding1';
import Onboarding2 from '../assets/svgs/onboarding2';
import Onboarding3 from '../assets/svgs/onboarding3';
import { onBoardingDataType } from './global';

export const onBoardingData: onBoardingDataType[] = [
  {
    id: 1,
    title: 'Welcome to your personal AI Companion',
    subtitle:
      'Discover the future of communication and knowledge through interactive AI conversations.',
    image: <Onboarding1 />,
  },
  {
    id: 2,
    title: 'Ask, Learn, Use',
    subtitle:
      'Engage with AI, ask questions, and unlock insights to help you grow in real-time.',
    image: <Onboarding2 />,
  },
  {
    id: 3,
    title: 'Explore your life',
    subtitle:
      'Tailor the AI experience to fit your unique needs and get personalized responses anytime.',
    image: <Onboarding3 />,
  },
];
