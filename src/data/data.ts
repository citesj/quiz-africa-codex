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
const REQUIRED_IMAGE_ASSET_FIELDS: Array<keyof ImageAsset> = [
  'src',
  'title',
  'author',
  'sourceUrl',
  'license',
  'licenseUrl',
  'modified',
  'attributionText',
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

  for (const field of OPTIONAL_IMAGE_FIELDS) {
    const value = countryRecord[field];
    if (value !== undefined) {
      assertImageAsset(value, countryLabel, field);
    }
  }
}

function assertImageAsset(rawImageAsset: unknown, countryLabel: string, fieldName: string): asserts rawImageAsset is ImageAsset {
  if (!rawImageAsset || typeof rawImageAsset !== 'object' || Array.isArray(rawImageAsset)) {
    throw new Error(
      `[countries] País "${countryLabel}" inválido: campo "${fieldName}" deve ser um objeto de imagem.`,
    );
  }

  const imageAssetRecord = rawImageAsset as Record<string, unknown>;

  for (const field of REQUIRED_IMAGE_ASSET_FIELDS) {
    if (!(field in imageAssetRecord)) {
      throw new Error(
        `[countries] País "${countryLabel}" inválido: metadado obrigatório ausente em "${fieldName}.${field}".`,
      );
    }

    if (field === 'modified') {
      if (typeof imageAssetRecord.modified !== 'boolean') {
        throw new Error(
          `[countries] País "${countryLabel}" inválido: campo "${fieldName}.modified" deve ser boolean.`,
        );
      }
      continue;
    }

    if (typeof imageAssetRecord[field] !== 'string' || imageAssetRecord[field].trim().length === 0) {
      throw new Error(
        `[countries] País "${countryLabel}" inválido: metadado "${fieldName}.${field}" deve ser string não vazia.`,
      );
    }
  }

  const modificationNote = imageAssetRecord.modificationNote;
  if (modificationNote !== undefined && (typeof modificationNote !== 'string' || modificationNote.trim().length === 0)) {
    throw new Error(
      `[countries] País "${countryLabel}" inválido: campo opcional "${fieldName}.modificationNote" deve ser string não vazia quando informado.`,
    );
  }

  if (imageAssetRecord.modified === true && (typeof modificationNote !== 'string' || modificationNote.trim().length === 0)) {
    throw new Error(
      `[countries] País "${countryLabel}" inválido: imagens marcadas como modificadas exigem "${fieldName}.modificationNote".`,
    );
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
