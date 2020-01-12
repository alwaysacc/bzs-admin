<template>
  <div class="app-container">
    <div class="head-container">
      <!-- 搜索 -->
      <!--  <el-input v-model="query.value" clearable placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
 -->     <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-form :inline="true">
          <el-button
            class="filter-item"
            type="primary"
            @click="addRole">客服电话设置
          </el-button>
          <el-button
            class="filter-item"
            type="primary"
            @click="setAbout">关于我们设置
          </el-button>
          <el-button
            class="filter-item"
            type="primary"
            @click="setProblem">常见问题设置
          </el-button>
          <el-form-item label="是否展示保险优惠">
            <el-switch
              v-model="showResult"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
              active-value="1"
              inactive-value="2"
              @change="updateValue"/>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog :visible.sync="dialog" title="客服电话设置" append-to-body width="500px" style="height: 100%" height="100%">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="电话号码" prop="content">
            <el-input v-model="form.content" style="width: 370px;" rows="6"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialog=false">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialog2" title="关于我们设置" append-to-body width="500px" style="height: 100%" height="100%">
        <el-form ref="form2" :model="form2" :rules="rules2" size="small" label-width="80px">
          <el-form-item label="内容" prop="content">
            <el-input v-model="form2.content" style="width: 370px;" rows="6" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialog2=false">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doSubmit2">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialog3" title="常见问题设置" append-to-body width="500px" style="height: 100%" height="100%">
        <el-form ref="form3" :model="form3" :rules="rules3" size="small" label-width="80px">
          <el-form-item label="内容" prop="content">
            <el-input v-model="form3.content" style="width: 370px;" rows="6" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialog3=false">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doSubmit3">确认</el-button>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="dialog4" title="回复反馈" append-to-body width="500px" style="height: 100%" height="100%">
        <el-form ref="form4" :model="form4" :rules="rules4" size="small" label-width="80px">

          <el-form-item label="标题" prop="content">
            <div v-html="form4.title"/>
            <!--            <el-input v-model="form4.title" style="width: 370px;" rows="6" type="textarea"/>-->
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <div v-html="form4.content"/>
          </el-form-item>
          <el-form-item label="姓名" prop="content">
            <div v-html="form4.name"/>
          </el-form-item>
          <el-form-item label="联系方式" prop="content">
            <div v-html="form4.tel"/>
          </el-form-item>
          <el-form-item label="回复内容" prop="replyContent">
            <el-input v-model="form4.replyContent" style="width: 370px;" rows="6" type="textarea"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="dialog4=false">取消</el-button>
          <el-button :loading="loading" type="primary" @click="doSubmit4">确认</el-button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialog5" title="查看详情" append-to-body width="500px" style="height: 100%" height="100%">
        <el-form ref="form4" size="small" label-width="80px">
          <el-form-item label="标题" prop="content">
            <div v-html="form4.title"/>
            <!--            <el-input v-model="form4.title" style="width: 370px;" rows="6" type="textarea"/>-->
          </el-form-item>
          <el-form-item label="内容" prop="content">
            <div v-html="form4.content"/>
          </el-form-item>
          <el-form-item label="姓名" prop="content">
            <div v-html="form4.name"/>
          </el-form-item>
          <el-form-item label="联系方式" prop="content">
            <div v-html="form4.tel"/>
          </el-form-item>
          <el-form-item label="回复内容" prop="replyContent">
            <div v-html="form4.replyContent"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="loading" type="danger" @click="dialog5=false">关闭</el-button>
        </div>
      </el-dialog>
    </div>
    <el-row :gutter="15">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          size="mini"
          border
          style="width: 100%;"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column
            type="index"
            width="50"
            align="center"
            label="ID"
          />
          <el-table-column
            prop="content"
            header-align="center"
            align="center"
            label="标题"
          />
          <el-table-column
            prop="content"
            header-align="center"
            align="center"
            label="反馈内容"
          />
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="姓名"
          />
          <el-table-column
            prop="tel"
            header-align="center"
            align="center"
            label="联系方式"
          />
          <el-table-column
            prop="user_name"
            width="150"
            header-align="center"
            align="center"
            label="反馈人"
          />
          <el-table-column
            prop="createTime"
            width="150"
            header-align="center"
            align="center"
            label="反馈时间"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="pay_status"
            header-align="center"
            align="center"
            label="订单状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status === 0" size="small" type="warning">待回复</el-tag>
              <el-tag v-else-if="scope.row.status === 1" size="small">已回复</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="200"
            label="操作"
          >
            <template slot-scope="scope">

              <el-button
                v-if="scope.row.status === 0"
                slot="reference"
                type="primary"
                icon="el-icon-edit-outline"
                size="small"
                @click="showDialg(scope.row)"/>
              <el-button
                v-else
                slot="reference"
                type="primary"
                icon="el-icon-view"
                size="small"
                @click="seeDetail(scope.row)"/>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteFeedback(scope.row.id)">确定</el-button>
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
      </el-col>
      <!-- 授权 -->
    </el-row>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import {
  getFeedbackList, deleteFeedback,
  updateValue, sysDetail, updateFeedback
} from '../../../api/userApi'

