import { motion } from 'framer-motion';
import { BODY_TEXT_MIN_SIZE_CLASS } from '../constants';

interface WelcomeScreenProps {
  onStart: () => void;
  isPending: boolean;
}

export const WelcomeScreen = ({ onStart, isPending }: WelcomeScreenProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="relative overflow-hidden rounded-3xl border border-color-ink/20 bg-[#fcf7ea] p-4 shadow-passport sm:p-8"
  >
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.05, duration: 0.4 }}
      className="mx-auto max-w-2xl rounded-[28px] border-2 border-[#e8b554] bg-gradient-to-b from-[#fff7e8] to-[#fff1d6] p-6 text-center shadow-[0_14px_36px_rgba(120,77,17,0.2)] sm:p-8"
    >
      <h1 className="mb-3 font-title text-4xl font-extrabold leading-tight text-[#3f2b11] sm:text-5xl">Quiz Continente Africano</h1>

      <p className={`mb-6 text-[#5f4520] ${BODY_TEXT_MIN_SIZE_CLASS}`}>
        Desvende os mistérios de 10 países africanos e complete seu passaporte!
      </p>

      <ol className="mb-8 flex flex-col items-start gap-3 rounded-2xl bg-white/65 p-4 text-left text-lg font-bold text-[#3f2b11] sm:mx-auto sm:max-w-xl">
        <li className="flex items-center gap-3">
          <span aria-hidden="true" className="text-2xl">
            🔎
          </span>
          <span>Leia a pista</span>
        </li>
        <li className="flex items-center gap-3">
          <span aria-hidden="true" className="text-2xl">
            💡
          </span>
          <span>Escolha a resposta</span>
        </li>
        <li className="flex items-center gap-3">
          <span aria-hidden="true" className="text-2xl">
            🏆
          </span>
          <span>Ganhe o carimbo no passaporte</span>
        </li>
      </ol>

      <button
        type="button"
        onClick={onStart}
        disabled={isPending}
        aria-label={isPending ? 'Aguarde, preparando a expedição' : 'Começar Expedição'}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border-2 border-[#9e6212] bg-[#c98522] px-6 py-3 text-xl font-extrabold text-white shadow-[0_9px_0_#9e6212] transition hover:bg-[#b9771d] active:translate-y-[2px] active:shadow-[0_7px_0_#9e6212] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:ring-4 focus-visible:ring-[#f0c36f] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff1d8] sm:w-auto"
      >
        {isPending ? 'Preparando aventura...' : 'Começar Expedição'}
      </button>
    </motion.div>
  </motion.section>
);
