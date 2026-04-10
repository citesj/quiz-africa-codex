# Documento de Baseline Frontend (Engenharia Reversa)

## 1. Visao Geral da UI e Arquitetura

### Proposito da aplicacao

A aplicacao e um quiz educativo sobre paises do continente africano. O usuario recebe pistas visuais e textuais, seleciona uma resposta entre opcoes, recebe feedback imediato e avanca por rodadas ate concluir a expedicao.

### Stack principal

- Framework: React 19 + TypeScript.
- Build tool: Vite 6.
- Estilizacao: Tailwind CSS 3 com tokens customizados no tema.
- Animacoes: Framer Motion.
- Estado: hook customizado local (useGame) + estado local de componentes.
- Roteamento: nao ha React Router; navegacao interna orientada por fase de jogo.
- Fonte de dados: arquivos locais JSON em tempo de build.

## 2. Arvore de Componentes e Responsabilidades

### Hierarquia principal

```text
main.tsx
  -> App
    -> WelcomeScreen (fase welcome)
    -> QuizScreen (fase quiz)
    -> DiscoveryScreen (fase discovery)
    -> Completed block (renderizado no proprio App, fase completed)
```

### Classificacao Smart vs Dumb

- Smart (estado/logica de negocio):
  - App: orquestra fases de tela e transicoes da experiencia principal.
  - useGame (hook): motor do jogo (rodadas, validacao de resposta, progresso, reset, mensagens).
  - QuizScreen: estado local de interacao (selecionado, fase de tensao/resolucao, zoom), controle de temporizadores e heuristica para textos de apoio.
  - DiscoveryScreen: side effects de foco e sintese de voz, alem da composicao do feedback.
- Dumb/Presentacionais (foco em render via props):
  - WelcomeScreen: tela inicial com CTA de inicio.

Observacao: DiscoveryScreen e QuizScreen possuem mistura de apresentacao com comportamento; apesar de renderizarem UI, concentram logica relevante.

## 3. Gerenciamento de Estado e Contratos (Types/Interfaces)

### Como o estado e gerenciado

- Nucleo de estado do jogo em useGame:
  - gameState: estado agregado da sessao de jogo.
  - isPending: derivado de useTransition para suavizar transicao de inicio.
  - Acoes expostas: startGame, revealNextHint, selectAnswer, goToNextRound, resetGame.
- Estado local de QuizScreen:
  - selectedId, zoomedImage, interactionPhase.
  - Controle de setTimeout com cleanup em useEffect.
- Estado local de DiscoveryScreen:
  - Sem estado de dominio; usa refs e side effects para acessibilidade e voz.

### Modelos de dominio (types fundamentais)

- CountryImageKind: tipos de imagem suportados por pista.
- CountryImages: mapa opcional de URLs de imagem por categoria.
- Country: entidade principal do quiz (id, metadados, hints, imagens opcionais).
- GamePhase: uniao literal de fases (welcome, quiz, discovery, completed).
- RoundState: snapshot da rodada atual (pais correto, opcoes, pista aberta, resposta).
- GameState: estado agregado do jogo (fase atual, rodadas, indice, rodada ativa, mensagem).

### Contratos de props dos principais componentes

- WelcomeScreenProps:
  - onStart: callback para iniciar jogo.
  - isPending: bloqueia CTA durante transicao.
- QuizScreenProps:
  - round: estado da rodada atual.
  - onRevealHint: callback para liberar proxima pista.
  - onSelectAnswer: callback para confirmar resposta.
- DiscoveryScreenProps:
  - round: rodada respondida.
  - encouragementMessage: feedback textual da rodada.
  - onNext: callback para avancar.
  - isLastRound: altera rotulo/fluxo de encerramento.

## 4. Roteamento e Fluxo de Navegacao

### Rotas/paginas existentes

Nao existem rotas URL. A aplicacao e uma SPA de tela unica com renderizacao condicional por estado.

### Fluxo de navegacao efetivo

- welcome -> quiz -> discovery -> quiz (proxima rodada) ... -> completed.
- O fluxo e dirigido por gameState.phase e gameState.currentRoundIndex.

### Regras de acesso implicitas

- Quiz exige round ativo em memoria.
- Discovery exige round respondida (phase = discovery).
- Completed e terminal para a sessao atual; resetGame retorna a welcome.
- Nao ha controle de acesso por autenticacao, guardas de rota ou redirecionamento por URL.

## 5. Integracoes e Efeitos Colaterais (Side Effects)

### Consumo de dados

- Dados de paises via import estatico de JSON local (countryData.json) com validacao runtime em data.ts.
- Assets de imagem resolvidos por convencao de nomes com import.meta.glob (eager) em countryImages.ts.

### APIs externas e persistencia

- Nao ha fetch/axios no runtime da aplicacao.
- Nao ha localStorage/sessionStorage/indexedDB.
- Nao ha React Query, SWR ou cache de servidor.

### Side effects mapeados

- QuizScreen:
  - setTimeout para encadear animacao de confirmacao e revelacao de resultado.
  - cleanup de timers em useEffect para evitar vazamento apos unmount/troca de rodada.
- DiscoveryScreen:
  - focus programatico em feedback para acessibilidade (aria-live + focus ref).
  - uso da Web Speech API (speechSynthesis) para leitura em voz alta, com cancelamento no unmount.

## 6. Debitos Tecnicos ou Lacunas

- Acoplamento alto em QuizScreen: componente concentra regras de interacao, estados temporais, heuristicas semanticas de pista e renderizacao extensa; candidato forte para fatiamento por hooks/subcomponentes.
- Maquina de estados implicita: transicoes de fase estao espalhadas em condicionais e callbacks; um reducer/estado finito explicito reduziria risco de regressao.
- Regra de pistas pode gerar ambiguidade semantica: Country.hints possui 4 textos, enquanto TOTAL_HINTS define 6 pistas visuais no quiz.
- Validacoes de dados focadas em shape, sem validacoes de consistencia cruzada (ex.: duplicidade de id, cobertura minima de imagens por pais, cardinalidade de opcoes por rodada).
- Persistencia ausente: sessao e progresso se perdem em refresh/navegacao.
- Ausencia de testes automatizados do fluxo React principal (fases, transicoes, selecao de resposta, estados de borda).

