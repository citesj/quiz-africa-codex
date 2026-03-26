import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { BODY_TEXT_MIN_SIZE_CLASS, TOTAL_ROUNDS } from '../constants';
import type { CountryImageKind, RoundState } from '../types';
import { getCountryImageSrc } from '../utils/countryImages';
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
  fallbackImageSrc: string;
}

const InfoCard = ({ label, value, imageSrc, imageAlt, fallbackImageSrc }: InfoCardProps) => {
  const [currentImageSrc, setCurrentImageSrc] = useState(imageSrc);

  useEffect(() => {
    setCurrentImageSrc(imageSrc);
  }, [imageSrc]);

  return (
    <div className="rounded-2xl bg-color-paper p-3 shadow-photo">
      <dt className="font-title text-sm font-bold uppercase tracking-wide text-color-ink/90">{label}</dt>
      <img
        src={currentImageSrc}
        alt={imageAlt}
        className="mt-2 h-24 w-full rounded-lg object-cover"
        loading="lazy"
        onError={() => {
          if (currentImageSrc !== fallbackImageSrc) {
            setCurrentImageSrc(fallbackImageSrc);
          }
        }}
      />
      <dd className={`mt-3 text-color-ink ${BODY_TEXT_MIN_SIZE_CLASS}`}>{value}</dd>
    </div>
  );
};

const asEncodedSvgIcon = (emoji: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='160'><rect width='100%' height='100%' fill='#f6f0de'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='84'>${emoji}</text></svg>`,
  )}`;

const IMAGE_PLACEHOLDERS: Record<CountryImageKind, string> = {
  flag: asEncodedSvgIcon('🏳️'),
  capital: asEncodedSvgIcon('🏙️'),
  currency: asEncodedSvgIcon('💰'),
  language: asEncodedSvgIcon('🗣️'),
  typicalDish: asEncodedSvgIcon('🍲'),
  famousAnimal: asEncodedSvgIcon('🦁'),
  landmark: asEncodedSvgIcon('🗺️'),
};

const getImageWithFallback = (round: RoundState, kind: CountryImageKind): string =>
  getCountryImageSrc(round.country, kind) ?? IMAGE_PLACEHOLDERS[kind];

export const DiscoveryScreen = ({
  round,
  encouragementMessage,
  onNext,
  isLastRound,
}: DiscoveryScreenProps) => {
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  const country = round.country;
  const typicalDish = country.typicalDish ?? 'Prato tradicional local';
  const famousAnimal = country.famousAnimal ?? 'Animal típico da fauna local';
  const nextButtonLabel = isLastRound ? 'Ver resultado final' : 'Próxima descoberta';

  useEffect(() => {
    feedbackRef.current?.focus();
  }, [round.roundNumber]);

  const cards: InfoCardProps[] = [
    {
      label: 'Capital',
      value: country.capital,
      imageSrc: getImageWithFallback(round, 'capital'),
      fallbackImageSrc: IMAGE_PLACEHOLDERS.capital,
      imageAlt: `Paisagem da capital ${country.capital}, em ${country.name}`,
    },
    {
      label: 'Moeda',
      value: country.currency,
      imageSrc: getImageWithFallback(round, 'currency'),
      fallbackImageSrc: IMAGE_PLACEHOLDERS.currency,
      imageAlt: `Imagem representando a moeda oficial de ${country.name}`,
    },
    {
      label: 'Idioma',
      value: country.language,
      imageSrc: getImageWithFallback(round, 'language'),
      fallbackImageSrc: IMAGE_PLACEHOLDERS.language,
      imageAlt: `Imagem representando os idiomas falados em ${country.name}`,
    },
    {
      label: 'Prato Típico',
      value: typicalDish,
      imageSrc: getImageWithFallback(round, 'typicalDish'),
      fallbackImageSrc: IMAGE_PLACEHOLDERS.typicalDish,
      imageAlt: `Ilustração de prato típico de ${country.name}`,
    },
    {
      label: 'Animal Famoso',
      value: famousAnimal,
      imageSrc: getImageWithFallback(round, 'famousAnimal'),
      fallbackImageSrc: IMAGE_PLACEHOLDERS.famousAnimal,
      imageAlt: `Foto de um ${famousAnimal} nativo de ${country.name}`,
    },
    {
      label: 'Ponto Turístico',
      value: country.landmark,
      imageSrc: getImageWithFallback(round, 'landmark'),
      fallbackImageSrc: IMAGE_PLACEHOLDERS.landmark,
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

      <div className="space-y-1 pt-1">
        <p className="font-body text-sm text-color-ink/70">País revelado</p>
        <div className="flex items-center gap-3">
          <img
            src={getImageWithFallback(round, 'flag')}
            alt={`Bandeira de ${country.name}`}
            className="h-10 w-14 rounded-md border border-color-ink/20 object-cover shadow-photo"
            loading="lazy"
          />
          <h3 className="font-title text-2xl font-extrabold text-color-ink md:text-3xl">{country.name}</h3>
        </div>
        <p className="font-body text-sm text-color-ink/75">Rodada {round.roundNumber} de {TOTAL_ROUNDS} concluída</p>
      </div>

      <dl className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <InfoCard
            key={card.label}
            label={card.label}
            value={card.value}
            imageSrc={card.imageSrc}
            fallbackImageSrc={card.fallbackImageSrc}
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
        aria-label={`${nextButtonLabel}. Rodada ${round.roundNumber} de ${TOTAL_ROUNDS}.`}
        className="rounded-2xl border-2 border-color-terracotta bg-color-terracotta px-6 py-3 text-xl font-bold text-[#fff9f0] transition hover:bg-[#a74e34] active:scale-95 focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper"
      >
        {nextButtonLabel}
      </button>
    </motion.section>
  );
};
