<script setup lang='ts'>
import { nextTick, onMounted, ref, watch } from 'vue';
import { UserRenderer } from '@/renderer/userRenderer';
import { selectedUsers, userPixels, userRenderer } from '@/renderer/rendererState';
import { pixelColors } from '@/model/colorMapping';
import chroma from 'chroma-js';
import { useRoute } from 'vue-router';
import CanvasControls from '@/components/renderer/CanvasControls.vue';

const userRendererCanvas = ref();


const route = useRoute();


onMounted(() => {
  if (!userRenderer.value) {
    userRenderer.value = new UserRenderer(userRendererCanvas.value);
    const ctx = userRendererCanvas.value.getContext('2d');
    userRenderer.value?.render();
    userRenderer.value?.fit();
    userRenderer.value?.center();
  }
});

watch(() => route.fullPath, () => {
  if (route.fullPath !== '/user') {
    userRenderer.value?.stop();
    userRenderer.value?.canvasEvents.resetEvents();
  } else {

    userRenderer.value?.restart();
    userRenderer.value?.canvasEvents.registerEvents();
    userRenderer.value?.render();
  }
});

watch(() => selectedUsers, (old, newValue) => {
  userRenderer.value?.render();
}, { deep: true });


</script>
<template>
  <div ref='userRendererContainer' class='viewer-container'>
    <canvas ref='userRendererCanvas' class='canvas user-canvas' width='2000' height='2000'></canvas>
  </div>
  <CanvasControls class='user-canvas-controls' :show-play-icons='false'></CanvasControls>
</template>

<style>
.user-canvas {
  background-color: black;
}

.user-canvas-controls {
  position: absolute;
  bottom: 50px;
  left: 25px;
}
</style>