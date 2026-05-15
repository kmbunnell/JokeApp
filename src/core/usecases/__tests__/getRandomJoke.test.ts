import { getRandomJoke } from '../getRandomJoke';
import { Joke } from '../../entities/Joke';
import type { IJokeRepository } from '../../repositories/IJokeRepository';
import { ok, err } from '../../utils/Result';

const makeJoke = (id: string) =>
  Joke.fromDTO({ id, question: `Q${id}`, punchline: `P${id}` });

const jokes = [makeJoke('1'), makeJoke('2'), makeJoke('3')];

const mockRepo: IJokeRepository = {
  getAll: () => ok(jokes),
  getById: (id) => {
    const joke = jokes.find((j) => j.id === id);
    return joke ? ok(joke) : err({ kind: 'not_found', message: `Joke ${id} not found` });
  },
};

const emptyRepo: IJokeRepository = {
  getAll: () => ok([]),
  getById: () => err({ kind: 'not_found', message: 'Not found' }),
};

const failingRepo: IJokeRepository = {
  getAll: () => err({ kind: 'unavailable', message: 'Data source unavailable' }),
  getById: () => err({ kind: 'unavailable', message: 'Data source unavailable' }),
};

describe('getRandomJoke', () => {
  it('returns ok with a Joke instance', () => {
    const result = getRandomJoke(mockRepo);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeInstanceOf(Joke);
    }
  });

  it('returns ok with a joke that is a member of the list', () => {
    const result = getRandomJoke(mockRepo);
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(jokes).toContain(result.value);
    }
  });

  it('returns err with kind unavailable when repository is empty', () => {
    const result = getRandomJoke(emptyRepo);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('unavailable');
      expect(result.error.message).toBe('No jokes available');
    }
  });

  it('propagates repository errors', () => {
    const result = getRandomJoke(failingRepo);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('unavailable');
    }
  });
});
