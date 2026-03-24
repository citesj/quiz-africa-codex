export interface ImageAsset {
  src: string;
  title: string;
  author: string;
  sourceUrl: string;
  license: string;
  licenseUrl: string;
  modified: boolean;
  modificationNote?: string;
  attributionText: string;
}

export interface CountryCore {
  id: string;
  name: string;
  capital: string;
  region: string;
  language: string;
  currency: string;
  landmark: string;
  wildlife: string;
  typicalDish?: string;
  famousAnimal?: string;
  capitalImage?: ImageAsset;
  languageImage?: ImageAsset;
  typicalDishImage?: ImageAsset;
  famousAnimalImage?: ImageAsset;
  landmarkImage?: ImageAsset;
  funFact: string;
  image: ImageAsset;
  hints: [string, string, string, string];
}

export interface CountryDiscovery {
  flagImage: ImageAsset;
  typicalDish?: string;
  famousAnimal?: string;
}

export type Country = CountryCore & CountryDiscovery;

export type GamePhase = 'welcome' | 'quiz' | 'discovery' | 'completed';

export interface RoundState {
  roundNumber: number;
  country: Country;
  options: [Country, Country, Country];
  revealedHints: number;
  selectedCountryId: string | null;
  isCorrect: boolean | null;
}

export interface GameState {
  phase: GamePhase;
  rounds: Country[];
  currentRoundIndex: number;
  round: RoundState | null;
  encouragementMessage: string;
}
