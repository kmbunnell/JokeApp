import { Joke } from '../../core/entities/Joke';
import type { IJokeRepository } from '../../core/repositories/IJokeRepository';
import { JokeDTOArraySchema } from '../models/JokeDTO';
import jokeData from '../datasources/jokes.json';

export class LocalJokeRepository implements IJokeRepository {
  private readonly jokes: Joke[];

  constructor() {
    const dtos = JokeDTOArraySchema.parse(jokeData);
    this.jokes = dtos.map(Joke.fromDTO);
  }

  getAll(): Joke[] {
    return this.jokes;
  }

  getById(id: string): Joke | undefined {
    return this.jokes.find((j) => j.id === id);
  }
}
