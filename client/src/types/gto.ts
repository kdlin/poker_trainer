/**
 * GTO Solution Types
 *
 * Defines the structure for GTO (Game Theory Optimal) poker solutions.
 * These solutions tell us the optimal frequency and EV for each action
 * in a given poker spot.
 */

import type { ActionType, CardString, Position, Street } from './poker';

/**
 * A single action option with its GTO frequency and expected value
 */
export interface GTOAction {
  action: ActionType;
  size?: number; // Bet/raise size as fraction of pot (e.g., 0.33 for 33% pot)
  frequency: number; // How often to take this action (0-1)
  ev: number; // Expected value in big blinds
}

/**
 * Complete GTO solution for a specific spot
 */
export interface GTOSolution {
  // Scenario identification
  id: string;
  street: Street;
  position: Position; // Hero's position
  villainPosition: Position;
  board: CardString[]; // Board cards
  pot: number; // Pot size in BB
  stackDepth: number; // Effective stack in BB

  // Hero's hand (what cards trigger this solution)
  heroHand?: CardString[]; // Optional: specific hand, or use hand classes
  handClass?: 'top-pair' | 'second-pair' | 'draw' | 'air' | 'nuts'; // Simplified hand categories

  // Action history to reach this spot
  actionHistory: string[]; // e.g., ["UTG raises 2.5bb", "BTN calls"]

  // GTO solution: array of possible actions with frequencies
  actions: GTOAction[];

  // Additional info
  description?: string; // Human-readable description of the spot
}

/**
 * Helper function to find the best action in a GTO solution
 */
export function getBestAction(solution: GTOSolution): GTOAction {
  return solution.actions.reduce((best, current) =>
    current.ev > best.ev ? current : best
  );
}

/**
 * Helper function to check if an action is a blunder
 * A blunder is defined as an action that's >2bb worse than the best action
 */
export function isBlunder(solution: GTOSolution, action: GTOAction): boolean {
  const bestAction = getBestAction(solution);
  return bestAction.ev - action.ev > 2.0;
}

/**
 * Find matching action in solution
 */
export function findAction(
  solution: GTOSolution,
  actionType: ActionType,
  size?: number
): GTOAction | undefined {
  return solution.actions.find(a => {
    if (a.action !== actionType) return false;
    if (size && a.size) {
      // Allow some tolerance for size matching (within 10%)
      return Math.abs(a.size - size) < 0.1;
    }
    return true;
  });
}
