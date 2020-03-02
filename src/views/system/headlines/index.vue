<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-form>
          <el-form-item>
            <el-button type="primary" @click="add()">新增</el-button>
            <!--        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>-->
            <!--            <el-button :disabled="dataListSelections.length <= 0" type="danger" @click="deleteHandle()">批量删除</el-button>-->
          </el-form-item>
        </el-form>
        <el-dialog
          :visible.sync="dialog"
          :title="isAdd?'新增':'修改'"
          :modal-append-to-body="false"
          :append-to-body="true"
          top="5vh"
          width="80%"
          style="height: 100%"
          height="100%">
          <el-form ref="form" :model="dataForm" :rules="rules" label-width="80px">
            <el-form-item label="标题" prop="title">
              <el-input v-model="dataForm.title" style="width: 370px;"/>
            </el-form-item>
            <el-form-item label="是否显示" prop="isShow">
              <el-radio v-model="dataForm.isShow" :label="1">是</el-radio>
              <el-radio v-model="dataForm.isShow" :label="0">否</el-radio>
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <editor v-model="dataForm.content" :is-clear="isClear" @change="change"/>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button type="text" @click="doClose">取消</el-button>
            <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
          </div>
        </el-dialog>
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
            prop="title"
            header-align="center"
            align="center"
            label="标题"

          />
          <el-table-column
            prop="pay_status"
            header-align="center"
            align="center"
            label="是否显示"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.isShow === 0" size="small" type="danger">否</el-tag>
              <el-tag v-else-if="scope.row.isShow === 1" size="small">是</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            label="操作"
            width="150"
          >
            <template slot-scope="scope">
              <el-button type="primary" class="el-icon-edit" size="small" @click="update(scope.row)"/>
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id()].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="del(scope.row.id)">确定</el-button>
                </div>
                <el-button slot="reference" type="danger" size="small" icon="el-icon-delete" @click="visible=true"/>
              </el-popover>
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
import { getHeadlinesList, addHeadlines, delHeadlines, updateHeadlines } from '../../../api/userApi'
import Editor from '@/components/Editor'

export default {
  components: {
    'editor': Editor
  },
  data() {
    return {
      isClear: false,
      loading: false,
      dialog: false,
      dataForm: {
        isShow: '2'
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      activeName: '1',
      isAdd: true,
      rules: {
        title: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '必填', trigger: 'blur' }
        ],
        isShow: [
          { required: true, message: '必选', trigger: 'blur' }
        ]
      }
    }
  },
  activated() {
    this.getHeadlinesList()
  },
  created() {
    this.getHeadlinesList(this.activeName)
  },
  methods: {
    change(val) {
      this.dataForm.content = val
    },
    doClose() {
      this.getHeadlinesList(this.activeName)
      this.dialog = false
    },
    update(e) {
      this.isAdd = false
      console.log(e)
      var dataForm = e
      var dataForm2 = Object.assign({}, this.dataForm, dataForm)// 合并对象
      this.dataForm = dataForm2
      this.dialog = true
    },
    add() {
      this.isAdd = true
      this.dataForm = {}
      this.dialog = true
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.dialog = false
          if (this.isAdd) {
            const param = this.dataForm
            param.type = this.activeName
            addHeadlines(param).then(res => {
              if (res.code === 200) {
                this.$notify({
                  title: '保存成功',
                  type: 'success'
                })
                this.$refs['form'].resetFields()
              } else {
                this.$notify.error({
                  title: '保存失败'
                })
              }
              this.form = {}
              this.getHeadlinesList(this.activeName)
            })
          } else {
            const param = this.dataForm
            delete param.createTime
            delete param.createUser
            delete param.updateTime
            delete param.updateUser
            param.type = this.activeName
            updateHeadlines(param).then(res => {
              if (res.code === 200) {
                this.$notify({
                  title: '保存成功',
                  type: 'success'
                })

                this.$refs['form'].resetFields()
              } else {
                this.$notify.error({
                  title: '保存失败'
                })
              }
              this.dataForm = {}
              this.getHeadlinesList(this.activeName)
            })
          }
        }
      })
    },
    del(e) {
      const params = {
        id: e
      }
      delHeadlines(params).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.$refs[e].doClose()
          this.getHeadlinesList(this.activeName)
        } else {
          this.$message.error(res.data)
        }
      })
    },
    getHeadlinesList(e) {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize,
        type: e
      }
      getHeadlinesList(params).then(res => {
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
      this.getHeadlinesList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getHeadlinesList()
    },
    handleClick(tab, event) {
      this.getHeadlinesList(tab.name)
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
