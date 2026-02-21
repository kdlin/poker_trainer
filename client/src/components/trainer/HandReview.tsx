/**
 * Hand Review Component
 *
 * Shows a complete review of all decisions made in a hand:
 * - Timeline of all streets (preflop, flop, turn, river)
 * - Each decision with GTO feedback
 * - Blunders highlighted in red
 * - Alternative actions shown
 * - Overall performance score
 *
 * This is shown after the hand completes.
 */

import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import type { Decision } from '../../hooks/usePokerGame';

interface HandReviewProps {
  decisions: Decision[];
  onNextHand: () => void;
}

/**
 * HandReview Component
 *
 * Displays comprehensive feedback for all decisions in the hand
 */
export function HandReview({ decisions, onNextHand }: HandReviewProps) {
  // Calculate overall performance score (0-100)
  const score = calculateScore(decisions);

  return (
    <Paper elevation={5} sx={{ p: 4, mt: 3 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Hand Review
        </Typography>
        <Typography variant="h5" sx={{ color: getScoreColor(score), fontWeight: 'bold' }}>
          Score: {score}/100 {getScoreEmoji(score)}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {getScoreFeedback(score)}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Decision Timeline */}
      <Stack spacing={3}>
        {decisions.map((decision, index) => (
          <DecisionCard key={index} decision={decision} index={index} />
        ))}
      </Stack>

      {/* Summary */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {decisions.filter(d => d.isBlunder).length} blunder(s) •{' '}
          {decisions.filter(d => !d.isBlunder).length} good decision(s)
        </Typography>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={onNextHand}
          sx={{ minWidth: 200 }}
        >
          Next Hand
        </Button>
      </Box>
    </Paper>
  );
}

/**
 * Individual decision card showing GTO feedback
 */
function DecisionCard({ decision, index }: { decision: Decision; index: number }) {
  const isGoodDecision = !decision.isBlunder && decision.gtoFrequency > 0.1;
  const isMarginal = !decision.isBlunder && decision.gtoFrequency <= 0.1;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderLeft: `4px solid ${decision.isBlunder ? '#f44336' : isGoodDecision ? '#4caf50' : '#ff9800'}`,
        backgroundColor: decision.isBlunder ? 'rgba(244, 67, 54, 0.05)' : 'transparent',
      }}
    >
      {/* Street Header */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
        <Chip
          label={decision.street.toUpperCase()}
          color="primary"
          size="small"
        />
        {decision.isBlunder ? (
          <ErrorIcon color="error" />
        ) : isGoodDecision ? (
          <CheckCircleIcon color="success" />
        ) : (
          <WarningIcon color="warning" />
        )}
        <Typography variant="h6">
          Decision #{index + 1}
        </Typography>
      </Stack>

      {/* Your Decision */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          You: {formatAction(decision.action, decision.amount)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          GTO frequency: {(decision.gtoFrequency * 100).toFixed(1)}% • EV: {decision.gtoEV.toFixed(1)}bb
        </Typography>
      </Box>

      {/* GTO Recommendation */}
      <Box
        sx={{
          backgroundColor: 'rgba(76, 175, 80, 0.1)',
          p: 2,
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
          ✓ Best Action: {formatAction(decision.bestAction)}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          GTO frequency: {(decision.bestActionFreq * 100).toFixed(1)}%
        </Typography>
      </Box>

      {/* Feedback Message */}
      {decision.isBlunder && (
        <Typography variant="body2" color="error" sx={{ fontStyle: 'italic' }}>
          ⚠️ BLUNDER: This action loses significant EV compared to the best option.
          {decision.action === 'fold' && ' Folding with a strong hand is a major mistake.'}
          {decision.action === 'bet' && decision.amount && decision.amount > 0.6 &&
            ' Overbetting with marginal strength is too aggressive.'}
        </Typography>
      )}
      {!decision.isBlunder && isMarginal && (
        <Typography variant="body2" color="warning.main" sx={{ fontStyle: 'italic' }}>
          ℹ️ This action is acceptable but not optimal. Consider {formatAction(decision.bestAction)} more often.
        </Typography>
      )}
      {isGoodDecision && (
        <Typography variant="body2" color="success.main" sx={{ fontStyle: 'italic' }}>
          ✓ Good decision! This action is in line with GTO strategy.
        </Typography>
      )}
    </Paper>
  );
}

/**
 * Format action for display
 */
function formatAction(action: string, amount?: number): string {
  if (action === 'fold') return 'Fold';
  if (action === 'check') return 'Check';
  if (action === 'call') return `Call${amount ? ` ${amount.toFixed(1)}bb` : ''}`;
  if (action === 'bet' || action === 'raise') {
    if (amount) {
      const percentage = Math.round(amount * 100);
      return `${action === 'bet' ? 'Bet' : 'Raise'} ${percentage}% pot`;
    }
    return action === 'bet' ? 'Bet' : 'Raise';
  }
  return action;
}

/**
 * Calculate overall score (0-100)
 * Based on EV loss from optimal play
 */
function calculateScore(decisions: Decision[]): number {
  if (decisions.length === 0) return 100;

  let totalEVLoss = 0;
  decisions.forEach(d => {
    // Calculate EV loss (difference from best action)
    // We don't have best action EV stored, so we'll estimate
    const evLoss = d.isBlunder ? 3 : (1 - d.gtoFrequency) * 1.5;
    totalEVLoss += evLoss;
  });

  // Score: start at 100, lose points for EV loss
  const score = Math.max(0, 100 - (totalEVLoss / decisions.length) * 20);
  return Math.round(score);
}

/**
 * Get color for score
 */
function getScoreColor(score: number): string {
  if (score >= 85) return '#4caf50'; // Green
  if (score >= 70) return '#ff9800'; // Orange
  return '#f44336'; // Red
}

/**
 * Get emoji for score
 */
function getScoreEmoji(score: number): string {
  if (score >= 90) return '⭐⭐⭐';
  if (score >= 75) return '⭐⭐';
  if (score >= 60) return '⭐';
  return '💔';
}

/**
 * Get feedback message for score
 */
function getScoreFeedback(score: number): string {
  if (score >= 90) return 'Excellent! Your decisions are very close to GTO.';
  if (score >= 75) return 'Good work! A few small adjustments will improve your play.';
  if (score >= 60) return 'Decent effort. Review the blunders to improve.';
  return 'Keep practicing! Focus on avoiding major blunders.';
}
