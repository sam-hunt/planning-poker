import { useCallback, useMemo } from 'react';
import { RoomCommands } from '../../types/room-messages.enum';
import { useApiWebSocket } from '../../hooks/use-api-websocket';
import { useLocalStorage } from '../../hooks/use-local-storage';
import type { PropsWithChildren } from 'react';
import { UserContext } from './UserContext';

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const { sendCommand } = useApiWebSocket();
  const [username, setLocalUsername] = useLocalStorage<string>('planningpoker-username', '');
  const [userIsSpectating, setLocalUserIsSpectating] = useLocalStorage<boolean>('planningpoker-userIsSpectating', false);

  const setUsername = useCallback(
    (value: string) => {
      sendCommand({ event: RoomCommands.SetUsername, username: value, ts: new Date().toISOString() });
      setLocalUsername(value);
    },
    [sendCommand, setLocalUsername],
  );

  const setUserIsSpectating = useCallback(
    (value: boolean) => {
      sendCommand({ event: RoomCommands.SetUserIsSpectating, isSpectating: value, ts: new Date().toISOString() });
      setLocalUserIsSpectating(value);
    },
    [sendCommand, setLocalUserIsSpectating],
  );

  const value = useMemo(
    () => ({ username, userIsSpectating, setUsername, setUserIsSpectating }),
    [username, userIsSpectating, setUsername, setUserIsSpectating],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
