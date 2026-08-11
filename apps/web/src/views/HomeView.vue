<template>
  <main class="home-page">
    <section class="room-card">
      <!-- TABS -->
      <div class="tabs">
        <button
          :class="{ active: activeTab === 'create' }"
          @click="activeTab = 'create'"
        >
          CREATE ROOM
        </button>

        <button
          :class="{ active: activeTab === 'join' }"
          @click="activeTab = 'join'"
        >
          JOIN ROOM
        </button>
      </div>

      <!-- CREATE ROOM -->
      <div v-if="activeTab === 'create'" class="room-content">
        <div class="avatar-side">
          <div class="selected-avatar">
            {{ selectedAvatar }}
          </div>

          <div class="avatar-grid">
            <button
              v-for="avatar in avatars"
              :key="avatar"
              class="avatar-option"
              :class="{ selected: selectedAvatar === avatar }"
              @click="selectedAvatar = avatar"
            >
              {{ avatar }}
            </button>
          </div>
        </div>

        <div class="form-side">
          <h2>
            CHOOSE A CHARACTER AND
            <br />
            A NICKNAME
          </h2>

          <div class="input-wrapper">
            <input
              v-model="hostName"
              class="name-input"
              maxlength="20"
              placeholder="YOUR NAME"
              @keyup.enter="createRoom"
            />

            <span class="edit-icon">✎</span>
          </div>

          <button class="primary" @click="createRoom">
            <span class="button-icon">♟</span>
            CREATE ROOM
          </button>
        </div>
      </div>

      <!-- JOIN ROOM -->
      <div v-else class="room-content">
        <div class="avatar-side">
          <div class="selected-avatar">
            {{ selectedAvatar }}
          </div>

          <div class="avatar-grid">
            <button
              v-for="avatar in avatars"
              :key="avatar"
              class="avatar-option"
              :class="{ selected: selectedAvatar === avatar }"
              @click="selectedAvatar = avatar"
            >
              {{ avatar }}
            </button>
          </div>
        </div>

        <div class="form-side">
          <h2>JOIN A ROOM</h2>

          <div class="field">
            <label>YOUR NAME</label>

            <input
              v-model="playerName"
              class="name-input"
              maxlength="20"
              placeholder="PLAYER NAME"
            />
          </div>

          <div class="field">
            <label>ROOM CODE</label>

            <input
              v-model="roomCode"
              class="name-input room-code"
              maxlength="6"
              placeholder="ROOM CODE"
              @keyup.enter="joinRoom"
            />
          </div>

          <button class="primary" @click="joinRoom">
            <span class="button-icon">♟</span>
            JOIN ROOM
          </button>
        </div>
      </div>

      <div v-if="gameStore.errorMessage" class="alert">
        {{ gameStore.errorMessage }}
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();

const activeTab = ref<'create' | 'join'>('create');

const selectedAvatar = ref('🐯');

const avatars = [
  '🐯',
  '🐼',
  '👑',
  '👻',
  '🐵',
  '👽',
  '🤖',
  '🐱',
  '🐙',
  '🐰',
  '🐻',
  '😈',
];

const hostName = ref('');
const playerName = ref('');
const roomCode = ref('');

function createRoom() {
  if (!hostName.value.trim()) {
    gameStore.errorMessage = 'Please enter a name';
    return;
  }

  gameStore.createRoom(hostName.value);

  router.push('/lobby');
}

