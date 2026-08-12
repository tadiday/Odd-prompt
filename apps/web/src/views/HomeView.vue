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
            <div
              class="selected-avatar"
              :aria-label="`Selected character: ${avatars[selectedAvatar].name}`"
            >
              <img
                :src="avatars[selectedAvatar].src"
                :alt="avatars[selectedAvatar].name"
              />
            </div>
            <div class="avatar-grid" aria-label="Choose a character">
              <button
                v-for="(avatar, index) in avatars"
                :key="avatar.name"
                class="avatar-option"
                :class="{ selected: selectedAvatar === index }"
                :aria-label="`Choose ${avatar.name}`"
                @click="selectedAvatar = index"
              >
                <img :src="avatar.src" alt="" />
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
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { avatars } from '../data/avatars'

const router = useRouter()
const gameStore = useGameStore()

const activeTab = ref<'create' | 'join'>('create')
const activeGuide = ref(0)
const selectedAvatar = ref(0)
const hostName = ref('')
const playerName = ref('')
const roomCode = ref('')

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

watch(
  () => gameStore.roomCode,
  (confirmedRoomCode) => {
    if (confirmedRoomCode) {
      router.push(`/lobby/${confirmedRoomCode}`)
    }
  }
)

function createRoom() {
  if (!hostName.value.trim()) {
    gameStore.errorMessage = 'Please enter a name'
    return
  }

  gameStore.createRoom(
    hostName.value.trim(),
    avatars[selectedAvatar.value].id
  )
}

function joinRoom() {
  if (!playerName.value.trim()) {
    gameStore.errorMessage = 'Please enter a name'
    return
  }

  const normalizedRoomCode = roomCode.value.trim().toUpperCase()
  if (!/^[A-Z0-9]{6}$/.test(normalizedRoomCode)) {
    gameStore.errorMessage = 'Room codes must be 6 letters or numbers'
    return
  }

  gameStore.joinRoom(
    normalizedRoomCode,
    playerName.value.trim(),
    avatars[selectedAvatar.value].id
  )
}
</script>

<style scoped src="../styles/home.css"></style>
