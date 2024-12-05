import { useContext, useState } from 'react';
import { ReadyState } from 'react-use-websocket';
import CasinoIcon from '@mui/icons-material/Casino';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import PendingIcon from '@mui/icons-material/Pending';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { AppBar, Toolbar, Typography, IconButton, Tooltip, useTheme, Stack } from '@mui/material';
import { useApiWebSocket } from '../hooks/use-api-websocket';
import { UserSettingsDialog } from './RoomPage/UserSettingsDialog';
import { useNavigate } from 'react-router';
import { useMountEffect } from '../hooks/use-mount-effect';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import { ThemeContext } from './Theme/ThemeContext';
import { UserContext } from './RoomPage/UserContext';

export const Header = () => {
  const { readyState } = useApiWebSocket();
  const { toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const reload = () => window.location.reload();

  const { username, userIsSpectating, setUsername, setUserIsSpectating } = useContext(UserContext);

  useMountEffect(() => {
    // Restore local values from previous session
    setUsername(username);
    setUserIsSpectating(userIsSpectating);
  });

  const [isUserSettingsDialogOpen, setIsUserSettingsDialogOpen] = useState(false);
  const openUserSettingsDialog = () => setIsUserSettingsDialogOpen(true);
  const closeUserSettingsDialog = () => setIsUserSettingsDialogOpen(false);

  const onUserSettingsDialogChange = (newUsername: string, isSpectating: boolean) => {
    setUsername(newUsername);
    setUserIsSpectating(isSpectating);
  };

  return (
    <AppBar position="static" variant="elevation">
      <Toolbar>
        <CasinoIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, cursor: 'pointer' }} onClick={() => void navigate('/')}>
          Planning Poker
        </Typography>
        <Stack direction="row" gap={1}>
          <Tooltip title={`Websocket ${ReadyState[readyState]}`}>
            <span>
              <IconButton onClick={reload}>
                {readyState === ReadyState.UNINSTANTIATED && <ErrorIcon color="error" />}
                {readyState === ReadyState.CLOSED && <ErrorIcon color="error" />}
                {readyState === ReadyState.CLOSING && <ErrorIcon color="error" />}
                {readyState === ReadyState.CONNECTING && <PendingIcon color="info" />}
                {readyState === ReadyState.OPEN && <CheckCircleIcon color="success" />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Toggle Dark Mode">
            <IconButton onClick={toggleTheme} color="inherit">
              {theme.palette.mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Set Username">
            <IconButton onClick={openUserSettingsDialog} color="inherit">
              <AccountCircleOutlinedIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        {/* TODO: refactor to react-hook-form? */}
        <UserSettingsDialog
          isOpen={isUserSettingsDialogOpen}
          username={username}
          isSpectating={userIsSpectating}
          onChange={onUserSettingsDialogChange}
          onClose={closeUserSettingsDialog}
        />
      </Toolbar>
    </AppBar>
  );
};
