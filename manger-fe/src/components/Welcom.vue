<template>
  <h1>欢迎页 {{msg}}</h1>
  <el-button @click="goLogin">去登录</el-button>
</template>

<script setup>
import { defineProps, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const goLogin = () => {
  router.push("/login");
};

defineProps({
  msg: String,
});

const state = reactive({ count: 0 });
</script>

<style scoped>
a {
  color: #42b983;
}
</style>
