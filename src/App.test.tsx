import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { TOTAL_ROUNDS } from "./constants";
import { countries } from "./data/data";
import { useGame } from "./hooks/useGame";
import type { GameState, RoundState } from "./types";

vi.mock("framer-motion", () => {
  const passthrough = ({ children }: { children: ReactNode }) => (
    <>{children}</>
  );
  return {
    AnimatePresence: passthrough,
    motion: {
      div: passthrough,
      section: passthrough,
    },
  };
});

vi.mock("./components/WelcomeScreen", () => ({
  WelcomeScreen: ({ onStart }: { onStart: () => void }) => (
    <button type="button" onClick={onStart}>
      mock-start
    </button>
  ),
}));

vi.mock("./components/QuizScreen", () => ({
  QuizScreen: ({ round }: { round: RoundState }) => (
    <div>quiz-mock-rodada-{round.roundNumber}</div>
  ),
}));

vi.mock("./components/DiscoveryScreen", () => ({
  DiscoveryScreen: ({ isLastRound }: { isLastRound: boolean }) => (
    <div>discovery-mock-final-{String(isLastRound)}</div>
  ),
}));

vi.mock("./hooks/useGame", () => ({
  useGame: vi.fn(),
}));

const useGameMock = vi.mocked(useGame);

const [countryA, countryB, countryC] = countries;
if (!countryA || !countryB || !countryC) {
  throw new Error("Nao ha paises suficientes para montar os testes de App.");
}

const createRound = (roundNumber = 1): RoundState => ({
  roundNumber,
  country: countryA,
  options: [countryA, countryB, countryC],
  revealedHints: 1,
  selectedCountryId: null,
  isCorrect: null,
});

const createGameState = (overrides: Partial<GameState> = {}): GameState => ({
  phase: "welcome",
  rounds: countries.slice(0, TOTAL_ROUNDS),
  currentRoundIndex: 0,
  round: null,
  encouragementMessage: "",
  ...overrides,
});

type UseGameReturn = ReturnType<typeof useGame>;

const createUseGameReturn = (
  overrides: Partial<UseGameReturn> = {},
): UseGameReturn => ({
  isPending: false,
  gameState: createGameState(),
  startGame: vi.fn(),
  revealNextHint: vi.fn(),
  selectAnswer: vi.fn(),
  goToNextRound: vi.fn(),
  resetGame: vi.fn(),
  ...overrides,
});

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza tela inicial e dispara startGame", async () => {
    const user = userEvent.setup();
    const startGame = vi.fn();

    useGameMock.mockReturnValue(
      createUseGameReturn({
        gameState: createGameState({ phase: "welcome" }),
        startGame,
      }),
    );

    render(<App />);

    await user.click(screen.getByRole("button", { name: "mock-start" }));

    expect(startGame).toHaveBeenCalledTimes(1);
  });

  it("renderiza a tela de quiz quando fase for quiz", () => {
    useGameMock.mockReturnValue(
      createUseGameReturn({
        gameState: createGameState({
          phase: "quiz",
          round: createRound(1),
        }),
      }),
    );

    render(<App />);

    expect(screen.getByText("quiz-mock-rodada-1")).toBeInTheDocument();
  });

  it("passa isLastRound corretamente na tela de discovery", () => {
    useGameMock.mockReturnValue(
      createUseGameReturn({
        gameState: createGameState({
          phase: "discovery",
          round: createRound(TOTAL_ROUNDS),
        }),
      }),
    );

    render(<App />);

    expect(screen.getByText("discovery-mock-final-true")).toBeInTheDocument();
  });

  it("permite reiniciar na tela de concluido", async () => {
    const user = userEvent.setup();
    const resetGame = vi.fn();

    useGameMock.mockReturnValue(
      createUseGameReturn({
        gameState: createGameState({
          phase: "completed",
          encouragementMessage: "Parabens, explorador!",
        }),
        resetGame,
      }),
    );

    render(<App />);

    await user.click(screen.getByRole("button", { name: "Jogar novamente" }));

    expect(resetGame).toHaveBeenCalledTimes(1);
  });
});

