<template>
  <div class="base-warpper">
    <div class="query-form">
      <el-form :inline="true" ref="queryFrom" :model="queryMenu">
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="queryMenu.menuName"
            placeholder="菜单名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="queryMenu.menuState" placeholder="菜单状态">
            <el-option :value="1" label="正常"></el-option>
            <el-option :value="2" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()">查询</el-button>
          <el-button @click="handleReset('queryFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleCreat">创建</el-button>
      </div>

      <!-- 表格主体 -->
      <el-table :data="menuList" row-key="_id">
        <el-table-column
          v-for="item of columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        >
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" @click="handleAdd">新增</el-button>
            <el-button @click="handleEdit(scope.row)" type="primary" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- <el-dialog title="新增用户" v-model="menuModel">
        <el-form :model="addmenuForm" ref="menuFormAdd" :rules="rules">
          <el-form-item label="用户名" :label-width="110" prop="menuName">
            <el-input
              :disabled="action == 'edit'"
              v-model="addmenuForm.menuName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="110" prop="menuEmail">
            <el-input
              v-model="addmenuForm.menuEmail"
              placeholder="请输入"
              :disabled="action == 'edit'"
            >
              <template #append>@gonwe.cn</template></el-input
            >
          </el-form-item>
          <el-form-item label="手机号" :label-width="110" prop="mobile">
            <el-input
              v-model="addmenuForm.mobile"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="岗位" :label-width="110" prop="job">
            <el-input v-model="addmenuForm.job" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="状态" :label-width="110" prop="state">
            <el-select v-model="addmenuForm.state" placeholder="请选择">
              <el-option label="在职" :value="1"></el-option>
              <el-option label="离职" :value="2"></el-option>
              <el-option label="试用期" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="系统角色" :label-width="110" prop="roleList">
            <el-select
              v-model="addmenuForm.roleList"
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
              v-model="addmenuForm.deptId"
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
      </el-dialog> -->
    </div>
  </div>
</template>

<script>
import utils from "../utils/utils";

export default {
  name: "menu",
  data() {
    return {
      queryMenu: {
        menuName: "",
        menuState: "",
      },
      menuList: [],
      columns: [
        {
          label: "菜单名称",
          prop: "menuName",
        },
        {
          label: "图标",
          prop: "icon",
        },
        {
          label: "菜单类型",
          prop: "menuType",
          formatter(row, column, value) {
            return {
              1: "菜单",
              2: "按钮",
            }[value];
          },
        },
        {
          label: "权限标识",
          prop: "menuCode",
        },
        {
          label: "路由地址",
          prop: "path",
        },
        {
          label: "组件地址",
          prop: "component",
        },
        {
          label: "菜单状态",
          prop: "menuState",
          formatter(row, column, value) {
            return {
              1: "启用",
              2: "停用",
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
      ],
    };
  },
  mounted() {
    this.getMenuList();
  },
  methods: {
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList(this.queryMenu);
        this.menuList = list;
      } catch (error) {
        throw new Error(error);
      }
    },
    handleQuery() {},
    handleReset() {},
    handleCreat() {},
    handleAdd() {},
    handleEdit() {},
    handleDel() {},
  },
};
</script>

<style scoped>
</style>
