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
    transition={{ duration: 0.6 }}
    className="relative overflow-hidden rounded-3xl border border-color-ink/20 bg-[#fcf7ea] p-8 shadow-passport"
  >
    <span
      aria-hidden="true"
      className="absolute left-12 top-0 h-8 w-24 -translate-y-2 rotate-2 rounded-sm bg-color-ochre/45 shadow-sm"
    />
    <p className="mb-2 font-title text-sm font-bold uppercase tracking-[0.2em] text-color-stamp">Passaporte de Aventuras</p>
    <h1 className="mb-4 font-title text-4xl font-extrabold text-color-ink">Quiz Investigativo da África</h1>
    <p className={`mb-6 text-color-ink/90 ${BODY_TEXT_MIN_SIZE_CLASS}`}>
      Você vai descobrir 10 países africanos com pistas progressivas. Um diário, uma página por vez, apenas com a ação principal de cada etapa.
    </p>
    <button
      type="button"
      onClick={onStart}
      disabled={isPending}
      className="rounded-2xl border-2 border-color-olive bg-color-olive px-6 py-3 text-xl font-bold text-white transition hover:bg-[#4f5a31] active:scale-95 disabled:opacity-70 focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper"
    >
      {isPending ? 'Preparando aventura...' : 'Começar Expedição'}
    </button>
  </motion.section>
);
