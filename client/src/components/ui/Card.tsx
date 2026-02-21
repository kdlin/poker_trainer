/**
 * Playing Card Component
 *
 * Displays a single poker card with proper styling.
 * Shows rank and suit with appropriate colors (red for hearts/diamonds, black for clubs/spades).
 * Can also show card backs for hidden cards.
 */

import { Box, Paper } from '@mui/material';
import type { Card as CardType } from '../../types/poker';

// Props (properties) that this component accepts
interface CardProps {
  card?: CardType; // Optional: if not provided, shows card back
  size?: 'small' | 'medium' | 'large';
}

// Suit symbols for display
const SUIT_SYMBOLS: Record<string, string> = {
  h: '♥', // hearts
  d: '♦', // diamonds
  c: '♣', // clubs
  s: '♠', // spades
};

// Suit colors (red for hearts and diamonds, black for clubs and spades)
const SUIT_COLORS: Record<string, string> = {
  h: '#ef5350', // red
  d: '#ef5350', // red
  c: '#333',    // black
  s: '#333',    // black
};

// Card sizes in pixels
const CARD_SIZES = {
  small: { width: 45, height: 65, fontSize: 16 },
  medium: { width: 60, height: 85, fontSize: 20 },
  large: { width: 75, height: 105, fontSize: 24 },
};

/**
 * Card Component
 *
 * Usage:
 *   <Card card={{ rank: 'A', suit: 'h' }} size="medium" />  // Shows Ace of hearts
 *   <Card />  // Shows card back (hidden card)
 */
export function Card({ card, size = 'medium' }: CardProps) {
  const dimensions = CARD_SIZES[size];

  // If no card provided, show card back
  if (!card) {
    return (
      <Paper
        elevation={3}
        sx={{
          width: dimensions.width,
          height: dimensions.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
          borderRadius: 1,
          border: '2px solid #2a5298',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Card back pattern */}
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: dimensions.fontSize,
            color: '#fff',
            opacity: 0.3,
          }}
        >
          ♠♥♣♦
        </Box>
      </Paper>
    );
  }

  // Show face-up card with rank and suit
  const suitSymbol = SUIT_SYMBOLS[card.suit];
  const color = SUIT_COLORS[card.suit];

  return (
    <Paper
      elevation={3}
      sx={{
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: '#fff',
        borderRadius: 1,
        border: '1px solid #ddd',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: 'default',
      }}
    >
      {/* Rank and suit in center */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          color: color,
          fontWeight: 'bold',
          fontSize: dimensions.fontSize,
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <span>{card.rank}</span>
        <span style={{ fontSize: dimensions.fontSize * 1.2 }}>{suitSymbol}</span>
      </Box>

      {/* Small rank/suit in top-left corner */}
      <Box
        sx={{
          position: 'absolute',
          top: 2,
          left: 3,
          fontSize: dimensions.fontSize * 0.5,
          color: color,
          fontWeight: 'bold',
          lineHeight: 1,
        }}
      >
        {card.rank}
        <br />
        {suitSymbol}
      </Box>
    </Paper>
  );
}
