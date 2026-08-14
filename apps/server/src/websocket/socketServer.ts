import { WebSocketServer, WebSocket } from 'ws';
import { pathToFileURL } from 'node:url';
import { v4 as uuidv4 } from 'uuid';
import type { Room, Player, Answer, RoomOptions } from '@odd-prompt/shared';
import { WS_EVENT } from './wsEvents.js';
import { assignPromptsToRoom, broadcastToRoom, finalizeAnswerPhase, storeVote } from '../game/gamePhases.js';
import { answersByRoom, clearRoomState, recentPromptIdsByRoom, roomAssignments, rooms, roundPromptsByRoom, sessions, votesByRoom, type PlayerSession } from '../game/gameState.js';

const preferredPort = Number(process.env.PORT ?? 3001);

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer(preferredPort);
}

export function startServer(port: number) {
  const wss = new WebSocketServer({ port });

  attachGameSocketServer(wss);

  wss.on('listening', () => {
    const address = wss.address();
    const actualPort = typeof address === 'object' && address ? address.port : port;
    console.log(`Off Prompt server listening on ws://localhost:${actualPort}`);
  });

  wss.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is already in use. Trying ${port + 1} instead.`);
      wss.close();
      startServer(port + 1);
      return;
    }

    console.error('WebSocket server error', error);
  });
}

export function attachGameSocketServer(wss: WebSocketServer) {
  wss.on('connection', (socket) => {
    socket.on('message', (raw) => {
      try {
        const message = JSON.parse(raw.toString());
        handleMessage(socket, message);
      } catch (error) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidMessage', message: 'Message must be valid JSON.' } }));
      }
    });

    socket.on('close', () => {
      const session = sessions.get(socket);
      if (session) {
        const room = rooms.get(session.roomCode);
        sessions.delete(socket);
        if (room) {
          room.players = room.players.filter((player) => player.id !== session.id);

          if (room.players.length === 0) {
            rooms.delete(session.roomCode);
            clearRoomState(session.roomCode);
            recentPromptIdsByRoom.delete(session.roomCode);
          } else {
            if (room.hostId === session.id) {
              room.hostId = room.players[0].id;
              room.players = room.players.map((player) => ({
                ...player,
                isHost: player.id === room.hostId
              }));
            }
            broadcastToRoom(room.code, WS_EVENT.playerLeft, { playerId: session.id }, socket);
            broadcastToRoom(room.code, WS_EVENT.roomUpdated, { room });
          }
        }
      }
    });
  });

}

function handleMessage(socket: WebSocket, message: { type: string; payload?: any }) {
  console.log('server received ws message', message?.type, message?.payload);

  switch (message.type) {
    case WS_EVENT.createRoom: {
      const roomCode = generateRoomCode();
      const options = message.payload?.options ?? {
        imposterCount: 1,
        answerTimerSeconds: 45,
        discussionTimerSeconds: 60,
        votingTimerSeconds: 30,
        isPrivate: true
      };

      const session: PlayerSession = {
        id: uuidv4(),
        username: message.payload?.hostName || 'Host',
        avatarId: normalizeAvatarId(message.payload?.avatarId),
        roomCode,
        socket,
        isHost: true,
        isImposter: false,
        isConnected: true,
        joinedAt: new Date().toISOString(),
        score: 0
      };

      const player: Player = {
        id: session.id,
        roomId: roomCode,
        username: session.username,
        avatarId: session.avatarId,
        isHost: session.isHost,
        isImposter: session.isImposter,
        isConnected: session.isConnected,
        sessionId: session.id,
        joinedAt: session.joinedAt,
        score: session.score
      };

      const room: Room = {
        id: uuidv4(),
        code: roomCode,
        hostId: session.id,
        isPrivate: options.isPrivate,
        options,
        status: 'waiting',
        players: [{ ...player, isHost: true }],
        currentRoundId: undefined,
        createdAt: new Date().toISOString()
      };

      sessions.set(socket, session);
      rooms.set(roomCode, room);
      console.log('server roomCreated', {
        room,
        player: { ...player, isHost: true }
      });
      socket.send(JSON.stringify({
        type: WS_EVENT.roomCreated,
        payload: {
          room,
          player: { ...player, isHost: true }
        }
      }));
      break;
    }
    case WS_EVENT.joinRoom: {
      const room = rooms.get(message.payload?.roomCode);
      if (!room) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidRoomCode', message: 'Room not found.' } }));
        return;
      }

      if (room.players.some((player) => player.username === message.payload?.playerName)) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'duplicateUsername', message: 'Username already taken in this room.' } }));
        return;
      }

      const session: PlayerSession = {
        id: uuidv4(),
        username: message.payload?.playerName || 'Player',
        avatarId: normalizeAvatarId(message.payload?.avatarId),
        roomCode: room.code,
        socket,
        isHost: false,
        isImposter: false,
        isConnected: true,
        joinedAt: new Date().toISOString(),
        score: 0
      };

      const player: Player = {
        id: session.id,
        roomId: room.code,
        username: session.username,
        avatarId: session.avatarId,
        isHost: session.isHost,
        isImposter: session.isImposter,
        isConnected: session.isConnected,
        sessionId: session.id,
        joinedAt: session.joinedAt,
        score: session.score
      };

      sessions.set(socket, session);
      room.players.push({ ...player, isHost: false });

      socket.send(JSON.stringify({
        type: WS_EVENT.roomJoined,
        payload: {
          room,
          player: { ...player, isHost: false }
        }
      }));

      broadcastToRoom(room.code, WS_EVENT.playerJoined, { player });
      broadcastToRoom(room.code, WS_EVENT.roomUpdated, { room });
      break;
    }
    case WS_EVENT.startGame: {
      const room = rooms.get(message.payload?.roomCode);
      if (!room) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidRoomCode', message: 'Room not found.' } }));
        return;
      }

      const session = sessions.get(socket);
      if (!session || session.roomCode !== room.code || room.hostId !== session.id) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'notHost', message: 'Only the host can start the game.' } }));
        return;
      }

      if (room.status !== 'waiting') {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidStateTransition', message: 'Game has already started.' } }));
        return;
      }

      const roundId = uuidv4();
      room.currentRoundId = roundId;
      room.status = 'answering';
      room.phaseEndsAt = Date.now() + (Number(room.options.answerTimerSeconds ?? 30) * 1000);
      answersByRoom.set(room.code, []);
      votesByRoom.set(room.code, []);

      const assignments = assignPromptsToRoom(room);
      const assignmentMap = new Map<string, 'civilian' | 'imposter'>();

      roundPromptsByRoom.set(room.code, {
        actualPrompt:
          assignments.find((entry) => entry.role === 'civilian')?.prompt ?? '',
        oddPrompt:
          assignments.find((entry) => entry.role === 'imposter')?.prompt ?? ''
      });

      room.players = room.players.map((player) => {
        const assignment = assignments.find((entry) => entry.playerId === player.id);
        const role = assignment?.role ?? 'civilian';
        assignmentMap.set(player.id, role);
        return {
          ...player,
          isImposter: role === 'imposter'
        };
      });

      roomAssignments.set(room.code, assignmentMap);

      for (const assignment of assignments) {
        const targetSession = Array.from(sessions.values()).find((session) => session.roomCode === room.code && session.id === assignment.playerId);
        if (targetSession) {
          targetSession.isImposter = assignment.role === 'imposter';
        }
        if (targetSession?.socket) {
          targetSession.socket.send(JSON.stringify({ type: WS_EVENT.promptAssigned, payload: assignment }));
        }
      }

      setTimeout(() => {
        const activeRoom = rooms.get(room.code);
        if (!activeRoom || activeRoom.status !== 'answering') {
          return;
        }

        finalizeAnswerPhase(activeRoom);
      }, Number(room.options.answerTimerSeconds ?? 30) * 1000);

      broadcastToRoom(room.code, WS_EVENT.gameStarted, { room });
      broadcastToRoom(room.code, WS_EVENT.roomUpdated, { room });
      break;
    }
    case WS_EVENT.updateHostSettings: {
      const room = rooms.get(message.payload?.roomCode);
      if (!room) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidRoomCode', message: 'Room not found.' } }));
        return;
      }

      const session = sessions.get(socket);
      if (!session || session.roomCode !== room.code || room.hostId !== session.id) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'notHost', message: 'Only the host can update settings.' } }));
        return;
      }

      const setting = String(message.payload?.setting || '');
      const rawValue = message.payload?.value;

      switch (setting) {
        case 'gameMode':
          room.options.gameMode = String(rawValue || 'classic');
          break;
        case 'maxPlayers':
          room.options.maxPlayers = Number(rawValue);
          break;
        case 'answerTimerSeconds':
          room.options.answerTimerSeconds = Number(rawValue);
          break;
        case 'discussionTimerSeconds':
          room.options.discussionTimerSeconds = Number(rawValue);
          break;
        case 'votingTimerSeconds':
          room.options.votingTimerSeconds = Number(rawValue);
          break;
        case 'imposterCount':
          room.options.imposterCount = Number(rawValue);
          break;
        default:
          socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidSetting', message: 'Unknown setting.' } }));
          return;
      }

      broadcastToRoom(room.code, WS_EVENT.roomUpdated, { room });
      break;
    }
    case WS_EVENT.submitAnswer: {
      const room = rooms.get(message.payload?.roomCode);
      if (!room) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidRoomCode', message: 'Room not found.' } }));
        return;
      }

      const session = sessions.get(socket);
      if (!session || session.roomCode !== room.code) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidSession', message: 'Player session not found.' } }));
        return;
      }

      if (room.status !== 'answering') {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidStateTransition', message: 'The room is not accepting answers right now.' } }));
        return;
      }

      const trimmedAnswer = String(message.payload?.answer ?? '');

      const answers = answersByRoom.get(room.code) ?? [];
      if (answers.some((existing) => existing.playerId === session.id)) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'duplicateAnswer', message: 'You already submitted an answer for this round.' } }));
        return;
      }

      const answer: Answer = {
        playerId: session.id,
        content: trimmedAnswer,
        submittedAt: new Date().toISOString()
      };

      answers.push(answer);
      answersByRoom.set(room.code, answers);
      broadcastToRoom(room.code, WS_EVENT.answerSubmitted, { answer });

      if (answers.length >= room.players.length) {
        finalizeAnswerPhase(room);
      }
      break;
    }
    case WS_EVENT.submitVote: {
      const room = rooms.get(message.payload?.roomCode);
      if (!room) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidRoomCode', message: 'Room not found.' } }));
        return;
      }

      const session = sessions.get(socket);
      if (!session || session.roomCode !== room.code) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidSession', message: 'Player session not found.' } }));
        return;
      }

      if (room.status !== 'voting') {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidStateTransition', message: 'The room is not accepting votes right now.' } }));
        return;
      }

      const targetPlayerId = String(message.payload?.targetPlayerId ?? '').trim();
      if (!targetPlayerId || targetPlayerId === session.id || !room.players.some((player) => player.id === targetPlayerId)) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidVoteTarget', message: 'You must vote for a valid opponent.' } }));
        return;
      }

      const targetPlayer = room.players.find((player) => player.id === targetPlayerId);
      if (!targetPlayer) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidVoteTarget', message: 'Target player was not found.' } }));
        return;
      }

      storeVote(room, session.id, targetPlayerId, socket);
      break;
    }
    case WS_EVENT.skipVote: {
      const room = rooms.get(message.payload?.roomCode);
      if (!room) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidRoomCode', message: 'Room not found.' } }));
        return;
      }

      const session = sessions.get(socket);
      if (!session || session.roomCode !== room.code) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidSession', message: 'Player session not found.' } }));
        return;
      }

      if (room.status !== 'voting') {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidStateTransition', message: 'The room is not accepting votes right now.' } }));
        return;
      }

      storeVote(room, session.id, 'skip', socket);
      break;
    }
    case WS_EVENT.readyForNextRound: {
      const room = rooms.get(message.payload?.roomCode);
      const session = sessions.get(socket);

      if (!room || !session || session.roomCode !== room.code) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidSession', message: 'Room or player session not found.' } }));
        return;
      }

      if (room.hostId !== session.id) {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'notHost', message: 'Only the host can start another round.' } }));
        return;
      }

      if (room.status !== 'results') {
        socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'invalidStateTransition', message: 'The current round has not finished.' } }));
        return;
      }

      room.status = 'waiting';
      room.currentRoundId = undefined;
      room.phaseEndsAt = undefined;
      room.players = room.players.map((player) => ({
        ...player,
        isImposter: false
      }));

      answersByRoom.delete(room.code);
      votesByRoom.delete(room.code);
      roomAssignments.delete(room.code);
      roundPromptsByRoom.delete(room.code);

      for (const playerSession of sessions.values()) {
        if (playerSession.roomCode === room.code) {
          playerSession.isImposter = false;
        }
      }

      broadcastToRoom(room.code, WS_EVENT.roomUpdated, { room });
      break;
    }
    default:
      console.warn('unsupported ws message type received:', message.type, message.payload);
      socket.send(JSON.stringify({ type: WS_EVENT.error, payload: { code: 'unsupportedMessage', message: 'This message type is not supported yet.' } }));
  }
}

function generateRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function normalizeAvatarId(value: unknown) {
  const avatarId = String(value ?? 'cool-cat');
  const allowedAvatarIds = new Set([
    'cool-cat', 'cool-dog', 'cool-panda', 'cool-mouse',
    'cool-parrot', 'cool-bear', 'cool-rabbit', 'cool-fox',
    'cool-shiba', 'cool-lion', 'cool-cow', 'cool-owl'
  ]);

  return allowedAvatarIds.has(avatarId) ? avatarId : 'cool-cat';
}
