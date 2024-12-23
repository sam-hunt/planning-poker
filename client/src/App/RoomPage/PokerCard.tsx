import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import { useState, type ReactNode } from 'react';
import { User } from '@planning-poker/protocol';
import { useRoom } from '../../hooks/use-room';

interface PokerCardProps {
  user: User;
}

export const PokerCard = ({ user }: PokerCardProps) => {
  const { room, userId, userOptions } = useRoom();
  const theme = useTheme();

  const [isHovered, setIsHovered] = useState(false);

  let color: 'inherit' | 'primary';
  if (!user.name) color = 'inherit';
  else if (userId === user.id) color = 'primary';
  else color = 'inherit';

  let cardDisplayEl: ReactNode;
  if (user.isSpectating) {
    cardDisplayEl = (
      <Typography variant="h2" pb={2} color={color} fontSize={{ xs: '56px', md: '64px' }}>
        {room?.leaderId === user.id ? '👑' : '👀'}
      </Typography>
    );
  } else if (room?.isRevealed || (userOptions.isSpectating && isHovered)) {
    cardDisplayEl = (
      <Typography variant="h2" color={color} fontSize={{ xs: '56px', md: '64px' }}>
        {user.card ?? '?'}
      </Typography>
    );
  } else {
    cardDisplayEl =
      user.card !== null ? (
        <Typography variant="h2" color={color} fontSize={{ xs: '56px', md: '64px' }}>
          <DoneIcon color="success" sx={{ fontSize: { xs: '56px', md: '64px' } }} />
        </Typography>
      ) : (
        <Typography variant="h2" color={color} pt={2} fontSize={{ xs: '56px', md: '64px' }}>
          <HourglassEmptyIcon color={color} sx={{ fontSize: { xs: '56px', md: '64px' } }} />
        </Typography>
      );
  }

  return (
    <Card
      sx={{
        width: { xs: '120px', sm: '140px', md: '160px' },
        height: { xs: '150px', sm: '180px', md: '210px' },
        borderRadius: '15px',
        borderColor: userId === user.id ? theme.palette.primary.main : theme.palette.divider,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Stack direction="column" justifyContent="center" alignItems="center" height="100%" p={2} gap={{ xs: 0, sm: 1, md: 1 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="80px">
          {cardDisplayEl}
        </Box>
        <Typography fontSize={{ xs: 'inherit', md: 'large' }} textAlign="center" color={color} lineHeight={1.2}>
          {`${user.name ? user.name : 'Someone'} ${room?.leaderId === user.id && !user.isSpectating ? '(👑)' : ''}`}
        </Typography>
      </Stack>
    </Card>
  );
};
