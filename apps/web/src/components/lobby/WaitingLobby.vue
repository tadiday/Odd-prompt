<template>
  <div class="waiting-layout">

    <!-- LEFT SIDE -->
    <section class="lobby-card">

      <!-- Room Code Header -->
      <div class="room-topbar">
        <button class="text-button" @click="router.back()">
          ← LEAVE ROOM
        </button>

        <div class="room-code">
          <span>ROOM CODE</span>
          <strong>{{ roomCode }}</strong>
        </div>

        <button class="outline-button" @click="copyRoomCode">
          ⧉ COPY CODE
        </button>
      </div>

      <!-- Waiting -->
      <div class="waiting-banner">
        <div class="spinner"></div>

        <div>
          <h2>WAITING FOR PLAYERS...</h2>
          <p>
            The host can start the game when everyone is ready!
          </p>
        </div>
      </div>

      <!-- Player Header -->
      <div class="players-header">
        <h3>
          👥 PLAYERS ({{ players.length }}/{{ maxPlayers }})
        </h3>

        <span v-if="isHost" class="host-label">
          ♛ YOU ARE HOST
        </span>
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
          ▶ START GAME
        </button>

        <div v-else class="waiting-host">
          Waiting for the host to start the game...
        </div>

        <small v-if="isHost">
          Start when everyone is in the room.
        </small>

      </div>

    </section>


    <!-- RIGHT SIDE -->
    <aside class="side-card">

      <div class="tabs">
        <button :class="['tab', { active: currentTab === 'mode' }]" @click="currentTab = 'mode'">GAME MODE</button>
        <button :class="['tab', { active: currentTab === 'settings' }]" @click="currentTab = 'settings'">GAME SETTINGS</button>
      </div>

      <section class="side-section tab-panel">
        <div v-if="currentTab === 'mode'">
          <GameModeSelector :selected="currentModeKey" @select="selectMode" />

          <div class="about-mode">
            <h4>ABOUT {{ GAME_MODES[currentModeKey]?.name ?? 'Mode' }}</h4>
            <p>{{ GAME_MODES[currentModeKey]?.description }}</p>
          </div>
        </div>

        <div v-else>
          <GameSettingsPanel
            :modeKey="currentModeKey"
            :roomOptions="gameStore.currentRoom?.options"
            @change-setting="handleModeSettingChange"
          />
        </div>
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
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(300px, 0.85fr);
  gap: 18px;
  color: #111;
}

.tabs {
  display:flex;
  border-bottom:3px solid #efefef;
}
.tab {
  flex:1;
  padding:14px 18px;
  background:transparent;
  border:0;
  font-weight:900;
  cursor:pointer;
}
.tab.active { border-bottom:4px solid #ef1823 }
.tab-panel { padding-top:10px }
.about-mode { margin-top:18px; border-top:1px solid #eee; padding-top:14px }

.lobby-card,
.side-card {
  background: #fff;
  border: 3px solid #111;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.08);
}

/* Header */

.room-topbar {
  min-height: 80px;
  padding: 0 22px;

  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;

  border-bottom: 3px solid #111;
}

.room-code {
  text-align: center;
}

.room-code span {
  display: block;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.room-code strong {
  color: #ef1823;
  font-size: 1.7rem;
}

.text-button {
  justify-self: start;
  border: 0;
  background: transparent;
  color: #111;
  font-weight: 900;
  cursor: pointer;
}

.outline-button {
  justify-self: end;

  padding: 10px 14px;

  background: #fff;
  color: #111;

  border: 2px solid #111;
  border-radius: 12px;

  box-shadow: 3px 3px 0 #111;

  font-weight: 900;
  cursor: pointer;
}

/* Waiting */

.waiting-banner {
  padding: 18px 22px;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 14px;
}

.waiting-banner h2 {
  margin: 0;
  color: #111;
  font-size: 1rem;
}

.waiting-banner p {
  margin: 4px 0 0;
  color: #555;
  font-size: 0.8rem;
}

.spinner {
  width: 26px;
  height: 26px;

  border: 5px dotted #111;
  border-radius: 50%;
}

/* Players */

.players-header {
  padding: 0 22px 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.players-header h3 {
  margin: 0;
  color: #111;
  font-size: 0.9rem;
}

.host-label,
.host-status {
  color: #ef1823;
  font-size: 0.75rem;
  font-weight: 900;
}

.player-list {
  padding: 0 22px 14px;

  display: grid;
  gap: 8px;
}

.player-row {
  min-height: 50px;
  padding: 0 14px 0 10px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  border: 2px solid #111;
  border-radius: 11px;

  color: #111;
}

.player-main {
  display: flex;
  align-items: center;
  gap: 10px;
}

.player-main strong span {
  color: #777;
  font-size: 0.75rem;
}

.avatar {
  width: 34px;
  height: 34px;

  display: grid;
  place-items: center;

  background: #ef1823;
  color: #fff;

  border: 2px solid #111;
  border-radius: 50%;

  font-weight: 900;
}

.ready-status {
  color: #1db954;
  font-size: 0.75rem;
  font-weight: 900;
}

/* Empty slots */

.player-row.empty {
  border-color: #aaa;
  border-style: dashed;
  color: #777;
}

.empty-avatar {
  background: #ddd;
  color: #777;
  border-color: #aaa;
}

/* Start */

.start-area {
  padding: 0 22px 20px;
  text-align: center;
}

.primary-button {
  width: 100%;
  padding: 15px;

  background: #ef1823;
  color: #fff;

  border: 3px solid #111;
  border-radius: 13px;

  box-shadow: 4px 4px 0 #111;

  font-weight: 900;
  letter-spacing: 0.08em;

  cursor: pointer;
}

.start-area small {
  display: block;
  margin-top: 10px;
  color: #666;
}

.waiting-host {
  padding: 14px;

  border: 2px dashed #aaa;
  border-radius: 13px;

  color: #666;
  font-weight: 800;
}

/* Side */

.side-section {
  padding: 22px;
}

.side-section + .side-section {
  border-top: 3px solid #111;
}

.side-section h2 {
  margin: 0 0 15px;
  color: #111;
  font-size: 1rem;
}

.side-section p {
  color: #555;
  line-height: 1.6;
}

.setting-row {
  padding: 15px 0;

  display: flex;
  justify-content: space-between;

  border-bottom: 1px solid #ccc;

  color: #111;
}

.setting-row:last-child {
  border-bottom: 0;
}

.room-code-box {
  margin-top: 18px;
  padding: 16px;

  border: 2px dashed #ef1823;
  border-radius: 14px;

  color: #ef1823;

  text-align: center;
  font-size: 1.6rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

/* Error */

.alert {
  margin: 0 22px 14px;
  padding: 11px;

  background: #fff4f4;
  color: #b70f18;

  border: 2px solid #ef1823;
  border-radius: 12px;
}

@media (max-width: 850px) {
  .waiting-layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .room-topbar {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 16px;
  }

  .text-button,
  .outline-button {
    justify-self: center;
  }
}
</style>
