<template>
  <header class="topbar">
    <!-- LEFT -->
    <button class="leave-button" @click="$emit('leave')">
      <span class="arrow">←</span>
      LEAVE ROOM
    </button>

    <!-- CENTER -->
    <div class="brand">
      <div class="brand-mark">🎩</div>

      <div class="brand-content">
        <div class="brand-title">
          <span>THE</span>
          <strong>ODD ONE</strong>
        </div>

        <div class="brand-subtitle">
          THE PARTY GAME OF HIDDEN IDENTITIES
        </div>
      </div>
    </div>

    <!-- RIGHT -->
    <div class="top-actions">
      <span
        class="connection-dot"
        :data-status="connectionStatus"
      ></span>

      <span class="connection-text">
        {{ connectionStatus }}
      </span>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  connectionStatus: string
}>()

defineEmits<{
  leave: []
}>()
</script>

<style scoped>
/* =========================================
   HEADER
========================================= */

.topbar {
  width: 100%;
  height: 132px;
  min-height: 132px;
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  box-sizing: border-box;
  margin: 0;
  padding: 16px 32px;
  color: #111;
}

/* =========================================
   LEAVE ROOM
========================================= */

.leave-button {
  position: absolute;
  top: 24px;
  left: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 16px;
  background: #fff;
  color: #111;
  border: 2px solid #111;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background 0.15s ease;
}

.leave-button:hover {
  background: #f5f5f5;
  transform: translateY(-1px);
}

.arrow {
  font-size: 1rem;
  font-weight: 900;
}

/* =========================================
   LOGO / BRAND
========================================= */

.brand {
  display: flex;
  align-items: center;
  gap: 14px;
  margin: 0 auto;
}

.brand-mark {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: #ef1823;
  color: #fff;
  border: 3px solid #111;
  border-radius: 50%;
  font-size: 1.7rem;
  font-weight: 900;
  box-shadow: 4px 4px 0 #111;
}

.brand-content {
  display: flex;
  flex-direction: column;
}

.brand-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #111;
  font-size: 2.25rem;
  font-weight: 900;
  line-height: 1;
}

.brand-title strong {
  padding: 5px 10px 7px;
  color: #ef1823;
  border: 3px solid #ef1823;
  border-radius: 12px;
  font-weight: 900;
}

.brand-subtitle {
  margin-top: 13px;
  color: #111;
  font-size: 0.76rem;
  font-weight: 900;
  letter-spacing: 0.32em;
  text-align: center;
}

/* =========================================
   CONNECTION STATUS
========================================= */

.top-actions {
  position: absolute;
  top: 24px;
  right: 32px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background: #fff;
  color: #111;
  border: 1px solid #ccc;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: capitalize;
}

.connection-dot {
  width: 10px;
  height: 10px;
  flex-shrink: 0;
  border: 1.5px solid #111;
  border-radius: 50%;
}

.connection-dot[data-status="connected"] {
  background: #21c45a;
}

.connection-dot[data-status="connecting"] {
  background: #f1b928;
}

.connection-dot[data-status="disconnected"] {
  background: #ef1823;
}

.connection-text {
  color: #111;
}

/* =========================================
   TABLET
========================================= */

@media (max-width: 900px) {
  .topbar {
    padding-left: 20px;
    padding-right: 20px;
  }
  .leave-button {
    left: 20px;
  }
  .top-actions {
    right: 20px;
  }
  .brand-title {
    font-size: 1.9rem;
  }
  .brand-mark {
    width: 56px;
    height: 56px;
    font-size: 1.5rem;
  }
}

/* =========================================
   MOBILE
========================================= */

@media (max-width: 680px) {
  .topbar {
    height: 110px;
    min-height: 110px;
    padding: 14px 16px;
  }
  .brand {
    gap: 9px;
  }
  .brand-title {
    font-size: 1.55rem;
  }
  .brand-title strong {
    padding: 3px 7px 5px;
    border-width: 2px;
    border-radius: 8px;
  }
  .brand-mark {
    width: 46px;
    height: 46px;
    border-width: 2px;
    font-size: 1.25rem;
    box-shadow: 3px 3px 0 #111;
  }
  .brand-subtitle {
    margin-top: 9px;
    font-size: 0.58rem;
    letter-spacing: 0.22em;
  }
  .leave-button {
    top: 15px;
    left: 14px;
    padding: 8px 10px;
    font-size: 0.65rem;
  }
  .top-actions {
    display: none;
  }
}

