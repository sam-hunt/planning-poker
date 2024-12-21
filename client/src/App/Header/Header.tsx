import { useNavigate } from 'react-router';
import { AppBar, Toolbar, Typography, Stack } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';

import { ConnectionButton } from './ConnectionButton';
import { ThemeToggleButton } from './ThemeToggleButton';
import { UserOptionsButton } from './UserOptionsButton';

export const Header = () => {
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" variant="elevation">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" alignItems="center" sx={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          <CasinoIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div">
            Planning Poker
          </Typography>
        </Stack>
        <Stack direction="row" gap={{ xs: 0, sm: 1 }}>
          <ConnectionButton />
          <ThemeToggleButton />
          <UserOptionsButton />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
