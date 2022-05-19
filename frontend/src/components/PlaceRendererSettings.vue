<script setup lang='ts'>

import { ref } from 'vue';

const props = defineProps({
  maxLifespan: {
    type: Number,
    default: 0
  },
  minLifespan: Number,
  defaultLifespan: Number
});

const emit = defineEmits(['changeRenderMode', 'lifespanChanged', 'colorMapChanged']);

const lifespan = ref(props.defaultLifespan || 0);

const lifespanChanged = () => {
  emit('lifespanChanged', lifespan.value);
};

const colorMapChanged  = (value: number) => {
  emit('colorMapChanged', value)
}

</script>
<template>
  <div class='place-renderer-settings-container'>
    <button @click="$emit('changeRenderMode')">Change render mode</button>

    <div class='lifespan-container'>
      <label class='renderer-settings-label' for='lifespanSlider'>Pixel lifespan</label>
      <div class='lifespan-slider-container'>
        <input id='lifespanSlider' type='range' :min='minLifespan' :max='maxLifespan' v-model='lifespan'
               @input='lifespanChanged'>
        <span class='lifespan-label'>{{ lifespan }}</span>
      </div>
    </div>
    <div class='color-map-switcher'>
      <button @click="$emit('colorMapChanged', 0)">Rainbow Colormap</button>
      <button @click="$emit('colorMapChanged', 1)">RGB Colormap</button>
      <button @click="$emit('colorMapChanged', 2)">Another Colormap</button>
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
  color: white;
  background-color: rgba(255, 255, 255, 0.5);
  background-color: #202020;
  backdrop-filter: blur(10px);
  padding: 10px;
  border-bottom-right-radius: 10px;
  border-top-right-radius: 10px;
}

.lifespan-container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.renderer-settings-label {
  font-size: 1.1rem;
}

.lifespan-slider-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.lifespan-label {
  width: 50px;
  text-align: center;
}

.color-map-switcher {
  display: flex;
  flex-direction: column;
}
</style>