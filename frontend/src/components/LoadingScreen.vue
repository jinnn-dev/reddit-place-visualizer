<script setup lang='ts'>
import { reactive, onMounted, onUnmounted } from 'vue';
import loading_messages from '@/lib/loading_messages';

let remaining_array: Array<string> = [];
let timer: NodeJS.Timer;

defineProps({
  chunkPercentage: Number,
  loadedChunks: Number,
  numberChunks: Number,
})

const loadingText = reactive({
  text: "Loading new Updated"
});

onMounted(() => {
  // Update loading text every few seconds
  timer = setInterval(updateText, 3000);
});

onUnmounted(() => {
  console.log("Loading screen unmounted");
  clearInterval(timer);
});

function updateText(){
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
    <span style='color: white'>Loaded Chunks: {{loadedChunks}} / {{numberChunks}}</span>
    <span style='color: white'>Current Chunk: {{ Math.floor((chunkPercentage || 0) * 100) }}%</span>
    <!-- https://codepen.io/crayon-code/pen/eYdVLJo -->
    <div class="mosaic-loader">
      <div class="cell d-0"></div>
      <div class="cell d-1"></div>
      <div class="cell d-2"></div>
      <div class="cell d-3"></div>
      <div class="cell d-1"></div>
      <div class="cell d-2"></div>
      <div class="cell d-3"></div>
      <div class="cell d-4"></div>
      <div class="cell d-2"></div>
      <div class="cell d-3"></div>
      <div class="cell d-4"></div>
      <div class="cell d-5"></div>
      <div class="cell d-3"></div>
      <div class="cell d-4"></div>
      <div class="cell d-5"></div>
      <div class="cell d-6"></div>
    </div>
    <span style='color: white'>{{ loadingText.text }}</span>

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
  gap: 20px;
}

.mosaic-loader {
  --cell-size: 64px;
  --cell-spacing: 1px;
  --border-width: 1px;
  --cells: 4;
  --total-size: calc(var(--cells) * (var(--cell-size) + 2 * var(--cell-spacing)));
  display: flex;
  flex-wrap: wrap;
  width: var(--total-size);
  height: var(--total-size);
}

.mosaic-loader>.cell {
  --cell-color: white;
  flex: 0 0 var(--cell-size);
  margin: var(--cell-spacing);
  background-color: transparent;
  box-sizing: border-box;
  border: var(--border-width) solid var(--cell-color);
  animation: 1.5s ripple ease infinite;
}

.mosaic-loader>.cell.d-1 {
  animation-delay: 100ms;
}

.mosaic-loader>.cell.d-2 {
  animation-delay: 200ms;
}

.mosaic-loader>.cell.d-3 {
  animation-delay: 300ms;
}

.mosaic-loader>.cell.d-4 {
  animation-delay: 400ms;
}

.mosaic-loader>.cell.d-5 {
  animation-delay: 500ms;
}

.mosaic-loader>.cell.d-6 {
  animation-delay: 600ms;
}

.mosaic-loader>.cell:nth-child(1) {
  --cell-color: #d4aee0;
}

.mosaic-loader>.cell:nth-child(2) {
  --cell-color: #8975b4;
}

.mosaic-loader>.cell:nth-child(3) {
  --cell-color: #64518a;
}

.mosaic-loader>.cell:nth-child(4) {
  --cell-color: #565190;
}

.mosaic-loader>.cell:nth-child(5) {
  --cell-color: #44abac;
}

.mosaic-loader>.cell:nth-child(6) {
  --cell-color: #2ca7d8;
}

.mosaic-loader>.cell:nth-child(7) {
  --cell-color: #1482ce;
}

.mosaic-loader>.cell:nth-child(8) {
  --cell-color: #05597c;
}

.mosaic-loader>.cell:nth-child(9) {
  --cell-color: #b2dd57;
}

.mosaic-loader>.cell:nth-child(10) {
  --cell-color: #57c443;
}

.mosaic-loader>.cell:nth-child(11) {
  --cell-color: #05b853;
}

.mosaic-loader>.cell:nth-child(12) {
  --cell-color: #19962e;
}

.mosaic-loader>.cell:nth-child(13) {
  --cell-color: #fdc82e;
}

.mosaic-loader>.cell:nth-child(14) {
  --cell-color: #fd9c2e;
}

.mosaic-loader>.cell:nth-child(15) {
  --cell-color: #d5385a;
}

.mosaic-loader>.cell:nth-child(16) {
  --cell-color: #911750;
}

@keyframes ripple {
  0% {
    background-color: transparent;
  }

  30% {
    background-color: var(--cell-color);
  }

  60% {
    background-color: transparent;
  }

  100% {
    background-color: transparent;
  }
}
</style>