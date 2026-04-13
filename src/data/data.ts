import type { Country, CountryHintKind, CountryImageKind } from '../types';
import countryData from './countryData.json';

const REQUIRED_FIELDS: Array<keyof Country> = [
  'id',
  'name',
  'funFact',
  'hints',
];

const REQUIRED_HINT_FIELDS: Exclude<CountryHintKind, 'famousAnimal' | 'typicalDish'>[] = [
  'language',
  'culture',
  'shape',
  'capital',
];
const OPTIONAL_HINT_FIELDS: Extract<CountryHintKind, 'famousAnimal' | 'typicalDish'>[] = [
  'famousAnimal',
  'typicalDish',
];
const IMAGE_FIELDS: CountryImageKind[] = [
  'flag',
  'capital',
  'language',
  'typicalDish',
  'famousAnimal',
  'culture',
  'shape',
];

function getCountryLabel(rawCountry: unknown, index: number): string {
  if (rawCountry && typeof rawCountry === 'object' && 'id' in rawCountry && typeof rawCountry.id === 'string') {
    return rawCountry.id;
  }

  return `index ${index}`;
}

function assertCountry(rawCountry: unknown, index: number): asserts rawCountry is Country {
  const countryLabel = getCountryLabel(rawCountry, index);

  if (!rawCountry || typeof rawCountry !== 'object' || Array.isArray(rawCountry)) {
    throw new Error(`[countries] Country inválido em ${countryLabel}: esperado objeto.`);
  }

  const countryRecord = rawCountry as Record<string, unknown>;

  for (const field of REQUIRED_FIELDS) {
    if (!(field in countryRecord)) {
      throw new Error(`[countries] País "${countryLabel}" inválido: campo obrigatório ausente "${field}".`);
    }

    if (field === 'hints') {
      const hints = countryRecord.hints;
      if (!hints || typeof hints !== 'object' || Array.isArray(hints)) {
        throw new Error(`[countries] País "${countryLabel}" inválido: campo "hints" deve ser objeto.`);
      }

      const hintsRecord = hints as Record<string, unknown>;

      for (const hintField of REQUIRED_HINT_FIELDS) {
        const hintValue = hintsRecord[hintField];
        if (typeof hintValue !== 'string') {
          throw new Error(
            `[countries] País "${countryLabel}" inválido: campo obrigatório "hints.${hintField}" deve ser string.`,
          );
        }
      }

      for (const hintField of OPTIONAL_HINT_FIELDS) {
        const hintValue = hintsRecord[hintField];
        if (hintValue !== undefined && typeof hintValue !== 'string') {
          throw new Error(
            `[countries] País "${countryLabel}" inválido: campo opcional "hints.${hintField}" deve ser string quando informado.`,
          );
        }
      }
      continue;
    }

    if (typeof countryRecord[field] !== 'string') {
      throw new Error(`[countries] País "${countryLabel}" inválido: campo "${field}" deve ser string.`);
    }
  }

  const images = countryRecord.images;
  if (images !== undefined) {
    if (!images || typeof images !== 'object' || Array.isArray(images)) {
      throw new Error(`[countries] País "${countryLabel}" inválido: campo opcional "images" deve ser objeto.`);
    }

    const imageRecord = images as Record<string, unknown>;
    for (const imageField of IMAGE_FIELDS) {
      const value = imageRecord[imageField];
      if (value !== undefined && typeof value !== 'string') {
        throw new Error(
          `[countries] País "${countryLabel}" inválido: campo opcional "images.${imageField}" deve ser string quando informado.`,
        );
      }
    }
  }
}

function validateCountries(data: unknown): Country[] {
  if (!Array.isArray(data)) {
    throw new Error('[countries] Dados inválidos: esperado um array de países.');
  }

  data.forEach((country, index) => {
    assertCountry(country, index);
  });

  return data;
}

export const countries = validateCountries(countryData);
