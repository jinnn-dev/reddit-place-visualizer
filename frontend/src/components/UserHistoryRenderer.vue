<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { UserRenderer } from '@/renderer/userRenderer';

const renderer = ref<UserRenderer>();
const userRendererCanvas = ref();

onMounted(() => {
  renderer.value = new UserRenderer(userRendererCanvas.value);
  renderer.value!.renderLoop.ticks = 1
  renderer.value!.renderLoop.start();
})
</script>
<template>
  <div ref='userRendererContainer' class='viewer-container'>
    <canvas ref='userRendererCanvas' class='canvas user-canvas' width='2000' height='2000'></canvas>
  </div>
</template>

<style>
.user-canvas {
  background-color: white;
}
</style>