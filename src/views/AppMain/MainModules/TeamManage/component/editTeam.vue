<template>
   <el-dialog title="编辑技术小组" :visible.sync="ocHandler" class="add-team-container" :before-close="maskFake">
      <el-form :model="form" :rules="rules" ref="addTeamForm">
        <el-form-item label="组名称" :label-width="formLabelWidth" prop="tecGroupName">
          <el-input v-model="form.tecGroupName" autocomplete="off" placeholder="请输入组名称"></el-input>
        </el-form-item>
        <el-form-item label="组等级" :label-width="formLabelWidth" prop="tecGroupLevel">
          <el-select v-model="form.tecGroupLevel" placeholder="请选择组等级">
            <el-option label="非正式组" value="0"></el-option>
            <el-option label="正式组" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组长" :label-width="formLabelWidth" prop="tecGroupLeader">
          <el-select v-model="form.tecGroupLeader" placeholder="请选择组长">
            <el-option :label="item.empName" :value="item.empId" v-for="item in staffList" :key="item.empId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="副组长" :label-width="formLabelWidth" prop="tecGroupDeputy">
          <el-select v-model="form.tecGroupDeputy" placeholder="请选择副组长">
            <el-option :label="item.empName" :value="item.empId" v-for="item in staffList" :key="item.empId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组成员" :label-width="formLabelWidth" prop="memeberIds">
          <el-select v-model="form.memeberIds" multiple placeholder="请选择成员">
            <el-option
              v-for="item in staffList" :key="item.empId" :label="item.empName" :value="item.empId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组类型" :label-width="formLabelWidth" prop="tecGroupType">
          <el-select v-model="form.tecGroupType" placeholder="请选择组类型">
            <el-option :label="item.groupTypeName" :value="item.groupTypeId" v-for="item in groupType" :key="item.groupTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="过期时间" :label-width="formLabelWidth" prop="tecGroupExpiredDate">
          <el-date-picker
            v-model="form.tecGroupExpiredDate"
            type="datetime"
            placeholder="选择过期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="组头像" :label-width="formLabelWidth" prop="tecGroupImg">
          <el-upload
            class="avatar-uploader" name="upload-file"
            action="http://47.100.56.42:9876/upload"
            :show-file-list="false"
            enctype="multipart/form-data"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.tecGroupImg" :src="form.tecGroupImg" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
        <el-button type="primary" size="small" @click="addForm">确 定</el-button>
      </div>
    </el-dialog>
</template>

<script>
export default {
  props: ['handler', 'id', 'form'],
  data () {
    return {
      confirmVisible: false,
      relativePath: '',
      formLabelWidth: '100px',
      staffList: [],
      groupType: [],
      rules: {
        tecGroupName: [
          { required: true, message: '组名不能为空', trigger: 'blur' }
        ],
        tecGroupImg: [
          { required: true, message: '请上传组头像', trigger: 'change' }
        ],
        tecGroupLevel: [
          { required: true, message: '请选择等级', trigger: 'blur' }
        ],
        tecGroupLeader: [
          { required: true, message: '请选择组长', trigger: 'blur' }
        ],
        tecGroupDeputy: [
          { required: true, message: '请选择副组长', trigger: 'blur' }
        ],
        memeberIds: [
          { required: true, message: '请选择成员', trigger: 'blur' }
        ],
        tecGroupType: [
          { required: true, message: '请选择组类型', trigger: 'blur' }
        ],
        tecGroupExpiredDate: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ocHandler () {
      return this.handler
    }
  },
  created () {
    this.getAllMenber()
  },
  methods: {
    maskFake () {},
    closeDialog () {
      this.confirmVisible = false
      this.$emit('closeDialog')
      this.$refs['addTeamForm'].resetFields()
    },
    getFormatTime (timestr) {
      let newTime = new Date(timestr)
      let y = newTime.getFullYear()
      let mo = (newTime.getMonth() + 1).toString().padStart(2, '0')
      let d = newTime.getDate().toString().padStart(2, '0')
      let h = newTime.getHours().toString().padStart(2, '0')
      let mi = newTime.getMinutes().toString().padStart(2, '0')
      let s = newTime.getSeconds().toString().padStart(2, '0')
      return `${y}-${mo}-${d} ${h}:${mi}:${s}`
    },
    addForm () {
      this.$refs['addTeamForm'].validate((valid) => {
        if (valid) {
          if (this.form.tecGroupImg.indexOf('http://47.100.56.42:9876') === -1) {
            this.form.tecGroupImg = 'http://47.100.56.42:9876' + this.relativePath
          }
          let addForm = {
            tecGroupId: this.form.tecGroupId,
            tecGroupName: this.form.tecGroupName,
            tecGroupImg: this.form.tecGroupImg,
            tecGroupLevel: parseInt(this.form.tecGroupLevel),
            tecGroupLeader: this.form.tecGroupLeader,
            tecGroupDeputy: this.form.tecGroupDeputy,
            memeberIds: this.form.memeberIds.toString(),
            tecGroupCount: this.form.memeberIds.length + 2,
            tecGroupType: this.form.tecGroupType,
            tecGroupExpiredDate: this.getFormatTime(this.form.tecGroupExpiredDate)
          }
          this.$axios.fetchPost('/api/group/update', addForm)
            .then(res => {
              if (res.data.statuscode === 200) {
                this.$parent.getTeamList()
                this.closeDialog()
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getAllMenber () {
      this.$axios.fetchGet('api/emp/tecEmp')
        .then(res => {
          if (res.data.statuscode === 200) {
            this.staffList = res.data.content
          }
        })
      this.$axios.fetchGet('api/group/type')
        .then(res => {
          if (res.data.statuscode === 200) {
            this.groupType = res.data.content
          }
        })
    },
    handleAvatarSuccess (res, file) {
      this.form.tecGroupImg = URL.createObjectURL(file.raw)
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
