import { describe, expect, it } from 'vitest';
import { countries } from '../data/data';
import type { Country, CountryImageKind } from '../types';
import { getCountryImageSrc } from './countryImages';

const ALL_IMAGE_KINDS: CountryImageKind[] = [
  'flag',
  'capital',
  'language',
  'typicalDish',
  'famousAnimal',
  'culture',
  'shape',
  'landmark',
];

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

  it('prioriza override para todos os tipos de imagem', () => {
    ALL_IMAGE_KINDS.forEach((kind) => {
      const country = createCountryFixture({
        images: {
          [kind]: `/images/countries/pais-teste/pais-teste-${kind}.png`,
        },
      });

      const imageSrc = getCountryImageSrc(country, kind);

      expect(imageSrc).toBe(`/images/countries/pais-teste/pais-teste-${kind}.png`);
    });
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

    ALL_IMAGE_KINDS.forEach((kind) => {
      const imageSrc = getCountryImageSrc(unknownCountry, kind);
      expect(imageSrc).toBeUndefined();
    });
  });

  it('resolve imagem de language por convencao de arquivo', () => {
    const morocco = countries.find((country) => country.id === 'marrocos');
    if (!morocco) {
      throw new Error('Pais marrocos nao encontrado na base de dados.');
    }

    const imageSrc = getCountryImageSrc({ ...morocco, images: undefined }, 'language');

    expect(imageSrc).toBeDefined();
  });
});
