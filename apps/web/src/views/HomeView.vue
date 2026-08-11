<template>
  <main class="home-page">
    <section class="home-shell">
    <header class="home-header">
      <button class="language-button" aria-label="Select language">
        ◉ EN⌄
      </button>

      <div class="brand" aria-label="Odd Prompt">
        <div class="brand-character">🎩</div>
        <div>
          <div class="brand-name">
            <span>Odd</span>
            <strong>Prompt</strong>
          </div>
          <p>THE PARTY GAME</p>
        </div>
      </div>

      <div class="header-actions">
        <button aria-label="Help">?</button>
        <button aria-label="Music">♫</button>
        <button aria-label="Sound">◖</button>
      </div>
    </header>

    <div class="doodle doodle-left">✎</div>
    <div class="doodle doodle-right">?!</div>
    <div class="doodle doodle-star">☆</div>

    <section class="home-content">
      <section class="room-card">
        <div class="tabs" role="tablist" aria-label="Room action">
          <button
            role="tab"
            :aria-selected="activeTab === 'create'"
            :class="{ active: activeTab === 'create' }"
            @click="activeTab = 'create'"
          >
            CREATE ROOM
          </button>
          <button
            role="tab"
            :aria-selected="activeTab === 'join'"
            :class="{ active: activeTab === 'join' }"
            @click="activeTab = 'join'"
          >
            JOIN ROOM
          </button>
        </div>

        <div class="room-content">
          <div class="avatar-side">
            <div class="selected-avatar">{{ selectedAvatar }}</div>
            <div class="avatar-grid" aria-label="Choose a character">
              <button
                v-for="avatar in avatars"
                :key="avatar"
                class="avatar-option"
                :class="{ selected: selectedAvatar === avatar }"
                :aria-label="`Choose ${avatar}`"
                @click="selectedAvatar = avatar"
              >
                {{ avatar }}
              </button>
            </div>
          </div>

          <div v-if="activeTab === 'create'" class="form-side">
            <h1>CHOOSE A CHARACTER AND<br />A NICKNAME</h1>
            <div class="input-wrapper">
              <input
                v-model="hostName"
                class="name-input"
                maxlength="20"
                placeholder="YOUR NAME"
                aria-label="Your nickname"
                @keyup.enter="createRoom"
              />
              <span>✎</span>
            </div>
            <button class="primary" @click="createRoom">
              <span>♟</span>
              CREATE ROOM
            </button>
          </div>

          <div v-else class="form-side join-form">
            <h1>ENTER YOUR DETAILS<br />TO JOIN THE PARTY</h1>
            <input
              v-model="playerName"
              class="name-input"
              maxlength="20"
              placeholder="YOUR NAME"
              aria-label="Your nickname"
            />
            <input
              v-model="roomCode"
              class="name-input code-input"
              maxlength="6"
              placeholder="ROOM CODE"
              aria-label="Room code"
              @keyup.enter="joinRoom"
            />
            <button class="primary" @click="joinRoom">
              <span>➜</span>
              JOIN ROOM
            </button>
          </div>
        </div>

        <div v-if="gameStore.errorMessage" class="alert" role="alert">
          {{ gameStore.errorMessage }}
        </div>
      </section>

      <aside class="how-to-card">
        <span class="how-to-eyebrow">QUICK GUIDE</span>
        <h2>HOW TO PLAY</h2>
        <div class="guide-icon">☆</div>
        <p class="guide-number">{{ activeGuide + 1 }} / {{ guides.length }}</p>
        <h3>{{ currentGuide.title }}</h3>
        <p>{{ currentGuide.body }}</p>
        <div class="guide-dots" aria-label="How-to steps">
          <button
            v-for="(_, index) in guides"
            :key="index"
            :class="{ active: index === activeGuide }"
            :aria-label="`Show guide ${index + 1}`"
            @click="activeGuide = index"
          ></button>
        </div>
      </aside>
    </section>

    <div class="party-note">
      <span>⚡</span>
      Grab your friends. One prompt is not like the other.
    </div>

    <footer class="home-footer">
      <strong>odd prompt</strong>
      <nav aria-label="Footer links">
        <a href="#">HOW TO PLAY</a>
        <a href="#">PRIVACY</a>
        <a href="#">CONTACT</a>
      </nav>
      <div class="socials"><span>●</span><span>◎</span><span>▶</span></div>
    </footer>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/game'

