<template>
  <div class="app-container">
    <div style="display: flex">
      <div class="head-container">
        <!-- 搜索 -->
        <el-button class="filter-item" size="mini" type="success" @click="toDownload">下载模板</el-button>
        <div style="display: inline-block;margin: 0px 2px;">
          <el-button class="filter-item" size="mini" type="primary" @click="showDialog()">点击上传</el-button>
        </div>
        <div style="display: inline-block;margin: 0px 2px;">
          <el-button :disabled="dataListSelections.length <= 0" class="filter-item" type="danger" @click="deleteHandle()">批量删除</el-button>
        </div>
      </div>
      <el-dialog
        :visible.sync="dialog"
        :modal-append-to-body="false"
        :append-to-body="true"
        title="选择文件"
        top="1vh"
        width="500px"
      >
        <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="80px" @keyup.enter.native="dataFormSubmit()">
          <el-form-item label="爬取方式" prop="type">
            <el-radio-group v-model="dataForm.type">
              <el-radio :label="1">车牌号</el-radio>
              <el-radio :label="2">车架号</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="accountId" label="选择账号">
            <el-select v-model="dataForm.accountId" placeholder="请选择">
              <el-option
                v-for="(item, index) in userList"
                :key="item.accountName + index"
                :label="item.accountName"
                :value="item.thirdInsuranceId"/>
            </el-select>
          </el-form-item>
          <el-form-item label="选择文件">
            <el-upload
              ref="upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="onSuccess"
              :on-error="onError"
              :before-remove="beforeRemove"
              :limit="1"
              :on-exceed="handleExceed"
              :file-list="fileList"
              :auto-upload="false"
              :on-change="beforeAvatarUpload"
              :data="dataForm"
              :action="url"
              :show-file-list="true"
              accept=".xls,.xlsx"
              class="upload-demo"
              multiple>
              <el-button class="filter-item" size="mini" type="primary">选择文件</el-button>
            </el-upload>
          </el-form-item>
          <div style="display: inline-block;margin: 0px 2px;"/>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialog = false">取消</el-button>
          <el-button style="margin-left: 10px;" size="small" type="primary" @click="submitUpload">开始上传</el-button>
        </span>
      </el-dialog>
    </div>

    <el-row :gutter="20">
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
            type="selection"
            header-align="center"
            align="center"
            width="50"
          />
          <el-table-column
            prop="id"
            width="50"
            align="center"
            label="批次"
          />
          <el-table-column
            prop="name"
            header-align="center"
            align="center"
            label="名字"
          />
          <el-table-column
            prop="loginName"
            header-align="center"
            align="center"
            label="创建时间"
            width="150"
          >
            <template slot-scope="scope">
              {{ util.formatTime(scope.row.createTime) }}
            </template>
          </el-table-column>
          <!--          <el-table-column
            prop="role_name"
            header-align="center"
            align="center"
            label="创建人"
          />-->
          <el-table-column
            prop="superiorinvitecode"
            header-align="center"
            align="center"
            label="爬取方式"
          >
            <template slot-scope="scope">
              {{ scope.row.type=='1'?'车牌号':'车架号' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            header-align="center"
            align="center"
            label="状态"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.status == '0'" size="small" type="danger">未爬取</el-tag>
              <el-tag v-else-if="scope.row.status == '1'" size="small">完成</el-tag>
              <el-tag v-else size="small">正在爬取</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="percentage"
            header-align="center"
            align="center"
            label="进度"
          >
            <template slot-scope="scope">
              <el-progress :percentage="scope.row.progress" :color="customColors"/>
              <!--              {{ scope.row.percentage }}-->
            </template>
          </el-table-column>
          <el-table-column
            prop="total"
            header-align="center"
            align="center"
            label="总数"
          />
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button v-if="scope.row.status == '0'" type="primary" size="small" icon="el-icon-caret-right" @click="start(scope.row.seriesNo)"/>
              <el-button v-if="scope.row.status == '3'" type="primary" size="small" icon="el-icon-loading" />
              <el-button slot="reference" :disabled="scope.row.status != '1'" type="primary" size="small" icon="el-icon-download" @click="downLoad(scope.row.seriesNo)"/>
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
  </div>
</template>

<script>
import { getCrawlingList, startCrawling, getProgress, deleteCrawling, getAccountById } from '../../api/userApi'
export default {
  components: {
  },
  data() {
    return {
      percentage: 20,
      customColors: '#409eff',
      dateScopes: ['全部', '本级', '自定义'],
      loading: false, dialog: false, depts: [], deptIds: [],
      form: { name: '', depts: [], remark: '', dataScope: '本级', level: 3 },
      rules: {
        type:
          [{ required: true, message: '必选', trigger: 'blur' }],
        accountId:
          [{ required: true, message: '必选', trigger: 'blur' }]
      },
      visible: false,
      query: {
        value: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      roleList: {},
      isAdd: true,
      dataForm: {
        type: '',
        accountId: ''
      },
      url: '',
      fileList: [],
      uploadStat: false,
      userList: {}
    }
  },
  created() {
    this.getCrawlingList()
    this.initList()
    const user = JSON.parse(this.$store.getters.user)
    console.log(user)
  },
  destroyed() {
    clearInterval(this.myInterval)
  },
  methods: {
    initList() {
      this.myInterval = window.setInterval(() => {
        setTimeout(() => {
          this.getProgress() // 调用接口的方法
        }, 0)
      }, 10000)
    },
    getProgress() {
      // this.getCrawlingList()
      for (let i = 0; i < this.dataList.length; i++) {
        // this.dataList[i].percentage =30
        // console.log(this.dataList[i])
        if (this.dataList[i].status === '3') {
          // this.getCrawlingList()
          const params = {
            seriesNo: this.dataList[i].seriesNo
          }
          getProgress(params).then(res => {
            this.dataList[i].progress = Math.ceil((Number(res.data) / Number(this.dataList[i].total) * 100))
            // this.dataList[i].percentage=20
            if (this.dataList[i].progress === 100) {
              this.getCrawlingList()
            }
            // console.log(this.dataList[i].progress)
            // console.log(res.data)
          })
        }
      }
    },
    submitUpload() {
      console.log(this.dataForm)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.uploadStat) {
            this.$notify({
              title: '请选择文件',
              type: 'warning'
            })
          } else {
            const user = JSON.parse(this.$store.getters.user)
            this.dataForm.createBy = user.id
            this.$refs.upload.submit()
            this.dialog = false
          }
        }
      })
    },
    showDialog() {
      this.dialog = true
      this.getAccountById()
    },
    getAccountById() {
      const user = JSON.parse(this.$store.getters.user)
      const params = {
        id: user.id
      }
      getAccountById(params).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.userList = res.data
        }
      })
    },
    onSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$notify({
          title: '上传成功',
          type: 'success'
        })
        this.getCrawlingList()
      } else {
        this.$notify({
          title: '上传失败，请稍后重试',
          type: 'error'
        })
      }
      this.$refs.upload.clearFiles()
    },
    onError(response, file, fileList) {
      this.$notify({
        title: '上传失败，请稍后重试',
        type: 'error'
      })
    },
    toDownload() {
      window.location.href = 'http://baozhishun.com/上传模板.xls'
    },
    getCrawlingList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      getCrawlingList(params).then(res => {
        if (res.code === 200) {
          for (let i = 0; i < res.data.list.length; i++) {
            res.data.list[i].progress = Math.ceil((Number(res.data.list[i].finishTotal) / Number(res.data.list[i].total) * 100))
            // res.data.list[i].progress = (Number(res.data.list[i].finishTotal) / Number(res.data.list[i].total) * 100).toFixed(0)
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
    downLoad(e) {
      window.location.href = process.env.BASE_API + 'crawling/carinfo/exportCrawlingDataList?seriesNo=' + e
      /* const param = {
        seriesNo: e
      }
      exportCrawlingDataList(e).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.getCrawlingList()
        } else {
          this.$notify({
            title: '操作失败',
            type: 'error'
          })
        }
      })*/
    },
    start(e) {
      const param = {
        seriesNo: e
      }
      startCrawling(param).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.getCrawlingList()
        } else {
          this.$notify({
            title: '操作失败',
            type: 'error'
          })
        }
      })
    },
    beforeAvatarUpload(file, fileList) {
      this.url = process.env.BASE_API + 'crawling/carinfo/import'
      if (fileList.length != 0) {
        this.uploadStat = true
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      console.log(2)
      this.uploadStat = false
    },
    handlePreview(file) {
      console.log(file)
      console.log(1)
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getCrawlingList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getCrawlingList()
    },
    // 多选
    selectionChangeHandle(val) {
      console.log(val)
      this.dataListSelections = val
    },
    deleteHandle(id) {
      var userIds = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      console.log(userIds)
      this.dialogVisible = true
      console.log(id)
      this.$confirm(`确认删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const param = {
          id: userIds.join(',')
        }
        deleteCrawling(param).then(res => {
          console.log(res)
          if (res.code === 200) {
            this.$notify({
              title: '操作成功',
              type: 'success'
            })
            this.getCrawlingList()
          }
        })
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
