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
    <p className={`mb-4 text-color-ink ${BODY_TEXT_MIN_SIZE_CLASS}`}>
      Pronto para uma missão? Você vai investigar 10 países da África, com pistas curtas e desafios rápidos.
    </p>

    <ul className="mb-6 grid gap-2 text-base font-semibold text-color-ink/90 sm:grid-cols-3" aria-label="Como funciona a expedição">
      <li className="rounded-xl border border-color-ink/15 bg-white/60 px-3 py-2">1) Leia a pista</li>
      <li className="rounded-xl border border-color-ink/15 bg-white/60 px-3 py-2">2) Escolha uma resposta</li>
      <li className="rounded-xl border border-color-ink/15 bg-white/60 px-3 py-2">3) Ganhe um carimbo</li>
    </ul>

    <motion.div
      role="status"
      aria-live="polite"
      initial={false}
      animate={{
        backgroundColor: isPending ? 'rgba(163, 119, 61, 0.14)' : 'rgba(106, 124, 64, 0.12)',
      }}
      className="mb-5 flex min-h-11 items-center gap-2 rounded-xl border border-color-ink/20 px-4 py-2 text-base font-bold text-color-ink"
    >
      <span aria-hidden="true" className="text-lg">
        {isPending ? '🧭' : '✅'}
      </span>
      <span>{isPending ? 'Preparando aventura...' : 'Tudo pronto para começar!'}</span>
      {isPending && (
        <span className="ml-1 inline-flex items-center gap-1" aria-hidden="true">
          {[0, 1, 2].map((dot) => (
            <motion.span
              // eslint-disable-next-line react/no-array-index-key
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-color-stamp"
              animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
              transition={{ duration: 1, repeat: Infinity, delay: dot * 0.15, ease: 'easeInOut' }}
            />
          ))}
        </span>
      )}
    </motion.div>

    <button
      type="button"
      onClick={onStart}
      disabled={isPending}
      aria-label={isPending ? 'Aguarde, a expedição está sendo preparada' : 'Começar a expedição agora'}
      className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border-2 border-color-olive bg-color-olive px-6 py-3 text-xl font-bold text-white shadow-sm transition hover:bg-[#4f5a31] active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 focus-visible:ring-4 focus-visible:ring-color-ochre focus-visible:ring-offset-4 focus-visible:ring-offset-color-paper sm:w-auto"
    >
      {isPending ? 'Preparando aventura...' : 'Começar Expedição'}
    </button>
  </motion.section>
);
