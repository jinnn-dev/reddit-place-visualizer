<script lang='ts' setup>
import { mousePosition } from '@/store/mouse';
import { pixelColors } from '@/model/colorMapping';

import { computed } from 'vue';

const sortedPixelData = computed(() =>
  Object.entries(mousePosition.data).sort((a: any, b: any) => b[1] - a[1])
);

const xy = computed(() => {
  return {
    transform: `translateX(${mousePosition.x}px) translateY(${mousePosition.y}px)`
  };
});

</script>

<template>
  <div v-if='mousePosition.visible' :style='xy' class='container'>
    <div class='close-info' @click='mousePosition.visible = false'>
      <svg fill='white' height='20' viewBox='0 0 256 256' width='20' xmlns='http://www.w3.org/2000/svg'>
        <rect fill='none' height='256' width='256'></rect>
        <line stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='200' x2='56' y1='56'
              y2='200'></line>
        <line stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='200' x2='56' y1='200'
              y2='56'></line>
      </svg>
    </div>
    <div class='pixel-info'>x:{{ mousePosition.canvasX }} y:{{ mousePosition.canvasY }}</div>

    <div v-for='(item, ind) in sortedPixelData' :key='ind'>

      <div v-if="item[0] == 'changes'" class='change-title'>
        Changes: {{ item[1] }}
      </div>

      <div v-else class='pixelColor'>
        <div class='pixel-color-amount'>{{ item[1] }}x</div>
        <div :style='`background-color: rgb(${pixelColors[parseInt(item[0])][0]}, ${pixelColors[parseInt(item[0])][1]}, ${pixelColors[parseInt(item[0])][2]})`'
             class='pixel-color' />
      </div>

    </div>
  </div>
</template>


<style>
.container {
  width: 200px;
  background-color: rgba(50, 50, 50, 0.5);
  backdrop-filter: blur(12px);
  padding: 1rem;
  color: white;
  z-index: 999;
  position: absolute;
  border-radius: 10px;
}

.pixel-info {
  display: flex;
  justify-content: center;
  padding-bottom: 1rem;
}

.pixelColor {
  display: flex;
}

.pixel-color {
  height: 25px;
  outline: 2px solid black;
  width: 100%;
}

.pixel-color-amount {
  width: 40px;
}

.change-title {
  margin-bottom: 1rem;
}

.close-info {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}
</style>