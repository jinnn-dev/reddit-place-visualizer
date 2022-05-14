<script setup lang="ts">

import {onMounted, ref} from "vue";
import type {UserData} from "@/model/userData";
import {useService} from "@/composables/useService";
import {UserService} from "@/services/userService";
import LoadingButton from "@/components/LoadingButton.vue";

const selectedUser = ref<UserData>()

const { loading, result, err, run } = useService(UserService.getRandomUser)

const fetchRandomUser = async () => {
  await run();
  selectedUser.value = result.value
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
    <span class="col-value">{{selectedUser.pixels.length}}</span>
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