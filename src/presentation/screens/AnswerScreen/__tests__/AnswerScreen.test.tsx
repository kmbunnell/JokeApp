import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AnswerScreen from '../AnswerScreen';
import { strings } from '../strings';
import { Joke } from '../../../../core/entities/Joke';
import type { IJokeRepository } from '../../../../core/repositories/IJokeRepository';
import { ok, err } from '../../../../core/utils/Result';
import { JokeRepositoryProvider } from '../../../context/JokeRepositoryContext';
import type { RootStackParamList } from '../../../navigation/types';
import { Routes } from '../../../navigation/types';

// Note: the 'loading' state in AnswerScreen is not separately tested here because
// useAnswer calls getById synchronously inside useEffect — act() flushes effects before
// any assertion runs, so the loading→loaded/error transition is never observable.
// If getById becomes async, add a test that defers the repository response.

const joke = Joke.fromDTO({
  id: '1',
  question: 'Why did the hedgehog cross the road?',
  punchline: 'Because it had a point to make!',
});

function makeRepo(result: ReturnType<IJokeRepository['getById']>): IJokeRepository {
  return {
    getAll: () => ok([]),
    getById: () => result,
  };
}

function NullScreen() {
  return null;
}

function renderScreen(repo: IJokeRepository) {
  const Stack = createNativeStackNavigator<RootStackParamList>();
  return render(
    <JokeRepositoryProvider repository={repo}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={Routes.Answer}>
          <Stack.Screen
            name={Routes.Answer}
            component={AnswerScreen}
            initialParams={{ jokeId: '1' }}
            options={{ title: strings.navTitle }}
          />
          <Stack.Screen name={Routes.Joke} component={NullScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </JokeRepositoryProvider>,
  );
}

describe('AnswerScreen', () => {
  it('renders navigation title "Tell me another!"', () => {
    renderScreen(makeRepo(ok(joke)));
    // Native stack renders the title as a prop on RNSScreenStackHeaderConfig, not a text node
    expect(screen.UNSAFE_getByProps({ title: strings.navTitle })).toBeTruthy();
  });

  it('renders the punchline when joke is found', () => {
    renderScreen(makeRepo(ok(joke)));
    expect(screen.getByText('Because it had a point to make!')).toBeTruthy();
  });

  it('renders not-found error string when joke is missing', () => {
    renderScreen(makeRepo(err({ kind: 'not_found', message: 'Not found' })));
    expect(screen.getByText('Joke not found.')).toBeTruthy();
  });

  it('renders load-error string on repository failure', () => {
    renderScreen(makeRepo(err({ kind: 'unavailable', message: 'Unavailable' })));
    expect(screen.getByText('Something went wrong loading the answer.')).toBeTruthy();
  });
});
