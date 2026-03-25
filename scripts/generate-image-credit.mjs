#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { normalizeWikimediaCredit } from './lib/normalizeWikimediaCredit.mjs';

const IMAGE_CREDITS_PATH = resolve('src/data/imageCredits.json');
const COMMONS_API_URL = 'https://commons.wikimedia.org/w/api.php';

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

  const response = await fetch(`${COMMONS_API_URL}?${params.toString()}`);
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

async function writeImageCredits(credits) {
  await writeFile(IMAGE_CREDITS_PATH, `${JSON.stringify(credits, null, 2)}\n`, 'utf8');
}

function resolveFileTitle({ sourcePageUrl, fileTitle }) {
  const rawFileTitle = isNonEmptyString(fileTitle)
    ? fileTitle
    : extractFileTitleFromSourceUrl(sourcePageUrl);

  if (!isNonEmptyString(rawFileTitle)) {
    throw new Error('Não foi possível determinar o título do arquivo. Use --fileTitle explicitamente.');
  }

  return normalizeFileTitle(rawFileTitle);
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

  const normalizedFileTitle = resolveFileTitle({ sourcePageUrl, fileTitle });
  const imageinfo = await fetchWikimediaImageInfo(normalizedFileTitle);
  const normalizedSourcePageUrl = isNonEmptyString(sourcePageUrl)
    ? sourcePageUrl.trim()
    : buildSourcePageUrl(normalizedFileTitle);

  const normalizedCredit = normalizeWikimediaCredit({
    countryId: countryId.trim(),
    field: field.trim(),
    imageUrl: isNonEmptyString(imageUrl) ? imageUrl.trim() : imageinfo.url,
    sourcePageUrl: normalizedSourcePageUrl,
    extmetadata: imageinfo.extmetadata,
  });

  const credits = await readImageCredits();
  const existingIndex = credits.findIndex(
    (credit) => credit?.countryId === normalizedCredit.countryId && credit?.field === normalizedCredit.field,
  );

  let action = 'criado';
  if (existingIndex >= 0) {
    credits[existingIndex] = normalizedCredit;
    action = 'atualizado';
  } else {
    credits.push(normalizedCredit);
  }

  await writeImageCredits(credits);

  return {
    action,
    credit: normalizedCredit,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const result = await upsertImageCredit({
    countryId: args.countryId,
    field: args.field,
    sourcePageUrl: args.sourcePageUrl,
    fileTitle: args.fileTitle,
    imageUrl: args.imageUrl,
  });

  console.log(`✅ Crédito ${result.action} para ${result.credit.countryId}/${result.credit.field}`);
  console.log(`   title: ${result.credit.title}`);
  console.log(`   author: ${result.credit.author}`);
  console.log(`   sourcePageUrl: ${result.credit.sourcePageUrl}`);
}

const isEntrypoint = import.meta.url === new URL(process.argv[1], 'file:').href;
if (isEntrypoint) {
  main().catch((error) => {
    console.error(`❌ ${error.message}`);
    process.exit(1);
  });
}
