import { motion } from 'framer-motion';

interface WelcomeScreenProps {
  onStart: () => void;
  isPending: boolean;
}

export const WelcomeScreen = ({ onStart, isPending }: WelcomeScreenProps) => (
  <motion.section
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.05, duration: 0.4 }}
      className="mx-auto max-w-3xl rounded-[28px] border-2 border-[#efd7a9] bg-gradient-to-b from-[#fff7e8] to-[#fff1d6] p-7 text-center shadow-[0_14px_36px_rgba(120,77,17,0.2)] sm:p-10"
    >
      <h1 className="font-title text-4xl font-extrabold leading-tight text-[#3f2b11] sm:text-5xl">Quiz Continente Africano</h1>
      <p className="mt-3 text-lg font-semibold text-[#5f4520]">Observe as pistas e escolha o país certo.</p>

      <button
        type="button"
        onClick={onStart}
        disabled={isPending}
        aria-label={isPending ? 'Aguarde, preparando a expedição' : 'Começar Expedição'}
        className="mt-8 inline-flex min-h-11 w-full items-center justify-center rounded-2xl border-2 border-[#9e6212] bg-[#c98522] px-6 py-4 text-xl font-extrabold text-white shadow-[0_9px_0_#9e6212] transition hover:bg-[#b9771d] active:translate-y-[2px] active:shadow-[0_7px_0_#9e6212] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:ring-4 focus-visible:ring-[#f0c36f] focus-visible:ring-offset-4 focus-visible:ring-offset-[#fff1d8] sm:w-auto"
      >
        {isPending ? 'Preparando aventura...' : 'Começar Expedição'}
      </button>
    </motion.div>
  </motion.section>
);
