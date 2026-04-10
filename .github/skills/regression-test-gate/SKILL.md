---
name: regression-test-gate
description: "Executa e valida testes de regressao com Vitest. Use quando pedir para validar alteracoes, rodar testes apos editar codigo, ou checar estabilidade antes de finalizar uma entrega."
argument-hint: "Escopo opcional, por exemplo: app, hooks, data, all"
---

# Regression Test Gate

## Quando usar

- Sempre que houver alteracao em codigo de aplicacao.
- Antes de finalizar uma tarefa com implementacao.
- Quando o usuario pedir validacao rapida de regressao.

## Procedimento

1. Rode `npm run test:run`.
2. Se houver alteracoes de configuracao ou tipagem, rode `npm run lint`.
3. Se falhar, corrija os problemas e rode novamente os comandos.
4. So finalize com status verde ou com bloqueios explicitados.

## Resultado esperado

- Suite de testes executada com sucesso.
- Relatorio curto com total de arquivos/testes e eventuais riscos remanescentes.

