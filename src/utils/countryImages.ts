import type { Country, CountryImageKind } from '../types';

const imageModules = import.meta.glob('../public/images/countries/*/*.{jpg,JPG,jpeg,png,svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const SUFFIX_BY_KIND: Record<CountryImageKind, string> = {
  flag: 'flag',
  typicalDish: 'dish',
  famousAnimal: 'animal',
  nature: 'nature',
  culture: 'culture',
  shape: 'shape',
  landmark: 'landmark',
};

const kindBySuffix = new Map<string, CountryImageKind>(
  (Object.entries(SUFFIX_BY_KIND) as Array<[CountryImageKind, string]>).map(([kind, suffix]) => [suffix, kind]),
);

const EXTENSION_PRIORITY: Record<string, number> = {
  webp: 4,
  svg: 3,
  png: 2,
  jpg: 1,
  jpeg: 1,
};

const imagesByCountry = new Map<string, Partial<Record<CountryImageKind, string>>>();
const priorityByCountryAndKind = new Map<string, number>();

Object.entries(imageModules).forEach(([modulePath, imageUrl]) => {
  const match = modulePath.match(/countries\/([^/]+)\/[^/]+-([a-z]+)\.([^.]+)$/i);
  const countryId = match?.[1];
  const suffix = match?.[2]?.toLowerCase();
  const extension = match?.[3]?.toLowerCase();

  if (!countryId || !suffix || !extension) {
    return;
  }

  const kind = kindBySuffix.get(suffix);
  if (!kind) {
    return;
  }

  const nextPriority = EXTENSION_PRIORITY[extension] ?? 0;
  const priorityKey = `${countryId}:${kind}`;
  const existingPriority = priorityByCountryAndKind.get(priorityKey) ?? -1;

  if (nextPriority < existingPriority) {
    return;
  }

  const existing = imagesByCountry.get(countryId) ?? {};
  existing[kind] = imageUrl;
  imagesByCountry.set(countryId, existing);
  priorityByCountryAndKind.set(priorityKey, nextPriority);
});

function getImageByConvention(countryId: string, kind: CountryImageKind): string | undefined {
  return imagesByCountry.get(countryId)?.[kind];
}

export function getCountryImageSrc(country: Country, kind: CountryImageKind): string | undefined {
  const override = country.images?.[kind];
  if (override && override.trim().length > 0) {
    return override;
  }

  return getImageByConvention(country.id, kind);
}
