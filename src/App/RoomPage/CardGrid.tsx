import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import DoneIcon from '@mui/icons-material/Done';
import { Box, Card, Stack, Typography } from '@mui/material';
import { useApiWebSocket } from 'hooks/use-api-websocket';
import { useLocalStorage } from 'hooks/use-local-storage';
import type { User } from 'types/user';

export const CardGrid = () => {
  const { room } = useApiWebSocket();

  // TODO: Refactor to user context so active color doesnt need a reload to catch
  const [username] = useLocalStorage('planningpoker-username', '');

  const userColor = (user: User) => {
    if (!user.name) return 'inherit';
    return username === user.name ? 'primary' : 'inherit';
  };

  return (
    <Box display="flex" flexWrap="wrap" alignContent="center" justifyContent="center" height="100%">
      {room?.users.map((user: User) => (
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
              {room?.isRevealed && (
                <Typography variant="h2" component="p" color={userColor(user)}>
                  {user.card || '?'}
                </Typography>
              )}
              {!room?.isRevealed && (
                <Typography variant="h2">
                  {user.card !== null
                    ? <DoneIcon color="success" sx={{ fontSize: '50px' }} />
                    : <HourglassEmptyIcon color={userColor(user)} sx={{ fontSize: '50px' }} />}
                </Typography>
              )}
            </Box>
            <Typography color={userColor(user)}>{user.name?.slice(0, 16) || 'Someone'}</Typography>
          </Stack>
        </Card>
      ))}
    </Box>
  );
};
