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
            <el-input v-model="queryForm.userName" :placeholder="queryForm.type==0?'车牌号':'创建人'" clearable/>
          </el-form-item>
          <el-form-item label="选择查询日期：">
            <el-date-picker
              v-model="queryForm.createTime"
              :picker-options="pickerOptions"
              type="daterange"
              align="right"
              unlink-panels
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="toQuery">查询</el-button>
            <!--        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
            <!--            <el-button :disabled="dataListSelections.length <= 0" type="danger" @click="deleteHandle()">批量删除</el-button>-->
          </el-form-item>
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="全部" name="9"/>
            <el-tab-pane label="待支付" name="0"/>
            <el-tab-pane label="已承保" name="1"/>
            <el-tab-pane label="已取消" name="2"/>
            <el-tab-pane label="已过期" name="3"/>
          </el-tabs>
        </el-form>
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          style="width: 100%;"
          @selection-change="selectionChangeHandle"
        >
          <!--  <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />-->
          <el-table-column
            type="index"
            width="50"
            label="ID"
            align="center"
          />
          <el-table-column
            prop="loginName"
            header-align="center"
            align="center"
            label="创建时间"
            width="150"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="user_name"
            header-align="center"
            align="center"
            label="创建人"
          />

          <el-table-column
            prop="car_number"
            header-align="center"
            align="center"
            width="100"
            label="车牌号"
          />
          <el-table-column
            prop="brand_model"
            header-align="center"
            align="center"
            label="车型"
            show-overflow-tooltip="true"
          />
          <el-table-column
            prop="license_owner"
            header-align="center"
            align="center"
            label="投保人"
            show-overflow-tooltip="true"
          />
          <el-table-column
            :formatter="sourceName"
            prop="quote_insurance_name"
            header-align="center"
            align="center"
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
            prop="pay_money"
            header-align="center"
            align="center"
            label="订单总额"
          />
          <el-table-column
            prop="pay_status"
            header-align="center"
            align="center"
            label="订单状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.pay_status === 0" size="small" type="success" >待支付</el-tag>
              <el-tag v-else-if="scope.row.pay_status === 1" size="small">已支付</el-tag>
              <el-tag v-else-if="scope.row.pay_status === 2" type="danger" size="small">已取消</el-tag>
              <el-tag v-else size="small" type="warning">已过期</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="payment"
            header-align="center"
            align="center"
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
            width="150"
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
            label="操作"
          >

            <template slot-scope="scope">
              <el-button type="primary" class="el-icon-view" size="small" @click="getOrderDetail(scope.row.order_id)"/>
              <!--  <el-popover
                  :ref="scope.row.order_id"
                  placement="top"
                  width="160">
                  <p>确定删除吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.order_id].doClose()">取消</el-button>
                    <el-button type="primary" size="mini" @click="deleteAdmin(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="visible=true"/>
                </el-popover>-->
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
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrderListByAdmin } from '../../../api/userApi'

export default {
  components: {},
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一年',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
            picker.$emit('pick', [start, end])
          }
        }
        ]
      },
      queryForm: {
        type: '',
        userName: '',
        createTime: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      activeName: '9',
      rule: {
        type: [
          { required: true, message: '必选', trigger: 'blur' }
        ],
        userName:
                        [{ required: true, message: '必填', trigger: 'blur' }
                        ]
      },
      array: [
        { id: 0, name: '车牌号' },
        { id: 1, name: '创建人' }
      ]
    }
  },
  activated() {
    this.getOrderList()
  },
  created() {
    this.getOrderList(this.activeName)
  },
  methods: {
    toQuery() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      if (this.queryForm.type === 0) {
        params.carNumber = this.queryForm.userName
      } else {
        params.userName = this.queryForm.userName
      }
      if (this.queryForm.createTime != '') {
        params.createTime = JSON.stringify(this.queryForm.createTime)
      }
      getOrderListByAdmin(params).then(res => {
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
    getOrderDetail(e) {
      this.$router.push({ path: '/orderDetail', query: { order_id: e }})
    },
    getOrderList(e) {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize,
        payStatus: e
      }
      getOrderListByAdmin(params).then(res => {
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
      this.getOrderList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getOrderList()
    },
    handleClick(tab, event) {
      this.getOrderList(tab.name)
    },
    sourceName(row, column, cellValue, index) {
      console.log(row)
      if (row.quote_source === '1') {
        return '太保'
      } else if (row.quote_source === '2') {
        return '人保'
      } else if (row.quote_source === '4') {
        return '平安'
      }
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
      }).catch(() => {
      })
    }
  }
}
</script>
