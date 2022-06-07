<script setup lang='ts'>
import PlaceRender from '@/components/PlaceRenderer.vue';
import ResizableContainer from '@/components/ResizableContainer.vue';

</script>
<template>
  <PlaceRender></PlaceRender>
  <div class='right-container'>
    <ResizableContainer>
      <div id='color-diagram' style='width: 100%; height: 100%'></div>
    </ResizableContainer>
    <ResizableContainer class='bottom-diagram' :topOffset="320">
      <div id='activity' style='width: 100%; height: 100%'></div>
    </ResizableContainer>

  </div>
</template>
<style>

</style>