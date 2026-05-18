import type { Joke } from '../entities/Joke';
import type { IJokeRepository } from '../repositories/IJokeRepository';
import type { RepositoryError } from '../repositories/RepositoryError';
import type { Result } from '../utils/Result';
import { ok, err } from '../utils/Result';

export type SessionError = RepositoryError | { kind: 'out_of_jokes' };

export class JokeSession {
  private seenIds = new Set<string>();

  constructor(private readonly repository: IJokeRepository) {}

  getNextJoke(): Result<Joke, SessionError> {
    const result = this.repository.getAll();
    if (!result.ok) {
      return result;
    }
    const unseen = result.value.filter((j) => !this.seenIds.has(j.id));
    if (unseen.length === 0) {
      return err({ kind: 'out_of_jokes' });
    }
    const joke = unseen[Math.floor(Math.random() * unseen.length)];
    if (!joke) {
      return err({ kind: 'out_of_jokes' });
    }
    this.seenIds.add(joke.id);
    return ok(joke);
  }

  reset(): void {
    this.seenIds.clear();
  }
}
