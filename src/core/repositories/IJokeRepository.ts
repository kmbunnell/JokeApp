import type { Joke } from '../entities/Joke';

export interface IJokeRepository {
  getAll(): Joke[];
  getById(id: string): Joke | undefined;
}
