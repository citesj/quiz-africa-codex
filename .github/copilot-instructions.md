# Project Guidelines

## Architecture

- Aplicacao SPA em React + TypeScript com fluxo por fases (`welcome` -> `quiz` -> `discovery` -> `completed`) orquestrado em `src/App.tsx`.
- Centralize regra de negocio no hook `src/hooks/useGame.ts`; componentes de tela devem focar em renderizacao e interacao local.
- Dados de paises ficam em `src/data/countryData.json` com validacao em `src/data/data.ts`; preserve contratos de tipos em `src/types.ts`.
- Pipeline de imagens depende de `import.meta.glob` em `src/utils/countryImages.ts` e convencao de nomes por pasta/arquivo em `public/images/countries`.

## Build And Test

- `npm run dev`: desenvolvimento local com Vite.
- `npm run build`: typecheck (`tsc -b`) + build de producao.
- `npm run preview`: validar build localmente.
- Sempre que houver alteracao de codigo, execute `npm run test:run` antes de finalizar a resposta.
- Se houver alteracao estrutural de tipagem ou configuracao TypeScript/Vite, execute tambem `npm run lint`.
- Nao conclua uma tarefa com testes falhando sem informar claramente os erros restantes e o impacto.

## Testing Flow

- Priorize testes em `src/**/*.test.ts` e `src/**/*.test.tsx`.
- Ao criar nova feature, atualize ou adicione testes para cobrir comportamento principal e casos de borda.
- Evite assertions frageis baseadas em detalhes visuais nao essenciais.

## Conventions

- Siga padrao de testes atual: mocks fortes para animacoes/UI quando o objetivo for validar fluxo de estado.
- Nao remova o setup de testes em `src/test/setup.ts` (polyfill de `matchMedia` necessario para ambiente jsdom).
- Ao adicionar imagens, mantenha convencao `{country-id}/{country-id}-{kind}.{ext}`; quando houver mudanca de assets, valide build/dev para garantir que o `import.meta.glob` capturou os novos arquivos.
- Para detalhes de arquitetura e SDD, referencie:
  - `docs/BASELINE-FRONTEND-SDD.md`
  - `docs/SDD-PROMPT-GUIDE.md`

