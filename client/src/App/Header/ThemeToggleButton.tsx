import { useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

import { ThemeContext } from '../Theme/ThemeContext';

export const ThemeToggleButton = () => {
  const theme = useTheme();
  const { toggleTheme } = useContext(ThemeContext);

  return (
    <Tooltip title="Toggle Dark Mode">
      <IconButton onClick={toggleTheme} color="inherit">
        {theme.palette.mode === 'light' ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
      </IconButton>
    </Tooltip>
  );
};
