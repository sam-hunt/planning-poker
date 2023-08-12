import { Box, Card, Stack, Typography } from '@mui/material';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import { useApiWebSocket } from 'hooks/use-api-websocket';
import { useUserContext } from 'hooks/use-user-context';
import type { ReactNode } from 'react';
import type { User } from 'types/user';

interface PokerCardProps {
  user: User;
}

export const PokerCard = ({ user }: PokerCardProps) => {
  const { username } = useUserContext();
  const { room } = useApiWebSocket();

  let color: 'inherit' | 'primary';
  if (!user.name) color = 'inherit';
  else if (username === user.name) color = 'primary';
  else color = 'inherit';

  let cardDisplayValue: ReactNode;
  if (user.isSpectating) {
    cardDisplayValue = (<Typography variant="h2" component="p" color={color}>🤮</Typography>);
  } else if (room?.isRevealed) {
    cardDisplayValue = (
      <Typography variant="h2" component="p" color={color}>
        {user.card || '?'}
      </Typography>
    );
  } else {
    cardDisplayValue = (
      <Typography variant="h2">
        {user.card !== null
          ? <DoneIcon color="success" sx={{ fontSize: '50px' }} />
          : <HourglassEmptyIcon color={color} sx={{ fontSize: '50px' }} />}
      </Typography>
    );
  }

  return (
    <Card
      key={user.id}
      sx={{
        m: 4,
        width: '130px',
        minWidth: '130px',
        height: '170px',
        borderRadius: '5px',
      }}
    >
      <Stack direction="column" justifyContent="space-evenly" alignItems="center" height="100%" p={2}>
        <Box display="flex" justifyContent="center" alignItems="center" height="80px">
          {cardDisplayValue}
        </Box>
        <Typography color={color}>{user.name?.slice(0, 16) || 'Someone'}</Typography>
      </Stack>
    </Card>
  );
};
