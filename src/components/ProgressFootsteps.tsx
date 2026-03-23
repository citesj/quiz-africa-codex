interface ProgressFootstepsProps {
  total: number;
  current: number;
}

export const ProgressFootsteps = ({ total, current }: ProgressFootstepsProps) => (
  <div className="flex flex-wrap gap-2" aria-label="Progresso das rodadas">
    {Array.from({ length: total }).map((_, index) => {
      const isActive = index < current;
      return (
        <span
          key={`step-${index + 1}`}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full border-2 text-sm font-bold transition ${
            isActive ? 'border-trail bg-trail text-white' : 'border-passport/30 bg-white text-passport/50'
          }`}
          aria-current={isActive ? 'step' : undefined}
        >
          👣
        </span>
      );
    })}
  </div>
);
