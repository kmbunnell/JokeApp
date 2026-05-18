import { useEffect, useRef, useState } from 'react';
import type { IJokeRepository } from '../../core/repositories/IJokeRepository';
import type { Joke } from '../../core/entities/Joke';
import { JokeSession, type SessionError } from '../../core/usecases/JokeSession';
import { LocalJokeRepository } from '../../data/repositories/LocalJokeRepository';

export type JokesState =
  | { status: 'loading' }
  | { status: 'loaded'; joke: Joke }
  | { status: 'error'; error: SessionError };

export function useJokes(repository?: IJokeRepository): {
  state: JokesState;
  loadNext: () => void;
} {
  const sessionRef = useRef<JokeSession | null>(null);
  const sessionErrorRef = useRef<SessionError | null>(null);

  if (sessionRef.current === null && sessionErrorRef.current === null) {
    try {
      sessionRef.current = new JokeSession(
        repository ?? new LocalJokeRepository(),
      );
    } catch (e) {
      sessionErrorRef.current = {
        kind: 'repository_error',
        message: e instanceof Error ? e.message : 'Failed to load jokes',
      };
    }
  }

  const [state, setState] = useState<JokesState>({ status: 'loading' });

  const loadNext = () => {
    const session = sessionRef.current;
    if (!session) {
      // TODO: handle missing session (constructor failure path)
      return;
    }
    const result = session.getNextJoke();
    if (result.ok) {
      setState({ status: 'loaded', joke: result.value });
    } else if (result.error.kind === 'out_of_jokes') {
      // TODO: address OUT_OF_JOKES state (e.g. offer reset)
      setState({ status: 'error', error: result.error });
    } else {
      // TODO: implement proper error UI for repository failures
      setState({ status: 'error', error: result.error });
    }
  };

  useEffect(() => {
    if (sessionErrorRef.current) {
      setState({ status: 'error', error: sessionErrorRef.current });
    } else {
      loadNext();
    }
    // sessionErrorRef and setState are stable — safe with empty deps
  }, []);

  return { state, loadNext };
}
