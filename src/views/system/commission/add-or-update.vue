<template>
  <el-dialog
    :modal-append-to-body="false"
    :append-to-body="true"
    :visible.sync="visible"
    top="1vh"
    title="修改"
    width="500px"
  >

    <el-row type="flex" class="row-bg is-justify-space-around padding-top">
      <el-col style="text-align: right">保险公司：</el-col>
      <el-col style="text-align: left">
        <el-input v-model="commission.sourceName" placeholder="请输入内容" disabled style="width: 200px" />
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg is-justify-center padding-top">
      <el-col style="text-align: right">商业险佣金：</el-col>
      <el-col style="text-align: left">
        <el-input v-model="commission.bizPercentage" placeholder="请输入内容" style="width: 200px" />
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg is-justify-center padding-top">
      <el-col style="text-align: right">商业险补贴：</el-col>
      <el-col style="text-align: left">
        <el-input v-model="commission.subsidy" placeholder="请输入内容" style="width: 200px" />
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg is-justify-center padding-top">
      <el-col style="text-align: right">交强险佣金：</el-col>
      <el-col style="text-align: left">
        <el-input v-model="commission.forcePercentage" placeholder="请输入内容" style="width: 200px" />
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg is-justify-center padding-top">
      <el-col style="text-align: right">一级提成：</el-col>
      <el-col style="text-align: left">
        <el-input v-model="commission.levelOne" placeholder="请输入内容" style="width: 200px" />
      </el-col>
    </el-row>
    <el-row type="flex" class="row-bg is-justify-center padding-top">
      <el-col style="text-align: right">二级提成：</el-col>
      <el-col style="text-align: left">
        <el-input v-model="commission.levelTwo" placeholder="请输入内容" style="width: 200px" />
      </el-col>
    </el-row>
   <!-- <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="80px" @keyup.enter.native="dataFormSubmit()">

      <el-form-item label="姓名" prop="userName">
        <el-input v-model="dataForm.userName" placeholder="登录帐号" />
      </el-form-item>
      <el-form-item label="账号" prop="loginName">
        <el-input v-model="dataForm.loginName" placeholder="登录帐号" />
      </el-form-item>
      <el-form-item label="密码" prop="loginPwd" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.loginPwd" type="password" placeholder="密码" />
      </el-form-item>
      <el-form-item label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }">
        <el-input v-model="dataForm.comfirmPassword" type="password" placeholder="确认密码" />
      </el-form-item>
      &lt;!&ndash;      <el-form-item label="邮箱" prop="email">
        <el-input v-model="dataForm.email" placeholder="邮箱"></el-input>
      </el-form-item>&ndash;&gt;
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="dataForm.mobile" placeholder="手机号" />
      </el-form-item>
      &lt;!&ndash;<el-form-item label="角色" size="mini" prop="roleIdList">
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>&ndash;&gt;
      <el-form-item label="状态" size="mini" prop="status">
        <el-radio-group v-model="dataForm.accountState">
          <el-radio :label="0">禁用</el-radio>
          <el-radio :label="1">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
 -->   <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { updateCommission } from '../../../api/userApi'

export default {
  data() {
    return {
      visible: false,
      roleList: [],
      commission: {
        bizPercentage: '',
        source: '',
        forcePercentage: '',
        levelOne: '',
        levelTwo: '',
        subsidy:''
      },
      updateStat: false
    }
  },
  methods: {
    init(e) {
      this.commission = e
      switch (this.commission.source) {
        case '1':
          this.commission.sourceName = '太平洋保险'
          break
        case '2':
          this.commission.sourceName = '平安保险'
          break
        case '4':
          this.commission.sourceName = '人保保险'
          break
      }
      this.visible = true
      console.log(this.visible)
    },
    // 表单提交
    dataFormSubmit() {
      const user = JSON.parse(this.$store.getters.user)
      this.visible = false
      const param = this.commission
      param.updateBy = user.id
      delete param.createTime
      delete param.updateTime
      delete param.source
      console.log(param)
      updateCommission(param).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$notify({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('refreshList')
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
<style>
  .padding-top{
    height: 2.5rem;
    line-height: 2.5rem;
  }
</style>
