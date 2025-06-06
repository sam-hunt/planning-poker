import { createContext } from 'react';

export interface ThemeContextType {
  currentTheme: string;
  toggleTheme: () => void;
}

// This value will be set by the provider before it is accessed
export const ThemeContext = createContext<ThemeContextType>(null!);
