import { reactive } from 'vue';

export type SocketEventHandler = (payload: any) => void;

const DEFAULT_PORTS = [3001, 3002, 3003, 3004, 3005];
const configuredSocketUrl = import.meta.env.VITE_WEBSOCKET_URL?.trim();

function productionSocketUrl() {
  if (configuredSocketUrl) {
    return configuredSocketUrl;
  }

  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/api/ws`;
}

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
    const socket = this.socket;
    this.socket = null;
    this.connectionState.status = 'disconnected';
    this.pendingAttempt = 0;
    this.sendQueue = [];
    socket?.close();
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
    if (!import.meta.env.DEV || configuredSocketUrl) {
      this.openSocket(productionSocketUrl());
      return;
    }

    const port = DEFAULT_PORTS[this.pendingAttempt];
    if (!port) {
      this.connectionState.status = 'disconnected';
      this.emit('error', { message: 'Unable to connect to the game server.' });
      return;
    }

    this.openSocket(`ws://localhost:${port}`, port);
  }

  private openSocket(url: string, port?: number) {
    const socket = new WebSocket(url);
    this.socket = socket;

    socket.addEventListener('open', () => {
      if (this.socket !== socket) {
        socket.close();
        return;
      }

      this.connectionState.status = 'connected';
      this.emit('connected', { url, port });
      this.flushQueue();
    });

    socket.addEventListener('message', (event) => {
      if (this.socket !== socket) {
        return;
      }

      try {
        const message = JSON.parse(event.data);
        this.emit(message.type, message.payload);
      } catch (error) {
        console.error('Failed to parse socket message', error);
      }
    });

    socket.addEventListener('close', () => {
      if (this.socket !== socket) {
        return;
      }

      this.socket = null;
      if (import.meta.env.DEV && !configuredSocketUrl) {
        this.pendingAttempt += 1;
        this.connectToNextPort();
        return;
      }

      this.connectionState.status = 'disconnected';
      this.emit('disconnected', { url });
    });

    socket.addEventListener('error', () => {
      // A failed WebSocket emits `close` next. Port fallback is handled there
      // so a single failure cannot start multiple connection attempts.
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
