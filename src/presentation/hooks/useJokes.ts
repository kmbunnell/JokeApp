import { useCallback, useEffect, useRef, useState } from 'react';
import type { Joke } from '../../core/entities/Joke';
import { JokeSession, type SessionError } from '../../core/usecases/JokeSession';
import { useJokeRepository } from '../context/JokeRepositoryContext';

export type JokesState =
  | { status: 'loading' }
  | { status: 'loaded'; joke: Joke }
  | { status: 'error'; error: SessionError };

export function useJokes(): { state: JokesState; loadNext: () => void } {
  const repository = useJokeRepository();
  const sessionRef = useRef<JokeSession | null>(null);
  const sessionErrorRef = useRef<SessionError | null>(null);

  if (sessionRef.current === null && sessionErrorRef.current === null) {
    try {
      sessionRef.current = new JokeSession(repository);
    } catch (e) {
      sessionErrorRef.current = {
        kind: 'repository_error',
        message: e instanceof Error ? e.message : 'Failed to load jokes',
      };
    }
  }

  const [state, setState] = useState<JokesState>({ status: 'loading' });

  // sessionRef and sessionErrorRef are stable refs; setState is stable — empty deps is correct.
  const loadNext = useCallback(() => {
    const session = sessionRef.current;
    if (!session) {
      if (sessionErrorRef.current) {
        setState({ status: 'error', error: sessionErrorRef.current });
      }
      return;
    }
    const result = session.getNextJoke();
    if (result.ok) {
      setState({ status: 'loaded', joke: result.value });
    } else {
      setState({ status: 'error', error: result.error });
    }
  }, []);

  useEffect(() => {
    if (sessionErrorRef.current) {
      setState({ status: 'error', error: sessionErrorRef.current });
    } else {
      loadNext();
    }
  }, [loadNext]);

  return { state, loadNext };
}
