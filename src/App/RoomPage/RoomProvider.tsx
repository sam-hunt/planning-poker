import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { RoomContext } from './RoomContext';
import { useParams } from 'react-router';
import { SetUserOptionsCommand } from '../../types/commands/set-user-options.command';
import useWebSocket, { ReadyState, Options as WsOptions } from 'react-use-websocket';
import { StateChangedEvent } from '../../types/events/state-changed.event';
import { RoomMessageBase } from '../../types/room-message-base';
import { RoomCommands } from '../../types/room-messages.enum';
import { apiWsUrl } from '../../env';

export type UserOptions = Pick<SetUserOptionsCommand, 'name' | 'isSpectating'>;

export const RoomProvider = ({ children }: PropsWithChildren) => {
  const { roomId } = useParams();
  const userOptionsSent = useRef<boolean>(false);

  const localStorageUserOptionsKey = 'planningpoker-userOptions';
  const savedUserOptionsStr = localStorage.getItem(localStorageUserOptionsKey) ?? JSON.stringify({ name: '', isSpectating: false });
  const savedUserOptions = JSON.parse(savedUserOptionsStr) as UserOptions;

  const [userOptions, setUserOptions] = useState<UserOptions>(() => savedUserOptions);

  const wsOptions: WsOptions = useMemo(
    () => ({
      share: true,
      shouldReconnect: () => true,
      reconnectAttempts: 20,
      reconnectInterval: 3,
      retryOnError: true,
      queryParams: { roomId: roomId ?? '' },
      onClose: () => (userOptionsSent.current = false),
    }),
    [roomId],
  );
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket<StateChangedEvent | null>(apiWsUrl, wsOptions);

  const { room, userId } = lastJsonMessage ?? { room: null, userId: null };
  const sendCommand = useCallback((command: RoomMessageBase) => sendJsonMessage(command), [sendJsonMessage]);

  useEffect(() => {
    if (!room || !userId) return;
    const roomUser = room.users.find(u => u.id === userId);
    if (!roomUser) return;
    const newUserOptions = { name: roomUser.name ?? '', isSpectating: roomUser.isSpectating };
    const newUserOptionsStr = JSON.stringify(newUserOptions);
    if (savedUserOptionsStr === newUserOptionsStr) return;
    setUserOptions(newUserOptions);
    localStorage.setItem(localStorageUserOptionsKey, newUserOptionsStr);
  }, [userId, room, savedUserOptionsStr]);

  useEffect(() => {
    if (userOptionsSent.current || readyState !== ReadyState.OPEN) return;
    userOptionsSent.current = true;
    const setUserOptionsCommand: SetUserOptionsCommand = {
      event: RoomCommands.SetUserOptions,
      ts: new Date().toISOString(),
      name: savedUserOptions.name,
      isSpectating: savedUserOptions.isSpectating,
    };
    sendCommand(setUserOptionsCommand);
  }, [readyState, savedUserOptions, userOptionsSent, sendCommand]);

  useEffect(() => {
    const interval = setInterval(() => sendCommand({ event: RoomCommands.Resync, ts: new Date().toISOString() }), 50000);
    return () => clearInterval(interval);
  }, [sendCommand]);

  const roomContextValue = useMemo(
    () => ({
      room,
      userId,
      userOptions,
      sendCommand,
      readyState,
    }),
    [room, userId, userOptions, sendCommand, readyState],
  );

  return <RoomContext.Provider value={roomContextValue}>{children}</RoomContext.Provider>;
};
