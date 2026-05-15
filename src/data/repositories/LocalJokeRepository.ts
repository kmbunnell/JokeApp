import { Joke } from '../../core/entities/Joke';
import type { IJokeRepository } from '../../core/repositories/IJokeRepository';
import type { RepositoryError } from '../../core/repositories/RepositoryError';
import type { Result } from '../../core/utils/Result';
import { ok, err } from '../../core/utils/Result';
import { JokeDTOArraySchema } from '../models/JokeDTO';
import jokeData from '../datasources/jokes.json';

export class LocalJokeRepository implements IJokeRepository {
  private readonly jokes: Joke[];

  constructor() {
    const dtos = JokeDTOArraySchema.parse(jokeData);
    this.jokes = dtos.map(Joke.fromDTO);
  }

  getAll(): Result<Joke[], RepositoryError> {
    return ok(this.jokes);
  }

  getById(id: string): Result<Joke, RepositoryError> {
    const joke = this.jokes.find((j) => j.id === id);
    if (!joke) {
      return err({ kind: 'not_found', message: `Joke with id '${id}' not found` });
    }
    return ok(joke);
  }
}
