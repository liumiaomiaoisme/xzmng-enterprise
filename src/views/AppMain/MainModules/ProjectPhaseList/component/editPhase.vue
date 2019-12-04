<template>
   <el-dialog title="编辑项目阶段" :visible.sync="this.$store.state.editProjectPhaseVisible" class="projectPhase-dialog-container small-dialog" :close-on-click-modal="false">
     <el-form :model="addProjectPhaseForm" status-icon ref="addProjectPhaseForm" :rules="rules">
        <el-form-item label="项目阶段名称" :label-width="formLabelWidth" prop="tecStageName">
          <el-input v-model="addProjectPhaseForm.tecStageName" autocomplete="off" placeholder="请输入项目阶段名称"></el-input>
        </el-form-item>
        <el-form-item label="所属项目名称" :label-width="formLabelWidth" prop="tecStageProject">
          <el-select v-model="addProjectPhaseForm.tecStageProject" placeholder="请选择项目名称">
            <el-option :label="item.tecProjectName" :value="item.tecProjectId" v-for="item in this.$store.state.projectsList" :key="item.tecProjectId"></el-option>
          </el-select>
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
        <el-button type="primary" @click="editPhase" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  props: ['stageStatus', 'stageTestStatus'],
  data () {
    return {
      confirmVisible: false,
      addProjectPhaseForm: {
        tecStageProject: '',
        tecStageName: ''
      },
      formLabelWidth: '126px',
      rules: {
        tecStageProject: [
          { required: true, message: '请选择项目名称', trigger: 'blur' }
        ],
        tecStageName: [
          { required: true, message: '请输入项目阶段名称', trigger: 'blur' }
        ]
      },
      timer: null
    }
  },
  // computed: {
  //   addProjectPhaseForm () {
  //     return this.$store.state.editProjectPhaseForm
  //   }
  // },
  methods: {
    closeDialog () {
      this.confirmVisible = false
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
