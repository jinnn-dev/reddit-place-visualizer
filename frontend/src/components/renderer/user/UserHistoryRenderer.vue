<script lang='ts' setup>
import { onMounted, ref, watch } from 'vue';
import { UserRenderer } from '@/renderer/userRenderer';
import { selectedUsers, userRenderer } from '@/renderer/rendererState';
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
    <canvas ref='userRendererCanvas' class='canvas user-canvas' height='2000' width='2000'></canvas>
  </div>
  <CanvasControls :show-play-icons='false' class='user-canvas-controls'></CanvasControls>
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