import { describe, expect, it } from 'vitest';
import { TOTAL_ROUNDS } from '../constants';
import { countries } from './data';

describe('countries data contract', () => {
  it('tem paises suficientes para o numero de rodadas', () => {
    expect(countries.length).toBeGreaterThanOrEqual(TOTAL_ROUNDS);
  });

  it('mantem o shape esperado dos campos essenciais', () => {
    countries.forEach((country) => {
      expect(country.id).toBeTypeOf('string');
      expect(country.name).toBeTypeOf('string');
      expect(country.funFact).toBeTypeOf('string');

      expect(country.hints.language).toBeTypeOf('string');
      expect(country.hints.culture).toBeTypeOf('string');
      expect(country.hints.capital).toBeTypeOf('string');
      expect(country.hints.shape).toBeTypeOf('string');

      if (country.hints.famousAnimal !== undefined) {
        expect(country.hints.famousAnimal).toBeTypeOf('string');
      }

      if (country.hints.typicalDish !== undefined) {
        expect(country.hints.typicalDish).toBeTypeOf('string');
      }

    });
  });
});
