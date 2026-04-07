#!/usr/bin/env node
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const IMAGES_ROOT = path.resolve('src/public/images/countries');
const MAX_WIDTH = 800;
const WEBP_QUALITY = 80;
const SUPPORTED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

const isDryRun = process.argv.includes('--dry-run');

async function* walkFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      yield* walkFiles(fullPath);
      continue;
    }

    if (entry.isFile()) {
      yield fullPath;
    }
  }
}

function toWebpPath(filePath) {
  const { dir, name } = path.parse(filePath);
  return path.join(dir, `${name}.webp`);
}

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    return { skipped: true };
  }

  const outputPath = toWebpPath(filePath);

  if (!isDryRun) {
    await sharp(filePath)
      .rotate()
      .resize({
        width: MAX_WIDTH,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toFile(outputPath);

    await unlink(filePath);
  }

  return {
    skipped: false,
    input: filePath,
    output: outputPath,
  };
}

async function main() {
  const rootStats = await stat(IMAGES_ROOT).catch(() => null);
  if (!rootStats?.isDirectory()) {
    throw new Error(`Pasta de imagens não encontrada: ${IMAGES_ROOT}`);
  }

  let optimized = 0;
  let skipped = 0;

  for await (const filePath of walkFiles(IMAGES_ROOT)) {
    const result = await optimizeImage(filePath);

    if (result.skipped) {
      skipped += 1;
      continue;
    }

    optimized += 1;
    const relativeInput = path.relative(process.cwd(), result.input);
    const relativeOutput = path.relative(process.cwd(), result.output);
    console.log(`${isDryRun ? '[dry-run] ' : ''}${relativeInput} -> ${relativeOutput}`);
  }

  console.log(
    `Concluído. ${isDryRun ? 'Prévia gerada' : 'Imagens convertidas'}: ${optimized}. Arquivos ignorados: ${skipped}.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
