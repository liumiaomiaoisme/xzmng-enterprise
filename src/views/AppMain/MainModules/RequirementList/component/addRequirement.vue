<template>
   <el-dialog v-loading.fullscreen.lock="loading" title="添加需求" :visible.sync="this.$store.state.addRequirementVisible" class="Requirement-dialog-container" :close-on-click-modal="false">
      <el-form :model="addRequirementForm" status-icon ref="addRequirementForm" :rules="rules">
        <el-row>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="需求名称" :label-width="formLabelWidth" prop="tecDemandName">
              <el-input v-model="addRequirementForm.tecDemandName" autocomplete="off" placeholder="请输入需求名称"></el-input>
            </el-form-item>
            <el-form-item label="紧急程度" :label-width="formLabelWidth" prop="tecDemandEmergencyLevel">
              <el-select v-model="addRequirementForm.tecDemandEmergencyLevel" placeholder="请选择紧急程度">
                <el-option label="很紧急" value=0></el-option>
                <el-option label="不紧急" value=1></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="所在项目" :label-width="formLabelWidth" prop="tecDemandProjectId">
              <el-select v-model="addRequirementForm.tecDemandProjectId" placeholder="请选择所在项目">
                <el-option :label="item.name" :value="item.id" v-for="(item, i) in this.$store.state.projectsForRequire" :key="'ProjectId'+i"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="需求附件" :label-width="formLabelWidth" prop="tecDemandAnnex" class="product-annex">
          <el-upload
            class="upload-demo" name="upload-file"
            action="http://47.100.56.42:9876/upload"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-exceed="handleExceed"
            :before-upload="beforeUpload"
            :limit='3'
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">最多上传3个文件,仅支持JPG、JPEG、PNG、GIF、DOC格式，且每个不超过2M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="addRequirement" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      uploadURl: 'http://47.100.56.42:9876',
      fileList: [],
      addRequirementForm: {
        tecDemandName: '',
        Modifier: '',
        tecDemandProjectId: '',
        tecDemandEmergencyLevel: '',
        tecDemandAnnex: ''
      },
      formLabelWidth: '126px',
      rules: {
        tecDemandName: [
          { required: true, message: '请输入需求名称', trigger: 'blur' }
        ],
        tecDemandProjectId: [
          { required: true, message: '请选择关联项目', trigger: 'blur' }
        ],
        tecDemandEmergencyLevel: [
          { required: true, message: '请选择需求紧急程度', trigger: 'blur' }
        ]
      },
      timer: null,
      lastTime: 0,
      loading: false
    }
  },
  methods: {
    ExpectedRepairDate () {
      let time = new Date()
      let hh = time.getHours().toString().padStart(2, '0')
      let mm = time.getMinutes().toString().padStart(2, '0')
      let ss = time.getSeconds().toString().padStart(2, '0')
      let rangeStart = `${hh}:${mm}:${ss}`
      let range = rangeStart + ' - 23:59:59'
      return {
        selectableRange: [range],
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7
        }
      }
    },
    closeDialog () {
      this.$store.commit('closeAddRequirement')
      this.$refs['addRequirementForm'].resetFields()
    },
    addRequirement () {
      this.$throttle.throttle.apply(this, [this.add])
    },
    add () {
      this.loading = true
      this.$refs['addRequirementForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.addRequirementForm }
          addForm.tecDemandEmergencyLevel = parseInt(addForm.tecDemandEmergencyLevel)
          this.$axios.fetchPost('/api/demand/add', addForm)
            .then(res => {
              this.loading = false
              if (res.data.statuscode === 200) {
                this.$store.commit('getRequirementList', {
                  currentPage: 1
                })
                this.closeDialog()
                this.$message({
                  type: 'success',
                  message: '添加需求成功!'
                })
              } else if (res.data.statuscode === 400 && res.data.msg === '添加需求失败，请稍后重试！') {
                this.closeDialog()
                this.$message({
                  type: 'error',
                  message: '添加需求失败，请稍后重试！!'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.loading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSuccess (res, file, fileList) {
      console.log(res)
      this.fileList.length = 0
      for (let i of fileList) {
        this.fileList.push(this.uploadURl + i.response.relativePath)
      }
      this.addRequirementForm.tecDemandAnnex = this.fileList.toString()
    },
    handleRemove (file, fileList) {
      this.fileList.length = 0
      for (let i of fileList) {
        this.fileList.push(this.uploadURl + i.response.relativePath)
      }
      this.addRequirementForm.tecDemandAnnex = this.fileList.toString()
    },
    handleExceed () {
      this.$message({
        type: 'warning',
        message: '最多上传3个文件'
      })
    },
    beforeUpload (file) {
      const isJPG = file.type === 'image/jpg'
      const isJPEG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      const isGIF = file.type === 'image/gif'
      const isDoc = file.type === 'application/msword'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isJPEG && !isPNG && !isGIF && !isDoc) {
        this.$message.error('上传附件仅支持JPG、JPEG、PNG、GIF、DOC格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传附件图片大小不能超过 2MB!')
      }
      console.log(isDoc)
      return (isJPG || isJPEG || isGIF || isPNG || isDoc) && isLt2M
    }
  }
}
</script>
<style lang="scss">
  .Requirement-dialog-container{
    .product-annex{
      margin-bottom: 0!important;
      .el-upload__tip {
        display: inline-block;
        margin-left: 10px;
      }
      .el-upload-list--picture .el-upload-list__item {
        display: inline-block;
        margin-right: 10px;
        padding: 10px 10px 10px 60px;
        height: 60px;
        width: 30.5%;
      }
      .el-upload-list--picture .el-upload-list__item-thumbnail {
        width: 40px;
        height: 40px;
        margin-left: -50px;
      }
      .el-upload-list--picture .el-upload-list__item.is-success .el-upload-list__item-name {
        line-height: 40px;
        margin-right: 0;
      }
    }
  }
</style>
