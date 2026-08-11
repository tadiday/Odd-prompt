<template>
  <div class="waiting-layout">
    <!-- LEFT -->
    <section class="lobby-card">

      <!-- Room Code -->
      <div class="room-topbar">
        <div></div>

        <div class="room-code">
          <span>ROOM CODE</span>
          <strong>{{ roomCode }}</strong>
        </div>

        <button class="outline-button" @click="copyRoomCode">
          🔗 COPY CODE
        </button>
      </div>

      <!-- Waiting -->
      <div class="waiting-banner">
        <div class="waiting-left">
          <div class="spinner"></div>

          <div>
            <h2>WAITING FOR PLAYERS...</h2>
            <p>The host can start the game when everyone is ready!</p>
          </div>
        </div>

        <div v-if="isHost" class="host-label">
          ♛ YOU ARE HOST
        </div>
      </div>

      <!-- Players header -->
      <div class="players-header">
        <h3>
          <span class="players-icon">👥</span>
          PLAYERS ({{ players.length }}/{{ maxPlayers }})
        </h3>
      </div>

      <!-- Players -->
      <div class="player-list">
        <div
          v-for="player in players"
          :key="player.id"
          class="player-row"
        >
          <div class="player-main">
            <div class="avatar">
              {{ getInitial(player.username) }}
            </div>

            <strong>
              {{ player.username }}
              <span v-if="player.id === currentPlayerId">
                (You)
              </span>
            </strong>
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

        <!-- Empty slots -->
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

      <div v-if="errorMessage" class="alert">
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

        <div v-else class="waiting-host">
          Waiting for the host to start the game...
        </div>

        <small v-if="isHost">
          Game will start when everyone is ready
        </small>
      </div>
    </section>


    <!-- RIGHT -->
    <aside class="side-card">
      <div class="tabs">
        <button
          :class="['tab', { active: currentTab === 'mode' }]"
          @click="currentTab = 'mode'"
        >
          GAME MODE
        </button>

        <button
          :class="['tab', { active: currentTab === 'settings' }]"
          @click="currentTab = 'settings'"
        >
          GAME SETTINGS
        </button>
      </div>

      <section class="side-section">
        <div v-if="currentTab === 'mode'">
          <p class="section-description">
            Choose how you want to play!
          </p>

          <GameModeSelector
            :selected="currentModeKey"
            @select="selectMode"
          />

          <div class="about-mode">
            <h4>
              <span class="info-icon">i</span>
              ABOUT {{ GAME_MODES[currentModeKey]?.name?.toUpperCase() ?? 'MODE' }}
            </h4>

            <p v-if="currentModeKey === 'classic'">
              Randomly assigned imposters will receive a different prompt.<br />
              Discuss, vote, and find the imposters!
            </p>

            <p v-else>
              {{ GAME_MODES[currentModeKey]?.description }}
            </p>
          </div>
        </div>

        <GameSettingsPanel
          v-else
          :modeKey="currentModeKey"
          :roomOptions="gameStore.currentRoom?.options"
          @change-setting="handleModeSettingChange"
        />
      </section>


    </aside>

  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import GameModeSelector from './GameModeSelector.vue'
import GameSettingsPanel from './GameSettingsPanel.vue'
import { GAME_MODES, DEFAULT_MODE } from './gameModes'
import { useGameStore } from '../../stores/game'

const router = useRouter()

