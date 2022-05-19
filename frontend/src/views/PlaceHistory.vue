<script setup lang="ts">
import PlaceRender from '@/components/PlaceRenderer.vue'
import {onMounted} from "vue"
import {HoverService} from "@/services/HoverService"

function getCursorPosition(canvas: HTMLCanvasElement, event: MouseEvent) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX
    const y = event.clientY

    const scaledX = Math.floor(scale(x, [rect.left, rect.right], [0, 2000]))
    const scaledY = Math.floor(scale(y, [rect.top, rect.bottom], [0, 2000]))
    return {x: scaledX, y: scaledY}
}

const scale = (inputY: number, yRange: Array<number>, xRange: Array<number>): number => {
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const percent = (inputY - yMin) / (yMax - yMin);
  const outputX = percent * (xMax - xMin) + xMin;

  return outputX;
};

onMounted(() => {
  const canvas = document.querySelector("canvas")
  // canvas?.addEventListener("mousemove", (e) => {
  //   getCursorPosition(canvas, e)
  // })

  canvas?.addEventListener("mousedown", async (e) => {
    try {
      const position = getCursorPosition(canvas, e)
      console.log(position);
      
      const data = await HoverService.getPixelData(position)
      console.log(data);
    } catch(err) {
      console.log(err);
      
    }
  })
})

</script>
<template>
  <PlaceRender></PlaceRender>
</template>

<style></style>