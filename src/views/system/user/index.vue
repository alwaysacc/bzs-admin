<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--  <el-col :xs="7" :sm="6" :md="4" :lg="4" :xl="4">
        <div class="head-container">
          <el-input v-model="deptName" clearable placeholder="输入部门名称搜索" prefix-icon="el-icon-search" style="width: 100%;" class="filter-item" @input="getDeptDatas"/>
        </div>
        <el-tree :data="depts" :props="defaultProps" :expand-on-click-node="false" default-expand-all @node-click="handleNodeClick"/>
      </el-col>-->
      <el-col :xs="17" :sm="18" :md="24" :lg="24" :xl="24">
        <eHeader :query="query" :sup_this="sup_this" :dicts="dicts"/>
        <!--表格渲染-->
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
            prop="user_name1"
            header-align="center"
            align="center"
            label="上级"
          >
            <template slot-scope="scope">
              {{ scope.row.user_name1==null?'无上级':scope.row.user_name1 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="user_name2"
            header-align="center"
            align="center"
            label="上上级"
          >
            <template slot-scope="scope">
              {{ scope.row.user_name2==null?'无上上级':scope.row.user_name2 }}
            </template>
          </el-table-column>
          <el-table-column
            prop="login_name"
            header-align="center"
            align="center"
            label="账号"
            width="150"
          />
          <el-table-column
            prop="mobile"
            header-align="center"
            align="center"
            label="手机号"
            width="150"
          />
          <el-table-column
            prop="inviteCode"
            header-align="center"
            align="center"
            label="邀请码"
          />
          <!--  <el-table-column
            prop="superiorinvitecode"
            header-align="center"
            align="center"
            label="上级邀请码"
          >
            <template slot-scope="scope">
              {{ scope.row.superiorinvitecode==''?'无上级':scope.row.superiorinvitecode }}
            </template>
          </el-table-column>-->
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.accountState === '1'" size="small" type="danger">禁用</el-tag>
              <el-tag v-else size="small">正常</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="CREATED_TIME"
            header-align="center"
            align="center"
            width="180"
            label="最近登录时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.login_time) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="CREATED_TIME"
            header-align="center"
            align="center"
            width="180"
            label="创建时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.CREATED_TIME) }}
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作"
          >
            <!--            <template slot-scope="scope">
              <edit :dicts="dicts" :data="scope.row" :sup_this="sup_this"/>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
              </el-popover>
            </template>-->
            <template slot-scope="scope">
              <!--  <edit :dicts="dicts" :data="scope.row" :sup_this="sup_this"/>-->
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row)">修改</el-button>
              <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.userId)">删除</el-button>
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
        <!--<el-table v-loading="loading" :data="data" size="small" style="width: 100%;">
          <el-table-column
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column prop="username" label="用户名"/>
          <el-table-column prop="phone" label="电话"/>
          <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱"/>
          <el-table-column label="部门 / 岗位">
            <template slot-scope="scope">
              <div>{{ scope.row.dept.name }} / {{ scope.row.job.name }}</div>
            </template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <div v-for="item in dicts" :key="item.id">
                <el-tag v-if="scope.row.enabled.toString() === item.value" :type="scope.row.enabled ? '' : 'info'">{{ item.label }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" prop="createTime" label="创建日期">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime) }}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="checkPermission(['ADMIN','USER_ALL','USER_EDIT','USER_DELETE'])" label="操作" width="125" align="center">
            <template slot-scope="scope">
              <edit v-permission="['ADMIN','USER_ALL','USER_EDIT']" :dicts="dicts" :data="scope.row" :sup_this="sup_this"/>
              <el-popover
                v-permission="['ADMIN','USER_ALL','USER_DELETE']"
                :ref="scope.row.id"
                placement="top"
                width="180">
                <p>确定删除本条数据吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
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
          @size-change="sizeChange"
          @current-change="pageChange"
        />-->
        <!--分页组件-->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getUserList, deleteUser } from '../../../api/userApi'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/user'
import { getDepts } from '@/api/dept'
import { parseTime } from '@/utils/index'
import eHeader from './module/header'
import edit from './module/edit'
export default {
  components: { eHeader, edit },
  mixins: [initData, initDict],
  data() {
    return {
      height: document.documentElement.clientHeight - 180 + 'px;',
      delLoading: false, sup_this: this, deptName: '', depts: [], deptId: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: []
    }
  },
  created() {
    this.getUserList()
    /*    this.getDeptDatas()
    this.$nextTick(() => {
      this.init()
      // 加载数据字典
      this.getDict('user_status')
    })*/
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    getUserList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getUserList(params).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.dataList = res.data.list
          this.totalPage = res.data.total
        } else {
          this.data = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = '/account/info/list'
      const sort = 'id,desc'
      const query = this.query
      const type = query.type
      const value = query.value
      const enabled = query.enabled
      this.params = { page: this.page, size: this.size }
      if (type && value) { this.params[type] = value }
      if (enabled !== '' && enabled !== null) { this.params['enabled'] = enabled }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        this.$notify({
          title: '删除成功',
          type: 'success',
          duration: 2500
        })
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.response.data.message)
      })
    },
    getDeptDatas() {
      const sort = 'id,desc'
      const params = { sort: sort }
      if (this.deptName) { params['name'] = this.deptName }
      getDepts(params).then(res => {
        this.depts = res.content
      })
    },
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.deptId = null
      } else {
        this.deptId = data.id
      }
      this.init()
    }
  }
}
</script>

<style scoped>
</style>
