<script setup lang='ts'>
import { onMounted, ref, watch } from 'vue';
import { UserRenderer } from '@/renderer/userRenderer';
import { selectedUsers, userPixels, userRenderer } from '@/renderer/rendererState';
import { pixelColors } from '@/model/colorMapping';
import chroma from 'chroma-js';
import { useRoute } from 'vue-router';

const userRendererCanvas = ref();

type Lines = { x: [number, number], y: [number, number] }[]
type Points = [number, number][]

const route = useRoute();


onMounted(() => {
  if (!userRenderer.value) {
    userRenderer.value = new UserRenderer(userRendererCanvas.value);
    const ctx = userRendererCanvas.value.getContext('2d');
    renderUserPixels(ctx, selectedUsers);
  }
});

watch(() => route.fullPath, () => {
  if (route.fullPath !== '/user') {
    userRenderer.value?.stop();
  } else {
    userRenderer.value?.restart();
    const ctx = userRendererCanvas.value.getContext('2d');
    renderUserPixels(ctx, selectedUsers);
  }
});

watch(() => selectedUsers, () => {
  const ctx = userRendererCanvas.value.getContext('2d');
  renderUserPixels(ctx, selectedUsers);
}, { deep: true });


function renderUserPixels(ctx: CanvasRenderingContext2D, selectedUsers: Set<string>) {

  const imgData = ctx.getImageData(0, 0, 2000, 2000);
  imgData.data.fill(0);

  const users = new Map<string, { lines: Lines, points: Points }>();

  let lines: Lines = [];
  let points: Points = [];

  selectedUsers.forEach((user) => {
    const userData = userPixels.get(user)!;
    for (let i = 0; i < userData.length; i++) {
      const c = userData[i][2];
      const position = userData[i][1] * 4 + userData[i][0] * 4 * 2000;


      if (userData[i + 1]) {
        lines.push({ x: [userData[i][1], userData[i][0]], y: [userData[i + 1][1], userData[i + 1][0]] });
      } else if (i == 0) {
        points.push([userData[i][1], userData[i][0]]);
      }

      const color = pixelColors[c];
      imgData.data[position] = color[0];
      imgData.data[position + 1] = color[1];
      imgData.data[position + 2] = color[2];
      imgData.data[position + 3] = 255;
    }

    users.set(user, { lines, points });
    lines = [];
    points = [];
  });

  ctx.putImageData(imgData, 0, 0);


  users.forEach(({ lines, points }) => {
    const c = chroma.scale('Spectral').domain([0, Math.max(1, lines.length)]);

    lines.forEach(({ x, y }, ind) => {
      if (ind == 0) {
        ctx.fillStyle = c(ind).hex();
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(x[0], x[1], 10, 10, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
      }
      drawLineWithArrow(ctx, x, y, c(ind).hex());

      if (ind == lines.length - 1) {
        ctx.fillStyle = c(ind).hex();
        ctx.strokeStyle = 'black';
        ctx.beginPath();
        ctx.ellipse(y[0], y[1], 10, 10, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
      }
    });

    points.forEach(([x, y], ind) => {
      ctx.fillStyle = c(ind).hex();
      ctx.strokeStyle = 'black';
      ctx.beginPath();
      ctx.ellipse(x, y, 10, 10, Math.PI / 4, 0, 2 * Math.PI);
      ctx.fill();
    });
  });

}

function drawLineWithArrow(ctx: CanvasRenderingContext2D, begin: [number, number], end: [number, number], stroke = 'red', width = 2) {
  ctx.strokeStyle = stroke;
  ;
  ctx.lineWidth = width;
  ctx.beginPath();

  const headlen = 10;
  const dx = end[0] - begin[0];
  const dy = end[1] - begin[1];
  var angle = Math.atan2(dy, dx);
  ctx.moveTo(...begin);
  ctx.lineTo(...end);
  ctx.lineTo(end[0] - headlen * Math.cos(angle - Math.PI / 6), end[1] - headlen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(...end);
  ctx.lineTo(end[0] - headlen * Math.cos(angle + Math.PI / 6), end[1] - headlen * Math.sin(angle + Math.PI / 6));
  ctx.stroke();

}


</script>
<template>
  <div ref='userRendererContainer' class='viewer-container'>
    <canvas ref='userRendererCanvas' class='canvas user-canvas' width='2000' height='2000'></canvas>
  </div>
</template>

<style>
.user-canvas {
  background-color: black;
  border: 2px solid white;
}
</style>