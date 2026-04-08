export type CountryImageKind =
  | 'flag'
  | 'capital'
  | 'typicalDish'
  | 'famousAnimal'
  | 'nature'
  | 'culture'
  | 'shape'
  | 'landmark';

export interface CountryImages {
  flag?: string;
  capital?: string;
  typicalDish?: string;
  famousAnimal?: string;
  nature?: string;
  culture?: string;
  shape?: string;
  landmark?: string;
}

export interface Country {
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
  funFact: string;
  hints: [string, string, string, string];
  images?: CountryImages;
}

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
