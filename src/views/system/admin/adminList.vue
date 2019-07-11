<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="adminName" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div v-permission="['ADMIN','ROLES_ALL','ROLES_CREATE']" style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="addOrUpdate">新增</el-button>
      </div>
      <el-dialog
        :title="isAdd ? '新增' : '修改'"
        :visible.sync="dialog"
        :modal-append-to-body="false"
        :append-to-body="true"
        top="1vh"
        width="500px"
      >
        <el-form ref="dataForm" :model="dataForm" :rules="rules" status-icon label-width="80px" @keyup.enter.native="dataFormSubmit()">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dataForm.name" placeholder="登录帐号" />
          </el-form-item>
          <el-form-item :prop="roleLoginName" label="账号">
            <el-input v-model="dataForm.loginName" :disabled="!isAdd" placeholder="登录帐号"/>
          </el-form-item>
          <el-form-item :prop="role" label="密码">
            <el-input v-model="dataForm.loginPwd" type="password" placeholder="密码" />
          </el-form-item>
          <!--      <el-form-item label="邮箱" prop="email">
            <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
          </el-form-item>-->
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="手机号" />
          </el-form-item>
          <el-form-item label="角色" size="mini" prop="roleId">
            <el-select v-model="dataForm.roleId" style="width:100%;" placeholder="请选择">
              <el-option
                v-for="(item, index) in roleList"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item label="状态" size="mini" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio :label="0">正常</el-radio>
              <el-radio :label="1">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
      </el-dialog>
    </div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
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
            label="姓名"
          />
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            width="100"
            label="手机"
          />
          <el-table-column
            prop="loginName"
            header-align="center"
            align="center"
            width="120"
            label="账号"
          />
          <el-table-column
            prop="role_name"
            header-align="center"
            align="center"
            label="角色"
          />
          <el-table-column
            prop="superiorinvitecode"
            header-align="center"
            align="center"
            width="180"
            label="创建时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status != '0'" size="small" type="danger">禁用</el-tag>
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdTime"
            header-align="center"
            align="center"
            width="180"
            label="最后登录时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.last_login_time) }}
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
                <el-button type="primary" size="small" icon="el-icon-edit" @click="addOrUpdate(scope.row)"/>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteAdmin(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="visible=true"/>
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
    </el-row>
  </div>
</template>

<script>
import { getAdminList, getRoleList, saveAdmin, deleteAdmin, updateAdmin,
  checkAdminLoginName
} from '../../../api/userApi'
export default {
  components: {
  },
  data() {
    var checkLoginName = (rule, value, callback) => {
      const param = {
        loginName: this.dataForm.loginName
      }
      const c = callback
      checkAdminLoginName(param).then(res => {
        if (res.data) {
          c(new Error('账号已存在'))
        } else {
          c()
        }
      })
    }
    return {
      adminName: '',
      dataForm: {
        name: '',
        loginName: '',
        pass: ''
      },
      dateScopes: ['全部', '本级', '自定义'],
      loading: false, dialog: false, depts: [], deptIds: [],
      form: { name: '', depts: [], remark: '', dataScope: '本级', level: 3 },
      rules: {
        loginName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 16 个字符' },
          { required: true, validator: checkLoginName, trigger: 'blur' }
        ],
        name:
          [{ required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 7, message: '长度在 2 到 7 个字符' },
            { pattern: /^[\u4E00-\u9FA5]+$/, message: '用户名只能为中文' }
          ],
        loginPwd:
          [{ required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 25, message: '长度在 5 到 25个字符' },
            { pattern: /^(\w){5,25}$/, message: '只能输入5-25个字母、数字、下划线' }
          ],
        loginPwd2:
          [{ required: false, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 25, message: '长度在 5 到 25个字符' },
            { pattern: /^(\w){5,25}$/, message: '只能输入5-25个字母、数字、下划线' }
          ],
        mobile:
          [{ required: true, message: '请输入手机号码', trigger: 'blur' },
            {
              validator: function(rule, value, callback) {
                if (/^1[34578]\d{9}$/.test(value) === false) {
                  callback(new Error('请输入正确的手机号'))
                } else {
                  callback()
                }
              }, trigger: 'blur'
            }],
        roleId:
          [{ required: true, message: '必选', trigger: 'blur' }],
        status:
          [{ required: true, message: '必选', trigger: 'blur' }]
      },
      visible: false,
      query: {
        value: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      roleList: {},
      isAdd: true,
      errMsg: true,
      stat: 0,
      role: '',
      roleLoginName: ''
    }
  },
  activated() {
    this.getAdminList()
  },
  created() {
    this.getAdminList()
  },
  methods: {
    toQuery() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize,
        adminName: this.adminName
      }
      getAdminList(params).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.dataList = res.data.list
          this.totalPage = res.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    getAdminList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getAdminList(params).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.dataList = res.data.list
          this.totalPage = res.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            const param = this.dataForm
            saveAdmin(param).then(res => {
              if (res.code === 200) {
                this.$notify({
                  title: '操作成功',
                  type: 'success'
                })
              }
              this.getAdminList()
            })
            this.dialog = false
          } else {
            const param = this.dataForm
            updateAdmin(param).then(res => {
              if (res.code === 200) {
                this.$notify({
                  title: '操作成功',
                  type: 'success'
                })
              }
              this.getAdminList()
            })
            this.dialog = false
          }
        } else {
          return false
        }
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getAdminList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getAdminList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    addOrUpdate(e) {
      if (this.stat === 0) {
        this.stat = this.stat + 1
      } else {
        this.$refs['dataForm'].clearValidate()
      }
      if (e.id) {
        this.stat = this.stat + 1
        this.role = ''
        this.getRoleList()
        this.dialog = true
        this.isAdd = false
        this.dataForm = e
        this.dataForm.status = Number(this.dataForm.status)
        this.dataForm.loginPwd = ''
        this.role = 'loginPwd2'
        this.roleLoginName = ''
      } else {
        this.dataForm = {}
        this.isAdd = true
        this.role = 'loginPwd'
        this.roleLoginName = 'loginName'
        this.dialog = true
        this.getRoleList()
      }
    },
    getRoleList() {
      const params = {

      }
      getRoleList(params).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.roleList = res.data.list
          this.totalPage = res.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle(e) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(e)
      })
    },
    deleteAdmin(e) {
      const params = {
        id: e
      }
      deleteAdmin(params).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.$refs[e].doClose()
          this.getAdminList()
        } else {
          this.$message.error(res.data)
        }
      })
    },
    // 删除
    deleteHandle(id) {
      var userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.accountId
      })
      console.log(id)
      console.log(userIds)
      this.$confirm(`确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {

      }).catch(() => {})
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
