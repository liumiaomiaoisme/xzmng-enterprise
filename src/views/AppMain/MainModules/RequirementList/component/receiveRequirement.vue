<template>
   <el-dialog v-loading.fullscreen.lock="loading" title="领取需求" :visible.sync="this.$store.state.receiveRequireVisible" class="Requirement-dialog-container" :close-on-click-modal="false">
      <el-form :model="receiveDemandForm" status-icon ref="receiveDemandForm" :rules="rules">
        <el-row>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="需求名称" :label-width="formLabelWidth">
              <el-input :disabled="true" v-model="this.$store.state.requireFormSubmitData.tecDemandName"></el-input>
            </el-form-item>
            <el-form-item label="需求修改人或组" :label-width="formLabelWidth" prop="modifier">
              <el-cascader :key="this.$store.state.isResouceGet" v-model="receiveDemandForm.modifier"  label="需求修改人或组" placeholder="请选择修改组名或修改人" :options="options" filterable></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="所在项目" :label-width="formLabelWidth">
              <el-select v-model="this.$store.state.requireFormSubmitData.tecDemandProjectId" placeholder="请选择所在项目" :disabled="true">
                <el-option :label="item.name" :value="item.id" v-for="(item, i) in this.$store.state.projectsForRequire" :key="'ProjectId '+i"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="预计完成日期" :label-width="formLabelWidth" prop="tecDemandExpectedRepairDate">
              <el-date-picker
                v-model="receiveDemandForm.tecDemandExpectedRepairDate"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="ExpectedRepairDate"
                placeholder="选择预计完成日期">
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
      formLabelWidth: '126px',
      receiveDemandForm: {
        modifier: [0, 0],
        tecDemandExpectedRepairDate: ''
      },
      rules: {
        modifier: [
          { required: true, message: '请选择需求修改人或组', trigger: 'blur' }
        ],
        tecDemandExpectedRepairDate: [
          { required: true, message: '请选择预期完成时间', trigger: 'blur' }
        ]
      },
      timer: null,
      userGroupSelect: [],
      userTeam: [],
      options: [{
        value: 0,
        label: '修改人',
        children: []
      }, {
        value: 1,
        label: '修改组',
        children: []
      }],
      loading: false
    }
  },
  computed: {
    ExpectedRepairDate () {
      let range
      let createTime = this.$store.state.requireFormSubmitData.tecDemandCreateDate
      let repairTime = this.receiveDemandForm.tecDemandExpectedRepairDate
      if (createTime && repairTime) {
        if (createTime.substr(0, 10) === repairTime.substr(0, 10)) {
          let time = createTime.substr(11, 8)
          range = time + ' - 23:59:59'
        } else {
          range = '00:00:00 - 23:59:59'
        }
      } else {
        range = '00:00:00 - 23:59:59'
      }
      return {
        selectableRange: [range],
        disabledDate: (time) => {
          return time.getTime() < new Date(this.$formatTime.formatTime()).getTime() - 8.64e7
        }
      }
    }
  },
  created () {
    this.getModifyDate()
  },
  methods: {
    getModifyDate () {
      this.$axios.fetchGet('/api/demand/group')// 获取用户为组长的组
        .then(res => {
          if (res.data.statuscode === 200) {
            let userGroupOrigin = res.data.content
            if (userGroupOrigin) {
              userGroupOrigin.forEach(item => {
                let obj = {}
                obj.value = item.tecGroupId
                obj.label = item.tecGroupName
                this.userTeam.push(obj)
              })
            }
          } else if (res.data.statuscode === 400 && res.data.msg === '暂无小组信息') {
            this.userTeam = null
          }
          console.log(this.userTeam)
          this.options[0].children.push({
            value: 0,
            label: '当前用户-' + this.$store.state.userName
          })
          this.options[1].children = this.userTeam
          if (this.userTeam === null) {
            this.options[1].disabled = true
            this.options[1].label = '无可选修改组'
          }
          console.log(this.options)
        })
    },
    closeDialog () {
      this.$store.commit('closeReceiveRequire')
      this.$refs['receiveDemandForm'].resetFields()
      this.modifier = [0, this.$store.state.userId]
    },
    editRequirement () {
      this.loading = true
      this.$refs['receiveDemandForm'].validate((valid) => {
        if (valid) {
          let addForm = {
            tecDemandId: this.$store.state.requireFormSubmitData.tecDemandId,
            tecDemandExpectedRepairDate: this.receiveDemandForm.tecDemandExpectedRepairDate
          }
          console.log(this.receiveDemandForm.modifier)
          if (this.receiveDemandForm.modifier[0] === 0) {
            addForm.tecDemandModifierPersonal = this.$store.state.userId
          } else if (this.receiveDemandForm.modifier[0] === 1) {
            addForm.tecDemandModifierGroup = this.receiveDemandForm.modifier[1]
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
              this.loading = false
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
