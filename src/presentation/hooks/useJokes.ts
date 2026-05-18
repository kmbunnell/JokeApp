import { useCallback, useEffect, useState } from 'react';
import type { Joke } from '../../core/entities/Joke';
import { JokeSession, type SessionError } from '../../core/usecases/JokeSession';
import { useJokeRepository } from '../context/JokeRepositoryContext';

export type JokesState =
  | { status: 'loading' }
  | { status: 'loaded'; joke: Joke }
  | { status: 'error'; error: SessionError };

export function useJokes(): { state: JokesState; loadNext: () => void } {
  const repository = useJokeRepository();
  const [session] = useState(() => new JokeSession(repository));
  const [state, setState] = useState<JokesState>({ status: 'loading' });

  const loadNext = useCallback(() => {
    const result = session.getNextJoke();
    if (result.ok) {
      setState({ status: 'loaded', joke: result.value });
    } else {
      setState({ status: 'error', error: result.error });
    }
  }, [session]);

  useEffect(() => {
    loadNext();
  }, [loadNext]);

  return { state, loadNext };
}
