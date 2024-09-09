import React, { useState } from 'react';
import { Button, Container, Grid, Paper, TextField, Typography, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { backend } from 'declarations/backend';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196F3',
    },
    secondary: {
      main: '#FFC107',
    },
  },
});

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = async (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      setLoading(true);
      const result = await backend.calculate(firstOperand, inputValue, operator);
      setLoading(false);

      if ('ok' in result) {
        setDisplay(result.ok.toString());
        setFirstOperand(result.ok);
      } else {
        setDisplay('Error');
        setFirstOperand(null);
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper elevation={3} style={{ padding: '1rem' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={display}
            InputProps={{
              readOnly: true,
              style: { fontSize: '2rem', textAlign: 'right' }
            }}
          />
          <Grid container spacing={1} style={{ marginTop: '1rem' }}>
            {buttons.map((btn) => (
              <Grid item xs={3} key={btn}>
                <Button
                  fullWidth
                  variant="contained"
                  color={['/', '*', '-', '+', '='].includes(btn) ? 'secondary' : 'primary'}
                  onClick={() => {
                    if (btn === '=') {
                      performOperation('=');
                    } else if (['+', '-', '*', '/'].includes(btn)) {
                      performOperation(btn);
                    } else if (btn === '.') {
                      inputDecimal();
                    } else {
                      inputDigit(btn);
                    }
                  }}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Button fullWidth variant="outlined" onClick={clear}>Clear</Button>
            </Grid>
          </Grid>
          {loading && (
            <CircularProgress style={{ marginTop: '1rem' }} />
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;
