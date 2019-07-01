<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.userName" placeholder="用户名" clearable />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">查询</el-button>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">批量删除</el-button>
      </el-form-item>
    </el-form>-->
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          style="width: 100%;"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column
            type="index"
            width="50"
            label="ID"
          />
          <el-table-column
            prop="source"
            header-align="center"
            align="center"
            label="保险公司"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.source==1" size="small">太平洋</el-tag>
              <el-tag v-if="scope.row.source==2" size="small">平安</el-tag>
              <el-tag v-if="scope.row.source==4" size="small">人保</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="bizPercentage"
            header-align="center"
            align="center"
            label="商业险佣金"
          />
          <el-table-column
            prop="subsidy"
            header-align="center"
            align="center"
            label="商业险补贴"
          />
          <el-table-column
            prop="forcePercentage"
            header-align="center"
            align="center"
            label="交强险佣金"
          />
          <el-table-column
            prop="levelOne"
            header-align="center"
            align="center"
            label="一级提成"
          />
          <el-table-column
            prop="levelTwo"
            header-align="center"
            align="center"
            label="二级提成"
          />
          <el-table-column
            prop="updateTime"
            header-align="center"
            align="center"
            width="180"
            label="修改时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.updateTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            width="180"
            label="修改人"
          />
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button type="primary" size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row)"/>
            </template>
          </el-table-column>
        </el-table>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshList="getCommissionList" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { commissionList, deleteUser } from '../../../api/userApi'
import addOrUpdate from './add-or-update'
export default {
  components: {
    addOrUpdate
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
    this.getCommissionList()
  },
  created() {
    this.getCommissionList()
  },
  methods: {
    getCommissionList() {
      this.dataListLoading = true
      const params = {
      }
      commissionList(params).then(res => {
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
        return item.accountId
      })
      console.log(id)
      console.log(userIds)
      this.$confirm(`确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          accountId: userIds.join(','),
          status: 1
        }
        deleteUser(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getUserList()
          } else {
            this.$message.error(res.data)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
