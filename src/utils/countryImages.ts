import type { Country, CountryImageKind } from '../types';

const imageModules = import.meta.glob('../public/images/countries/*/*.{jpg,JPG,jpeg,png,svg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

const SUFFIX_BY_KIND: Record<CountryImageKind, string> = {
  flag: 'flag',
  capital: 'capital',
  currency: 'currency',
  language: 'language',
  typicalDish: 'dish',
  famousAnimal: 'animal',
  landmark: 'landmark',
};

const kindBySuffix = new Map<string, CountryImageKind>(
  (Object.entries(SUFFIX_BY_KIND) as Array<[CountryImageKind, string]>).map(([kind, suffix]) => [suffix, kind]),
);

const imagesByCountry = new Map<string, Partial<Record<CountryImageKind, string>>>();

Object.entries(imageModules).forEach(([modulePath, imageUrl]) => {
  const match = modulePath.match(/countries\/([^/]+)\/[^/]+-([a-z]+)\.[^/.]+$/i);
  const countryId = match?.[1];
  const suffix = match?.[2]?.toLowerCase();

  if (!countryId || !suffix) {
    return;
  }

  const kind = kindBySuffix.get(suffix);
  if (!kind) {
    return;
  }

  const existing = imagesByCountry.get(countryId) ?? {};
  existing[kind] = imageUrl;
  imagesByCountry.set(countryId, existing);
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
