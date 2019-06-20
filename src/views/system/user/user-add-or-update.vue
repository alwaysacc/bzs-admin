<template>
  <el-dialog
    :title="dataForm.id==0 ? '新增' : '修改'"
    :visible.sync="visible"
    :modal-append-to-body='false'
    top="1vh"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">

      <el-form-item label="姓名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号" />
      </el-form-item>
      <el-form-item label="账号" prop="loginName">
        <el-input v-model="dataForm.loginName" placeholder="登录帐号" />
      </el-form-item>
      <el-form-item :class="{ 'is-required': !dataForm.id }" label="密码" prop="loginPwd">
        <el-input v-model="dataForm.loginPwd" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item :class="{ 'is-required': !dataForm.id }" label="确认密码" prop="comfirmPassword">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码" />
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
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.accountState">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveUser, updateUser } from '../../../api/userApi'
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.loginPwd !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: 0,
        loginName: '',
        userName: '',
        loginPwd: '',
        comfirmPassword: '',
        mobile: '',
        roleIdList: [],
        accountState: 1
      },
      updateStat: false,
      dataRule: {
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ],
        loginPwd: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(e) {
      console.log(e)
      if (e) {
        this.dataForm = e
        this.updateStat = true
        this.visible = true
      } else {
        this.visible = true
        this.$refs['dataForm'].resetFields()
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.visible = false
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.updateStat) {
            const param = this.dataForm
            delete param.createdTime
            delete param.loginTime
            delete param.updatedTime
            updateUser(param).then(res => {
              console.log(res)
              if (res.code === 200) {
                this.$emit('refreshDataList')
                this.$message({
                  message: '操作成功',
                  type: 'success'
                })
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            const param = this.dataForm
            saveUser(param).then(res => {
              if (res.code === 200) {
                this.$emit('refreshDataList')
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: '10'
                })
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      })
    }
  }
}
</script>
