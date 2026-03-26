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

const imagesByCountry = new Map<string, string[]>();

Object.entries(imageModules).forEach(([modulePath, imageUrl]) => {
  const match = modulePath.match(/countries\/([^/]+)\//);
  const countryId = match?.[1];

  if (!countryId) {
    return;
  }

  const existing = imagesByCountry.get(countryId) ?? [];
  existing.push(imageUrl);
  imagesByCountry.set(countryId, existing);
});

function getImageByConvention(countryId: string, kind: CountryImageKind): string | undefined {
  const images = imagesByCountry.get(countryId);
  if (!images) {
    return undefined;
  }

  const suffix = `-${SUFFIX_BY_KIND[kind]}.`;
  return images.find((imageUrl) => imageUrl.includes(suffix));
}

export function getCountryImageSrc(country: Country, kind: CountryImageKind): string | undefined {
  const override = country.images?.[kind];
  if (override && override.trim().length > 0) {
    return override;
  }

  return getImageByConvention(country.id, kind);
}
