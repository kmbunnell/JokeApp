import { LocalJokeRepository } from '../LocalJokeRepository';
import { Joke } from '../../../core/entities/Joke';

describe('LocalJokeRepository', () => {
  let repo: LocalJokeRepository;

  beforeEach(() => {
    repo = new LocalJokeRepository();
  });

  describe('getAll', () => {
    it('returns ok with all 6 jokes', () => {
      const result = repo.getAll();
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toHaveLength(6);
      }
    });

    it('all loaded jokes are Joke instances', () => {
      const result = repo.getAll();
      expect(result.ok).toBe(true);
      if (result.ok) {
        result.value.forEach((j) => expect(j).toBeInstanceOf(Joke));
      }
    });
  });

  describe('getById', () => {
    it('returns ok with the correct joke for a known id', () => {
      const result = repo.getById('1');
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBeInstanceOf(Joke);
        expect(result.value.question).toBe('Why do ducks have tail feathers?');
      }
    });

    it('returns err with kind not_found for an unknown id', () => {
      const result = repo.getById('999');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.kind).toBe('not_found');
      }
    });
  });
});
