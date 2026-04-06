import { AnimatePresence, motion } from 'framer-motion';
import { TOTAL_HINTS } from '../constants';
import type { CountryImageKind } from '../types';
import type { RoundState } from '../types';
import { getCountryImageSrc } from '../utils/countryImages';

const HINT_IMAGE_ORDER: CountryImageKind[] = [
  'famousAnimal',
  'landmark',
  'typicalDish',
  'capital',
  'currency',
  'language',
];

const HINT_IMAGE_FALLBACK =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='100%25' height='100%25' fill='%23efe5ca'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='54'%3E%F0%9F%93%B8%3C/text%3E%3C/svg%3E";

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
        <motion.div
          key={round.revealedHints}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-3"
        >
          {HINT_IMAGE_ORDER.map((hintKind, index) => (
            <div
              key={hintKind}
              className="overflow-hidden rounded-xl border border-color-ink/10 bg-[#fffdf8] shadow-photo"
            >
              {index < round.revealedHints ? (
                <img
                  src={getCountryImageSrc(round.country, hintKind) ?? HINT_IMAGE_FALLBACK}
                  alt={`Dica visual ${index + 1}`}
                  className="h-28 w-full object-cover object-center md:h-36"
                  loading="lazy"
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="flex h-28 w-full items-center justify-center bg-color-paper-deep/80 text-4xl text-color-ink/70 md:h-36"
                >
                  ?
                </div>
              )}
            </div>
          ))}
        </motion.div>
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
