/**
 * GTO Poker Trainer - Main Application
 *
 * This is the root component of our poker training application.
 * We're using Material UI (MUI) for professional-looking components.
 */

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, Container, Typography, Paper } from '@mui/material';

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
  return (
    // ThemeProvider applies our dark theme to all Material UI components
    <ThemeProvider theme={darkTheme}>
      {/* CssBaseline normalizes styles across browsers */}
      <CssBaseline />

      {/* Main container with centered content */}
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Header */}
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 4 }}
          >
            🃏 GTO Poker Trainer
          </Typography>

          {/* Main content area */}
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" gutterBottom>
              Welcome to Your Poker Training App!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              We're building this step by step. This is your starting point!
            </Typography>
            <Typography variant="body2" sx={{ mt: 3, fontStyle: 'italic' }}>
              Next up: Building the poker table UI...
            </Typography>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
