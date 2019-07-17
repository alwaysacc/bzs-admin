<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 搜索 -->
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="addOrUpdate">新增</el-button>
        <eForm ref="form" :is-add="true"/>
      </div>
      <el-dialog
        :title="isAdd ? '新增' : '修改'"
        :visible.sync="dialog"
        :modal-append-to-body="false"
        :append-to-body="true"
        top="1vh"
        width="500px"
      >
        <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="80px" @keyup.enter.native="dataFormSubmit()">
          <el-form-item label="账号" prop="accountName">
            <el-input v-model="dataForm.accountName" placeholder="登录帐号" />
          </el-form-item>
          <el-form-item label="密码" prop="accountPwd">
            <el-input v-model="dataForm.accountPwd" placeholder="密码" />
          </el-form-item>
          <el-form-item :prop="roleAccountId" label="账号所属" size="mini">
            <el-select v-if="isAdd" v-model="dataForm.accountId" style="width:100%;" placeholder="请选择">
              <el-option
                v-for="(item, index) in userList"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"/>
            </el-select>
            <el-input v-else v-model="dataForm.name" disabled/>
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
            prop="accountName"
            header-align="center"
            align="center"
            label="账号"
          />
          <el-table-column
            prop="accountPwd"
            header-align="center"
            align="center"
            width="100"
            label="密码"
          />
          <!-- <el-table-column
            prop="loginName"
            header-align="center"
            align="center"
            label="类别"
          />
          <el-table-column
            prop="role_name"
            header-align="center"
            align="center"
            label="状态"
          />
          <el-table-column
            prop="superiorinvitecode"
            header-align="center"
            align="center"
            width="180"
            label="级别"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>-->
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="账号所属"
          />
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
                :ref="scope.row.thirdInsuranceId"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.thirdInsuranceId].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteAccount(scope.row.thirdInsuranceId)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="visible=true"/>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>

      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCrawlingAdminList, getAdminList, addThirdAccount, updateThirdAccount ,deleteThirdAccount} from '../../api/userApi'
export default {
  components: {
  },
  data() {
    return {
      loading: false, dialog: false, depts: [], deptIds: [],
      form: { name: '', depts: [], remark: '', dataScope: '本级', level: 3 },
      rules: {
        accountName: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 5, max: 16, message: '长度在 5 到 16 个字符' }
        ],
        accountPwd:
          [{ required: true, message: '请输入密码', trigger: 'blur' },
            { min: 5, max: 25, message: '长度在 5 到 25个字符' },
            { pattern: /^(\w){5,25}$/, message: '只能输入5-25个字母、数字、下划线' }
          ],
        accountId:
          [{ required: true, message: '请选择所属', trigger: 'blur' }
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
      roleList: {},
      isAdd: true,
      roleAccountId: '',
      userList: []
    }
  },
  created() {
    this.getCrawlingAdminList()
  },
  methods: {
    getCrawlingAdminList() {
      const user = JSON.parse(this.$store.getters.user)
      console.log(user)
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize,
        createBy: user.id
      }
      getCrawlingAdminList(params).then(res => {
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
    dataFormSubmit() {
      console.log(this.dataForm)
      const user = JSON.parse(this.$store.getters.user)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.isAdd) {
            const param = this.dataForm
            param.createId = user.id
            addThirdAccount(param).then(res => {
              if (res.code === 200) {
                this.$notify({
                  title: '操作成功',
                  type: 'success'
                })
              }
              this.getCrawlingAdminList()
            })
            this.dialog = false
          } else {
            const param = this.dataForm
            updateThirdAccount(param).then(res => {
              if (res.code === 200) {
                this.$notify({
                  title: '操作成功',
                  type: 'success'
                })
              }
              this.getCrawlingAdminList()
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
      this.getCrawlingAdminList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getCrawlingAdminList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    addOrUpdate(e) {
      if (e.thirdInsuranceId) {
        this.roleAccountId = ''
        this.dialog = true
        this.isAdd = false
        console.log(e)
        this.dataForm = e
        this.dataForm.status = Number(this.dataForm.status)
        this.dataForm.loginPwd = ''
      } else {
        this.roleAccountId = 'accountId'
        this.dataForm = {}
        this.dialog = true
        this.isAdd = true
        this.getUserNameList()
      }
    },
    getUserNameList() {
      const params = {
      }
      getAdminList(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.userList = res.data.list
        }
      })
    },
    deleteAccount(e) {
      const params = {
        accountId: e
      }
      deleteThirdAccount(params).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.$refs[e].doClose()
          this.getCrawlingAdminList()
        } else {
          this.$message.error(res.data)
        }
      })
    },
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
