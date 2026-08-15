import { reactive } from 'vue';
import type { ClientEventPayloadMap, ServerEventPayloadMap } from '@odd-prompt/shared';

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected';
type SocketLifecycleEventMap = {
  connected: { url: string; port?: number };
  disconnected: { url: string };
};
type SocketEventMap = ServerEventPayloadMap & SocketLifecycleEventMap;
type SocketEvent = keyof SocketEventMap;
type SocketEventHandler<Event extends SocketEvent> = (payload: SocketEventMap[Event]) => void;
type QueuedMessage = {
  [Event in keyof ClientEventPayloadMap]: {
    type: Event;
    payload: ClientEventPayloadMap[Event];
  }
}[keyof ClientEventPayloadMap];

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
  private handlers = new Map<SocketEvent, Set<(payload: never) => void>>();
  private connectionState = reactive({ status: 'disconnected' as ConnectionStatus });
  private pendingAttempt = 0;
  private sendQueue: QueuedMessage[] = [];

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

  on<Event extends SocketEvent>(event: Event, handler: SocketEventHandler<Event>) {
    const handlers = this.handlers.get(event) ?? new Set<(payload: never) => void>();
    handlers.add(handler as (payload: never) => void);
    this.handlers.set(event, handlers);
  }

  off<Event extends SocketEvent>(event: Event, handler: SocketEventHandler<Event>) {
    this.handlers.get(event)?.delete(handler as (payload: never) => void);
  }

  send<Event extends keyof ClientEventPayloadMap>(type: Event, payload: ClientEventPayloadMap[Event]) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type, payload, timestamp: new Date().toISOString() }));
      return;
    }

    this.sendQueue.push({ type, payload } as QueuedMessage);
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
      this.emit('error', {
        code: 'connectionFailed',
        message: 'Unable to connect to the game server.',
      });
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
        const message = JSON.parse(event.data) as { type?: SocketEvent; payload?: unknown };
        if (message.type) {
          this.emit(message.type, message.payload as SocketEventMap[typeof message.type]);
        }
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

  private emit<Event extends SocketEvent>(event: Event, payload: SocketEventMap[Event]) {
    this.handlers.get(event)?.forEach((handler) => handler(payload as never));
  }
}

export const socketService = new GameSocketService();
