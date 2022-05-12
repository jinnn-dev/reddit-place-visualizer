<script setup lang="ts">

import {nextTick, onMounted, ref, unref} from "vue";
import type {UserRank} from "@/model/userRank";
import {useService} from "@/composables/useService";
import {UserService} from "@/services/userService";
import Spinner from "@/components/Spinner.vue";
import LoadingButton from "@/components/LoadingButton.vue";

const IMAGE_API_URL = import.meta.env.VITE_IMAGE_API_URL;

const from = ref(0);
const to = ref(10);

const scrollContainer = ref();

const userRanking = ref<UserRank[]>([]);

const {loading, result, err, run} = useService(UserService.getUserRanking)

const fetchNextChunk = async () => {
  from.value = to.value + 1
  to.value += 10;
  await run(from.value, to.value);
  userRanking.value.push(...result.value!)
  await nextTick(() => {
    scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
  })
}

const fetchUserRanking = async () => {
  await run(from.value, to.value);
  userRanking.value = result.value!;
}

onMounted(async () => {
  await fetchUserRanking()
})

</script>
<template>
  <div v-if="!loading" class="user-ranking" ref="scrollContainer">
    <div v-for="(item, index) in userRanking" class="user-ranking-item">
      <div>{{index}}</div>
      <div class="user-ranking-">
        <div class="user-ranking-item-id">{{item.userId}}</div>
        <div>Amount: {{item.amount}}</div>
      </div>
    </div>
    <LoadingButton text="Load more" :loading="loading" @click="fetchNextChunk"></LoadingButton>
  </div>

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
}

.user-ranking-item-id {
  word-break: break-all;
  font-size: 0.8rem;
}
</style>