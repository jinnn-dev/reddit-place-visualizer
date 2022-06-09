<script setup lang='ts'>
import { rendererState } from '@/renderer/rendererState';

defineProps({
  showPlayIcons: {
    type: Boolean,
    default: true
  }
});

defineEmits(['togglePlay', 'reset']);


</script>
<template>

  <div class='place-controls'>

    <div class='controls-item-container' v-if='showPlayIcons'>
      <div class='control-icons'>
        <div v-if='rendererState.isRunning' class='play-icon' @click="$emit('togglePlay')">
          <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'>
            <rect x='156' y='40' width='52' height='176' rx='8' fill='none' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></rect>
            <rect x='48' y='40' width='52' height='176' rx='8' fill='none' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></rect>
          </svg>
        </div>

        <div v-else class='play-icon' @click="$emit('togglePlay')">
          <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'>
            <path d='M228.1,121.2,84.2,33.2A8,8,0,0,0,72,40V216a8,8,0,0,0,12.2,6.8l143.9-88A7.9,7.9,0,0,0,228.1,121.2Z'
                  stroke-linecap='round' stroke-linejoin='round' stroke-width='16'></path>
          </svg>

        </div>
      </div>
      <div>or press</div>
      <kbd>
        SPACE
      </kbd>
    </div>

    <div class='controls-item-container'>
      <div class='control-icons' @click='$emit("reset")'>
        <svg class='play-icon' xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 256 256'>
          <polyline points='79.8 99.7 31.8 99.7 31.8 51.7' fill='none' stroke-linecap='round'
                    stroke-linejoin='round' stroke-width='16'></polyline>
          <path d='M65.8,190.2a88,88,0,1,0,0-124.4l-34,33.9' fill='none' stroke-linecap='round'
                stroke-linejoin='round' stroke-width='16'></path>
        </svg>
      </div>
      <div>or press</div>
      <kbd>
        R
      </kbd>
    </div>
  </div>
</template>
<style>
.place-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background-color: rgba(50, 50, 50, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 10px;
  padding: 8px;
  gap: 8px;
  color: white;
}

.play-icon {
  color: white;
  stroke: white;
  fill: none;
  cursor: pointer;
}

.controls-item-container {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
}

kbd {
  background-color: rgb(100, 100, 100);
  padding: 5px;
  border-bottom: 5px solid gray;
  border-right: 3px solid gray;
  border-radius: 5px;
}
</style>