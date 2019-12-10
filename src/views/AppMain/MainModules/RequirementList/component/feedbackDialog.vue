<template>
  <el-dialog title="完成需求提交反馈" :visible.sync="this.$store.state.feedbackVisible" class="Requirement-dialog-container" :close-on-click-modal="false">
    <el-form :model="addRequirementForm" status-icon ref="addRequirementForm" :rules="rules">
      <el-form-item label="需求名称" :label-width="formLabelWidth" prop="tecDemandName">
        <el-input :disabled="true" v-model="addRequirementForm.tecDemandName"></el-input>
      </el-form-item>
      <el-form-item label="所在项目" :label-width="formLabelWidth" prop="tecDemandProjectId">
        <el-select v-model="addRequirementForm.tecDemandProjectId" placeholder="请选择所在项目" :disabled="true">
          <el-option :label="item.name" :value="item.id" v-for="(item,i) in this.$store.state.projectsForRequire" :key="'ProjectId'+i"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="反馈内容" :label-width="formLabelWidth" prop="tecDemandDevFeedback">
        <el-input class="textarea" type="textarea" :autosize='false' placeholder="请输入反馈结果" v-model="addRequirementForm.tecDemandDevFeedback" maxlength="50" show-word-limit></el-input>
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
      formLabelWidth: '126px',
      rules: {
        tecDemandDevFeedback: [
          { required: true, message: '请输入反馈结果', trigger: 'blur' }
        ]
      },
      timer: null,
      dateTmp: ''
    }
  },
  computed: {
    addRequirementForm () {
      return this.$store.state.requireFormSubmitData
    }
  },
  methods: {
    closeDialog () {
      this.$store.commit('closeEndRequirement')
      this.$refs['addRequirementForm'].resetFields()
    },
    editRequirement () {
      this.$refs['addRequirementForm'].validate((valid) => {
        if (valid) {
          let addForm = {
            tecDemandId: this.addRequirementForm.tecDemandId,
            tecDemandDevFeedback: this.addRequirementForm.tecDemandDevFeedback
          }
          console.log(addForm)
          this.$axios.fetchPost('/api/demand/end', addForm)
            .then(res => {
              console.log(res)
              if (res.data.statuscode === 200) {
                this.$store.commit('getRequirementList', {
                  currentPage: 1
                })
                this.closeDialog()
                this.$message({
                  type: 'success',
                  message: '需求结束成功！'
                })
              } else if (res.data.statuscode === 400 && res.data.msg === '需求结束失败，请稍后重试！') {
                this.closeDialog()
                this.$message({
                  type: 'error',
                  message: '需求结束失败，请稍后重试！'
                })
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getFormatTime (data) {
      let newTime = new Date(data)
      let y = newTime.getFullYear()
      let mo = (newTime.getMonth() + 1).toString().padStart(2, '0')
      let d = newTime.getDate().toString().padStart(2, '0')
      let h = newTime.getHours().toString().padStart(2, '0')
      let mi = newTime.getMinutes().toString().padStart(2, '0')
      let s = newTime.getSeconds().toString().padStart(2, '0')
      this.dateTmp = `${y}-${mo}-${d} ${h}:${mi}:${s}`
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
