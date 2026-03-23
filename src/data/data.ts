import countryData from './countryData.json';
import type { Country } from '../types';

const REQUIRED_FIELDS: Array<keyof Country> = [
  'id',
  'name',
  'flagImageUrl',
  'capital',
  'region',
  'language',
  'currency',
  'landmark',
  'wildlife',
  'funFact',
  'imageUrl',
  'hints',
];

const OPTIONAL_STRING_FIELDS: Array<keyof Country> = ['typicalDish', 'famousAnimal'];

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
      if (!Array.isArray(hints) || hints.length !== 4 || hints.some((hint) => typeof hint !== 'string')) {
        throw new Error(
          `[countries] País "${countryLabel}" inválido: campo "hints" deve ser uma tupla com 4 strings.`,
        );
      }
      continue;
    }

    if (typeof countryRecord[field] !== 'string') {
      throw new Error(
        `[countries] País "${countryLabel}" inválido: campo "${field}" deve ser string.`,
      );
    }
  }

  for (const field of OPTIONAL_STRING_FIELDS) {
    const value = countryRecord[field];
    if (value !== undefined && typeof value !== 'string') {
      throw new Error(
        `[countries] País "${countryLabel}" inválido: campo opcional "${field}" deve ser string quando informado.`,
      );
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