type Player = {
  id: string
  username: string
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

const emptySlots = computed(() =>
  Math.max(0, props.maxPlayers - props.players.length)
)

const gameStore = useGameStore()

const roomOptions = computed(() => gameStore.currentRoom?.options)

const currentModeKey = computed(() => {
  const options = roomOptions.value as { gameMode?: string } | undefined
  return options?.gameMode ?? DEFAULT_MODE
})
const currentTab = ref<'mode' | 'settings'>('mode')

const maxPlayers = computed(() =>
  roomOptions.value?.maxPlayers ?? props.maxPlayers
)

function selectMode(modeKey: string) {
  if (!props.isHost) return
  // update the room's gameMode and hydrate defaults
  gameStore.updateRoomSetting('gameMode' as any, modeKey as any)
  const mode = GAME_MODES[modeKey]
  if (mode) {
    for (const schema of mode.settings) {
      gameStore.updateRoomSetting(
        schema.key as 'maxPlayers' | 'imposterCount' | 'answerTimerSeconds' | 'votingTimerSeconds',
        Number(schema.default)
      )
    }
  }
}

function handleModeSettingChange(setting: string, value: any) {
  if (!props.isHost) return
  gameStore.updateRoomSetting(setting as any, value as any)
}

function getInitial(username: string) {
  return username?.charAt(0)?.toUpperCase() || '?'
}

function copyRoomCode() {
  navigator.clipboard?.writeText(props.roomCode)
}
</script>

<style scoped>
.waiting-layout {
  width: 100%;
  flex: 1;
  min-height: 0;

  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 16px;

  padding: 12px 32px 28px;
  box-sizing: border-box;
}


/* =========================================
   CARDS
========================================= */

.lobby-card,
.side-card {
  background: #fff;

  border: 2px solid #111;
  border-radius: 14px;

  overflow: hidden;

  display: flex;
  flex-direction: column;

  min-width: 0;
  min-height: 0;
}


/* =========================================
   ROOM CODE
========================================= */

.room-topbar {
  height: 84px;
  flex-shrink: 0;

  padding: 0 18px;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  border-bottom: 1px solid #cfcfcf;
}

.room-code {
  text-align: center;
}

.room-code span {
  display: block;

  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.room-code strong {
  display: block;

  margin-top: 3px;

  color: #ff1022 !important;
  font-size: 1.8rem;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.outline-button {
  justify-self: end;

  padding: 10px 16px;

  border: 2px solid #111;
  border-radius: 8px;

  background: #fff;
  color: #111;

  font-size: 0.8rem;
  font-weight: 900;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.outline-button:hover {
  transform: translateY(-1px);
  background: #f7f7f7;
}


/* =========================================
   WAITING BANNER
========================================= */

.waiting-banner {
  min-height: 76px;
  padding: 0 24px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid #d7d7d7;
}

.waiting-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.waiting-banner h2 {
  margin: 0;

  font-size: 1rem;
  font-weight: 900;
}

.waiting-banner p {
  margin: 4px 0 0;

  font-size: 0.72rem;
  color: #333 !important;
}

.spinner {
  width: 25px;
  height: 25px;

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
  color: #ff1022 !important;

  font-size: 0.7rem;
  font-weight: 900;
}


/* =========================================
   PLAYERS
========================================= */

.players-header {
  padding: 17px 20px 10px;
}

.players-header h3 {
  margin: 0;

  font-size: 0.82rem;
  font-weight: 900;
}

.players-icon {
  margin-right: 5px;
}

.player-list {
  flex: 1;
  min-height: 0;

  padding: 0 20px 12px;

  display: flex;
  flex-direction: column;
  gap: 7px;

  overflow-y: auto;
}

.player-row {
  min-height: 43px;

  padding: 0 14px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 1px solid #c8c8c8;
  border-radius: 10px;

  box-sizing: border-box;
}

.player-main {
  display: flex;
  align-items: center;
  gap: 11px;
}

.player-main strong {
  font-size: 0.82rem;
  font-weight: 800;
}

.player-main strong span {
  color: #555 !important;
  font-weight: 500;
}

.avatar {
  width: 29px;
  height: 29px;

  display: grid;
  place-items: center;

  border: 2px solid #111;
  border-radius: 50%;

  background: #ff1022;
  color: #fff !important;

  font-size: 0.72rem;
  font-weight: 900;
}

.host-status {
  color: #ff1022 !important;

  font-size: 0.68rem;
  font-weight: 900;
}

.ready-status {
  color: #16a76b !important;

  font-size: 0.68rem;
  font-weight: 900;
}


/* Empty player */

.player-row.empty {
  border: 1.5px dashed #c1c1c1;

  color: #676767 !important;
}

.player-row.empty span {
  color: #676767 !important;

  font-size: 0.8rem;
}

.empty-avatar {
  background: #e9e9e9;
  border-color: #a8a8a8;

  color: #888 !important;
}


/* =========================================
   START GAME
========================================= */

.start-area {
  flex-shrink: 0;

  padding: 4px 20px 17px;

  text-align: center;
}

.primary-button {
  width: 100%;

  padding: 14px;

  border: none;
  border-radius: 9px;

  background: #ff1022;
  color: white;

  font-size: 1rem;
  font-weight: 900;
  letter-spacing: 0.02em;

  cursor: pointer;

  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.primary-button:hover {
  background: #e90015;
  transform: translateY(-1px);
}

.play-icon {
  margin-right: 9px;
}

.start-area small {
  display: block;

  margin-top: 8px;

  color: #333 !important;
  font-size: 0.69rem;
}

.waiting-host {
  padding: 14px;

  border: 1px dashed #aaa;
  border-radius: 8px;

  color: #666 !important;
}


/* =========================================
   RIGHT PANEL
========================================= */

.tabs {
  height: 70px;

  display: flex;

  border-bottom: 1px solid #cfcfcf;
}

.tab {
  position: relative;

  flex: 1;

  border: none;

  background: transparent;
  color: #555;

  font-size: 0.88rem;
  font-weight: 900;

  cursor: pointer;
}

.tab.active {
  color: #111;
}

.tab.active::after {
  content: "";

  position: absolute;

  left: 0;
  right: 0;
  bottom: -1px;

  height: 5px;

  background: #ff1022;
}

.side-section {
  flex: 1;
  min-height: 0;

  padding: 30px 30px;

  overflow-y: auto;
}

.section-description {
  margin: 0 0 27px;

  color: #222 !important;

  font-size: 0.85rem;
}


/* =========================================
   ABOUT
========================================= */

.about-mode {
  margin-top: 28px;
  padding: 23px 8px 0;

  border-top: 1px solid #d8d8d8;
}

.about-mode h4 {
  margin: 0 0 13px;

  display: flex;
  align-items: center;
  gap: 11px;

  font-size: 0.8rem;
  font-weight: 900;
}

.about-mode p {
  margin: 0;

  color: #222 !important;

  font-size: 0.76rem;
  line-height: 1.7;
}

.info-icon {
  width: 20px;
  height: 20px;

  display: inline-grid;
  place-items: center;

  border: 2px solid #111;
  border-radius: 50%;

  font-family: serif;
  font-weight: 900;
}


/* =========================================
   ERROR
========================================= */

.alert {
  margin: 0 20px 8px;
  padding: 10px;

  border: 1px solid #ff1022;
  border-radius: 8px;

  background: #fff4f4;
  color: #b80a17 !important;

  font-size: 0.75rem;
}


/* =========================================
   RESPONSIVE
========================================= */

@media (max-width: 1000px) {
  .waiting-layout {
    padding: 12px 18px 24px;
  }
}

@media (max-width: 850px) {
  .waiting-layout {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .lobby-card,
  .side-card {
    min-height: 600px;
  }
}
</style>
