<script setup lang='ts'>

import { nextTick, onMounted, ref, unref } from 'vue';
import type { UserRank } from '@/model/userRank';
import { useService } from '@/composables/useService';
import { UserService } from '@/services/userService';
import LoadingButton from '@/components/LoadingButton.vue';
import RankingItem from '@/components/RankingItem.vue';
import { selectedUsers, userPixels } from '@/renderer/rendererState';


const from = ref(0);
const to = ref(10);

const scrollContainer = ref();

const userRanking = ref<UserRank[]>([]);

const { loading, result, err, run } = useService(UserService.getUserRanking);

onMounted(async () => {
  await fetchUserRanking();
});

const fetchNextChunk = async () => {
  from.value = to.value + 1;
  to.value += 10;
  await run(from.value, to.value);
  userRanking.value.push(...result.value!);
  await nextTick(() => {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
  });
};

const fetchUserRanking = async () => {
  await run(from.value, to.value);
  userRanking.value = result.value!;
};

const toggleUserPixels = async (value: boolean, item: UserRank) => {
  if (value) {
    if (!userPixels.get(item.userId)) {
      const data = await UserService.getPixelsToUser(item.userId);
      const splitData = data.map(item => item.split(','));
      const parsedData = splitData.map(row => [parseInt(row[0]), parseInt(row[1]), parseInt(row[2]), parseInt(row[3])]);
      userPixels.set(item.userId, parsedData);
    }
    selectedUsers.add(item.userId);
  } else {
    selectedUsers.delete(item.userId);
  }
};


</script>
<template>
  <div v-if='!loading' class='user-ranking' ref='scrollContainer'>
    <div v-for='(item, index) in userRanking' class='user-ranking-item'>
      <RankingItem :index='index' :item='item' @togglePixels='toggleUserPixels'></RankingItem>
    </div>
    <LoadingButton text='Load more' :loading='loading' @click='fetchNextChunk'></LoadingButton>
  </div>
  <div class="color-scale">
  </div>
  <div class="color-scale-info">{{"ᐸ── time ──ᐳ"}}</div>

</template>

<style>

.user-ranking {
  max-height: 400px;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-ranking-item {
  display: flex;
  gap: 10px;
  border-radius: 10px;
  align-items: center;
  background-color: #2a2a2a;
  justify-content: space-between;
  padding: 10px;
}

.color-scale {
  margin-top: 30px;
  border-radius: 5px;
  height: 25px;
  background: #fff;
  background: linear-gradient(to right, #9e0142, #a00342,  #b71d48, #dd4b4c, #f26944, #f7844e, #fba05a, #fedd89, #f9fcb5, #c9e99e, #a1d9a4,#63bea7, #515faa,#5d50a2);
  width: 100%;
}

.color-scale-info {
  text-align: center;
  margin-top: 5px;
}

</style>