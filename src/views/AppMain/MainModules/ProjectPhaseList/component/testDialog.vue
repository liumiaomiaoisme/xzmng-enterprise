<template>
   <el-dialog title="测试结果" :visible.sync="this.$store.state.testProjectPhaseVisible" class="projectPhase-dialog-container small-dialog" :close-on-click-modal="false">
      <el-form :model="testProjectPhaseForm" status-icon ref="testProjectPhaseForm" :rules="rules">
        <el-form-item label="所属项目名称" :label-width="formLabelWidth">
          <el-input :disabled="true" type="text" v-model="testProjectPhaseForm.tecProjectName"></el-input>
        </el-form-item>
        <el-form-item label="项目阶段名称" :label-width="formLabelWidth">
          <el-input :disabled="true" type="text" v-model="testProjectPhaseForm.tecStageName"></el-input>
        </el-form-item>
        <el-form-item label="项目测试状态" :label-width="formLabelWidth" prop="tecStageTestStatus">
          <el-select v-model="testProjectPhaseForm.tecStageTestStatus" placeholder="请选择测试状态">
            <el-option :label="item.StatusName" :value="item.StatusId" v-for="item in stageTestStatus" :key="item.StatusId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试反馈意见" :label-width="formLabelWidth" prop="tecStageFeedback">
          <el-input class="textarea" type="textarea" :autosize='false' placeholder="请输入测试反馈意见" v-model="testProjectPhaseForm.tecStageFeedback" maxlength="50" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-popover placement="top-end" width="186" v-model="confirmVisible" class="pop-cancle">
          <p>取消将会丢失已编辑的内容，确定取消吗？</p>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="confirmVisible = false">再想想</el-button>
            <el-button type="primary" size="mini" @click="closeDialog">确定</el-button>
          </div>
          <el-button slot="reference" size="small">取 消</el-button>
        </el-popover>
        <el-button type="primary" @click="addTestProjectPhase" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  props: ['stageTestStatus'],
  computed: {
    testProjectPhaseForm () {
      return this.$store.state.testProjectPhaseForm
    }
  },
  data () {
    return {
      confirmVisible: false,
      formLabelWidth: '126px',
      rules: {
        tecStageTestStatus: [
          { required: true, message: '请选择测试状态', trigger: 'blur' }
        ],
        tecStageFeedback: [
          { required: true, message: '请输入测试反馈', trigger: 'blur' }
        ]
      },
      timer: null
    }
  },
  methods: {
    closeDialog () {
      console.log(1)
      this.confirmVisible = false
      this.$store.commit('closeTestProjectPhase')
      this.$refs['testProjectPhaseForm'].resetFields()
    },
    addTestProjectPhase () {
      this.$refs['testProjectPhaseForm'].validate((valid) => {
        if (valid) {
          let addForm = {}
          addForm.id = parseInt(this.testProjectPhaseForm.tecStageId)
          addForm.testStatus = this.testProjectPhaseForm.tecStageTestStatus
          addForm.feedback = this.testProjectPhaseForm.tecStageFeedback
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$axios.fetchPost('/api/stage/test', addForm)
              .then(res => {
                console.log(res)
                if (res.data.statuscode === 200) {
                  this.$store.commit('getProjectPhaseList', {
                    currentPage: 1
                  })
                  this.closeDialog()
                  this.$message({
                    type: 'success',
                    message: '测试结果提交成功!'
                  })
                } else if (res.data.statuscode === 400 && res.data.msg === '修改测试结果失败，请稍后重试') {
                  this.closeDialog()
                  this.$message({
                    type: 'error',
                    message: '测试结果提交失败，请稍后重试!'
                  })
                }
                if (res.data.statuscode === 400 && res.data.msg === '当前阶段还未完成，请等完成后再操作!') {
                  this.$message({
                    type: 'error',
                    message: '当前阶段修改中，请完成后再提交测试结果！'
                  })
                }
              })
              .catch(err => {
                console.log(err)
              })
          }, 1000)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .projectPhase-dialog-container{
    .el-dialog{
      box-sizing: border-box;
      min-width: 600px;
      width: 40%;
      .el-input,.el-date-picker,.textarea{
        width: 400px;
      }
      .el-textarea__inner {
        resize:none;
      }
      .el-textarea .el-input__count {
        bottom: 2px;
        line-height: 160%;
      }
    }
  }
</style>
