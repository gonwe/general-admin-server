<template>
  <el-breadcrumb separator-class="el-icon-arrow-right">
    <!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>活动管理</el-breadcrumb-item>
    <el-breadcrumb-item>活动列表</el-breadcrumb-item> -->

    <el-breadcrumb-item v-for="(i,index) of route" :key="i.path">
      <router-link :to="i.path" v-if="index === 0">{{
        i.meta.title
      }}</router-link>
      <span v-else> {{ i.meta.title }}</span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  name: "BreadCrumb",
  props: {
    userMenu: Array,
    default() {
      return [];
    },
  },
  mounted() {
    console.log(this.$route.matched);
  },
  computed: {
    route() {
      return this.$route.matched;
    },
  },
  data() {
    return {};
  },
};
</script>

<style>
</style>