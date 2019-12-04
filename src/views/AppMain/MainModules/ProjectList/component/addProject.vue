<template>
   <el-dialog title="添加项目" :visible.sync="this.$store.state.addDialogVisible" class="project-dialog-container" :close-on-click-modal="false">
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
                placeholder="选择项目开始日期"
                :picker-options="EstimatedStartDate">
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
              <el-input v-model="addProjectForm.tecProjectVersion" autocomplete="off" placeholder="请输入项目版本"></el-input>
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
        <el-button type="primary" @click="addProject" size="small">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  data () {
    let validate = (rule, value, callback) => {
      this.$axios.fetchGet('/api/project/checkName', {
        tecProjectName: value
      }).then(res => {
        if (res && res.data.statuscode === 400 && res.data.msg === '对不起，该项目名称已存在！') {
          callback(new Error())
        } else {
          callback()
        }
      })
    }
    return {
      confirmVisible: false,
      autosize: false,
      addProjectForm: {
        tecProjectName: '',
        tecProjectLogourl: '',
        tecProjectPrincipal: null,
        tecProjectDesc: '',
        empId: '',
        tecProjectCycle: null,
        tecProjectStartDate: '',
        tecProjectEstimatedEndDate: '',
        tecProjectVersion: '',
        tecProjectPublishDate: '',
        tecProjectCapacity: null
      },
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
        ],
        tecProjectLogourl: [
          { required: true, message: '请上传logo', trigger: 'blur' }
        ]
      },
      lastTime: 0
    }
  },
  created () {
    this.$store.commit('getAllMember')
  },
  computed: {
    EstimatedStartDate () {
      return {
        disabledDate: (time) => {
          return time.getTime() > new Date(this.addProjectForm.tecProjectEstimatedEndDate).getTime()
        }
      }
    },
    EstimatedEndDate () {
      return {
        disabledDate: (time) => {
          return time.getTime() < new Date(this.addProjectForm.tecProjectStartDate).getTime() || time.getTime() > new Date(this.addProjectForm.tecProjectPublishDate).getTime()
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
    closeDialog () {
      this.confirmVisible = false
      this.$store.commit('closeAddDialog')
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
      this.$throttle.throttle.apply(this, [this.add])
    },
    add () {
      console.log(1)
      this.$refs['addProjectForm'].validate((valid) => {
        console.log(valid)
        if (valid) {
          let addForm = { ...this.addProjectForm }
          addForm.tecProjectEstimatedEndDate = this.getFormatDate(addForm.tecProjectEstimatedEndDate)
          addForm.tecProjectPublishDate = this.getFormatDate(addForm.tecProjectPublishDate)
          addForm.tecProjectStartDate = this.getFormatDate(addForm.tecProjectStartDate)
          addForm.empId = addForm.empId.toString()
          addForm.tecProjectLogourl = 'http://47.100.56.42:9876' + this.relativePath
          this.$axios.fetchPost('/api/project/add', addForm)
            .then(res => {
              console.log(res)
              if (res.data.statuscode === 200) {
                this.$store.commit('getProjectList', {
                  currentPage: 1
                })
                this.closeDialog()
                this.$message({
                  type: 'success',
                  message: '添加成功!'
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
<style lang="scss">
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  .el-dialog {
    box-sizing: border-box;
    min-width: 800px !important;
    width: 50%;
    .el-dialog__headerbtn{
      display: none!important;
    }
    .short-input-con {
      .el-input,.el-date-picker,.textarea{
        width: 220px;
      }
    }
    .el-input,.el-date-picker,.textarea{
      width: 600px;
    }
    .el-textarea__inner {
      resize:none;
    }
    .el-textarea .el-input__count {
      bottom: 2px;
      line-height: 160%;
    }
    .el-form-item--small.el-form-item {
        margin-bottom: 22px;
    }
    .avatar-uploader{
      height: 52px;
    }
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
     .avatar-uploader .el-upload:hover {
       border-color: #409EFF;
     }
     .avatar-uploader-icon {
       font-size: 28px;
       color: #8c939d;
       width: 50px;
       height: 50px;
       line-height: 50px;
       text-align: center;
     }
     .avatar {
       width: 50px;
       height: 50px;
       display: block;
     }
    .dialog-footer{
      .pop-cancle {
        margin-right: 10px!important;
      }
    }
  }
  .small-dialog .el-dialog{
    min-width: 660px !important;
    max-width: 660px !important;
    width: 40%;
  }
</style>
