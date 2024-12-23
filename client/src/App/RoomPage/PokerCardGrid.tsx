import Stack from '@mui/material/Stack';
import { User } from '@planning-poker/protocol';
import { useRoom } from '../../hooks/use-room';
import { PokerCard } from './PokerCard';

export const PokerCardGrid = () => {
  const { room } = useRoom();

  // Display spectators last
  const orderedUsers = room?.users.sort((u1, u2) => Number(u1.isSpectating) - Number(u2.isSpectating)) ?? [];

  return (
    <Stack direction="row" flexWrap="wrap" alignContent="center" justifyContent="center" height="100%" p={{ md: 4 }} gap={{ md: 8, xs: 2 }}>
      {orderedUsers.map((user: User) => (
        <PokerCard key={user.id} user={user} />
      ))}
    </Stack>
  );
};
