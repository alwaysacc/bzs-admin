<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="addRole">新增</el-button>
        <eForm ref="form" :is-add="true"/>
      </div>
      <el-dialog :visible.sync="dialog" :title="isAdd ? '新增角色' : '编辑角色'" top="0" append-to-body width="500px" style="height: 100%" height="100%">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="form.name" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="描述信息">
            <el-input v-model="form.remark" style="width: 370px;" rows="5" type="textarea"/>
          </el-form-item>
          <el-form-item label="选择权限">
            <el-tree
              ref="tree"
              :data="data"
              :props="defaultProps"
              :default-expand-all="false"
              :default-checked-keys="checkedArray"
              show-checkbox
              node-key="id"
              highlight-current/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialog=false">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
    </div>
    <el-row :gutter="15">
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">-->
        <!--          <el-form-item>-->
        <!--            <el-input v-model="dataForm.userName" placeholder="用户名" clearable />-->
        <!--          </el-form-item>-->
        <!--          <el-form-item>-->
        <!--            <el-button @click="getDataList()">查询</el-button>-->
        <!--            <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
        <!--            <el-button :disabled="dataListSelections.length <= 0" type="danger" @click="deleteHandle()">批量删除</el-button>-->
        <!--          </el-form-item>-->
        <!--        </el-form>-->
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          size="mini"
          border
          style="width: 100%;"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            type="index"
            width="50"
            label="ID"
          />
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="名称"
          />
          <el-table-column
            prop="remark"
            header-align="center"
            align="center"
            label="描述"
          />
          <el-table-column
            prop="createTime"
            header-align="center"
            align="center"
            label="创建时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="200"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" icon="el-icon-edit"  @click="addRole(scope.row)"></el-button>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteRole(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="visible=true"></el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          :total="totalPage"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
        />
      </el-col>
      <!-- 授权 -->
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/role'
import { getPermissionTree } from '@/api/permission'
import { getMenusTree } from '@/api/menu'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
import { editPermission, editMenu, get } from '@/api/role'
import { getRoleList, getMenulist, addRoleAndMenu, deleteRole, updateRole, getMenuIdByRoleId } from '../../../api/userApi'

export default {
  components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      downloadLoading: false,
      dateScopes: ['全部', '本级', '自定义'],
      loading: false, dialog: false, depts: [], deptIds: [],
      form: { name: '', remark: '' },
      isAdd: true,
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      visible: false,
      query: {
        value: ''
      },
      dataForm: {
        userName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      currentId: 0, permissionLoading: false, menuLoading: false, showButton: false, opt: '菜单分配',
      delLoading: false, sup_this: this, permissions: [], permissionIds: [], menus: [], menuIds: [],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checkedArray: [],
      roleMenuList: {}
    }
  },
  created() {
    this.getRoleList()
  },
  activated() {
  },
  methods: {
    getRoleList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getRoleList(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.dataList = res.data.list
          this.totalPage = res.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getRoleList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getRoleList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    addRole(e) {
      if (e.id) {
        this.isAdd = false
        this.form = e
        this.getMenus()
        const param = {
          id: e.id
        }
        getMenuIdByRoleId(param).then(res => {
          console.log(res)
          this.checkedArray = res.data
          this.dialog = true
        })
      } else {
        this.checkedArray = []
        this.getMenus()
        this.dialog = true
      }
    },
    getMenusByRoleId(e) {
      const param = {
        id: e
      }
      getMenulist(param).then(res => {
        this.roleMenuList = res.data
        console.log(res)
      })
    },
    getMenus() {
      const param = {
      }
      getMenulist(param).then(res => {
        this.data = res.data
        console.log(res)
      })
    },
    doSubmit() {
      if (this.isAdd) {
        this.dialog = false

        const param = this.form
        param.menuId = JSON.stringify(this.$refs.tree.getCheckedKeys())
        addRoleAndMenu(param).then(res => {
          console.log(res)
          this.$notify({
            title: '保存成功',
            type: 'success'
          })
        })
        this.getRoleList()
      } else {
        delete this.form.createTime
        console.log(this.form)
        console.log(this.$refs.tree.getCheckedKeys())
        console.log(this.checkedArray)
        const param = this.form
        param.menuId=JSON.stringify(this.$refs.tree.getCheckedKeys())
        param.beforeMenuId=JSON.stringify(this.checkedArray)
        updateRole(param).then(res => {
          console.log(res)
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
        })
        this.dialog = false
        this.getRoleList()
      }
    },
    deleteRole(e) {
      console.log(e)
      const param = {
        roleId: e
      }
      deleteRole(param).then(res => {
        this.$notify({
          title: '操作成功',
          type: 'success'
        })
        this.$refs[e].doClose()
        this.getRoleList()
      })
    },
    parseTime,
    checkPermission,
    beforeInit() {
      this.$refs.permission.setCheckedKeys([])
      this.$refs.menu.setCheckedKeys([])
      this.showButton = false
      this.url = 'api/roles'
      const sort = 'level,asc'
      const query = this.query
      const value = query.value
      this.params = { page: this.page, size: this.size, sort: sort }
      if (value) { this.params['name'] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    getPermissions() {
      getPermissionTree().then(res => {
        this.permissions = res
      })
    },
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空权限与菜单的选中
        this.$refs.permission.setCheckedKeys([])
        this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 点击后显示按钮
        this.showButton = true
        // 初始化
        this.menuIds = []
        this.permissionIds = []
        // 菜单数据需要特殊处理
        val.menus.forEach(function(data, index) {
          let add = true
          for (let i = 0; i < val.menus.length; i++) {
            if (data.id === val.menus[i].pid) {
              add = false
              break
            }
          }
          if (add) {
            _this.menuIds.push(data.id)
          }
        })
        // 处理权限数据
        val.permissions.forEach(function(data, index) {
          _this.permissionIds.push(data.id)
        })
      }
    },
    savePermission() {
      this.permissionLoading = true
      const role = { id: this.currentId, permissions: [] }
      this.$refs.permission.getCheckedKeys().forEach(function(data, index) {
        const permission = { id: data }
        role.permissions.push(permission)
      })
      editPermission(role).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.permissionLoading = false
        this.update()
      }).catch(err => {
        this.permissionLoading = false
        console.log(err.response.data.message)
      })
    },
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      // 得到半选的父节点数据，保存起来
      this.$refs.menu.getHalfCheckedNodes().forEach(function(data, index) {
        const permission = { id: data.id }
        role.menus.push(permission)
      })
      // 得到已选中的 key 值
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const permission = { id: data }
        role.menus.push(permission)
      })
      editMenu(role).then(res => {
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
        this.menuLoading = false
        this.update()
      }).catch(err => {
        this.menuLoading = false
        console.log(err.response.data.message)
      })
    },
    update() {
      // 无刷新更新 表格数据
      get(this.currentId).then(res => {
        for (let i = 0; i < this.data.length; i++) {
          if (res.id === this.data[i].id) {
            this.data[i] = res
            break
          }
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .app-container{
    overflow-y: visible;
  }
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>
