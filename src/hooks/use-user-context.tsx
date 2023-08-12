import { createContext, useCallback, useContext, useMemo } from 'react';
import { RoomCommands } from 'types/room-messages.enum';
import { useApiWebSocket } from './use-api-websocket';
import { useLocalStorage } from './use-local-storage';
import type { ReactNode } from 'react';

interface UserContextType {
  username: string;
  userIsSpectating: boolean;
  setUsername: (value: string) => void;
  setUserIsSpectating: (value: boolean) => void;
}
const UserContext = createContext<UserContextType>({} as UserContextType);

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
  const { sendCommand } = useApiWebSocket();
  const [username, setLocalUsername] = useLocalStorage<string>('planningpoker-username', '');
  const [userIsSpectating, setLocalUserIsSpectating] = useLocalStorage<boolean>('planningpoker-userIsSpectating', false);

  const setUsername = useCallback((value: string) => {
    sendCommand({ event: RoomCommands.SetUsername, username: value, ts: new Date().toISOString() });
    setLocalUsername(value);
  }, [sendCommand, setLocalUsername]);

  const setUserIsSpectating = useCallback((value: boolean) => {
    sendCommand({ event: RoomCommands.SetUserIsSpectating, isSpectating: value, ts: new Date().toISOString() });
    setLocalUserIsSpectating(value);
  }, [sendCommand, setLocalUserIsSpectating]);

  const value = useMemo(
    () => ({ username, userIsSpectating, setUsername, setUserIsSpectating }),
    [username, userIsSpectating, setUsername, setUserIsSpectating],
  );

  return (
    <UserContext.Provider
      value={value}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
