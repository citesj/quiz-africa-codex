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
    className="rounded-3xl bg-white/95 p-8 shadow-passport"
  >
    <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-passport">Passaporte de Aventuras</p>
    <h1 className="mb-4 text-4xl font-black text-passport">Quiz Investigativo da África</h1>
    <p className={`mb-6 text-slate-700 ${BODY_TEXT_MIN_SIZE_CLASS}`}>
      Você vai descobrir 10 países africanos com pistas progressivas. Sem pontuação, só descobertas incríveis!
    </p>
    <button
      type="button"
      onClick={onStart}
      disabled={isPending}
      className="rounded-2xl bg-trail px-6 py-3 text-xl font-bold text-white transition hover:bg-emerald-700 active:scale-95 disabled:opacity-70"
    >
      {isPending ? 'Preparando aventura...' : 'Começar Expedição'}
    </button>
  </motion.section>
);
