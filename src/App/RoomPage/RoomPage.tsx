import { Box, Grid, Stack } from '@mui/material';
import { UserContextProvider } from './UserContextProvider';
import { ActionsPanel } from './ActionsPanel';
import { PokerCardGrid } from './PokerCardGrid';
import { Header } from '../Header';
import { useParams } from 'react-router';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { useMountEffect } from '../../hooks/use-mount-effect';

export const RoomPage = () => {
  const unslug = (text: string) =>
    text
      .toLowerCase()
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');

  const { roomId } = useParams();
  const [, setSavedRoomName] = useLocalStorage<string>('roomName', unslug(roomId ?? ''));

  // Preserve the room name to restore next time the user hits the landing page
  useMountEffect(() => setSavedRoomName(unslug(roomId ?? '')));

  return (
    <UserContextProvider>
      <Header />
      <Grid container spacing={2} p={3} height="100%" minHeight="100%">
        <Grid item xl={9} md={8} xs={12}>
          <PokerCardGrid />
        </Grid>
        <Grid item xl={3} md={4} xs={12} height="100%">
          <Stack direction="column" spacing={2} height="100%" minHeight="100%">
            <ActionsPanel />
            <Box flex={1} />
          </Stack>
        </Grid>
      </Grid>
    </UserContextProvider>
  );
};
