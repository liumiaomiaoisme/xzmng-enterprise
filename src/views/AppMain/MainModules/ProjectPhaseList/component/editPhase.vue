<template>
   <el-dialog title="编辑项目阶段" :visible.sync="this.$store.state.editProjectPhaseVisible" class="projectPhase-dialog-container" :before-close="closeDialog">
     <el-form :model="addProjectPhaseForm" status-icon ref="addProjectPhaseForm" :rules="rules">
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="tecProjectName">
          <el-select v-model="addProjectPhaseForm.tecProjectName" placeholder="请选择项目名称">
            <el-option :label="item.tecProjectName" :value="item.tecProjectId" v-for="item in this.$store.state.projectsList" :key="item.tecProjectId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开发负责人" :label-width="formLabelWidth" prop="devPrincipalName">
          <el-select v-model="addProjectPhaseForm.devPrincipalName" placeholder="请选择开发负责人">
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
        <el-button type="primary" @click="editPhase" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  props: ['stageStatus', 'stageTestStatus'],
  data () {
    return {
      autosize: false,
      formLabelWidth: '126px',
      rules: {
        tecProjectName: [
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
  computed: {
    addProjectPhaseForm () {
      return this.$store.state.editProjectPhaseForm
    }
  },
  methods: {
    closeDialog () {
      this.$store.commit('closeEditProjectPhase')
      this.$refs['addProjectPhaseForm'].resetFields()
    },
    editPhase () {
      this.$refs['addProjectPhaseForm'].validate((valid) => {
        if (valid) {
          let editForm = {}
          editForm.tecStageId = this.addProjectPhaseForm.tecStageId
          editForm.tecStageTestStatus = this.addProjectPhaseForm.tecStageTestStatus
          editForm.tecStageFeedback = this.addProjectPhaseForm.tecStageFeedback
          editForm.tecStageStatus = this.addProjectPhaseForm.tecStageStatus
          editForm.tecStageReceiveDate = this.addProjectPhaseForm.tecStageReceiveDate
          editForm.tecDevPrincipal = this.addProjectPhaseForm.tecDevPrincipal
          this.$axios.fetchPost('/api/stage/update', editForm)
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
