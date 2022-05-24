<script setup lang="ts">
import RandomUser from "@/components/RandomUser.vue";
import UserRanking from "@/components/UserRanking.vue";
import {ref} from "vue";
import UserHistoryRenderer from '@/components/UserHistoryRenderer.vue';

const isFirstOpen = ref(false)

</script>

<template>
  <div class="user-history-container">
    <div>
      <div class="user-history-header" @click="isFirstOpen = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#FFF" stroke="#FFF" viewBox="0 0 256 256">
          <path d="M32,72H55.1a64,64,0,0,1,52,26.8l41.8,58.4a64,64,0,0,0,52,26.8H232" fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
          <polyline points="208 48 232 72 208 96" fill="none" stroke="currentColor" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="16"></polyline>
          <polyline points="208 160 232 184 208 208" fill="none" stroke="currentColor" stroke-linecap="round"
                    stroke-linejoin="round" stroke-width="16"></polyline>
          <path d="M147.7,100.5l1.2-1.7a64,64,0,0,1,52-26.8H232" fill="none" stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round" stroke-width="16"></path>
          <path d="M32,184H55.1a64,64,0,0,0,52-26.8l1.2-1.7" fill="none" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="16"></path>
        </svg>

        <span>Random User</span>
      </div>
      <div v-if="isFirstOpen" class="user-history-item">
        <RandomUser></RandomUser>
      </div>
    </div>

    <div>
      <div class="user-history-header" @click="isFirstOpen = false">
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#000000" viewBox="0 0 256 256">
          <path d="M56,56v55.1c0,39.7,31.8,72.6,71.5,72.9A72,72,0,0,0,200,112V56a8,8,0,0,0-8-8H64A8,8,0,0,0,56,56Z"
                fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="16"></path>
          <line x1="96" y1="224" x2="160" y2="224" fill="none" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="16"></line>
          <line x1="128" y1="184" x2="128" y2="224" fill="none" stroke="currentColor" stroke-linecap="round"
                stroke-linejoin="round" stroke-width="16"></line>
          <path d="M198.2,128H208a32,32,0,0,0,32-32V80a8,8,0,0,0-8-8H200" fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
          <path d="M58,128H47.9a32,32,0,0,1-32-32V80a8,8,0,0,1,8-8h32" fill="none" stroke="currentColor"
                stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></path>
        </svg>
        <span>User Ranking</span>
      </div>
      <div v-if="!isFirstOpen" class="user-history-item">
        <UserRanking></UserRanking>
      </div>
    </div>

  </div>

  <UserHistoryRenderer></UserHistoryRenderer>
</template>
<style>
.user-history-container {
  position: fixed;
  left: 0;
  top: 50%;
  z-index: 999;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  color: white;
  width: 350px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  padding: 8px;
  gap: 12px;
}

.user-history-header {
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 10px;
  height: 40px;
  background-color: rgba(100, 100, 100, 0.5);
  backdrop-filter: blur(10px);
  cursor: pointer;
  margin-top: 5px;
  margin-bottom: 5px;
}

.user-history-item {
  padding: 8px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>