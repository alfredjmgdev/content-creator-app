import { Server } from 'socket.io';
import { ExplorerData } from '../types/types';

export class SocketService {
  private static instance: SocketService;
  private io: Server | null = null;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  setIO(io: Server): void {
    this.io = io;
  }

  getIO(): Server {
    if (!this.io) {
      throw new Error('Socket.io instance not initialized');
    }
    return this.io;
  }

  emitContentUpdate(data: ExplorerData) {
    if (this.io) {
      this.io.emit('contentUpdated', { test: 'Hello from server' });
      this.io.emit('contentUpdated', data);
    }
  }
}