const router = useRouter()
const gameStore = useGameStore()

const activeTab = ref<'create' | 'join'>('create')
const activeGuide = ref(0)
const selectedAvatar = ref('🐯')
const hostName = ref('')
const playerName = ref('')
const roomCode = ref('')

const avatars = [
  '🐯', '🐼', '👑', '👻',
  '🐵', '👽', '🤖', '🐱',
  '🐙', '🐰', '🐻', '😈'
]

const guides = [
  {
    title: 'GET YOUR PROMPT',
    body: 'Most players get the same prompt. The odd player gets something different.'
  },
  {
    title: 'ANSWER & DISCUSS',
    body: 'Write an answer, compare everyone’s responses, and defend your choices.'
  },
  {
    title: 'VOTE & WIN',
    body: 'Vote for the suspicious player. Find the odd player before they fool the room.'
  }
]

const currentGuide = computed(() => guides[activeGuide.value])

function createRoom() {
  if (!hostName.value.trim()) {
    gameStore.errorMessage = 'Please enter a name'
    return
  }

  gameStore.createRoom(hostName.value.trim())
  router.push('/lobby')
}

function joinRoom() {
  if (!playerName.value.trim()) {
    gameStore.errorMessage = 'Please enter a name'
    return
  }

  const normalizedRoomCode = roomCode.value.trim().toUpperCase()
  if (!normalizedRoomCode) {
    gameStore.errorMessage = 'Please enter a room code'
    return
  }

  gameStore.joinRoom(normalizedRoomCode, playerName.value.trim())
  router.push(`/lobby/${normalizedRoomCode}`)
}
</script>

<style scoped>
.home-page {
  --red: #f01826;
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 24px;
  background: #f3f3f3;
  color: #111;
}

button, input { font: inherit; }

