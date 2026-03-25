#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { normalizeWikimediaCredit } from './lib/normalizeWikimediaCredit.mjs';

const IMAGE_CREDITS_PATH = resolve('src/data/imageCredits.json');
const COUNTRY_DATA_PATH = resolve('src/data/countryData.json');
const COMMONS_API_URL = 'https://commons.wikimedia.org/w/api.php';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) {
      throw new Error(`Argumento inválido: ${token}. Use o formato --chave valor.`);
    }

    const [rawKey, inlineValue] = token.split('=');
    const key = rawKey.slice(2);

    if (!key) {
      throw new Error('Argumento inválido: chave vazia.');
    }

    if (inlineValue !== undefined) {
      parsed[key] = inlineValue;
      continue;
    }

    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      throw new Error(`Valor ausente para --${key}.`);
    }

    parsed[key] = next;
    index += 1;
  }

  return parsed;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeFileTitle(fileTitle) {
  const trimmed = fileTitle.trim().replaceAll('_', ' ');
  if (trimmed.toLowerCase().startsWith('file:')) {
    return `File:${trimmed.slice(5).trim()}`;
  }

  return `File:${trimmed}`;
}

function extractFileTitleFromSourceUrl(sourcePageUrl) {
  try {
    const parsedUrl = new URL(sourcePageUrl);
    if (parsedUrl.hostname !== 'commons.wikimedia.org') {
      return '';
    }

    const match = parsedUrl.pathname.match(/\/wiki\/(File:[^/]+)/i);
    if (!match) {
      return '';
    }

    return decodeURIComponent(match[1]);
  } catch {
    return '';
  }
}

function buildSourcePageUrl(fileTitle) {
  return `https://commons.wikimedia.org/wiki/${encodeURIComponent(fileTitle).replace('%3A', ':')}`;
}

async function fetchWikimediaImageInfo(fileTitle) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    formatversion: '2',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata',
    titles: fileTitle,
    origin: '*',
  });

  const response = await fetch(`${COMMONS_API_URL}?${params.toString()}`, {
    headers: {
      'User-Agent': 'QuizAfricaCodexBot/1.0 (https://github.com/citesj/quiz-africa-codex; citesj@edu.pmsj.sc.gov.br)'
    }
  });

  if (!response.ok) {
    throw new Error(`Falha ao consultar Wikimedia Commons (HTTP ${response.status}).`);
  }

  const payload = await response.json();
  const page = payload?.query?.pages?.[0];
  const imageinfo = page?.imageinfo?.[0];

  if (!imageinfo?.url) {
    throw new Error(`Arquivo não encontrado ou sem dados de imagem para "${fileTitle}".`);
  }

  return imageinfo;
}

async function readImageCredits() {
  const raw = await readFile(IMAGE_CREDITS_PATH, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('src/data/imageCredits.json deve conter um array.');
  }

  return parsed;
}

async function readCountryData() {
  const raw = await readFile(COUNTRY_DATA_PATH, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('src/data/countryData.json deve conter um array.');
  }

  return parsed;
}

const COUNTRY_FIELD_BY_CREDIT_FIELD = {
  imageUrl: 'image',
  flagImageUrl: 'flagImage',
  capitalImageUrl: 'capitalImage',
  languageImageUrl: 'languageImage',
  typicalDishImageUrl: 'typicalDishImage',
  famousAnimalImageUrl: 'famousAnimalImage',
  landmarkImageUrl: 'landmarkImage',
};

function getCountryImageUrl(countryData, countryId, field) {
  const country = countryData.find((entry) => entry?.id === countryId);
  if (!country || typeof country !== 'object') {
    return '';
  }

  const countryField = COUNTRY_FIELD_BY_CREDIT_FIELD[field] ?? field;
  const value = country[countryField];

  if (isNonEmptyString(value)) {
    return value;
  }

  if (value && typeof value === 'object' && isNonEmptyString(value.src)) {
    return value.src;
  }

  return '';
}

async function upsertCredits(normalizedCredits) {
  const credits = await readImageCredits();
  const updates = [];

  for (const normalizedCredit of normalizedCredits) {
    const existingIndex = credits.findIndex(
      (credit) =>
        credit?.countryId === normalizedCredit.countryId && credit?.field === normalizedCredit.field,
    );

    if (existingIndex >= 0) {
      credits[existingIndex] = normalizedCredit;
      updates.push({ action: 'atualizado', credit: normalizedCredit });
      continue;
    }

    credits.push(normalizedCredit);
    updates.push({ action: 'criado', credit: normalizedCredit });
  }

  await writeFile(IMAGE_CREDITS_PATH, `${JSON.stringify(credits, null, 2)}\n`, 'utf8');
  return updates;
}

