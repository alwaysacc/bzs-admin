<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <div class="head-container">
          <!-- 搜索 -->
          <el-button type="primary" @click="addOrUpdate">新增</el-button>

        </div>
        <el-dialog
          :visible.sync="dialog"
          :modal-append-to-body="false"
          :append-to-body="true"
          title="新增"
          top="1vh"
          width="500px"
        >
          <el-form ref="dataForm" :model="dataForm" :rules="rules" label-width="80px" @keyup.enter.native="dataFormSubmit()">
            <el-form-item label="图片" prop="userName">
              <el-upload
                ref="upload"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :on-success="onSuccess"
                :on-error="onError"
                :on-change="beforeAvatarUpload"
                :before-remove="beforeRemove"
                :on-exceed="handleExceed"
                :file-list="fileList"
                :auto-upload="false"
                :action="url"
                :data="dataForm"
                :limit="1"
                :show-file-list="true"
                class="upload-demo"
                accept=".jpg,.png"
                list-type="picture">
                <el-button size="small" type="primary">选择文件</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
              </el-upload>
            </el-form-item>
            <el-form-item label="排序" prop="orderNum">
              <el-input v-model="dataForm.orderNum" placeholder="排序，0-999" />
            </el-form-item>
            <el-form-item label="类型">
              <el-radio v-model="dataForm.type" label="0">首页</el-radio>
              <el-radio v-model="dataForm.type" label="1">车险</el-radio>
            </el-form-item>
            <!--<el-form-item label="角色" size="mini" prop="roleIdList">
              <el-checkbox-group v-model="dataForm.roleIdList">
                <el-checkbox v-for="role in roleList" :key="role.roleId" :label="role.roleId">{{ role.roleName }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>-->
            <!--            <el-form-item label="是否显示" size="mini" prop="isShow">
              <el-radio-group v-model="dataForm.isShow">
                <el-radio :label="1">隐藏</el-radio>
                <el-radio :label="0">显示</el-radio>
              </el-radio-group>
            </el-form-item>-->
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialog = false">取消</el-button>
            <el-button type="primary" @click="submitUpload()">确定</el-button>
          </span>
        </el-dialog>
        <el-table
          v-loading="dataListLoading"
          :data="dataList"
          border
          size="mini"
          style="width: 100%;"
          @selection-change="selectionChangeHandle"
        >
          <el-table-column
            type="index"
            width="50"
            label="ID"
          />
          <el-table-column
            prop="imgUrl"
            header-align="center"
            align="center"
            label="图片"
          >
            <template slot-scope="scope">
              <img :src="scope.row.imgUrl" min-width="70" height="70">
            </template>
          </el-table-column>
          <el-table-column
            prop="imgUrl"
            header-align="center"
            align="center"
            label="类型"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.type === 0" size="small" type="success" >首页</el-tag>
              <el-tag v-else-if="scope.row.type === 1" size="small">车险</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="orderNum"
            header-align="center"
            align="center"
            label="排序"
          />
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作"
          >
            <template slot-scope="scope">
              <!--              <el-button type="primary" size="small" icon="el-icon-edit" @click="addOrUpdate(scope.row)"/>-->
              <el-popover
                :ref="scope.row.id"
                placement="top"
                width="160">
                <p>确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                  <el-button type="primary" size="mini" @click="deleteUser(scope.row)">确定</el-button>
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
    </el-row>
  </div>
</template>

<script>
import { swiperList, deleteSwiper } from '../../../api/userApi'
export default {
  components: {
  },
  data() {
    return {
      imageUrl: '',
      dataForm: {
        orderNum: '',
        isShow: '',
        imgUrl: '',
        type: '0'
      },
      queryForm: {
        type: '',
        userName: ''
      },
      rules: {
        orderNum:
          [{ required: true, message: '必填', trigger: 'blur' }],
        isShow:
          [{ required: true, message: '必选', trigger: 'blur' }]
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      isAdd: true,
      dialog: false,
      userName: '',
      errMsg: true,
      stat: 0,
      url: '',
      fileList: [],
      uploadStat: false
    }
  },
  activated() {
    this.getUserList()
  },
  created() {
    this.getUserList()
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
        this.getUserList()
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
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    },
    beforeAvatarUpload(file, fileList) {
      this.url = process.env.BASE_API + 'swiper/add'
      if (fileList.length != 0) {
        this.uploadStat = true
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`只能选择一张图片`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    getUserList() {
      this.dataListLoading = true
      const params = {
        page: this.pageIndex,
        size: this.pageSize
      }
      swiperList(params).then(res => {
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
    addOrUpdate(e) {
      this.dialog = true
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
      console.log(this.dataListSelections)
    },
    deleteUser(e) {
      const params = {
        id: e.id,
        imgUrl: e.imgUrl
      }
      deleteSwiper(params).then(res => {
        if (res.code === 200) {
          this.$notify({
            title: '操作成功',
            type: 'success'
          })
          this.getUserList()
        } else {
          this.$message.error(res.data)
        }
      })
    }
  }
}
</script>
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
