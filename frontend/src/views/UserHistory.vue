<script lang='ts' setup>
import RandomUser from '@/components/renderer/user/RandomUser.vue';
import UserRanking from '@/components/renderer/user/UserRanking.vue';
import { ref } from 'vue';
import UserHistoryRenderer from '@/components/renderer/user/UserHistoryRenderer.vue';

const isFirstOpen = ref(false);

</script>

<template>
  <div class='user-history-container'>
    <div>
      <div class='user-history-header' @click='isFirstOpen = true'>
        <svg fill='#FFF' height='25' stroke='#FFF' viewBox='0 0 256 256' width='25' xmlns='http://www.w3.org/2000/svg'>
          <path d='M32,72H55.1a64,64,0,0,1,52,26.8l41.8,58.4a64,64,0,0,0,52,26.8H232' fill='none' stroke='currentColor'
                stroke-linecap='round' stroke-linejoin='round' stroke-width='16'></path>
          <polyline fill='none' points='208 48 232 72 208 96' stroke='currentColor' stroke-linecap='round'
                    stroke-linejoin='round' stroke-width='16'></polyline>
          <polyline fill='none' points='208 160 232 184 208 208' stroke='currentColor' stroke-linecap='round'
                    stroke-linejoin='round' stroke-width='16'></polyline>
          <path d='M147.7,100.5l1.2-1.7a64,64,0,0,1,52-26.8H232' fill='none' stroke='currentColor'
                stroke-linecap='round'
                stroke-linejoin='round' stroke-width='16'></path>
          <path d='M32,184H55.1a64,64,0,0,0,52-26.8l1.2-1.7' fill='none' stroke='currentColor' stroke-linecap='round'
                stroke-linejoin='round' stroke-width='16'></path>
        </svg>

        <span>Random User</span>
      </div>
      <div v-if='isFirstOpen' class='user-history-item'>
        <RandomUser></RandomUser>
      </div>
    </div>

    <div>
      <div class='user-history-header' @click='isFirstOpen = false'>
        <svg fill='#000000' height='25' viewBox='0 0 256 256' width='25' xmlns='http://www.w3.org/2000/svg'>
          <path d='M56,56v55.1c0,39.7,31.8,72.6,71.5,72.9A72,72,0,0,0,200,112V56a8,8,0,0,0-8-8H64A8,8,0,0,0,56,56Z'
                fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round'
                stroke-width='16'></path>
          <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16'
                x1='96' x2='160'
                y1='224' y2='224'></line>
          <line fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='16'
                x1='128' x2='128'
                y1='184' y2='224'></line>
          <path d='M198.2,128H208a32,32,0,0,0,32-32V80a8,8,0,0,0-8-8H200' fill='none' stroke='currentColor'
                stroke-linecap='round' stroke-linejoin='round' stroke-width='16'></path>
          <path d='M58,128H47.9a32,32,0,0,1-32-32V80a8,8,0,0,1,8-8h32' fill='none' stroke='currentColor'
                stroke-linecap='round' stroke-linejoin='round' stroke-width='16'></path>
        </svg>
        <span>User Ranking</span>
      </div>
      <div v-if='!isFirstOpen' class='user-history-item'>
        <UserRanking></UserRanking>
      </div>
      <div class='color-scale-info'>
        <span>Time</span>
        <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' viewBox='0 0 256 256'>
          <rect width='256' height='256' fill='none'></rect>
          <line x1='40' y1='128' x2='216' y2='128' fill='none' stroke='currentColor' stroke-linecap='round'
                stroke-linejoin='round' stroke-width='16'></line>
          <polyline points='144 56 216 128 144 200' fill='none' stroke='currentColor' stroke-linecap='round'
                    stroke-linejoin='round' stroke-width='16'></polyline>
        </svg>
      </div>
      <div class='color-scale'>
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
  width: 360px;
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

.color-scale {
  border-radius: 5px;
  height: 25px;
  background: #fff;
  background: linear-gradient(to right, #9e0142, #a00342, #b71d48, #dd4b4c, #f26944, #f7844e, #fba05a, #fedd89, #f9fcb5, #c9e99e, #a1d9a4, #63bea7, #515faa, #5d50a2);
  width: 100%;
}

.color-scale-info {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  text-align: left;
  margin-top: 20px;
  font-weight: bold;
  font-size: 0.8rem;
}
</style>