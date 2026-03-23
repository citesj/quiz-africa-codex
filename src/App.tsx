import { motion } from 'framer-motion';
import { TOTAL_ROUNDS } from './constants';
import { DiscoveryScreen } from './components/DiscoveryScreen';
import { QuizScreen } from './components/QuizScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { useGame } from './hooks/useGame';

const App = () => {
  const { gameState, isPending, startGame, revealNextHint, selectAnswer, goToNextRound, resetGame } = useGame();

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f8f1e6] via-[#f9f6ef] to-[#dce8f6] p-4 md:p-10">
      <div className="mx-auto max-w-5xl">
        {gameState.phase === 'welcome' && <WelcomeScreen onStart={startGame} isPending={isPending} />}

        {gameState.phase === 'quiz' && gameState.round && (
          <QuizScreen round={gameState.round} onRevealHint={revealNextHint} onSelectAnswer={selectAnswer} />
        )}

        {gameState.phase === 'discovery' && gameState.round && (
          <DiscoveryScreen
            round={gameState.round}
            encouragementMessage={gameState.encouragementMessage}
            onNext={goToNextRound}
            isLastRound={gameState.round.roundNumber >= TOTAL_ROUNDS}
          />
        )}

        {gameState.phase === 'completed' && (
          <motion.section
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl bg-white/95 p-8 text-center shadow-passport"
          >
            <h2 className="mb-3 text-4xl font-black text-passport">Expedição Concluída!</h2>
            <p className="mb-5 text-xl text-slate-700">{gameState.encouragementMessage}</p>
            <button
              type="button"
              onClick={resetGame}
              className="rounded-2xl bg-trail px-6 py-3 text-xl font-bold text-white transition hover:bg-emerald-700"
            >
              Jogar novamente
            </button>
          </motion.section>
        )}
      </div>
    </main>
  );
};

export default App;
