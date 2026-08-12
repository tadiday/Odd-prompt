import type { WebSocket } from 'ws';
import type { Answer, Room, RoundPrompts, Vote } from '@odd-prompt/shared';

export interface PlayerSession {
  id: string;
  username: string;
  avatarId: string;
  roomCode: string;
  socket?: WebSocket;
  isHost: boolean;
  isImposter: boolean;
  isConnected: boolean;
  joinedAt: string;
  score: number;
}

export const sessions = new Map<WebSocket, PlayerSession>();
export const rooms = new Map<string, Room>();
export const answersByRoom = new Map<string, Answer[]>();
export const votesByRoom = new Map<string, Vote[]>();
export const roomAssignments = new Map<string, Map<string, 'civilian' | 'imposter'>>();
export const roundPromptsByRoom = new Map<string, RoundPrompts>();
export const recentPromptIdsByRoom = new Map<string, string[]>();

export function clearRoomState(roomCode: string) {
  answersByRoom.delete(roomCode);
  votesByRoom.delete(roomCode);
  roomAssignments.delete(roomCode);
  roundPromptsByRoom.delete(roomCode);
}
