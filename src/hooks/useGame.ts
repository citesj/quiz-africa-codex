import { useMemo, useState, useTransition } from 'react';
import { countries } from '../data/data';
import { ENCOURAGEMENT_MESSAGES } from '../messages';
import { OPTIONS_PER_ROUND, TOTAL_HINTS, TOTAL_ROUNDS } from '../constants';
import type { Country, GameState, RoundState } from '../types';

// O motor do jogo fica isolado no hook para manter UI declarativa e simples.
const fisherYatesShuffle = <T,>(items: T[]): T[] => {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = arr[i];
    const target = arr[j];

    if (current === undefined || target === undefined) {
      continue;
    }

    arr[i] = target;
    arr[j] = current;
  }
  return arr;
};

const buildOptions = (correctCountry: Country, pool: Country[]): [Country, Country, Country] => {
  const distractors = fisherYatesShuffle(pool.filter((country) => country.id !== correctCountry.id)).slice(
    0,
    OPTIONS_PER_ROUND - 1,
  );
  return fisherYatesShuffle([correctCountry, ...distractors]) as [Country, Country, Country];
};

interface DiscoveryFeedbackArgs {
  isCorrect: boolean;
  hintsUsed: number;
  selectedCountryName: string;
  correctCountryName: string;
}

const getEncouragementByHints = (hintsUsed: number): string => {
  if (hintsUsed <= 1) return ENCOURAGEMENT_MESSAGES.correctByHints.oneHint;
  if (hintsUsed === 2) return ENCOURAGEMENT_MESSAGES.correctByHints.twoHints;
  if (hintsUsed === 3) return ENCOURAGEMENT_MESSAGES.correctByHints.threeHints;
  return ENCOURAGEMENT_MESSAGES.correctByHints.fourOrMoreHints;
};

const buildDiscoveryFeedbackMessage = ({
  isCorrect,
  hintsUsed,
  selectedCountryName,
  correctCountryName,
}: DiscoveryFeedbackArgs): string => {
  const encouragement = isCorrect ? getEncouragementByHints(hintsUsed) : ENCOURAGEMENT_MESSAGES.incorrect;

  if (isCorrect) {
    return `Era ${correctCountryName}. ${encouragement}`;
  }

  return `Você escolheu ${selectedCountryName}, mas era ${correctCountryName}. ${encouragement}`;
};

const getCountryOrFallback = (candidate: Country | undefined, fallback: Country): Country => candidate ?? fallback;

const getFirstCountry = (pool: Country[]): Country => {
  const firstCountry = pool[0];
  if (!firstCountry) {
    throw new Error('A lista de países está vazia.');
  }
  return firstCountry;
};

// Cada rodada é derivada de dados puros para facilitar testes e manutenção.
const createRoundState = (roundNumber: number, country: Country, allCountries: Country[]): RoundState => ({
  roundNumber,
  country,
  options: buildOptions(country, allCountries),
  revealedHints: 1,
  selectedCountryId: null,
  isCorrect: null,
});

export const useGame = () => {
  const [isPending, startTransition] = useTransition();

  const initialRounds = useMemo(() => fisherYatesShuffle(countries).slice(0, TOTAL_ROUNDS), []);
  const fallbackCountry = getFirstCountry(countries);

  const [gameState, setGameState] = useState<GameState>({
    phase: 'welcome',
    rounds: initialRounds,
    currentRoundIndex: 0,
    round: null,
    encouragementMessage: '',
  });

  const startGame = () => {
    startTransition(() => {
      const roundCountry = getCountryOrFallback(gameState.rounds[0], fallbackCountry);
      setGameState((previous) => ({
        ...previous,
        phase: 'quiz',
        round: createRoundState(1, roundCountry, countries),
        encouragementMessage: '',
      }));
    });
  };

  const revealNextHint = () => {
    setGameState((previous) => {
      if (!previous.round || previous.round.revealedHints >= TOTAL_HINTS || previous.round.selectedCountryId) {
        return previous;
      }
      return {
        ...previous,
        round: {
          ...previous.round,
          revealedHints: previous.round.revealedHints + 1,
        },
      };
    });
  };

  const selectAnswer = (countryId: string) => {
    setGameState((previous) => {
      if (!previous.round || previous.round.selectedCountryId) return previous;
      const isCorrect = countryId === previous.round.country.id;
      const selectedCountryName =
        previous.round.options.find((option) => option.id === countryId)?.name ?? 'uma opção';

      return {
        ...previous,
        round: {
          ...previous.round,
          selectedCountryId: countryId,
          isCorrect,
        },
        encouragementMessage: buildDiscoveryFeedbackMessage({
          isCorrect,
          hintsUsed: previous.round.revealedHints,
          selectedCountryName,
          correctCountryName: previous.round.country.name,
        }),
        phase: 'discovery',
      };
    });
  };

  const goToNextRound = () => {
    setGameState((previous) => {
      const nextRoundIndex = previous.currentRoundIndex + 1;
      if (nextRoundIndex >= previous.rounds.length) {
        return {
          ...previous,
          phase: 'completed',
          currentRoundIndex: nextRoundIndex,
          round: null,
          encouragementMessage: ENCOURAGEMENT_MESSAGES.final,
        };
      }

      const nextCountry = getCountryOrFallback(previous.rounds[nextRoundIndex], fallbackCountry);
      return {
        ...previous,
        phase: 'quiz',
        currentRoundIndex: nextRoundIndex,
        round: createRoundState(nextRoundIndex + 1, nextCountry, countries),
        encouragementMessage: '',
      };
    });
  };

  const resetGame = () => {
    const shuffledRounds = fisherYatesShuffle(countries).slice(0, TOTAL_ROUNDS);
    setGameState({
      phase: 'welcome',
      rounds: shuffledRounds,
      currentRoundIndex: 0,
      round: null,
      encouragementMessage: '',
    });
  };

  return {
    isPending,
    gameState,
    startGame,
    revealNextHint,
    selectAnswer,
    goToNextRound,
    resetGame,
  };
};
