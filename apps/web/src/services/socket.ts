import { reactive } from 'vue';

export type SocketEventHandler = (payload: any) => void;

const DEFAULT_PORTS = [3001, 3002, 3003, 3004, 3005];

class GameSocketService {
  private socket: WebSocket | null = null;
  private handlers = new Map<string, Set<SocketEventHandler>>();
  private connectionState = reactive({ status: 'disconnected' as 'disconnected' | 'connecting' | 'connected' });
  private pendingAttempt = 0;
  private sendQueue: Array<{ type: string; payload: unknown }> = [];

  connect() {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.connectionState.status = 'connecting';
    this.pendingAttempt = 0;
    this.connectToNextPort();
  }

  disconnect() {
    this.socket?.close();
    this.socket = null;
    this.connectionState.status = 'disconnected';
    this.sendQueue = [];
  }

  on(event: string, handler: SocketEventHandler) {
    const handlers = this.handlers.get(event) ?? new Set<SocketEventHandler>();
    handlers.add(handler);
    this.handlers.set(event, handlers);
  }

  off(event: string, handler: SocketEventHandler) {
    this.handlers.get(event)?.delete(handler);
  }

  send(type: string, payload: unknown) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload, timestamp: new Date().toISOString() }));
      return;
    }

    this.sendQueue.push({ type, payload });
    this.connect();
  }

  getConnectionState() {
    return this.connectionState;
  }

  private connectToNextPort() {
    const port = DEFAULT_PORTS[this.pendingAttempt];
    if (!port) {
      this.connectionState.status = 'disconnected';
      this.emit('error', { message: 'Unable to connect to the game server.' });
      return;
    }

    this.socket = new WebSocket(`ws://localhost:${port}`);

    this.socket.addEventListener('open', () => {
      this.connectionState.status = 'connected';
      this.emit('connected', { port });
      this.flushQueue();
    });

    this.socket.addEventListener('message', (event) => {
      try {
        const message = JSON.parse(event.data);
        this.emit(message.type, message.payload);
      } catch (error) {
        console.error('Failed to parse socket message', error);
      }
    });

    this.socket.addEventListener('close', () => {
      if (this.socket?.readyState !== WebSocket.OPEN) {
        this.pendingAttempt += 1;
        this.connectToNextPort();
      }
      if (this.socket?.readyState === WebSocket.CLOSED) {
        this.connectionState.status = 'disconnected';
        this.emit('disconnected', { reason: 'socketClosed' });
      }
    });

    this.socket.addEventListener('error', () => {
      if (this.socket?.readyState !== WebSocket.OPEN) {
        this.pendingAttempt += 1;
        this.connectToNextPort();
      }
    });
  }

  private flushQueue() {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      return;
    }

    while (this.sendQueue.length > 0) {
      const message = this.sendQueue.shift();
      if (message) {
        this.socket.send(JSON.stringify({ type: message.type, payload: message.payload, timestamp: new Date().toISOString() }));
      }
    }
  }

  private emit(event: string, payload: unknown) {
    this.handlers.get(event)?.forEach((handler) => handler(payload));
  }
}

export const socketService = new GameSocketService();
