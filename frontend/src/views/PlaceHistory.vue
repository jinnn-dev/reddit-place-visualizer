<script lang='ts' setup>
import PlaceRender from '@/components/renderer/place/PlaceRenderer.vue';
import ResizableContainer from '@/components/renderer/place/diagrams/ResizableContainer.vue';
import ChunksLoading from '@/components/renderer/place/ChunksLoadingIndicator.vue';
import { rendererState } from '@/renderer/rendererState';
import { NUMBER_OF_CHUNKS } from '@/lib/chunkLoader';</script>
<template>
  <PlaceRender></PlaceRender>
  <div class='right-container'>
    <ResizableContainer>
      <div id='color-diagram' style='width: 100%; height: 100%'></div>
    </ResizableContainer>
    <ResizableContainer :topOffset='320' class='bottom-diagram'>
      <div id='activity' style='width: 100%; height: 100%'></div>
    </ResizableContainer>
    <ChunksLoading v-if='rendererState.loadedChunks < NUMBER_OF_CHUNKS'></ChunksLoading>
  </div>
</template>
<style>

</style>