import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BODY_TEXT_MIN_SIZE_CLASS, TOTAL_HINTS } from '../constants';
import type { CountryImageKind } from '../types';
import type { RoundState } from '../types';
import { getCountryImageSrc } from '../utils/countryImages';

const HINT_IMAGE_ORDER = [
  'famousAnimal',
  'landmark',
  'typicalDish',
  'capital',
  'currency',
  'language',
] as const satisfies readonly CountryImageKind[];

type HintImageKind = (typeof HINT_IMAGE_ORDER)[number];

const HINT_LABELS: Record<HintImageKind, string> = {
  famousAnimal: 'Animal',
  landmark: 'Lugar',
  typicalDish: 'Comida',
  capital: 'Capital',
  currency: 'Moeda',
  language: 'Idioma',
};

const LOCKED_HINT_LABEL = 'Bloqueada';

const HINT_IMAGE_FALLBACK =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect width='100%25' height='100%25' fill='%23efe5ca'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='54'%3E%F0%9F%93%B8%3C/text%3E%3C/svg%3E";

interface QuizScreenProps {
  round: RoundState;
  onRevealHint: () => void;
  onSelectAnswer: (countryId: string) => void;
}

export const QuizScreen = ({ round, onRevealHint, onSelectAnswer }: QuizScreenProps) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  useEffect(() => {
    setSelectedOptionId(null);
  }, [round.roundNumber]);

  const handleConfirmAnswer = () => {
    if (!selectedOptionId) {
      return;
    }

    onSelectAnswer(selectedOptionId);
    setSelectedOptionId(null);
  };

  return (
    <section className="space-y-6 rounded-3xl border border-color-ink/20 bg-[#fcf7ea] p-8 shadow-passport">
    <h2 className="font-title text-3xl font-extrabold text-color-ink">Rodada {round.roundNumber}</h2>

    <div className="rounded-2xl border border-color-ink/15 bg-color-paper-deep/55 p-5">
      <p className="mb-3 text-sm font-semibold text-color-ink/80">
        Pistas: {round.revealedHints}/{TOTAL_HINTS}
      </p>
      <AnimatePresence mode="wait">
        <motion.ul
          key={round.revealedHints}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="grid grid-cols-2 gap-3 md:grid-cols-3"
        >
          {HINT_IMAGE_ORDER.map((hintKind, index) => {
            const isHintRevealed = index < round.revealedHints;
            const hintLabel = isHintRevealed ? HINT_LABELS[hintKind] : LOCKED_HINT_LABEL;

            return (
              <li
                key={hintKind}
                className="flex list-none flex-col overflow-hidden rounded-xl border border-color-ink/10 bg-[#fffdf8] shadow-photo"
              >
                <span className="border-b border-color-ink/10 bg-color-paper-deep/60 px-3 py-2 text-xs font-bold tracking-wide text-color-stamp">
                  {hintLabel}
                </span>

                {isHintRevealed ? (
                  <img
                    src={getCountryImageSrc(round.country, hintKind) ?? HINT_IMAGE_FALLBACK}
                    alt={`Pista de ${hintLabel}`}
                    className="h-28 w-full object-cover object-center md:h-36"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="flex h-28 w-full items-center justify-center bg-color-paper-deep/80 text-4xl text-color-ink/70 md:h-36"
                  >
                    ?
                  </div>
                )}
              </li>
            );
          })}
        </motion.ul>
      </AnimatePresence>
      <button
        type="button"
        onClick={onRevealHint}
        disabled={round.revealedHints >= TOTAL_HINTS}
        className="mt-4 rounded-xl border-2 border-color-ink px-6 py-3 text-lg font-bold text-color-ink transition hover:bg-color-ink hover:text-[#fff9ea] disabled:opacity-50 focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper"
      >
        Revelar próxima dica
      </button>
    </div>

      <div className="grid gap-3 md:grid-cols-3">
        {round.options.map((option, index) => {
          const isSelected = selectedOptionId === option.id;
          const hasSelection = selectedOptionId !== null;
          const isDimmed = hasSelection && !isSelected;

          return (
            <motion.button
              whileHover={hasSelection && !isSelected ? undefined : { scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              key={option.id}
              type="button"
              onClick={() => setSelectedOptionId(option.id)}
              className={`rounded-2xl border-2 p-4 text-left text-xl font-bold text-color-ink shadow-photo transition focus-visible:ring-4 focus-visible:ring-color-stamp focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper ${
                isSelected
                  ? 'border-color-olive bg-[#f0e6cd] ring-2 ring-color-olive/70 ring-inset'
                  : 'border-color-olive/70 bg-[#fffdf8]'
              } ${isDimmed ? 'opacity-50' : ''} ${hasSelection ? '' : 'hover:bg-[#faf2df]'}`}
            >
              <span className="mr-2 rounded-lg bg-color-olive px-2 py-1 text-base text-white">
                {String.fromCharCode(65 + index)}
              </span>
              {option.name}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedOptionId && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pt-2"
          >
            <button
              type="button"
              onClick={handleConfirmAnswer}
              disabled={!selectedOptionId}
              className="w-full rounded-2xl border-2 border-color-ink/20 bg-color-olive px-6 py-4 text-center text-2xl font-extrabold text-white shadow-passport transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper md:text-3xl"
            >
              Confirmar Resposta
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
