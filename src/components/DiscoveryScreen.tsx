import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { TOTAL_ROUNDS } from '../constants';
import type { RoundState } from '../types';
import { getCountryImageSrc } from '../utils/countryImages';

interface DiscoveryScreenProps {
  round: RoundState;
  encouragementMessage: string;
  onNext: () => void;
  isLastRound: boolean;
}

const FLAG_FALLBACK =
  "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='960' height='600'%3E%3Crect width='100%25' height='100%25' fill='%23f6f0de'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='180'%3E%F0%9F%8F%B3%EF%B8%8F%3C/text%3E%3C/svg%3E";

export const DiscoveryScreen = ({
  round,
  encouragementMessage,
  onNext,
  isLastRound,
}: DiscoveryScreenProps) => {
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const country = round.country;
  const nextButtonLabel = isLastRound ? 'Ver resultado final' : 'Próxima descoberta';

  useEffect(() => {
    feedbackRef.current?.focus();
  }, [round.roundNumber]);

  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative space-y-5 rounded-3xl border border-color-ink/20 bg-[#fcf7ea] p-8 shadow-passport"
    >
      <span aria-hidden="true" className="absolute right-6 top-2 rotate-6 rounded border-2 border-color-stamp px-3 py-1 text-xs font-bold text-color-stamp">
        Passaporte
      </span>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="font-title text-3xl font-extrabold text-color-ink">Diário de Descoberta</h2>
      </div>

      <motion.p
        ref={feedbackRef}
        tabIndex={-1}
        aria-live="polite"
        aria-atomic="true"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border-2 p-4 text-lg font-bold leading-relaxed shadow-photo focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper md:text-xl ${
          round.isCorrect
            ? 'border-emerald-900 bg-emerald-100 text-emerald-950'
            : 'border-red-900 bg-red-100 text-red-950'
        }`}
      >
        {encouragementMessage}
      </motion.p>

      <div className="space-y-3 pt-1">
        <p className="font-body text-sm text-color-ink/70">País revelado</p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto w-full max-w-md overflow-hidden rounded-xl border border-color-ink/20 shadow-photo"
        >
          <img
            src={getCountryImageSrc(round.country, 'flag') ?? FLAG_FALLBACK}
            alt={`Bandeira de ${country.name}`}
            className="h-auto w-full object-cover object-center"
            loading="lazy"
          />
        </motion.div>
        <h3 className="text-center font-title text-3xl font-extrabold text-color-ink md:text-4xl">{country.name}</h3>
        <p className="text-center font-body text-sm text-color-ink/75">Rodada {round.roundNumber} de {TOTAL_ROUNDS} concluída</p>
      </div>

      <p className="rounded-2xl bg-color-ochre/10 px-4 py-3 font-body text-color-ink shadow-photo">
        <span className="font-title text-sm font-bold uppercase tracking-wide text-color-ink/90">Curiosidade</span>
        <span className="mt-2 block">{country.funFact}</span>
      </p>

      <button
        type="button"
        onClick={onNext}
        aria-label={`${nextButtonLabel}. Rodada ${round.roundNumber} de ${TOTAL_ROUNDS}.`}
        className="rounded-2xl border-2 border-color-terracotta bg-color-terracotta px-6 py-3 text-xl font-bold text-[#fff9f0] transition hover:bg-[#a74e34] active:scale-95 focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper"
      >
        {nextButtonLabel}
      </button>
    </motion.section>
  );
};
