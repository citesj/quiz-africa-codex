import { motion } from 'framer-motion';
import imageCredits from '../data/imageCredits.json';

interface ImageCreditsScreenProps {
  onBack: () => void;
}

export const ImageCreditsScreen = ({ onBack }: ImageCreditsScreenProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-5 rounded-3xl border border-color-ink/20 bg-[#fcf7ea] p-6 shadow-passport"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-title text-2xl font-extrabold text-color-ink md:text-3xl">Créditos de imagens</h2>
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-color-ink/30 px-3 py-2 text-sm font-semibold text-color-ink transition hover:bg-color-ink/5"
        >
          Voltar
        </button>
      </div>

      <p className="text-sm text-color-ink/75">
        Lista centralizada de créditos das imagens usadas no quiz, sem repetir atribuições dentro dos cards de descoberta.
      </p>

      <ul className="max-h-[60vh] space-y-3 overflow-auto rounded-2xl border border-color-ink/15 bg-color-paper/70 p-4">
        {imageCredits.map((credit) => (
          <li key={`${credit.countryId}:${credit.field}`} className="border-b border-color-ink/10 pb-3 last:border-b-0 last:pb-0">
            <p className="font-semibold text-color-ink">{credit.countryId}:{credit.field}</p>
            <p className="text-sm text-color-ink/80">País: {credit.countryId}</p>
            <p className="text-sm text-color-ink/80">Título: {credit.title}</p>
            <p className="text-sm text-color-ink/80">Autor: {credit.author}</p>
            <p className="text-sm text-color-ink/80">
              Fonte:{' '}
              <a href={credit.sourcePageUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                {credit.sourcePageUrl}
              </a>
            </p>
            <p className="text-sm text-color-ink/80">
              Licença: {credit.license} ({' '}
              <a href={credit.licenseUrl} target="_blank" rel="noreferrer" className="underline underline-offset-2">
                link
              </a>{' '}
              )
            </p>
            <p className="text-sm text-color-ink/80">Atribuição: {credit.attributionText}</p>
            <p className="text-xs text-color-ink/60">Última atualização do arquivo: {credit.lastModified}</p>
          </li>
        ))}
      </ul>
    </motion.section>
  );
};
