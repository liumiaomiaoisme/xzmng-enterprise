<template>
  <div class="requirement-list-container">
<!-- 需求搜索   -->
     <el-form :model="requirementSearchForm" class="search-container" size="mini" ref="requirementSearchForm">
       <el-form-item prop="demandName">
        <el-input v-model="requirementSearchForm.demandName" prefix-icon="el-icon-search" placeholder="请输入需求名称"></el-input>
      </el-form-item>
      <el-form-item prop="promoterName">
        <el-input v-model="requirementSearchForm.promoterName" prefix-icon="el-icon-search" placeholder="请输入需求发起人"></el-input>
      </el-form-item>
      <el-form-item prop="modifierPersonalName">
        <el-input  v-model="requirementSearchForm.modifierPersonalName" prefix-icon="el-icon-search" placeholder="请输入修改人"></el-input>
      </el-form-item>
      <el-form-item prop="modifierGroupName">
        <el-input  v-model="requirementSearchForm.modifierGroupName" prefix-icon="el-icon-search" placeholder="请输入修改组"></el-input>
      </el-form-item>
      <el-form-item prop="emergencyLevel">
        <el-select placeholder="请选择紧急程度" v-model="requirementSearchForm.emergencyLevel" clearable>
          <el-option label="很紧急" value=0></el-option>
          <el-option label="不紧急" value=1></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="date-form" prop="createDate">
        <el-date-picker
          v-model="requirementSearchForm.createDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="需求发起日期范围起" end-placeholder="需求发起日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="serachRequirement" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('requirementSearchForm')">重置</el-button>
    </el-form>
   <!--     需求table-->
    <el-button @click="openAddDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
    <el-table :data="this.$store.state.requirementListTableData" stripe border fit v-loading="this.$store.state.loading">
      <el-table-column prop="tecDemandName" label="需求名称" fixed width="150"></el-table-column>
      <el-table-column prop="tecDemandProjectName" label="所在项目" width="120"></el-table-column>
      <el-table-column prop="tecDemandPromoterName" label="发起人"></el-table-column>
      <el-table-column prop="tecDemandCreateDate" label="发起时间"  width="106">
        <template slot-scope="scope">
           <span v-html="scope.row.tecDemandCreateDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecDemandPromoterDeptName" label="发起人所在部门" width="120"></el-table-column>
      <el-table-column prop="tecDemandEmergencyLevel" label="紧急程度"></el-table-column>
      <el-table-column prop="Modifier" label="修改人/修改组" width="160"></el-table-column>
      <el-table-column prop="tecDemandExpectedRepairDate" label="期望修复时间" width="106">
        <template slot-scope="scope">
           <span v-html="scope.row.tecDemandExpectedRepairDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="fileList" label="附件" width="180">
        <template slot-scope="scope">
          <el-image v-for="i in scope.row.imgList" :src="i" :key='i' :preview-src-list="scope.row.imgList"></el-image>
          <el-link v-for="(item, i) in scope.row.docList" :href="item" :key='item'>附件{{i+1}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="tecDemandDevFeedback" label="开发部反馈"  width="96">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.over || scope.row.cancel" placement="top-start" title="开发部反馈" width="200" trigger="hover" :content="scope.row.tecDemandDevFeedback">
            <el-button slot="reference" class="tips-btn">查看反馈</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tecDemandStatus" label="需求状态">
        <template slot-scope="scope">
           <span :class="{init:scope.row.init,ing:scope.row.ing,over:scope.row.over, cancle:scope.row.cancle}">{{scope.row.tecDemandStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态操作" width="96">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.init && scope.row.operate" icon="el-icon-caret-right" round size="mini" @click="receiveRequirement(scope.row.tecDemandId)">领取</el-button>
          <el-button type="success" v-if="scope.row.ing && scope.row.operate" :disabled="!scope.row.showFinish" icon="el-icon-finished" round size="mini" @click="endRequirement(scope.row.tecDemandId)">完成</el-button>
          <el-button class="btn-status" type="danger" v-if="(scope.row.ing || scope.row.over) && scope.row.showCancle" icon="el-icon-close" round size="mini" @click="cancelRequirement(scope.row.tecDemandId)">取消</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="88">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="!scope.row.init" icon="el-icon-edit" circle size="mini" @click="openEditRequirement(scope.row.tecDemandId)"></el-button>
          <el-button type="danger" :disabled="!scope.row.init" icon="el-icon-delete" circle size="mini" @click="deleteRequirement(scope.row.tecDemandId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background :page-size="this.$store.state.requirementPageSize"
      layout="total, prev, pager, next, jumper"
      :total="this.$store.state.requirementTotalCount"
      @next-click="getNextPage" @prev-click="getPrevPage" @current-change="getCurrentPage">
    </el-pagination>
    <addRequirement></addRequirement>
    <editRequirement></editRequirement>
    <feedback></feedback>
    <receive :userTeam="userTeam"></receive>
  </div>
</template>

<script>
import addRequirement from '@/views/AppMain/MainModules/RequirementList/component/addRequirement.vue'
import editRequirement from '@/views/AppMain/MainModules/RequirementList/component/editRequirement.vue'
import feedback from '@/views/AppMain/MainModules/RequirementList/component/feedbackDialog.vue'
import receive from '@/views/AppMain/MainModules/RequirementList/component/receiveRequirement.vue'
export default {
  components: {
    addRequirement,
    editRequirement,
    feedback,
    receive
  },
  data () {
    return {
      pageSize: 10,
      currentPage: 1,
      totalCount: 0,
      requirementListTableData: [],
      loading: false,
      requirementSearchForm: {
        demandName: '',
        promoterName: '',
        modifierPersonalName: '',
        modifierGroupName: '',
        emergencyLevel: null,
        createDateStart: ''
      },
      userTeam: []
    }
  },
  computed: {
    staffList () {
      return this.$store.state.staffList
    }
  },
  created () {
    this.$store.commit('getRequirementList', {
      currentPage: 1
    })
    this.$store.commit('getAllStaff')
    this.$store.commit('getTeamOption')
    this.$store.commit('getProjectsForRequire')
    // this.getUserTeam()
  },
  methods: {
    // getUserTeam () {
    //   this.$axios.fetchGet('/api/demand/group')// 获取用户为组长的组
    //     .then(res => {
    //       console.log(res)
    //       if (res.data.statuscode === 200) {
    //         let userGroupOrigin = res.data.content
    //         if (userGroupOrigin) {
    //           userGroupOrigin.forEach(item => {
    //             let obj = {}
    //             obj.value = item.tecGroupId
    //             obj.label = item.tecGroupName
    //             this.userTeam.push(obj)
    //           })
    //         }
    //       } else if (res.data.statuscode === 400 && res.data.msg === '暂无小组信息') {
    //         this.userTeam = null
    //       }
    //       console.log(this.userTeam)
    //     })
    // },
    receiveRequirement (id) {
      this.$store.commit('openReceiveRequire', id)
    },
    endRequirement (id) {
      this.$store.commit('endRequirement', id)
    },
    cancelRequirement (id) {
      this.$store.commit('cancelRequirement', id)
    },
    resetSearch (formName) {
      this.$refs[formName].resetFields()
      this.$store.commit('getRequirementList', {
        currentPage: 1
      })
    },
    deleteRequirement (id) {
      this.$confirm('此操作将删除当前需求，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('deleteRequirement', id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openAddDialog () {
      this.$store.commit('openAddRequirement')
    },
    openEditRequirement (id) {
      this.$store.commit('openEditRequirement', id)
    },
    serachRequirement () {
      let searchForm = { ...this.requirementSearchForm }
      if (searchForm.createDate) {
        searchForm.createDateStart = searchForm.createDate[0]
        searchForm.createDateEnd = searchForm.createDate[1]
      }
      if (searchForm.emergencyLevel !== null) {
        searchForm.emergencyLevel = parseInt(searchForm.emergencyLevel)
      }
      for (let key in searchForm) {
        if (searchForm[key] === '' || undefined) {
          delete searchForm[key]
        }
      }
      this.$store.commit('searchRequirement', searchForm)
    },
    getNextPage () {
      this.$store.commit('getRequirementList', {
        currentPage: ++this.currentPage
      })
    },
    getPrevPage () {
      this.$store.commit('getRequirementList', {
        currentPage: --this.currentPage
      })
    },
    getCurrentPage (val) {
      this.currentPage = val
      this.$store.commit('getRequirementList', {
        currentPage: this.currentPage
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .requirement-list-container{
    position: relative;
    .ing{
      color: #67C23A;
      font-weight: bold;
    }
    .over{
      color: #999;
      font-weight: bold;
    }
    .cancle{
      color: #999;
    }
    .el-button+.btn-status.el-button {
      margin-left: 0px!important;
      margin-top: 4px!important;
    }
    .el-table{
      margin-top: 10px;
    }
    .el-table th>.cell{
      white-space:pre-line;
      word-wrap: break-word;
    }
    .tips-btn{
      width: 60px;
      padding: 6px 0px;
      font-size: 12px;
    }
    .el-pagination{
      position: absolute;
      left:50%;
      transform: translateX(-50%);
      bottom: -50px;
    }
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
    .el-table td, .el-table th {
      padding: 10px 0;
    }
    .el-image{
      width: 50px;
      height: 50px;
      margin: 0 1px;
      border: 1px solid #EBEEF5;
      vertical-align: middle;
    }
    .el-link{
      padding-left: 4px;
      padding-right: 4px;
    }
  }
</style>
