<script setup lang="ts">
import {onMounted, ref} from "vue";
import { PlaceRenderer } from '@/renderer/2d/placeRenderer';

const canvasElement = ref();
const canvasContainer = ref();
const renderer = ref<PlaceRenderer>()

const changeRenderMode = () => {
  if (renderer.value) {
    if (renderer.value.renderMode === 1) {
      renderer.value.renderMode = 0;
    } else {
      renderer.value.renderMode = 1;
    }
  }
}

onMounted(() => {
  renderer.value = new PlaceRenderer(canvasElement.value)
})

</script>
<template>
  <button @click='changeRenderMode' style='position: absolute; z-index: 999'>Change render mode</button>
  <div ref="canvasContainer" class="viewer-container">
    <canvas ref="canvasElement" class="canvas" width="2000" height="2000" ></canvas>
  </div>
</template>

<style>
.viewer-container {
  background-color: black;
  position: absolute;
  overflow: hidden;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.canvas {
  image-rendering: pixelated;
}
</style>