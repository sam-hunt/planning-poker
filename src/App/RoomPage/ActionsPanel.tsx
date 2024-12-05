import SyncIcon from '@mui/icons-material/Sync';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material';
import { useApiWebSocket } from '../../hooks/use-api-websocket';
import { RoomCommands } from '../../types/room-messages.enum';
import { useContext, useEffect, useMemo, useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import { Stopwatch } from './Stopwatch';
import type { User } from '../../types/user';
import { UserContext } from './UserContext';

const fibonacciOptions = ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '∞', '☕', '🍺', '🥃'];
// const tshirtSizes = ['S', 'M', 'L', 'XL', '?'];
const cards = fibonacciOptions;

export const ActionsPanel = () => {
  const { readyState } = useApiWebSocket();
  const { room, sendCommand } = useApiWebSocket();
  const { userIsSpectating } = useContext(UserContext);

  const [lastCard, setLastCard] = useState<string | null>(null);

  const notConnected = readyState !== ReadyState.OPEN;

  const reload = () => window.location.reload();
  const toggleCardVisibility = () => sendCommand({ event: RoomCommands.ToggleCardVisibility, ts: new Date().toISOString() });
  const resetCards = () => sendCommand({ event: RoomCommands.ResetCards, ts: new Date().toISOString() });

  const selectCard = (card: string) => () => {
    setLastCard(card);
    sendCommand({ event: RoomCommands.SetCard, card, ts: new Date().toISOString() });
  };

  useEffect(() => {
    // Clear the last card button highlight when the room is reset
    const noCardsSelected = room?.users.every((user: User) => !user.card);
    if (noCardsSelected && !room?.isRevealed) setLastCard(null);
  }, [room]);

  const stats = useMemo(() => {
    if (notConnected || !room) return { average: '-', maxValue: '-', minValue: '-' };
    if (!room.isRevealed) return { average: '?', maxValue: '?', minValue: '?' };
    const numericCards = room.users.map(user => (user.card ? parseInt(user.card, 10) : NaN)).filter(n => !Number.isNaN(n));
    const sum = numericCards.reduce((acc, val) => acc + val, 0);
    const average = sum / numericCards.length || '?';
    const maxValue = Math.max(...numericCards);
    const minValue = Math.min(...numericCards);
    return { average, maxValue, minValue };
  }, [room, notConnected]);

  return (
    <Card sx={{ p: 2 }}>
      {!userIsSpectating && (
        <>
          <Typography variant="h5" gutterBottom>
            Cards
          </Typography>
          <Stack direction="row" flexWrap="wrap" justifyContent="center">
            {cards.map(value => (
              <Button
                key={value}
                // Highlight clicked cards even when hidden, unless cleared
                variant={lastCard === value ? 'contained' : 'outlined'}
                onClick={selectCard(value)}
                sx={{ m: 1, fontSize: 20, color: 'inherit' }}
                disabled={notConnected || room?.isRevealed}
              >
                {value}
              </Button>
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
        </>
      )}
      <Typography variant="h5" mb={1}>
        Room actions
      </Typography>
      <Grid container p={1} spacing={2}>
        {notConnected && (
          <Grid item xl={12} md={12} xs={12}>
            <Button fullWidth color="primary" variant="contained" endIcon={<SyncIcon />} onClick={reload}>
              Reload
            </Button>
          </Grid>
        )}
        {!notConnected && (
          <>
            <Grid item xl={6} md={6} xs={12}>
              <Button
                fullWidth
                color="primary"
                variant={room?.isRevealed ? 'outlined' : 'contained'}
                endIcon={room?.isRevealed ? <VisibilityOffIcon /> : <VisibilityIcon />}
                onClick={toggleCardVisibility}
                disabled={notConnected}
              >
                {room?.isRevealed ? 'Hide' : 'Reveal'}
              </Button>
            </Grid>
            <Grid item xl={6} md={6} xs={12}>
              <Button
                fullWidth
                color="error"
                variant={room?.isRevealed ? 'contained' : 'outlined'}
                endIcon={<ReplayIcon />}
                onClick={resetCards}
                disabled={notConnected}
              >
                Reset
              </Button>
            </Grid>
          </>
        )}
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" gutterBottom>
        Information
      </Typography>
      <Box>
        <Stack direction="row" justifyContent="space-between" m={2}>
          <Typography>Timer:</Typography>
          <Typography>{notConnected || !room ? '-' : <Stopwatch since={room.lastResetAt} />}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" m={2}>
          <Typography>Mean:</Typography>
          <Typography>{stats.average}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" m={2}>
          <Typography>Highest:</Typography>
          <Typography>{stats.maxValue}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" m={2}>
          <Typography>Lowest:</Typography>
          <Typography>{stats.minValue}</Typography>
        </Stack>
      </Box>
    </Card>
  );
};
