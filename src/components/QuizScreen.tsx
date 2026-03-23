import { AnimatePresence, motion } from 'framer-motion';
import { BODY_TEXT_MIN_SIZE_CLASS, TOTAL_HINTS, TOTAL_ROUNDS } from '../constants';
import type { RoundState } from '../types';
import { ProgressFootsteps } from './ProgressFootsteps';

interface QuizScreenProps {
  round: RoundState;
  onRevealHint: () => void;
  onSelectAnswer: (countryId: string) => void;
}

export const QuizScreen = ({ round, onRevealHint, onSelectAnswer }: QuizScreenProps) => (
  <section className="space-y-6 rounded-3xl bg-white/95 p-8 shadow-passport">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 className="text-3xl font-black text-passport">Rodada {round.roundNumber}</h2>
      <ProgressFootsteps total={TOTAL_ROUNDS} current={round.roundNumber} />
    </div>

    <div className="rounded-2xl bg-sand p-5">
      <p className="mb-3 text-lg font-bold text-passport">Pistas reveladas: {round.revealedHints}/{TOTAL_HINTS}</p>
      <AnimatePresence mode="wait">
        <motion.ul
          key={round.revealedHints}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          {round.country.hints.slice(0, round.revealedHints).map((hint, index) => (
            <li key={hint} className={`${BODY_TEXT_MIN_SIZE_CLASS} rounded-xl bg-white p-3 text-slate-800`}>
              <span className="font-bold text-stamp">Dica {index + 1}:</span> {hint}
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      <button
        type="button"
        onClick={onRevealHint}
        disabled={round.revealedHints >= TOTAL_HINTS}
        className="mt-4 rounded-xl border-2 border-passport px-5 py-2 text-lg font-bold text-passport transition hover:bg-passport hover:text-white disabled:opacity-50"
      >
        Revelar próxima dica
      </button>
    </div>

    <div>
      <p className="mb-3 text-xl font-bold text-passport">Qual país é esse?</p>
      <div className="grid gap-3 md:grid-cols-3">
        {round.options.map((option, index) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            key={option.id}
            type="button"
            onClick={() => onSelectAnswer(option.id)}
            className="rounded-2xl border-2 border-trail bg-white p-4 text-left text-xl font-bold text-passport transition hover:bg-emerald-50"
          >
            <span className="mr-2 rounded-lg bg-trail px-2 py-1 text-base text-white">{String.fromCharCode(65 + index)}</span>
            {option.name}
          </motion.button>
        ))}
      </div>
    </div>
  </section>
);
