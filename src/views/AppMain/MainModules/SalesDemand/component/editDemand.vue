<template>
   <el-dialog title="编辑需求" :visible.sync="this.$store.state.editDemandVisible" class="demand-dialog-container" :close-on-click-modal="false">
      <el-form :model="editDemandForm" status-icon ref="editDemandForm" :rules="rules">
        <el-row>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="需求修改人或组" :label-width="formLabelWidth" prop="Modifier">
              <el-cascader :key="this.$store.state.isResouceGet" v-model="editDemandForm.Modifier"  label="需求修改人或组" placeholder="试试搜索：小组名或人名" :options="options" filterable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="技术部反馈状态" :label-width="formLabelWidth" prop="demandFeedbackStatus">
              <el-select v-model="editDemandForm.demandFeedbackStatus" placeholder="请选择反馈状态">
                <el-option label="已完成" value=0></el-option>
                <el-option label="进行中" value=1></el-option>
                <el-option label="未分配" value=2></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="技术部反馈建议" :label-width="formLabelWidth" prop="demandFeedbackOpinion">
          <el-input class="textarea" type="textarea" :autosize='false' placeholder="请输入反馈建议" v-model="editDemandForm.demandFeedbackOpinion" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="需求附件" :label-width="formLabelWidth" prop="demandFile" class="product-annex">
          <el-upload
            ref="upload"
            class="upload-demo" name="upload-file"
            action="http://47.100.56.42:9876/upload"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :file-list="FileLists"
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
        <el-button type="primary" @click="editDemand" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      uploadURl: 'http://47.100.56.42:9876',
      fileList: [],
      formLabelWidth: '126px',
      rules: {
        Modifier: [
          { required: true, message: '请选择修改人或修改组', trigger: 'blur' }
        ],
        demandFeedbackStatus: [
          { required: true, message: '请选择反馈状态', trigger: 'blur' }
        ],
        demandFeedbackOpinion: [
          { required: true, message: '请输入反馈建议', trigger: 'blur' }
        ]
      },
      timer: null,
      options: [{
        value: 0,
        label: '修改人',
        children: this.$store.state.ModifyPerson
      }, {
        value: 1,
        label: '修改组',
        children: this.$store.state.ModifyTeam
      }]
    }
  },
  computed: {
    editDemandForm () {
      return this.$store.state.editDemandForm
    },
    FileLists () {
      return this.$store.state.editDemandForm.demandFile
    }
  },
  methods: {
    closeDialog () {
      this.$store.commit('closeEditDemand')
      this.$refs['editDemandForm'].resetFields()
      this.$refs.upload.clearFiles()
    },
    editDemand () {
      this.$refs['editDemandForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.editDemandForm }
          if (addForm.Modifier[0] === 0) {
            addForm.demandModifier = addForm.Modifier[1]
            addForm.demandModifyObject = 1
            delete addForm.tecDemandModifierGroup
          } else if (addForm.Modifier[0] === 1) {
            addForm.demandModifier = addForm.Modifier[2]
            addForm.demandModifyObject = 2
            delete addForm.tecDemandModifierPersonal
          }
          delete addForm.tecDemandModifierPersonalName
          console.log(addForm)
          // this.$axios.fetchPost('/api/market_demand/update', addForm)
          //   .then(res => {
          //     console.log(res)
          //     if (res.data.statuscode === 200) {
          //       this.$store.commit('getRequirementList', {
          //         currentPage: 1
          //       })
          //       this.closeDialog()
          //       this.$message({
          //         type: 'success',
          //         message: '编辑需求成功!'
          //       })
          //     } else if (res.data.statuscode === 400 && res.data.msg === '更新需求失败，请稍后重试！') {
          //       this.closeDialog()
          //       this.$message({
          //         type: 'error',
          //         message: '编辑需求失败，请稍后重试！!'
          //       })
          //     }
          //   })
          //   .catch(err => {
          //     console.log(err)
          //   })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSuccess (res, file, fileList) {
      this.fileList.length = 0
      for (let i of fileList) {
        this.fileList.push(this.uploadURl + i.response.relativePath)
      }
      this.editDemandForm.demandFile = this.fileList.toString()
    },
    handleRemove (file, fileList) {
      this.fileList.length = 0
      for (let i of fileList) {
        this.fileList.push(this.uploadURl + i.response.relativePath)
      }
      this.editDemandForm.demandFile = this.fileList.toString()
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
      const isDOC = file.type === 'application/msword'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isJPG && !isJPEG && !isPNG && !isGIF) {
        this.$message.error('上传附件图片仅支持JPG、JPEG、PNG、GIF格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传附件图片大小不能超过 2MB!')
      }
      return (isJPG || isJPEG || isGIF || isPNG || isDOC) && isLt2M
    }
  }
}
</script>
<style lang="scss">
  .demand-dialog-container{
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
    .el-dialog .textarea {
      width: 630px;
    }
    .el-dialog .el-input{
      width: 230px;
    }
  }
</style>
