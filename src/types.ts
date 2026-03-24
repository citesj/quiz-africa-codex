export interface ImageCredit {
  sourceName: string;
  sourceUrl: string;
  creatorName: string;
  creatorUrl: string;
  licenseName: string;
  licenseUrl: string;
}

export interface ImageAsset {
  src: string;
  credit: ImageCredit;
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
