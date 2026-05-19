import { useEffect, useState } from 'react';
import type { Joke } from '../../core/entities/Joke';
import type { RepositoryError } from '../../core/repositories/RepositoryError';
import { useJokeRepository } from '../context/JokeRepositoryContext';

export type AnswerState =
  | { status: 'loading' }
  | { status: 'loaded'; joke: Joke }
  | { status: 'error'; error: RepositoryError };

export function useAnswer(jokeId: string): AnswerState {
  const repository = useJokeRepository();
  const [state, setState] = useState<AnswerState>({ status: 'loading' });

  useEffect(() => {
    const result = repository.getById(jokeId);
    if (result.ok) {
      setState({ status: 'loaded', joke: result.value });
    } else {
      setState({ status: 'error', error: result.error });
    }
  }, [repository, jokeId]);

  return state;
}
