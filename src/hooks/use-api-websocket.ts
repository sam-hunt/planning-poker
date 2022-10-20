import useWebSocket from 'react-use-websocket';
import { useCallback, useEffect } from 'react';
import { RoomCommands } from 'types/room-messages.enum';
import { apiWsUrl } from '../env';
import type { RoomMessageBase } from '../types/room-message-base';
import type { StateChangedEvent } from '../types/events/state-changed.event';
import type { Room } from '../types/room';
import type { ReadyState, Options as WsOptions } from 'react-use-websocket';

export interface UseApiWebSocket {
  room: Room;
  sendCommand: (command: RoomMessageBase) => void;
  readyState: ReadyState;
}

export const useApiWebSocket = (): UseApiWebSocket => {
  const wsOptions: WsOptions = {
    share: true,
    shouldReconnect: () => true,
    reconnectAttempts: 20,
    reconnectInterval: 3,
    retryOnError: true,
  };
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(apiWsUrl, wsOptions);

  const room = (lastJsonMessage as StateChangedEvent)?.room;
  const sendCommand = useCallback((command: RoomMessageBase) => sendJsonMessage(command as any), [sendJsonMessage]);

  useEffect(() => {
    const interval = setInterval(() => sendCommand({ event: RoomCommands.Resync, ts: new Date().toISOString() }), 50000);
    return () => clearInterval(interval);
  }, [sendCommand]);

  return { room, sendCommand, readyState };
};
