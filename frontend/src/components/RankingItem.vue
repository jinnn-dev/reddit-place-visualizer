<script setup lang='ts'>

import type { PropType } from 'vue';
import type { UserRank } from '@/model/userRank';
import { ref } from 'vue';

const props = defineProps({
  index: Number,
  item: Object as PropType<UserRank>
})

const emit = defineEmits(['togglePixels'])

const arePixelVisible = ref(false);

const togglePixels = () => {
  arePixelVisible.value = !arePixelVisible.value;
  emit('togglePixels', arePixelVisible.value, props.item)
}

</script>
<template>
  <div>{{index}}</div>
  <div>
    <div class="user-ranking-item-id">{{item.userId.substring(0, 20)}}...</div>
    <div>Amount: {{item.amount}}</div>
  </div>
  <button @click='togglePixels'>
    <span v-if='arePixelVisible'>Hide Pixels</span>
    <span v-else>Show Pixels</span>
  </button>
</template>

<style>
.user-ranking-item-id {
  font-family: monospace;;
  font-size: 0.8rem;
}
</style>