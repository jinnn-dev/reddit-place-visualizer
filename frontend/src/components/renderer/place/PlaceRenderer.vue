<script lang='ts' setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { PlaceRenderer } from '@/renderer/placeRenderer';
import Timeline from '@/components/renderer/place/timeline/Timeline.vue';
import LoadingScreen from '@/components/renderer/place/LoadingScreen.vue';
import { placeRenderer, rendererState, timelineState } from '@/renderer/rendererState';
import PlaceRendererSettings from '@/components/renderer/place/PlaceRendererSettings.vue';
import { useRoute } from 'vue-router';
import PlaceControls from '@/components/renderer/CanvasControls.vue';

const canvasElement = ref();
const canvasContainer = ref();

const minNumOfLoadedChunks = 8;

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

const togglePlay = () => {
  placeRenderer.value?.togglePlay();
};

const reset = () => {
  placeRenderer.value?.reset();
};

watch(() => route.fullPath, () => {
  if (route.fullPath == '/') {
    placeRenderer.value?.restart();
    placeRenderer.value?.canvasEvents.registerEvents();
  } else {
    placeRenderer.value?.stop();
    placeRenderer.value?.canvasEvents.resetEvents();
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
        // placeRenderer.value?.transform();
        placeRenderer.value?.fit();
        placeRenderer.value?.center();
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
    :loaded-chunks='rendererState.loadedChunks'
    :number-chunks='minNumOfLoadedChunks'
  >
  </LoadingScreen>
  <div v-show='!loading'>
    <PlaceRendererSettings
      :default-lifespan='PlaceRenderer.DEFAULT_PIXEL_LIFESPAN'
      :max-lifespan='30'
      :min-lifespan='1'
      @changeRenderMode='changeRenderMode'
      @colorMapChanged='colorMapChanged'
      @fillSelectedColors='fillSelectedColors'
      @lifespanChanged='lifespanChanged'
      @selectedPixelColorChanged='selectedPixelColorChanged'
    >
    </PlaceRendererSettings>
    <div ref='canvasContainer' class='viewer-container'>
      <canvas ref='canvasElement' class='canvas place-canvas' height='2000' width='2000'></canvas>
    </div>
    <div class='controls'>
      <div class='controls-container'>
        <PlaceControls @reset='reset' @togglePlay='togglePlay'></PlaceControls>
      </div>
      <div class='timelines'>
        <Timeline id='rate'></Timeline>
        <Timeline id='time'></Timeline>
      </div>
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
  box-shadow: 0 0px 15px 5px rgb(88, 88, 88), 0 0px 6px -4px gray;
}

.controls {
  display: flex;
  position: fixed;
  width: 100%;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
}

.controls-container {
  width: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timelines {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.timelines input {
  width: 80%;
}
</style>