<script lang='ts' setup>
import { onMounted, onUnmounted, reactive } from 'vue';
import loading_messages from '@/lib/loading_messages';
import MosaicLoader from '@/components/MosaicLoader.vue';

let remaining_array: Array<string> = [];
let timer: NodeJS.Timer;

defineProps({
  chunkPercentage: Number,
  loadedChunks: Number,
  numberChunks: Number
});

const loadingText = reactive({
  text: 'Loading new Updated'
});

onMounted(() => {
  // Update loading text every few seconds
  timer = setInterval(updateText, 3000);
});

onUnmounted(() => {
  clearInterval(timer);
});

function updateText() {
  // If no text is remaining, refill array with all available texts
  if (remaining_array.length == 0) {
    remaining_array = loading_messages.slice();
  }

  // Display random text from remaining_array and remove it from array to prevent showing the same text twice
  let text = remaining_array[Math.floor(Math.random() * remaining_array.length)];
  loadingText.text = text;
  remaining_array.splice(remaining_array.indexOf(text), 1);
}

</script>
<template>
  <div class='loading-container'>
    <div class='loading-text-container'>
      <div class='loading-text-prefix'>Loaded Chunks:</div>
      <div class='loading-text-value'>{{ loadedChunks }} / {{ numberChunks }}</div>
      <div class='loading-text-prefix'>Current Chunk:</div>
      <div class='loading-text-value'>{{ Math.floor((chunkPercentage || 0) * 100) }}%</div>
    </div>

    <MosaicLoader></MosaicLoader>
    <span class='loading-funny-text'>{{ loadingText.text }}</span>

  </div>
</template>

<style>
.loading-container {
  position: absolute;
  width: 100%;
  height: 100vh;
  background-color: black;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  color: white;
  font-size: 1.5rem;
}

.loading-text-container {
  display: grid;
  gap: 8px;
  grid-template-columns: 200px 70px;
  grid-template-rows: 50px 50px;
}

.loading-text-prefix {
  text-align: right;
}
</style>