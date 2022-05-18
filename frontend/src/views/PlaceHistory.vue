<script setup lang="ts">
import CanvasViewer from '@/components/PlaceRenderer.vue'
import Timeline from "@/components/Timeline.vue";
</script>
<template>
  <CanvasViewer></CanvasViewer>
  <div class='timelines'>
    <Timeline id='rate'></Timeline>
    <Timeline id='time'></Timeline>
  </div>
</template>

<style>
.timelines {
  position: fixed;
  width: 100%;
  bottom: 50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 50px;
}
</style>