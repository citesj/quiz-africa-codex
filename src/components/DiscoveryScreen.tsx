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

interface InfoCardProps {
  label: string;
  value: string;
  imageSrc: string;
  imageAlt: string;
}

const InfoCard = ({ label, value, imageSrc, imageAlt }: InfoCardProps) => (
  <div className="rounded-2xl bg-color-paper p-3 shadow-photo">
    <dt className="font-title text-sm font-bold uppercase tracking-wide text-color-ink/90">{label}</dt>
    <img
      src={imageSrc}
      alt={imageAlt}
      className="mt-2 h-24 w-full rounded-lg object-cover"
      loading="lazy"
    />
    <dd className={`mt-3 text-color-ink ${BODY_TEXT_MIN_SIZE_CLASS}`}>{value}</dd>
  </div>
);

const asEncodedSvgIcon = (emoji: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='160'><rect width='100%' height='100%' fill='#f6f0de'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='84'>${emoji}</text></svg>`,
  )}`;

export const DiscoveryScreen = ({
  round,
  encouragementMessage,
  onNext,
  isLastRound,
}: DiscoveryScreenProps) => {
  const country = round.country;
  const selectedOption = round.options.find((option) => option.id === round.selectedCountryId);

  const typicalDish = country.typicalDish?.trim() || 'Prato típico em atualização no diário.';
  const famousAnimal = country.famousAnimal?.trim() || country.wildlife;

  const cards: InfoCardProps[] = [
    {
      label: 'Capital',
      value: country.capital,
      imageSrc: country.imageUrl,
      imageAlt: `Paisagem da capital ${country.capital}, em ${country.name}`,
    },
    {
      label: 'Bandeira',
      value: `Bandeira de ${country.name}`,
      imageSrc: asEncodedSvgIcon('🏳️'),
      imageAlt: `Ícone da bandeira de ${country.name}`,
    },
    {
      label: 'Idioma',
      value: country.language,
      imageSrc: asEncodedSvgIcon('🗣️'),
      imageAlt: `Ícone representando os idiomas falados em ${country.name}`,
    },
    {
      label: 'Prato Típico',
      value: typicalDish,
      imageSrc: asEncodedSvgIcon('🍲'),
      imageAlt: `Ilustração de prato típico de ${country.name}`,
    },
    {
      label: 'Animal Famoso',
      value: famousAnimal,
      imageSrc: asEncodedSvgIcon('🦁'),
      imageAlt: `Foto de um ${famousAnimal} nativo de ${country.name}`,
    },
    {
      label: 'Ponto Turístico',
      value: country.landmark,
      imageSrc: country.imageUrl,
      imageAlt: `Imagem de um ponto turístico de ${country.name}`,
    },
  ];

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

      <dl className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <InfoCard
            key={card.label}
            label={card.label}
            value={card.value}
            imageSrc={card.imageSrc}
            imageAlt={card.imageAlt}
          />
        ))}
      </dl>

      <p className="rounded-2xl bg-color-ochre/10 px-4 py-3 font-body text-color-ink shadow-photo">
        <span className="font-title text-sm font-bold uppercase tracking-wide text-color-ink/90">Curiosidade</span>
        <span className="mt-2 block">{country.funFact}</span>
      </p>

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
