import { useCallback, useEffect, useState } from 'react';
import type { Joke } from '../../core/entities/Joke';
import { JokeSession, type SessionError } from '../../core/usecases/JokeSession';
import { useJokeRepository } from '../context/JokeRepositoryContext';

export type JokesState =
  | { status: 'loading' }
  | { status: 'loaded'; joke: Joke }
  | { status: 'error'; error: SessionError };

type SessionInit =
  | { ok: true; session: JokeSession }
  | { ok: false; error: SessionError };

export function useJokes(): { state: JokesState; loadNext: () => void } {
  const repository = useJokeRepository();

  const [sessionInit] = useState<SessionInit>(() => {
    try {
      return { ok: true, session: new JokeSession(repository) };
    } catch (e) {
      return {
        ok: false,
        error: {
          kind: 'repository_error',
          message: e instanceof Error ? e.message : 'Failed to load jokes',
        },
      };
    }
  });

  const [state, setState] = useState<JokesState>({ status: 'loading' });

  const loadNext = useCallback(() => {
    if (!sessionInit.ok) {
      setState({ status: 'error', error: sessionInit.error });
      return;
    }
    const result = sessionInit.session.getNextJoke();
    if (result.ok) {
      setState({ status: 'loaded', joke: result.value });
    } else {
      setState({ status: 'error', error: result.error });
    }
  }, [sessionInit]);

  useEffect(() => {
    loadNext();
  }, [loadNext]);

  return { state, loadNext };
}
