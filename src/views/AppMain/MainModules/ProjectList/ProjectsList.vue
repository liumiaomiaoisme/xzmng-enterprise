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
          v-model="projectSearchForm.startDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="项目开始日期范围起" end-placeholder="项目开始日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form" prop="publishDate">
        <el-date-picker
          v-model="projectSearchForm.publishDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="发布日期范围起" end-placeholder="发布日期日范围止">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form" prop="estimatedEndDate">
        <el-date-picker
          v-model="projectSearchForm.estimatedEndDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="预结束日期范围起" end-placeholder="预结束日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProject" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('projectSearchForm')">重置</el-button>
    </el-form>
    <!-- 项目列表   -->
    <el-button @click="openAddDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
    <el-table :data="this.$store.state.projectListTableData" stripe border fit v-loading="this.$store.state.loading">
      <el-table-column prop="tecProjectName" label="项目名称" fixed width="150"></el-table-column>
      <el-table-column prop="tecProjectDesc" label="项目简要">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="项目简要" width="200" trigger="hover" :content="scope.row.tecProjectDesc">
            <el-button slot="reference" class="tips-btn">查看简要</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="TecProjectPrincipalName" label="负责人"></el-table-column>
      <el-table-column prop="tecProjectStatus" label="项目状态">
        <template slot-scope="scope">
          <span :class="{over:scope.row.isfinished,ing:scope.row.isStarted}">{{scope.row.tecProjectStatus}}</span>
        </template>
      </el-table-column>
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
      <el-table-column prop="tecProjectStartDate" label="开始时间"  width="100">
        <template slot-scope="scope">
           <span v-html="scope.row.tecProjectStartDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecProjectEstimatedEndDate" label="预结束时间" width="100">
        <template slot-scope="scope">
           <span v-html="scope.row.tecProjectEstimatedEndDate"></span>
        </template>
      </el-table-column>
      <el-table-column label="开发阶段" width="80">
        <template slot-scope="scope">
          <el-popover placement="right" width="250" trigger="click">
            <el-table :data="phaseData">
              <el-table-column width="150" property="tecStageName" label="阶段名称"></el-table-column>
              <el-table-column width="100" property="tecStageStatus" label="阶段状态"></el-table-column>
            </el-table>
            <el-button slot="reference" class="tips-btn" @click="handleAllPhase(scope.row.tecProjectId)">点击查看</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tecProjectVersion" label="目前开发版本" width="106"></el-table-column>
      <el-table-column prop="tecProjectCommitCount" label="提交次数统计" width="106"></el-table-column>
      <el-table-column prop="tecProjectPublishDate" label="预计上线日期" width="106">
        <template slot-scope="scope">
           <span v-html="scope.row.tecProjectPublishDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecProjectCapacity" label="预计承载量" width="100"></el-table-column>
      <el-table-column fixed="right" label="项目状态操作" width="106">
        <template slot-scope="scope">
          <el-button v-if="scope.row.isInit" type="primary" icon="el-icon-caret-right" round size="mini" @click="handleStart(scope.row.tecProjectId)">开始</el-button>
          <el-button v-else :disabled="scope.row.isfinished" type="success" icon="el-icon-finished" round size="mini" @click="handleFinish(scope.row.tecProjectId)">结束</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="88">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="scope.row.isfinished" icon="el-icon-edit" circle size="mini" @click="openEditDialog(scope.row.tecProjectId)"></el-button>
          <el-button slot="reference" :disabled="scope.row.disabled" type="danger" icon="el-icon-delete" circle size="mini" @click="deleteProject(scope.row.tecProjectId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background :page-size="this.$store.state.projectListPageSize"
      layout="total, prev, pager, next, jumper"
      :total="this.$store.state.projectListTotalCount"
      @next-click="getNextPage" @prev-click="getPrevPage" @current-change="getCurrentPage">
    </el-pagination>
    <add-dialog></add-dialog>
    <edit-dialog></edit-dialog>
  </div>
</template>

<script>
import addDialog from '@/views/AppMain/MainModules/ProjectList/component/addProject.vue'
import editDialog from '@/views/AppMain/MainModules/ProjectList/component/editProject.vue'
import { dateKeyClear, clearEmptyKey } from '@/util/utils.js'
export default {
  data () {
    return {
      deleteConfirm: false,
      currentPage: 1,
      projectSearchForm: {
        tecProjectName: '',
        tecProjectPrincipal: '',
        startDate: '',
        publishDate: '',
        estimatedEndDate: ''
      },
      projectStates: [{
        StatesId: 0,
        StatesName: '未开始'
      }, {
        StatesId: 1,
        StatesName: '进行中'
      }, {
        StatesId: 2,
        StatesName: '已结束'
      }],
      timer: null,
      phaseData: []
    }
  },
  created () {
    this.$store.commit('getProjectList', {
      currentPage: this.currentPage
    })
  },
  methods: {
    handleAllPhase (id) {
      this.$axios.fetchGet('/api/stage/stageInfo/' + id)
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            this.phaseData = res.data.content
            for (let i of this.phaseData) {
              if (i.tecStageStatus !== undefined || null) {
                switch (i.tecStageStatus) {
                  case 0:
                    i.tecStageStatus = '未开始'
                    break
                  case 1:
                    i.tecStageStatus = '进行中'
                    break
                  case 2:
                    i.tecStageStatus = '已完成'
                    break
                }
              }
            }
          }
        })
    },
    handleStart (id) {
      let data = {
        status: 1,
        projectId: id
      }
      this.$confirm('此操作将开始该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('updateProjectStatus', data)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消开始'
        })
      })
    },
    handleFinish (id) {
      let data = {
        status: 2,
        projectId: id
      }
      this.$confirm('此操作将结束该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        console.log(2)
        this.$store.commit('updateProjectStatus', data)
      }).catch(() => {
        console.log(1)
        this.$message({
          type: 'info',
          message: '已取消结束'
        })
      })
    },
    openAddDialog () {
      this.$store.commit('openAddDialog')
    },
    openEditDialog (id) {
      this.$store.commit('openEditDialog', id)
    },
    deleteProject (id) {
      this.$confirm('此操作将永久删除该项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('deleteProject', id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
      let searchForm = { ...this.projectSearchForm }
      dateKeyClear(searchForm, 'startDate', 'startDateStart', 'startDateEnd')
      dateKeyClear(searchForm, 'publishDate', 'publishDateStart', 'publishDateEnd')
      dateKeyClear(searchForm, 'estimatedEndDate', 'estimatedEndDateStart', 'estimatedEndDateEnd')
      clearEmptyKey(searchForm)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$store.commit('searchProjectList', searchForm)
      }, 500)
    },
    resetSearch (formName) {
      this.$refs[formName].resetFields()
      this.$store.commit('getProjectList', {
        currentPage: 1
      })
      console.log(this.projectSearchForm)
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
    .over{
      color:#999;
    }
    .ing{
      color:#67C23A;
      font-weight: bold;
    }
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
