<script setup lang="ts">
import Viewer from './components/Viewer.vue'
import CanvasViewer from './components/CanvasViewer.vue'
// import { getDataBetweenTimestamps } from "./lib/redis"

// async function getData() {
//   const result = await getDataBetweenTimestamps(1649033612.299, 1649033612.353)
//   console.log(result)
// }

</script>

<template>
  <!--<div @click="getData"> DATA</div>-->
  <!--  <Viewer></Viewer>-->
  <CanvasViewer></CanvasViewer>
</template>

<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

body {
  margin: 0
}

</style>
