import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { generateSlug } from 'random-word-slugs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import LoginIcon from '@mui/icons-material/Login';
import CasinoIcon from '@mui/icons-material/Casino';
import { useNavigate } from 'react-router';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { useState } from 'react';

export const HomePage = () => {
  const randomName = () =>
    generateSlug(3, {
      format: 'title',
      categories: { adjective: ['time', 'color', 'quantity', 'size', 'sounds'], noun: ['food', 'animals', 'time'] },
    });
  const [roomName, setRoomName] = useLocalStorage<string>('roomName', randomName());
  const [copyTooltip, setCopyTooltip] = useState<string>('');
  const navigate = useNavigate();

  const roomSlug = roomName
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^\w-]+/g, '');

  const roomPath = `${window.location.href}${roomSlug}`;

  const onJoinClick = () => navigate(roomSlug);
  const onCopyClick = async () => {
    await navigator.clipboard.writeText(roomPath);
    setCopyTooltip('Copied!');
    setTimeout(() => setCopyTooltip(''), 1000);
  };

  return (
    <Dialog open={true} fullWidth maxWidth="sm" hideBackdrop>
      <DialogTitle display="flex" gap={3}>
        <CasinoIcon sx={{ width: '64px', height: '64px', alignSelf: 'center' }} />
        <Typography variant="h3" alignSelf="end">
          {'Planning Poker'}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, mb: 1 }}>
        <Typography variant="h5" component="h2" mb={1}>
          Join a room:
        </Typography>
        <TextField
          value={roomName}
          onChange={event => setRoomName(event.target.value)}
          fullWidth
          size="small"
          InputProps={{
            endAdornment: (
              <IconButton onClick={() => setRoomName(randomName())}>
                <CasinoIcon />
              </IconButton>
            ),
          }}
        ></TextField>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
          <Link href={`/${roomSlug}`}>{roomPath}</Link>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Tooltip title={copyTooltip}>
          <Button
            variant="outlined"
            color="primary"
            endIcon={<ContentCopyIcon />}
            onClick={onCopyClick}
            onMouseLeave={() => setCopyTooltip('')}
          >
            Copy link
          </Button>
        </Tooltip>
        <Button variant="contained" color="primary" endIcon={<LoginIcon />} onClick={onJoinClick}>
          Join room
        </Button>
      </DialogActions>
    </Dialog>
  );
};
