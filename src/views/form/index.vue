<template>
  <div class="app-container">
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
    >
      <el-form-item label="更换">
        <el-upload
          ref="upload"
          list-type="picture-card"
          :file-list="fileList"
          :headers="headers"
          :action="uploadImageUrl"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :before-remove="beforeRemove"
          :auto-upload="false"
        >
          <i class="el-icon-plus" />
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="onSubmit"
        >保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>

import { getToken } from '@/utils/auth'
import { removeimage, GetDataByNames } from '@/api/common'
export default {
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      disabled: false,
      uploadImageUrl: process.env.VUE_APP_BASE_API + 'authdata/uploaderimage',
      headers: {
        optname: 'insertcustompic',
        id: 1,
        token: getToken() // 从cookie里获取token，并赋值token
      },
      requestParams: [
        { name: 'getcustompicbycustomid', offset: 0, pagecount: 0, params: [1] }
      ],
      requestParam: {
        name: 'deletecustompic',
        picname: '',
        params: []
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {

    getList() {
      this.listLoading = true
      GetDataByNames(this.requestParams).then(response => {
        this.fileList = response.data.getcustompicbycustomid.list
        for (let i = 0; i < this.fileList.length; i++) {
          this.fileList[i].url = process.env.VUE_APP_BASE_API + 'data/getthumbnailimage/' + this.fileList[i].savename
        }
      })
    },
    handleRemove(file, fileList) {
      this.reqDeletePic(file, fileList)
    },
    beforeRemove(file, fileList) {
      console.log(file.response)

      return this.$confirm('删除当前图片' + file.name + ', 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
    },
    reqDeletePic(file, fileList) {
      if (file.response) {
        this.requestParam.picname = file.response.filename
      } else {
        this.requestParam.picname = file.savename
      }
      this.requestParam.params = []
      this.requestParam.params[0] = this.requestParam.picname
      removeimage(this.requestParam).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
      })
    },

    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
      console.log(file)
    },
    onSubmit() {
      this.$refs.upload.submit()
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

