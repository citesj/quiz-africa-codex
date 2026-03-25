#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { buildImageCreditAttributionText } from './lib/normalizeWikimediaCredit.mjs';

const COUNTRY_DATA_PATH = resolve('src/data/countryData.json');
const IMAGE_CREDITS_PATH = resolve('src/data/imageCredits.json');

const IMAGE_FIELDS = [
  'flagImageUrl',
  'imageUrl',
  'capitalImageUrl',
  'languageImageUrl',
  'typicalDishImageUrl',
  'famousAnimalImageUrl',
  'landmarkImageUrl',
];

const REQUIRED_CREDIT_FIELDS = [
  'countryId',
  'field',
  'imageUrl',
  'author',
  'title',
  'license',
  'sourcePageUrl',
  'originalFileUrl',
  'lastModified',
  'attributionText',
];

const COUNTRY_FIELD_BY_CREDIT_FIELD = {
  imageUrl: 'image',
  flagImageUrl: 'flagImage',
  capitalImageUrl: 'capitalImage',
  languageImageUrl: 'languageImage',
  typicalDishImageUrl: 'typicalDishImage',
  famousAnimalImageUrl: 'famousAnimalImage',
  landmarkImageUrl: 'landmarkImage',
};

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function resolveCountryImageUrl(country, creditField) {
  const countryField = COUNTRY_FIELD_BY_CREDIT_FIELD[creditField] ?? creditField;
  const value = country[countryField];

  if (isNonEmptyString(value)) {
    return value;
  }

  if (value && typeof value === 'object' && isNonEmptyString(value.src)) {
    return value.src;
  }

  return '';
}

function fail(messages) {
  for (const message of messages) {
    console.error(`❌ ${message}`);
  }
  process.exit(1);
}

const countries = readJson(COUNTRY_DATA_PATH);
const credits = readJson(IMAGE_CREDITS_PATH);
const errors = [];

if (!Array.isArray(countries)) {
  fail([`Arquivo inválido: ${COUNTRY_DATA_PATH} não contém um array.`]);
}

if (!Array.isArray(credits)) {
  fail([`Arquivo inválido: ${IMAGE_CREDITS_PATH} não contém um array.`]);
}

const expectedKeys = new Map();
for (const country of countries) {
  if (!country || typeof country !== 'object') {
    errors.push('countryData.json possui entrada inválida (não é objeto).');
    continue;
  }

  for (const field of IMAGE_FIELDS) {
    const imageUrl = resolveCountryImageUrl(country, field);
    if (!isNonEmptyString(imageUrl)) {
      continue;
    }

    const key = `${country.id}:${field}`;
    expectedKeys.set(key, imageUrl);
  }
}

const seenCreditKeys = new Set();
for (const [index, credit] of credits.entries()) {
  if (!credit || typeof credit !== 'object') {
    errors.push(`imageCredits.json[${index}] deve ser um objeto.`);
    continue;
  }

  for (const field of REQUIRED_CREDIT_FIELDS) {
    if (!isNonEmptyString(credit[field])) {
      errors.push(`imageCredits.json[${index}].${field} é obrigatório e deve ser string não vazia.`);
    }
  }

  if (!IMAGE_FIELDS.includes(credit.field)) {
    errors.push(`imageCredits.json[${index}].field inválido: "${credit.field}".`);
    continue;
  }

  const key = `${credit.countryId}:${credit.field}`;
  if (seenCreditKeys.has(key)) {
    errors.push(`Crédito duplicado para ${key}.`);
    continue;
  }
  seenCreditKeys.add(key);

  const expectedUrl = expectedKeys.get(key);
  if (!expectedUrl) {
    errors.push(`Crédito sem correspondência em countryData.json: ${key}.`);
    continue;
  }

  if (expectedUrl !== credit.imageUrl) {
    errors.push(
      `URL divergente em ${key}. Esperado: ${expectedUrl}; encontrado: ${credit.imageUrl}.`,
    );
  }

  const expectedAttributionText = buildImageCreditAttributionText(credit);
  if (credit.attributionText !== expectedAttributionText) {
    errors.push(
      `attributionText inválido para ${key}. Use: "${expectedAttributionText}".`,
    );
  }
}

for (const [key, imageUrl] of expectedKeys.entries()) {
  if (!seenCreditKeys.has(key)) {
    errors.push(`Imagem sem crédito: ${key} (${imageUrl}).`);
  }
}

if (errors.length > 0) {
  fail(errors);
}

console.log(
  `✅ Validação concluída: ${expectedKeys.size} imagens em countryData.json e ${credits.length} créditos registrados.`,
);