/* Very small screens */
@media (max-width: 500px) {
  .leave-button {
    padding: 8px;
    font-size: 0;
  }
  .leave-button .arrow {
    font-size: 1.1rem;
  }
}
</style>

<style scoped>
.topbar {
  position: absolute;
  z-index: 30;
  top: 32px;
  left: 50%;
  height: var(--case-header-height);
  min-height: var(--case-header-height);
  width: min(calc(var(--case-board-width) - 56px),calc(100vw - 146px));
  margin: 0;
  transform: translateX(-50%);
  border-bottom: 1px solid #8c6344;
}

.brand-mark {
  background: transparent;
  box-shadow: none;
  font-size: 2.5rem;
}

.brand-title {
  font-size: 2.35rem;
}

.brand-subtitle {
  letter-spacing: .12em;
}

.leave-button {
  left: 0;
}

.top-actions {
  right: 0;
}
</style>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Staatliches&display=swap');
.topbar {
  height: 105px;
  min-height: 105px;
  align-items: center;
  padding: 10px 26px;
  color: #d8cbb4;
  font-family: 'Special Elite',Georgia,serif;
}

.leave-button {
  top: 29px;
  left: 26px;
  padding: 9px 13px;
  border: 1px solid #81725e;
  border-radius: 3px;
  background: #12110e;
  color: #d8cbb4;
  font: 0.65rem 'Special Elite';
}

.leave-button:hover {
  background: #2b2118;
}

.brand-mark {
  width: 52px;
  height: 52px;
  border: 0;
  background: #9f2a23;
  box-shadow: inset 0 0 0 5px #761a16,2px 3px 5px #0008;
  color: #eadcc5;
  font-family: 'Staatliches';
}

.brand-title {
  color: #d8cbb4;
  font: 2.25rem 'Staatliches';
  letter-spacing: .03em;
}

.brand-title strong {
  padding: 0;
  border: 0;
  border-radius: 0;
  color: #ad3027;
}

.brand-subtitle {
  margin-top: 7px;
  color: #d8cbb4;
  font-size: .55rem;
  letter-spacing: .18em;
}

.top-actions {
  top: 34px;
  right: 28px;
  border: 1px solid #776b59;
  background: #11110e;
  color: #d8cbb4;
  font-size: .6rem;
}

.connection-text {
  color: #d8cbb4;
}

.connection-dot {
  border-color: #c7b99f;
}

@media(max-width:680px) {
  .topbar {
    height: 90px;
    min-height: 90px;
  }
  .brand-title {
    font-size: 1.6rem;
  }
  .brand-mark {
    width: 42px;
    height: 42px;
  }
  .leave-button {
    top: 25px;
  }
  .brand-subtitle {
    font-size: .42rem;
  }
}

/* The lobby header shares the homepage evidence-strip treatment. */
.topbar {
  top: 12px;
  width: calc(100% - 44px);
  height: 72px;
  min-height: 72px;
  align-items: center;
  padding: 10px 18px;
  border: 1px solid #765f43;
  background-color: #cbb991;
  background-image:
    repeating-linear-gradient(0deg,transparent 0 25px,#725f4322 26px),
    url('../../assets/textures/aged-paper.png');
  background-size: auto,cover;
  background-blend-mode: normal,soft-light;
  color: #251c14;
  box-shadow: 3px 6px 10px #160b0677,inset 0 0 12px #69482320;
  transform: translateX(-50%) rotate(-.12deg);
}

.leave-button {
  top: 16px;
  left: 18px;
  padding: 10px 14px;
  border-color: #6d5438;
  background: #b49f78;
  color: #251c14;
  font-size: .82rem;
}

.brand {
  gap: 10px;
}

.brand-mark {
  width: 40px;
  height: 40px;
  background: transparent;
  box-shadow: none;
  font-size: 2.15rem;
}

.brand-title {
  color: #251c14;
  font-size: 1.8rem;
}

.brand-title strong {
  color: #a72b23;
}

.brand-subtitle {
  margin-top: 3px;
  color: #493729;
  font-size: .7rem;
  letter-spacing: .06em;
}

.top-actions {
  top: 18px;
  right: 18px;
  padding: 9px 14px;
  border-color: #5d4632;
  background: #251b14;
  color: #eadcc4;
  font-size: .78rem;
}

.connection-text {
  color: #eadcc4;
}
</style>
