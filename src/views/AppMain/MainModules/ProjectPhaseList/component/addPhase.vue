<template>
   <el-dialog title="添加项目阶段" :visible.sync="this.$store.state.addProjectPhaseVisible" class="projectPhase-dialog-container small-dialog" :close-on-click-modal="false">
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
        <el-button type="primary" @click="addProjectPhase" size="small">确 定</el-button>
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
      timer: null,
      lastTime: 0
    }
  },
  methods: {
    closeDialog () {
      this.confirmVisible = false
      this.$store.commit('closeAddProjectPhase')
      this.$refs['addProjectPhaseForm'].resetFields()
    },
    addProjectPhase () {
      this.$throttle.throttle.apply(this, [this.add])
    },
    add () {
      this.$refs['addProjectPhaseForm'].validate((valid) => {
        if (valid) {
          this.$axios.fetchPost('/api/stage/add', this.addProjectPhaseForm)
            .then(res => {
              if (res.data.statuscode === 200) {
                this.$store.commit('getProjectPhaseList', {
                  currentPage: 1
                })
                this.closeDialog()
                this.$message({
                  type: 'success',
                  message: '添加成功!'
                })
              } else if (res.data.statuscode === 400 && res.data.msg === '添加阶段失败，项目还未开始，请稍后重试！') {
                this.closeDialog()
                this.$message({
                  type: 'error',
                  message: '添加阶段失败，该项目尚未开始，请稍后重试！!'
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
