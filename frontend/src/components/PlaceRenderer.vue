<script setup lang='ts'>
import { computed, nextTick, onDeactivated, onMounted, onUnmounted, ref, watch } from 'vue';
import { PlaceRenderer } from '@/renderer/placeRenderer';
import Timeline from '@/components/Timeline.vue';
import LoadingScreen from '@/components/LoadingScreen.vue';
import { placeRenderer, rendererState, timelineState } from '@/renderer/rendererState';
import PlaceRendererSettings from '@/components/PlaceRendererSettings.vue';
import { useRoute } from 'vue-router';
import { NUMBER_OF_CHUNKS } from '@/lib/chunkLoader';

const canvasElement = ref();
const canvasContainer = ref();

const minNumOfLoadedChunks = NUMBER_OF_CHUNKS / 2;

const loading = computed(() => rendererState.loadedChunks < minNumOfLoadedChunks);

const route = useRoute();


const changeRenderMode = (value: any) => {
  if (placeRenderer.value) {
    placeRenderer.value.renderMode = parseInt(value);

  }
};

const lifespanChanged = (value: any) => {
  if (placeRenderer.value) {
    placeRenderer.value.pixelLifespan = parseInt(value);
  }
};

const colorMapChanged = (value: any) => {
  if (placeRenderer.value) {
    placeRenderer.value.updateSelectedHeatMap(parseInt(value));
  }
};

const selectedPixelColorChanged = (value: any) => {
  if (placeRenderer.value) {
    const index = parseInt(value);
    placeRenderer.value.toggleSelectedColor(index);
  }
};

const fillSelectedColors = (value: boolean) => {
  if (placeRenderer.value) {
    placeRenderer.value.toggleAllColors(value);
  }
};

watch(() => route.fullPath, () => {
  if (route.fullPath == '/') {
    placeRenderer.value?.restart();
  } else {
    placeRenderer.value?.stop();
  }
});

watch(() => timelineState.changed, () => {
  if (timelineState.changed) {
    if (placeRenderer.value) {
      placeRenderer.value.updateTimeline();
      timelineState.changed = false;
    }
  }
});


watch(() => loading.value, () => {
  if (!loading.value) {
      if (!placeRenderer.value?.isRunning) {
      placeRenderer.value?.start();

      nextTick(() => {
        placeRenderer.value?.transform();
      });
    }
  }
});

onMounted(() => {

  if (!placeRenderer.value) {
    placeRenderer.value = new PlaceRenderer(canvasElement.value);
  } else {
    placeRenderer.value.restart();
  }
});

onUnmounted(() => {
  if (placeRenderer.value) {
    placeRenderer.value.stop();
  }
});

</script>
<template>
  <LoadingScreen
    v-if='loading'
    :chunkPercentage='rendererState.chunkProgress'
    :number-chunks='minNumOfLoadedChunks'
    :loaded-chunks='rendererState.loadedChunks'
  >
  </LoadingScreen>
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
  /*transform-origin: 0 0 0;*/
  box-shadow: 0 0px 15px 5px rgb(88, 88, 88), 0 0px 6px -4px gray;
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