async function buildNormalizedCredit({
  countryId,
  field,
  sourcePageUrl,
  fileTitle,
  imageUrl,
}) {
  const imageinfo = await fetchWikimediaImageInfo(fileTitle);
  const normalizedCredit = normalizeWikimediaCredit({
    countryId,
    field,
    imageUrl: isNonEmptyString(imageUrl) ? imageUrl : imageinfo.url,
    sourcePageUrl,
    extmetadata: imageinfo.extmetadata,
  });

  return normalizedCredit;
}

async function runSingleMode(args) {
  const countryId = args.countryId?.trim();
  const field = args.field?.trim();
  const sourcePageUrlArg = args.sourcePageUrl?.trim();
  const fileTitleArg = args.fileTitle?.trim();
  const imageUrlArg = args.imageUrl?.trim();

  await upsertImageCredit({ 
    countryId, 
    field, 
    sourcePageUrl: sourcePageUrlArg, 
    fileTitle: fileTitleArg, 
    imageUrl: imageUrlArg 
  });
} 

export async function upsertImageCredit({ countryId, field, sourcePageUrl, fileTitle, imageUrl }) {
  if (!isNonEmptyString(countryId)) {
    throw new Error('Parâmetro obrigatório ausente: --countryId');
  }

  if (!isNonEmptyString(field)) {
    throw new Error('Parâmetro obrigatório ausente: --field');
  }

  if (!isNonEmptyString(sourcePageUrl) && !isNonEmptyString(fileTitle)) {
    throw new Error('Informe --sourcePageUrl ou --fileTitle.');
  }

  const rawFileTitle = isNonEmptyString(fileTitle)
    ? fileTitle
    : extractFileTitleFromSourceUrl(sourcePageUrl);

  if (!isNonEmptyString(rawFileTitle)) {
    throw new Error('Não foi possível determinar o título do arquivo. Use --fileTitle explicitamente.');
  }

  const finalFileTitle = normalizeFileTitle(rawFileTitle);
  const finalSourcePageUrl = isNonEmptyString(sourcePageUrl)
    ? sourcePageUrl
    : buildSourcePageUrl(finalFileTitle);

  const normalizedCredit = await buildNormalizedCredit({
    countryId,
    field,
    sourcePageUrl: finalSourcePageUrl,
    fileTitle: finalFileTitle,
    imageUrl: imageUrl,
  });

  const updates = await upsertCredits([normalizedCredit]);
  for (const update of updates) {
    console.log(`✅ Crédito ${update.action} para ${update.credit.countryId}/${update.credit.field}`);
    console.log(`   title: ${update.credit.title}`);
    console.log(`   author: ${update.credit.author}`);
    console.log(`   sourcePageUrl: ${update.credit.sourcePageUrl}`);
  }
}

async function runBatchMode(inputPath) {
  const rawInput = await readFile(resolve(inputPath), 'utf8');
  const parsedInput = JSON.parse(rawInput);

  const countryId = parsedInput?.countryId?.trim();
  const items = parsedInput?.items;

  if (!isNonEmptyString(countryId)) {
    throw new Error('Arquivo de entrada inválido: "countryId" é obrigatório.');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Arquivo de entrada inválido: "items" deve ser um array não vazio.');
  }

  const countryData = await readCountryData();
  const normalizedCredits = [];

  for (const [index, item] of items.entries()) {
    const field = item?.field?.trim();
    const sourcePageUrl = item?.sourcePageUrl?.trim();
    if (!isNonEmptyString(field)) {
      throw new Error(`Arquivo de entrada inválido: items[${index}].field é obrigatório.`);
    }

    if (!isNonEmptyString(sourcePageUrl)) {
      throw new Error(`Arquivo de entrada inválido: items[${index}].sourcePageUrl é obrigatório.`);
    }

    const rawFileTitle = extractFileTitleFromSourceUrl(sourcePageUrl);
    if (!isNonEmptyString(rawFileTitle)) {
      throw new Error(
        `Não foi possível extrair o título do arquivo em items[${index}] a partir de ${sourcePageUrl}.`,
      );
    }

    const fileTitle = normalizeFileTitle(rawFileTitle);
    const countryImageUrl = getCountryImageUrl(countryData, countryId, field);

    if (index > 0) await sleep(1000);

    normalizedCredits.push(
      await buildNormalizedCredit({
        countryId,
        field,
        sourcePageUrl,
        fileTitle,
        imageUrl: countryImageUrl,
      }),
    );
  }

  const updates = await upsertCredits(normalizedCredits);
  console.log(`✅ Processamento em lote concluído para ${countryId}: ${updates.length} crédito(s).`);

  for (const update of updates) {
    console.log(`   • ${update.credit.field}: ${update.action}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (isNonEmptyString(args.input)) {
    await runBatchMode(args.input);
    return;
  }

  await runSingleMode(args);
}

const isEntrypoint = import.meta.url === new URL(process.argv[1], 'file:').href;
if (isEntrypoint) {
  main().catch((error) => {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  });
}
