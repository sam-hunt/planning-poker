import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createContext, useMemo } from 'react';
import { useLocalStorage } from '../hooks/use-local-storage';
import { themeFromMode } from './theme';
import type { PaletteMode } from '@mui/material';
import type { ReactNode } from 'react';

export interface ThemeContextType {
  currentTheme: string,
  toggleTheme: () => void,
}

export interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType>({ currentTheme: 'dark', toggleTheme: () => { } });

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [currentTheme, setCurrentTheme] = useLocalStorage<PaletteMode>('planningpoker-theme', 'dark');

  const themeProviderValue = useMemo(() => ({
    currentTheme,
    toggleTheme: () => setCurrentTheme(currentTheme === 'dark' ? 'light' : 'dark'),
  }), [currentTheme, setCurrentTheme]);

  return (
    <ThemeContext.Provider value={themeProviderValue}>
      <MuiThemeProvider theme={themeFromMode(currentTheme)}>
        <CssBaseline enableColorScheme />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
