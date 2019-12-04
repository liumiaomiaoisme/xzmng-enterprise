<template>
   <el-dialog v-loading.fullscreen.lock="loading" title="编辑需求" :visible.sync="this.$store.state.editRequirementVisible" class="Requirement-dialog-container" :close-on-click-modal="false">
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
                <el-option :label="item.name" :value="item.id" v-for="(item, i) in this.$store.state.projectsForRequire" :key="'ProjectId '+i"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="需求附件" :label-width="formLabelWidth" prop="tecDemandAnnex" class="product-annex">
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
        <el-button type="primary" @click="editRequirement" size="small">确 定</el-button>
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
        tecDemandName: [
          { required: true, message: '请输入需求名称', trigger: 'blur' }
        ],
        tecDemandProjectId: [
          { required: true, message: '请选择关联项目', trigger: 'blur' }
        ],
        Modifier: [
          { required: true, message: '请选择需求修改人或组', trigger: 'blur' }
        ],
        tecDemandEmergencyLevel: [
          { required: true, message: '请选择需求紧急程度', trigger: 'blur' }
        ],
        tecDemandExpectedRepairDate: [
          { required: true, message: '请选择预期完成时间', trigger: 'blur' }
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
      }],
      loading: false
    }
  },
  computed: {
    addRequirementForm () {
      return this.$store.state.requireFormSubmitData
    },
    FileLists () {
      return this.$store.state.requireFormSubmitData.getfileList
    },
    ExpectedRepairDate () {
      let range
      if (this.addRequirementForm.tecDemandCreateDate) {
        let time = this.addRequirementForm.tecDemandCreateDate.substr(11, 8)
        console.log(time)
        range = time + ' - 23:59:59'
      }
      return {
        selectableRange: [range],
        disabledDate: (time) => {
          return time.getTime() < new Date(this.addRequirementForm.tecDemandCreateDate).getTime() - 8.64e7
        }
      }
    }
  },
  methods: {
    closeDialog () {
      this.$store.commit('closeEditRequirement')
      this.$refs['addRequirementForm'].resetFields()
      this.$refs.upload.clearFiles()
    },
    editRequirement () {
      this.loading = true
      this.$refs['addRequirementForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.addRequirementForm }
          if (addForm.Modifier[0] === 0) {
            addForm.tecDemandModifierPersonal = addForm.Modifier[1]
            delete addForm.tecDemandModifierGroup
          } else if (addForm.Modifier[0] === 1) {
            addForm.tecDemandModifierGroup = addForm.Modifier[2]
            delete addForm.tecDemandModifierPersonal
          }
          addForm.tecDemandEmergencyLevel = parseInt(addForm.tecDemandEmergencyLevel)
          delete addForm.tecDemandModifierPersonalName
          console.log(addForm)
          this.$axios.fetchPost('/api/demand/update', addForm)
            .then(res => {
              this.loading = false
              console.log(res)
              if (res.data.statuscode === 200) {
                this.$store.commit('getRequirementList', {
                  currentPage: 1
                })
                this.closeDialog()
                this.$message({
                  type: 'success',
                  message: '编辑需求成功!'
                })
              } else if (res.data.statuscode === 400 && res.data.msg === '更新需求失败，请稍后重试！') {
                this.closeDialog()
                this.$message({
                  type: 'error',
                  message: '编辑需求失败，请稍后重试！!'
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
