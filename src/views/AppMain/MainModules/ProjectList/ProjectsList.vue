<template>
  <div class="project-list-container">
    <!-- 项目查询表单   -->
    <!--  表单查询  -->
    <el-form :model="projectSearchForm" class="search-container" size="mini" ref="projectSearchForm">
      <el-form-item prop="tecProjectName">
        <el-input v-model="projectSearchForm.tecProjectName" prefix-icon="el-icon-search" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item prop="tecProjectPrincipal">
        <el-input  v-model="projectSearchForm.tecProjectPrincipal" prefix-icon="el-icon-search" placeholder="请输入项目负责人"></el-input>
      </el-form-item>
      <el-form-item class="date-form" prop="startDate">
        <el-date-picker
          v-model="projectSearchForm.startDate" type="daterange" range-separator="至" start-placeholder="项目开始日期范围起" end-placeholder="项目开始日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form" prop="publishDate">
        <el-date-picker
          v-model="projectSearchForm.publishDate" type="daterange" range-separator="至" start-placeholder="发布日期范围起" end-placeholder="发布日期日范围止">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form" prop="estimatedEnd">
        <el-date-picker
          v-model="projectSearchForm.estimatedEndDate" type="daterange" range-separator="至" start-placeholder="预结束日期范围起" end-placeholder="预结束日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProject" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('projectSearchForm')">重置</el-button>
    </el-form>
    <!-- 项目列表   -->
    <el-button @click="openAddDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
    <el-button @click="deleteMultipleProject" type="danger" size="mini" icon="el-icon-delete-solid">批量删除</el-button>
    <el-table ref="multipleTable"  :data="this.$store.state.projectListTableData"
              stripe border fit @selection-change="handleSelectionChange" v-loading="this.$store.state.loading">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="tecProjectName" label="项目名称" fixed></el-table-column>
      <el-table-column prop="tecProjectDesc" label="项目简要">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="项目简要" width="200" trigger="hover" :content="scope.row.tecProjectDesc">
            <el-button slot="reference" class="tips-btn">查看简要</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="TecProjectPrincipalName" label="负责人"></el-table-column>
      <el-table-column prop="tecProjectStatus" label="项目状态"></el-table-column>
      <el-table-column prop="tecProjectLogourl" label="项目logo" width="82" class="logo-item">
        <template slot-scope="scope">
           <img :src="scope.row.tecProjectLogourl" class="team-avatar"/>
        </template>
      </el-table-column>
      <el-table-column prop="tecProjectCycle" label="项目周期"></el-table-column>
      <el-table-column prop="members" label="项目成员">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="项目成员" width="200" trigger="hover" :content="scope.row.members">
            <el-button slot="reference" class="tips-btn">查看成员</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tecProjectStartDate" label="开始时间" >
        <template slot-scope="scope">
           <span v-html="scope.row.tecGroupCreateDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecProjectEstimatedEndDate" label="预结束时间">
        <template slot-scope="scope">
           <span v-html="scope.row.tecGroupExpiredDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="stageType" label="目前开发阶段"></el-table-column>
      <el-table-column prop="tecProjectVersion" label="目前开发版本"></el-table-column>
      <el-table-column prop="tecProjectCommitCount" label="提交次数统计"></el-table-column>
      <el-table-column prop="tecProjectPublishDate" label="预计上线日期" >
        <template slot-scope="scope">
           <span v-html="scope.row.tecGroupCreateDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecProjectCapacity" label="预计承载量"></el-table-column>
      <el-table-column fixed="right" label="操作" width="96">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="small" @click="openEditDialog(scope.row.tecProjectId)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteProject(scope.row.tecProjectId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background :page-size="this.$store.state.productListPageSize"
      layout="total, prev, pager, next, jumper"
      :total="this.$store.state.productListTotalCount"
      @next-click="getNextPage" @prev-click="getPrevPage" @current-change="getCurrentPage">
    </el-pagination>
    <add-dialog></add-dialog>
    <edit-dialog></edit-dialog>
  </div>
</template>

<script>
import addDialog from '@/views/AppMain/MainModules/ProjectList/component/addProject.vue'
import editDialog from '@/views/AppMain/MainModules/ProjectList/component/editProject.vue'
export default {
  data () {
    return {
      multipleSelection: [],
      currentPage: 1,
      projectSearchForm: {},
      addDialogFormVisible: false,
      editDialogFormVisible: false
    }
  },
  created () {
    this.$store.commit('getProjectList', {
      currentPage: this.currentPage
    })
  },
  methods: {
    openAddDialog () {
      this.$store.commit('openAddDialog')
    },
    openEditDialog (id) {
      this.$store.commit('openEditDialog', id)
    },
    deleteMultipleTeam () {
      console.log(1)
    },
    deleteProject (id) {
      this.$store.commit('deleteProject', id)
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    deleteMultipleProject () {
      let idsArr = []
      for (let item of this.multipleSelection) {
        idsArr.push(item.tecProjectId)
      }
      let ids = idsArr.toString()
      this.$store.commit('deleteMultipleProject', ids)
    },
    getNextPage () {
      this.$store.commit('getProjectList', {
        currentPage: ++this.currentPage
      })
    },
    getPrevPage () {
      this.$store.commit('getProjectList', {
        currentPage: --this.currentPage
      })
    },
    getCurrentPage (val) {
      this.currentPage = val
      this.$store.commit('getProjectList', {
        currentPage: val
      })
    },
    searchProject () {
      let searchForm = this.projectSearchForm
      if (searchForm.startDate) {
        searchForm.startDateStart = this.getFormatTime(searchForm.startDate[0])
        searchForm.startDateEnd = this.getFormatTime(searchForm.startDate[1])
      }
      if (searchForm.publishDate) {
        searchForm.publishDateStart = this.getFormatTime(searchForm.publishDate[0])
        searchForm.publishDateEnd = this.getFormatTime(searchForm.publishDate[1])
      }
      if (searchForm.estimatedEndDate) {
        searchForm.estimatedEndDateStart = this.getFormatTime(searchForm.estimatedEndDate[0])
        searchForm.estimatedEndDateEnd = this.getFormatTime(searchForm.estimatedEndDate[1])
      }
      delete searchForm.startDate
      delete searchForm.publishDate
      delete searchForm.estimatedEndDate
      this.$store.commit('searchProjectList', searchForm)
    },
    resetSearch (formName) {
      this.$refs[formName].resetFields()
      this.$store.commit('getProjectList', {
        currentPage: 1
      })
    },
    getFormatTime (data) {
      let newTime = new Date(data)
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
<style lang="scss" scoped>
  .project-list-container{
    position: relative;
    .el-table{
      margin-top: 10px;
    }
    .el-table th>.cell{
      white-space:pre-line;
      word-wrap: break-word;
    }
    .team-avatar{
      width:50px;
      height: 50px;
      vertical-align: middle;
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
  }

</style>
