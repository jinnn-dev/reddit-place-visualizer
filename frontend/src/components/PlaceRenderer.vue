<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue';
import { PlaceRenderer } from '@/renderer/2d/placeRenderer';
import Timeline from '@/components/Timeline.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import { rendererState } from '@/renderer/rendererState';

const canvasElement = ref();
const canvasContainer = ref();
const renderer = ref<PlaceRenderer>();

const minPercentage = 0.5;

const changeRenderMode = () => {
  if (renderer.value) {
    if (renderer.value.renderMode === 1) {
      renderer.value.renderMode = 0;
    } else {
      renderer.value.renderMode = 1;
    }
  }
};

const loading = computed(() => rendererState.timePercentage < minPercentage)

watch(() => rendererState.timePercentage, () => {
  if (rendererState.timePercentage > minPercentage) {
    renderer.value?.renderLoop.start();
  }
})

onMounted(() => {
  renderer.value = new PlaceRenderer(canvasElement.value);


});

</script>
<template>
  <LoadingScreen :percentage='rendererState.timePercentage * 2' v-show='loading'></LoadingScreen>
  <div v-show='!loading'>
    <button @click='changeRenderMode' style='position: absolute; z-index: 999'>Change render mode</button>
    <div ref='canvasContainer' class='viewer-container'>
      <canvas ref='canvasElement' class='canvas' width='2000' height='2000'></canvas>
    </div>

    <div class='timelines'>
      <Timeline id='rate'></Timeline>
      <Timeline id='time'></Timeline>
    </div>
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

.timelines {
  position: fixed;
  width: 100%;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
}
</style>