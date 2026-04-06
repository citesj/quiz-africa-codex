import { AnimatePresence, motion } from 'framer-motion';
import { BODY_TEXT_MIN_SIZE_CLASS, TOTAL_HINTS, TOTAL_ROUNDS } from '../constants';
import type { RoundState } from '../types';

interface QuizScreenProps {
  round: RoundState;
  onRevealHint: () => void;
  onSelectAnswer: (countryId: string) => void;
}

export const QuizScreen = ({ round, onRevealHint, onSelectAnswer }: QuizScreenProps) => (
  <section className="space-y-6 rounded-3xl border border-color-ink/20 bg-[#fcf7ea] p-8 shadow-passport">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <h2 className="font-title text-3xl font-extrabold text-color-ink">Rodada {round.roundNumber}</h2>
    </div>

    <div className="relative rounded-2xl border border-color-ink/15 bg-color-paper-deep/55 p-5">
      <p className="mb-3 text-lg font-bold text-color-ink">Pistas reveladas: {round.revealedHints}/{TOTAL_HINTS}</p>
      <AnimatePresence mode="wait">
        <motion.ul
          key={round.revealedHints}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-2"
        >
          {round.country.hints.slice(0, round.revealedHints).map((hint, index) => (
            <li
              key={hint}
              className={`${BODY_TEXT_MIN_SIZE_CLASS} rounded-xl border border-color-ink/10 bg-[#fffdf8] p-3 text-color-ink shadow-photo`}
            >
              <span className="font-bold text-color-stamp">Dica {index + 1}:</span> {hint}
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
      <button
        type="button"
        onClick={onRevealHint}
        disabled={round.revealedHints >= TOTAL_HINTS}
        className="mt-4 rounded-xl border-2 border-color-ink px-5 py-2 text-lg font-bold text-color-ink transition hover:bg-color-ink hover:text-[#fff9ea] disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper"
      >
        Revelar próxima dica
      </button>
    </div>

    <div>
      <p className="mb-3 font-title text-2xl font-extrabold text-color-ink">Escolher país</p>
      <div className="grid gap-3 md:grid-cols-3">
        {round.options.map((option, index) => (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            key={option.id}
            type="button"
            onClick={() => onSelectAnswer(option.id)}
            className="rounded-2xl border-2 border-color-olive/70 bg-[#fffdf8] p-4 text-left text-xl font-bold text-color-ink shadow-photo transition hover:bg-[#faf2df] focus-visible:ring-4 focus-visible:ring-color-stamp focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper"
          >
            <span className="mr-2 rounded-lg bg-color-olive px-2 py-1 text-base text-white">{String.fromCharCode(65 + index)}</span>
            {option.name}
          </motion.button>
        ))}
      </div>
    </div>
  </section>
);
