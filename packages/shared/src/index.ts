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
  gameMode?: string;
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
  avatarId: string;
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

export type NumericRoomSetting =
  | 'maxPlayers'
  | 'answerTimerSeconds'
  | 'discussionTimerSeconds'
  | 'votingTimerSeconds'
  | 'imposterCount';

export type RoomSetting = NumericRoomSetting | 'gameMode';

export type RoomSettingValue<Setting extends RoomSetting> =
  Setting extends 'gameMode' ? string : number;

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
  avatarId: string;
  options: RoomOptions;
}

export interface JoinRoomPayload {
  roomCode: string;
  playerName: string;
  avatarId: string;
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

export interface RoomCodePayload {
  roomCode: string;
}

export interface UpdateHostSettingsPayload extends RoomCodePayload {
  setting: RoomSetting;
  value: string | number;
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
  voteSubmitted: 'voteSubmitted',
  votingResults: 'votingResults',
  roundEnded: 'roundEnded',
  roomClosed: 'roomClosed',
  error: 'error',
} as const;

export type WSEventKey = keyof typeof WS_EVENT;
export type ClientMessage =
  | BaseMessage<CreateRoomPayload, typeof WS_EVENT.createRoom>
  | BaseMessage<JoinRoomPayload, typeof WS_EVENT.joinRoom>
  | BaseMessage<RoomCodePayload, typeof WS_EVENT.leaveRoom>
  | BaseMessage<StartGamePayload, typeof WS_EVENT.startGame>
  | BaseMessage<UpdateHostSettingsPayload, typeof WS_EVENT.updateHostSettings>
  | BaseMessage<SubmitAnswerPayload, typeof WS_EVENT.submitAnswer>
  | BaseMessage<SubmitVotePayload, typeof WS_EVENT.submitVote>
  | BaseMessage<SubmitVotePayload, typeof WS_EVENT.skipVote>
  | BaseMessage<RoomCodePayload, typeof WS_EVENT.readyForNextRound>;

export interface ClientEventPayloadMap {
  [WS_EVENT.createRoom]: CreateRoomPayload;
  [WS_EVENT.joinRoom]: JoinRoomPayload;
  [WS_EVENT.leaveRoom]: RoomCodePayload;
  [WS_EVENT.startGame]: StartGamePayload;
  [WS_EVENT.updateHostSettings]: UpdateHostSettingsPayload;
  [WS_EVENT.submitAnswer]: SubmitAnswerPayload;
  [WS_EVENT.submitVote]: SubmitVotePayload;
  [WS_EVENT.skipVote]: SubmitVotePayload;
  [WS_EVENT.readyForNextRound]: RoomCodePayload;
}

export interface ErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface VotingResults {
  roomCode: string;
  tally: Array<{ playerId: string; count: number }>;
  winnerId: string | null;
  tiedPlayerIds: string[];
  totalVotes: number;
  skipVotes: number;
  winningTeam?: 'imposter' | 'civilian';
  revealedRoles?: Array<{ playerId: string; role: 'imposter' | 'civilian' }>;
  prompts?: RoundPrompts;
}

export type ServerMessage =
  | BaseMessage<{ room: Room; player: Player }, typeof WS_EVENT.roomCreated>
  | BaseMessage<{ room: Room; player: Player }, typeof WS_EVENT.roomJoined>
  | BaseMessage<{ room: Room }, typeof WS_EVENT.roomUpdated>
  | BaseMessage<{ player: Player }, typeof WS_EVENT.playerJoined>
  | BaseMessage<{ playerId: string; reason?: string }, typeof WS_EVENT.playerLeft>
  | BaseMessage<{ room: Room }, typeof WS_EVENT.gameStarted>
  | BaseMessage<PromptAssignment, typeof WS_EVENT.promptAssigned>
  | BaseMessage<{ answer: Answer }, typeof WS_EVENT.answerSubmitted>
  | BaseMessage<{ answers: Answer[]; prompts?: RoundPrompts }, typeof WS_EVENT.roundReveal>
  | BaseMessage<{ room: Room; endsAt?: number; remainingSeconds?: number }, typeof WS_EVENT.discussionStarted>
  | BaseMessage<{ room: Room; endsAt?: number; remainingSeconds?: number }, typeof WS_EVENT.votingStarted>
  | BaseMessage<{ targetPlayerId: string }, typeof WS_EVENT.voteSubmitted>
  | BaseMessage<VotingResults, typeof WS_EVENT.votingResults>
  | BaseMessage<{ room: Room }, typeof WS_EVENT.roundEnded>
  | BaseMessage<ErrorPayload, typeof WS_EVENT.error>;

export interface ServerEventPayloadMap {
  [WS_EVENT.roomCreated]: { room: Room; player: Player };
  [WS_EVENT.roomJoined]: { room: Room; player: Player };
  [WS_EVENT.roomUpdated]: { room: Room };
  [WS_EVENT.playerJoined]: { player: Player };
  [WS_EVENT.playerLeft]: { playerId: string; reason?: string };
  [WS_EVENT.gameStarted]: { room: Room };
  [WS_EVENT.promptAssigned]: PromptAssignment;
  [WS_EVENT.answerSubmitted]: { answer: Answer };
  [WS_EVENT.roundReveal]: { answers: Answer[]; prompts?: RoundPrompts };
  [WS_EVENT.discussionStarted]: { room: Room; endsAt?: number; remainingSeconds?: number };
  [WS_EVENT.votingStarted]: { room: Room; endsAt?: number; remainingSeconds?: number };
  [WS_EVENT.voteSubmitted]: { targetPlayerId: string };
  [WS_EVENT.votingResults]: VotingResults;
  [WS_EVENT.roundEnded]: { room: Room };
  [WS_EVENT.roomClosed]: { reason?: string };
  [WS_EVENT.error]: ErrorPayload;
}
