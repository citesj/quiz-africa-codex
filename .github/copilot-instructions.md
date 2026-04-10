# Project Guidelines

## Build And Test

- Sempre que houver alteracao de codigo, execute `npm run test:run` antes de finalizar a resposta.
- Se houver alteracao estrutural de tipagem ou configuracao TypeScript/Vite, execute tambem `npm run lint`.
- Nao conclua uma tarefa com testes falhando sem informar claramente os erros restantes e o impacto.

## Testing Flow

- Priorize testes em `src/**/*.test.ts` e `src/**/*.test.tsx`.
- Ao criar nova feature, atualize ou adicione testes para cobrir comportamento principal e casos de borda.
- Evite assertions frageis baseadas em detalhes visuais nao essenciais.

