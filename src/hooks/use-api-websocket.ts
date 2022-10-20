import useWebSocket from 'react-use-websocket';
import { useCallback } from 'react';
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
    reconnectAttempts: 12,
    reconnectInterval: 5,
  };
  const { lastJsonMessage, sendJsonMessage, readyState } = useWebSocket(apiWsUrl, wsOptions);

  const room = (lastJsonMessage as StateChangedEvent)?.room;
  const sendCommand = useCallback((command: RoomMessageBase) => sendJsonMessage(command as any), [sendJsonMessage]);

  return { room, sendCommand, readyState };
};
