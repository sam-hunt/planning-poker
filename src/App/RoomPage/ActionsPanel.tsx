import SyncIcon from '@mui/icons-material/Sync';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ReplayIcon from '@mui/icons-material/Replay';
import { Box, Button, Card, Divider, List, ListItem, Stack, Typography } from '@mui/material';
import { useApiWebSocket } from 'hooks/use-api-websocket';
import { RoomCommands } from 'types/room-messages.enum';
import { useMemo } from 'react';
import { ReadyState } from 'react-use-websocket';
import { Stopwatch } from './Stopwatch';

const cards = ['0', '1', '3', '5', '8', '13', '20', '40', '100', '?', '∞', '💩', '☕', '🍺', '🥃'];

export const ActionsPanel = () => {
  const { readyState } = useApiWebSocket();
  const { room, sendCommand } = useApiWebSocket();

  const disabled = readyState !== ReadyState.OPEN;

  const resync = () => sendCommand({ event: RoomCommands.Resync, ts: new Date().toISOString() });
  const reload = () => window.location.reload();
  const toggleCardVisibility = () => sendCommand({ event: RoomCommands.ToggleCardVisibility, ts: new Date().toISOString() });
  const resetCards = () => sendCommand({ event: RoomCommands.ResetCards, ts: new Date().toISOString() });

  const selectCard = (card: string) => () => sendCommand({ event: RoomCommands.SetCard, card, ts: new Date().toISOString() });

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
            variant="outlined"
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
      <List>
        <ListItem>
          <Button
            color="primary"
            fullWidth
            variant={room?.isRevealed ? 'outlined' : 'contained'}
            endIcon={room?.isRevealed ? <VisibilityOffIcon /> : <VisibilityIcon />}
            onClick={toggleCardVisibility}
            disabled={disabled}
          >
            {room?.isRevealed ? 'Hide' : 'Show'}
            &nbsp;Cards
          </Button>
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            color="error"
            variant={room?.isRevealed ? 'contained' : 'outlined'}
            endIcon={<ReplayIcon />}
            onClick={resetCards}
            disabled={disabled}
          >
            Reset cards
          </Button>
        </ListItem>
        <ListItem>
          <Button
            fullWidth
            color="inherit"
            variant="outlined"
            endIcon={<SyncIcon />}
            onClick={disabled ? reload : resync}
          >
            {disabled ? 'Reload' : 'Resync'}
          </Button>
        </ListItem>
      </List>
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
