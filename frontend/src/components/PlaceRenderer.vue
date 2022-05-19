<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue';
import { PlaceRenderer } from '@/renderer/2d/placeRenderer';
import Timeline from '@/components/Timeline.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import { rendererState } from '@/renderer/rendererState';
import PlaceRendererSettings from '@/components/PlaceRendererSettings.vue';

const canvasElement = ref();
const canvasContainer = ref();
const renderer = ref<PlaceRenderer>();

const loading = computed(() => rendererState.timePercentage < minPercentage);

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

const lifespanChanged = (value: any) => {
  if (renderer.value) {
    renderer.value.pixelLifespan = parseInt(value);
  }
}

const colorMapChanged = (value: any) => {
  if (renderer.value) {
    renderer.value.selectedColorMap = parseInt(value)
  }
}


watch(() => rendererState.timePercentage, () => {
  if (rendererState.timePercentage > minPercentage) {
    renderer.value?.renderLoop.start();
  }
});

onMounted(() => {
  renderer.value = new PlaceRenderer(canvasElement.value);
});

</script>
<template>
  <LoadingScreen :percentage='rendererState.timePercentage * 2' v-show='loading'></LoadingScreen>
  <div v-show='!loading'>
    <PlaceRendererSettings :default-lifespan='PlaceRenderer.DEFAULT_PIXEL_LIFESPAN'
                           :max-lifespan='30'
                           :min-lifespan='1'
                           @changeRenderMode='changeRenderMode'
                           @lifespanChanged='lifespanChanged'
                           @colorMapChanged='colorMapChanged'
    >
    </PlaceRendererSettings>
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