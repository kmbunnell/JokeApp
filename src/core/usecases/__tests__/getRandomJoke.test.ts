import { getRandomJoke } from '../getRandomJoke';
import { Joke } from '../../entities/Joke';
import type { IJokeRepository } from '../../repositories/IJokeRepository';

const makeJoke = (id: string) =>
  Joke.fromDTO({ id, question: `Q${id}`, punchline: `P${id}` });

const jokes = [makeJoke('1'), makeJoke('2'), makeJoke('3')];

const mockRepo: IJokeRepository = {
  getAll: () => jokes,
  getById: (id) => jokes.find((j) => j.id === id),
};

const emptyRepo: IJokeRepository = {
  getAll: () => [],
  getById: () => undefined,
};

describe('getRandomJoke', () => {
  it('returns a Joke instance', () => {
    expect(getRandomJoke(mockRepo)).toBeInstanceOf(Joke);
  });

  it('returns a joke that is a member of the list', () => {
    const result = getRandomJoke(mockRepo);
    expect(jokes).toContain(result);
  });

  it('throws when the repository is empty', () => {
    expect(() => getRandomJoke(emptyRepo)).toThrow();
  });
});
