import SettingsIcon from '@mui/icons-material/Settings';
import CasinoIcon from '@mui/icons-material/Casino';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useApiWebSocket } from 'hooks/use-api-websocket';
import { useContext, useState } from 'react';
import { RoomCommands } from 'types/room-messages.enum';
import { useLocalStorage } from 'hooks/use-local-storage';
import { ReadyState } from 'react-use-websocket';
import { ThemeContext } from './ThemeProvider';
import { SetNameModal } from './RoomPage/SetNameModal';

export const Header = () => {
  const { sendCommand, readyState } = useApiWebSocket();
  const { toggleTheme } = useContext(ThemeContext);

  const theme = useTheme();

  const [username, setUsername] = useLocalStorage('planningpoker-username', '');
  const [isSetNameModalOpen, setIsSetNameModalOpen] = useState(false);
  const openSetNameModal = () => setIsSetNameModalOpen(true);
  const closeSetNameModal = () => setIsSetNameModalOpen(false);
  const onSetNameModalChange = (newUsername: string) => {
    sendCommand({ event: RoomCommands.SetUsername, username: newUsername, ts: new Date().toISOString() });
    setUsername(newUsername);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <CasinoIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          Planning Poker
        </Typography>
        <Tooltip title={`Websocket ${ReadyState[readyState]}`}>
          <span>
            <IconButton onClick={() => window.location.reload()}>
              {readyState === ReadyState.UNINSTANTIATED && <ErrorIcon color="error" />}
              {readyState === ReadyState.CLOSED && <ErrorIcon color="error" />}
              {readyState === ReadyState.CLOSING && <ErrorIcon color="error" />}
              {readyState === ReadyState.CONNECTING && <PendingIcon color="info" />}
              {readyState === ReadyState.OPEN && <CheckCircleIcon color="success" />}
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Toggle Dark Mode">
          <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
            {theme.palette.mode === 'light'
              ? <Brightness4Icon />
              : <Brightness7Icon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Set Username">
          <IconButton sx={{ ml: 1 }} onClick={openSetNameModal} color="inherit">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        <SetNameModal isOpen={isSetNameModalOpen} value={username} onChange={onSetNameModalChange} onClose={closeSetNameModal} />
      </Toolbar>
    </AppBar>
  );
};
