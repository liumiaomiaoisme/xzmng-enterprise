<template>
  <el-dialog v-loading.fullscreen.lock="loading" element-loading-background="rgba(0, 0, 0, 0.8)" title="编辑会议" :visible.sync="this.$store.state.editMeetingVisible" class="meeting-dialog-container small-dialog" :before-close="MaskCantClose">
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
          :disabled="addMeetingForm.tecMeetingStatus===1? true : false"
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
          :picker-options="addMeetingForm.tecMeetingStatus===1? MeetingIngEndDate:MeetingEndDate"
          placeholder="选择会议结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="是否解决了问题" :label-width="formLabelWidth" prop="tecMeetingSolveProblem">
        <el-select v-model="addMeetingForm.tecMeetingSolveProblem" placeholder="请选择是否解决了问题">
          <el-option label="未解决" value="0"></el-option>
          <el-option label="已解决" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="会议精神" :label-width="formLabelWidth" prop="tecMeetingSpirit">
        <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入会议精神" v-model="addMeetingForm.tecMeetingSpirit" maxlength="50" show-word-limit></el-input>
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
      autosize: false,
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
      loading: false
    }
  },
  computed: {
    addMeetingForm () {
      return this.$store.state.editMeetingForm
    },
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
          return time.getTime() > new Date(this.addMeetingForm.tecMeetingEndDate).getTime() - 8.64e7
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
    },
    MeetingIngEndDate () {
      let range
      if (this.addMeetingForm.tecMeetingStartDate.substr(0, 10) === this.addMeetingForm.tecMeetingEndDate.substr(0, 10)) {
        let now = new Date(new Date().getTime() + 1000 * 60 * 10)
        let hh = now.getHours().toString().padStart(2, '0')
        let mm = now.getMinutes().toString().padStart(2, '0')
        let ss = now.getSeconds().toString().padStart(2, '0')
        let timeStart = `${hh}:${mm}:${ss}`
        range = timeStart + ' - 23:59:59'
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
    MaskCantClose () {},
    closeDialog () {
      this.$store.commit('closeEditMeeting')
      this.$refs['addMeetingForm'].resetFields()
    },
    editMeeting () {
      this.loading = true
      this.$refs['addMeetingForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.addMeetingForm }
          addForm.empId = addForm.empId.toString()
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
