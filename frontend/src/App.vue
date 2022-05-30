<script setup lang='ts'>

import Navigation from '@/components/Navigation.vue';
</script>

<template>
  <Navigation></Navigation>
  <router-view>

  </router-view>
</template>

<style>

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@100;200;300;400;500;600;700;800&display=swap');

* {
  font-family: 'Sora', sans-serif;
}

body {
  margin: 0;
  overflow: hidden;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

::-webkit-scrollbar-button {
  width: 1px;
  height: 1px;
}

::-webkit-scrollbar-thumb {
  background: #b3b3b3;
  border: 0px none #ffffff;
  border-radius: 100px;
}

::-webkit-scrollbar-thumb:hover {
  background: #878787;
}

::-webkit-scrollbar-thumb:active {
  background: #6b6b6b;
}

::-webkit-scrollbar-track {
  background: #666666;
  border: 16px none #ffffff;
  border-radius: 100px;
}

::-webkit-scrollbar-track:hover {
  background: #666666;
}

::-webkit-scrollbar-track:active {
  background: #333333;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

</style>
