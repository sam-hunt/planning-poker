import { Box } from '@mui/material';
import { useApiWebSocket } from '../../hooks/use-api-websocket';
import { PokerCard } from './PokerCard';
import type { User } from '../../types/user';

export const PokerCardGrid = () => {
  const { room } = useApiWebSocket();

  // Display spectators last
  const orderedUsers = room?.users.sort((u1, u2) => Number(u1.isSpectating) - Number(u2.isSpectating)) ?? [];

  return (
    <Box display="flex" flexWrap="wrap" alignContent="center" justifyContent="center" height="100%">
      {orderedUsers.map((user: User) => (
        <PokerCard key={user.id} user={user} />
      ))}
    </Box>
  );
};
