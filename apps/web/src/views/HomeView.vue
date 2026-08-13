<template>
  <main class="home-page">
    <section class="evidence-board">
      <header class="home-header">
        <div class="brand">
          <span class="brand-hat">🎩</span>
          <div><h1>ODD <b>PROMPT</b></h1><p>THE PARTY GAME OF <em>HIDDEN IDENTITIES</em></p></div>
        </div>
        <div class="header-tools">
          <button>◎ &nbsp; EN⌄</button><button aria-label="Help">?</button><button aria-label="Music">♫</button><button aria-label="Sound">◕</button>
        </div>
      </header>
      <svg class="red-strings" viewBox="0 0 1200 650" preserveAspectRatio="none" aria-hidden="true">
        <path d="M120 130 L365 325 L130 475 L500 555 L1025 470 L850 320 L1080 130" />
        <path d="M140 305 L500 555 L700 570 L1040 300" />
      </svg>

      <div class="case-heading">
        <span class="stamp">CONFIDENTIAL</span>
        <h2>TRUST <b>NO ONE.</b></h2>
        <p>One prompt is not like the others.<br />Can you find the <em>Odd One?</em></p>
      </div>

      <button
        v-for="(avatar, index) in avatars"
        :key="avatar.id"
        class="suspect-card"
        :class="[`suspect-${index}`, { selected: selectedAvatar === index }]"
        :aria-label="`Choose ${avatar.name}`"
        @click="selectedAvatar = index"
      >
        <i class="pin"></i><img :src="avatar.src" alt="" /><strong>{{ suspectName(avatar.name) }}</strong><small v-if="selectedAvatar === index">✓ SELECTED</small>
      </button>

      <section class="operations">
        <article class="operation-note create-note">
          <h3>★ &nbsp; CREATE ROOM &nbsp; ★</h3>
          <div class="chosen-agent"><img :src="avatars[selectedAvatar].src" alt="" /><span>SELECTED SUSPECT<b>{{ suspectName(avatars[selectedAvatar].name) }}</b></span></div>
          <label for="host-name">AGENT NAME</label>
          <input id="host-name" v-model="hostName" maxlength="20" placeholder="ENTER YOUR NAME" @keyup.enter="createRoom" />
          <button @click="createRoom"><span>♟</span> CREATE ROOM <b>→</b></button>
        </article>
        <article class="operation-note join-note">
          <h3>★ &nbsp; JOIN ROOM &nbsp; ★</h3>
          <label for="player-name">AGENT NAME</label>
          <input id="player-name" v-model="playerName" maxlength="20" placeholder="ENTER YOUR NAME" />
          <label for="room-code">SECRET CODE</label>
          <input id="room-code" v-model="roomCode" maxlength="6" placeholder="ENTER ROOM CODE" @keyup.enter="joinRoom" />
          <button @click="joinRoom">JOIN ROOM <b>→</b></button>
        </article>
      </section>

      <p class="case-note">Every game is a new case.<br />Every friend could be <b>the odd one.</b></p>
      <button class="how-to-note" @click="showGuide = !showGuide">HOW TO PLAY →</button>
      <aside v-if="showGuide" class="guide-note">
        <button aria-label="Close guide" @click="showGuide = false">×</button>
        <h3>HOW TO PLAY</h3>
        <p><b>01</b> Get a prompt. One agent gets something different.</p>
        <p><b>02</b> Answer and discuss without revealing your prompt.</p>
        <p><b>03</b> Vote for the agent you think is the Odd One.</p>
      </aside>
      <aside class="sticky sticky-left">Looks<br />suspicious...<br />or not?</aside>
      <aside class="sticky sticky-right">One of them<br />doesn't get<br />the real prompt.</aside>
      <aside class="case-file"><b>CASE FILE</b><span>OBJECTIVE:<br />Find and vote out<br />the Odd One.</span></aside>
      <aside class="case-status">CASE STATUS:<b>WAITING FOR AGENTS</b></aside>
      <div v-if="gameStore.errorMessage" class="alert" role="alert">{{ gameStore.errorMessage }}</div>
    </section>

    <footer><button aria-label="Settings">⚙</button><p>WHO IS<br />THE <b>ODD ONE?</b></p><nav><a href="#">PRIVACY</a><a href="#">CONTACT</a></nav></footer>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '../stores/gameStore'
import { avatars } from '../data/avatars'

const router = useRouter()
const gameStore = useGameStore()
const selectedAvatar = ref(0)
const hostName = ref('')
const playerName = ref('')
const roomCode = ref('')
const showGuide = ref(false)

function suspectName(name: string) {
  return name.replace(/^Cool /, '').toUpperCase()
}

watch(() => gameStore.roomCode, code => { if (code) router.push(`/lobby/${code}`) })

function createRoom() {
  if (!hostName.value.trim()) return void (gameStore.errorMessage = 'Enter your agent name')
  gameStore.createRoom(hostName.value.trim(), avatars[selectedAvatar.value].id)
}

function joinRoom() {
  if (!playerName.value.trim()) return void (gameStore.errorMessage = 'Enter your agent name')
  const code = roomCode.value.trim().toUpperCase()
  if (!/^[A-Z0-9]{6}$/.test(code)) return void (gameStore.errorMessage = 'Room codes must be 6 letters or numbers')
  gameStore.joinRoom(code, playerName.value.trim(), avatars[selectedAvatar.value].id)
}
</script>

<style scoped src="../styles/home.css"></style>
