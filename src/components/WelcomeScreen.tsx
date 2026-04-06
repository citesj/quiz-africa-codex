import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { BODY_TEXT_MIN_SIZE_CLASS } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
  isPending: boolean;
}

export const WelcomeScreen = ({ onStart, isPending }: WelcomeScreenProps) => {
  const [investigatorName, setInvestigatorName] = useState('');

  const ctaLabel = useMemo(() => {
    const trimmedName = investigatorName.trim();
    if (!trimmedName) {
      return 'Começar Expedição';
    }
    return `Começar Expedição, ${trimmedName}`;
  }, [investigatorName]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-color-ink/20 bg-[#fcf7ea] p-4 shadow-passport sm:p-8"
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="relative mx-auto max-w-2xl rounded-[28px] border-2 border-[#f6cb63] bg-gradient-to-b from-[#fff3d6] via-[#fff9ea] to-[#e8f5ff] p-6 shadow-[0_16px_40px_rgba(53,74,106,0.22)] sm:p-8"
      >
        <span aria-hidden="true" className="absolute right-4 top-4 text-2xl">
          🕵️
        </span>
        <p className="mb-2 font-title text-sm font-bold uppercase tracking-[0.22em] text-[#9b5d1d]">Missão Investigativa</p>
        <h1 className="mb-3 font-title text-4xl font-extrabold leading-tight text-[#26354d]">Quiz Investigativo da África</h1>
        <p className={`mb-5 text-[#34486a] ${BODY_TEXT_MIN_SIZE_CLASS}`}>
          Vista seu chapéu de detetive e descubra pistas incríveis. Sua missão começa agora!
        </p>

        <label htmlFor="investigator-name" className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-[#35445f]">
          Nome do investigador
        </label>
        <input
          id="investigator-name"
          value={investigatorName}
          onChange={(event) => setInvestigatorName(event.target.value)}
          maxLength={18}
          placeholder="Ex: Lara"
          className="mb-6 min-h-11 w-full rounded-xl border-2 border-[#7ca1dd] bg-white/95 px-4 py-2 text-lg font-semibold text-[#26354d] outline-none transition placeholder:text-[#6c7f9f] focus-visible:ring-4 focus-visible:ring-[#8cb8ff]"
        />

        <ol className="mb-7 flex flex-col gap-2 text-base font-bold text-[#2f3f5a]" aria-label="Passo a passo da missão">
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="text-xl">
              🔎
            </span>
            <span>Leia a pista</span>
            <span aria-hidden="true" className="ml-1 text-[#4369aa]">
              →
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="text-xl">
              🧠
            </span>
            <span>Escolha a resposta</span>
            <span aria-hidden="true" className="ml-1 text-[#4369aa]">
              →
            </span>
          </li>
          <li className="flex items-center gap-2">
            <span aria-hidden="true" className="text-xl">
              🛂
            </span>
            <span>Ganhe o carimbo no passaporte</span>
          </li>
        </ol>

        <button
          type="button"
          onClick={onStart}
          disabled={isPending}
          aria-label={isPending ? 'Aguarde, preparando a expedição' : ctaLabel}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border-2 border-[#1148b0] bg-[#1660e8] px-6 py-3 text-xl font-extrabold text-white shadow-[0_10px_0_#1148b0] transition hover:bg-[#0f51cb] active:translate-y-[2px] active:shadow-[0_8px_0_#1148b0] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:ring-4 focus-visible:ring-[#9ec0ff] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff6e3]"
        >
          {isPending ? (
            <span className="inline-flex items-center gap-2">
              <motion.span
                aria-hidden="true"
                className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
              />
              Preparando aventura...
            </span>
          ) : (
            ctaLabel
          )}
        </button>
      </motion.div>
    </motion.section>
  );
};
