<template>
  <div class="team-menagement-container">
    <!--  表单查询  -->
    <el-form :model="searchForm" class="search-container" size="mini" ref="searchFormA">
      <el-form-item>
        <el-input v-model="searchForm.tecGroupName" prefix-icon="el-icon-search" placeholder="请输入组名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="请选择组类型" v-model="searchForm.tecGroupType" clearable>
          <el-option :label="item.groupTypeName" :value="item.groupTypeId" v-for="item in groupType" :key="item.groupTypeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select v-model="searchForm.tecGroupLevel" placeholder="请选择组等级" clearable>
          <el-option label="非正式组" value="0"></el-option>
          <el-option label="正式组" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input  v-model="searchForm.tecGroupLeaderName" prefix-icon="el-icon-search" placeholder="请输入组长"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input  v-model="searchForm.tecGroupDeputyName" prefix-icon="el-icon-search" placeholder="请输入副组长"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input  v-model="searchForm.member" prefix-icon="el-icon-search" placeholder="请输入成员"></el-input>
      </el-form-item>
      <br>
      <el-form-item class="date-form">
        <el-date-picker
          v-model="searchForm.createDate"
          type="daterange"
          range-separator="至"
          start-placeholder="创建日期开始日期"
          end-placeholder="创建日期结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form">
        <el-date-picker
          v-model="searchForm.expiredDate"
          type="daterange"
          range-separator="至"
          start-placeholder="过期日期开始日期"
          end-placeholder="过期日期结束日期">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchTeam" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('searchFormA')">重置</el-button>
    </el-form>
    <!--  表单  -->
    <el-button @click="openAddDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
    <el-button @click="deleteMultipleTeam" type="danger" size="mini" icon="el-icon-delete-solid">批量删除</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      stripe
      border
      fit
      @selection-change="handleSelectionChange">
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
        prop="groupTypeName"
        label="类型">
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
        prop="tecGroupExpiredDate"
        label="过期时间">
        <template slot-scope="scope">
           <span v-html="scope.row.tecGroupExpiredDate"></span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="small" @click="openEditDialog(scope.row.tecGroupId)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteTeam(scope.row.tecGroupId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="total, prev, pager, next, jumper"
      :total="totalItem">
    </el-pagination>
    <add-dialog :handler="addDialogFormVisible" @closeDialog="closeAddDialog"></add-dialog>
    <edit-dialog :handler="editDialogFormVisible" :form="form" @closeDialog="closeEditDialog"></edit-dialog>
  </div>
</template>

