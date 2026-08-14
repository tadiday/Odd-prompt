<template>
  <PinnedEvidence :id="article.id" :position="article" :pins="article.pins">
    <aside class="newspaper" :class="article.variant" aria-hidden="true">
      <span>{{ article.eyebrow }}</span>
      <b>{{ article.title }}</b>
      <p>{{ article.body }}</p>
    </aside>
  </PinnedEvidence>
</template>

<script setup lang="ts">
import type { NewspaperArticle } from '../../types/evidence-board'
import PinnedEvidence from './PinnedEvidence.vue'

defineProps<{ article: NewspaperArticle }>()
</script>
<style scoped>
.newspaper {
  width: 175px;
  padding: 11px 13px;
  border: 1px solid #6d5b43;
  background: repeating-linear-gradient(0deg,#c8b995 0 18px,#a3916e 19px);
  color: #1f1812;
  box-shadow: 3px 5px 8px #140a0688;
  filter: sepia(.18);
}

.newspaper:before {
  content: '';
  position: absolute;
  inset: 5px;
  border: 1px solid #4c403155;
}

.newspaper span {
  display: block;
  padding-bottom: 4px;
  border-bottom: 2px solid #3e3327;
  font: bold .7rem 'Special Elite';
  letter-spacing: .04em;
}

.newspaper b {
  display: block;
  margin: 7px 0 5px;
  font: 1.08rem/1.08 'Staatliches';
}

.newspaper p {
  margin: 0;
  white-space: pre-line;
  font-size: .76rem;
  line-height: 1.32;
}

.small {
  width: 160px;
}

.updates {
  width: 215px;
  padding: 12px 15px;
  background: repeating-linear-gradient(0deg,#d2c39f 0 19px,#a79572 20px);
}

.updates b {
  font-size: 1.08rem;
  line-height: 1.05;
  color: #792b25;
}

.updates p {
  font-size: .76rem;
  line-height: 1.35;
}

</style>
