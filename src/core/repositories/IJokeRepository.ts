import type { Joke } from '../entities/Joke';
import type { RepositoryError } from './RepositoryError';
import type { Result } from '../utils/Result';

export interface IJokeRepository {
  getAll(): Result<Joke[], RepositoryError>;
  getById(id: string): Result<Joke, RepositoryError>;
}
