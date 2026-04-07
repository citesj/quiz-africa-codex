import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { TOTAL_ROUNDS } from './constants';
import { DiscoveryScreen } from './components/DiscoveryScreen';
import { ImageCreditsScreen } from './components/ImageCreditsScreen';
import { QuizScreen } from './components/QuizScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useGame } from './hooks/useGame';

const pageTransition = {
  initial: { opacity: 0, x: 70, rotateY: 8 },
  animate: { opacity: 1, x: 0, rotateY: 0 },
  exit: { opacity: 0, x: -70, rotateY: -8 },
  transition: { duration: 0.45, ease: 'easeInOut' },
};

const App = () => {
  const { gameState, isPending, startGame, revealNextHint, selectAnswer, goToNextRound, resetGame } = useGame();
  const [showImageCredits, setShowImageCredits] = useState(false);

  if (!showImageCredits && gameState.phase === 'welcome') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-color-paper bg-paper p-3 font-body text-color-ink sm:p-4 md:p-6 chromebook:p-5">
        <WelcomeScreen onStart={startGame} isPending={isPending} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-color-paper bg-paper p-3 font-body text-color-ink sm:p-4 md:p-6 chromebook:p-5 lg:p-8">
      <div className="mx-auto w-full max-w-4xl chromebook:max-w-5xl">
        <AnimatePresence mode="wait">
          {showImageCredits && (
            <motion.div key="image-credits" {...pageTransition}>
              <ImageCreditsScreen onBack={() => setShowImageCredits(false)} />
            </motion.div>
          )}

          {!showImageCredits && (
            <>
              {gameState.phase === 'quiz' && gameState.round && (
                <motion.div key={`quiz-${gameState.round.roundNumber}`} {...pageTransition}>
                  <QuizScreen round={gameState.round} onRevealHint={revealNextHint} onSelectAnswer={selectAnswer} />
                </motion.div>
              )}

              {gameState.phase === 'discovery' && gameState.round && (
                <motion.div key={`discovery-${gameState.round.roundNumber}`} {...pageTransition}>
                  <DiscoveryScreen
                    round={gameState.round}
                    encouragementMessage={gameState.encouragementMessage}
                    onNext={goToNextRound}
                    isLastRound={gameState.round.roundNumber >= TOTAL_ROUNDS}
                  />
                </motion.div>
              )}

              {gameState.phase === 'completed' && (
                <motion.section
                  key="completed"
                  {...pageTransition}
                  className="relative overflow-hidden rounded-3xl border border-color-ink/20 bg-[#fdf9ef] p-8 text-center shadow-passport"
                >
                  <span aria-hidden="true" className="absolute -right-5 top-4 rotate-12 rounded-md bg-color-stamp/20 px-3 py-1 text-xs font-bold text-color-stamp">
                    CARIMBADO
                  </span>
                  <h2 className="mb-3 font-title text-4xl font-extrabold text-color-ink">Expedição Concluída!</h2>
                  <p className="mb-5 text-[18px] text-color-ink/85">{gameState.encouragementMessage}</p>
                  <button
                    type="button"
                    onClick={resetGame}
                    className="rounded-2xl border-2 border-color-olive bg-color-olive px-6 py-3 text-xl font-bold text-white transition hover:bg-[#4d5730] focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper"
                  >
                    Jogar novamente
                  </button>
                </motion.section>
              )}
            </>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
};

export default App;
