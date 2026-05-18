import { JokeSession } from '../JokeSession';
import { Joke } from '../../entities/Joke';
import type { IJokeRepository } from '../../repositories/IJokeRepository';
import { ok, err } from '../../utils/Result';

const makeJoke = (id: string) =>
  Joke.fromDTO({ id, question: `Q${id}`, punchline: `P${id}` });

const twoJokes = [makeJoke('1'), makeJoke('2')];

const twoJokeRepo: IJokeRepository = {
  getAll: () => ok(twoJokes),
  getById: (id) => {
    const joke = twoJokes.find((j) => j.id === id);
    return joke ? ok(joke) : err({ kind: 'not_found', message: `Not found: ${id}` });
  },
};

const failingRepo: IJokeRepository = {
  getAll: () => err({ kind: 'unavailable', message: 'Source unavailable' }),
  getById: () => err({ kind: 'unavailable', message: 'Source unavailable' }),
};

describe('JokeSession', () => {
  it('returns a joke on first call', () => {
    const session = new JokeSession(twoJokeRepo);
    const result = session.getNextJoke();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeInstanceOf(Joke);
    }
  });

  it('does not repeat jokes across calls', () => {
    const session = new JokeSession(twoJokeRepo);
    const first = session.getNextJoke();
    const second = session.getNextJoke();
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    if (first.ok && second.ok) {
      expect(first.value.id).not.toBe(second.value.id);
    }
  });

  it('returns out_of_jokes when all jokes have been seen', () => {
    const session = new JokeSession(twoJokeRepo);
    session.getNextJoke();
    session.getNextJoke();
    const result = session.getNextJoke();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('out_of_jokes');
    }
  });

  it('reset allows jokes to be seen again', () => {
    const session = new JokeSession(twoJokeRepo);
    session.getNextJoke();
    session.getNextJoke();
    session.reset();
    const result = session.getNextJoke();
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value).toBeInstanceOf(Joke);
    }
  });

  it('maps repository errors to repository_error', () => {
    const session = new JokeSession(failingRepo);
    const result = session.getNextJoke();
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('repository_error');
    }
  });
});
