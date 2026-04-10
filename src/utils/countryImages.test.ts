import { describe, expect, it } from 'vitest';
import { countries } from '../data/data';
import type { Country } from '../types';
import { getCountryImageSrc } from './countryImages';

const createCountryFixture = (overrides: Partial<Country> = {}): Country => ({
  id: 'pais-teste',
  name: 'Pais Teste',
  capital: 'Capital Teste',
  language: 'Idioma Teste',
  funFact: 'Curiosidade teste',
  hints: ['h1', 'h2', 'h3', 'h4'],
  ...overrides,
});

describe('getCountryImageSrc', () => {
  it('prioriza override de imagem no objeto do pais', () => {
    const customFlag = '/images/countries/pais-teste/pais-teste-flag.png';
    const country = createCountryFixture({ images: { flag: customFlag } });

    const imageSrc = getCountryImageSrc(country, 'flag');

    expect(imageSrc).toBe(customFlag);
  });

  it('usa mapeamento por convencao quando override e vazio', () => {
    const morocco = countries.find((country) => country.id === 'marrocos');
    if (!morocco) {
      throw new Error('Pais marrocos nao encontrado na base de dados.');
    }

    const conventionalSrc = getCountryImageSrc({ ...morocco, images: undefined }, 'flag');

    const countryWithBlankOverride = {
      ...morocco,
      images: {
        ...morocco.images,
        flag: '   ',
      },
    };

    const imageSrc = getCountryImageSrc(countryWithBlankOverride, 'flag');

    expect(conventionalSrc).toBeDefined();
    expect(imageSrc).toBe(conventionalSrc);
  });

  it('retorna undefined quando nao ha override nem arquivo por convencao', () => {
    const unknownCountry = createCountryFixture({ id: 'pais-sem-imagem' });

    const imageSrc = getCountryImageSrc(unknownCountry, 'flag');

    expect(imageSrc).toBeUndefined();
  });
});
