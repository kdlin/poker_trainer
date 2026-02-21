/**
 * TypeScript Types for Poker Entities
 *
 * These types help us catch errors at compile time and provide
 * autocomplete in VS Code. TypeScript will ensure we only use
 * valid suits, ranks, and card combinations.
 */

// Suits in poker (4 suits in a standard deck)
export type Suit = 'h' | 'd' | 'c' | 's'; // hearts, diamonds, clubs, spades

// Card ranks from 2 to Ace
export type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';

// A playing card has a rank and a suit
export interface Card {
  rank: Rank;
  suit: Suit;
}

// Streets in a poker hand
export type Street = 'preflop' | 'flop' | 'turn' | 'river';

// Possible player positions in 6-max poker
export type Position = 'UTG' | 'HJ' | 'CO' | 'BTN' | 'SB' | 'BB';

// Actions a player can take
export type ActionType = 'fold' | 'check' | 'call' | 'bet' | 'raise';

// An action in the hand with amount (in big blinds)
export interface PlayerAction {
  type: ActionType;
  amount?: number; // Optional: fold/check don't have amounts
  street: Street;
}

// Player information
export interface Player {
  position: Position;
  stack: number; // Stack size in big blinds
  cards?: Card[]; // Hero's cards are visible, villain's are hidden
  isHero: boolean; // Is this the player we're training?
}

// Game state representing current hand
export interface GameState {
  street: Street;
  pot: number; // Total pot in big blinds
  board: Card[]; // Community cards (empty preflop, 3 on flop, 4 on turn, 5 on river)
  players: Player[];
  actionHistory: PlayerAction[];
  currentPlayer: Position; // Whose turn is it?
}

// Helper type for card representation as string (e.g., "Ah" = Ace of hearts)
export type CardString = `${Rank}${Suit}`;

/**
 * Helper function to parse a card string like "Ah" into a Card object
 */
export function parseCard(cardStr: CardString): Card {
  return {
    rank: cardStr[0] as Rank,
    suit: cardStr[1] as Suit,
  };
}

/**
 * Helper function to convert a Card object to string like "Ah"
 */
export function cardToString(card: Card): CardString {
  return `${card.rank}${card.suit}`;
}
