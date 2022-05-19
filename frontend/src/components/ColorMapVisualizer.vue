<script setup lang='ts'>

import type { PropType } from 'vue';

defineProps({
  colorMap: Array as PropType<Array<number[]>>,
  isActive: Boolean
});
</script>
<template>
  <div class='color-map-visualizer-container' :class='isActive && "color-map-visualizer-item-selected"'>
    <div class='color-map-visualizer-item' v-for='element in colorMap'
         :style='`background-color: rgb(${element[0]}, ${element[1]}, ${element[2]})`'></div>
  </div>
</template>
<style>
.color-map-visualizer-container {
  display: flex;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
}

.color-map-visualizer-item {
  width: 100%;
  height: 35px;
}

.color-map-visualizer-item-selected {
  outline: 3px solid black;
  outline-offset: 2px;
}
</style>