import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import JokeScreen from '../JokeScreen';
import { Joke } from '../../../../core/entities/Joke';
import type { IJokeRepository } from '../../../../core/repositories/IJokeRepository';
import { ok, err } from '../../../../core/utils/Result';
import { JokeRepositoryProvider } from '../../../context/JokeRepositoryContext';

const makeJoke = (id: string) =>
  Joke.fromDTO({ id, question: `Why is ${id} funny?`, punchline: `P${id}` });

function makeRepo(jokes: Joke[]): IJokeRepository {
  return {
    getAll: () => ok(jokes),
    getById: (id) => {
      const joke = jokes.find((j) => j.id === id);
      return joke
        ? ok(joke)
        : err({ kind: 'not_found', message: `Not found: ${id}` });
    },
  };
}

const failingRepo: IJokeRepository = {
  getAll: () => err({ kind: 'unavailable', message: 'Source unavailable' }),
  getById: () => err({ kind: 'unavailable', message: 'Source unavailable' }),
};

function renderScreen(repo: IJokeRepository) {
  return render(
    <JokeRepositoryProvider repository={repo}>
      <NavigationContainer>
        <JokeScreen />
      </NavigationContainer>
    </JokeRepositoryProvider>,
  );
}

describe('JokeScreen', () => {
  it('renders the joke question when loaded', () => {
    renderScreen(makeRepo([makeJoke('1')]));
    expect(screen.getByText('Why is 1 funny?')).toBeTruthy();
  });

  it('pressing "Let\'s hear another!" cycles through jokes', () => {
    renderScreen(makeRepo([makeJoke('1')]));
    fireEvent.press(screen.getByText("Let's hear another!"));
    expect(screen.getByText("You've heard them all!")).toBeTruthy();
  });

  it('renders out-of-jokes placeholder when joke list is empty', () => {
    renderScreen(makeRepo([]));
    expect(screen.getByText("You've heard them all!")).toBeTruthy();
  });

  it('"IDK, Tell me!" is disabled when not in loaded state', () => {
    renderScreen(makeRepo([]));
    const button = screen.getByTestId('idk-button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it('renders error placeholder on repository failure', () => {
    renderScreen(failingRepo);
    expect(screen.getByText('Something went wrong loading a joke.')).toBeTruthy();
  });
});
