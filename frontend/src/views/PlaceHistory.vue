<script setup lang="ts">
import CanvasViewer from '@/components/CanvasViewer.vue'
import Timeline from "@/components/Timeline.vue";

import {ref} from "vue";

const currentTime = ref(0);

const valueChanged = (value: string) => {
  currentTime.value = parseInt(value)
}
</script>
<template>
  <CanvasViewer :t="currentTime"></CanvasViewer>
  <Timeline @valueChanged="valueChanged"></Timeline>
</template>