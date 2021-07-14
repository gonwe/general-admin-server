<template>
  <h1>登录页面{{ msg }}</h1>
  <el-button @click="goHome()">返回欢迎页面</el-button>

 
</template>

<script>
export default{
  name:'login',
  methods:{
    goHome(){
      this.$router.push('/welcom')
    }
  }
}




</script>

<style scoped>
a {
  color: #42b983;
}
</style>
