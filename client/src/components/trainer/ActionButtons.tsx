/**
 * Action Buttons Component
 *
 * Displays available poker actions (fold, check, call, bet, raise)
 * with bet sizing options. The user clicks these to make decisions.
 *
 * Actions shown depend on game state:
 * - Can check if no bet to call
 * - Can call if facing a bet
 * - Can bet/raise with different sizes
 * - Can always fold (except when can check for free)
 */

import { Box, Button, Stack, Typography } from '@mui/material';
import type { ActionType } from '../../types/poker';

interface ActionButtonsProps {
  canCheck: boolean; // Can we check (no bet to call)?
  canCall: boolean; // Can we call a bet?
  callAmount?: number; // Amount to call in bb
  onAction: (action: ActionType, amount?: number) => void; // Callback when action is clicked
}

/**
 * ActionButtons Component
 *
 * Shows the poker actions available to the player.
 * In later versions, we'll add difficulty modes (Standard/Grouped/Simple).
 */
export function ActionButtons({ canCheck, canCall, callAmount, onAction }: ActionButtonsProps) {
  // Bet sizing options (as percentage of pot or fixed amounts)
  // We'll make these dynamic based on pot size later
  const betSizes = [
    { label: '33% Pot', value: 0.33 },
    { label: '50% Pot', value: 0.5 },
    { label: '75% Pot', value: 0.75 },
    { label: 'Pot', value: 1.0 },
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#fff', textAlign: 'center' }}>
        Your Action
      </Typography>

      <Stack spacing={2}>
        {/* Primary Actions Row */}
        <Stack direction="row" spacing={2} justifyContent="center">
          {/* Fold - only show if we can't check for free */}
          {!canCheck && (
            <Button
              variant="contained"
              color="error"
              size="large"
              onClick={() => onAction('fold')}
              sx={{ minWidth: 100 }}
            >
              Fold
            </Button>
          )}

          {/* Check or Call */}
          {canCheck ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => onAction('check')}
              sx={{ minWidth: 100 }}
            >
              Check
            </Button>
          ) : canCall ? (
            <Button
              variant="contained"
              color="info"
              size="large"
              onClick={() => onAction('call', callAmount)}
              sx={{ minWidth: 100 }}
            >
              Call {callAmount}bb
            </Button>
          ) : null}
        </Stack>

        {/* Bet/Raise Sizing Options Row */}
        <Box>
          <Typography variant="caption" sx={{ color: '#aaa', display: 'block', mb: 1, textAlign: 'center' }}>
            {canCheck ? 'Bet Sizes:' : 'Raise Sizes:'}
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap">
            {betSizes.map((size) => (
              <Button
                key={size.label}
                variant="outlined"
                color="success"
                size="medium"
                onClick={() => onAction(canCheck ? 'bet' : 'raise', size.value)}
                sx={{ minWidth: 90 }}
              >
                {size.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Stack>

      {/* Helper text */}
      <Typography
        variant="caption"
        sx={{
          color: '#888',
          display: 'block',
          mt: 2,
          textAlign: 'center',
          fontStyle: 'italic',
        }}
      >
        Choose your action. You'll see GTO feedback at the end of the hand.
      </Typography>
    </Box>
  );
}
