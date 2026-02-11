// store/socket.store.ts
import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '@/lib/api-client';

interface SocketState {
  socket: Socket | null;
  sessionId: string | null;
  isConnected: boolean;
  // Actions
  initializeSocket: (token: string) => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  sessionId: null,
  isConnected: false,

  initializeSocket: (token: string) => {
    // Prevent multiple connections
    if (get().socket?.connected) return;

    const socket = io(`${BASE_URL}:3000/realtime`, {
      auth: { token },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      set({ 
        isConnected: true, 
        sessionId: socket.id // Socket.io uses the socket.id as a session identifier
      });
      console.log('Connected with Session ID:', socket.id);
    });

    socket.on('disconnect', () => {
      set({ isConnected: false, sessionId: null });
    });

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, sessionId: null, isConnected: false });
    }
  },
}));