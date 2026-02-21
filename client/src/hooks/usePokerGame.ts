/**
 * usePokerGame Hook
 *
 * Custom React hook that manages the entire poker game state.
 * This handles:
 * - Current hand state (street, pot, board, players)
 * - Decision tracking
 * - Hand progression (preflop → flop → turn → river)
 * - GTO solution matching
 *
 * React Hooks are functions that let you "hook into" React state and lifecycle.
 * Custom hooks let us reuse stateful logic between components.
 */

import { useState } from 'react';
import type { GameState, Card, PlayerAction, ActionType, Street, Position } from '../types/poker';
import { parseCard } from '../types/poker';

// Decision with GTO comparison data
export interface Decision {
  street: Street;
  action: ActionType;
  amount?: number;
  gtoFrequency: number; // How often GTO plays this action (0-1)
  gtoEV: number; // Expected value of this action
  bestAction: ActionType;
  bestActionFreq: number;
  isBlunder: boolean; // True if significantly suboptimal
}

// Hook return type
interface UsePokerGameReturn {
  gameState: GameState;
  decisions: Decision[];
  isHandComplete: boolean;
  makeAction: (action: ActionType, amount?: number) => void;
  startNewHand: () => void;
}

/**
 * usePokerGame Hook
 *
 * Usage:
 *   const { gameState, decisions, makeAction, startNewHand } = usePokerGame();
 */
export function usePokerGame(): UsePokerGameReturn {
  // Track all decisions made in this hand
  const [decisions, setDecisions] = useState<Decision[]>([]);

  // Track if hand is complete (reached showdown or someone folded)
  const [isHandComplete, setIsHandComplete] = useState(false);

  // Initialize game state with a sample hand
  const [gameState, setGameState] = useState<GameState>(() => createInitialGameState());

  /**
   * Handle player action and progress the hand
   */
  const makeAction = (action: ActionType, amount?: number) => {
    if (isHandComplete) return;

    // Get GTO analysis for this decision
    const gtoAnalysis = analyzeDecision(gameState, action, amount);

    // Record the decision
    const newDecision: Decision = {
      street: gameState.street,
      action,
      amount,
      ...gtoAnalysis,
    };
    setDecisions([...decisions, newDecision]);

    // Update game state
    const newGameState = processAction(gameState, action, amount);

    // Check if hand is over
    if (action === 'fold' || newGameState.street === 'river') {
      setIsHandComplete(true);
    }

    setGameState(newGameState);
  };

  /**
   * Start a new hand
   */
  const startNewHand = () => {
    setGameState(createInitialGameState());
    setDecisions([]);
    setIsHandComplete(false);
  };

  return {
    gameState,
    decisions,
    isHandComplete,
    makeAction,
    startNewHand,
  };
}

/**
 * Create initial game state for a new hand
 * For now, we'll use a predefined scenario
 */
function createInitialGameState(): GameState {
  return {
    street: 'flop',
    pot: 7.5,
    board: [
      parseCard('Ah'),
      parseCard('Kd'),
      parseCard('7s'),
    ],
    players: [
      {
        position: 'CO',
        stack: 100,
        isHero: false,
      },
      {
        position: 'BTN',
        stack: 97.5,
        cards: [parseCard('As'), parseCard('Qs')],
        isHero: true,
      },
    ],
    actionHistory: [],
    currentPlayer: 'BTN',
  };
}

/**
 * Process an action and return updated game state
 */
function processAction(state: GameState, action: ActionType, amount?: number): GameState {
  const newState = { ...state };

  // Add action to history
  newState.actionHistory = [
    ...state.actionHistory,
    { type: action, amount, street: state.street },
  ];

  // Update pot if betting/calling
  if (action === 'bet' || action === 'raise') {
    const betAmount = amount ? amount * state.pot : 0;
    newState.pot += betAmount;
  } else if (action === 'call' && amount) {
    newState.pot += amount;
  }

  // Progress to next street if action closes the street
  // Simplified: assume villain acts optimally and we move to next street
  if (action !== 'fold') {
    newState.street = getNextStreet(state.street);

    // Add community cards for next street
    if (newState.street === 'turn') {
      newState.board = [...state.board, parseCard('3c')];
    } else if (newState.street === 'river') {
      newState.board = [...state.board, parseCard('9h')];
    }
  }

  return newState;
}

/**
 * Get next street
 */
function getNextStreet(current: Street): Street {
  const streetOrder: Street[] = ['preflop', 'flop', 'turn', 'river'];
  const currentIndex = streetOrder.indexOf(current);
  return currentIndex < streetOrder.length - 1
    ? streetOrder[currentIndex + 1]
    : current;
}

/**
 * Analyze a decision against GTO
 * This is placeholder logic - we'll replace with real GTO solutions later
 */
function analyzeDecision(
  state: GameState,
  action: ActionType,
  amount?: number
): {
  gtoFrequency: number;
  gtoEV: number;
  bestAction: ActionType;
  bestActionFreq: number;
  isBlunder: boolean;
} {
  // Placeholder GTO analysis
  // In a real implementation, this would look up the GTO solution
  // from our database based on board texture, position, stack depth, etc.

  // For demo purposes, let's say on this A♥K♦7♠ flop with A♠Q♠:
  // - Check: 60% frequency, EV: 11.3bb
  // - Bet 33%: 40% frequency, EV: 12.1bb (best)
  // - Bet 50%: 15% frequency, EV: 11.8bb
  // - Fold: 0% frequency, EV: -2.5bb (terrible)

  const gtoSolution = {
    check: { freq: 0.60, ev: 11.3 },
    bet: { freq: 0.40, ev: 12.1 },
    fold: { freq: 0.0, ev: -2.5 },
    call: { freq: 0.35, ev: 10.5 },
    raise: { freq: 0.20, ev: 11.0 },
  };

  const actionData = gtoSolution[action] || { freq: 0.0, ev: 0 };
  const bestAction = 'bet' as ActionType;
  const bestActionData = gtoSolution[bestAction];

  // A blunder is when your EV is >2bb worse than the best action
  const isBlunder = bestActionData.ev - actionData.ev > 2.0;

  return {
    gtoFrequency: actionData.freq,
    gtoEV: actionData.ev,
    bestAction,
    bestActionFreq: bestActionData.freq,
    isBlunder,
  };
}