function joinRoom() {
  if (!playerName.value.trim()) {
    gameStore.errorMessage = 'Please enter a name';
    return;
  }

  const normalizedRoomCode = roomCode.value.trim().toUpperCase();

  if (!normalizedRoomCode) {
    gameStore.errorMessage = 'Please enter a room code';
    return;
  }

  gameStore.joinRoom(normalizedRoomCode, playerName.value);

  router.push(`/lobby/${normalizedRoomCode}`);
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

/* =========================
   PAGE
========================= */

.home-page {
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 40px 24px;

  background:
    radial-gradient(
      circle at center,
      #ffffff 0%,
      #ffffff 65%,
      #fafafa 100%
    );

  color: #111;
}

/* =========================
   MAIN CARD
========================= */

.room-card {
  width: 100%;
  max-width: 820px;

  background: #fff;

  border: 3px solid #111;
  border-radius: 26px;

  overflow: hidden;

  box-shadow:
    0 3px 0 rgba(0, 0, 0, 0.06);
}

/* =========================
   TABS
========================= */

.tabs {
  height: 82px;

  display: grid;
  grid-template-columns: 1fr 1fr;

  border-bottom: 3px solid #111;
}

.tabs button {
  position: relative;

  border: 0;
  background: #fff;

  font-family: inherit;
  font-size: 1.15rem;
  font-weight: 900;

  letter-spacing: 0.5px;

  color: #111;

  cursor: pointer;

  transition:
    color 0.15s ease,
    background 0.15s ease;
}

.tabs button:first-child {
  border-right: 2px solid #111;
}

.tabs button:hover {
  background: #fafafa;
}

.tabs button.active {
  color: #f01924;
}

/* red underline */

.tabs button.active::after {
  content: '';

  position: absolute;

  left: 7%;
  right: 7%;
  bottom: -3px;

  height: 7px;

  background: #f01924;

  border-radius: 10px 10px 0 0;
}

/* =========================
   CONTENT
========================= */

.room-content {
  min-height: 430px;

  display: grid;
  grid-template-columns: 220px 1fr;

  align-items: center;

  gap: 55px;

  padding: 42px 48px;
}

/* =========================
   AVATAR SECTION
========================= */

.avatar-side {
  display: flex;
  flex-direction: column;
  align-items: center;

  gap: 26px;
}

.selected-avatar {
  width: 135px;
  height: 135px;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 72px;

  background: #fff;

  border: 3px solid #111;
  border-radius: 24px;

  box-shadow:
    0 4px 0 #e7e7e7;
}

.avatar-grid {
  width: 100%;

  display: grid;
  grid-template-columns: repeat(4, 1fr);

  gap: 11px;
}

.avatar-option {
  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  font-size: 24px;

  background: #fff;

  border: 2px solid #111;
  border-radius: 50%;

  cursor: pointer;

  transition:
    transform 0.12s ease,
    border-color 0.12s ease,
    background 0.12s ease;
}

.avatar-option:hover {
  transform: translateY(-2px);
}

.avatar-option.selected {
  border: 4px solid #f01924;
  background: #fff6f6;
}

/* =========================
   FORM
========================= */

.form-side {
  display: flex;
  flex-direction: column;

  justify-content: center;

  gap: 25px;
}

.form-side h2 {
  margin: 0 0 10px;

  text-align: center;

  font-size: 1.3rem;
  line-height: 1.5;

  font-weight: 900;

  letter-spacing: 0.4px;
}

.field {
  display: flex;
  flex-direction: column;

  gap: 8px;
}

.field label {
  font-size: 0.92rem;

  font-weight: 900;

  letter-spacing: 1px;
}

/* =========================
   INPUT
========================= */

.input-wrapper {
  position: relative;
}

.name-input {
  width: 100%;

  min-height: 72px;

  padding: 0 68px 0 24px;

  background: #fff;

  border: 3px solid #111;
  border-radius: 20px;

  font-family: inherit;

  font-size: 1.55rem;
  font-weight: 900;

  color: #111;

  outline: none;

  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.name-input::placeholder {
  color: #999;

  font-size: 1.1rem;

  font-weight: 800;

  letter-spacing: 1px;
}

.name-input:focus {
  border-color: #f01924;

  box-shadow:
    0 0 0 3px rgba(240, 25, 36, 0.1);
}

.input-wrapper .name-input {
  text-align: center;
}

.edit-icon {
  position: absolute;

  top: 50%;
  right: 25px;

  transform: translateY(-50%);

  font-size: 28px;

  pointer-events: none;
}

/* ROOM CODE */

.room-code {
  text-transform: uppercase;

  letter-spacing: 5px;

  font-size: 1.25rem;
}

/* =========================
   BUTTON
========================= */

.primary {
  min-height: 76px;

  display: flex;
  align-items: center;
  justify-content: center;

  gap: 14px;

  padding: 0 24px;

  background: #f01924;

  color: #fff;

  border: 0;
  border-radius: 20px;

  font-family: inherit;

  font-size: 1.35rem;
  font-weight: 900;

  letter-spacing: 1.5px;

  cursor: pointer;

  box-shadow:
    0 5px 0 #c90d17;

  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease,
    background 0.12s ease;
}

.primary:hover {
  background: #ff202c;

  transform: translateY(-2px);

  box-shadow:
    0 7px 0 #c90d17;
}

.primary:active {
  transform: translateY(3px);

  box-shadow:
    0 2px 0 #c90d17;
}

.button-icon {
  font-size: 1.5rem;
}

/* =========================
   ERROR
========================= */

.alert {
  margin: 0 48px 30px;

  padding: 14px 18px;

  border: 2px solid #f01924;
  border-radius: 12px;

  background: #fff3f3;

  color: #d4101b;

  font-weight: 800;

  text-align: center;
}

/* =========================
   MOBILE
========================= */

@media (max-width: 720px) {
  .home-page {
    align-items: flex-start;

    padding: 24px 14px;
  }

  .room-card {
    border-radius: 20px;
  }

  .tabs {
    height: 68px;
  }

  .tabs button {
    font-size: 0.95rem;
  }

  .room-content {
    grid-template-columns: 1fr;

    gap: 32px;

    padding: 30px 24px;
  }

  .avatar-side {
    gap: 20px;
  }

  .selected-avatar {
    width: 110px;
    height: 110px;

    font-size: 58px;
  }

  .avatar-grid {
    width: auto;

    grid-template-columns: repeat(6, 44px);
  }

  .avatar-option {
    width: 44px;
    height: 44px;

    font-size: 21px;
  }

  .form-side h2 {
    font-size: 1.05rem;
  }

  .name-input {
    min-height: 62px;

    font-size: 1.2rem;
  }

  .primary {
    min-height: 66px;

    font-size: 1.1rem;
  }

  .alert {
    margin: 0 24px 24px;
  }
}

@media (max-width: 430px) {
  .avatar-grid {
    grid-template-columns: repeat(4, 44px);
  }
}
</style>