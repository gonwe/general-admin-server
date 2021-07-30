<template>
  <div class="login-wrapper">
    <el-card class="box-card">
      <h1 class="title">
        <i class="el-icon-s-cooperation"></i>在线办公系统登录
      </h1>
      <el-form
        :model="loginForm"
        ref="loginForm"
        class="login-ruleForm"
        status-icon
      >
        <el-form-item
          prop="userName"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <el-input
            type="text"
            prefix-icon="el-icon-user"
            placeholder="请输入内容"
            v-model.number="loginForm.userName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item
          prop="userPwd"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <el-input
            prefix-icon="el-icon-lock"
            placeholder="请输入内容"
            type="password"
            v-model.number="loginForm.userPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="login"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import md5 from "md5";
export default {
  name: "login",
  components: {},

  data() {
    return {
      loginForm: {
        userName: "",
        userPwd: "",
      },
    };
  },
  methods: {
    login() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$api
            .login({ ...this.loginForm, userPwd: md5(this.loginForm.userPwd) })
            .then((res) => {
              console.log(res);
              this.$store.commit("saveUserInfo", res);
              this.$router.push("/welcome");
            })
            .catch((err) => {});
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style scoped>
login-wrapper {
  height: 100%;
  overflow: hidden;
}
.box-card {
  width: 30%;
  height: 300px;
  margin: 0 auto;
  /* margin-top: 10%; */
}
.title {
  font-size: 25px;
  color: darkgrey;
  text-align: center;
  line-height: 60px;
}
.login-ruleForm {
  width: 90%;
  margin: 0 auto;
}
</style>
