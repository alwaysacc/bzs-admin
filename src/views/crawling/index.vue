<template>
  <div class="app-container">
    <div style="display: flex">
      <div class="head-container">
        <!-- 搜索 -->
        <el-button class="filter-item" size="mini" type="success" @click="toDownload">下载模板</el-button>
        <div style="display: inline-block;margin: 0px 2px;">
          <el-button class="filter-item" size="mini" type="primary" @click="dialog = true">点击上传</el-button>
        </div>
      </div>
      <!-- 搜索 -->

      <!-- 新增
        <div v-permission="['ADMIN','ROLES_ALL','ROLES_CREATE']" style="display: inline-block;margin: 0px 2px;">
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-plus"
            @click="addOrUpdate">上传</el-button>
          <eForm ref="form" :is-add="true"/>
        </div>-->
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
              accept=".xls,.xlsx"
              show-file-list="false"
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
            width="180"
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
            prop="total"
            header-align="center"
            align="center"
            width="180"
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
import { getCrawlingList, startCrawling } from '../../api/userApi'
export default {
  components: {
  },
  data() {
    return {
      dateScopes: ['全部', '本级', '自定义'],
      loading: false, dialog: false, depts: [], deptIds: [],
      form: { name: '', depts: [], remark: '', dataScope: '本级', level: 3 },
      rules: {
        type:
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
        createBy: 1,
        type: ''
      },
      url: '',
      fileList: [],
      uploadStat: false
    }
  },
  activated() {
    this.getCrawlingList()
  },
  created() {
    this.getCrawlingList()
  },
  methods: {
    submitUpload() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.uploadStat) {
            this.$notify({
              title: '请选择文件',
              type: 'warning'
            })
          } else {
            console.log(this.url)
            const user = JSON.parse(this.$store.getters.user)
            this.dataForm.createBy = user.id
            console.log(this.dataForm)
            this.$refs.upload.submit()
            this.dialog = false
          }
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
    downLoad(e) {
      window.location.href = process.env.BASE_API + 'crawling/carinfo/exportCrawlingDataList?seriesNo=' + e
      console.log(process.env.BASE_API)
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
      console.log(111111111111)
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
      this.dataListSelections = val
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
