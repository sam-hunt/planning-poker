import { useContext, useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CasinoIcon from '@mui/icons-material/Casino';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import SettingsIcon from '@mui/icons-material/Settings';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { useApiWebSocket } from 'hooks/use-api-websocket';
import { useUserContext } from 'hooks/use-user-context';
import { ThemeContext } from './ThemeProvider';
import { UserSettingsModal } from './RoomPage/UserSettingsModal';

export const Header = () => {
  const { readyState } = useApiWebSocket();
  const { toggleTheme } = useContext(ThemeContext);

  const theme = useTheme();

  const { username, userIsSpectating, setUsername, setUserIsSpectating } = useUserContext();

  const [isUserSettingsModalOpen, setIsUserSettingsModalOpen] = useState(false);
  const openUserSettingsModal = () => setIsUserSettingsModalOpen(true);
  const closeUserSettingsModal = () => setIsUserSettingsModalOpen(false);

  const onUserSettingsModalChange = (newUsername: string, isSpectating: boolean) => {
    setUsername(newUsername);
    setUserIsSpectating(isSpectating);
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
          <IconButton sx={{ ml: 1 }} onClick={openUserSettingsModal} color="inherit">
            <SettingsIcon />
          </IconButton>
        </Tooltip>
        {/* TODO: refactor to react-hook-form */}
        <UserSettingsModal
          isOpen={isUserSettingsModalOpen}
          username={username}
          isSpectating={userIsSpectating}
          onChange={onUserSettingsModalChange}
          onClose={closeUserSettingsModal}
        />
      </Toolbar>
    </AppBar>
  );
};
