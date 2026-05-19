import React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { useJokes } from '../useJokes';
import { Joke } from '../../../core/entities/Joke';
import type { IJokeRepository } from '../../../core/repositories/IJokeRepository';
import { ok, err } from '../../../core/utils/Result';
import { JokeRepositoryProvider } from '../../context/JokeRepositoryContext';

// Capture the focus callback so tests can simulate re-focus without a full navigator
let lastFocusCallback: (() => void) | null = null;

jest.mock('@react-navigation/native', () => {
  const ActualReact = require('react');
  const actual = jest.requireActual('@react-navigation/native');
  return {
    ...actual,
    useFocusEffect: (cb: () => void) => {
      lastFocusCallback = cb;
      ActualReact.useEffect(cb, [cb]);
    },
  };
});

const makeJoke = (id: string) =>
  Joke.fromDTO({ id, question: `Q${id}`, punchline: `P${id}` });

const twoJokes = [makeJoke('1'), makeJoke('2')];

const twoJokeRepo: IJokeRepository = {
  getAll: () => ok(twoJokes),
  getById: (id) => {
    const joke = twoJokes.find((j) => j.id === id);
    return joke ? ok(joke) : err({ kind: 'not_found', message: `Not found: ${id}` });
  },
};

const failingRepo: IJokeRepository = {
  getAll: () => err({ kind: 'unavailable', message: 'Source unavailable' }),
  getById: () => err({ kind: 'unavailable', message: 'Source unavailable' }),
};

function makeWrapper(repo: IJokeRepository) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(JokeRepositoryProvider, { repository: repo, children });
  };
}

describe('useJokes', () => {
  beforeEach(() => {
    lastFocusCallback = null;
  });

  it('initial state is loaded with a joke', () => {
    const { result } = renderHook(() => useJokes(), {
      wrapper: makeWrapper(twoJokeRepo),
    });
    expect(result.current.state.status).toBe('loaded');
    if (result.current.state.status === 'loaded') {
      expect(result.current.state.joke).toBeInstanceOf(Joke);
    }
    // Verify loading is triggered via useFocusEffect, not useEffect
    expect(lastFocusCallback).not.toBeNull();
  });

  it('resets to loading and advances to next joke on re-focus', () => {
    const { result } = renderHook(() => useJokes(), {
      wrapper: makeWrapper(twoJokeRepo),
    });
    expect(result.current.state.status).toBe('loaded');
    const firstId =
      result.current.state.status === 'loaded'
        ? result.current.state.joke.id
        : null;

    act(() => {
      // Simulate screen regaining focus (e.g. popping AnswerScreen)
      expect(lastFocusCallback).not.toBeNull();
      lastFocusCallback!();
    });

    // loadNext() is synchronous so the loading→loaded transition is not separately observable,
    // but the session must have advanced to the second joke
    expect(result.current.state.status).toBe('loaded');
    const secondId =
      result.current.state.status === 'loaded'
        ? result.current.state.joke.id
        : null;
    expect(firstId).not.toBeNull();
    expect(secondId).not.toBeNull();
    expect(firstId).not.toBe(secondId);
  });

  it('loadNext advances to a different joke', () => {
    const { result } = renderHook(() => useJokes(), {
      wrapper: makeWrapper(twoJokeRepo),
    });
    expect(result.current.state.status).toBe('loaded');
    const firstId =
      result.current.state.status === 'loaded'
        ? result.current.state.joke.id
        : null;
    act(() => {
      result.current.loadNext();
    });
    expect(result.current.state.status).toBe('loaded');
    const secondId =
      result.current.state.status === 'loaded'
        ? result.current.state.joke.id
        : null;
    expect(firstId).not.toBeNull();
    expect(secondId).not.toBeNull();
    expect(firstId).not.toBe(secondId);
  });

  it('transitions to out_of_jokes error when all jokes exhausted', () => {
    const { result } = renderHook(() => useJokes(), {
      wrapper: makeWrapper(twoJokeRepo),
    });
    act(() => {
      result.current.loadNext();
    });
    act(() => {
      result.current.loadNext();
    });
    expect(result.current.state.status).toBe('error');
    if (result.current.state.status === 'error') {
      expect(result.current.state.error.kind).toBe('out_of_jokes');
    }
  });

  it('transitions to error state on repository failure', () => {
    const { result } = renderHook(() => useJokes(), {
      wrapper: makeWrapper(failingRepo),
    });
    expect(result.current.state.status).toBe('error');
    if (result.current.state.status === 'error') {
      expect(result.current.state.error.kind).toBe('repository_error');
    }
  });
});
