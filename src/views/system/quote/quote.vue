<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">

        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
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
              <el-input v-model="queryForm.userName" :placeholder="queryForm.type==0?'报价人':'车牌号'" clearable />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="toQuery">查询</el-button>
            </el-form-item>
          </el-form>
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
            prop="carNumber"
            header-align="center"
            align="center"
            label="车牌号"
          />
          <el-table-column
            prop="frameNumber"
            header-align="center"
            align="center"
            label="车架号"
            width="120"
          />
          <el-table-column
            prop="userName"
            header-align="center"
            align="center"
            label="报价人"
          />
          <el-table-column
            prop="userName"
            header-align="center"
            align="center"
            label="上年投保"
          >
            <template slot-scope="scope">
              {{ scope.row.insuredInfo!=null?scope.row.insuredInfo.lastYearInsuranceCompany:'' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="保险公司"
            width="100"
          >
            <template slot-scope="scope">
              <p v-for="item in scope.row.quoteInfoList">{{ item.quoteInsuranceName }}</p>
            </template>
          </el-table-column>
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="报价状态"
          >
            <template slot-scope="scope">
              <p v-for="item in scope.row.quoteInfoList">
                <el-tag v-if="item.quoteStatus==1" size="small">报价成功</el-tag>
                <el-tag v-else size="small" type="danger">报价失败</el-tag>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="invitecode"
            header-align="center"
            align="center"
            label="核保状态"
          >
            <template slot-scope="scope">
              <p v-for="item in scope.row.quoteInfoList">
                <el-tag v-if="item.submitStatus==1" size="small">报价成功</el-tag>
                <el-tag v-else size="small" type="danger">报价失败</el-tag>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            prop="brandModel"
            header-align="center"
            align="center"
            label="品牌型号"
            show-overflow-tooltip="true"
          />
          <el-table-column
            prop="registerDate"
            header-align="center"
            align="center"
            label="注册日期"
            width="90"
          />
          <el-table-column
            prop="createdTime"
            header-align="center"
            align="center"
            width="180"
            label="创建时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.createdTime) }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="80"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" class="el-icon-view" size="small" @click="getQuoteDetail(scope.row.carInfoId)"/>
              <!--<el-popover
                :ref="scope.row.carInfoId"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.carInfoId].doClose()">取消</el-button>
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
        <!--  <el-dialog :visible.sync="dialogVisible" title="报价详情" append-to-body top="0" width="1000px">
          <div>
            <el-tabs v-model="activeName" tab-position="left" @tab-click="handleClick">
              <el-tab-pane label="车辆信息" name="first">
                <el-row type="flex" class="row-bg">
                  <el-col :span="6">车牌号：{{map.carInfo.carNumber}}</el-col>
                  <el-col :span="5">发动机号：{{map.carInfo.engineNumber}}</el-col>
                  <el-col :span="7">车架号：{{map.carInfo.frameNumber}}</el-col>
                  <el-col :span="6">注册日期：{{map.carInfo.registerDate}}</el-col>
                </el-row>
                <el-row type="flex" class="row-bg">
                  <el-col :span="6">品牌型号：{{map.carInfo.brandModel}}</el-col>
                  <el-col :span="5">发动机号：{{map.carInfo.engineNumber}}</el-col>
                  <el-col :span="7">车架号：{{map.carInfo.frameNumber}}</el-col>
                  <el-col :span="6">注册日期：{{map.carInfo.registerDate}}</el-col>
                </el-row>
              </el-tab-pane>
              <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
              <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
              <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
            </el-tabs>

          </div>
        </el-dialog>
     -->   <!-- 弹窗, 新增 / 修改 -->
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getCarInfoQuote, quoteDetails } from '../../../api/userApi'
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
      addOrUpdateVisible: false,
      dialogVisible: false,
      activeName: 'first',
      map: {},
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
      array: [
        { id: 0, name: '报价人' },
        { id: 1, name: '车牌号' }
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
    getQuoteDetail(e) {
      this.$router.push({ path: '/quoteDetail', query: { car_info_id: e }})
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    getUserList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize * 10
      }
      getCarInfoQuote(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.dataList = res.data.list
          this.totalPage = Math.ceil(res.data.total / 10)
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
