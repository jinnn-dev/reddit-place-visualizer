<script setup lang='ts'>
import PlaceRender from '@/components/PlaceRenderer.vue';
import ResizableContainer from '@/components/ResizableContainer.vue';

</script>
<template>
  <PlaceRender></PlaceRender>
  <ResizableContainer>
    <div id='color-diagram' style='width: 100%; height: 100%'></div>
  </ResizableContainer>
  <ResizableContainer>
    <div id='activity' style='width: 100%; height: 100%'></div>
  </ResizableContainer>

</template>
