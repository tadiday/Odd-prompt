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
import ProgressiveFooter from '../phases/ProgressiveFooter.vue'
import PlayerAvatar from '../PlayerAvatar.vue'

import {
  GAME_MODES,
  DEFAULT_MODE
} from './gameModes'

import { useGameStore } from '../../stores/game'

type Player = {
  id: string
  username: string
  avatarId: string
  isHost: boolean
}

const props = withDefaults(
  defineProps<{
    roomCode: string
    players: Player[]
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
  changeSetting: [setting: string, value: number]
}>()

const gameStore = useGameStore()

const roomOptions = computed(
  () => gameStore.currentRoom?.options
)

const currentModeKey = computed(() => {
  const options = roomOptions.value as
    | { gameMode?: string }
    | undefined

  return options?.gameMode ?? DEFAULT_MODE
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
    'gameMode' as any,
    modeKey as any
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

function handleModeSettingChange(
  setting: string,
  value: any
) {
  if (!props.isHost) return

  gameStore.updateRoomSetting(
    setting as any,
    value as any
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

<style scoped>
/* =========================================
   PAGE LAYOUT
========================================= */

.waiting-layout {
  position: relative;
  width: 100%;
  max-width: 1600px;
  flex: 1;
  min-height: 0;
  margin: 0 auto;
  padding: 18px 32px 105px;
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
  align-items: stretch;
  box-sizing: border-box;
  border: 0;
  border-radius: 0;
  background: transparent;
  box-shadow: none;
}

.lobby-progress {
  grid-column: 1 / -1;
}

/* =========================================
   PANELS
========================================= */

.panel {
  min-width: 0;
  min-height: 0;
  background: #fff;
  border: 3px solid #111;
  border-radius: 14px;
  box-shadow: 0 7px 18px #0000000a;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}


/* =========================================
   PANEL HEADERS
========================================= */

.panel-header {
  min-height: 84px;

  flex-shrink: 0;

  padding: 0 22px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  border-bottom: 3px solid #dedede;
  background: linear-gradient(180deg, #fff 0%, #fcfcfc 100%);

  box-sizing: border-box;
}

.panel-header h2 {
  margin: 2px 0 0;

  font-size: 1.08rem;
  font-weight: 900;

  letter-spacing: 0.02em;
}

.panel-label {
  display: block;

  color: #777 !important;

  font-size: 0.6rem;
  font-weight: 900;

  letter-spacing: 0.12em;
}

.view-only {
  padding: 6px 8px;

  border: 3px solid #ccc;
  border-radius: 6px;

  background: #f5f5f5;
  color: #777 !important;

  font-size: 0.58rem;
  font-weight: 900;

  letter-spacing: 0.06em;
}


/* =========================================
   LOBBY HEADER
========================================= */

.lobby-header {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
}

.room-code {
  min-width: 0;
  text-align: left;
}

.room-code span {
  display: block;

  font-size: 0.66rem;
  font-weight: 900;

  letter-spacing: 0.08em;
}

.room-code strong {
  display: block;
  margin-top: 3px;
  overflow: hidden;
  color: #ff1022 !important;
  font-size: 1.5rem;
  font-weight: 900;
  letter-spacing: 0.04em;
  line-height: 1.1;
  text-overflow: ellipsis;
  white-space: nowrap;
}


/* =========================================
   COPY BUTTON
========================================= */

.outline-button {
  justify-self: end;

  padding: 9px 12px;

  border: 2px solid #111;
  border-radius: 8px;

  background: #fff;
  color: #111;

  font-size: 0.7rem;
  font-weight: 900;

  white-space: nowrap;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.outline-button:hover {
  transform: translateY(-1px);

  background: #f3f3f3;
}


/* =========================================
   WAITING BANNER
========================================= */

.waiting-banner {
  min-height: 78px;

  padding: 0 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 15px;

  border-bottom: 3px solid #ddd;
}

.waiting-left {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 13px;
}

.waiting-banner h3 {
  margin: 0;

  font-size: 0.86rem;
  font-weight: 900;
}

.waiting-banner p {
  margin: 4px 0 0;

  color: #555 !important;

  font-size: 0.67rem;
  line-height: 1.35;
}

.spinner {
  width: 23px;
  height: 23px;

  flex-shrink: 0;

  border: 5px dotted #111;
  border-radius: 50%;

  animation: spin 2.3s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.host-label {
  flex-shrink: 0;

  color: #ff1022 !important;

  font-size: 0.64rem;
  font-weight: 900;

  white-space: nowrap;
}


/* =========================================
   PLAYER HEADER
========================================= */

.players-header {
  padding: 18px 20px 10px;
}

.players-header h3 {
  margin: 0;

  font-size: 0.8rem;
  font-weight: 900;
}

.players-icon {
  margin-right: 4px;
}

.player-count {
  color: #777 !important;

  font-size: 0.72rem;
  font-weight: 700;
}


/* =========================================
   PLAYER LIST
========================================= */

.player-list {
  flex: 1;
  min-height: 0;

  padding: 0 20px 14px;

  display: flex;
  flex-direction: column;

  gap: 7px;

  overflow-y: auto;
}

.player-row {
  width: 100%;
  min-height: 45px;

  padding: 0 13px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 10px;

  border: 3px solid #d5d5d5;
  border-radius: 9px;

  box-sizing: border-box;
  background: #fff;

  transition:
    border 0.15s ease,
    transform 0.15s ease;
}

.player-row:not(.empty):hover {
  border-color: #ff1022;
  transform: translateX(2px);
  box-shadow: 0 4px 10px #0000000a;
}

.player-main {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 10px;
}

.player-name {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 4px;
}

.player-name strong {
  min-width: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  font-size: 0.78rem;
  font-weight: 800;
}

.you-label {
  flex-shrink: 0;

  color: #666 !important;

  font-size: 0.67rem;
}


/* =========================================
   AVATAR
========================================= */

.avatar {
  width: 30px;
  height: 30px;

  flex-shrink: 0;

  display: grid;
  place-items: center;

  border: 2px solid #111;
  border-radius: 50%;

  background: #ff1022;

  color: #fff !important;

  font-size: 0.7rem;
  font-weight: 900;
}


/* =========================================
   PLAYER STATUS
========================================= */

.host-status {
  flex-shrink: 0;

  color: #ff1022 !important;

  font-size: 0.62rem;
  font-weight: 900;

  letter-spacing: 0.04em;
}

.ready-status {
  flex-shrink: 0;

  color: #16a76b !important;

  font-size: 0.62rem;
  font-weight: 900;

  letter-spacing: 0.02em;
}


/* =========================================
   EMPTY PLAYER
========================================= */

.player-row.empty {
  border: 3px dashed #c5c5c5;
  background: #fafafa;

  color: #777 !important;
}

.player-row.empty span {
  color: #777 !important;

  font-size: 0.74rem;
}

.empty-avatar {
  background: #eee;

  border-color: #aaa;

  color: #888 !important;
}


/* =========================================
   START GAME
========================================= */

.start-area {
  flex-shrink: 0;

  padding: 6px 20px 18px;

  text-align: center;
}

.primary-button {
  width: 100%;

  padding: 14px;

  border: 3px solid #111;
  border-radius: 9px;

  background: #ff1022;

  color: #fff;

  font-size: 0.94rem;
  font-weight: 900;

  letter-spacing: 0.025em;

  cursor: pointer;
  box-shadow: 3px 3px 0 #111;

  transition:
    transform 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease;
}

.primary-button:hover {
  background: #e90015;

  transform: translateY(-1px);

  box-shadow:
    0 4px 0 rgba(0, 0, 0, 0.13);
}

.primary-button:active {
  transform: translateY(1px);

  box-shadow: none;
}

.play-icon {
  margin-right: 8px;
}

.start-area small {
  display: block;

  margin-top: 8px;

  color: #555 !important;

  font-size: 0.64rem;
}

.waiting-host {
  padding: 14px;

  border: 3px dashed #aaa;
  border-radius: 8px;

  color: #666 !important;

  font-size: 0.75rem;
}


/* =========================================
   MODE / SETTINGS CONTENT
========================================= */

.panel-content {
  flex: 1;
  min-height: 0;

  padding: 28px 24px;

  overflow-y: auto;

  box-sizing: border-box;
}

.section-description {
  margin: 0 0 23px;

  color: #444 !important;

  font-size: 0.78rem;
  line-height: 1.5;
}


/* =========================================
   MODE SELECTOR
========================================= */

.mode-selector-wrapper {
  transition:
    opacity 0.15s ease;
}

.mode-selector-wrapper.disabled {
  opacity: 0.7;

  cursor: default;
}


/* =========================================
   ABOUT MODE
========================================= */

.about-mode {
  margin-top: 22px;
  padding: 18px;
  border: 3px solid #e1e1e1;
  border-radius: 10px;
  background: #fafafa;
}

.about-mode h4 {
  margin: 0 0 12px;

  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 0.73rem;
  font-weight: 900;
  letter-spacing: 0.02em;
}

.about-mode p {
  margin: 0;
  color: #333 !important;
  font-size: 0.72rem;
  line-height: 1.65;
}

.info-icon {
  width: 19px;
  height: 19px;
  flex-shrink: 0;
  display: inline-grid;
  place-items: center;
  border: 3px solid #111;
  border-radius: 50%;
  font-family: serif;
  font-size: 0.7rem;
  font-weight: 900;
}


/* =========================================
   SETTINGS
========================================= */

.settings-content {
  padding-bottom: 30px;
}

.settings-wrapper {
  transition: opacity 0.15s ease;
}

.settings-wrapper.disabled {
  opacity: 0.7;
}


/*
 * Prevent non-host users from interacting with
 * controls while still allowing them to see them.
 *
 * The host check inside the script is still kept
 * as an extra safeguard.
 */
.settings-wrapper.disabled {
  pointer-events: none;
}

.mode-selector-wrapper.disabled {
  pointer-events: none;
}


/* =========================================
   ERROR
========================================= */

.alert {
  margin: 0 20px 9px;
  padding: 10px 12px;
  border: 3px solid #ff1022;
  border-radius: 8px;
  background: #fff4f4;
  color: #b80a17 !important;
  font-size: 0.7rem;
}
.waiting {
  padding: 50px;

  color: #777;

  text-align: center;
}

/* =========================================
   SCROLLBARS
========================================= */

.player-list::-webkit-scrollbar,
.panel-content::-webkit-scrollbar {
  width: 6px;
}

.player-list::-webkit-scrollbar-thumb,
.panel-content::-webkit-scrollbar-thumb {
  background: #ccc;

  border-radius: 10px;
}


/* =========================================
   RESPONSIVE
========================================= */

/*
 * Smaller laptops:
 *
 * Keep lobby wide, shrink side panels.
 */
@media (max-width: 1250px) {
  .waiting-layout {
    grid-template-columns:
      minmax(360px, 1.4fr)
      minmax(260px, 1fr)
      minmax(260px, 1fr);

    gap: 14px;

    padding-left: 18px;
    padding-right: 18px;
  }

  .panel-content {
    padding-left: 18px;
    padding-right: 18px;
  }

  .panel-header {
    padding-left: 18px;
    padding-right: 18px;
  }

  .lobby-header {
    grid-template-columns: 1fr auto;
  }

}


/*
 * Tablet:
 *
 * Lobby takes full width.
 * Mode and settings sit underneath.
 */
@media (max-width: 1000px) {
  .waiting-layout {
    grid-template-columns: 1fr 1fr;

    overflow-y: auto;
  }

  .lobby-card {
    grid-column: 1 / -1;

    min-height: 600px;
  }

  .mode-card,
  .settings-card {
    min-height: 500px;
  }
}


/*
 * Mobile:
 *
 * Stack all three sections.
 */
@media (max-width: 700px) {
  .waiting-layout {
    grid-template-columns: 1fr;
    padding: 18px 12px 25px;
    border-radius: 14px;
  }

  .lobby-card,
  .mode-card,
  .settings-card {
    grid-column: auto;

    min-height: auto;
  }

  .lobby-card {
    min-height: 620px;
  }

  .mode-card,
  .settings-card {
    min-height: 450px;
  }

  .lobby-header {
    min-height: 105px;

    grid-template-columns: 1fr auto;

    padding: 15px;
  }

  .room-code {
    text-align: left;
  }

  .room-code strong {
    font-size: 1.4rem;
  }

  .outline-button {
    padding: 8px 10px;

    font-size: 0.62rem;
  }

  .waiting-banner {
    padding: 14px 16px;

    align-items: flex-start;
  }

  .host-label {
    display: none;
  }

  .players-header {
    padding-left: 16px;
    padding-right: 16px;
  }

  .player-list {
    padding-left: 16px;
    padding-right: 16px;
  }

  .start-area {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
