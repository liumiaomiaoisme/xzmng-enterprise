<template>
  <div class="team-menagement-container">
    <el-button @click="getAllMenber" type="primary" size="small" icon="el-icon-circle-plus" >添加</el-button>
    <el-button type="danger" size="small" icon="el-icon-delete-solid">批量删除</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      stripe
      border
      fit>
      <el-table-column
      type="selection"
      width="55">
      </el-table-column>
      <el-table-column
        fixed
        prop="tecGroupName"
        label="组名称">
      </el-table-column>
      <el-table-column
        prop="tecGroupImg"
        label="组头像" width="100">
        <template slot-scope="scope">
           <img :src="scope.row.tecGroupImg" class="team-avatar"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="leaderName"
        label="组长">
      </el-table-column>
      <el-table-column
        prop="deputyName"
        label="副组长">
      </el-table-column>
      <el-table-column
        prop="member"
        label="成员"
        width="180">
      </el-table-column>
      <el-table-column
        prop="tecGroupCount"
        label="人数" width="80">
      </el-table-column>
      <el-table-column
        prop="tecGroupCreateDate"
        label="创建时间" >
        <template slot-scope="scope">
           <span v-html="scope.row.tecGroupCreateDate"></span>
        </template>
      </el-table-column>
      <el-table-column
        prop="groupTypeName"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="tecGroupExpiredDate"
        label="组过期时间">
        <template slot-scope="scope">
           <span v-html="scope.row.tecGroupExpiredDate"></span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template>
        <!--<template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
          <el-button type="primary" icon="el-icon-edit" circle size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalItem">
    </el-pagination>
    <el-dialog title="添加技术小组" :visible.sync="dialogFormVisible" class="add-team-container">
      <el-form :model="form" status-icon :rules="rules" ref="addTeamForm">
        <el-form-item label="组名称" :label-width="formLabelWidth" prop="tecGroupName">
          <el-input v-model="form.tecGroupName" autocomplete="off" placeholder="请输入组名称"></el-input>
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
<!--          <div class="avatar-uploader">-->
<!--            <form action="http://47.100.56.42:9876/upload" enctype="multipart/form-data" method="post" >-->
<!--              <input type="file" name="upload-file" />-->
<!--              <img v-if="form.tecGroupImg" :src="form.tecGroupImg" class="avatar">-->
<!--              <i v-else class="el-icon-plus avatar-uploader-icon"></i>-->
<!--            </form>-->
<!--          </div>-->
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
          <el-select v-model="form.tecGroupType" placeholder="请选择副组长">
            <el-option :label="item.groupTypeName" :value="item.groupTypeId" v-for="item in groupType" :key="item.groupTypeId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="组过期时间" :label-width="formLabelWidth" prop="tecGroupExpiredDate">
          <el-date-picker
            v-model="form.tecGroupExpiredDate"
            type="datetime"
            placeholder="选择组过期时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="getAddForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      totalItem: 0,
      dialogFormVisible: false,
      form: {
        tecGroupName: '',
        tecGroupImg: '',
        tecGroupLevel: null,
        tecGroupLeader: null,
        tecGroupDeputy: null,
        memeberIds: '',
        tecGroupCount: null,
        tecGroupType: null,
        tecGroupExpiredDate: ''
      },
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
  created () {
    this.getTeamList()
  },
  updated () {
    // this.getTeamList()
  },
  methods: {
    getTeamList () {
      this.$axios.fetchGet('/group/lists')
        .then(res => {
          // console.log(res)
          if (res.data.statuscode === 200) {
            let resList = res.data.content.list
            // console.log(resList)
            for (let i of resList) {
              // console.log(i)
              i.tecGroupCreateDate = i.tecGroupCreateDate.replace(/\s/g, '<br>')
              i.tecGroupExpiredDate = i.tecGroupExpiredDate.replace(/\s/g, '<br>')
            }
            this.tableData = resList
            this.totalItem = res.data.content.totalCount
            // console.log(this.totalItem)
          }
        })
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
    getAddForm () {
      this.$refs['addTeamForm'].validate((valid) => {
        if (valid) {
          let addForm = {
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
          console.log(addForm)
          this.$axios.fetchPost('/group/add', addForm)
            .then(res => {
              console.log(res)
            })
          // this.dialogFormVisible = true
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getAllMenber () {
      this.dialogFormVisible = true
      this.$axios.fetchGet('/emp/tecEmp')
        .then(res => {
          if (res.data.statuscode === 200) {
            this.staffList = res.data.content
          }
        })
      this.$axios.fetchGet('/group/type')
        .then(res => {
          if (res.data.statuscode === 200) {
            this.groupType = res.data.content
          }
        })
    },
    handleAvatarSuccess (res, file) {
      this.form.tecGroupImg = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
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
  .team-menagement-container{
    width: 100%;
    position: relative;
    .el-table{
      margin-top:20px;
      width: 99.9%;
    }
    .team-avatar {
      width:50px;
      height: 50px;
     }
    .el-table td, .el-table th {
      padding: 4px 0!important;
    }
    .el-pagination{
      position: absolute;
      left:50%;
      transform: translateX(-50%);
      bottom: -60px;
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
    .add-team-container{
      .el-dialog{
        box-sizing: border-box;
        min-width: 600px;
        width: 40%;
      }
      .el-input,.el-date-picker{
        width: 400px;
      }
    }
  }

</style>
