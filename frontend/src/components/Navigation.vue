<script setup lang='ts'>
import PixelInfo from './renderer/place/PixelInfo.vue';</script>
<template>
  <div class='navigation-header'>
    <div class='navigation-item'>
      <router-link class='router-link' to='/'>History</router-link>
    </div>
    <div class='navigation-item'>
      <router-link class='router-link' tag='div' to='/user'>User</router-link>
    </div>
  </div>
  <PixelInfo></PixelInfo>
</template>

<style>
.navigation-header {
  position: fixed;
  top: 20px;
  left: 50%;
  z-index: 999;
  transform: translateX(-50%);
  display: flex;
  gap: 50px;
  color: white;
}

.navigation-item {
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  padding: 10px;
  border-radius: 10px;
  font-style: italic;
}

.router-link {
  text-decoration: none;
  color: white;
}
</style>