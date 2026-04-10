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
      expect(country.capital).toBeTypeOf('string');
      expect(country.region).toBeTypeOf('string');
      expect(country.language).toBeTypeOf('string');
      expect(country.currency).toBeTypeOf('string');
      expect(country.landmark).toBeTypeOf('string');
      expect(country.wildlife).toBeTypeOf('string');
      expect(country.funFact).toBeTypeOf('string');
      expect(country.hints).toHaveLength(4);
      country.hints.forEach((hint) => {
        expect(hint).toBeTypeOf('string');
      });

      if (country.typicalDish !== undefined) {
        expect(country.typicalDish).toBeTypeOf('string');
      }

      if (country.famousAnimal !== undefined) {
        expect(country.famousAnimal).toBeTypeOf('string');
      }
    });
  });
});
