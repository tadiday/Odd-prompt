<template>
  <section class="phase-shell">
    <div class="phase-intro">
      <span class="private-badge">⌁ PRIVATE PROMPT</span>
      <h1>♙ THIS IS YOUR PROMPT</h1>
      <p>Only you can see this. Don’t tell anyone!</p>
    </div>

    <div class="timer-card">
      <small>TIME LEFT</small>
      <strong>◷ {{ formattedCountdown }}</strong>
    </div>

    <div v-if="gameStore.currentPlayerPrompt" class="answer-card">
      <h2>{{ gameStore.currentPlayerPrompt.prompt }}</h2>
      <div class="textarea-wrap">
        <textarea
          v-model="draftAnswer"
          placeholder="Write your answer here..."
          maxlength="100"
          :disabled="!!gameStore.submittedAnswer"
        />
        <span>{{ draftAnswer.length }} / 100</span>
      </div>
    </div>
    <div v-else class="waiting">Waiting for your prompt…</div>

    <p class="auto-submit">
      Your answer will be submitted automatically when time is up!
    </p>
    <button
      v-if="gameStore.currentPlayerPrompt"
      class="primary-button"
      :disabled="!!gameStore.submittedAnswer"
      @click="submitAnswer"
    >
      {{ gameStore.submittedAnswer ? 'ANSWER SUBMITTED ✓' : 'SUBMIT ANSWER' }}
    </button>

    <ProgressiveFooter active-phase="answer" />
  </section>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../../stores/game'
import ProgressiveFooter from './ProgressiveFooter.vue'
const gameStore = useGameStore()
const draftAnswer = ref('')
const formattedCountdown = computed(() => {
  const seconds = gameStore.phaseCountdown ?? 0
  const minutes = String(Math.floor(seconds / 60)).padStart(2, '0')
  const remainingSeconds = String(seconds % 60).padStart(2, '0')

  return `${minutes}:${remainingSeconds}`
})

function submitAnswer() {
  if (!gameStore.submittedAnswer) {
    gameStore.submitAnswer(draftAnswer.value)
  }
}

watch(
  () => gameStore.phaseCountdown,
  (countdown) => {
    if (countdown === 0 && !gameStore.submittedAnswer) {
      gameStore.submitAnswer(draftAnswer.value)
    }
  }
)
</script>

<style scoped>
.phase-shell {
  --red: #f02632;
  position: relative;
  width: 100%;
  max-width: 1600px;
  flex: 1;
  min-height: 0;
  margin: 0 auto;
  padding: 34px 72px 105px;
  box-sizing: border-box;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: #111;
  box-shadow: none;
}

.phase-intro { text-align: center; }

.private-badge {
  display: inline-block;
  padding: 8px 17px;
  border-radius: 999px;
  background: #ffe7e9;
  color: var(--red) !important;
  font-size: 0.85rem;
  font-weight: 900;
}

.phase-intro h1 { margin: 18px 0 5px; font-size: 1.2rem; }
.phase-intro p { margin: 0 0 24px; font-size: 0.95rem; }

.timer-card {
  position: absolute;
  top: 92px;
  right: 72px;
  min-width: 150px;
  padding: 12px 18px;
  border: 2px solid var(--red);
  border-radius: 12px;
  text-align: center;
}

.timer-card small { display: block; font-size: 0.72rem; font-weight: 900; }
.timer-card strong { font-size: 1.4rem; }

.answer-card {
  max-width: 820px;
  margin: auto;
  overflow: hidden;
  border: 2px solid #111;
  border-radius: 14px;
}

.answer-card h2 {
  margin: 0;
  padding: 19px 24px;
  border-bottom: 1px solid #ddd;
  color: var(--red) !important;
  text-align: center;
  font-size: 1.35rem;
}

.textarea-wrap { position: relative; }

.textarea-wrap textarea {
  display: block;
  width: 100%;
  height: 190px;
  padding: 21px 24px 38px;
  border: 0;
  outline: 0;
  resize: none;
  background: repeating-linear-gradient(#fff 0 43px, #ececec 44px);
  font-size: 1.05rem;
  line-height: 44px;
}

.textarea-wrap span {
  position: absolute;
  right: 18px;
  bottom: 12px;
  color: #777 !important;
  font-size: 0.82rem;
}

.auto-submit { margin: 20px 0 14px; text-align: center; font-size: 0.85rem; font-weight: 700; }

.primary-button {
  display: block;
  min-width: 260px;
  margin: 0 auto 32px;
  padding: 14px 24px;
  border: 2px solid #111;
  border-radius: 10px;
  background: var(--red);
  color: #fff;
  font-size: 0.95rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow: 3px 3px #111;
}

.primary-button:disabled { opacity: 0.55; }
.waiting { padding: 95px; text-align: center; color: #777; font-size: 1rem; }


@media (max-width: 700px) {
  .phase-shell { width: 100%; padding: 28px 16px 22px; overflow: auto; }
  .timer-card { position: static; width: max-content; margin: 0 auto 18px; }
  .phase-intro p { margin-bottom: 14px; }
  .answer-card h2 { font-size: 1rem; }
  .textarea-wrap textarea { height: 150px; font-size: 0.9rem; }
}
</style>
