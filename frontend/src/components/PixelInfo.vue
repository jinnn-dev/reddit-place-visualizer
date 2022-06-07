<script lang='ts' setup>
import {mousePosition} from "@/store/mouse"
import { pixelColors } from '@/model/colorMapping';

import {computed, ref, watch} from "vue"

const sortedPixelData = computed(() => 
    Object.entries(mousePosition.data).sort((a: any, b: any) => b[1] - a[1])
)

const xy = computed(() => {
      return { 
        transform: `translateX(${ mousePosition.x }px) translateY(${ mousePosition.y }px)`,
      };
    })

</script>

<template>
  <div class="container" :style="xy" v-if="mousePosition.visible">
  <div class="close-info" @click="mousePosition.visible = false"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="200" y1="56" x2="56" y2="200" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line><line x1="200" y1="200" x2="56" y2="56" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg> </div>
  <div class="pixel-info">x:{{mousePosition.canvasX}} y:{{mousePosition.canvasY}}</div>

    <div v-for="(item, ind) in sortedPixelData" :key ="ind">
     
      <div v-if="item[0] == 'changes'" class="change-title">
        Changes: {{item[1]}}
      </div>

       <div v-else class="pixelColor" >
         <div class="pixel-color-amount">{{item[1]}}x</div>
           <div class='pixel-color'
                   :style='`background-color: rgb(${pixelColors[parseInt(item[0])][0]}, ${pixelColors[parseInt(item[0])][1]}, ${pixelColors[parseInt(item[0])][2]})`' />
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