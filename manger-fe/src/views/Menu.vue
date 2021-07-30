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
          <el-button type="primary" @click="getMenuList()">查询</el-button>
          <el-button @click="handleReset('queryFrom')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="base-table">
      <div class="action">
        <el-button type="primary" @click="handleAdd(1)">创建</el-button>
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
            <el-button type="primary" @click="handleAdd(2, scope.row)"
              >新增</el-button
            >
            <el-button @click="handleEdit(scope.row)" type="primary" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" size="mini" @click="handleDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <el-dialog title="新增菜单" v-model="menuModel">
        <el-form :model="addmenuForm" ref="menuFormAdd" :rules="rules">
          <el-form-item label="父级菜单" :label-width="110" prop="parentId">
            <el-cascader
              placeholder="请选择"
              :options="menuList"
              v-model="addmenuForm.parentId"
              :props="{ checkStrictly: true, label: 'menuName', value: '_id' }"
              clearable
            ></el-cascader>
            <span> 不选,默认是创建一级菜单</span>
          </el-form-item>

          <el-form-item label="菜单类型" :label-width="110" prop="menuType">
            <el-radio
              :disabled="action == 'edit'"
              v-model="addmenuForm.menuType"
              :label="1"
              >菜单</el-radio
            >
            <el-radio
              :disabled="action == 'edit'"
              v-model="addmenuForm.menuType"
              :label="2"
              >按钮</el-radio
            >
          </el-form-item>
          <el-form-item label="菜单名称" :label-width="110" prop="menuName">
            <el-input
              :disabled="action == 'edit'"
              v-model="addmenuForm.menuName"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="菜单图标"
            :label-width="110"
            prop="icon"
            v-show="addmenuForm.menuType === 1"
          >
            <el-input
              v-model="addmenuForm.icon"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="路由地址"
            :label-width="110"
            prop="path"
            v-show="addmenuForm.menuType === 1"
          >
            <el-input
              v-model="addmenuForm.path"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="权限标识"
            :label-width="110"
            prop="menuCode"
            v-show="addmenuForm.menuType === 2"
          >
            <el-input
              v-model="addmenuForm.menuCode"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="组件地址"
            :label-width="110"
            prop="component"
            v-show="addmenuForm.menuType === 1"
          >
            <el-input
              v-model="addmenuForm.component"
              placeholder="请输入"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="菜单状态"
            :label-width="110"
            prop="menuState"
            v-show="addmenuForm.menuType === 1"
          >
            <el-select v-model="addmenuForm.state" placeholder="请选择">
              <el-option label="启用" :value="1"></el-option>
              <el-option label="停用" :value="2"></el-option>
            </el-select>
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
import utils from "../utils/utils";

export default {
  name: "menu",
  data() {
    return {
      queryMenu: {
        menuName: "",
        menuState: "",
      },
      menuModel: false,
      menuList: [],
      action: "", // create: 创建 edit:编辑 delete:删除
      addmenuForm: {
        menuType: 1, //菜单类型 1:菜单 2:按钮
        menuName: "", //菜单名称
        menuCode: "", //菜单标识符，只有按钮类型才有，用于确定按钮权限
        path: "", //菜单路由
        icon: "", //菜单图标
        component: "", //组件地址
        parentId: "", //父菜单ID
      },
      rules: {
        menuName: [
          { required: true, message: "请输入", trigger: "blur" },
          { min: 2, max: 10, message: "最大输入8个字符", trigger: "blur" },
        ],
      },
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
    // 获取菜单
    async getMenuList() {
      try {
        let list = await this.$api.getMenuList(this.queryMenu);
        this.menuList = list;
      } catch (error) {
        throw new Error(error);
      }
    },

    // 提交菜单
    handleSumbit() {
      this.$refs.menuFormAdd.validate(async (vaild) => {
        if (vaild) {
          let { addmenuForm, action } = this;
          let params = { ...addmenuForm, action };
          await this.$api.menuSumbit(params);
          this.handleClose();
          this.getMenuList();
        }
      });
    },

    // 新增菜单
    handleAdd(type, row) {
      this.action = "create";
      this.menuModel = true;
      if (type === 2) {
        this.addmenuForm.parentId = [...row.parentId, row._id].filter((i) => i);
      }
    },
    handleEdit() {},
    handleDel() {},
    // 菜单关闭
    handleClose() {
      this.menuModel = false;
      this.handleReset("menuFormAdd");
    },
    // 菜单重置
    handleReset(form) {
      this.$refs[form].resetFields();
    },
  },
};
</script>

<style scoped>
</style>
