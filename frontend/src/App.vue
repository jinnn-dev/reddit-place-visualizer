<script setup lang="ts">
import {ref } from "vue"
import Viewer from './components/Viewer.vue'
import { getDataBetweenTimestamps } from "./lib/redis"


const res = ref()

async function getData() {
  const result = await getDataBetweenTimestamps()

  res.value = result
}

</script>

<template>
{{res}}
<button @click="getData()">LOAD DATA</button>
  <Viewer></Viewer>
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
