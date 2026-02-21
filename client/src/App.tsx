/**
 * GTO Poker Trainer - Main Application
 *
 * Complete poker training application with:
 * - Full hand playthrough (flop → turn → river)
 * - Real-time GTO decision tracking
 * - End-of-hand review with detailed feedback
 * - Performance scoring
 *
 * Game Flow:
 * 1. Player makes decisions on each street
 * 2. Hand progresses automatically after each action
 * 3. When hand completes, show HandReview screen
 * 4. Player clicks "Next Hand" to start over
 */

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, Chip, Stack } from '@mui/material';
import { PokerTable } from './components/trainer/PokerTable';
import { ActionButtons } from './components/trainer/ActionButtons';
import { HandReview } from './components/trainer/HandReview';
import { usePokerGame } from './hooks/usePokerGame';
import type { ActionType } from './types/poker';

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
  // Use our custom hook to manage all game state
  const { gameState, decisions, isHandComplete, makeAction, startNewHand } = usePokerGame();

  // Determine what actions are available
  const canCheck = true; // Simplified: assume we can check if no bet facing
  const canCall = false; // No bet to call in our demo
  const callAmount = undefined;

  // Handle player action
  const handleAction = (action: ActionType, amount?: number) => {
    makeAction(action, amount);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />

      <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h4" component="h1">
              🃏 GTO Poker Trainer
            </Typography>
            <Stack direction="row" spacing={2}>
              <Chip
                label={`Street: ${gameState.street.toUpperCase()}`}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Decisions: ${decisions.length}`}
                color="secondary"
                variant="outlined"
              />
            </Stack>
          </Stack>

          {/* Show game or review based on hand state */}
          {!isHandComplete ? (
            <>
              {/* Active Hand - Poker Table */}
              <PokerTable
                board={gameState.board}
                pot={gameState.pot}
                players={gameState.players}
              />

              {/* Action Buttons */}
              <ActionButtons
                canCheck={canCheck}
                canCall={canCall}
                callAmount={callAmount}
                onAction={handleAction}
              />

              {/* Helper Info */}
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  mt: 3,
                  color: '#666',
                  fontStyle: 'italic',
                }}
              >
                Make your decision on the {gameState.street}. GTO feedback will be shown at the end.
              </Typography>
            </>
          ) : (
            /* Hand Complete - Show Review */
            <HandReview decisions={decisions} onNextHand={startNewHand} />
          )}

          {/* Footer Info */}
          <Box sx={{ mt: 4, textAlign: 'center', borderTop: '1px solid #333', pt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Learning GTO Poker • Free Training Tool
            </Typography>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
