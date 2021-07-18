<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: "app",
  mounted() {
    this.$ls.setItem("userInfo", { userName: "zhangsan", age: "300" });
  },
};
</script>

