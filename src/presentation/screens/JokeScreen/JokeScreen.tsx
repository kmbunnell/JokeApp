import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Routes } from '../../navigation/types';
import type { RootStackParamList } from '../../navigation/types';
import { useJokes } from '../../hooks/useJokes';
import type { JokesState } from '../../hooks/useJokes';
import { styles } from './styles';

type Nav = NativeStackNavigationProp<RootStackParamList, typeof Routes.Joke>;

interface JokeContentProps {
  state: JokesState;
}

function JokeContent({ state }: JokeContentProps) {
  if (state.status === 'loading') {
    return (
      <ActivityIndicator
        testID="loading-indicator"
        size="large"
        color={styles.loadingIndicator.color}
      />
    );
  }
  if (state.status === 'error') {
    if (state.error.kind === 'out_of_jokes') {
      // TODO: address OUT_OF_JOKES state (e.g. offer a reset / congratulate the user)
      return <Text style={styles.questionText}>You've heard them all!</Text>;
    }
    // TODO: implement proper error UI for repository failures
    return (
      <Text style={styles.questionText}>
        Something went wrong loading a joke.
      </Text>
    );
  }
  return <Text style={styles.questionText}>{state.joke.question}</Text>;
}

export default function JokeScreen() {
  const navigation = useNavigation<Nav>();
  const { state, loadNext } = useJokes();

  const isLoaded = state.status === 'loaded';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}>
        <JokeContent state={state} />
      </ScrollView>
      <View style={styles.buttonBar}>
        <Pressable
          style={[styles.button, !isLoaded && styles.buttonDisabled]}
          disabled={!isLoaded}
          accessibilityState={{ disabled: !isLoaded }}
          onPress={loadNext}>
          <Text style={styles.buttonText}>Let's hear another!</Text>
        </Pressable>
        <Pressable
          testID="idk-button"
          style={[styles.button, styles.buttonSecondary, !isLoaded && styles.buttonDisabled]}
          disabled={!isLoaded}
          accessibilityState={{ disabled: !isLoaded }}
          onPress={() => {
            if (state.status !== 'loaded') {
              return;
            }
            navigation.navigate(Routes.Answer, {
              jokeId: state.joke.id,
            });
          }}>
          <Text style={styles.buttonText}>IDK, Tell me!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
