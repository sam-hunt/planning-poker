import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import { ActionsPanel } from './ActionsPanel';
import { PokerCardGrid } from './PokerCardGrid';
import { Header } from '../Header/Header';
import { useParams } from 'react-router';
import { useMountEffect } from '../../hooks/use-mount-effect';
import { RoomProvider } from './RoomProvider';

export const RoomPage = () => {
  const unslug = (text: string) =>
    text
      .toLowerCase()
      .replace(/-+/g, '-')
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.substring(1))
      .join(' ');

  const { roomId } = useParams();

  // Preserve the room name to restore next time the user visits the landing page
  useMountEffect(() => localStorage.setItem('planningpoker-roomName', `"${unslug(roomId ?? '')}"`));

  return (
    <RoomProvider>
      <Stack height={{ md: '100vh', sm: 'inherit' }}>
        <Header />
        <Grid container spacing={2} p={3} height="100%">
          <Grid size={{ xl: 9, md: 8, xs: 12 }} pb={{ md: '20vh' }}>
            <PokerCardGrid />
          </Grid>
          <Grid size={{ xl: 3, md: 4, xs: 12 }} height="100%">
            <Stack direction="column" spacing={2} height="100%">
              <ActionsPanel />
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </RoomProvider>
  );
};
