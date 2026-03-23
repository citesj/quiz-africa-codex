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
      className="space-y-5 rounded-3xl bg-white/95 p-8 shadow-passport"
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-3xl font-black text-passport">Diário de Descoberta</h2>
        <ProgressFootsteps total={TOTAL_ROUNDS} current={round.roundNumber} />
      </div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-trail p-4 text-xl font-bold text-white"
      >
        {encouragementMessage}
      </motion.p>


      <p
        className={`rounded-xl p-3 text-lg font-bold ${
          round.isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
        }`}
      >
        Você escolheu: {selectedOption?.name ?? 'sem resposta'} {round.isCorrect ? '✅' : '🧭'}
      </p>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <img
          src={country.imageUrl}
          alt={`Paisagem de ${country.name}`}
          className="h-72 w-full rounded-2xl object-cover"
          loading="lazy"
        />
        <div className="grid grid-cols-2 gap-3">
          <article className="rounded-xl bg-sand p-3">
            <h3 className="font-extrabold text-passport">País</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.name}</p>
          </article>
          <article className="rounded-xl bg-sand p-3">
            <h3 className="font-extrabold text-passport">Capital</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.capital}</p>
          </article>
          <article className="rounded-xl bg-sand p-3">
            <h3 className="font-extrabold text-passport">Região</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.region}</p>
          </article>
          <article className="rounded-xl bg-sand p-3">
            <h3 className="font-extrabold text-passport">Língua</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.language}</p>
          </article>
          <article className="rounded-xl bg-sand p-3">
            <h3 className="font-extrabold text-passport">Moeda</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.currency}</p>
          </article>
          <article className="rounded-xl bg-sand p-3">
            <h3 className="font-extrabold text-passport">Saiba Mais</h3>
            <p className={BODY_TEXT_MIN_SIZE_CLASS}>{country.funFact}</p>
          </article>
        </div>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="rounded-2xl bg-stamp px-6 py-3 text-xl font-bold text-white transition hover:bg-orange-600 active:scale-95"
      >
        {isLastRound ? 'Ver resultado final' : 'Próxima descoberta'}
      </button>
    </motion.section>
  );
};
