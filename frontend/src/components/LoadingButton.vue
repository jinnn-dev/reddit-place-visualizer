<script setup lang="ts">
import Spinner from '@/components/Spinner.vue';

defineProps({
  text: String,
  loading: Boolean
})
</script>
<template>
  <button class="loading-button">
    <Spinner v-if="loading"></Spinner>
    <div>{{text}}</div>
  </button>
</template>

<style>
.loading-button {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  height: 35px;
  background-color: #2c80b6;
  color: white;
  font-weight: bold;
  font-size: 1em;
  border: none;
}

.loading-button:hover {
  background-color: #1c6085;
}
</style>