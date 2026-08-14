<template>
  <PinnedEvidence :id="note.id" :position="note" :pins="[]">
    <aside class="board-decoration taped" :class="note.kind">
      <i class="tape" aria-hidden="true"></i>
      <b v-if="note.title">{{ note.title }}</b>
      <span>{{ note.body }}</span>
    </aside>
  </PinnedEvidence>
</template>

<script setup lang="ts">
import type { BoardDecoration } from '../../types/evidence-board'
import PinnedEvidence from './PinnedEvidence.vue'

defineProps<{ note: BoardDecoration }>()
</script>
<style scoped>
.board-decoration {
  white-space: pre-line;
  padding: 12px;
  background: #a98b5f;
  color: #21170f;
  box-shadow: 2px 4px 8px #0008;
  font-size: .84rem;
  line-height: 1.42;
}

.board-decoration b,.board-decoration span {
  display: block;
}

.board-decoration b {
  color: #792b25;
  font-size: 1rem;
}

.status {
  background: #b29a74;
  font-size: .72rem;
}

.status b {
  color: #3d2c1e;
  font-size: .72rem;
}

.status span {
  color: #8e2923;
  font-weight: bold;
}

.case-file {
  width: 145px;
}

.board-note {
  width: 320px;
  background: #b9a27e;
  text-align: center;
  font-size: .8rem;
}

.taped {
  padding-top: 17px;
}

.tape {
  position: absolute;
  z-index: 4;
  top: -9px;
  left: 50%;
  width: 58px;
  height: 19px;
  background: #d6bd83;
  box-shadow: 0 1px 2px #3b260f66;
  transform: translateX(-50%) rotate(-2deg);
  clip-path: polygon(3% 8%,97% 0,94% 91%,4% 100%);
}

.sticky .tape {
  width: 44px;
  transform: translateX(-50%) rotate(4deg);
}

.case-file .tape {
  width: 64px;
  transform: translateX(-50%) rotate(-5deg);
}

</style>
