import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import type { LinkProps, PaletteMode } from '@mui/material';
import { LinkBehavior } from '../LinkBehaviour';

export const lavender = {
  main: '#CB9EFF',
  light: '#FFCFFF',
  dark: '#996FCB',
  contrastText: '#FFFFFF',
};
export const royal = {
  main: '#7005FC',
  light: '#AB4CFF',
  dark: '#2600C7',
  contrastText: '#FFFFFF',
};

export const themeFromMode = (mode: PaletteMode) =>
  createTheme({
    palette: {
      mode,
      primary: mode === 'dark' ? lavender : royal,
      secondary: mode === 'dark' ? royal : lavender,
      background: {
        paper: mode === 'dark' ? grey[900] : grey[300],
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as LinkProps,
      },
      MuiButtonBase: {
        defaultProps: {
          LinkComponent: LinkBehavior,
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderWidth: `5px`,
            borderStyle: 'solid',
          },
        },
      },
    },
  });
