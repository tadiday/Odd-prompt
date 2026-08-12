import type { WebSocket } from 'ws';
import { WS_EVENT, type PromptAssignment, type Room, type Vote } from '@odd-prompt/shared';
import { getRandomPromptPair } from '../prompts/promptSelector.js';
import {
  answersByRoom,
  recentPromptIdsByRoom,
  roomAssignments,
  rooms,
  roundPromptsByRoom,
  sessions,
  votesByRoom
} from './gameState.js';

const RECENT_PROMPT_LIMIT = 12;

export function broadcastToRoom(roomCode: string, event: string, payload: unknown, excludeSocket?: WebSocket) {
  for (const session of sessions.values()) {
    if (session.roomCode === roomCode && session.socket !== excludeSocket && session.socket) {
      session.socket.send(JSON.stringify({ type: event, payload }));
    }
  }
}

export function assignPromptsToRoom(room: Room): PromptAssignment[] {
  const playerIds = room.players.map((player) => player.id);
  const imposterCount = Math.min(room.options.imposterCount, playerIds.length - 1);
  const shuffledIds = [...playerIds].sort(() => Math.random() - 0.5);
  const imposterIds = new Set(shuffledIds.slice(0, imposterCount));
  const recentPromptIds = recentPromptIdsByRoom.get(room.code) ?? [];
  const promptPair = getRandomPromptPair(new Set(recentPromptIds));

  recentPromptIdsByRoom.set(
    room.code,
    [...recentPromptIds, promptPair.normalPromptId, promptPair.oddPromptId].slice(-RECENT_PROMPT_LIMIT)
  );

  return room.players.map((player) => ({
    playerId: player.id,
    role: imposterIds.has(player.id) ? 'imposter' : 'civilian',
    prompt: imposterIds.has(player.id) ? promptPair.oddPrompt : promptPair.normalPrompt
  }));
}

export function finalizeAnswerPhase(room: Room) {
  if (room.status !== 'answering') return;

  const currentAnswers = answersByRoom.get(room.code) ?? [];
  const allAnswers = room.players.map((player) => currentAnswers.find((answer) => answer.playerId === player.id) ?? {
    playerId: player.id,
    content: '',
    submittedAt: new Date().toISOString()
  });

  answersByRoom.set(room.code, allAnswers);
  room.status = 'discussion';
  room.phaseEndsAt = Date.now() + Number(room.options.discussionTimerSeconds ?? 60) * 1000;
  broadcastToRoom(room.code, WS_EVENT.roundReveal, { answers: allAnswers, prompts: roundPromptsByRoom.get(room.code) });
  broadcastToRoom(room.code, WS_EVENT.discussionStarted, {
    room,
    endsAt: room.phaseEndsAt,
    remainingSeconds: Number(room.options.discussionTimerSeconds ?? 60)
  });
  broadcastToRoom(room.code, WS_EVENT.roomUpdated, { room });

  setTimeout(() => {
    const activeRoom = rooms.get(room.code);
    if (activeRoom?.status === 'discussion') beginVotingPhase(activeRoom);
  }, Math.max(1000, Number(room.options.discussionTimerSeconds ?? 60) * 1000));
}

function beginVotingPhase(room: Room) {
  room.status = 'voting';
  room.phaseEndsAt = Date.now() + Number(room.options.votingTimerSeconds ?? 30) * 1000;
  votesByRoom.set(room.code, []);
  broadcastToRoom(room.code, WS_EVENT.votingStarted, {
    room,
    votingTimerSeconds: room.options.votingTimerSeconds,
    endsAt: room.phaseEndsAt,
    remainingSeconds: Number(room.options.votingTimerSeconds ?? 30)
  });
  broadcastToRoom(room.code, WS_EVENT.roomUpdated, { room });

  setTimeout(() => {
    const activeRoom = rooms.get(room.code);
    if (activeRoom?.status === 'voting') finalizeVoting(activeRoom);
  }, Math.max(1000, Number(room.options.votingTimerSeconds ?? 30) * 1000));
}

export function storeVote(room: Room, voterId: string, targetPlayerId: string, socket: WebSocket) {
  const votes = votesByRoom.get(room.code) ?? [];
  const existingVoteIndex = votes.findIndex((vote) => vote.voterId === voterId);
  const nextVote: Vote = { voterId, targetPlayerId, submittedAt: new Date().toISOString() };

  if (existingVoteIndex >= 0) votes[existingVoteIndex] = nextVote;
  else votes.push(nextVote);

  votesByRoom.set(room.code, votes);
  socket.send(JSON.stringify({ type: WS_EVENT.voteSubmitted, payload: { targetPlayerId } }));
  if (room.players.every((player) => votes.some((vote) => vote.voterId === player.id))) finalizeVoting(room);
}

function finalizeVoting(room: Room) {
  const votes = votesByRoom.get(room.code) ?? [];
  const tally = new Map<string, number>();
  for (const vote of votes) {
    if (vote.targetPlayerId !== 'skip') tally.set(vote.targetPlayerId, (tally.get(vote.targetPlayerId) ?? 0) + 1);
  }

  const sortedTally = [...tally.entries()]
    .map(([playerId, count]) => ({ playerId, count }))
    .sort((a, b) => b.count - a.count || a.playerId.localeCompare(b.playerId));
  const topCount = sortedTally[0]?.count ?? 0;
  const leaderIds = sortedTally.filter((entry) => entry.count === topCount).map((entry) => entry.playerId);
  const revealedRoles = room.players.map((player) => ({
    playerId: player.id,
    role: roomAssignments.get(room.code)?.get(player.id) ?? 'civilian' as const
  }));
  const winnerRole = leaderIds.length === 1 ? roomAssignments.get(room.code)?.get(leaderIds[0]) : undefined;
  const winningTeam = winnerRole === 'imposter' ? 'civilian' : 'imposter';

  room.status = 'results';
  room.phaseEndsAt = undefined;
  broadcastToRoom(room.code, WS_EVENT.votingResults, {
    roomCode: room.code,
    tally: sortedTally,
    winnerId: leaderIds.length === 1 ? leaderIds[0] : null,
    tiedPlayerIds: leaderIds.length > 1 ? leaderIds : [],
    totalVotes: votes.length,
    skipVotes: votes.filter((vote) => vote.targetPlayerId === 'skip').length,
    winningTeam,
    revealedRoles,
    prompts: roundPromptsByRoom.get(room.code)
  });
  broadcastToRoom(room.code, WS_EVENT.roomUpdated, { room });
}
