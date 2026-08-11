import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';
import { WS_EVENT, Room, Player, ErrorPayload, RoomOptions, PromptAssignment, Answer, RoundPrompts } from '@odd-prompt/shared';
import { socketService } from '../services/socket';

export const useGameStore = defineStore('game', () => {
  const currentRoom = ref<Room | null>(null);
  const currentPlayer = ref<Player | null>(null);
  const connectionStatus = ref<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const errorMessage = ref<string | null>(null);
  const phaseEndsAt = ref<number | null>(null);
  const countdownTick = ref(0);
  let countdownInterval: number | null = null;

  socketService.on('connected', () => {
    connectionStatus.value = 'connected';
  });

  socketService.on('disconnected', () => {
    connectionStatus.value = 'disconnected';
  });

  socketService.on(WS_EVENT.roomCreated, (payload: { room: Room; player: Player }) => {
    const normalizedPlayer = {
      ...payload.player,
      isHost: payload.player.isHost ?? true
    };

    const normalizedRoom = {
      ...payload.room,
      hostId: payload.room.hostId ?? normalizedPlayer.id,
      status: payload.room.status ?? 'waiting',
      players: payload.room.players.map((player) => ({
        ...player,
        isHost: player.isHost ?? player.id === normalizedPlayer.id
      }))
    };

    currentRoom.value = normalizedRoom;
    currentPlayer.value = normalizedPlayer;
    resetRoundState();
  });

  socketService.on(WS_EVENT.roomJoined, (payload: { room: Room; player: Player }) => {
    currentRoom.value = payload.room;
    currentPlayer.value = payload.player;
    resetRoundState();
  });

  socketService.on(WS_EVENT.roomUpdated, (payload: { room: Room }) => {
    currentRoom.value = payload.room;
    phaseEndsAt.value = payload.room.phaseEndsAt ?? null;

    if (payload.room.status === 'waiting') {
      resetRoundState();
    }
  });

  socketService.on(WS_EVENT.promptAssigned, (payload: PromptAssignment) => {
    currentPlayerPrompt.value = payload;
  });

  socketService.on(WS_EVENT.answerSubmitted, (payload: { answer: Answer }) => {
    if (currentPlayer.value && payload.answer.playerId === currentPlayer.value.id) {
      submittedAnswer.value = payload.answer;
    }
  });

  socketService.on(WS_EVENT.roundReveal, (payload: { answers: Answer[]; prompts?: RoundPrompts }) => {
    revealAnswers.value = payload.answers;
    revealedPrompts.value = payload.prompts ?? null;
  });

  socketService.on(WS_EVENT.discussionStarted, (payload: { room: Room; endsAt?: number; remainingSeconds?: number }) => {
    currentRoom.value = payload.room;
    phaseEndsAt.value = payload.endsAt ?? null;
  });

  socketService.on(WS_EVENT.votingStarted, (payload: { room: Room; endsAt?: number; remainingSeconds?: number }) => {
    currentRoom.value = payload.room;
    phaseEndsAt.value = payload.endsAt ?? null;
    votingResults.value = null;
  });

  socketService.on(WS_EVENT.votingResults, (payload: {
    roomCode: string;
    tally: Array<{ playerId: string; count: number }>;
    winnerId: string | null;
    tiedPlayerIds: string[];
    totalVotes: number;
    skipVotes: number;
    winningTeam?: 'imposter' | 'civilian';
    revealedRoles?: Array<{ playerId: string; role: 'imposter' | 'civilian' }>;
    prompts?: RoundPrompts;
  }) => {
    votingResults.value = payload;
    revealedPrompts.value = payload.prompts ?? revealedPrompts.value;
    if (currentRoom.value) {
      currentRoom.value = {
        ...currentRoom.value,
        status: 'results'
      };
    }
  });

  socketService.on(WS_EVENT.playerJoined, (payload: { player: Player }) => {
    if (currentRoom.value) {
      currentRoom.value = {
        ...currentRoom.value,
        players: [...currentRoom.value.players, payload.player]
      };
    }
  });

  socketService.on(WS_EVENT.playerLeft, (payload: { playerId: string }) => {
    if (currentRoom.value) {
      currentRoom.value = {
        ...currentRoom.value,
        players: currentRoom.value.players.filter((player) => player.id !== payload.playerId)
      };
    }
  });

  socketService.on(WS_EVENT.gameStarted, (payload: { room: Room }) => {
    currentRoom.value = payload.room;
    phaseEndsAt.value = payload.room.phaseEndsAt ?? null;
  });

  socketService.on(WS_EVENT.error, (payload: ErrorPayload) => {
    errorMessage.value = payload.message;
  });

  const roomCode = computed(() => currentRoom.value?.code ?? null);
  const roomPlayers = computed(() => currentRoom.value?.players ?? []);
  const currentPlayerPrompt = ref<PromptAssignment | null>(null);
  const submittedAnswer = ref<Answer | null>(null);
  const revealAnswers = ref<Answer[] | null>(null);
  const revealedPrompts = ref<RoundPrompts | null>(null);
  const votingResults = ref<{
    roomCode: string;
    tally: Array<{ playerId: string; count: number }>;
    winnerId: string | null;
    tiedPlayerIds: string[];
    totalVotes: number;
    skipVotes: number;
    winningTeam?: 'imposter' | 'civilian';
    revealedRoles?: Array<{ playerId: string; role: 'imposter' | 'civilian' }>;
    prompts?: RoundPrompts;
  } | null>(null);



  function resetRoundState() {
    currentPlayerPrompt.value = null;
    submittedAnswer.value = null;
    revealAnswers.value = null;
    revealedPrompts.value = null;
    votingResults.value = null;
    phaseEndsAt.value = null;
  }

  const roomStatus = computed(() => currentRoom.value?.status ?? 'waiting');
  const phaseCountdown = computed(() => {
    if (!phaseEndsAt.value) {
      return null;
    }

    // This reference keeps the computed reactive while the countdown timer ticks.
    void countdownTick.value;
    return Math.max(0, Math.ceil((phaseEndsAt.value - Date.now()) / 1000));
  });

  watch(phaseEndsAt, (value) => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }

    if (!value) {
      countdownTick.value = 0;
      return;
    }

    const tick = () => {
      countdownTick.value = Date.now();
    };

    tick();
    countdownInterval = window.setInterval(tick, 1000);
  }, { immediate: true });

  watch(roomStatus, (status) => {
    if (status !== 'discussion' && status !== 'voting') {
      phaseEndsAt.value = null;
    }
  });
  const isHost = computed(() => {
    if (!currentRoom.value || !currentPlayer.value) {
      return false;
    }
    return currentPlayer.value.isHost || currentRoom.value.hostId === currentPlayer.value.id;
  });

  function createRoom(hostName: string) {
    const options: RoomOptions = {
      imposterCount: 1,
      answerTimerSeconds: 3600,
      discussionTimerSeconds: 10,
      votingTimerSeconds: 10,
      isPrivate: true
    };

    leaveRoom();
    errorMessage.value = null;
    socketService.connect();
    socketService.send(WS_EVENT.createRoom, { hostName, options });
  }

  function joinRoom(roomCodeInput: string, playerName: string) {
    leaveRoom();
    errorMessage.value = null;
    socketService.connect();
    socketService.send(WS_EVENT.joinRoom, { roomCode: roomCodeInput, playerName });
  }

  function leaveRoom() {
    currentRoom.value = null;
    currentPlayer.value = null;
    errorMessage.value = null;
    resetRoundState();
    socketService.disconnect();
  }

  function startGame() {
    if (!currentRoom.value) {
      return;
    }
    errorMessage.value = null;
    socketService.send(WS_EVENT.startGame, { roomCode: currentRoom.value.code });
  }

  function updateRoomSetting(
    setting: 'maxPlayers' | 'answerTimerSeconds' | 'votingTimerSeconds' | 'imposterCount',
    value: number
  ) {
    if (!currentRoom.value || !isHost.value) {
      return;
    }

    errorMessage.value = null;

    socketService.send(WS_EVENT.updateHostSettings, {
      roomCode: currentRoom.value.code,
      setting,
      value
    });
  }


  function submitAnswer(answer: string) {
    if (!currentRoom.value || submittedAnswer.value) {
      return;
    }
    errorMessage.value = null;
    socketService.send(WS_EVENT.submitAnswer, { roomCode: currentRoom.value.code, answer: answer ?? '' });
  }

  function submitVote(targetPlayerId: string) {
    if (!currentRoom.value) {
      return;
    }
    errorMessage.value = null;
    socketService.send(WS_EVENT.submitVote, { roomCode: currentRoom.value.code, targetPlayerId });
  }

  function getMyRole(): 'imposter' | 'civilian' | null {
    if (currentPlayerPrompt.value) {
      return currentPlayerPrompt.value.role;
    }

    if (currentPlayer.value?.isImposter) {
      return 'imposter';
    }

    if (currentRoom.value?.players.some((player) => player.id === currentPlayer.value?.id && player.isImposter)) {
      return 'imposter';
    }

    return currentPlayer.value ? 'civilian' : null;
  }

  function skipVote() {
    if (!currentRoom.value) {
      return;
    }
    errorMessage.value = null;
    socketService.send(WS_EVENT.skipVote, { roomCode: currentRoom.value.code, targetPlayerId: 'skip' });
  }

  function playAgain() {
    if (!currentRoom.value || !isHost.value || roomStatus.value !== 'results') {
      return;
    }

    errorMessage.value = null;
    socketService.send(WS_EVENT.readyForNextRound, {
      roomCode: currentRoom.value.code
    });
  }

  return {
    currentRoom,
    currentPlayer,
    currentPlayerPrompt,
    submittedAnswer,
    revealAnswers,
    revealedPrompts,
    votingResults,
    roomCode,
    roomPlayers,
    roomStatus,
    phaseCountdown,
    isHost,
    connectionStatus,
    errorMessage,
    createRoom,
    joinRoom,
    startGame,
    submitAnswer,
    submitVote,
    skipVote,
    playAgain,
    getMyRole,
    leaveRoom,
    updateRoomSetting,
  };
});
