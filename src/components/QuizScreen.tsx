import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { BODY_TEXT_MIN_SIZE_CLASS, TOTAL_HINTS } from '../constants';
import type { CountryImageKind } from '../types';
import type { RoundState } from '../types';
import { getCountryImageSrc } from '../utils/countryImages';

const HINT_IMAGE_ORDER = [
  'famousAnimal',
  'nature',
  'culture',
  'sport',
  'typicalDish',
  'shape',
  'landmark',
] as const satisfies readonly CountryImageKind[];

type HintImageKind = (typeof HINT_IMAGE_ORDER)[number];

const HINT_LABELS: Record<HintImageKind, string> = {
  famousAnimal: 'Animal',
  nature: 'Natureza',
  culture: 'Cultura',
  sport: 'Esporte',
  landmark: 'Lugar',
  typicalDish: 'Comida',
  shape: 'Mapa',
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
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [interactionPhase, setInteractionPhase] = useState<'idle' | 'selected' | 'tension' | 'resolution'>('idle');
  const tensionTimeoutRef = useRef<number | null>(null);
  const resolutionTimeoutRef = useRef<number | null>(null);
  const isHintsExhausted = round.revealedHints >= TOTAL_HINTS;
  const isHintButtonDisabled =
    isHintsExhausted || interactionPhase === 'tension' || interactionPhase === 'resolution';

  useEffect(() => {
    if (tensionTimeoutRef.current) window.clearTimeout(tensionTimeoutRef.current);
    if (resolutionTimeoutRef.current) window.clearTimeout(resolutionTimeoutRef.current);
    setSelectedId(null);
    setZoomedImage(null);
    setInteractionPhase('idle');
  }, [round.roundNumber]);

  useEffect(
    () => () => {
      if (tensionTimeoutRef.current) window.clearTimeout(tensionTimeoutRef.current);
      if (resolutionTimeoutRef.current) window.clearTimeout(resolutionTimeoutRef.current);
    },
    [],
  );

  const handleSelectOption = (optionId: string) => {
    if (interactionPhase === 'tension' || interactionPhase === 'resolution') {
      return;
    }
    setSelectedId(optionId);
    setInteractionPhase('selected');
  };

  const handleConfirmAnswer = () => {
    if (!selectedId) return;

    setInteractionPhase('tension');

    tensionTimeoutRef.current = window.setTimeout(() => {
      setInteractionPhase('resolution');

      resolutionTimeoutRef.current = window.setTimeout(() => {
        onSelectAnswer(selectedId);
        setSelectedId(null);
        setInteractionPhase('idle');
      }, 1500);
    }, 500);
  };

  const findNarrativeHintByKind = (hintKind: HintImageKind) => {
    const normalizedHints = round.country.hints.map((hint) => hint.toLowerCase());
    const hintMatchers: Record<HintImageKind, string[]> = {
      nature: ['natureza', 'deserto', 'savana', 'floresta', 'ilha', 'montanha', 'rio', 'praia'],
      culture: ['cultura', 'festa', 'máscara', 'roupa', 'dança', 'música', 'tradicion'],
      sport: ['esporte', 'futebol', 'maratona', 'corrida', 'luta', 'rugby'],
      shape: ['mapa', 'formato', 'pareço', 'silhueta'],
      landmark: ['pirâm', 'monte', 'reserva', 'mesquita', 'castelo', 'igrejas', 'ilha', 'vulcão'],
      typicalDish: ['prato', 'comida', 'culinária'],
      famousAnimal: ['animal', 'safári', 'big five', 'lêmur', 'leão', 'girafa', 'crocodilo'],
    };
    const terms = hintMatchers[hintKind];
    const matchIndex = normalizedHints.findIndex((hint) => terms.some((term) => hint.includes(term)));
    return matchIndex >= 0 ? round.country.hints[matchIndex] : null;
  };

  const getHintSupportText = (hintKind: HintImageKind) => {
    const narrativeHint = findNarrativeHintByKind(hintKind);
    if (narrativeHint) return narrativeHint;

    switch (hintKind) {
      case 'nature':
        return 'Observe a paisagem, o clima e os biomas desse país!';
      case 'culture':
        return 'Repare nas roupas, tradições e celebrações culturais.';
      case 'sport':
        return 'Esse esporte ou brincadeira é bem popular por lá!';
      case 'shape':
        return 'Veja a silhueta no mapa e tente reconhecer o formato do país.';
      case 'landmark':
        return `Um lugar famoso daqui é ${round.country.landmark}.`;
      case 'typicalDish':
        return round.country.typicalDish
          ? `Um prato típico daqui é ${round.country.typicalDish}.`
          : 'Temos sabores típicos muito especiais!';
      case 'famousAnimal':
        return round.country.famousAnimal
          ? `Um animal marcante daqui é ${round.country.famousAnimal}.`
          : `Um animal importante daqui é ${round.country.wildlife}.`;
      default:
        return 'Observe com atenção essa pista!';
    }
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
              const imageSrc = getCountryImageSrc(round.country, hintKind) ?? HINT_IMAGE_FALLBACK;

              return (
                <li
                  key={hintKind}
                  className="flex list-none flex-col overflow-hidden rounded-xl border border-color-ink/10 bg-[#fffdf8] shadow-photo"
                >
                  <span className="border-b border-color-ink/10 bg-color-paper-deep/60 px-3 py-2 text-xs font-bold tracking-wide text-color-stamp">
                    {hintLabel}
                  </span>

                  {isHintRevealed ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setZoomedImage(imageSrc)}
                        className="group focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-inset"
                        aria-label={`Ampliar imagem da pista ${hintLabel}`}
                      >
                        <img
                          src={imageSrc}
                          alt={`Pista de ${hintLabel}`}
                          className="h-28 w-full cursor-zoom-in object-cover object-center transition-opacity hover:opacity-90 md:h-36"
                          loading="lazy"
                          decoding="async"
                        />
                      </button>
                      <p className="text-sm font-medium text-color-ink/90 p-2 bg-[#fffdf8] rounded-b-xl">
                        {getHintSupportText(hintKind)}
                      </p>
                    </>
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
        <motion.button
          type="button"
          onClick={onRevealHint}
          whileHover={isHintButtonDisabled ? {} : { scale: 1.02 }}
          whileTap={isHintButtonDisabled ? {} : { scale: 0.95 }}
          disabled={isHintButtonDisabled}
          className="mt-4 rounded-xl bg-color-ochre px-6 py-3 text-lg font-bold text-[#fff9ea] shadow-photo transition-colors hover:brightness-105 disabled:cursor-not-allowed disabled:bg-color-paper-deep disabled:text-color-ink/50 disabled:shadow-none focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper"
        >
          {isHintsExhausted ? 'Todas as pistas abertas!' : '🔍 Mostrar outra pista'}
        </motion.button>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {round.options.map((option) => {
          const isSelected = selectedId === option.id;
          const hasSelection = interactionPhase !== 'idle' && selectedId !== null;
          const isDimmed = hasSelection && !isSelected;
          const isCorrectSelection = interactionPhase === 'resolution' && isSelected && selectedId === round.country.id;
          const isWrongSelection = interactionPhase === 'resolution' && isSelected && selectedId !== round.country.id;
          const isCorrectAnswerReveal =
            interactionPhase === 'resolution' && selectedId !== round.country.id && option.id === round.country.id;
          const isLocked = interactionPhase === 'tension' || interactionPhase === 'resolution';

          return (
            <motion.button
              whileHover={isLocked || (hasSelection && !isSelected) ? undefined : { scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              animate={
                isCorrectSelection
                  ? { y: [0, -15, 0, -15, 0] }
                  : isWrongSelection
                    ? { x: [0, -10, 10, -10, 10, 0] }
                    : isCorrectAnswerReveal
                      ? { opacity: [1, 0.35, 1, 0.35, 1] }
                      : interactionPhase === 'tension' && isSelected
                        ? { scale: 0.95 }
                        : interactionPhase === 'selected' && isSelected
                          ? { scale: 1.05 }
                          : { scale: 1 }
              }
              transition={{ duration: 0.6 }}
              key={option.id}
              type="button"
              onClick={() => handleSelectOption(option.id)}
              disabled={isLocked}
              className={`flex justify-center rounded-2xl border-2 p-4 text-center text-xl font-bold text-color-ink shadow-photo transition focus-visible:ring-4 focus-visible:ring-color-stamp focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper disabled:cursor-not-allowed ${
                isCorrectSelection
                  ? 'border-green-700 bg-green-500 text-white'
                  : isWrongSelection
                    ? 'border-red-600 bg-red-400 text-white'
                    : isCorrectAnswerReveal
                      ? 'border-green-700 bg-green-500 text-white'
                    : isSelected
                      ? 'border-color-olive bg-[#f0e6cd] ring-4 ring-color-ochre'
                      : 'border-color-olive/70 bg-[#fffdf8]'
              } ${isDimmed ? 'opacity-50' : ''} ${hasSelection ? '' : 'hover:bg-[#faf2df]'}`}
            >
              {option.name}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {interactionPhase === 'selected' && selectedId && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="pt-2"
          >
            <motion.button
              type="button"
              onClick={handleConfirmAnswer}
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-full rounded-2xl border-2 border-color-ink/20 bg-color-olive px-6 py-4 text-center text-2xl font-extrabold text-white shadow-passport transition hover:brightness-110 focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper md:text-3xl"
            >
              Confirmar Resposta
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {zoomedImage && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-color-ink/80 p-4 backdrop-blur-sm"
            aria-label="Fechar imagem ampliada"
          >
            <motion.img
              src={zoomedImage}
              alt="Pista ampliada"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
};
