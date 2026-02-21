/**
 * Sample GTO Solutions Database
 *
 * This file contains pre-computed GTO solutions for common poker spots.
 * In a production app, this would be:
 * 1. A much larger database (thousands of scenarios)
 * 2. Stored in a backend database (MongoDB)
 * 3. Generated using a poker solver (TexasSolver)
 *
 * For our MVP, we're starting with ~10 hand-crafted scenarios
 * based on typical GTO Wizard solutions.
 */

import type { GTOSolution } from '../types/gto';

/**
 * Sample GTO Solutions
 *
 * These are realistic approximations based on GTO solver outputs.
 * Frequencies and EVs are simplified but strategically sound.
 */
export const gtoSolutions: GTOSolution[] = [
  // Scenario 1: BTN vs CO, A-high flop with top pair
  {
    id: 'flop-btn-vs-co-ahigh-toppair',
    street: 'flop',
    position: 'BTN',
    villainPosition: 'CO',
    board: ['Ah', 'Kd', '7s'],
    pot: 7.5,
    stackDepth: 100,
    handClass: 'top-pair',
    actionHistory: ['CO raises 2.5bb preflop', 'BTN calls', 'Flop: A♥K♦7♠', 'CO checks'],
    description: 'BTN with top pair on A-high board after CO checks',
    actions: [
      {
        action: 'check',
        frequency: 0.55,
        ev: 11.3,
      },
      {
        action: 'bet',
        size: 0.33, // 33% pot
        frequency: 0.35,
        ev: 12.1, // Best action
      },
      {
        action: 'bet',
        size: 0.66, // 66% pot
        frequency: 0.10,
        ev: 11.5,
      },
    ],
  },

  // Scenario 2: Turn after betting flop
  {
    id: 'turn-btn-vs-co-ahigh-toppair-afterbet',
    street: 'turn',
    position: 'BTN',
    villainPosition: 'CO',
    board: ['Ah', 'Kd', '7s', '3c'],
    pot: 10.0,
    stackDepth: 95,
    handClass: 'top-pair',
    actionHistory: [
      'CO raises 2.5bb preflop',
      'BTN calls',
      'Flop: A♥K♦7♠',
      'CO checks',
      'BTN bets 2.5bb (33% pot)',
      'CO calls',
      'Turn: 3♣',
      'CO checks',
    ],
    description: 'BTN with top pair on turn after flop c-bet, facing check',
    actions: [
      {
        action: 'check',
        frequency: 0.70,
        ev: 15.2, // Best - pot control with medium strength
      },
      {
        action: 'bet',
        size: 0.50,
        frequency: 0.20,
        ev: 14.5,
      },
      {
        action: 'bet',
        size: 0.75,
        frequency: 0.10,
        ev: 13.1, // Overbet with marginal hand is risky
      },
    ],
  },

  // Scenario 3: River decision
  {
    id: 'river-btn-vs-co-ahigh-toppair',
    street: 'river',
    position: 'BTN',
    villainPosition: 'CO',
    board: ['Ah', 'Kd', '7s', '3c', '9h'],
    pot: 10.0,
    stackDepth: 95,
    handClass: 'top-pair',
    actionHistory: [
      'Flop: BTN bet 33% pot, CO called',
      'Turn: Both checked',
      'River: 9♥',
      'CO checks',
    ],
    description: 'River decision with top pair after turn check-back',
    actions: [
      {
        action: 'check',
        frequency: 0.80,
        ev: 15.5, // Best - showdown value, avoid getting raised
      },
      {
        action: 'bet',
        size: 0.33,
        frequency: 0.15,
        ev: 14.8,
      },
      {
        action: 'bet',
        size: 0.50,
        frequency: 0.05,
        ev: 13.5,
      },
    ],
  },

  // Scenario 4: Facing a bet on flop with top pair
  {
    id: 'flop-btn-vs-co-ahigh-toppair-facingbet',
    street: 'flop',
    position: 'BTN',
    villainPosition: 'CO',
    board: ['Ah', 'Kd', '7s'],
    pot: 10.0,
    stackDepth: 97.5,
    handClass: 'top-pair',
    actionHistory: [
      'CO raises 2.5bb preflop',
      'BTN calls',
      'Flop: A♥K♦7♠',
      'CO bets 2.5bb (33% pot)',
    ],
    description: 'BTN facing flop bet with top pair',
    actions: [
      {
        action: 'fold',
        frequency: 0.0,
        ev: -2.5, // Terrible - folding top pair
      },
      {
        action: 'call',
        frequency: 0.75,
        ev: 10.5, // Best - keep pot small with medium strength
      },
      {
        action: 'raise',
        size: 0.66, // Raise to 2x their bet
        frequency: 0.25,
        ev: 9.8,
      },
    ],
  },

  // Scenario 5: Dry flop with weak hand
  {
    id: 'flop-btn-vs-co-drytexture-weak',
    street: 'flop',
    position: 'BTN',
    villainPosition: 'CO',
    board: ['Ks', '7h', '2c'],
    pot: 7.5,
    stackDepth: 100,
    handClass: 'air',
    actionHistory: ['CO raises preflop', 'BTN calls', 'Flop: K♠7♥2♣', 'CO checks'],
    description: 'Dry K-high flop, missed completely, facing check',
    actions: [
      {
        action: 'check',
        frequency: 0.60,
        ev: 0.0, // Best - give up cheaply
      },
      {
        action: 'bet',
        size: 0.33,
        frequency: 0.30,
        ev: -0.5, // Small bluff
      },
      {
        action: 'bet',
        size: 0.75,
        frequency: 0.10,
        ev: -1.2, // Overbluffing
      },
    ],
  },

  // Scenario 6: Wet flop with flush draw
  {
    id: 'flop-btn-vs-co-wetdraw',
    street: 'flop',
    position: 'BTN',
    villainPosition: 'CO',
    board: ['Qh', 'Jh', '7h'],
    pot: 7.5,
    stackDepth: 100,
    handClass: 'draw',
    actionHistory: ['CO raises preflop', 'BTN calls', 'Flop: Q♥J♥7♥', 'CO bets 5bb (66% pot)'],
    description: 'Facing bet on wet board with flush draw',
    actions: [
      {
        action: 'fold',
        frequency: 0.0,
        ev: -2.5,
      },
      {
        action: 'call',
        frequency: 0.85,
        ev: 8.5, // Best - good pot odds with draw
      },
      {
        action: 'raise',
        size: 1.0, // Pot-sized raise
        frequency: 0.15,
        ev: 7.8, // Semi-bluff raise
      },
    ],
  },
];

/**
 * Find a GTO solution matching the current game state
 * This is a simplified lookup - in production, we'd use more sophisticated matching
 */
export function findGTOSolution(
  street: string,
  board: string[],
  handClass?: string
): GTOSolution | null {
  // Simple matching for demo
  // In production, this would normalize board textures and use database queries
  const solution = gtoSolutions.find(s =>
    s.street === street &&
    s.board.length === board.length &&
    (!handClass || s.handClass === handClass)
  );

  return solution || null;
}
