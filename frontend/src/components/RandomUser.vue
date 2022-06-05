<script setup lang="ts">

import {onMounted, ref} from "vue";
import type {UserData} from "@/model/userData";
import {useService} from "@/composables/useService";
import {UserService} from "@/services/userService";
import LoadingButton from "@/components/LoadingButton.vue";
import { selectedUsers, userPixels } from "@/renderer/rendererState";

const selectedUser = ref<UserData>()

const { loading, result, err, run } = useService(UserService.getPixelsToRandomUser)

const fetchRandomUser = async () => {
  selectedUsers.clear()
  userPixels.clear()
  await run();
  if(!result.value) return;
  selectedUser.value = result.value
  selectedUsers.add(result.value?.userId);
  const splitData = result.value.pixel.map(item => item.split(','));
  const parsedData = splitData.map(row => [parseInt(row[0]), parseInt(row[1]), parseInt(row[2]), parseInt(row[3])]);
  userPixels.set(result.value?.userId, parsedData)
}

onMounted(async () => {
  await fetchRandomUser()
})

</script>
<template>
<div class="user-data-container user-col" v-if="selectedUser">
  <div v-if="err">{{err}}</div>
  <div v-if="!err" class="user-col">
    <span class="col-header">USER ID</span>
    <span class="col-value col-userId">{{selectedUser.userId}}</span>
  </div>
  <div v-if="!err" class="user-col">
    <span class="col-header">NUMBER OF PIXELS</span>
    <span class="col-value">{{selectedUser.pixel.length}}</span>
  </div>
  <LoadingButton text="Load new User" :loading="loading" @click="fetchRandomUser" class="user-select-button"></LoadingButton>
</div>
</template>

<style>
.user-data-container {
  word-break: break-all;
}

.user-col {
  display: flex;
  flex-direction: column;
}

.col-header {
  font-size: 0.8rem;
  color: darkgray;
  font-weight: bold;
}

.col-userId {
  height: 80px;
}

.user-select-button {
  width: 170px;
  margin: 5px auto 0 auto;
}

</style>