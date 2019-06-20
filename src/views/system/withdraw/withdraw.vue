<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="17" :sm="18" :md="24" :lg="24" :xl="24">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.userName" placeholder="用户名" clearable />
          </el-form-item>
          <el-form-item>
            <el-button @click="getDataList()">查询</el-button>
            <el-button :disabled="dataListSelections.length <= 0" type="danger" @click="deleteHandle()">批量审核</el-button>
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
            label="姓名"
          />
          <el-table-column
            prop="money"
            header-align="center"
            align="center"
            label="提现金额"
          />
          <el-table-column
            prop="type"
            header-align="center"
            align="center"
            label="提现方式"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type === 0" size="small">支付宝</el-tag>
              <el-tag v-else-if="scope.row.type === 1" size="small">微信</el-tag>
              <el-tag v-else size="small">银行卡</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="invitecode"
            header-align="center"
            align="center"
            width="160"
            label="申请时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="审核状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === '0'" size="small" type="danger">待审核</el-tag>
              <el-tag v-else-if="scope.row.status === '1'" size="small">通过</el-tag>
              <el-tag v-else size="small" type="danger">驳回</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="createdTime"
            header-align="center"
            align="center"
            width="180"
            label="审核时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.verification_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="verification_by"
            header-align="center"
            align="center"
            label="操作人"
          />

          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="打款状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.accountState === '0'" size="small" type="danger">禁用</el-tag>
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <!-- <el-table-column
        prop="createdTime"
        header-align="center"
        align="center"
        width="180"
        label="备注"
      />-->
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" @click="addOrUpdateHandle(scope.row.id)">审核</el-button>
              <!-- <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">查看</el-button>-->
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

        <el-dialog
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          append-to-body
          title="提示"
          width="300px"
        >
          选择审核状态
          <el-radio v-model="status" label="1">通过</el-radio>
          <el-radio v-model="status" label="2">驳回</el-radio>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateStat">确 定</el-button>
          </span>
        </el-dialog>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getListByAdmin, updateVerificationStatus } from '../../../api/userApi'
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
      id: ''
    }
  },
  activated() {
    this.getListByAdmin()
  },
  created() {
    this.getListByAdmin()
  },
  methods: {
    getListByAdmin() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getListByAdmin(params).then(res => {
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
      this.getListByAdmin()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getListByAdmin()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(e) {
      this.id = e
      this.dialogVisible = true
    },
    updateStat() {
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
    },
    // 删除
    deleteHandle(id) {
      var userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.dialogVisible = true
      this.id=userIds.join(',')
    }
  }
}
</script>
