import SyncIcon from '@mui/icons-material/Sync';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Button, Card, Divider, Grid, Stack, Typography } from '@mui/material';
import { useApiWebSocket } from 'hooks/use-api-websocket';
import { RoomCommands } from 'types/room-messages.enum';
import { useEffect, useMemo, useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import { Stopwatch } from './Stopwatch';
import type { User } from 'types/user';

const cards = ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?', '∞', '☕', '🍺', '🥃'];

export const ActionsPanel = () => {
  const { readyState } = useApiWebSocket();
  const { room, sendCommand } = useApiWebSocket();

  const [lastCard, setLastCard] = useState<string | null>(null);

  const disabled = readyState !== ReadyState.OPEN;

  const reload = () => window.location.reload();
  const toggleCardVisibility = () => sendCommand({ event: RoomCommands.ToggleCardVisibility, ts: new Date().toISOString() });
  const resetCards = () => sendCommand({ event: RoomCommands.ResetCards, ts: new Date().toISOString() });

  const selectCard = (card: string) => () => {
    setLastCard(card);
    sendCommand({ event: RoomCommands.SetCard, card, ts: new Date().toISOString() });
  };

  useEffect(() => {
    // Clear the last card button highlight when the room is reset
    const noCardsSelected = room?.users.every((u: User) => !u.card);
    if (noCardsSelected && !room?.isRevealed) setLastCard(null);
  }, [room]);

  const stats = useMemo(() => {
    if (disabled) return { average: '-', maxUsers: '-', minUsers: '-' };
    if (!room || !room.isRevealed) return { average: '?', maxUsers: '?', minUsers: '?' };
    const numericCards = room?.users.map((user) => parseInt(user.card, 10)).filter((n) => !Number.isNaN(n)) || [];
    const sum = numericCards.reduce((acc, val) => acc + val, 0);
    const average = (sum / numericCards.length) || '?';
    const maxValue = Math.max(...numericCards);
    const maxUsers = room?.users.filter((user) => user.card === maxValue.toString(10)).map((user) => user.name).join(', ') || '?';
    const minValue = Math.min(...numericCards);
    const minUsers = room?.users.filter((user) => user.card === minValue.toString(10)).map((user) => user.name).join(', ') || '?';
    return { average, maxUsers, minUsers };
  }, [room, disabled]);

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>Cards</Typography>
      <Box display="flex" flexWrap="wrap">
        {cards.map((value) => (
          <Button
            key={value}
            // Highlight clicked cards even when hidden, unless cleared
            variant={lastCard === value ? 'contained' : 'outlined'}
            onClick={selectCard(value)}
            sx={{ m: 1, fontSize: 20, color: 'inherit' }}
            disabled={disabled}
          >
            {value}
          </Button>
        ))}
      </Box>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5">Actions</Typography>
      <Grid container p={1} spacing={2}>
        {disabled && (
          <Grid item xl={12} md={12} xs={12}>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              endIcon={<SyncIcon />}
              onClick={reload}
            >
              Reload
            </Button>
          </Grid>
        )}
        {!disabled && (
          <>
            <Grid item xl={6} md={6} xs={12}>
              <Button
                fullWidth
                color="primary"
                variant={room?.isRevealed ? 'outlined' : 'contained'}
                endIcon={room?.isRevealed ? <VisibilityOffIcon /> : <VisibilityIcon />}
                onClick={toggleCardVisibility}
                disabled={disabled}
              >
                {room?.isRevealed ? 'Hide' : 'Show'}
              </Button>
            </Grid>
            <Grid item xl={6} md={6} xs={12}>
              <Button
                fullWidth
                color="error"
                variant={room?.isRevealed ? 'contained' : 'outlined'}
                endIcon={<ReplayIcon />}
                onClick={resetCards}
                disabled={disabled}
              >
                Reset
              </Button>
            </Grid>
          </>
        )}
      </Grid>
      <Divider sx={{ my: 2 }} />
      <Typography variant="h5" gutterBottom>Stats</Typography>
      <Box>
        <Stack direction="row" justifyContent="space-between" m={2}>
          <Typography>Timer:</Typography>
          <Typography>{disabled ? '-' : <Stopwatch since={room?.lastResetAt} />}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" m={2}>
          <Typography>Average:</Typography>
          <Typography>{stats.average}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" m={2}>
          <Typography>Highest:</Typography>
          <Typography>{stats.maxUsers}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" m={2}>
          <Typography>Lowest:</Typography>
          <Typography>{stats.minUsers}</Typography>
        </Stack>
      </Box>
    </Card>
  );
};
