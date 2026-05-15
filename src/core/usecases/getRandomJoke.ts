import type { Joke } from '../entities/Joke';
import type { IJokeRepository } from '../repositories/IJokeRepository';

export function getRandomJoke(repository: IJokeRepository): Joke {
  const jokes = repository.getAll();
  if (jokes.length === 0) {
    throw new Error('No jokes available');
  }
  return jokes[Math.floor(Math.random() * jokes.length)];
}
