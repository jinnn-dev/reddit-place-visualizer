<script setup lang='ts'>

import { onMounted, ref } from 'vue';
import { heatMapColorMaps, pixelColors } from '@/model/colorMapping';
import ColorMapVisualizer from '@/components/renderer/place/ColorMapVisualizer.vue';
import { rendererState } from '@/renderer/rendererState';

const props = defineProps({
  maxLifespan: {
    type: Number,
    default: 0
  },
  minLifespan: Number,
  defaultLifespan: Number
});

const emit = defineEmits(['changeRenderMode', 'lifespanChanged', 'colorMapChanged', 'selectedPixelColorChanged', 'fillSelectedColors']);

const lifespan = ref(props.defaultLifespan || 0);


const currentRenderMode = ref(0);
const selectedHeatmap = ref(0);

const lifespanChanged = () => {
  emit('lifespanChanged', lifespan.value);
};

const colorMapChanged = (value: number) => {
  selectedHeatmap.value = value;
  emit('colorMapChanged', value);
};

const renderModeChanged = (value: any) => {
  currentRenderMode.value = parseInt(value);
  emit('changeRenderMode', value);
};

const selectedPixelColorChanged = (value: any) => {
  const index = parseInt(value);
  rendererState.selectedColors[index] = !rendererState.selectedColors[index];
  emit('selectedPixelColorChanged', index);
};

const fillSelectedColors = (value: boolean) => {
  rendererState.selectedColors.fill(value);
  emit('fillSelectedColors', value);
};

onMounted(() => {
  rendererState.selectedColors = new Array(pixelColors.length).fill(true);
});


</script>
<template>
  <div class='place-renderer-settings-container'>
    <!--    <button @click="$emit('changeRenderMode')">Change render mode</button>-->
    <div class='place-renderer-toggle-container'>
      <div class='place-renderer-toggle-item'>
        <div class='place-renderer-toggle-header' :class='currentRenderMode === 0 ? "active" : ""'
             @click='renderModeChanged(0)'>Pixel color
        </div>
        <div class='place-renderer-toggle-settings' v-if='currentRenderMode === 0'>
          <div class='place-renderer-toggle-button-container'>
            <button class='place-renderer-toggle-button' @click='fillSelectedColors(true)'>Select All</button>
            <button class='place-renderer-toggle-button ' @click='fillSelectedColors(false)'>Unselect All</button>
          </div>
          <div class='pixel-color-container'>
            <div v-for='(color, index) in pixelColors'>
              <div class='pixel-color-item'
                   :class='!rendererState.selectedColors[index] && "pixel-color-item-inactive"'
                   :style='`background-color: rgb(${color[0]}, ${color[1]}, ${color[2]})`'
                   @click='selectedPixelColorChanged(index)'></div>
            </div>
          </div>
        </div>

      </div>
      <div class='place-renderer-toggle-item'>
        <div class='place-renderer-toggle-header' :class='currentRenderMode === 1 ? "active" : ""'
             @click='renderModeChanged(1)'>Heatmap
        </div>
        <div class='place-renderer-toggle-settings' v-if='currentRenderMode === 1'>
          <div class='lifespan-container'>
            <label class='renderer-settings-label' for='lifespan-slider'>Pixel Lifespan</label>
            <div class='lifespan-slider-container'>
              <input id='lifespan-slider' type='range' :min='minLifespan' :max='maxLifespan' v-model='lifespan'
                     @input='lifespanChanged'>
              <span class='lifespan-label'>{{ lifespan }}</span>
            </div>
          </div>
          <div class='color-map-switcher'>
            <div class='renderer-settings-label'>Colormap</div>
            <div class='color-map-legend'>
              <span>Low Activity</span>
              <span>High Activity</span>
            </div>
            <div v-for='(colorMap, index) in heatMapColorMaps'>
              <ColorMapVisualizer :color-map='colorMap.slice(1)' @click='colorMapChanged(index)'
                                  :is-active='selectedHeatmap === index'></ColorMapVisualizer>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style>


.place-renderer-settings-container {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 900;
  background-color: rgba(50, 50, 50, 0.5);
  backdrop-filter: blur(15px);
  padding: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
  color: white;
  min-width: 210px;
}

.place-renderer-toggle-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.place-renderer-toggle-header {
  cursor: pointer;
  padding: 0.5rem 1rem 0.5rem 1rem;
  border-radius: 5px;
  transition: all 0.1s ease-out;
  background-color: #3071a955;
  text-align: center;
  color: white;
  font-size: 1.1rem;
}

.place-renderer-toggle-button-container {
  display: flex;
  width: 100%;
  gap: 10px;
  margin-bottom: 10px;
}

.place-renderer-toggle-button {
  background-color: #2C3E50;
  border: none;
  border-radius: 5px;
  width: 100%;
  height: 25px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease-out;
}

.place-renderer-toggle-button:hover {
  background-color: #425873;
}

.active {
  background-color: #3071a9;
}

.place-renderer-toggle-settings {
  margin-top: 10px;
}

.place-renderer-toggle-header:hover {
  background-color: #3071a9;
}

.pixel-color-item-inactive {
  opacity: 0.2;
}

.lifespan-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  margin-top: 1rem;
  padding-bottom: 1rem;
}

.renderer-settings-label {
  font-size: 1rem;
  text-align: left !important;
  font-weight: 600;
}

.lifespan-slider-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.lifespan-label {
  width: 50px;
  text-align: center;
}

.color-map-switcher {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.color-map-legend {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: bold;
}

.pixel-color-container {
  display: grid;
  grid-template-columns: repeat(7, 25px);
  gap: 5px;
}

.pixel-color-item {
  height: 25px;
  outline: 2px solid black;
}

</style>