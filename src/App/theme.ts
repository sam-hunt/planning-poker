import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';
import type { PaletteMode } from '@mui/material';
import type { CSSProperties } from '@mui/material/styles/createMixins';

declare module '@mui/material/styles/createMixins' {
  interface Mixins {
    modalBoxStyle?: CSSProperties
  }
}

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

export const themeFromMode = (mode: PaletteMode) => createTheme({
  palette: {
    mode,
    primary: mode === 'dark' ? lavender : royal,
    secondary: mode === 'dark' ? royal : lavender,
    background: {
      paper: mode === 'dark' ? grey[900] : grey[300],
    },
  },
  mixins: {
    modalBoxStyle: {
      position: 'absolute' as 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      borderRadius: 3,
      boxShadow: '24px',
      p: 4,
    },
  },
});
