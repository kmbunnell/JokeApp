import { renderHook, act } from '@testing-library/react-native';
import { useJokes } from '../useJokes';
import { Joke } from '../../../core/entities/Joke';
import type { IJokeRepository } from '../../../core/repositories/IJokeRepository';
import { ok, err } from '../../../core/utils/Result';

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

describe('useJokes', () => {
  it('initial state is loaded with a joke', () => {
    const { result } = renderHook(() => useJokes(twoJokeRepo));
    expect(result.current.state.status).toBe('loaded');
    if (result.current.state.status === 'loaded') {
      expect(result.current.state.joke).toBeInstanceOf(Joke);
    }
  });

  it('loadNext advances to a different joke', () => {
    const { result } = renderHook(() => useJokes(twoJokeRepo));
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
    const { result } = renderHook(() => useJokes(twoJokeRepo));
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
    const { result } = renderHook(() => useJokes(failingRepo));
    expect(result.current.state.status).toBe('error');
    if (result.current.state.status === 'error') {
      expect(result.current.state.error.kind).toBe('unavailable');
    }
  });
});
