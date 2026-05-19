import React from 'react';
import { renderHook } from '@testing-library/react-native';
import { useAnswer } from '../useAnswer';
import { Joke } from '../../../core/entities/Joke';
import type { IJokeRepository } from '../../../core/repositories/IJokeRepository';
import { ok, err } from '../../../core/utils/Result';
import { JokeRepositoryProvider } from '../../context/JokeRepositoryContext';

const joke = Joke.fromDTO({ id: '1', question: 'Q1', punchline: 'P1' });

const loadedRepo: IJokeRepository = {
  getAll: () => ok([joke]),
  getById: (id) =>
    id === '1' ? ok(joke) : err({ kind: 'not_found', message: `Not found: ${id}` }),
};

const notFoundRepo: IJokeRepository = {
  getAll: () => ok([]),
  getById: () => err({ kind: 'not_found', message: 'Not found' }),
};

const unavailableRepo: IJokeRepository = {
  getAll: () => err({ kind: 'unavailable', message: 'Unavailable' }),
  getById: () => err({ kind: 'unavailable', message: 'Unavailable' }),
};

function makeWrapper(repo: IJokeRepository) {
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return React.createElement(JokeRepositoryProvider, { repository: repo, children });
  };
}

describe('useAnswer', () => {
  it('returns loaded state with joke when found', () => {
    const { result } = renderHook(() => useAnswer('1'), {
      wrapper: makeWrapper(loadedRepo),
    });
    expect(result.current.status).toBe('loaded');
    if (result.current.status === 'loaded') {
      expect(result.current.joke).toBeInstanceOf(Joke);
      expect(result.current.joke.punchline).toBe('P1');
    }
  });

  it('returns error state with not_found kind', () => {
    const { result } = renderHook(() => useAnswer('99'), {
      wrapper: makeWrapper(notFoundRepo),
    });
    expect(result.current.status).toBe('error');
    if (result.current.status === 'error') {
      expect(result.current.error.kind).toBe('not_found');
    }
  });

  it('returns error state with unavailable kind', () => {
    const { result } = renderHook(() => useAnswer('1'), {
      wrapper: makeWrapper(unavailableRepo),
    });
    expect(result.current.status).toBe('error');
    if (result.current.status === 'error') {
      expect(result.current.error.kind).toBe('unavailable');
    }
  });
});
