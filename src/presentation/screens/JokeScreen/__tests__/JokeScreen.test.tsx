import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import JokeScreen from '../JokeScreen';
import { useJokes } from '../../../hooks/useJokes';
import { Joke } from '../../../../core/entities/Joke';

jest.mock('../../../hooks/useJokes');
const mockUseJokes = useJokes as jest.MockedFunction<typeof useJokes>;

const makeJoke = (id: string) =>
  Joke.fromDTO({ id, question: `Why is ${id} funny?`, punchline: `P${id}` });

const mockLoadNext = jest.fn();

function renderScreen() {
  return render(
    <NavigationContainer>
      <JokeScreen />
    </NavigationContainer>,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('JokeScreen', () => {
  it('renders the joke question when loaded', () => {
    mockUseJokes.mockReturnValue({
      state: { status: 'loaded', joke: makeJoke('1') },
      loadNext: mockLoadNext,
    });
    renderScreen();
    expect(screen.getByText('Why is 1 funny?')).toBeTruthy();
  });

  it('pressing "Let\'s hear another!" calls loadNext', () => {
    mockUseJokes.mockReturnValue({
      state: { status: 'loaded', joke: makeJoke('1') },
      loadNext: mockLoadNext,
    });
    renderScreen();
    fireEvent.press(screen.getByText("Let's hear another!"));
    expect(mockLoadNext).toHaveBeenCalledTimes(1);
  });

  it('renders out-of-jokes placeholder when exhausted', () => {
    mockUseJokes.mockReturnValue({
      state: { status: 'error', error: { kind: 'out_of_jokes' } },
      loadNext: mockLoadNext,
    });
    renderScreen();
    expect(screen.getByText("You've heard them all!")).toBeTruthy();
  });

  it('"IDK, Tell me!" is disabled when not in loaded state', () => {
    mockUseJokes.mockReturnValue({
      state: { status: 'error', error: { kind: 'out_of_jokes' } },
      loadNext: mockLoadNext,
    });
    renderScreen();
    const button = screen.getByTestId('idk-button');
    expect(button.props.accessibilityState?.disabled).toBe(true);
  });

  it('renders loading indicator when status is loading', () => {
    mockUseJokes.mockReturnValue({
      state: { status: 'loading' },
      loadNext: mockLoadNext,
    });
    renderScreen();
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });
});
