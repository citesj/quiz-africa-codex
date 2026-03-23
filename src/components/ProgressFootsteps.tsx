interface ProgressFootstepsProps {
  total: number;
  current: number;
}

export const ProgressFootsteps = ({ total, current }: ProgressFootstepsProps) => (
  <div className="flex flex-wrap gap-2" aria-label="Progresso das rodadas em carimbos de passaporte">
    {Array.from({ length: total }).map((_, index) => {
      const isActive = index < current;
      return (
        <span
          key={`step-${index + 1}`}
          className={`inline-flex h-8 w-8 rotate-[-7deg] items-center justify-center rounded-full border-2 text-sm font-black transition ${
            isActive
              ? 'border-color-stamp bg-color-stamp text-[#fff9ef]'
              : 'border-color-ink/30 bg-[#fffaf0] text-color-ink/45'
          }`}
          aria-current={isActive ? 'step' : undefined}
          aria-label={`Rodada ${index + 1} ${isActive ? 'concluída' : 'pendente'}`}
        >
          ✧
        </span>
      );
    })}
  </div>
);
