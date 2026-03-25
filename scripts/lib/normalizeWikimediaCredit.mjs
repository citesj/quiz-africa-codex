const FALLBACKS = {
  title: 'Título não informado',
  author: 'Autor desconhecido',
  license: 'Licença não informada',
  licenseUrl: 'https://commons.wikimedia.org/wiki/Commons:Licensing',
  sourcePageUrl: 'https://commons.wikimedia.org/',
};

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function stripHtml(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function getExtmetadataValue(extmetadata, key) {
  const value = extmetadata?.[key]?.value;
  if (!isNonEmptyString(value)) {
    return '';
  }

  return stripHtml(value);
}

function firstNonEmpty(...values) {
  for (const value of values) {
    if (isNonEmptyString(value)) {
      return value.trim();
    }
  }

  return '';
}

function parseIsoDate(value) {
  if (!isNonEmptyString(value)) {
    return '';
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    const match = value.match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : '';
  }

  return parsed.toISOString().slice(0, 10);
}

export function buildImageCreditAttributionText(credit) {
  return `${credit.title} — ${credit.author}. Licença: ${credit.license}. Fonte: ${credit.sourcePageUrl}`;
}

export function normalizeWikimediaCredit({
  countryId,
  field,
  imageUrl,
  sourcePageUrl,
  extmetadata,
}) {
  const title = firstNonEmpty(
    getExtmetadataValue(extmetadata, 'ObjectName'),
    getExtmetadataValue(extmetadata, 'ImageDescription'),
    FALLBACKS.title,
  );

  const author = firstNonEmpty(
    getExtmetadataValue(extmetadata, 'Artist'),
    getExtmetadataValue(extmetadata, 'Credit'),
    FALLBACKS.author,
  );

  const license = firstNonEmpty(
    getExtmetadataValue(extmetadata, 'LicenseShortName'),
    FALLBACKS.license,
  );

  const normalizedSourcePageUrl = firstNonEmpty(sourcePageUrl, FALLBACKS.sourcePageUrl);
  const normalizedImageUrl = firstNonEmpty(imageUrl, normalizedSourcePageUrl);
  const licenseUrl = firstNonEmpty(
    getExtmetadataValue(extmetadata, 'LicenseUrl'),
    FALLBACKS.licenseUrl,
  );

  const lastModified = firstNonEmpty(
    parseIsoDate(getExtmetadataValue(extmetadata, 'DateTimeOriginal')),
    parseIsoDate(getExtmetadataValue(extmetadata, 'DateTime')),
    new Date().toISOString().slice(0, 10),
  );

  const normalizedCredit = {
    countryId,
    field,
    imageUrl: normalizedImageUrl,
    author,
    title,
    license,
    licenseUrl,
    sourcePageUrl: normalizedSourcePageUrl,
    originalFileUrl: normalizedImageUrl,
    lastModified,
  };

  return {
    ...normalizedCredit,
    attributionText: buildImageCreditAttributionText(normalizedCredit),
  };
}
