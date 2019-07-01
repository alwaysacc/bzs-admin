<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form ref="queryForm" :inline="true" :model="queryForm" :rules="rule" @keyup.enter.native="toQuery()">
          <el-form-item prop="type">
            <el-select v-model="queryForm.type" filterable placeholder="选择查询方式">
              <el-option
                v-for="item in array"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item prop="userName">
            <el-input v-model="queryForm.userName" :placeholder="queryForm.type==0?'用户名':'手机号'" clearable />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="toQuery">查询</el-button>
            <el-button type="primary" @click="addOrUpdate">新增</el-button>
            <el-button :disabled="dataListSelections.length <= 0" type="danger" @click="deleteHandle()">批量删除</el-button>
          </el-form-item>
        </el-form>
        <el-dialog
          :title="isAdd ? '新增' : '修改'"
          :visible.sync="dialog"
          :modal-append-to-body="false"
          :append-to-body="true"
          top="1vh"
          width="500px"
        >
          <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="80px" @keyup.enter.native="dataFormSubmit()">

            <el-form-item label="姓名" prop="userName">
              <el-input v-model="dataForm.userName" placeholder="姓名" />
            </el-form-item>
            <el-form-item :prop="roleLoginName" label="账号">
              <el-input v-model="dataForm.loginName" :disabled="!isAdd" placeholder="登录帐号"/>
            </el-form-item>
            <el-form-item :class="{ 'is-required': !dataForm.id }" :prop="roleLoginPwd" label="密码">
              <el-input v-model="dataForm.loginPwd" type="password" placeholder="密码" />
            </el-form-item>
            <!--      <el-form-item label="邮箱" prop="email">
              <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
            </el-form-item>-->
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="dataForm.mobile" placeholder="手机号" />
            </el-form-item>
            <!--<el-form-item label="角色" size="mini" prop="roleIdList">
              <el-checkbox-group v-model="dataForm.roleIdList">
                <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>-->
            <el-form-item label="状态" size="mini" prop="accountState">
              <el-radio-group v-model="dataForm.accountState">
                <el-radio :label="1">禁用</el-radio>
                <el-radio :label="0">正常</el-radio>
                <el-radio :label="2">待审核</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialog = false">取消</el-button>
            <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
          </span>
        </el-dialog>
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          size="mini"
          style="width: 100%;"
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
            prop="userName"
            header-align="center"
            align="center"
            label="姓名"
          />
          <el-table-column
            prop="user_name1"
            header-align="center"
            align="center"
            label="上级"
          >
            <template slot-scope="scope">
              {{ scope.row.user_name1==null?'无':scope.row.user_name1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="user_name2"
            header-align="center"
            align="center"
            label="上上级"
          >
            <template slot-scope="scope">
              {{ scope.row.user_name2==null?'无':scope.row.user_name2 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="loginName"
            header-align="center"
            align="center"
            label="账号"
            width="150"
          />
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="手机号"
            width="150"
          />
          <el-table-column
            prop="inviteCode"
            header-align="center"
            align="center"
            label="邀请码"
          />
          <!--  <el-table-column
        prop="superiorinvitecode"
        header-align="center"
        align="center"
        label="上级邀请码"
      >
        <template slot-scope="scope">
          {{ scope.row.superiorinvitecode==''?'无上级':scope.row.superiorinvitecode }}
        </template>
      </el-table-column>-->
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.accountState === 1" size="small" type="danger">禁用</el-tag>
              <el-tag v-else-if="scope.row.accountState === 2" size="small" type="warning">待审核</el-tag>
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="CREATED_TIME"
            header-align="center"
            align="center"
            width="180"
            label="最近登录时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.login_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="CREATED_TIME"
            header-align="center"
            align="center"
            width="180"
            label="创建时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.CREATED_TIME) }}
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
                :ref="scope.row.accountId"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.accountId].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteUser(scope.row.accountId)">确定</el-button>
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
import { getUserList, deleteUser, saveUser, updateUser, checkUserLoginName } from '../../../api/userApi'
export default {
  components: {
  },
  data() {
    var checkLoginName = (rule, value, callback) => {
      const param = {
        loginName: this.dataForm.loginName
      }
      const c = callback
      checkUserLoginName(param).then(res => {
        if (res.data) {
          c(new Error('账号已存在'))
        } else {
          c()
        }
      })
    }
    return {
      dataForm: {
        userName: '',
        type: ''
      },
      queryForm: {
        type: '',
        userName: ''
      },
      rule: {
        type: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        userName:
          [{ required: true, message: '必填', trigger: 'blur' }
          ]
      },
      rules: {
        loginName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 16 个字符' },
          { required: true, validator: checkLoginName, trigger: 'blur' }
        ],
        userName:
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
                if (/^1[34578]\d{9}$/.test(value) == false) {
                  callback(new Error('请输入正确的手机号'))
                } else {
                  callback()
                }
              }, trigger: 'blur'
            }],
        roleIdList:
          [{ required: true, message: '必选', trigger: 'blur' }],
        accountState:
          [{ required: true, message: '必选', trigger: 'blur' }]
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      isAdd: true,
      dialog: false,
      userName: '',
      errMsg: true,
      stat: 0,
      roleLoginName: '',
      roleLoginPwd: '',
      array: [
        { id: 0, name: '用户名' },
        { id: 1, name: '手机号' }
      ]
    }
  },
  activated() {
    this.getUserList()
  },
  created() {
    this.getUserList()
  },
  methods: {
    toQuery() {
      this.$refs['queryForm'].validate((valid) => {
        if (valid) {
          this.dataListLoading = true
          const params = {}
          if (this.queryForm.type === 0) {
            params.userName = this.queryForm.userName
          } else {
            params.mobile = this.queryForm.userName
          }
          getUserList(params).then(res => {
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
        }
      })
    },
    getUserList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getUserList(params).then(res => {
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
    checkLoginName() {
      const param = {
        loginName: this.dataForm.loginName
      }
      checkUserLoginName(param).then(res => {
        if (!res) {
          this.errMsg = false
        }
      })
    },
    addOrUpdate(e) {
      if (this.stat === 0) {
        this.stat = this.stat + 1
      } else {
        this.$refs['dataForm'].clearValidate()
      }
      if (e.accountId) {
        this.dialog = true
        this.isAdd = false
        console.log(e)
        this.dataForm = e
        this.dataForm.accountState = Number(this.dataForm.accountState)
        this.dataForm.loginPwd = ''
        this.roleLoginName = ''
        this.roleLoginPwd = 'loginPwd2'
      } else {
        this.dataForm = {}
        this.roleLoginName = 'loginName'
        this.roleLoginPwd = 'loginPwd'
        this.dialog = true
      }
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            const param = this.dataForm
            saveUser(param).then(res => {
              if (res.code === 200) {
                this.$notify({
                  title: '操作成功',
                  type: 'success'
                })
              }
              this.getUserList()
            })
            this.dialog = false
          } else {
            const param = this.dataForm
            console.log(param)
            updateUser(param).then(res => {
              if (res.code === 200) {
                this.$notify({
                  title: '操作成功',
                  type: 'success'
                })
              }
              this.getUserList()
            })
            this.dialog = false
          }
        }
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getUserList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getUserList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
      console.log(this.dataListSelections)
    },
    deleteUser(e) {
      const params = {
        accountId: e,
        status: 1
      }
      deleteUser(params).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.getUserList()
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
      this.$confirm(`确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          accountId: userIds.join(','),
          status: 1
        }
        deleteUser(params).then(res => {
          if (res.code === 200) {
            this.$notify({
              title: '操作成功',
              type: 'success'
            })
            this.getUserList()
          } else {
            this.$message.error(res.data)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
