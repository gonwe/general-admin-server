<template>
  <div class="base-warpper">
    <div class="query-form">
      <el-form :inline="true" :model="user">
        <el-form-item label="用户ID">
          <el-input v-model="user.userId" placeholder="用户ID"></el-input>
        </el-form-item>

        <el-form-item label="用户名">
          <el-input v-model="user.userName" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="用户状态">
          <el-select v-model="user.state" placeholder="用户状态">
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
          <el-button @click="onSubmit">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="onSubmit">新增</el-button>
        <el-button type="danger" @click="onSubmit">批量删除</el-button>
      </div>
      <el-table :data="userList">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item of columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button
              @click="handleClick(scope.row)"
              type="primary"
              size="mini"
              >编辑</el-button
            >
            <el-button type="danger" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination"></div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";

export default {
  name: "User",
  setup() {
    const { ctx } = getCurrentInstance();
    const user = reactive({});
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
    });

    const userList = ref([]);
    const columns = reactive([
      {
        label: "用户ID",
        prop: "userId",
      },
      {
        label: "用户名称",
        prop: "userName",
      },
      {
        label: "电子邮箱",
        prop: "userEmail",
      },
      {
        label: "用户权限",
        prop: "role",
      },
      {
        label: "用户状态",
        prop: "state",
      },
      {
        label: "创建时间",
        prop: "createTime",
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
      },
    ]);
    onMounted(() => {
      console.log(getCurrentInstance());
      // getUserList();
    });
    const getUserList = async () => {
      try {
        const { list, page } = await ctx.$api.getUserList({
          ...pager,
          ...user,
        });
        userList.values = list;
        pager.total = page.total;
      } catch (error) {
        throw error;
      }
    };
    return {
      user,
      pager,
      columns,
      userList,
      getUserList,
    };
  },
};
</script>

<style scoped>
</style>