.home-shell {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 1600px;
  min-height: calc(100vh - 48px);
  flex-direction: column;
  margin: 0 auto;
  padding: 18px 28px 14px;
  overflow: hidden;
  border: 2px solid #111;
  border-radius: 18px;
  background: radial-gradient(circle at 50% 35%, #fff 0%, #fff 48%, #f8f8f8 100%);
  box-shadow: 0 4px 14px #00000014;
}

.home-header {
  display: grid;
  width: 100%;
  max-width: 1420px;
  min-height: 132px;
  grid-template-columns: 1fr auto 1fr;
  align-items: flex-start;
  margin: 0 auto;
}

.language-button {
  justify-self: start;
  margin-top: 4px;
  padding: 10px 16px;
  border: 2px solid #111;
  border-radius: 999px;
  background: #fff;
  font-size: 0.76rem;
  font-weight: 900;
}

.brand {
  display: flex;
  grid-column: 2;
  align-items: center;
  justify-self: center;
  gap: 16px;
}

.brand-character {
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  border: 3px solid #111;
  border-radius: 50%;
  background: var(--red);
  font-size: 2.3rem;
  box-shadow: 4px 4px 0 #111;
}

.brand-name { display: flex; align-items: center; gap: 9px; font-size: 2.45rem; font-weight: 900; line-height: 1; }
.brand-name strong { padding: 7px 12px 9px; border: 3px solid var(--red); border-radius: 12px; color: var(--red); }
.brand p { margin: 15px 0 0; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.32em; text-align: center; }
.header-actions { display: flex; grid-column: 3; justify-self: end; gap: 10px; }
.header-actions button { display: grid; width: 38px; height: 38px; place-items: center; border: 2px solid #111; border-radius: 50%; background: #fff; font-size: 1rem; font-weight: 900; }

.home-content {
  display: grid;
  width: 100%;
  max-width: 1400px;
  grid-template-columns: minmax(0, 1fr) 350px;
  gap: 32px;
  align-items: stretch;
  margin: 24px auto 0;
}

.room-card, .how-to-card { border: 2px solid #111; border-radius: 22px; background: #fff; box-shadow: 4px 4px 0 #111; }
.room-card { overflow: hidden; }
.tabs { display: grid; height: 64px; grid-template-columns: 1fr 1fr; border-bottom: 2px solid #111; }
.tabs button { position: relative; border: 0; background: #fff; color: #111; font-size: 0.9rem; font-weight: 900; cursor: pointer; }
.tabs button:first-child { border-right: 2px solid #111; }
.tabs button.active { color: var(--red); }
.tabs button.active::after { content: ''; position: absolute; right: 7%; bottom: -2px; left: 7%; height: 6px; border-radius: 999px 999px 0 0; background: var(--red); }

.room-content { display: grid; min-height: 390px; grid-template-columns: 240px 1fr; gap: 48px; align-items: center; padding: 36px 46px; }
.avatar-side { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.selected-avatar { display: grid; width: 108px; height: 108px; place-items: center; border: 2px solid #111; border-radius: 20px; background: #fff7f7; font-size: 3.7rem; box-shadow: 3px 3px 0 #ddd; }
.avatar-grid { display: grid; grid-template-columns: repeat(4, 38px); gap: 8px; }
.avatar-option { display: grid; width: 38px; height: 38px; place-items: center; padding: 0; border: 1.5px solid #111; border-radius: 50%; background: #fff; font-size: 1.15rem; cursor: pointer; transition: 0.15s ease; }
.avatar-option:hover { transform: translateY(-2px); }
.avatar-option.selected { border: 3px solid var(--red); background: #fff0f1; }

.form-side { display: flex; width: 100%; max-width: 520px; flex-direction: column; gap: 20px; margin: 0 auto; }
.form-side h1 { margin: 0 0 4px; text-align: center; font-size: 1rem; line-height: 1.55; }
.input-wrapper { position: relative; }
.input-wrapper > span { position: absolute; top: 50%; right: 20px; transform: translateY(-50%); font-size: 1.25rem; }
.name-input { width: 100%; min-height: 60px; padding: 0 52px 0 18px; border: 2px solid #111; border-radius: 14px; background: #fff; color: #111; outline: none; font-size: 1.25rem; font-weight: 900; text-align: center; text-transform: uppercase; }
.name-input:focus { border-color: var(--red); box-shadow: 0 0 0 4px #f0182614; }
.name-input::placeholder { color: #999; font-size: 0.88rem; letter-spacing: 0.08em; }
.join-form { gap: 12px; }
.join-form h1 { margin-bottom: 2px; }
.code-input { letter-spacing: 0.18em; }
.primary { display: flex; min-height: 62px; align-items: center; justify-content: center; gap: 12px; border: 2px solid #111; border-radius: 14px; background: var(--red); color: #fff; box-shadow: 3px 3px 0 #111; font-size: 1rem; font-weight: 900; letter-spacing: 0.08em; cursor: pointer; transition: 0.15s ease; }
.primary:hover { transform: translateY(-2px); background: #ff2633; box-shadow: 4px 5px 0 #111; }
.primary:active { transform: translateY(2px); box-shadow: 1px 1px 0 #111; }
.alert { margin: 0 30px 24px; padding: 11px 14px; border: 1.5px solid var(--red); border-radius: 9px; background: #fff3f4; color: #bd0e19; font-size: 0.78rem; font-weight: 800; text-align: center; }

.how-to-card { position: relative; display: flex; flex-direction: column; min-height: 455px; padding: 34px 32px 28px; }
.how-to-eyebrow { color: var(--red); font-size: 0.6rem; font-weight: 900; letter-spacing: 0.14em; }
.how-to-card h2 { margin: 3px 0 22px; font-size: 1.05rem; }
.guide-icon { display: grid; width: 58px; height: 58px; place-items: center; border: 2px solid var(--red); border-radius: 14px; color: var(--red); font-size: 2rem; }
.guide-number { margin: 20px 0 3px !important; color: #888 !important; font-size: 0.65rem !important; font-weight: 900; }
.how-to-card h3 { margin: 0 0 10px; font-size: 0.9rem; }
.how-to-card > p { margin: 0; font-size: 0.76rem; line-height: 1.7; }
.guide-dots { display: flex; justify-content: center; gap: 8px; margin-top: auto; padding-top: 20px; }
.guide-dots button { width: 9px; height: 9px; padding: 0; border: 1.5px solid #111; border-radius: 999px; background: #fff; cursor: pointer; }
.guide-dots button.active { width: 24px; border-color: var(--red); background: var(--red); }

.party-note { width: max-content; max-width: calc(100% - 32px); margin: 32px auto 24px; padding: 8px 16px; border: 1.5px solid #111; border-radius: 999px; background: #fff; font-size: 0.7rem; font-weight: 800; }
.party-note span { margin-right: 8px; color: var(--red); }
.home-footer { display: flex; width: 100%; max-width: 1420px; align-items: center; justify-content: space-between; margin: auto auto 0; padding: 20px 0 4px; border-top: 2px solid #111; }
.home-footer > strong { color: var(--red); font-size: 1rem; text-transform: uppercase; }
.home-footer nav { display: flex; gap: 30px; }
.home-footer a { color: #111; font-size: 0.65rem; font-weight: 900; letter-spacing: 0.08em; text-decoration: none; }
.socials { display: flex; gap: 10px; font-weight: 900; }
.doodle { position: absolute; z-index: 0; color: var(--red); font-weight: 900; pointer-events: none; }
.doodle-left { top: 38%; left: 5%; font-size: 3.4rem; transform: rotate(-18deg); }
.doodle-right { top: 23%; right: 5%; padding: 8px; border: 2px solid #111; border-radius: 50%; font-size: 1.7rem; transform: rotate(7deg); }
.doodle-star { right: 7%; bottom: 25%; font-size: 2rem; }

@media (max-width: 900px) {
  .home-page { overflow: auto; }
  .home-shell { overflow: visible; }
  .home-content { max-width: 680px; grid-template-columns: 1fr; }
  .how-to-card { min-height: 310px; }
  .doodle { display: none; }
}

@media (max-width: 620px) {
  .home-page { padding: 10px; }
  .home-shell { min-height: calc(100vh - 20px); padding: 12px; border-radius: 14px; }
  .home-header { min-height: 105px; }
  .language-button, .header-actions { display: none; }
  .home-header { display: flex; justify-content: center; }
  .brand-character { width: 52px; height: 52px; font-size: 1.6rem; }
  .brand-name { font-size: 1.65rem; }
  .brand-name strong { padding: 5px 8px 7px; border-width: 2px; }
  .brand p { margin-top: 10px; font-size: 0.52rem; }
  .home-content { margin-top: 8px; }
  .room-content { grid-template-columns: 1fr; gap: 24px; padding: 25px 18px; }
  .selected-avatar { width: 92px; height: 92px; font-size: 3rem; }
  .avatar-grid { grid-template-columns: repeat(6, 36px); }
  .avatar-option { width: 36px; height: 36px; }
  .tabs { height: 56px; }
  .tabs button { font-size: 0.78rem; }
  .home-footer { flex-direction: column; gap: 16px; }
  .home-footer nav { gap: 16px; }
  .party-note { text-align: center; }
}

@media (max-width: 380px) {
  .avatar-grid { grid-template-columns: repeat(4, 38px); }
}
</style>
