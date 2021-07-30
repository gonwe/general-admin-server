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
          <el-button @click="handleReset('userForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="addUserModel">新增</el-button>
        <el-button type="danger" @click="handlePathDel">批量删除</el-button>
      </div>
      <el-table :data="userList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" />
        <el-table-column
          v-for="item of columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template #default="scope">
            <el-button @click="handleEdit(scope.row)" type="primary" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :currentPage="pager.pageNum"
          :total="pager.total"
        >
        </el-pagination>
      </div>

      <el-dialog title="新增用户" v-model="userModel">
        <el-form :model="addUserForm" ref="userFormAdd" :rules="rules">
          <el-form-item label="用户名" :label-width="110" prop="userName">
            <el-input
              :disabled="action == 'edit'"
              v-model="addUserForm.userName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="110" prop="userEmail">
            <el-input
              v-model="addUserForm.userEmail"
              placeholder="请输入"
              :disabled="action == 'edit'"
            >
              <template #append>@gonwe.cn</template></el-input
            >
          </el-form-item>
          <el-form-item label="手机号" :label-width="110" prop="mobile">
            <el-input
              v-model="addUserForm.mobile"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="岗位" :label-width="110" prop="job">
            <el-input v-model="addUserForm.job" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="110" prop="state">
            <el-select v-model="addUserForm.state" placeholder="请选择">
              <el-option label="在职" :value="1"></el-option>
              <el-option label="离职" :value="2"></el-option>
              <el-option label="试用期" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系统角色" :label-width="110" prop="roleList">
            <el-select
              v-model="addUserForm.roleList"
              placeholder="请选择"
              style="width: 100%"
              multiple
            >
              <el-option
                v-for="role in rolesList"
                :key="role._id"
                :label="role.roleName"
                :value="role._id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="部门" :label-width="110" prop="deptId">
            <el-cascader
              style="width: 100%"
              placeholder="请选择"
              :options="deptList"
              v-model="addUserForm.deptId"
              :props="{ checkStrictly: true, label: 'deptName', value: '_id' }"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleClose()">取 消</el-button>
            <el-button type="primary" @click="handleSumbit()">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, reactive, ref, toRaw } from "vue";
import utils from "../utils/utils";

export default {
  name: "User",
  setup() {
    // 获取Vue3的ctx对象 appContext.config.globalProperties是用户自定义的全局
    const { appContext, ctx } = getCurrentInstance();
    const that = appContext.config.globalProperties;
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
    // 所有角色列表
    const rolesList = ref([]);
    // 部门列表
    const deptList = ref([]);
    // 默认新增弹窗
    const userModel = ref(false);
    // 提交编辑状态
    const action = ref("add");
    // 批量删除数据
    const checkedUserIds = ref([]);

    // 新增用户数据
    const addUserForm = reactive({
      state: 3,
    });
    // 新增用户校验
    const rules = reactive({
      userName: [{ required: true, message: "请输入", trigger: "blur" }],
      userEmail: [{ required: true, message: "请输入", trigger: "blur" }],
      mobile: [
        {
          pattern: /^1[3-9](\d{9})$/,
          message: "请输入正确的手机号",
          trigger: "blur",
        },
      ],
      deptId: [{ required: true, message: "请输入", trigger: "blur" }],
    });
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
        label: "用户角色",
        prop: "role",
        formatter(row, column, value) {
          return {
            0: "管理员",
            1: "普通用户",
          }[value];
        },
      },
      {
        label: "用户状态",
        prop: "state",
        formatter(row, column, value) {
          return {
            1: "在职",
            2: "离职",
            3: "试用期",
          }[value];
        },
      },
      {
        label: "创建时间",
        prop: "createTime",
        width: 180,
        formatter: (row, colunm, value) => {
          return utils.formatDate(new Date(value));
        },
      },
      {
        label: "最后登录时间",
        prop: "lastLoginTime",
        width: 180,
        formatter: (row, colunm, value) => {
          return utils.formatDate(new Date(value));
        },
      },
    ]);
    //  初始化接口调用
    onMounted(() => {
      // console.log(that);
      // console.log(ctx);
      getUserList();
      getDeptList();
      getRoleList();
    });
    // 获取用户列表
    const getUserList = async () => {
      try {
        const { list, page } = await that.$api.getUserList({
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
    const handleReset = (formName) => {
      // console.log(ctx);
      ctx.$refs[formName].resetFields();
    };
    // 分页参数处理
    const handleCurrentChange = (curent) => {
      pager.pageNum = curent;
      getUserList();
    };

    // 表格多选
    const handleSelectionChange = (list) => {
      let arr = [];
      list.map((i) => {
        arr.push(i.userId);
        // console.log(i.userId);
      });
      checkedUserIds.value = arr;
    };

    // 删除用户
    const handleDel = async (row) => {
      await that.$api.userDel({
        userIds: [row.userId],
      });
      that.$message.success("删除成功！");
      getUserList();
    };
    // 批量删除用户
    const handlePathDel = async () => {
      const { nModified } = await that.$api.userDel({
        userIds: checkedUserIds.value,
      });
      if (nModified > 0) {
        that.$message.success("删除成功！");
        getUserList();
      } else {
        that.$message.error("删除失败！");
      }
    };
    // 打开新增用户
    const addUserModel = () => {
      action.value = "add";
      userModel.value = true;
      handleReset("userFormAdd");
    };

    // 获取部门列表
    const getDeptList = async () => {
      const list = await that.$api.getDeptList();
      deptList.value = list;
    };
    // 获取权限列表
    const getRoleList = async () => {
      const list = await that.$api.getRoleList();
      rolesList.value = list;
    };
    // 关闭弹窗
    const handleClose = () => {
      userModel.value = false;
      handleReset("userFormAdd");
    };
    // 提交注册
    const handleSumbit = () => {
      ctx.$refs.userFormAdd.validate(async (valid) => {
        if (valid) {
          let params = toRaw(addUserForm); //toRaw相当于深拷贝 不影响原始数据
          params.userEmail += "@gonwe.com";
          params.action = action;
          let res = await that.$api.userSumbit(params);
          if (res) {
            userModel.value = false;
            that.$message.success(res.msg || "操作成功！");
            handleReset("userFormAdd");
            getUserList();
          }
        }
      });
    };
    // 编辑弹窗
    const handleEdit = (row) => {
      console.log(row);
      action.value = "edit";
      userModel.value = true;
      ctx.$nextTick(() => {
        Object.assign(addUserForm, row);
      });
    };
    return {
      user,
      pager,
      columns,
      userList,
      checkedUserIds,
      userModel,
      addUserForm,
      rules,
      rolesList,
      deptList,
      action,
      getUserList,
      handleQuery,
      handleReset,
      handleCurrentChange,
      handleSelectionChange,
      handleDel,
      handlePathDel,
      addUserModel,
      getDeptList,
      getRoleList,
      handleClose,
      handleSumbit,
      handleEdit,
    };
  },
};
</script>

<style scoped>
</style>
