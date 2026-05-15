import { LocalJokeRepository } from '../LocalJokeRepository';
import { Joke } from '../../../core/entities/Joke';

describe('LocalJokeRepository', () => {
  const repo = new LocalJokeRepository();

  it('loads all 6 jokes', () => {
    expect(repo.getAll()).toHaveLength(6);
  });

  it('all loaded jokes are Joke instances', () => {
    repo.getAll().forEach((j) => expect(j).toBeInstanceOf(Joke));
  });

  it('getById returns the correct joke', () => {
    const joke = repo.getById('1');
    expect(joke).toBeInstanceOf(Joke);
    expect(joke?.question).toBe('Why do ducks have tail feathers?');
  });

  it('getById returns undefined for an unknown id', () => {
    expect(repo.getById('999')).toBeUndefined();
  });
});
