<template>
  <div class="navbar">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container"/>
    <breadcrumb class="breadcrumb-container"/>

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <el-tooltip content="全屏" effect="dark" placement="bottom">
          <screenfull class="screenfull right-menu-item"/>
        </el-tooltip>
      </template>
      <el-dropdown class="avatar-container right-menu-item" trigger="click">
        <div class="avatar-wrapper">
          <img src="http://img.cdn.baozhishun.com/u=3022733732,2743307970&fm=26&gp=0.jpg" class="user-avatar">
          <i class="el-icon-caret-bottom"/>
        </div>
        <el-dropdown-menu slot="dropdown">
          <!--  <span style="display:block;" @click="show = true">
            <el-dropdown-item>
              布局设置
            </el-dropdown-item>
          </span>-->
          <span style="display:block;" @click="dialog=true">
            <el-dropdown-item>
              修改密码
            </el-dropdown-item>
          </span>
          <span style="display:block;" @click="open">
            <el-dropdown-item divided>
              退出登录
            </el-dropdown-item>
          </span>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog
        :visible.sync="dialog"
        :modal-append-to-body="false"
        title="修改密码"
        top="1vh"
        width="500px"
      >
        <el-form ref="ruleForm" :model="ruleForm" :rules="rules" status-icon label-width="100px" class="demo-ruleForm">
          <el-form-item label="新密码" prop="pass">
            <el-input v-model="ruleForm.pass" type="password" autocomplete="off"/>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">取消</el-button>
          <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import { updateAdmin } from '../../../api/userApi'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  data() {
    var validatePass = (rule, value, callback) => {
      console.log(value)
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value.length < 6) {
        callback(new Error('密码不得小于6位'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialog: false,
      dialogVisible: false,
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'index.vue',
      'device'
    ]),
    show: {
      get() {
        return this.$store.state.settings.showRightPanel
      },
      set(val) {
        this.$store.dispatch('changeSetting', {
          key: 'showRightPanel',
          value: val
        })
      }
    }
  },
  methods: {
    dataFormSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const user = JSON.parse(this.$store.getters.user)
          const param = {
            id: user.id,
            loginPwd: this.ruleForm.pass,
            loginName: user.loginName
          }
          updateAdmin(param).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$notify({
                title: '操作成功',
                type: 'success'
              })
            }
            this.dialog = false
          })
        }
      })
    },
    open() {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.logout()
      })
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.dialogVisible = false
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .navbar {
    height: 50px;
    line-height: 50px;
    border-radius: 0px !important;
    .hamburger-container {
      line-height: 58px;
      height: 50px;
      float: left;
      padding: 0 10px;
    }
    .breadcrumb-container{
      float: left;
    }
    .errLog-container {
      display: inline-block;
      vertical-align: top;
    }
    .right-menu {
      float: right;
      height: 100%;
      &:focus{
        outline: none;
      }
      .right-menu-item {
        display: inline-block;
        margin: 0 8px;
      }
      .screenfull {
        height: 20px;
      }
      .international{
        vertical-align: top;
      }
      .theme-switch {
        vertical-align: 15px;
      }
      .avatar-container {
        height: 50px;
        margin-right: 30px;
        .avatar-wrapper {
          margin-top: 5px;
          position: relative;
          .user-avatar {
            cursor: pointer;
            width: 40px;
            height: 40px;
            border-radius: 10px;
          }
          .el-icon-caret-bottom {
            cursor: pointer;
            position: absolute;
            right: -20px;
            top: 25px;
            font-size: 12px;
          }
        }
      }
    }
  }
</style>
