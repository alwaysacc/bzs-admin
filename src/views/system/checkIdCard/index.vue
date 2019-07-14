<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.userName" placeholder="用户名" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button @click="toQuery()">查询</el-button>
            <!--<el-button :disabled="dataListSelections.length <= 0" type="danger" @click="deleteHandle()">批量审核</el-button>-->
          </el-form-item>
        </el-form>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="全部" name="9"/>
          <el-tab-pane label="待审核" name="1"/>
          <el-tab-pane label="已审核" name="2"/>
        </el-tabs>
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          style="width: 100%;"
          @selection-change="selectionChangeHandle"
        >
          <!--<el-table-column-->
          <!--type="selection"-->
          <!--header-align="center"-->
          <!--align="center"-->
          <!--width="50"-->
          <!--/>-->
          <el-table-column
            type="index"
            width="50"
            label="ID"
          />
          <el-table-column
            prop="user_name"
            header-align="center"
            align="center"
            label="姓名"
          />
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="手机号"
            min-width="120"
          />
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            min-width="160"
            label="提交日期"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="invitecode"
            header-align="center"
            align="center"
            min-width="160"
            label="正面"
          >
            <template slot-scope="scope">
              <img :src="scope.row.front_path" min-width="70" height="70">
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="背面"
            min-width="160"
          >
            <template slot-scope="scope">
              <img :src="scope.row.back_path" min-width="70" height="70">
            </template>
          </el-table-column>
          <el-table-column
            prop="createdTime"
            header-align="center"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.verified_stat == 1" size="small" type="danger">待审核</el-tag>
              <el-tag v-else size="small">审核通过</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="verification_by"
            header-align="center"
            align="center"
            label="操作人"
          />
          <el-table-column
            prop="createdTime"
            header-align="center"
            align="center"
            width="180"
            label="信息"
          />
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="180"
            label="操作"
          >
            <template slot-scope="scope">
              <!--<el-button :disabled="scope.row.status != '1'" type="primary" size="small" @click="pay(scope.row.id)"> 审核-->
              <el-button  type="primary" size="small" @click="pay(scope.row.id)"> 审核
              </el-button>
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
    <el-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      append-to-body
      title="提示"
      width="500px"
    >
      <el-row type="flex" justify="center" class="row-bg">
        <el-col span="8">申请人：{{ map.user_name }}
        </el-col>
        <el-col span="8">
          当前余额：{{ map.balance_total+Number(map.money ) }}元
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="row-bg">
        <el-col span="8">
          申请金额：{{ map.money }}元
        </el-col>
        <el-col span="8">
          提现后余额：{{ map.balance_total }}元
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="row-bg">
        <el-col span="8">
          提现方式：
          <a v-if="map.type==0">支付宝</a>
          <a v-if="map.type==1">微信</a>
          <a v-if="map.type==2">银行卡</a>
        </el-col>
        <el-col span="8">
          提现账户：{{ map.amount }}
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" class="row-bg">
        <el-col span="8">
          账号姓名：{{ map.name }}
        </el-col>
        <el-col span="8"/>
      </el-row>
      <el-row v-if="stat" type="flex" justify="center" class="row-bg">
        <el-col span="16">
          是否打款：&nbsp;
          <el-radio v-model="map.isPay" label="1">是</el-radio>
          <el-radio v-model="map.isPay" label="0">否</el-radio>
        </el-col>
      </el-row>
      <el-row v-if="!stat" type="flex" justify="center" class="row-bg">
        <el-col span="16">
          选择审核状态：&nbsp;
          <el-radio v-model="map.status" label="1">通过</el-radio>
          <el-radio v-model="map.status" label="2">驳回</el-radio>
        </el-col>
      </el-row>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateStat">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { getWaitCheckList } from '../../../api/userApi'

export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      status: '',
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
      id: '',
      map: '',
      stat: false,
      activeName: '9'
    }
  },
  created() {
    this.getWaitCheckList(this.activeName)
  },
  methods: {
    getWaitCheckList(e) {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize,
        verifiedStat: e
      }
      getWaitCheckList(params).then(res => {
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
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getWaitCheckList(this.activeName)
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getWaitCheckList(this.activeName)
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    pay(e) {
      this.stat = true
      const params = {
        id: e
      }
      getVeriftcationDetail(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.map = res.data
        }
      })
      this.id = e
      this.dialogVisible = true
    },
    addOrUpdateHandle(e) {
      const params = {
        id: e
      }
      getVeriftcationDetail(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.map = res.data
        }
      })
      this.id = e
      this.dialogVisible = true
    },
    updateStat() {
      const user = JSON.parse(this.$store.getters.user)
      /*      if (this.stat) {
        this.dialogVisible = false
        const params = {
          id: this.id,
          isPay: this.map.isPay,
          userName: user.name
        }
        updateVerificationStatus(params).then(res => {
          console.log(res)
          if (res.code == 200) {
            this.$notify({
              title: '操作成功',
              type: 'success'
            })
            this.getListByAdmin()
          } else {
            this.$message({
              message: res.message
            })
            this.getListByAdmin()
          }
          this.dataListLoading = false
        })
      } else {*/
      console.log(user)
      this.dialogVisible = false
      const params = {
        id: this.id,
        isPay: this.map.isPay,
        status: this.map.status,
        userName: user.name
      }
      updateVerificationStatus(params).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.getListByAdmin()
        } else {
          this.$message({
            message: res.message
          })
          this.getListByAdmin()
        }
        this.dataListLoading = false
      })
      // }
    },
    handleClick(tab, event) {
      this.getWaitCheckList(tab.name)
    },
    // 删除
    deleteHandle(id) {
      var userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.dialogVisible = true
      this.id = userIds.join(',')
    }
  }
}
</script>
<style scoped>
  .row-bg {
    margin-bottom: 20px;

  &
  :last-child {
    margin-bottom: 0;
  }

  }
  .row-bg .el-col {
    border-radius: 4px;
  }
</style>
