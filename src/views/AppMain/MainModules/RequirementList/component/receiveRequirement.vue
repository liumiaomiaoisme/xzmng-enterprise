<template>
   <el-dialog title="领取需求" :visible.sync="this.$store.state.receiveRequireVisible" class="Requirement-dialog-container" :close-on-click-modal="false">
      <el-form :model="addRequirementForm" status-icon ref="addRequirementForm" :rules="rules">
        <el-row>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="需求名称" :label-width="formLabelWidth" prop="tecDemandName">
              <el-input :disabled="true" v-model="addRequirementForm.tecDemandName"></el-input>
            </el-form-item>
            <el-form-item label="需求修改人或组" :label-width="formLabelWidth" prop="Modifier">
              <el-cascader :key="this.$store.state.isResouceGet" v-model="addRequirementForm.Modifier"  label="需求修改人或组" placeholder="试试搜索：小组名或人名" :options="options" filterable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="所在项目" :label-width="formLabelWidth" prop="tecDemandProjectId">
              <el-select v-model="addRequirementForm.tecDemandProjectId" placeholder="请选择所在项目" :disabled="true">
                <el-option :label="item.name" :value="item.id" v-for="(item, i) in this.$store.state.projectsForRequire" :key="'ProjectId '+i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预计完成日期" :label-width="formLabelWidth" prop="tecDemandExpectedRepairDate">
              <el-date-picker type="datetime" placeholder="选择预计完成日期"
                v-model="addRequirementForm.tecDemandExpectedRepairDate"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="ExpectedRepairDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
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
        Modifier: [
          { required: true, message: '请选择需求修改人或组', trigger: 'blur' }
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
      }]
    }
  },
  computed: {
    addRequirementForm () {
      return this.$store.state.requireFormSubmitData
    },
    ExpectedRepairDate () {
      let range
      if (this.addRequirementForm.tecDemandCreateDate) {
        let time = this.addRequirementForm.tecDemandCreateDate.substr(11, 8)
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
      this.$store.commit('closeReceiveRequire')
      this.$refs['addRequirementForm'].resetFields()
    },
    editRequirement () {
      this.$refs['addRequirementForm'].validate((valid) => {
        if (valid) {
          let addForm = {
            tecDemandId: this.addRequirementForm.tecDemandId,
            tecDemandExpectedRepairDate: this.addRequirementForm.tecDemandExpectedRepairDate
          }
          if (this.addRequirementForm.Modifier[0] === 0) {
            addForm.tecDemandModifierPersonal = this.addRequirementForm.Modifier[1]
          } else if (this.addRequirementForm.Modifier[0] === 1) {
            addForm.tecDemandModifierGroup = this.addRequirementForm.Modifier[2]
          }
          this.$axios.fetchPost('/api/demand/receive', addForm)
            .then(res => {
              console.log(res)
              if (res.data.statuscode === 200) {
                this.$store.commit('getRequirementList', {
                  currentPage: 1
                })
                this.closeDialog()
                this.$message({
                  type: 'success',
                  message: '领取需求成功!'
                })
              } else if (res.data.statuscode === 400 && res.data.msg === '领取需求失败，请稍后重试！') {
                this.closeDialog()
                this.$message({
                  type: 'error',
                  message: '领取需求失败，请稍后重试！!'
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
