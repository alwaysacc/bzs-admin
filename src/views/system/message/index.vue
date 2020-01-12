<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 搜索 -->
      <!--  <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
 -->     <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="addRole">新增
        </el-button>
      </div>
      <el-dialog
        :visible.sync="dialog"
        :title="isAdd ? '新增消息' : '编辑角色'"
        append-to-body
        width="500px"
        style="height: 100%"
        height="100%">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="标题" prop="name">
            <el-input v-model="form.title" style="width: 370px;"/>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="form.content" style="width: 370px;" rows="6" type="textarea"/>
          </el-form-item>
          <!-- <el-form-item label="选择权限">
            <el-tree
              ref="tree"
              :data="data"
              :props="defaultProps"
              :default-expand-all="false"
              :default-checked-keys="checkedArray"
              show-checkbox
              node-key="id"
              highlight-current
              @check-change="handleCheckChange"/>
          </el-form-item>-->
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
            type="index"
            width="50"
            align="center"
            label="ID"
          />
          <el-table-column
            prop="title"
            header-align="center"
            align="center"
            label="标题"
          />
          <el-table-column
            prop="content"
            header-align="center"
            align="center"
            label="内容"
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
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <el-popover
                :ref="scope.row.mId"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.mId].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="del(scope.row.mId)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="visible=true"/>
              </el-popover>
            </template>
          </el-table-column>
          <!--  <el-table-column
              fixed="right"
              header-align="center"
              align="center"
              width="200"
              label="操作"
            >
              &lt;!&ndash;<template slot-scope="scope">
                <el-button type="primary" size="small" icon="el-icon-edit" @click="addRole(scope.row)"/>
                <el-popover
                  :ref="scope.row.id"
                  placement="top"
                  width="160">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteRole(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="visible=true"/>
                </el-popover>
              </template>&ndash;&gt;
            </el-table-column>-->
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
import { parseTime } from '@/utils/index'
import {
  getMessageList,
  addMessage,
    delMessage
} from '../../../api/userApi'

export default {
  // components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      downloadLoading: false,
      dateScopes: ['全部', '本级', '自定义'],
      loading: false, dialog: false, depts: [], deptIds: [],
      form: { title: '', content: '' },
      isAdd: true,
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' }
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
    this.getMessageList()
  },
  activated() {
  },
  methods: {
    handleCheckChange(data, checked, indeterminate) {
      /*      let a=this.$refs.tree.getCheckedKeys().concat( this.$refs.tree.getHalfCheckedKeys())
                console.log( this.$refs.tree.getCheckedKeys());
                console.log( this.$refs.tree.getHalfCheckedKeys());
                console.log(a);*/
    },
    del(e) {
      const params = {
        id: e
      }
        delMessage(params).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.$refs[e].doClose()
          this.getMessageList()
        } else {
          this.$message.error(res.data)
        }
      })
    },
    getMessageList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getMessageList(params).then(res => {
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
      this.getMessageList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getMessageList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    addRole(e) {
      this.isAdd = true
      this.dialog = true
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialog = false
          const param = this.form
          addMessage(param).then(res => {
            if (res.code === 200) {
              this.$notify({
                title: '保存成功',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: '保存失败'
              })
            }
            this.getMessageList()
          })
        }
      })
    },
    parseTime,
    checkPermission
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .app-container {
    overflow-y: visible;
  }

  .role-span {
    font-weight: bold;
    color: #303133;
    font-size: 15px;
  }
</style>
