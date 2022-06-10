<script lang='ts' setup>

import type { PropType } from 'vue';

defineProps({
  colorMap: Array as PropType<Array<number[]>>,
  isActive: Boolean
});
</script>
<template>
  <div :class='isActive && "color-map-visualizer-item-selected"' class='color-map-visualizer-container'>
    <div v-for='element in colorMap' :style='`background-color: rgb(${element[0]}, ${element[1]}, ${element[2]})`'
         class='color-map-visualizer-item'></div>
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
  outline: 2px solid white;
  outline-offset: 2px;
}
</style>