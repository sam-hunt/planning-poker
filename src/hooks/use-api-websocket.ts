import useWebSocket from 'react-use-websocket';
import { useCallback, useEffect, useMemo } from 'react';
import { RoomCommands } from '../types/room-messages.enum';
import { apiWsUrl } from '../env';
import type { RoomMessageBase } from '../types/room-message-base';
import type { StateChangedEvent } from '../types/events/state-changed.event';
import type { Room } from '../types/room';
import type { ReadyState, Options as WsOptions } from 'react-use-websocket';
import { useParams } from 'react-router';

export interface UseApiWebSocket {
  room: Room | null;
  sendCommand: (command: RoomMessageBase) => void;
  readyState: ReadyState;
  resetSocket: () => void;
}

export const useApiWebSocket = (): UseApiWebSocket => {
  const { roomId } = useParams();

  const wsOptions: WsOptions = useMemo(
    () => ({
      share: true,
      shouldReconnect: () => true,
      reconnectAttempts: 20,
      reconnectInterval: 3,
      retryOnError: true,
      queryParams: { roomId: roomId ?? '' },
    }),
    [roomId],
  );
  const { lastJsonMessage, sendJsonMessage, readyState, getWebSocket } = useWebSocket(apiWsUrl, wsOptions);
  const resetSocket = () => getWebSocket()?.close();

  const room = lastJsonMessage ? (lastJsonMessage as StateChangedEvent).room : null;
  const sendCommand = useCallback((command: RoomMessageBase) => sendJsonMessage(command), [sendJsonMessage]);

  useEffect(() => {
    const interval = setInterval(() => sendCommand({ event: RoomCommands.Resync, ts: new Date().toISOString() }), 50000);
    return () => clearInterval(interval);
  }, [sendCommand]);

  return { room, sendCommand, readyState, resetSocket };
};
