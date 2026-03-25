#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { parseArgs, upsertImageCredit } from './generate-image-credit.mjs';

const VALIDATE_SCRIPT_PATH = resolve('scripts/validate-image-credits.mjs');

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeInputItem(item, index) {
  if (!item || typeof item !== 'object') {
    throw new Error(`Item ${index} inválido: deve ser um objeto.`);
  }

  const countryId = item.countryId?.trim();
  const field = item.field?.trim();
  const sourcePageUrl = item.sourcePageUrl?.trim();

  if (!isNonEmptyString(countryId) || !isNonEmptyString(field) || !isNonEmptyString(sourcePageUrl)) {
    throw new Error(
      `Item ${index} inválido: campos obrigatórios { countryId, field, sourcePageUrl } devem ser strings não vazias (sourcePageUrl aceita Commons ou Wikipedia).`,
    );
  }

  return { countryId, field, sourcePageUrl };
}

function keyFromItem(item) {
  return `${item.countryId}:${item.field}`;
}

async function readBatchInput(inputPath) {
  const raw = await readFile(inputPath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    throw new Error('Arquivo de entrada deve conter um array de itens.');
  }

  return parsed.map((item, index) => normalizeInputItem(item, index));
}

function runValidation() {
  return new Promise((resolvePromise) => {
    const child = spawn(process.execPath, [VALIDATE_SCRIPT_PATH], { stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    child.on('close', (code) => {
      resolvePromise({ code: code ?? 1, stdout, stderr });
    });
  });
}

function groupValidationErrorsByItem(validationOutput, items) {
  const grouped = new Map(items.map((item) => [keyFromItem(item), []]));
  const globalErrors = [];

  const lines = validationOutput
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  for (const line of lines) {
    const message = line.replace(/^❌\s*/, '');
    const matchedKey = [...grouped.keys()].find((key) => message.includes(key));

    if (matchedKey) {
      grouped.get(matchedKey).push(message);
      continue;
    }

    globalErrors.push(message);
  }

  return { grouped, globalErrors };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const input = args.input?.trim();

  if (!isNonEmptyString(input)) {
    throw new Error('Parâmetro obrigatório ausente: --input');
  }

  const inputPath = resolve(input);
  const items = await readBatchInput(inputPath);

  if (items.length === 0) {
    throw new Error('Arquivo de entrada está vazio.');
  }

  const processingErrors = [];

  for (const item of items) {
    try {
      const result = await upsertImageCredit(item);
      console.log(`✅ ${keyFromItem(item)} (${result.action})`);
    } catch (error) {
      processingErrors.push({ key: keyFromItem(item), message: error.message });
      console.error(`❌ ${keyFromItem(item)}: ${error.message}`);
    }
  }

  const validation = await runValidation();

  if (validation.code === 0) {
    console.log(validation.stdout.trim());
  } else {
    const { grouped, globalErrors } = groupValidationErrorsByItem(validation.stderr, items);
    console.error('❌ Falhas de validação após processamento em lote:');

    for (const [key, errors] of grouped.entries()) {
      if (errors.length === 0) {
        continue;
      }

      console.error(`\n• ${key}`);
      for (const message of errors) {
        console.error(`  - ${message}`);
      }
    }

    if (globalErrors.length > 0) {
      console.error('\n• geral');
      for (const message of globalErrors) {
        console.error(`  - ${message}`);
      }
    }
  }

  if (processingErrors.length > 0 || validation.code !== 0) {
    process.exit(1);
  }

  console.log(`✅ Processamento em lote concluído com ${items.length} item(ns).`);
}

main().catch((error) => {
  console.error(`❌ ${error.message}`);
  process.exit(1);
});
