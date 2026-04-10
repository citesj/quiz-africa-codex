export type CountryImageKind =
  | 'flag'
  | 'capital'
  | 'language'
  | 'typicalDish'
  | 'famousAnimal'
  | 'culture'
  | 'shape'
  | 'landmark';

export type CountryHintKind =
  | 'famousAnimal'
  | 'language'
  | 'culture'
  | 'typicalDish'
  | 'shape'
  | 'capital';

export interface CountryHints {
  famousAnimal?: string;
  language: string;
  culture: string;
  typicalDish?: string;
  shape: string;
  capital: string;
}

export interface CountryImages {
  flag?: string;
  capital?: string;
  language?: string;
  typicalDish?: string;
  famousAnimal?: string;
  culture?: string;
  shape?: string;
  landmark?: string;
}

export interface Country {
  id: string;
  name: string;
  funFact: string;
  hints: CountryHints;
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
