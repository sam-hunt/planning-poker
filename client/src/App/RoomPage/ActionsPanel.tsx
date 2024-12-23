import SyncIcon from '@mui/icons-material/Sync';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ReplayIcon from '@mui/icons-material/Replay';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import { useRoom } from '../../hooks/use-room';
import { useEffect, useMemo, useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import { Stopwatch } from './Stopwatch';
import { Room, RoomCommands, SetCardCommand, SetRoomOptionsCommand, User } from '@planning-poker/protocol';

const fibonacciOptions = ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100'];
const agileOptions = ['?', '∞', '☕'];
const tshirtOptions = ['S', 'M', 'L', 'XL'];

export const ActionsPanel = () => {
  const { readyState } = useRoom();
  const { room, userId, userOptions, sendCommand } = useRoom();

  const [lastCard, setLastCard] = useState<string | null>(null);

  const notConnected = readyState !== ReadyState.OPEN;

  const reload = () => window.location.reload();
  const toggleCardVisibility = () => sendCommand({ event: RoomCommands.ToggleCardVisibility, ts: new Date().toISOString() });
  const resetCards = () => sendCommand({ event: RoomCommands.ResetCards, ts: new Date().toISOString() });

  const selectCard = (card: string) => () => {
    const setCardCommand: SetCardCommand = { event: RoomCommands.SetCard, card, ts: new Date().toISOString() };
    sendCommand(setCardCommand);
    setLastCard(card);
  };

  const handleChangeCardOptions = (cardOptions: Room['cardOptions']) => {
    if (!room) return;
    const setRoomOptionsCommand: SetRoomOptionsCommand = {
      event: RoomCommands.SetRoomOptions,
      leaderId: room.leaderId,
      cardOptions,
      ts: new Date().toISOString(),
    };
    sendCommand(setRoomOptionsCommand);
  };

  const handleChangeLeader = (leaderId: Room['leaderId']) => {
    if (!room) return;
    const setRoomOptionsCommand: SetRoomOptionsCommand = {
      event: RoomCommands.SetRoomOptions,
      leaderId,
      cardOptions: room.cardOptions,
      ts: new Date().toISOString(),
    };
    sendCommand(setRoomOptionsCommand);
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

  // TODO: Fix so users with the same name don't get leader abilities
  const roomActionsEnabled = !room?.leaderId || userId === room.leaderId;

  return (
    <Card sx={{ py: 1.5, px: 2.5, borderColor: theme => theme.palette.divider }}>
      <Typography variant="h5" mb={2}>
        Room actions
      </Typography>
      <Grid container spacing={2}>
        {notConnected && (
          <Grid size={12}>
            <Button fullWidth color="primary" variant="contained" endIcon={<SyncIcon />} onClick={reload}>
              Reload
            </Button>
          </Grid>
        )}
        {!notConnected && (
          <>
            <Grid size={{ xl: 6, lg: 12, md: 12, sm: 6, xs: 12 }}>
              <FormControl fullWidth>
                <InputLabel id="room-leader-select-label" size="small">
                  Room leader
                </InputLabel>
                <Select
                  label="Room leader"
                  value={room?.leaderId ?? ''}
                  onChange={event => handleChangeLeader(event.target.value)}
                  labelId="room-leader-select-label"
                  id="room-leader-select"
                  size="small"
                >
                  <MenuItem value="">None</MenuItem>
                  {room?.users.map(user => (
                    <MenuItem key={user.id} value={user.id}>
                      {`${user.name ?? 'Someone'} ${room.leaderId === user.id ? '👑' : ''}`}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {roomActionsEnabled && (
              <>
                <Grid size={{ xl: 6, lg: 12, md: 12, sm: 6, xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel id="card-options-select-label" size="small">
                      Card options
                    </InputLabel>
                    <Select
                      label="Card options"
                      value={room?.cardOptions ?? 'fibonacci'}
                      onChange={event => handleChangeCardOptions(event.target.value as Room['cardOptions'])}
                      labelId="card-options-select-label"
                      id="card-options-select"
                      size="small"
                    >
                      <MenuItem value="fibonacci">Fibonacci</MenuItem>
                      <MenuItem value="tshirt">T-Shirt sizing</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xl: 6, lg: 12, md: 12, sm: 6, xs: 12 }}>
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
                <Grid size={{ xl: 6, lg: 12, md: 12, sm: 6, xs: 12 }}>
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
          </>
        )}
      </Grid>
      <Divider sx={{ my: 2 }} />
      {!userOptions.isSpectating && (
        <>
          <Typography variant="h5" gutterBottom>
            Cards
          </Typography>
          {room?.cardOptions === 'fibonacci' && (
            <>
              <FormLabel sx={{ fontSize: 'small' }}>Fibonacci</FormLabel>
              <Stack direction="row" flexWrap="wrap" justifyContent="start" gap={0.5} pb={1}>
                {fibonacciOptions.map(value => (
                  <Button
                    key={value}
                    // Highlight clicked cards even when hidden, unless cleared
                    variant={lastCard === value ? 'contained' : 'outlined'}
                    onClick={selectCard(value)}
                    sx={{ width: '60px', fontSize: 20, color: 'inherit' }}
                    disabled={notConnected || room.isRevealed}
                  >
                    {value}
                  </Button>
                ))}
              </Stack>
            </>
          )}
          {room?.cardOptions === 'tshirt' && (
            <>
              <FormLabel sx={{ fontSize: 'small' }}>T-Shirt Sizes</FormLabel>
              <Stack direction="row" flexWrap="wrap" justifyContent="start" gap={0.5} pb={1}>
                {tshirtOptions.map(value => (
                  <Button
                    key={value}
                    // Highlight clicked cards even when hidden, unless cleared
                    variant={lastCard === value ? 'contained' : 'outlined'}
                    onClick={selectCard(value)}
                    sx={{ width: '60px', fontSize: 20, color: 'inherit' }}
                    disabled={notConnected || room.isRevealed}
                  >
                    {value}
                  </Button>
                ))}
              </Stack>
            </>
          )}
          <FormLabel sx={{ fontSize: 'small' }}>Agile</FormLabel>
          <Stack direction="row" flexWrap="wrap" justifyContent="start" gap={0.5} pb={1}>
            {agileOptions.map(value => (
              <Button
                key={value}
                // Highlight clicked cards even when hidden, unless cleared
                variant={lastCard === value ? 'contained' : 'outlined'}
                onClick={selectCard(value)}
                sx={{ width: '60px', fontSize: 20, color: 'inherit' }}
                disabled={notConnected || room?.isRevealed}
              >
                {value}
              </Button>
            ))}
          </Stack>
          <Divider sx={{ my: 2 }} />
        </>
      )}

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
