<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <!--<el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item>
            <el-input v-model="dataForm.userName" placeholder="用户名" clearable/>
          </el-form-item>
          <el-form-item>
            <el-button @click="toQuery()">查询</el-button>
            &lt;!&ndash;<el-button :disabled="dataListSelections.length <= 0" type="danger" @click="deleteHandle()">批量审核</el-button>&ndash;&gt;
          </el-form-item>
        </el-form>-->
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
            min-width="120"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.verified_stat == 1" size="small" type="success">待审核</el-tag>
              <el-tag v-if="scope.row.verified_stat == 2" size="small" type="danger">驳回</el-tag>
              <el-tag v-if="scope.row.verified_stat == 3" size="small">审核通过</el-tag>
            </template>
          </el-table-column>
          <!--          <el-table-column
            prop="verification_by"
            header-align="center"
            align="center"
            label="操作人"
          />-->
          <el-table-column
            prop="msg"
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
              <el-button :disabled="scope.row.verified_stat != 1" type="primary" size="small" @click="check(scope.row)"> 驳回
              </el-button>
              <el-button :disabled="scope.row.verified_stat != 1" type="primary" size="small" @click="checkAccountVerified(scope.row)"> 验证
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
      append-to-body
      title="提示"
      width="500px"
    >
      <el-row type="flex" justify="center" class="row-bg">
        <el-col>驳回原因：
          <el-select v-model="value" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
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
import { getWaitCheckList, updateAccountVerifiedStat, checkAccountVerified } from '../../../api/userApi'
import util from '../../../utils/similar'
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
      activeName: '9',
      options: [{
        value: '0',
        label: '身份证照片不清晰'
      }, {
        value: '1',
        label: '上传的不是身份证照片'
      }, {
        value: '2',
        label: '其它'
      }],
      value: ''
    }
  },
  created() {
    console.log(util.RandomNumBoth())
    this.getWaitCheckList(this.activeName)
  },
  methods: {
    checkAccountVerified(e) {
      const params = {
        id: e.id,
        backPath: e.back_path,
        frontPath: e.front_path,
        accountId: e.account_id,
        mobile: e.mobile
      }
      checkAccountVerified(params).then(res => {
        this.dialogVisible = false
        console.log(res)
        if (res.code === 200) {
          this.$notify({
            title: res.data,
            type: 'success'
          })
        } else {
          this.$notify({
            title: res.data,
            type: 'fail'
          })
        }
        this.getWaitCheckList(this.activeName)
      })
    },
    check(e) {
      this.dialogVisible = true
      this.map = e
      console.log(e)
    },
    getWaitCheckList(e) {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize,
        verifiedStat: e
      }
      getWaitCheckList(params).then(res => {
        if (res.code == 200) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].front_path = res.data.list[i].front_path + util.RandomNumBoth()
            res.data.list[i].back_path = res.data.list[i].back_path + util.RandomNumBoth()
          }
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
    updateStat() {
      console.log(this.value)
      console.log(this.options[this.value].label)
      const params = {
        accountId: this.map.account_id,
        verifiedStat: 2,
        id: this.map.id,
        msg: this.options[this.value].label
      }
      updateAccountVerifiedStat(params).then(res => {
        this.dialogVisible = false
        console.log(res)
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.getWaitCheckList(this.activeName)
        }
      })
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
