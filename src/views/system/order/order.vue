<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.userName" placeholder="车牌号" clearable />
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <!--        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
            <el-button :disabled="dataListSelections.length <= 0" type="danger" @click="deleteHandle()">批量删除</el-button>
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
            prop="user_name"
            header-align="center"
            align="center"
            label="创建人"
          />
          <el-table-column
            prop="loginName"
            header-align="center"
            align="center"
            label="创建时间"
            width="160"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="car_number"
            header-align="center"
            align="center"
            width="100"
            label="车牌号"
          />
          <el-table-column
            prop="quote_insurance_name"
            header-align="center"
            align="center"
            label="投保公司"
          />
          <el-table-column
            prop="pay_money"
            header-align="center"
            align="center"
            label="订单金额"
          />
          <el-table-column
            prop="pay_status"
            header-align="center"
            align="center"
            label="订单状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pay_status === 0" size="small" type="danger">待支付</el-tag>
              <el-tag v-else-if="scope.row.pay_status === 1" size="small">已支付</el-tag>
              <el-tag v-else-if="scope.row.pay_status === 2" size="small">已取消</el-tag>
              <el-tag v-else size="small">已过期</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="payment"
            header-align="center"
            align="center"
            width="180"
            label="支付方式"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.payment === '1'" size="small">支付宝</el-tag>
              <el-tag v-else-if="scope.row.payment === '2'" size="small">微信</el-tag>
              <el-tag v-else-if="scope.row.payment === '3'" size="small">pos机</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="finish_time"
            header-align="center"
            align="center"
            width="180"
            label="完成时间"
          >
            <template slot-scope="scope">
              {{ scope.row.finish_time!=null?util.formatDate(scope.row.finish_time):'' }}
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
              <el-button type="primary" class="el-icon-view" size="small" @click="getOrderDetail(scope.row.order_id)"/>
              <el-popover
                :ref="scope.row.order_id"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.order_id].doClose()">取消</el-button>
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
        <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrderList } from '../../../api/userApi'
export default {
  components: {
  },
  data() {
    return {
      dataForm: {
        userName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  activated() {
    this.getOrderList()
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderDetail(e){
      this.$router.push({ path: '/orderDetail', query: { order_id: e }})
    },
    getOrderList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getOrderList(params).then(res => {
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
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/user/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'username': this.dataForm.userName
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.totalCount
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
      this.getOrderList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getOrderList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(e) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(e)
      })
    },
    // 删除
    deleteHandle(id) {
      var userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.userId
      })
      this.$confirm(`确定对[id=${userIds.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/user/delete'),
          method: 'post',
          data: this.$http.adornData(userIds, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
                this.getDataList()
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
