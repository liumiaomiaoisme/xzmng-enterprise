<template>
  <el-dialog title="会议总结" v-loading.fullscreen.lock="loading" :visible.sync="this.$store.state.editEndMeetingVisible" class="meeting-dialog-container small-dialog" :before-close="MaskCantClose">
    <el-form :model="addMeetingForm" status-icon ref="addMeetingForm" size="small" :rules="rules">
      <el-form-item label="会议名称" :label-width="formLabelWidth" prop="tecMeetingName">
        <el-input :disabled="true" v-model="addMeetingForm.tecMeetingName"></el-input>
      </el-form-item>
      <el-form-item label="延期结束时间" :label-width="formLabelWidth" prop="tecMeetingEndDate">
        <el-date-picker
          v-model="addMeetingForm.tecMeetingEndDate"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="MeetingEndDate"
          placeholder="延期结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否解决了问题" :label-width="formLabelWidth" prop="tecMeetingSolveProblem">
        <el-select v-model="addMeetingForm.tecMeetingSolveProblem" placeholder="请选择是否解决了问题">
          <el-option label="未解决" value="0"></el-option>
          <el-option label="已解决" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会议总结" :label-width="formLabelWidth" prop="tecMeetingSummary">
        <el-input class="textarea" type="textarea" :autosize='autosize' :rows="8" placeholder="请输入会议总结" v-model="addMeetingForm.tecMeetingSummary" maxlength="200" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="closeDialog" size="small">取 消</el-button>
      <el-button type="primary" @click="editMeeting" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      confirmVisible: false,
      autosize: false,
      formLabelWidth: '126px',
      rules: {
        tecMeetingEndDate: [
          { required: true, message: '请选择会议结束时间', trigger: 'blur' }
        ],
        tecMeetingSolveProblem: [
          { required: true, message: '请选择会议是否解决了问题', trigger: 'blur' }
        ],
        tecMeetingSummary: [
          { required: true, message: '请填写会议总结', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  computed: {
    addMeetingForm () {
      return this.$store.state.editMeetingForm
    },
    MeetingEndDate () {
      let range
      if (this.addMeetingForm.tecMeetingStartDate && this.addMeetingForm.tecMeetingEndDate) {
        let startDate = this.addMeetingForm.tecMeetingStartDate.substr(0, 10)
        let endDate = this.addMeetingForm.tecMeetingEndDate.substr(0, 10)
        if (startDate === endDate) {
          let time = this.addMeetingForm.tecMeetingStartDate.substr(11, 8)
          range = time + '- 23:59:59'
        } else {
          range = '00:00:00 - 23:59:59'
        }
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
    MaskCantClose () {},
    closeDialog () {
      this.confirmVisible = false
      this.$store.commit('closeEditEndMeeting')
      this.$refs['addMeetingForm'].resetFields()
    },
    editMeeting () {
      this.loading = true
      this.$refs['addMeetingForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.addMeetingForm }
          addForm.empId = addForm.empId.toString()
          if (addForm.tecMeetingSolveProblem !== undefined) {
            if (addForm.tecMeetingSolveProblem === '未解决') {
              addForm.tecMeetingSolveProblem = 0
            } else if (addForm.tecMeetingSolveProblem === '已解决') {
              addForm.tecMeetingSolveProblem = 1
            }
          }
          if (addForm.tecMeetingSummary === '') {
            delete addForm.tecMeetingSummary
          }
          this.$axios.fetchPost('/api/meeting/update', addForm)
            .then(res => {
              if (res.data.statuscode === 200) {
                this.loading = false
                this.closeDialog()
                this.$store.commit('getMeetingList', {
                  currentPage: 1
                })
                this.$message({
                  message: '编辑成功',
                  type: 'success'
                })
              }
            })
            .catch(err => {
              this.loading = false
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
