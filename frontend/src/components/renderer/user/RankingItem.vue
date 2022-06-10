<script lang='ts' setup>

import type { PropType } from 'vue';
import { ref } from 'vue';
import type { UserRank } from '@/model/userRank';
import { selectedUsers } from '@/renderer/rendererState';

const props = defineProps({
  index: {
    type: Number,
    required: true
  },
  item: {
    type: Object as PropType<UserRank>,
    required: true
  }
});

const emit = defineEmits(['togglePixels']);

const arePixelVisible = ref(false);

const togglePixels = () => {
  arePixelVisible.value = !arePixelVisible.value;
  emit('togglePixels', arePixelVisible.value, props.item);
};

</script>
<template>
  <div>{{ index }}</div>
  <div>
    <div :title='item.userId' class='user-ranking-item-id'>{{ item.userId.substring(0, 20) }}...</div>
    <div>Amount: {{ item.amount }}</div>
  </div>
  <div class='toggle-user-pixels' @click='togglePixels'>
    <svg v-if='selectedUsers.has(item.userId)' fill='currentColor' height='24' viewBox='0 0 256 256'
         width='24' xmlns='http://www.w3.org/2000/svg'>
      <path d='M128,56C48,56,16,128,16,128s32,72,112,72,112-72,112-72S208,56,128,56Z' fill='none' stroke='currentColor'
            stroke-linecap='round' stroke-linejoin='round' stroke-width='16'></path>
      <circle cx='128' cy='128' fill='none' r='40' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'
              stroke-width='16'></circle>
    </svg>
    <svg v-else fill='currentColor' height='24' viewBox='0 0 256 256' width='24'
         xmlns='http://www.w3.org/2000/svg'>
      <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='48' x2='208'
            y1='40' y2='216'></line>
      <path d='M154.9,157.6A39.6,39.6,0,0,1,128,168a40,40,0,0,1-26.9-69.6' fill='none' stroke='currentColor'
            stroke-linecap='round' stroke-linejoin='round' stroke-width='16'></path>
      <path d='M74,68.6C33.2,89.2,16,128,16,128s32,72,112,72a117.9,117.9,0,0,0,54-12.6' fill='none'
            stroke='currentColor'
            stroke-linecap='round' stroke-linejoin='round' stroke-width='16'></path>
      <path d='M208.6,169.1C230.4,149.6,240,128,240,128S208,56,128,56a123.9,123.9,0,0,0-20.7,1.7' fill='none'
            stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16'></path>
      <path d='M135.5,88.7a39.9,39.9,0,0,1,32.3,35.5' fill='none' stroke='currentColor' stroke-linecap='round'
            stroke-linejoin='round' stroke-width='16'></path>
    </svg>

  </div>
</template>

<style>
.user-ranking-item-id {
  font-family: monospace;;
  font-size: 0.8rem;
}

.toggle-user-pixels {
  cursor: pointer;
}

</style>