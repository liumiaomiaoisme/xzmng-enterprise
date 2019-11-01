<template>
  <el-dialog title="编辑会议" :visible.sync="this.$store.state.editMeetingVisible" class="meeting-dialog-container" :before-close="MaskCantClose">
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
          format="yyyy-MM-dd hh:mm:ss"
          value-format="yyyy-MM-dd hh:mm:ss"
          :picker-options="MeetingStartDate"
          placeholder="选择会议开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="会议结束时间" :label-width="formLabelWidth" prop="tecMeetingEndDate">
        <el-date-picker
          v-model="addMeetingForm.tecMeetingEndDate"
          type="datetime"
          format="yyyy-MM-dd hh:mm:ss"
          value-format="yyyy-MM-dd hh:mm:ss"
          :picker-options="MeetingEndDate"
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
      <el-form-item label="会议总结" :label-width="formLabelWidth" prop="tecMeetingSummary">
        <el-input class="textarea" type="textarea" :autosize='autosize' :rows="8" placeholder="请输入会议总结" v-model="addMeetingForm.tecMeetingSummary" maxlength="200" show-word-limit></el-input>
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
      timer: null
    }
  },
  computed: {
    addMeetingForm () {
      return this.$store.state.editMeetingForm
    },
    MeetingStartDate () {
      return {
        disabledDate: (time) => {
          return time.getTime() > new Date(this.addMeetingForm.tecMeetingEndDate).getTime()
        }
      }
    },
    MeetingEndDate () {
      return {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.addMeetingForm.tecMeetingStartDate).getTime()
        }
      }
    }
  },
  methods: {
    MaskCantClose () {},
    closeDialog () {
      this.confirmVisible = false
      this.$store.commit('closeEditMeeting')
      this.$refs['addMeetingForm'].resetFields()
    },
    editMeeting () {
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
          clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.$axios.fetchPost('/api/meeting/update', addForm)
              .then(res => {
                if (res.data.statuscode === 200) {
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
                console.log(err)
              })
          }, 1000)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
