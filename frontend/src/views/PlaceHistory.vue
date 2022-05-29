<script setup lang='ts'>
import PlaceRender from '@/components/PlaceRenderer.vue';
import ResizableContainer from '@/components/ResizableContainer.vue';

</script>
<template>
  <PlaceRender></PlaceRender>
  <ResizableContainer><div id='color-diagram' style='width: 100%; height: 100%'></div></ResizableContainer>
  <div id='activity' style='width: 1000px;height:700px;float:right;background-color: black;'></div>

</template>
