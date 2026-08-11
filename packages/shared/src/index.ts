export type GamePhase =
  | 'waiting'
  | 'prompt-distribution'
  | 'answering'
  | 'reveal'
  | 'discussion'
  | 'voting'
  | 'results'
  | 'next-round';

export interface RoomOptions {
  imposterCount: number;
  answerTimerSeconds: number;
  discussionTimerSeconds: number;
  votingTimerSeconds: number;
  maxPlayers?: number;
  isPrivate: boolean;
}

export interface Player {
  id: string;
  roomId?: string;
  username: string;
  isHost: boolean;
  isImposter: boolean;
  isConnected: boolean;
  sessionId?: string;
  joinedAt: string;
  score: number;
}

export interface Room {
  id: string;
  code: string;
  hostId: string;
  isPrivate: boolean;
  options: RoomOptions;
  status: GamePhase;
  players: Player[];
  currentRoundId?: string;
  phaseEndsAt?: number;
  createdAt: string;
}

export interface PromptAssignment {
  playerId: string;
  role: 'civilian' | 'imposter';
  prompt: string;
}

export interface RoundPrompts {
  actualPrompt: string;
  oddPrompt: string;
}

export interface Answer {
  playerId: string;
  content: string;
  submittedAt: string;
}

export interface Vote {
  voterId: string;
  targetPlayerId: string;
  submittedAt: string;
}

export interface CreateRoomPayload {
  hostName: string;
  options: RoomOptions;
}

export interface JoinRoomPayload {
  roomCode: string;
  playerName: string;
}

export interface StartGamePayload {
  roomCode: string;
}

export interface SubmitAnswerPayload {
  roomCode: string;
  answer: string;
}

export interface SubmitVotePayload {
  roomCode: string;
  targetPlayerId: string;
}

export interface BaseMessage<T, Type extends string = string> {
  type: Type;
  payload: T;
  requestId?: string;
  timestamp: string;
}

export const WS_EVENT = {
  createRoom: 'createRoom',
  joinRoom: 'joinRoom',
  leaveRoom: 'leaveRoom',
  startGame: 'startGame',
  updateHostSettings: 'updateHostSettings',
  submitAnswer: 'submitAnswer',
  submitVote: 'submitVote',
  skipVote: 'skipVote',
  readyForNextRound: 'readyForNextRound',
  roomCreated: 'roomCreated',
  roomJoined: 'roomJoined',
  roomUpdated: 'roomUpdated',
  playerJoined: 'playerJoined',
  playerLeft: 'playerLeft',
  gameStarted: 'gameStarted',
  promptAssigned: 'promptAssigned',
  answerSubmitted: 'answerSubmitted',
  roundReveal: 'roundReveal',
  discussionStarted: 'discussionStarted',
  votingStarted: 'votingStarted',
  votingResults: 'votingResults',
  roundEnded: 'roundEnded',
  roomClosed: 'roomClosed',
  error: 'error',
} as const;

export type WSEventKey = keyof typeof WS_EVENT;
export type ClientMessage =
  | BaseMessage<CreateRoomPayload, typeof WS_EVENT.createRoom>
  | BaseMessage<JoinRoomPayload, typeof WS_EVENT.joinRoom>
  | BaseMessage<StartGamePayload, typeof WS_EVENT.startGame>
  | BaseMessage<SubmitAnswerPayload, typeof WS_EVENT.submitAnswer>
  | BaseMessage<SubmitVotePayload, typeof WS_EVENT.submitVote>;

export interface ErrorPayload {
  code: string;
  message: string;
  details?: any;
}

export type ServerMessage =
  | BaseMessage<{ room: Room; player: Player }, typeof WS_EVENT.roomCreated>
  | BaseMessage<{ room: Room; player: Player }, typeof WS_EVENT.roomJoined>
  | BaseMessage<{ room: Room }, typeof WS_EVENT.roomUpdated>
  | BaseMessage<{ player: Player }, typeof WS_EVENT.playerJoined>
  | BaseMessage<{ playerId: string; reason?: string }, typeof WS_EVENT.playerLeft>
  | BaseMessage<{ room: Room }, typeof WS_EVENT.gameStarted>
  | BaseMessage<any, typeof WS_EVENT.promptAssigned>
  | BaseMessage<any, typeof WS_EVENT.answerSubmitted>
  | BaseMessage<any, typeof WS_EVENT.roundReveal>
  | BaseMessage<any, typeof WS_EVENT.discussionStarted>
  | BaseMessage<any, typeof WS_EVENT.votingStarted>
  | BaseMessage<any, typeof WS_EVENT.votingResults>
  | BaseMessage<any, typeof WS_EVENT.roundEnded>
  | BaseMessage<ErrorPayload, typeof WS_EVENT.error>;
