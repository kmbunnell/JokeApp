import type { Joke } from '../entities/Joke';
import type { IJokeRepository } from '../repositories/IJokeRepository';
import type { RepositoryError } from '../repositories/RepositoryError';
import type { Result } from '../utils/Result';
import { ok, err } from '../utils/Result';

export function getRandomJoke(repository: IJokeRepository): Result<Joke, RepositoryError> {
  const result = repository.getAll();
  if (!result.ok) {
    return result;
  }
  const { value: jokes } = result;
  if (jokes.length === 0) {
    return err({ kind: 'unavailable', message: 'No jokes available' });
  }
  const joke = jokes[Math.floor(Math.random() * jokes.length)];
  if (!joke) {
    return err({ kind: 'unavailable', message: 'No jokes available' });
  }
  return ok(joke);
}
