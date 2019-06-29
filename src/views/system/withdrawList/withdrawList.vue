<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-select v-model="dataForm.userName" filterable placeholder="选择用户">
              <el-option
                v-for="item in userNameList"
                :key="item.account_id"
                :label="item.user_name"
                :value="item.account_id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="dataForm.type" filterable placeholder="选择类型">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getDrawCashList()">查询</el-button>
          </el-form-item>
        </el-form>
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          style="width: 100%;"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column
            fixed="left"
            type="index"
            width="40"
            label="ID"
          />
          <el-table-column
            fixed="left"
            prop="user_name"
            header-align="center"
            align="center"
            label="姓名"
            width="80"
          />
          <el-table-column
            prop="verification_by"
            header-align="center"
            align="center"
            label="支付时间"
            width="160"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="car_number"
            header-align="center"
            align="left"
            width="200"
            label="保单号"
          >
            <template slot-scope="scope">
              <el-tag size="mini">商</el-tag>{{ scope.row.biz_no }}<br>
              <el-tag size="mini">交</el-tag> {{ scope.row.force_no }}
            </template>
          </el-table-column>
          <el-table-column
            prop="car_number"
            header-align="center"
            align="center"
            label="车牌号"
          />
          <el-table-column
            prop="car_number"
            header-align="center"
            align="center"
            label="车主"
          />
          <el-table-column
            prop="quote_insurance_name"
            header-align="center"
            align="center"
            width="100"
            label="投保公司"
          />
          <el-table-column
            prop="biz_total"
            header-align="center"
            align="center"
            width="100"
            label="商业险保费"
          />
          <el-table-column
            prop="force_total"
            header-align="center"
            align="center"
            width="100"
            label="交强险保费"
          />
          <el-table-column
            prop="tax_total"
            header-align="center"
            align="center"
            label="车船税"
          />
          <el-table-column
            prop="total"
            header-align="center"
            align="center"
            label="总额"
          />
          <el-table-column
            prop="biz_cash"
            header-align="center"
            align="center"
            empty-text="无"
            label="商业险佣金"
          />
          <el-table-column
            prop="force_cash"
            header-align="center"
            align="center"
            empty-text="无"
            label="交强险佣金"
          />
          <el-table-column
            prop="invitecode"
            header-align="center"
            align="center"
            empty-text="无"
            label="佣金总额"
          >
            <template slot-scope="scope">
              {{ (Number(scope.row.biz_cash)+ Number(scope.row.force_cash )).toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="cash"
            header-align="center"
            align="center"
            empty-text="无"
            label="提成"
          />
          <el-table-column
            prop=""
            header-align="center"
            align="center"
            empty-text="无"
            label="保司保费"
          />
          <!--          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="打款状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isPay === '0'" size="small" type="danger">未打款</el-tag>
              <el-tag v-else size="small">已打款</el-tag>
            </template>
          </el-table-column>-->
          <!-- <el-table-column
        prop="createdTime"
        header-align="center"
        align="center"
        width="180"
        label="备注"
      />-->
          <!-- <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="180"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button :disabled="scope.row.status != '0'" type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">
                {{ scope.row.status != '0'?'已审核':'审核' }}
              </el-button>
              <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">打款</el-button>
            </template>
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
        </el-col >
      </el-row>
      <el-row type="flex" justify="center" class="row-bg">
        <el-col span="8">
          提现方式：
          <a v-if="map.status==0">支付宝</a>
          <a v-if="map.status==1">微信</a>
          <a v-if="map.status==2">银行卡</a>
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
      <el-row v-if="status!=0" type="flex" justify="center" class="row-bg">
        <el-col span="16">
          是否打款：&nbsp;
          <el-radio v-model="status" label="3">是</el-radio>
          <el-radio v-model="status" label="5">否</el-radio>
        </el-col>
      </el-row>
      <el-row v-if="status==0" type="flex" justify="center" class="row-bg">
        <el-col span="16">
          选择审核状态：&nbsp;
          <el-radio v-model="status" label="1">通过</el-radio>
          <el-radio v-model="status" label="2">驳回</el-radio>
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
import { getDrawCashList, getUserNameList } from '../../../api/userApi'
export default {
  components: {
  },
  data() {
    return {
      dialogVisible: false,
      status: '1',
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
      userNameList: {},
      typeList: [
        { id: 0, name: '佣金' },
        { id: 1, name: '提成' }
      ]
    }
  },
  created() {
    this.getDrawCashList()
    this.getUserNameList()
  },
  methods: {
    getUserNameList() {
      getUserNameList('').then(res => {
        this.userNameList = res.data
        console.log(res)
      })
    },
    getDrawCashList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize,
        incomePerson: this.dataForm.userName
      }
      getDrawCashList(params).then(res => {
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
      this.getDrawCashList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDrawCashList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
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
      if (this.status === '5') {
        console.log(111)
        this.dialogVisible = false
      } else {
        const user = JSON.parse(this.$store.getters.user)
        console.log(user)
        this.dialogVisible = false
        const params = {
          id: this.id,
          status: this.status,
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
      }
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
<style>
  .el-row {
    margin-bottom: 20px;
  &:last-child {
     margin-bottom: 0;
   }
  }
  .el-col {
    border-radius: 4px;
  }
</style>
