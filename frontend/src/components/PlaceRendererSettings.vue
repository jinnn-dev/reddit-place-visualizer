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

const emit = defineEmits(['changeRenderMode', 'lifespanChanged']);

const lifespan = ref(props.defaultLifespan || 0);

const lifespanChanged = () => {
  emit('lifespanChanged', lifespan.value);
};

</script>
<template>
  <div class='place-renderer-settings-container'>
    <button @click="$emit('changeRenderMode')">Change render mode</button>

    <div class='lifespan-container'>
      <label class='renderer-settings-label' for='lifespanSlider'>Pixel lifespan</label>
      <div class='lifespan-slider-container'>
        <input id='lifespanSlider' type='range' :min='minLifespan' :max='maxLifespan' v-model='lifespan'
               @change='lifespanChanged'>
        <span class='lifespan-label'>{{ lifespan }}</span>
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
  background-color: rgba(255, 255, 255, 0.5);
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
</style>