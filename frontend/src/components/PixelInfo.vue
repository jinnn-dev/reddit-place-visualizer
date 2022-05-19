<template>
  <div class="container" :style="xy" v-if="mousePosition.visible">
    {{mousePosition.data}}
  </div>
</template>
<script lang='ts' setup>
import {mousePosition} from "@/store/mouse"
import {computed} from "vue"

const xy = computed(() => {
      return {
        transform: `translateX(${ mousePosition.x }px) translateY(${ mousePosition.y }px)`,
      };
    })

const y = computed(() => {
      return `transform: translateY(${ mousePosition.y }px);`;

})
</script>

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
</style>