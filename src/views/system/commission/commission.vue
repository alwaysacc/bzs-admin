<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
          <el-form-item label="是否展示今日佣金：">
            <el-switch
              v-model="showTodayComm"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
              active-value="1"
              inactive-value="2"
              @change="updateValue"/>
          </el-form-item>
          <div style="display: inline-block;margin: 0px 2px;">
            <el-button
              class="filter-item"
              type="primary"
              icon="el-icon-plus"
              @click="showDialog">分佣规则设置
            </el-button>
          </div>
        </el-form>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="佣金设置" name="1">
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
                prop="insuranceBizPercentage"
                header-align="center"
                align="center"
                label="保司商业佣金"
              />
              <el-table-column
                prop="insuranceForcePercentage"
                header-align="center"
                align="center"
                label="保司交强佣金"
              />
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
          </el-tab-pane>
          <el-tab-pane label="历史佣金" name="2">
            <el-form ref="queryForm">
              <el-form-item>
                <el-button :disabled="dataListSelections.length <= 0" type="danger" @click="deleteHandle()">批量删除</el-button>
              </el-form-item>
            </el-form>
            <el-table
              v-loading="dataListLoading"
              :data="comList"
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
                prop="createTime"
                header-align="center"
                align="center"
                width="180"
                label="日期"
              >
                <template slot-scope="scope">
                  {{ util.formatDate(scope.row.createTime) }}
                </template>
              </el-table-column>
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
                prop="insuranceBizPercentage"
                header-align="center"
                align="center"
                label="保司商业佣金"
              />
              <el-table-column
                prop="insuranceForcePercentage"
                header-align="center"
                align="center"
                label="保司交强佣金"
              />
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
                fixed="right"
                header-align="center"
                align="center"
                width="150"
                label="操作"
              >
                <template slot-scope="scope">
                  <el-popover
                    :ref="scope.row.id"
                    placement="top"
                    width="160">
                    <p>确定删除吗？</p>
                    <div style="text-align: right; margin: 0">
                      <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                      <el-button type="primary" size="mini" @click="del(scope.row.id)">确定</el-button>
                    </div>
                    <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="visible=true"/>
                  </el-popover>
                </template>
              </el-table-column>
              <!--<el-table-column-->
              <!--fixed="right"-->
              <!--header-align="center"-->
              <!--align="center"-->
              <!--width="150"-->
              <!--label="操作"-->
              <!--&gt;-->
              <!--<template slot-scope="scope">-->
              <!--<el-button type="primary" size="small" icon="el-icon-edit" @click="addOrUpdateHandle(scope.row)"/>-->
              <!--</template>-->
              <!--</el-table-column>-->
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
          </el-tab-pane>
        </el-tabs>
        <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshList="getCommissionList"/>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogFormVisible" :append-to-body="true" title="分佣规则">
      <el-form :model="form">
        <el-form-item label="分佣规则">
          <el-input v-model="value" :value="value" :rows="5" type="textarea"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  commissionList,
  deleteUser,
  getCommissionListByDay,
  getShowToday,
  updateValue,
  getRole, deleteCommissionListByDay, deletesSomeCommissionListByDay
} from '../../../api/userApi'
import addOrUpdate from './add-or-update'

export default {
  components: {
    addOrUpdate
  },
  data() {
    return {
      activeName: '1',
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
      comList: '',
      showTodayComm: 1,
      dialogFormVisible: false,
      value: ''

    }
  },
  activated() {
    this.getCommissionList()
  },
  created() {
    this.getShowToday()
    this.getCommissionList()
  },
  methods: {
    del(e) {
      const params = {
        id: e
      }
      deleteCommissionListByDay(params).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.$refs[e].doClose()
          this.getCommissionListByDay()
        } else {
          this.$message.error(res.data)
        }
      })
    },
    getCommissionListByDay() {
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getCommissionListByDay(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.comList = res.data.list
          this.totalPage = res.data.total
        } else {
          this.comList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    getCommissionList() {
      this.dataListLoading = true
      const params = {}
      commissionList(params).then(res => {
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
    updateValue(e) {
      this.dataListLoading = true
      const params = {
        paramKey: 'showToday',
        paramValue: e
      }
      updateValue(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '失败',
            type: 'warning'
          })
        }
        this.dataListLoading = false
      })
    },
    updateRole(e) {
      this.dataListLoading = true
      const params = {
        paramKey: 'role',
        paramValue: this.value
      }
      updateValue(params).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '成功',
            type: 'success'
          })
        } else {
          this.$message({
            message: '失败',
            type: 'warning'
          })
        }
        this.dataListLoading = false
        this.dialogFormVisible = false
      })
    },
    getShowToday() {
      const params = {}
      getShowToday(params).then(res => {
        this.showTodayComm = res.data
        /* if (res.code === 200) {
                    } else {
                    }*/
      })
    },
    showDialog() {
      const params = {}
      getRole(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.value = res.data
        }
      })
      this.dialogFormVisible = true
    },
    handleClick(e) {
      if (e.name === '2') {
        console.log(e.name)
        this.getCommissionListByDay()
      } else {
        this.getCommissionList()
      }
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getCommissionListByDay()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getCommissionListByDay()
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
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          id: ids.join(',')
        }
        deletesSomeCommissionListByDay(params).then(res => {
          if (res.code === 200) {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.getCommissionListByDay()
          } else {
            this.$message.error(res.data)
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>
