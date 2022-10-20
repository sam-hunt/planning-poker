import { Grid, Stack } from '@mui/material';
import { useApiWebSocket } from 'hooks/use-api-websocket';
import { useLocalStorage } from 'hooks/use-local-storage';
import { useEffect } from 'react';
import { RoomCommands } from 'types/room-messages.enum';
import { ActionsPanel } from './ActionsPanel';
import { CardGrid } from './CardGrid';

export const RoomPage = () => {
  const { sendCommand } = useApiWebSocket();
  const [username] = useLocalStorage('planningpoker-username', '');

  useEffect(() => sendCommand({ event: RoomCommands.SetUsername, username, ts: new Date().toISOString() }), [sendCommand, username]);

  return (
    <Grid container spacing={2} p={3} height="100%">
      <Grid item xl={2} md={4} xs={12}>
        <Stack direction="column" spacing={2}>
          <ActionsPanel />
        </Stack>
      </Grid>
      <Grid item xl={10} md={8} xs={12}>
        <CardGrid />
      </Grid>
    </Grid>
  );
};
