<template>
   <el-dialog v-loading.fullscreen.lock="loading" title="编辑项目" :visible.sync="this.$store.state.editDialogVisible" class="project-dialog-container" :close-on-click-modal="false">
      <el-form :model="addProjectForm" status-icon ref="addProjectForm" size="small" :rules="rules">
        <el-form-item label="项目名称" :label-width="formLabelWidth" prop="tecProjectName">
          <el-input v-model="addProjectForm.tecProjectName" autocomplete="off" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="项目成员" :label-width="formLabelWidth" prop="empId">
          <el-select v-model="addProjectForm.empId" multiple placeholder="请选择成员">
            <el-option
              v-for="item in this.$store.state.staffList" :key="item.empId" :label="item.empName" :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目简要" :label-width="formLabelWidth" prop="tecProjectDesc">
          <el-input class="textarea" type="textarea" :autosize='autosize' placeholder="请输入项目简要" v-model="addProjectForm.tecProjectDesc" maxlength="50" show-word-limit></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="项目负责人" :label-width="formLabelWidth" prop="tecProjectPrincipal">
              <el-select v-model="addProjectForm.tecProjectPrincipal" placeholder="请选择项目负责人">
                <el-option :label="item.empName" :value="item.empId" v-for="item in this.$store.state.staffList" :key="item.empId"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="项目开始日期" :label-width="formLabelWidth" prop="tecProjectStartDate">
              <el-date-picker
                v-model="addProjectForm.tecProjectStartDate"
                type="date"
                placeholder="选择项目开始日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="项目预完成日期" :label-width="formLabelWidth" prop="tecProjectEstimatedEndDate">
              <el-date-picker
                v-model="addProjectForm.tecProjectEstimatedEndDate"
                type="date"
                placeholder="选择项目预完成日期"
                :picker-options="EstimatedEndDate">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="项目发布日期" :label-width="formLabelWidth" prop="tecProjectPublishDate">
              <el-date-picker
                v-model="addProjectForm.tecProjectPublishDate"
                type="date"
                placeholder="选择项目发布日期"
                :picker-options="PublishDate">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12" class="short-input-con">
            <el-form-item label="预计承载量" :label-width="formLabelWidth" prop="tecProjectCapacity">
              <el-input type="number" v-model.number="addProjectForm.tecProjectCapacity" autocomplete="off" placeholder="请输入预计承载量"></el-input>
            </el-form-item>
            <el-form-item label="项目周期" :label-width="formLabelWidth" prop="tecProjectCycle">
              <el-input type="number" v-model.number="addProjectForm.tecProjectCycle" autocomplete="off" placeholder="请输入项目周期"></el-input>
            </el-form-item>
            <el-form-item label="项目版本" :label-width="formLabelWidth" prop="tecProjectVersion">
              <el-autocomplete v-model="addProjectForm.tecProjectVersion" :fetch-suggestions="querySearch" placeholder="请项目版本"></el-autocomplete>
            </el-form-item>
            <el-form-item label="项目logo" :label-width="formLabelWidth" prop="tecProjectLogourl">
          <el-upload
            class="avatar-uploader" name="upload-file"
            action="http://47.100.56.42:9876/upload"
            :show-file-list="false"
            enctype="multipart/form-data"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="addProjectForm.tecProjectLogourl" :src="addProjectForm.tecProjectLogourl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
          </el-col>
        </el-row>
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
        <el-button type="primary" @click="editProject" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  data () {
    let validate = (rule, value, callback) => {
      if (value !== this.$store.state.checkName) {
        this.$axios.fetchGet('/api/project/checkName', {
          tecProjectName: value
        }).then(res => {
          if (res && res.data.statuscode === 400 && res.data.msg === '对不起，该项目名称已存在！') {
            callback(new Error())
          } else {
            callback()
          }
        })
      } else {
        callback()
      }
    }
    return {
      checkName: this.$store.state.checkName,
      confirmVisible: false,
      autosize: false,
      relativePath: '',
      formLabelWidth: '126px',
      staffList: [],
      groupType: [],
      rules: {
        tecProjectName: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
          { validator: validate, message: '对不起，该项目名称已存在，请重新输入！', trigger: 'blur' }
        ],
        tecProjectPrincipal: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ],
        tecProjectCycle: [
          { required: true, message: '请输入项目周期', trigger: 'blur' },
          { type: 'number', message: '项目周期应为数字值', trigger: 'blur' }
        ],
        tecProjectStartDate: [
          { type: 'date', required: true, message: '请选择项目开始日期', trigger: 'blur' }
        ],
        tecProjectEstimatedEndDate: [
          { type: 'date', required: true, message: '请选择项目预计结束日期', trigger: 'blur' }
        ],
        tecProjectDesc: [
          { required: true, message: '请输入项目简要', trigger: 'blur' }
        ],
        tecProjectVersion: [
          { required: true, message: '请输入项目版本', trigger: 'blur' }
        ],
        tecProjectPublishDate: [
          { type: 'date', required: true, message: '请选择发布日期', trigger: 'change' }
        ],
        tecProjectCapacity: [
          { required: true, message: '请输入预计承载量', trigger: 'blur' },
          { type: 'number', message: '预计承载量应为数字值', trigger: 'blur' }
        ],
        empId: [
          { required: true, message: '请选择成员', trigger: 'blur' }
        ]
      },
      loading: false,
      version: []
    }
  },
  created () {
    this.$store.commit('getAllMember')
  },
  mounted () {
    this.version = this.loadVersion()
  },
  computed: {
    addProjectForm () {
      return this.$store.state.editProjectFormData
    },
    EstimatedEndDate () {
      return {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.addProjectForm.tecProjectStartDate).getTime()
        }
      }
    },
    PublishDate () {
      return {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.addProjectForm.tecProjectEstimatedEndDate).getTime()
        }
      }
    }
  },
  methods: {
    querySearch (queryString, cb) {
      let version = this.version
      let results = queryString ? version.filter(this.createFilter(queryString)) : version
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (version) => {
        return (version.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    loadVersion () {
      return [
        { 'value': 'ProductVersion1.1' },
        { 'value': 'ProductVersion2.1' },
        { 'value': 'TestVersion1.1' },
        { 'value': 'TestVersion2.1' }]
    },
    editProject () {
      this.loading = true
      this.$refs['addProjectForm'].validate((valid) => {
        if (valid) {
          let addForm = { ...this.addProjectForm }
          switch (addForm.tecProjectStatus) {
            case '未开始':
              addForm.tecProjectStatus = 0
              break
            case '进行中':
              addForm.tecProjectStatus = 1
              break
            case '已结束':
              addForm.tecProjectStatus = 2
              break
          }
          addForm.tecProjectEstimatedEndDate = this.getFormatDate(addForm.tecProjectEstimatedEndDate)
          addForm.tecProjectPublishDate = this.getFormatDate(addForm.tecProjectPublishDate)
          addForm.tecProjectStartDate = this.getFormatDate(addForm.tecProjectStartDate)
          addForm.empId = addForm.empId.toString()
          if (addForm.tecProjectLogourl.indexOf('http://47.100.56.42:9876') === -1) {
            addForm.tecProjectLogourl = 'http://47.100.56.42:9876' + this.relativePath
          }
          delete addForm.members
          delete addForm.tecProjectCreateDate
          this.$axios.fetchPost('/api/project/update', addForm)
            .then(res => {
              console.log(res)
              if (res.data.statuscode === 200) {
                this.$store.commit('getProjectList', {
                  currentPage: 1
                })
                this.closeDialog()
              }
              this.loading = false
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
    closeDialog () {
      this.confirmVisible = false
      this.$store.commit('closeEditDialog')
      this.$refs['addProjectForm'].resetFields()
    },
    getFormatDate (timestr) {
      let newTime = new Date(timestr)
      let y = newTime.getFullYear()
      let mo = (newTime.getMonth() + 1).toString().padStart(2, '0')
      let d = newTime.getDate().toString().padStart(2, '0')
      return `${y}-${mo}-${d}`
    },
    addProject () {
      this.$refs['addProjectForm'].validate((valid) => {
        if (valid) {
          let addForm = this.addProjectForm
          addForm.tecProjectStatus = parseInt(this.addProjectForm.tecProjectStatus)
          addForm.tecProjectEstimatedEndDate = this.getFormatDate(this.addProjectForm.tecProjectEstimatedEndDate)
          addForm.tecProjectPublishDate = this.getFormatDate(this.addProjectForm.tecProjectPublishDate)
          addForm.tecProjectStartDate = this.getFormatDate(this.addProjectForm.tecProjectStartDate)
          addForm.empId = this.addProjectForm.empId.toString()
          addForm.tecProjectLogourl = 'http://47.100.56.42:9876' + this.relativePath
          console.log(addForm)
          this.$axios.fetchPost('/api/project/add', addForm)
            .then(res => {
              if (res.data.statuscode === 200) {
                this.$store.commit('getProjectList', {
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
    },
    handleAvatarSuccess (res, file) {
      this.addProjectForm.tecProjectLogourl = URL.createObjectURL(file.raw)
      this.relativePath = res.relativePath
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片仅支持JPG、JPEG、PNG、GIF 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
