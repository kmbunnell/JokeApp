import React from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Routes } from '../../navigation/types';
import type { RootStackParamList } from '../../navigation/types';
import { useAnswer } from '../../hooks/useAnswer';
import { screenStyles } from '../../styles/screenStyles';
import { strings } from './strings';
import hedgehogImage from '../../../assets/images/hedgehog.png';

type AnswerRoute = RouteProp<RootStackParamList, typeof Routes.Answer>;

interface AnswerContentProps {
  jokeId: string;
}

function AnswerContent({ jokeId }: AnswerContentProps) {
  const state = useAnswer(jokeId);
  const { width } = useWindowDimensions();
  const imageWidth = width * 0.65;

  if (state.status === 'loading') {
    return (
      <ActivityIndicator
        testID="loading-indicator"
        size="large"
        color={screenStyles.loadingIndicator.color}
      />
    );
  }
  if (state.status === 'error') {
    const message =
      state.error.kind === 'not_found' ? strings.notFound : strings.loadError;
    return <Text style={screenStyles.bodyText}>{message}</Text>;
  }
  return (
    <>
      <Text style={screenStyles.bodyText}>{state.joke.punchline}</Text>
      <Image
        source={hedgehogImage}
        style={[imageStyles.hedgehog, { width: imageWidth, height: imageWidth }]}
        resizeMode="contain"
      />
    </>
  );
}

const imageStyles = StyleSheet.create({
  hedgehog: {
    alignSelf: 'center',
    marginTop: 24,
  },
});

export default function AnswerScreen() {
  const route = useRoute<AnswerRoute>();
  const { jokeId } = route.params;

  return (
    <SafeAreaView style={screenStyles.container}>
      <ScrollView
        style={screenStyles.scrollView}
        contentContainerStyle={screenStyles.scrollContent}>
        <AnswerContent jokeId={jokeId} />
      </ScrollView>
    </SafeAreaView>
  );
}
