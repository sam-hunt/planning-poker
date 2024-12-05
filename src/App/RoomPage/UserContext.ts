import { createContext } from 'react';

export interface UserContextType {
  username: string;
  userIsSpectating: boolean;
  setUsername: (value: string) => void;
  setUserIsSpectating: (value: boolean) => void;
}

// This value will be set by the provider before it is accessed
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const UserContext = createContext<UserContextType>(null!);
