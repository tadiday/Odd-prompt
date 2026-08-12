<template>
  <div class="waiting-layout">
    <!-- ========================================
         LOBBY
    ========================================= -->
    <section class="panel lobby-card">
      <div class="panel-header lobby-header">
        <div class="room-code">
          <span>ROOM CODE</span>
          <strong>{{ roomCode }}</strong>
        </div>

        <button
          class="outline-button"
          @click="copyRoomCode"
        >
          🔗 COPY CODE
        </button>
      </div>

      <!-- Players -->
      <div class="players-header">
        <h3>
          <span class="players-icon">👥</span>
          PLAYERS
          <span class="player-count">
            {{ players.length }}/{{ maxPlayers }}
          </span>
        </h3>
      </div>

      <div class="player-list">
        <!-- Connected Players -->
        <div
          v-for="player in players"
          :key="player.id"
          class="player-row"
        >
          <div class="player-main">
            <PlayerAvatar
              :avatar-id="player.avatarId"
              :player-name="player.username"
            />

            <div class="player-name">
              <strong>{{ player.username }}</strong>

              <span
                v-if="player.id === currentPlayerId"
                class="you-label"
              >
                (You)
              </span>
            </div>
          </div>

          <span
            v-if="player.isHost"
            class="host-status"
          >
            HOST
          </span>

          <span
            v-else
            class="ready-status"
          >
            READY ✓
          </span>
        </div>

        <!-- Empty Slots -->
        <div
          v-for="slot in emptySlots"
          :key="`empty-${slot}`"
          class="player-row empty"
        >
          <div class="player-main">
            <div class="avatar empty-avatar">
              ?
            </div>

            <span>Waiting for player...</span>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div
        v-if="errorMessage"
        class="alert"
      >
        {{ errorMessage }}
      </div>

      <!-- Start -->
      <div class="start-area">
        <button
          v-if="isHost"
          class="primary-button"
          @click="emit('start')"
        >
          <span class="play-icon">▶</span>
          START GAME
        </button>

        <div
          v-else
          class="waiting-host"
        >
          Waiting for the host to start the game...
        </div>

        <small v-if="isHost">
          Game will start when everyone is ready
        </small>
      </div>
    </section>

    <!-- ========================================
         GAME MODE
    ========================================= -->
    <section class="panel mode-card">
      <div class="panel-header">
        <div>
          <span class="panel-label">CHOOSE YOUR</span>
          <h2>GAME MODE</h2>
        </div>

        <span
          v-if="!isHost"
          class="view-only"
        >
          VIEW ONLY
        </span>
      </div>

      <div class="panel-content">
        <p class="section-description">
          Choose how you want to play!
        </p>

        <div
          class="mode-selector-wrapper"
          :class="{ disabled: !isHost }"
        >
          <GameModeSelector
            :selected="currentModeKey"
            @select="selectMode"
          />
        </div>

        <div class="about-mode">
          <h4>
            <span class="info-icon">i</span>

            ABOUT
            {{
              GAME_MODES[currentModeKey]?.name?.toUpperCase()
                ?? 'MODE'
            }}
          </h4>

          <p v-if="currentModeKey === 'classic'">
            Randomly assigned imposters receive a different
            prompt. Discuss the answers, find the suspicious
            players, and vote out the imposters!
          </p>

          <p v-else>
            {{ GAME_MODES[currentModeKey]?.description }}
          </p>
        </div>
      </div>
    </section>

    <!-- ========================================
         GAME SETTINGS
    ========================================= -->
    <section class="panel settings-card">
      <div class="panel-header">
        <div>
          <span class="panel-label">CUSTOMIZE</span>
          <h2>GAME SETTINGS</h2>
        </div>

        <span
          v-if="!isHost"
          class="view-only"
        >
          VIEW ONLY
        </span>
      </div>

      <div class="panel-content settings-content">
        <p class="section-description">
          Adjust the rules for this room.
        </p>

        <div
          class="settings-wrapper"
          :class="{ disabled: !isHost }"
        >
          <GameSettingsPanel
            :modeKey="currentModeKey"
            :roomOptions="gameStore.currentRoom?.options"
            @change-setting="handleModeSettingChange"
          />
        </div>
      </div>
    </section>

    <ProgressiveFooter
      class="lobby-progress"
      active-phase="start"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import GameModeSelector from './GameModeSelector.vue'
import GameSettingsPanel from './GameSettingsPanel.vue'
import ProgressiveFooter from '../game/ProgressiveFooter.vue'
import PlayerAvatar from '../common/PlayerAvatar.vue'

import {
  GAME_MODES,
  DEFAULT_MODE
} from './gameModes'

import { useGameStore } from '../../stores/gameStore'
import type { Player, RoomSetting } from '@odd-prompt/shared'

type LobbyPlayer = Pick<Player, 'id' | 'username' | 'avatarId' | 'isHost'>

const props = withDefaults(
  defineProps<{
    roomCode: string
    players: LobbyPlayer[]
    currentPlayerId?: string
    isHost: boolean
    errorMessage?: string | null
    maxPlayers?: number
  }>(),
  {
    maxPlayers: 8,
    errorMessage: ''
  }
)

const emit = defineEmits<{
  start: []
  changeSetting: [setting: RoomSetting, value: string | number]
}>()

const gameStore = useGameStore()

const roomOptions = computed(
  () => gameStore.currentRoom?.options
)

const currentModeKey = computed(() => {
  return roomOptions.value?.gameMode ?? DEFAULT_MODE
})

const maxPlayers = computed(() => {
  return (
    roomOptions.value?.maxPlayers
    ?? props.maxPlayers
  )
})

const emptySlots = computed(() => {
  return Math.max(
    0,
    maxPlayers.value - props.players.length
  )
})

function selectMode(modeKey: string) {
  if (!props.isHost) return

  gameStore.updateRoomSetting(
    'gameMode',
    modeKey
  )

  const mode = GAME_MODES[modeKey]

  if (!mode) return

  /*
   * When changing game modes,
   * load that mode's default settings.
   */
  for (const schema of mode.settings) {
    gameStore.updateRoomSetting(
      schema.key as
        | 'maxPlayers'
        | 'imposterCount'
        | 'answerTimerSeconds'
        | 'votingTimerSeconds',
      Number(schema.default)
    )
  }
}

function handleModeSettingChange(setting: RoomSetting, value: string | number) {
  if (!props.isHost) return

  gameStore.updateRoomSetting(
    setting,
    value
  )
}

async function copyRoomCode() {
  try {
    await navigator.clipboard?.writeText(
      props.roomCode
    )
  }
  catch {
    console.error('Unable to copy room code.')
  }
}
</script>

<style scoped src="../../styles/waiting-lobby.css"></style>