<script>
import addDialog from '@/views/AppMain/MainModules/TeamManage/component/addTeam.vue'
import editDialog from '@/views/AppMain/MainModules/TeamManage/component/editTeam.vue'
export default {
  data () {
    return {
      searchForm: {
        tecGroupName: '',
        tecGroupType: '',
        tecGroupLeaderName: '',
        tecGroupDeputyName: '',
        tecGroupLevel: '',
        member: '',
        createDate: '',
        expiredDate: '',
        createStartDate: '',
        createEndDate: '',
        expiredStartDate: '',
        expiredEndDate: ''
      },
      tableData: [],
      totalItem: 0,
      addDialogFormVisible: false,
      editDialogFormVisible: false,
      form: {
        tecGroupName: '',
        tecGroupImg: '',
        tecGroupLevel: null,
        tecGroupLeader: null,
        tecGroupDeputy: null,
        memeberIds: '',
        tecGroupCount: null,
        tecGroupType: null,
        tecGroupExpiredDate: '',
        tecGroupId: null
      },
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
      },
      multipleSelection: []
    }
  },
  created () {
    this.getTeamList()
    this.getAllMenber()
  },
  methods: {
    searchTeam () {
      if (this.searchForm.tecGroupLevel) {
        this.searchForm.tecGroupLevel = parseInt(this.searchForm.tecGroupLevel)
      }
      if (this.searchForm.createDate) {
        this.searchForm.createStartDate = this.getFormatTime(this.searchForm.createDate[0])
        this.searchForm.createEndDate = this.getFormatTime(this.searchForm.createDate[1])
      }
      if (this.searchForm.expiredDate) {
        this.searchForm.expiredStartDate = this.getFormatTime(this.searchForm.expiredDate[0])
        this.searchForm.expiredEndDate = this.getFormatTime(this.searchForm.expiredDate[1])
      }
      console.log(this.searchForm)
      let searchFormSend = {
        tecGroupName: this.searchForm.tecGroupName,
        tecGroupType: this.searchForm.tecGroupType,
        tecGroupLeaderName: this.searchForm.tecGroupLeaderName,
        tecGroupDeputyName: this.searchForm.tecGroupDeputyName,
        tecGroupLevel: this.searchForm.tecGroupLevel,
        member: this.searchForm.member,
        createStartDate: this.searchForm.createStartDate,
        createEndDate: this.searchForm.createEndDate,
        expiredStartDate: this.searchForm.expiredStartDate,
        expiredEndDate: this.searchForm.expiredEndDate
      }
      this.$axios.fetchGet('/api/group/lists', searchFormSend)
        .then(res => {
          if (res.data.statuscode === 200) {
            console.log(res.data.content)
            let resList = res.data.content.list
            for (let i of resList) {
              i.tecGroupCreateDate = i.tecGroupCreateDate.replace(/\s/g, '<br>')
              i.tecGroupExpiredDate = i.tecGroupExpiredDate.replace(/\s/g, '<br>')
            }
            this.tableData = resList
            this.totalItem = res.data.content.totalCount
          } else if (res.data.statuscode === 400) {
            this.tableData = []
          }
        })
    },
    // 重置表单方法
    resetSearch () {
      this.getTeamList()
      // 这个方法会报错 用不了
      // this.$refs[].resetFields()
      this.searchForm = {
        tecGroupName: '',
        tecGroupType: '',
        tecGroupLeaderName: '',
        tecGroupDeputyName: '',
        tecGroupLevel: '',
        member: '',
        createDate: '',
        expiredDate: '',
        createStartDate: '',
        createEndDate: '',
        expiredStartDate: '',
        expiredEndDate: ''
      }
    },
    openAddDialog () {
      this.addDialogFormVisible = true
    },
    closeAddDialog () {
      this.addDialogFormVisible = false
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
    openEditDialog (id) {
      this.$axios.fetchGet('api/group/list/' + id)
        .then(res => {
          if (res.data.statuscode === 200) {
            let editForm = res.data.content[0]
            let memberArr = editForm.member.split(',')
            let indexArr
            indexArr = this.staffList.filter((item) => {
              for (let i of memberArr) {
                if (item.empName.includes(i)) {
                  return item
                }
              }
            })
            let members = []
            for (let i of indexArr) {
              members.push(i.empId)
            }
            let deputy = null
            let leader = null
            for (let i of this.staffList) {
              if (i.empName === editForm.leaderName) {
                deputy = i.empId
              }
              if (i.empName === editForm.deputyName) {
                leader = i.empId
              }
            }
            let typeId = null
            for (let i of this.groupType) {
              if (i.groupTypeName === editForm.groupTypeName) {
                typeId = i.groupTypeId
              }
            }
            this.form = {
              tecGroupName: editForm.tecGroupName,
              tecGroupImg: editForm.tecGroupImg,
              tecGroupLevel: editForm.tecGroupLevel === 1 ? '正式组' : '非正式组',
              tecGroupLeader: leader,
              tecGroupDeputy: deputy,
              memeberIds: members,
              tecGroupType: parseInt(typeId),
              tecGroupExpiredDate: new Date(editForm.tecGroupExpiredDate),
              tecGroupId: editForm.tecGroupId
            }
          }
        })
      this.editDialogFormVisible = true
    },
    closeEditDialog () {
      this.editDialogFormVisible = false
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    deleteMultipleTeam () {
      let idsArr = []
      for (let item of this.multipleSelection) {
        idsArr.push(item.tecGroupId)
      }
      this.$axios.fetchPost('api/group/batchDelete/', {
        ids: idsArr.toString()
      })
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            this.getTeamList()
          }
        })
    },
    deleteTeam (id) {
      this.$axios.fetchPost('api/group/delete/' + id)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            this.getTeamList()
          }
        })
    },
    getTeamList () {
      this.$axios.fetchGet('api/group/lists')
        .then(res => {
          if (res.data.statuscode === 200) {
            let resList = res.data.content.list
            for (let i of resList) {
              i.tecGroupCreateDate = i.tecGroupCreateDate.replace(/\s/g, '<br>')
              i.tecGroupExpiredDate = i.tecGroupExpiredDate.replace(/\s/g, '<br>')
            }
            this.tableData = resList
            this.totalItem = res.data.content.totalCount
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
    }
  },
  components: {
    'add-dialog': addDialog,
    'edit-dialog': editDialog
  }
}

</script>

<style lang="scss">
  .team-menagement-container{
    width: 100%;
    position: relative;
    .search-container{
      .el-form-item{
        display: inline-block;
        width:172px;
        margin-right: 6px;
        margin-bottom: 4px;
        &.date-form{
          width:350px;
        }
      }
      margin-bottom: 10px;
    }
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
