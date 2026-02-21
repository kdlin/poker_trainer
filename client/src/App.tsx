/**
 * GTO Poker Trainer - Main Application
 *
 * This is the root component of our poker training application.
 * We're using Material UI (MUI) for professional-looking components.
 *
 * Current features:
 * - Poker table display with cards
 * - Action buttons for player decisions
 * - Sample hand to demonstrate UI
 */

import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography } from '@mui/material';
import { PokerTable } from './components/trainer/PokerTable';
import { ActionButtons } from './components/trainer/ActionButtons';
import type { Player, ActionType } from './types/poker';
import { parseCard } from './types/poker';

// Create a dark theme similar to GTO Wizard
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4caf50', // Green for poker tables
    },
    secondary: {
      main: '#2196f3', // Blue accent
    },
    background: {
      default: '#0a0e1a',
      paper: '#1a1f2e',
    },
  },
});

function App() {
  // Demo game state (we'll make this dynamic later)
  // This represents a flop situation: BTN vs CO, flop is A♥ K♦ 7♠
  const [pot] = useState(7.5); // Pot size in big blinds
  const [board] = useState([
    parseCard('Ah'), // Ace of hearts
    parseCard('Kd'), // King of diamonds
    parseCard('7s'), // 7 of spades
  ]);

  // Players in the hand
  const [players] = useState<Player[]>([
    {
      position: 'CO',
      stack: 100,
      isHero: false, // Villain
    },
    {
      position: 'BTN',
      stack: 97.5,
      cards: [parseCard('As'), parseCard('Qs')], // Hero has A♠ Q♠
      isHero: true,
    },
  ]);

  // Handle player actions (we'll implement full logic later)
  const handleAction = (action: ActionType, amount?: number) => {
    console.log(`Player action: ${action}${amount ? ` ${amount}bb` : ''}`);
    // TODO: Process action, update game state, get GTO feedback
    alert(`You chose: ${action}${amount ? ` (${amount}bb or ${Math.round(amount * 100)}% pot)` : ''}\n\nGTO feedback will be shown here!`);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          {/* Header */}
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 3 }}
          >
            🃏 GTO Poker Trainer
          </Typography>

          {/* Poker Table */}
          <PokerTable board={board} pot={pot} players={players} />

          {/* Action Buttons */}
          <ActionButtons
            canCheck={false} // Facing a bet, so can't check
            canCall={true}
            callAmount={2.5}
            onAction={handleAction}
          />

          {/* Info text */}
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              textAlign: 'center',
              mt: 4,
              color: '#666',
              fontStyle: 'italic',
            }}
          >
            Demo Hand: BTN vs CO on A♥ K♦ 7♠ flop. You have A♠ Q♠ (top pair, good kicker).
            <br />
            This is a placeholder - full game logic coming next!
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
