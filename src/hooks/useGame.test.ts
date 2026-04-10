import { act, renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TOTAL_HINTS, TOTAL_ROUNDS } from '../constants';
import { ENCOURAGEMENT_MESSAGES } from '../messages';
import { useGame } from './useGame';

describe('useGame', () => {
  it('inicia o jogo com uma rodada valida', async () => {
    const { result } = renderHook(() => useGame());

    expect(result.current.gameState.phase).toBe('welcome');
    expect(result.current.gameState.round).toBeNull();

    act(() => {
      result.current.startGame();
    });

    await waitFor(() => {
      expect(result.current.gameState.phase).toBe('quiz');
      expect(result.current.gameState.round).not.toBeNull();
    });

    const activeRound = result.current.gameState.round;
    expect(activeRound?.roundNumber).toBe(1);
    expect(activeRound?.revealedHints).toBe(1);
    expect(activeRound?.options).toHaveLength(3);
    expect(activeRound?.options.some((option) => option.id === activeRound.country.id)).toBe(true);

    const optionIds = activeRound?.options.map((option) => option.id) ?? [];
    expect(new Set(optionIds).size).toBe(optionIds.length);
  });

  it('mantem opcoes sem duplicidade e com pais correto em todas as rodadas', async () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame();
    });

    await waitFor(() => {
      expect(result.current.gameState.phase).toBe('quiz');
      expect(result.current.gameState.round).not.toBeNull();
    });

    for (let i = 0; i < TOTAL_ROUNDS; i += 1) {
      const activeRound = result.current.gameState.round;
      if (!activeRound) {
        throw new Error('Rodada ativa nao encontrada durante validacao de opcoes.');
      }

      const optionIds = activeRound.options.map((option) => option.id);
      expect(activeRound.options).toHaveLength(3);
      expect(new Set(optionIds).size).toBe(optionIds.length);
      expect(optionIds).toContain(activeRound.country.id);

      act(() => {
        result.current.selectAnswer(activeRound.country.id);
        result.current.goToNextRound();
      });
    }

    expect(result.current.gameState.phase).toBe('completed');
  });

  it('revela pistas ate o limite permitido', async () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame();
    });

    await waitFor(() => {
      expect(result.current.gameState.phase).toBe('quiz');
      expect(result.current.gameState.round).not.toBeNull();
    });

    act(() => {
      for (let i = 0; i < TOTAL_HINTS + 3; i += 1) {
        result.current.revealNextHint();
      }
    });

    expect(result.current.gameState.round?.revealedHints).toBe(TOTAL_HINTS);
  });

  it('bloqueia novas pistas apos resposta selecionada', async () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame();
    });

    await waitFor(() => {
      expect(result.current.gameState.phase).toBe('quiz');
      expect(result.current.gameState.round).not.toBeNull();
    });

    const currentRound = result.current.gameState.round;
    if (!currentRound) {
      throw new Error('Rodada ativa nao encontrada para o teste.');
    }

    act(() => {
      result.current.selectAnswer(currentRound.country.id);
    });

    const hintsAfterAnswer = result.current.gameState.round?.revealedHints;

    act(() => {
      result.current.revealNextHint();
    });

    expect(result.current.gameState.phase).toBe('discovery');
    expect(result.current.gameState.round?.revealedHints).toBe(hintsAfterAnswer);
  });

  it('avanca por todas as rodadas e conclui o jogo', async () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame();
    });

    await waitFor(() => {
      expect(result.current.gameState.phase).toBe('quiz');
      expect(result.current.gameState.round).not.toBeNull();
    });

    act(() => {
      for (let i = 0; i < TOTAL_ROUNDS; i += 1) {
        const activeRound = result.current.gameState.round;
        if (!activeRound) {
          throw new Error('Rodada ativa nao encontrada durante a progressao do teste.');
        }

        result.current.selectAnswer(activeRound.country.id);
        result.current.goToNextRound();
      }
    });

    expect(result.current.gameState.phase).toBe('completed');
    expect(result.current.gameState.round).toBeNull();
    expect(result.current.gameState.encouragementMessage).toBe(ENCOURAGEMENT_MESSAGES.final);
  });

  it('reseta o estado para fase inicial', async () => {
    const { result } = renderHook(() => useGame());

    act(() => {
      result.current.startGame();
    });

    await waitFor(() => {
      expect(result.current.gameState.phase).toBe('quiz');
    });

    act(() => {
      result.current.resetGame();
    });

    expect(result.current.gameState.phase).toBe('welcome');
    expect(result.current.gameState.currentRoundIndex).toBe(0);
    expect(result.current.gameState.round).toBeNull();
    expect(result.current.gameState.rounds).toHaveLength(TOTAL_ROUNDS);
  });
});
