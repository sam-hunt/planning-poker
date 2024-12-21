import { useContext } from 'react';
import { RoomContext } from '../App/RoomPage/RoomContext';

export const useRoom = () => useContext(RoomContext);
