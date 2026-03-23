import { motion } from 'framer-motion';
import { BODY_TEXT_MIN_SIZE_CLASS, TOTAL_ROUNDS } from '../constants';
import type { RoundState } from '../types';
import { ProgressFootsteps } from './ProgressFootsteps';

interface DiscoveryScreenProps {
  round: RoundState;
  encouragementMessage: string;
  onNext: () => void;
  isLastRound: boolean;
}

export const DiscoveryScreen = ({
  round,
  encouragementMessage,
  onNext,
  isLastRound,
}: DiscoveryScreenProps) => {
  const country = round.country;
  const selectedOption = round.options.find((option) => option.id === round.selectedCountryId);

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
        <ProgressFootsteps total={TOTAL_ROUNDS} current={round.roundNumber} />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-color-olive/30 bg-color-olive p-4 text-xl font-bold text-[#f8f4e9]"
      >
        {encouragementMessage}
      </motion.p>

      <p
        className={`rounded-xl border p-3 text-lg font-bold ${
          round.isCorrect
            ? 'border-emerald-700/30 bg-emerald-100 text-emerald-900'
            : 'border-amber-700/30 bg-amber-100 text-amber-900'
        }`}
      >
        Você escolheu: {selectedOption?.name ?? 'sem resposta'} {round.isCorrect ? '✅' : '🧭'}
      </p>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <figure className="relative rounded-2xl border-8 border-white bg-white p-2 shadow-photo">
          <span aria-hidden="true" className="absolute -left-3 top-4 rotate-[-20deg] rounded-sm bg-color-ochre/50 px-4 py-1" />
          <img
            src={country.imageUrl}
            alt={`Fotografia de viagem de ${country.name}, na região de ${country.region}`}
            className="h-72 w-full rounded-lg object-cover"
            loading="lazy"
          />
        </figure>
        <div className="grid grid-cols-2 gap-3">
          <article className="rounded-xl border border-color-ink/10 bg-color-paper-deep/55 p-3">
            <h3 className="font-title font-extrabold text-color-ink">País</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.name}</p>
          </article>
          <article className="rounded-xl border border-color-ink/10 bg-color-paper-deep/55 p-3">
            <h3 className="font-title font-extrabold text-color-ink">Capital</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.capital}</p>
          </article>
          <article className="rounded-xl border border-color-ink/10 bg-color-paper-deep/55 p-3">
            <h3 className="font-title font-extrabold text-color-ink">Região</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.region}</p>
          </article>
          <article className="rounded-xl border border-color-ink/10 bg-color-paper-deep/55 p-3">
            <h3 className="font-title font-extrabold text-color-ink">Língua</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.language}</p>
          </article>
          <article className="rounded-xl border border-color-ink/10 bg-color-paper-deep/55 p-3">
            <h3 className="font-title font-extrabold text-color-ink">Moeda</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.currency}</p>
          </article>
          <article className="rounded-xl border border-color-ink/10 bg-color-paper-deep/55 p-3">
            <h3 className="font-title font-extrabold text-color-ink">Saiba Mais</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.funFact}</p>
          </article>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="rounded-2xl border-2 border-color-terracotta bg-color-terracotta px-6 py-3 text-xl font-bold text-[#fff9f0] transition hover:bg-[#a74e34] active:scale-95 focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper"
      >
        {isLastRound ? 'Ver resultado final' : 'Próxima descoberta'}
      </button>
    </motion.section>
  );
};
