<template>
   <el-dialog title="添加项目阶段" :visible.sync="this.$store.state.addProjectPhaseVisible" class="projectPhase-dialog-container" :before-close="closeDialog">
      <el-form :model="addProjectPhaseForm" status-icon ref="addProjectPhaseForm" :rules="rules">
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="tecStageProject">
          <el-select v-model="addProjectPhaseForm.tecStageProject" placeholder="请选择项目名称">
            <el-option :label="item.tecProjectName" :value="item.tecProjectId" v-for="item in this.$store.state.projectsList" :key="item.tecProjectId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开发负责人" :label-width="formLabelWidth" prop="tecDevPrincipal">
          <el-select v-model="addProjectPhaseForm.tecDevPrincipal" placeholder="请选择开发负责人">
            <el-option :label="item.empName" :value="item.empId" v-for="item in this.$store.state.staffList" :key="item.empId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目领取时间" :label-width="formLabelWidth" prop="tecStageReceiveDate">
          <el-date-picker
            v-model="addProjectPhaseForm.tecStageReceiveDate"
            type="datetime"
            format="yyyy-MM-dd hh:mm:ss"
            value-format="yyyy-MM-dd hh:mm:ss"
            placeholder="请选择项目领取时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目阶段状态" :label-width="formLabelWidth" prop="tecStageStatus">
          <el-select v-model="addProjectPhaseForm.tecStageStatus" placeholder="请选择项目阶段状态">
            <el-option :label="item.StatusName" :value="item.StatusId" v-for="item in stageStatus" :key="item.StatusId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目测试状态" :label-width="formLabelWidth" prop="tecStageTestStatus">
          <el-select v-model="addProjectPhaseForm.tecStageTestStatus" placeholder="请选择测试状态">
            <el-option :label="item.StatusName" :value="item.StatusId" v-for="item in stageTestStatus" :key="item.StatusId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="测试反馈意见" :label-width="formLabelWidth" prop="tecStageFeedback">
          <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入测试反馈意见" v-model="addProjectPhaseForm.tecStageFeedback" maxlength="50" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog" size="small">取 消</el-button>
        <el-button type="primary" @click="addProjectPhase" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  props: ['stageStatus', 'stageTestStatus'],
  data () {
    return {
      autosize: false,
      addProjectPhaseForm: {
      },
      formLabelWidth: '126px',
      rules: {
        tecStageProject: [
          { required: true, message: '请选择项目名称', trigger: 'blur' }
        ],
        tecDevPrincipal: [
          { required: true, message: '请选择开发负责人', trigger: 'blur' }
        ],
        tecStageReceiveDate: [
          { required: true, message: '请选择项目领取时间', trigger: 'blur' }
        ],
        tecStageStatus: [
          { required: true, message: '请选择项目阶段状态', trigger: 'blur' }
        ],
        tecStageTestStatus: [
          { required: true, message: '请选择测试状态', trigger: 'blur' }
        ],
        tecStageFeedback: [
          { required: true, message: '请输入测试反馈意见', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    closeDialog () {
      this.$store.commit('closeAddProjectPhase')
      this.$refs['addProjectPhaseForm'].resetFields()
    },
    addProjectPhase () {
      this.$refs['addProjectPhaseForm'].validate((valid) => {
        if (valid) {
          this.$axios.fetchPost('/api/stage/add', this.addProjectPhaseForm)
            .then(res => {
              if (res.data.statuscode === 200) {
                this.$store.commit('getProjectPhaseList', {
                  currentPage: 1
                })
                this.closeDialog()
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
