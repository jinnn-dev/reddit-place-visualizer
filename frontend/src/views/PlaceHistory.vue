<script setup lang='ts'>
import PlaceRender from '@/components/PlaceRenderer.vue';
import ResizableContainer from '@/components/ResizableContainer.vue';
import ChunksLoading from '@/components/ChunksLoadingIndicator.vue';
import { rendererState } from '@/renderer/rendererState';
import { NUMBER_OF_CHUNKS } from '@/lib/chunkLoader';
</script>
<template>
  <PlaceRender></PlaceRender>
  <div class='right-container'>
    <ResizableContainer>
      <div id='color-diagram' style='width: 100%; height: 100%'></div>
    </ResizableContainer>
    <ResizableContainer class='bottom-diagram' :topOffset='320'>
      <div id='activity' style='width: 100%; height: 100%'></div>
    </ResizableContainer>
    <ChunksLoading v-if='rendererState.loadedChunks < NUMBER_OF_CHUNKS'></ChunksLoading>
  </div>
</template>
<style>

</style>