<script setup lang='ts'>

import { onMounted, ref } from 'vue';

const resizable = ref();
const resizeContainer = ref();
const resizeHandle = ref();

const isMaximized = ref(false);
const isVisible = ref(true);

const props = defineProps({
  topOffset: {
    type: Number,
    default: 10,
  },
})

const defaultWidth = 300;
const defaultHeight = 300;

let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;

onMounted(() => {
  if (resizeHandle.value === null) {
    return;
  }
  resizeHandle.value.addEventListener('mousedown', initDrag, false);
  console.log(props.topOffset);
  resizable.value.style.top = props.topOffset + 'px';
});

const initDrag = (event: MouseEvent) => {
  startX = event.clientX;
  startY = event.clientY;
  startWidth = parseInt(document.defaultView!.getComputedStyle(resizeContainer.value).width, 10);
  startHeight = parseInt(document.defaultView!.getComputedStyle(resizeContainer.value).height, 10);

  document.documentElement.addEventListener('mousemove', doDrag, false);
  document.documentElement.addEventListener('mouseup', stopDrag, false);
};

const doDrag = (event: MouseEvent) => {
  if (resizeContainer.value === null) {
    return;
  }
  let newWidth = (startWidth - event.clientX + startX);
  let newHeight = (startHeight + event.clientY - startY);

  if (newWidth <= defaultWidth) {
    newWidth = defaultWidth;
  }

  if (newHeight <= defaultHeight) {
    newHeight = defaultHeight;
  }

  if (newWidth >= window.innerWidth) {
    newWidth = window.innerWidth;
  }

  if (newHeight >= window.innerHeight) {
    newHeight = window.innerHeight;
  }

  resizeContainer.value.style.width = newWidth + 'px';
  resizeContainer.value.style.height = newHeight + 'px';
};

const stopDrag = (event: MouseEvent) => {
  if (resizeContainer.value === null) {
    return;
  }

  document.documentElement.removeEventListener('mousemove', doDrag, false);
  document.documentElement.removeEventListener('mouseup', doDrag, false);

};

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
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' fill='currentColor' viewBox='0 0 256 256' v-if='isVisible'>
          <rect width='256' height='256' fill='none'></rect>
          <polyline points='96 48 176 128 96 208' fill='none' stroke='currentColor' stroke-linecap='round'
                    stroke-linejoin='round' stroke-width='20'></polyline>
        </svg>
        <svg xmlns='http://www.w3.org/2000/svg' width='100%' fill='currentColor' viewBox='0 0 256 256' v-else>
          <polyline points='160 208 80 128 160 48' fill='none' stroke='currentColor' stroke-linecap='round'
                    stroke-linejoin='round' stroke-width='20'></polyline>
        </svg>
      </div>

    </div>
    <div ref='resizeContainer' class='resizable-container'>

      <div class='resize-toolbar'>
        <div @click='toggleMaximize' class='pointer'>
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 256 256' height='100%'
               v-if='!isMaximized'>
            <polyline points='168 48 208 48 208 88' fill='none' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line x1='152' y1='104' x2='208' y2='48' fill='none' stroke='currentColor' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></line>
            <polyline points='88 208 48 208 48 168' fill='none' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line x1='104' y1='152' x2='48' y2='208' fill='none' stroke='currentColor' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></line>
            <polyline points='208 168 208 208 168 208' fill='none' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line x1='152' y1='152' x2='208' y2='208' fill='none' stroke='currentColor' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></line>
            <polyline points='48 88 48 48 88 48' fill='none' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round'
                      stroke-width='16'></polyline>
            <line x1='104' y1='104' x2='48' y2='48' fill='none' stroke='currentColor' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></line>
          </svg>
          <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 256 256' height='100%' v-else>
            <polyline points='192 104 152 104 152 64' fill='none' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line x1='208' y1='48' x2='152' y2='104' fill='none' stroke='currentColor' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></line>
            <polyline points='64 152 104 152 104 192' fill='none' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line x1='48' y1='208' x2='104' y2='152' fill='none' stroke='currentColor' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></line>
            <polyline points='152 192 152 152 192 152' fill='none' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line x1='208' y1='208' x2='152' y2='152' fill='none' stroke='currentColor' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></line>
            <polyline points='104 64 104 104 64 104' fill='none' stroke='currentColor' stroke-linecap='round'
                      stroke-linejoin='round' stroke-width='16'></polyline>
            <line x1='48' y1='48' x2='104' y2='104' fill='none' stroke='currentColor' stroke-linecap='round'
                  stroke-linejoin='round' stroke-width='16'></line>
          </svg>
        </div>
      </div>
      <div ref='resizeHandle' class='resizer-handle' v-show="false"></div>
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
  transition: 0.3s transform ease-in-out;
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
  z-index: 999;
  background-color: rgba(50, 50, 50, 0.5);
  backdrop-filter: blur(12px);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
}

.resizer-handle {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 10px;
  height: 10px;
  cursor: sw-resize;
  z-index: 999;
  background-color: white;
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