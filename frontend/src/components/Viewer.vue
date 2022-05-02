<script setup lang="ts">
import { Renderer } from '../renderer/renderer';
import { Cube } from '../renderer/model/cube';
import { PixelMap } from '../renderer/model/pixelMap';

const renderer = new Renderer(document.body);
renderer.handleResize();
renderer.animate();

const cube = new Cube(1, 1, 0x00ff00);
renderer.addElement(cube);

const pixelMap = new PixelMap(1);
pixelMap.generate();

renderer.addElements(pixelMap.elements);
</script>
<template></template>
