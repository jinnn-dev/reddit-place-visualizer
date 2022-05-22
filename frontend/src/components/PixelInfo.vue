<script lang='ts' setup>
import {mousePosition} from "@/store/mouse"
import { pixelColors } from '@/model/colorMapping';

import {computed} from "vue"

const sortedPixelData = computed(() => 
    Object.entries(mousePosition.data).sort((a: any, b: any) => b[1] - a[1])
)

const xy = computed(() => {
      return { 
        transform: `translateX(${ mousePosition.x }px) translateY(${ mousePosition.y }px)`,
      };
    })

const y = computed(() => {
      return `transform: translateY(${ mousePosition.y }px);`;

})
</script>

<template>
  <div class="container" :style="xy" v-if="mousePosition.visible">
  <div class="pixel-info">x:{{mousePosition.canvasX}} y:{{mousePosition.canvasY}}</div>

    <div v-for="(item, key) in sortedPixelData">
      <div class="pixelColor" v-if="item[0] != 'changes'">
         <div class="pixel-color-amount">{{item[1]}}x</div>
           <div class='pixel-color'
                   :style='`background-color: rgb(${pixelColors[key][0]}, ${pixelColors[key][1]}, ${pixelColors[key][2]})`' />
      </div>
      <div v-else>
        Changes: {{item[1]}}
      </div>
    
    </div>
  </div>
</template>


<style>
.container {
  width: 200px;
  background-color: #202020;
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
</style>