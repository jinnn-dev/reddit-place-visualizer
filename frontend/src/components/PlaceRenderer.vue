<script setup lang='ts'>
import { computed, onMounted, ref, watch } from 'vue';
import { PlaceRenderer } from '@/renderer/2d/placeRenderer';
import Timeline from '@/components/Timeline.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import { rendererState, timelineState } from '@/renderer/rendererState';
import PlaceRendererSettings from '@/components/PlaceRendererSettings.vue';

const canvasElement = ref();
const canvasContainer = ref();
const renderer = ref<PlaceRenderer>();

const loading = computed(() => rendererState.timePercentage < minPercentage);

const minPercentage = 0.5;


const changeRenderMode = (value: any) => {
  if (renderer.value) {
    renderer.value.renderMode = parseInt(value);

  }
};

const lifespanChanged = (value: any) => {
  if (renderer.value) {
    renderer.value.pixelLifespan = parseInt(value);
  }
};

const colorMapChanged = (value: any) => {
  if (renderer.value) {
    renderer.value.updateSelectedHeatMap(parseInt(value))
  }
};

const selectedPixelColorChanged = (value: any) => {
  if (renderer.value) {
    const index = parseInt(value);
    renderer.value.toggleSelectedColor(index);
  }
};

const fillSelectedColors = (value: boolean) => {
  if (renderer.value) {
    renderer.value.setAllSelectedColors(value);
  }
};

watch(() => timelineState.changed, () => {
  if (timelineState.changed) {
    if (renderer.value) {
      renderer.value.updateTimeline()
      timelineState.changed = false;
    }
  }
});


watch(() => rendererState.timePercentage, () => {
  if (rendererState.timePercentage >= minPercentage) {
    if (!renderer.value?.isRunning) {
      renderer.value?.start();
    }
  }
});

onMounted(() => {
  renderer.value = new PlaceRenderer(canvasElement.value);
});

</script>
<template>
  <LoadingScreen :percentage='rendererState.timePercentage * 2' :chunkPercentage="rendererState.chunkProgress" v-if='loading'></LoadingScreen>
  <div v-show='!loading'>
    <PlaceRendererSettings :default-lifespan='PlaceRenderer.DEFAULT_PIXEL_LIFESPAN'
                           :max-lifespan='30'
                           :min-lifespan='1'
                           @changeRenderMode='changeRenderMode'
                           @lifespanChanged='lifespanChanged'
                           @colorMapChanged='colorMapChanged'
                           @selectedPixelColorChanged='selectedPixelColorChanged'
                           @fillSelectedColors='fillSelectedColors'
    >
    </PlaceRendererSettings>
    <div ref='canvasContainer' class='viewer-container'>
      <canvas ref='canvasElement' class='canvas place-canvas' width='2000' height='2000'></canvas>
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

.timelines input {
  width: 80%;
}
</style>