export default {
  // components: { eHeader, edit },
  mixins: [initData],
  data() {
    return {
      downloadLoading: false,
      dateScopes: ['全部', '本级', '自定义'],
      loading: false, dialog: false, depts: [], deptIds: [],
      dialog2: false,
      dialog3: false,
      dialog4: false,
      dialog5: false,
      form: { title: '', content: '' },
      form2: { title: '', content: '' },
      form3: { title: '', content: '' },
      form4: {},
      isAdd: true,
      rules: {
        content: [
          { required: true, message: '请输入电话', trigger: 'blur' }
        ]
      },
      rules2: {
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      rules3: {
        content: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      rules4: {
        replyContent: [
          { required: true, message: '请输入回复内容', trigger: 'blur' }
        ]
      },
      visible: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      currentId: 0, permissionLoading: false, menuLoading: false, showButton: false, opt: '菜单分配',
      delLoading: false, sup_this: this, permissions: [], permissionIds: [], menus: [], menuIds: [],
      data: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      checkedArray: [],
      roleMenuList: {},
      showResult: ''
    }
  },
  created() {
    this.getFeedbackList()
  },
  activated() {
  },
  methods: {

    showDialg(e) {
      this.form4 = e
      this.dialog4 = true
    },
    seeDetail(e) {
      this.form4 = e
      this.dialog5 = true
    },
    deleteFeedback(e) {
      const params = {
        id: e
      }
      deleteFeedback(params).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.$refs[e].doClose()
          this.getFeedbackList()
        } else {
          this.$message.error(res.data)
        }
      })
    },
    getFeedbackList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getFeedbackList(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.dataList = res.data.list
          console.log(this.dataList)
          for (let i = 0; i < this.dataList.length; i++) {
            // eslint-disable-next-line eqeqeq
            if (this.dataList[i].imageUrl != null) {
              this.dataList[i].imageUrl = this.dataList[i].imageUrl.split(',')
            }
          }
          this.totalPage = res.data.total
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
        console.log(this.dataList)
      })
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getFeedbackList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getFeedbackList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    addRole(e) {
      var params = {
        paramKey: 'tel'
      }
      sysDetail(params).then(res => {
        this.form.content = res.data
      })
      this.dialog = true
    },
    setResult(e) {
      var params = {
        paramKey: 'showResult'
      }
      sysDetail(params).then(res => {
        this.showResult = res.data
      })
      this.dialog3 = true
    },
    updateValue(e) {
      this.dataListLoading = true
      const params = {
        paramKey: 'showResult',
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
    setAbout(e) {
      var params = {
        paramKey: 'about'
      }
      sysDetail(params).then(res => {
        this.form2.content = res.data
      })
      this.dialog2 = true
    },
    setProblem(e) {
      var params = {
        paramKey: 'problem'
      }
      sysDetail(params).then(res => {
        this.form3.content = res.data
      })
      this.dialog3 = true
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialog = false
          this.dataListLoading = true
          const params = {
            paramKey: 'tel',
            paramValue: this.form.content
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
        }
      })
    },
    doSubmit2() {
      this.$refs['form2'].validate((valid) => {
        if (valid) {
          this.dialog2 = false
          this.dataListLoading = true
          const param = {
            paramKey: 'about',
            paramValue: this.form2.content
          }
          updateValue(param).then(res => {
            if (res.code === 200) {
              this.$notify({
                title: '成功',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: '失败'
              })
            }
            this.dataListLoading = false
          })
        }
      })
    },
    doSubmit3() {
      this.$refs['form3'].validate((valid) => {
        if (valid) {
          this.dialog3 = false
          this.dataListLoading = true
          const param = {
            paramKey: 'problem',
            paramValue: this.form3.content
          }
          updateValue(param).then(res => {
            if (res.code === 200) {
              this.$notify({
                title: '成功',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: '失败'
              })
            }
            this.dataListLoading = false
          })
        }
      })
    },
    doSubmit4() {
      this.$refs['form4'].validate((valid) => {
        if (valid) {
          this.dialog4 = false
          this.dataListLoading = true
          const param = this.form4
          delete param.createTime
          param.status = 1
          updateFeedback(param).then(res => {
            if (res.code === 200) {
              this.$notify({
                title: '成功',
                type: 'success'
              })
              this.getFeedbackList()
            } else {
              this.$notify.error({
                title: '失败'
              })
            }
            this.dataListLoading = false
          })
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .app-container {
    overflow-y: visible;
  }

  .role-span {
    font-weight: bold;
    color: #303133;
    font-size: 15px;
  }
</style>
