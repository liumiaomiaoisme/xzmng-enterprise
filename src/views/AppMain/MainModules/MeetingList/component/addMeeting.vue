<template>
   <el-dialog v-loading.fullscreen.lock="loading" title="添加会议" :visible.sync="this.$store.state.addMeetingVisible" :before-close="MaskCantClose" class="meeting-dialog-container small-dialog">
      <el-form :model="addMeetingForm" status-icon ref="addMeetingForm" size="small" :rules="rules">
        <el-form-item label="会议名称" :label-width="formLabelWidth" prop="tecMeetingName">
          <el-input v-model="addMeetingForm.tecMeetingName" autocomplete="off" placeholder="请输入会议名称"></el-input>
        </el-form-item>
        <el-form-item label="会议主持人" :label-width="formLabelWidth" prop="tecMeetingHost">
          <el-select v-model="addMeetingForm.tecMeetingHost" placeholder="请选择会议主持人">
            <el-option :label="item.empName" :value="item.empId" v-for="item in this.$store.state.staffList" :key="item.empId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议成员" :label-width="formLabelWidth" prop="empId">
          <el-select v-model="addMeetingForm.empId" multiple placeholder="请选择会议成员">
            <el-option :label="item.empName" :value="item.empId" v-for="item in this.$store.state.staffList" :key="item.empId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会议开始时间" :label-width="formLabelWidth" prop="tecMeetingStartDate">
          <el-date-picker
            v-model="addMeetingForm.tecMeetingStartDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="MeetingStartDate"
            placeholder="选择会议开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议结束时间" :label-width="formLabelWidth" prop="tecMeetingEndDate">
          <el-date-picker
            v-model="addMeetingForm.tecMeetingEndDate"
            type="datetime"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="MeetingEndDate"
            placeholder="选择会议结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="会议精神" :label-width="formLabelWidth" prop="tecMeetingSpirit">
          <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入会议精神" v-model="addMeetingForm.tecMeetingSpirit" maxlength="50" show-word-limit></el-input>
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
        <el-button type="primary" @click="addMeeting" size="small">确 定</el-button>
      </div>
   </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      confirmVisible: false,
      autosize: false,
      addMeetingForm: {
        tecMeetingName: '',
        tecMeetingStartDate: this.$formatTime.formatTime(),
        tecMeetingEndDate: '',
        tecMeetingHost: null,
        tecMeetingSpirit: '',
        empId: ''
      },
      formLabelWidth: '126px',
      rules: {
        tecMeetingName: [
          { required: true, message: '请输入会议名称', trigger: 'blur' }
        ],
        tecMeetingStartDate: [
          { required: true, message: '请选择会议开始时间', trigger: 'blur' }
        ],
        tecMeetingEndDate: [
          { required: true, message: '请选择会议结束时间', trigger: 'blur' }
        ],
        tecMeetingHost: [
          { required: true, message: '请选择会议主持人', trigger: 'change' }
        ],
        tecMeetingSpirit: [
          { required: true, message: '请输入会议精神', trigger: 'change' }
        ],
        tecMeetingSolveProblem: [
          { required: true, message: '请选择会议是否解决了问题', trigger: 'blur' }
        ],
        empId: [
          { required: true, message: '请选择会议成员', trigger: 'blur' }
        ]
      },
      lastTime: 0,
      loading: false
    }
  },
  computed: {
    MeetingStartDate () {
      let range
      if (this.addMeetingForm.tecMeetingEndDate) {
        let time = this.addMeetingForm.tecMeetingEndDate.substr(11, 8)
        range = '00:00:00 - ' + time
      } else {
        range = '00:00:00 - 23:59:59'
      }
      return {
        selectableRange: [range],
        disabledDate: (time) => {
          return time.getTime() > new Date(this.addMeetingForm.tecMeetingEndDate).getTime()
        }
      }
    },
    MeetingEndDate () {
      let range
      if (this.addMeetingForm.tecMeetingStartDate) {
        let time = this.addMeetingForm.tecMeetingStartDate.substr(11, 8)
        range = time + '- 23:59:59'
      } else {
        range = '00:00:00 - 23:59:59'
      }
      return {
        selectableRange: [range],
        disabledDate: (time) => {
          return time.getTime() < new Date(this.addMeetingForm.tecMeetingStartDate).getTime() - 8.64e7
        }
      }
    }
  },
  methods: {
    addMeeting () {
      this.$throttle.throttle.apply(this, [this.add])
    },
    add () {
      this.loading = true
      this.$refs['addMeetingForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.addMeetingForm }
          addForm.empId = addForm.empId.toString()
          this.$axios.fetchPost('/api/meeting/add', addForm)
            .then(res => {
              console.log(res)
              if (res.data.statuscode === 200) {
                this.loading = false
                this.closeDialog()
                this.$store.commit('getMeetingList', {
                  currentPage: 1
                })
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
              }
            })
            .catch(err => {
              console.log(err)
              this.loading = false
            })
        } else {
          this.loading = false
          console.log('error submit!!')
          return false
        }
      })
    },
    MaskCantClose () {},
    closeDialog () {
      this.confirmVisible = false
      this.$store.commit('closeAddMeeting')
      this.$refs['addMeetingForm'].resetFields()
    }
  }
}
</script>
<style lang="scss">
  .meeting-dialog-container{
    .el-dialog{
      margin-top: 5vh!important;
      box-sizing: border-box;
      min-width: 600px;
      width: 40%;
      .el-dialog__headerbtn{
        display: none!important;
      }
      .el-form-item--small.el-form-item {
          margin-bottom: 22px;
      }
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
      .pop-cancle{
        margin-right:10px;
      }
    }
     .el-dialog__body {
       padding: 10px 20px;
       color: #606266;
       font-size: 14px;
       word-break: break-all;
     }
    .el-form-item {
      margin-bottom: 10px;
    }

  }

</style>
