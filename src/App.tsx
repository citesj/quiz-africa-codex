import { AnimatePresence, motion } from "framer-motion";
import { DiscoveryScreen } from "./components/DiscoveryScreen";
import { ExpeditionBackdrop } from "./components/ExpeditionBackdrop";
import { QuizScreen } from "./components/QuizScreen";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { TOTAL_ROUNDS } from "./constants";
import { useGame } from "./hooks/useGame";

const pageTransition = {
  initial: { opacity: 0, x: 70, rotateY: 8 },
  animate: { opacity: 1, x: 0, rotateY: 0 },
  exit: { opacity: 0, x: -70, rotateY: -8 },
  transition: { duration: 0.45, ease: "easeInOut" },
};

const App = () => {
  const {
    gameState,
    isPending,
    startGame,
    revealNextHint,
    selectAnswer,
    goToNextRound,
    resetGame,
  } = useGame();

  if (gameState.phase === "welcome") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-color-paper bg-paper p-3 font-body text-color-ink sm:p-4 md:p-6 chromebook:p-5">
        <WelcomeScreen onStart={startGame} isPending={isPending} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-color-paper bg-paper p-3 font-body text-color-ink sm:p-4 md:p-6 chromebook:p-5 lg:p-8">
      <div
        className={`mx-auto w-full ${
          gameState.phase === "completed"
            ? ""
            : "max-w-4xl chromebook:max-w-5xl"
        }`}
      >
        <AnimatePresence mode="wait">
          {gameState.phase === "quiz" && gameState.round && (
            <motion.div
              key={`quiz-${gameState.round.roundNumber}`}
              {...pageTransition}
            >
              <QuizScreen
                round={gameState.round}
                onRevealHint={revealNextHint}
                onSelectAnswer={selectAnswer}
              />
            </motion.div>
          )}

          {gameState.phase === "discovery" && gameState.round && (
            <motion.div
              key={`discovery-${gameState.round.roundNumber}`}
              {...pageTransition}
            >
              <DiscoveryScreen
                round={gameState.round}
                encouragementMessage={gameState.encouragementMessage}
                onNext={goToNextRound}
                isLastRound={gameState.round.roundNumber >= TOTAL_ROUNDS}
              />
            </motion.div>
          )}

          {gameState.phase === "completed" && (
            <motion.section
              key="completed"
              {...pageTransition}
              className="relative isolate flex min-h-[72vh] items-center justify-center overflow-hidden"
            >
              <ExpeditionBackdrop className="opacity-45" />
              <div className="relative z-10 mx-auto w-full max-w-3xl overflow-hidden rounded-3xl border-2 border-[#efd7a9] bg-gradient-to-b from-[#fff7e8] to-[#fff1d6] p-8 text-center shadow-[0_14px_36px_rgba(120,77,17,0.2)] sm:p-10">
                <span
                  aria-hidden="true"
                  className="absolute right-2 top-5 z-10 rotate-12 rounded-md border border-color-stamp/25 bg-color-stamp/20 px-3 py-1 text-xs font-bold tracking-wide text-color-stamp"
                >
                  CARIMBADO
                </span>
                <h2 className="relative z-10 mb-3 font-title text-4xl font-extrabold text-[#3f2b11] sm:text-5xl">
                  Expedição Concluída!
                </h2>
                <p className="relative z-10 mb-7 text-lg font-semibold text-[#5f4520] sm:text-xl">
                  {gameState.encouragementMessage}
                </p>
                <button
                  type="button"
                  onClick={resetGame}
                  className="relative z-10 rounded-2xl border-2 border-[#9e6212] bg-[#c98522] px-7 py-3 text-xl font-extrabold text-white shadow-[0_9px_0_#9e6212] transition hover:bg-[#b9771d] active:translate-y-[2px] active:shadow-[0_7px_0_#9e6212] focus-visible:ring-4 focus-visible:ring-[#f0c36f] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff1d8]"
                >
                  Jogar novamente
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default App;

