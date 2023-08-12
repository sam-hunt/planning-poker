import { Box, Grid, Stack } from '@mui/material';
import { useUserContext } from 'hooks/use-user-context';
import { useMountEffect } from 'hooks/use-mount-effect';
import { ActionsPanel } from './ActionsPanel';
import { PokerCardGrid } from './PokerCardGrid';

export const RoomPage = () => {
  const { username, userIsSpectating, setUsername, setUserIsSpectating } = useUserContext();

  useMountEffect(() => {
    // Restore local values from previous session
    setUsername(username);
    setUserIsSpectating(userIsSpectating);
  });

  return (
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
  );
};
