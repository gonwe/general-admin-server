<template>
  <div class="base-warpper">
    <div class="query-form">
      <el-form :inline="true" ref="userForm" :model="user">
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="用户ID"></el-input>
        </el-form-item>

        <el-form-item label="用户名" prop="userName">
          <el-input v-model="user.userName" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state" placeholder="用户状态">
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()">查询</el-button>
          <el-button @click="handleReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger">批量删除</el-button>
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
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :currentPage="pager.pageNum"
          :total="pager.total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref } from "vue";

export default {
  name: "User",
  setup() {
    // 获取Vue3的ctx对象 appContext.config.globalProperties是用户自定义的全局
    const { appContext, ctx } = getCurrentInstance();
    // 初始化用户数据
    const user = reactive({
      state: 0,
    });
    // 初始分页对象
    const pager = reactive({
      pageNum: 1,
      pageSize: 10,
    });
    // 获取用户返回的对象
    const userList = ref([]);
    // 定义数据表头
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
    //  初始化接口调用
    onMounted(() => {
      console.log(appContext.config.globalProperties);
      console.log(ctx);
      getUserList();
    });
    // 获取用户列表
    const getUserList = async () => {
      try {
        const { list, page } =
          await appContext.config.globalProperties.$api.getUserList({
            ...pager,
            ...user,
          });
        userList.value = list;
        pager.total = page.total;
      } catch (error) {
        throw error;
      }
    };
    // 查询用户列表
    const handleQuery = () => {
      getUserList();
    };
    // 重置用户搜索列表
    const handleReset = () => {
      console.log(ctx);
      ctx.$refs.userForm.resetFields();
    };
    // 分页参数处理
    const handleCurrentChange = (curent) => {
      pager.pageNum = curent;
      getUserList();
    };
    return {
      user,
      pager,
      columns,
      userList,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
    };
  },
};
</script>

<style scoped>
</style>
