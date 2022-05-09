<script setup lang="ts">
import {CanvasRenderer} from "@/renderer/2d/canvasRenderer";
import {onMounted, ref} from "vue";

const canvasElement = ref();
const canvasContainer = ref();
onMounted(() => {
  const renderer = new CanvasRenderer(canvasElement.value)
  // canvasContainer.value.addEventListener('mousewheel', (event: WheelEvent) => {
  //   renderer.zoom(event.deltaY * -0.0005)
  // }, false)
  //
  // let lastX = canvasElement.value.width / 2
  // let lastY = canvasElement.value.height / 2;
  //
  // let isMouseDown = false
  // let dragStartX: number
  // let dragStartY: number
  //
  // canvasContainer.value.addEventListener('mousedown', (event: MouseEvent) => {
  //   lastX = event.offsetX || (event.pageX - renderer.canvas.offsetLeft);
  //   lastY = event.offsetY || (event.pageY - renderer.canvas.offsetTop);
  //   dragStartX = lastX
  //   dragStartY = lastY
  //   isMouseDown = true
  // })
  //
  // canvasContainer.value.addEventListener('mousemove', (event: MouseEvent) => {
  //     if (isMouseDown) {
  //       lastX = event.offsetX || (event.pageX - renderer.canvas.offsetLeft);
  //       lastY = event.offsetY || (event.pageY - renderer.canvas.offsetTop);
  //       const diffX = dragStartX - lastX;
  //       const diffY = dragStartY - lastY;
  //       renderer.transform(-diffX, -diffY)
  //     }
  // })
  //
  // canvasContainer.value.addEventListener('mouseup', (event: MouseEvent) => {
  //   if (isMouseDown) {
  //     isMouseDown = false;
  //   }
  // })
})

</script>
<template>
  <div ref="canvasContainer" class="viewer-container">
    <canvas ref="canvasElement" class="canvas" width="2000" height="2000" ></canvas>
  </div>
</template>

<style>
.viewer-container {
  position: absolute;
  overflow: hidden;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.canvas {
  image-rendering: pixelated;
}
</style>