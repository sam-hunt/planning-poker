import { Box } from '@mui/material';
import { useApiWebSocket } from 'hooks/use-api-websocket';
import { PokerCard } from './PokerCard';
import type { User } from 'types/user';

export const PokerCardGrid = () => {
  const { room } = useApiWebSocket();

  // Display spectators last
  const participants = room?.users.filter((user: User) => !user.isSpectating) || [];
  const spectators = room?.users.filter((user: User) => user.isSpectating) || [];

  return (
    <Box display="flex" flexWrap="wrap" alignContent="center" justifyContent="center" height="100%">
      {participants.map((user: User) => (
        <PokerCard user={user} />
      ))}
      {spectators.map((user: User) => (
        <PokerCard user={user} />
      ))}
    </Box>
  );
};
