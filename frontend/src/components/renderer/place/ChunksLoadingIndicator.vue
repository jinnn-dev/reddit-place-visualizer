<script lang='ts' setup>
import { rendererState } from '@/renderer/rendererState';
import { NUMBER_OF_CHUNKS } from '@/lib/chunkLoader';
import MosaicLoader from '@/components/MosaicLoader.vue';</script>
<template>
  <div class='chunk-loading'>
    <MosaicLoader :size='4' class='chunk-mosaic'></MosaicLoader>
    <div class='chunk-loading-text'>{{ rendererState.loadedChunks }} / {{ NUMBER_OF_CHUNKS }} Chunks</div>
  </div>
</template>
<style>
.chunk-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  padding: 6px;
  gap: 8px;
  top: 20px;
  font-size: 0.8rem;
  left: 20px;
  color: white;
  background-color: rgba(50, 50, 50, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 10px;
}


.chunk-loading-text {
  text-align: center;
  width: 90px;
}
</style>