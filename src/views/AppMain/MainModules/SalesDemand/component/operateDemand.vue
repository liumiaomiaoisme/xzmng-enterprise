<template>
   <el-dialog :title="title.titleName" :visible.sync="this.$store.state.overDemandvisible" class="demand-dialog-container" :close-on-click-modal="false">
      <el-form :model="demandForm" status-icon ref="demandForm" :rules="dowhat===2 ? rules2:rules1">
        <el-form-item label="需求修改人或组" :label-width="formLabelWidth" prop="modifier" v-if="dowhat===2">
          <el-cascader :key="isResouceGet" v-model="demandForm.modifier"  label="需求修改人或组" placeholder="试试搜索：小组名" :options="options" filterable></el-cascader>
        </el-form-item>
        <el-form-item :label="title.feedbackName" :label-width="formLabelWidth" prop="feedback">
          <el-input class="textarea" type="textarea" :autosize='false' placeholder="请输入反馈" v-model="demandForm.feedback" maxlength="50" show-word-limit></el-input>
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
  props: ['overId', 'dowhat', 'group', 'isResouceGet'],
  data () {
    return {
      formLabelWidth: '128px',
      rules1: {
        modifier: [
          { required: true, message: '请选择修改人', trigger: 'blur' }
        ],
        feedback: [
          { required: true, message: '请输入反馈建议', trigger: 'blur' }
        ]
      },
      rules2: {
        feedback: [
          { required: true, message: '请输入反馈建议', trigger: 'blur' }
        ]
      },
      timer: null,
      demandForm: {
        modifier: [0, 0],
        feedback: ''
      },
      options: [{
        value: 0,
        label: '修改人',
        children: [{
          value: 0,
          label: '当前用户-' + this.$store.state.userName
        }]
      }, {
        value: 1,
        label: '修改组',
        children: this.group
      }]
    }
  },
  computed: {
    title () {
      let title = {
        titleName: '',
        feedbackName: ''
      }
      if (this.dowhat === 0) {
        title.titleName = '完成需求'
        title.feedbackName = '完成反馈'
      } else if (this.dowhat === 1) {
        title.titleName = '驳回需求'
        title.feedbackName = '驳回反馈'
      } else if (this.dowhat === 2) {
        title.titleName = '领取需求'
        title.feedbackName = '领取反馈'
      }
      return title
    }
  },
  methods: {
    closeDialog () {
      this.$refs['demandForm'].resetFields()
      this.$store.state.overDemandvisible = false
    },
    editDemand () {
      let that = this
      function doPost (api, dowhat) {
        that.$axios.fetchPost(api, that.demandForm)
          .then(res => {
            console.log(res)
            if (res.data.statuscode === 200) {
              that.$store.commit('getSalesDemand', {
                currentPage: 1
              })
              that.closeDialog()
              that.$message({
                type: 'success',
                message: dowhat + '需求成功!'
              })
            } else if (res.data.statuscode === 400 && res.data.msg === dowhat + '需求失败，请稍后重试！') {
              that.closeDialog()
              that.$message({
                type: 'error',
                message: dowhat + '需求失败，请稍后重试！'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
      this.$refs['demandForm'].validate((valid) => {
        if (valid) {
          this.demandForm.demandId = this.overId
          if (this.dowhat === 0) {
            delete this.demandForm.modifier
            doPost('/api/market_demand/end', '完成')
          } else if (this.dowhat === 1) {
            delete this.demandForm.modifier
            doPost('/api/market_demand/reject', '驳回')
          } else if (this.dowhat === 2) {
            if (this.demandForm.modifier[0] === 0) {
              this.demandForm.modifyObject = 1
            } else {
              this.demandForm.modifyObject = 2
            }
            this.demandForm.modifyId = this.demandForm.modifier[1]
            doPost('/api/market_demand/receive', '领取')
          }
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
  .demand-dialog-container{
    .el-dialog{
      min-width: 600px !important;
      max-width: 600px !important;
    }
    .el-dialog .textarea,.el-dialog .el-input {
      width: 420px;
    }
  }
</style>
