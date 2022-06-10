<script lang='ts' setup>

import { onMounted, ref } from 'vue';

const resizable = ref();
const resizeContainer = ref();
const resizeHandle = ref();

const isMaximized = ref(false);
const isVisible = ref(true);

const props = defineProps({
  topOffset: {
    type: Number,
    default: 10
  }
});

const defaultWidth = 300;
const defaultHeight = 300;

onMounted(() => {
  if (resizeHandle.value === null) {
    return;
  }
  resizable.value.style.top = props.topOffset + 'px';
});

const toggleMaximize = () => {
  if (isMaximized.value) {
    resizeContainer.value.style.width = defaultWidth + 'px';
    resizeContainer.value.style.height = defaultHeight + 'px';
    resizable.value.style.top = props.topOffset + 'px';
    resizable.value.style.zIndex = 999;


  } else {
    resizeContainer.value.style.width = window.innerWidth + 'px';
    resizeContainer.value.style.height = window.innerHeight + 'px';
    resizable.value.style.top = 0 + 'px';
    resizable.value.style.zIndex = 1000;


  }
  isMaximized.value = !isMaximized.value;
};

const toggleSlideOut = () => {
  if (isVisible.value) {
    resizable.value.style.transform = 'translateX(100%)';
  } else {
    resizable.value.style.transform = 'translateX(0%)';
  }
  isVisible.value = !isVisible.value;
};

</script>
<template>
  <div ref='resizable' class='resizable'>
    <div class='slide-in-out-container'>
      <div class='pointer' @click='toggleSlideOut'>
        <svg v-if='isVisible' fill='currentColor' viewBox='0 0 256 256' width='100%' xmlns='http://www.w3.org/2000/svg'>
          <rect fill='none' height='256' width='256'></rect>
          <polyline fill='none' points='96 48 176 128 96 208' stroke='currentColor' stroke-linecap='round'
                    stroke-linejoin='round' stroke-width='20'></polyline>
        </svg>
        <svg v-else fill='currentColor' viewBox='0 0 256 256' width='100%' xmlns='http://www.w3.org/2000/svg'>
          <polyline fill='none' points='160 208 80 128 160 48' stroke='currentColor' stroke-linecap='round'
                    stroke-linejoin='round' stroke-width='20'></polyline>
        </svg>
      </div>

    </div>
    <div ref='resizeContainer' class='resizable-container'>

      <div class='resize-toolbar'>
        <div class='pointer' @click='toggleMaximize'>
          <svg v-if='!isMaximized' fill='currentColor' height='100%' viewBox='0 0 256 256'
               xmlns='http://www.w3.org/2000/svg'>
            <polyline fill='none' points='168 48 208 48 208 88' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='152' x2='208'
                  y1='104' y2='48'></line>
            <polyline fill='none' points='88 208 48 208 48 168' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='104' x2='48'
                  y1='152' y2='208'></line>
            <polyline fill='none' points='208 168 208 208 168 208' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='152' x2='208'
                  y1='152' y2='208'></line>
            <polyline fill='none' points='48 88 48 48 88 48' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='16'></polyline>
            <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='104' x2='48'
                  y1='104' y2='48'></line>
          </svg>
          <svg v-else fill='currentColor' height='100%' viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'>
            <polyline fill='none' points='192 104 152 104 152 64' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='208' x2='152'
                  y1='48' y2='104'></line>
            <polyline fill='none' points='64 152 104 152 104 192' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='48' x2='104'
                  y1='208' y2='152'></line>
            <polyline fill='none' points='152 192 152 152 192 152' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='208' x2='152'
                  y1='208' y2='152'></line>
            <polyline fill='none' points='104 64 104 104 64 104' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16' x1='48' x2='104'
                  y1='48' y2='104'></line>
          </svg>
        </div>
      </div>

      <div class='content'>
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<style>
.resizable {
  position: absolute;
  z-index: 999;
  right: 0;
  transition: 0.3s transform cubic-bezier(0.25, 1, 0.5, 1);
}

.resizable-container {
  width: 300px;
  height: 300px;
  background-color: rgba(50, 50, 50, 0.5);
  backdrop-filter: blur(12px);
  border-radius: 10px;
}

.slide-in-out-container {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: -30px;
  width: 30px;
  height: 50px;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(50, 50, 50, 0.5);
  backdrop-filter: blur(12px);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}


.resize-toolbar {
  position: absolute;
  right: 0;
  top: 0;
  height: 20px;
  display: flex;
  justify-content: end;
  padding: 10px 10px 0 10px;
  gap: 10px;
  z-index: 999;
}

.content {
  width: 100%;
  height: 100%;
}

.pointer {
  cursor: pointer;
  color: white;
}
</style>