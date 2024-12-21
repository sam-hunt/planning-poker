import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { useMemo } from 'react';
import { useLocalStorage } from '../../hooks/use-local-storage';
import { themeFromMode } from './theme';
import type { PaletteMode } from '@mui/material';
import type { PropsWithChildren } from 'react';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage<PaletteMode>('planningpoker-theme', 'dark');

  const themeProviderValue = useMemo(
    () => ({
      currentTheme,
      toggleTheme: () => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark'),
    }),
    [currentTheme, setCurrentTheme],
  );

  return (
    <ThemeContext.Provider value={themeProviderValue}>
      <MuiThemeProvider theme={themeFromMode(currentTheme)}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
