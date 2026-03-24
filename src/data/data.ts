import countryData from './countryData.json';
import type { Country, ImageAsset } from '../types';

const REQUIRED_FIELDS: Array<keyof Country> = [
  'id',
  'name',
  'flagImage',
  'capital',
  'region',
  'language',
  'currency',
  'landmark',
  'wildlife',
  'funFact',
  'image',
  'hints',
];

const OPTIONAL_STRING_FIELDS: Array<keyof Country> = ['typicalDish', 'famousAnimal'];
const OPTIONAL_IMAGE_FIELDS: Array<keyof Country> = [
  'capitalImage',
  'languageImage',
  'typicalDishImage',
  'famousAnimalImage',
  'landmarkImage',
];

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function assertImageAsset(asset: unknown, countryLabel: string, field: string): asserts asset is ImageAsset {
  if (!asset || typeof asset !== 'object' || Array.isArray(asset)) {
    throw new Error(`[countries] País "${countryLabel}" inválido: campo "${field}" deve ser objeto de imagem.`);
  }

  const record = asset as Record<string, unknown>;

  if (!isNonEmptyString(record.src)) {
    throw new Error(`[countries] País "${countryLabel}" inválido: "${field}.src" deve ser string não vazia.`);
  }

  if (!record.credit || typeof record.credit !== 'object' || Array.isArray(record.credit)) {
    throw new Error(`[countries] País "${countryLabel}" inválido: "${field}.credit" deve ser objeto.`);
  }

  const credit = record.credit as Record<string, unknown>;
  const creditFields = [
    'sourceName',
    'sourceUrl',
    'creatorName',
    'creatorUrl',
    'licenseName',
    'licenseUrl',
  ] as const;

  for (const creditField of creditFields) {
    if (!isNonEmptyString(credit[creditField])) {
      throw new Error(
        `[countries] País "${countryLabel}" inválido: "${field}.credit.${creditField}" deve ser string não vazia.`,
      );
    }
  }
}

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

    if (field === 'image' || field === 'flagImage') {
      assertImageAsset(countryRecord[field], countryLabel, field);
      continue;
    }

    if (typeof countryRecord[field] !== 'string') {
      throw new Error(`[countries] País "${countryLabel}" inválido: campo "${field}" deve ser string.`);
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

  for (const field of OPTIONAL_IMAGE_FIELDS) {
    const value = countryRecord[field];
    if (value !== undefined) {
      assertImageAsset(value, countryLabel, field);
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
