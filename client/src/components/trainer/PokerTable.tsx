/**
 * Poker Table Component
 *
 * Displays the poker table including:
 * - Community cards (board)
 * - Pot size
 * - Player positions
 * - Player cards and stacks
 *
 * This is the main visual component for the training interface.
 */

import { Box, Typography, Stack, Paper } from '@mui/material';
import { Card } from '../ui/Card';
import type { Card as CardType, Player } from '../../types/poker';

interface PokerTableProps {
  board: CardType[]; // Community cards
  pot: number; // Pot size in big blinds
  players: Player[]; // All players at the table
}

/**
 * PokerTable Component
 *
 * The green felt poker table where all the action happens!
 */
export function PokerTable({ board, pot, players }: PokerTableProps) {
  // Find hero (the player we're training)
  const hero = players.find((p) => p.isHero);
  // Find villain (opponent)
  const villain = players.find((p) => !p.isHero);

  return (
    <Paper
      elevation={5}
      sx={{
        background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #1b5e20 100%)',
        borderRadius: 3,
        padding: 4,
        minHeight: 500,
        position: 'relative',
        border: '8px solid #1565c0',
      }}
    >
      {/* Villain Position (Top) */}
      {villain && (
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#fff', mb: 1, display: 'block' }}>
            {villain.position} (Villain)
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            {/* Show card backs for villain (cards are hidden) */}
            <Card />
            <Card />
          </Stack>
          <Typography variant="body2" sx={{ color: '#ffeb3b', mt: 1, fontWeight: 'bold' }}>
            Stack: {villain.stack}bb
          </Typography>
        </Box>
      )}

      {/* Board Cards (Center) */}
      <Box
        sx={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
          Board
        </Typography>
        <Stack direction="row" spacing={1} justifyContent="center">
          {board.length === 0 ? (
            // Preflop - no board cards yet
            <Typography variant="body2" sx={{ color: '#aaa', fontStyle: 'italic' }}>
              Preflop - waiting for flop...
            </Typography>
          ) : (
            // Show board cards
            board.map((card, index) => <Card key={index} card={card} size="large" />)
          )}
        </Stack>
      </Box>

      {/* Pot Display */}
      <Box
        sx={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '8px 16px',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: '#ffeb3b', fontWeight: 'bold' }}>
          Pot: {pot}bb
        </Typography>
      </Box>

      {/* Hero Position (Bottom) */}
      {hero && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#fff', mb: 1, display: 'block' }}>
            {hero.position} (You)
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            {/* Show hero's actual cards */}
            {hero.cards && hero.cards.length === 2 ? (
              <>
                <Card card={hero.cards[0]} size="large" />
                <Card card={hero.cards[1]} size="large" />
              </>
            ) : (
              <>
                <Card />
                <Card />
              </>
            )}
          </Stack>
          <Typography variant="body2" sx={{ color: '#4caf50', mt: 1, fontWeight: 'bold' }}>
            Stack: {hero.stack}bb
          </Typography>
        </Box>
      )}
    </Paper>
  );
}
