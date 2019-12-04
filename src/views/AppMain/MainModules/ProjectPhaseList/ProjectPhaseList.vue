<template>
  <div class="project-phase-container">
    <!-- project-phase-search-->
    <el-form :model="projectPhaseSearchForm" class="search-container" size="mini" ref="projectPhaseSearchForm">
      <el-form-item prop="tecStageName">
        <el-input v-model="projectPhaseSearchForm.tecStageName" prefix-icon="el-icon-search" placeholder="请输入阶段名称"></el-input>
      </el-form-item>
      <el-form-item prop="tecProjectName">
        <el-input v-model="projectPhaseSearchForm.tecProjectName" prefix-icon="el-icon-search" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item prop="principalName">
        <el-input  v-model="projectPhaseSearchForm.principalName" prefix-icon="el-icon-search" placeholder="请输入项目负责人"></el-input>
      </el-form-item>
      <el-form-item prop="devPrincipalName">
        <el-input  v-model="projectPhaseSearchForm.devPrincipalName" prefix-icon="el-icon-search" placeholder="请输入开发负责人"></el-input>
      </el-form-item>
      <el-form-item prop="tecStageStatus">
        <el-select placeholder="请选择阶段状态" v-model="projectPhaseSearchForm.tecStageStatus" clearable>
          <el-option :label="item.StatusName" :value="item.StatusId" v-for="item in this.stageStatus" :key="item.StatusId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="tecStageTestStatus">
        <el-select placeholder="请选择测试状态" v-model="projectPhaseSearchForm.tecStageTestStatus" clearable>
          <el-option :label="item.StatusName" :value="item.StatusId" v-for="item in this.stageTestStatus" :key="item.StatusId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="date-form" prop="receiveDate">
        <el-date-picker
          v-model="projectPhaseSearchForm.receiveDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="领取日期范围起" end-placeholder="领取日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form" prop="estimatedDate">
        <el-date-picker
          v-model="projectPhaseSearchForm.estimatedDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="预期结束日期范围起" end-placeholder="预期结束日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProjectPhase" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('projectPhaseSearchForm')">重置</el-button>
    </el-form>
    <!-- project-phase-table-->
    <el-button @click="openAddPhaseDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
<!--    <el-button @click="deleteMultipleProjectPhase" type="danger" size="mini" icon="el-icon-delete-solid">批量删除</el-button>-->
    <el-table ref="multipleTable" :data="this.$store.state.projectPhaseList" stripe border fit v-loading="this.$store.state.loading">
      <el-table-column prop="tecStageName" label="阶段名称" fixed></el-table-column>
      <el-table-column prop="tecProjectName" label="所属项目"></el-table-column>
      <el-table-column prop="devPrincipalName" label="开发负责人"></el-table-column>
      <el-table-column prop="principalName" label="项目负责人"></el-table-column>
      <el-table-column prop="tecStageReceiveDate" label="领取时间" width="160" >
        <template slot-scope="scope">
           <span v-html="scope.row.tecStageReceiveDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecProjectEstimatedEnd" label="预计完成日期" width="160" >
        <template slot-scope="scope">
           <span v-html="scope.row.tecProjectEstimatedEnd"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecStageStatus" label="阶段状态"></el-table-column>
      <el-table-column prop="tecStageTestStatus" label="测试状态">
        <template slot-scope="scope">
           <span :class="{test:scope.row.isDev}">{{scope.row.tecStageTestStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tecStageFeedback" label="测试反馈意见">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.isShowfeedBack" placement="top-start" title="测试反馈意见" trigger="hover" :content="scope.row.tecStageFeedback">
            <el-button slot="reference" class="tips-btn">查看反馈</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="测试结果操作" width="120">
        <template slot-scope="scope" v-if="scope.row.projectOver">
          <el-button v-if="scope.row.isFinish" type="primary" icon="el-icon-s-flag" round size="mini" @click="handleTest(scope.row.tecStageId)">测试结果</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="阶段状态操作" width="106">
        <template slot-scope="scope" v-if="scope.row.projectOver">
          <el-button v-if="scope.row.isInit" type="primary" icon="el-icon-caret-right" round size="mini" @click="handleReceive(scope.row.tecStageId)">领取</el-button>
          <el-button v-else-if="scope.row.isDev"  type="success" icon="el-icon-finished" round size="mini" @click="handleFinish(scope.row.tecStageId)">完成</el-button>
          <el-button v-else-if="scope.row.isTest" type="info" :disabled="true" icon="el-icon-refresh-right" round size="mini">测试中</el-button>
          <el-button v-else-if="scope.row.isOver" type="success" :disabled="true" icon="el-icon-check" round size="mini">已结束</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="50">
        <template slot-scope="scope">
          <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="deleteProjectPhase(scope.row.tecStageId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background :page-size="this.$store.state.projectPhaseListPageSize"
      layout="total, prev, pager, next, jumper"
      :total="this.$store.state.projectPhaseListTotalCount"
      @next-click="getNextPage" @prev-click="getPrevPage" @current-change="getCurrentPage">
    </el-pagination>
    <add-project-phase></add-project-phase>
    <edit-project-phase :stageTestStatus="stageTestStatus" :stageStatus="stageStatus"></edit-project-phase>
    <test-Dialog :stageTestStatus="stageTestStatus" :stageStatus="stageStatus"></test-Dialog>
  </div>
</template>

<script>
import addDialog from '@/views/AppMain/MainModules/ProjectPhaseList/component/addPhase.vue'
import editDialog from '@/views/AppMain/MainModules/ProjectPhaseList/component/editPhase.vue'
import testDialog from '@/views/AppMain/MainModules/ProjectPhaseList/component/testDialog.vue'
export default {
  components: {
    'add-project-phase': addDialog,
    'edit-project-phase': editDialog,
    'test-Dialog': testDialog
  },
  data () {
    return {
      stageTestStatus: [{
        StatusId: 0,
        StatusName: '未通过'
      }, {
        StatusId: 1,
        StatusName: '通过'
      }],
      stageStatus: [{
        StatusId: 0,
        StatusName: '未完成'
      }, {
        StatusId: 1,
        StatusName: '进行中'
      }, {
        StatusId: 2,
        StatusName: '已完成'
      }],
      projectPhaseSearchForm: {
        tecStageName: '',
        tecProjectName: '',
        principalName: '',
        devPrincipalName: '',
        tecStageStatus: null,
        tecStageTestStatus: null,
        receiveDate: '',
        estimatedDate: ''
      }
    }
  },
  created () {
    this.$store.commit('getProjectPhaseList', {
      currentPage: 1
    })
  },
  methods: {
    handleTest (id) {
      console.log(id)
      this.$store.commit('openTestProjectPhase', id)
    },
    handleReceive (id) {
      let ids = id.toString()
      this.$confirm('确认领取该阶段任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('receiveProjectPhase', ids)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消领取'
        })
      })
    },
    handleFinish (id) {
      this.$confirm('确认完成该阶段任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('finishProjectPhase', id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消完成'
        })
      })
    },
    deleteProjectPhase (id) {
      this.$confirm('此操作将永久删除该阶段, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('deleteProjectPhase', id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    openEditPhaseDialog (id) {
      this.$store.commit('openEditProjectPhase', id)
    },
    openAddPhaseDialog () {
      this.$store.commit('openAddProjectPhase')
      this.$store.commit('getAllProjectsList')
    },
    resetSearch (formName) {
      this.$refs[formName].resetFields()
      this.$store.commit('getProjectPhaseList', {
        currentPage: 1
      })
    },
    searchProjectPhase () {
      let addForm = { ...this.projectPhaseSearchForm }
      for (let key in addForm) {
        if (addForm[key] === '') {
          delete addForm[key]
        }
        if (addForm[key] === null) {
          delete addForm[key]
        }
      }
      function dateKeyClear (formName, mDate, sDateStart, sDateEnd) {
        if (formName[mDate]) {
          formName[sDateStart] = formName[mDate][0]
          formName[sDateEnd] = formName[mDate][1]
          delete formName[mDate]
        } else {
          delete formName[sDateStart]
          delete formName[sDateEnd]
        }
      }
      dateKeyClear(addForm, 'receiveDate', 'receiveDateStart', 'receiveDateEnd')
      dateKeyClear(addForm, 'estimatedDate', 'estimatedStart', 'estimatedEnd')
      console.log(addForm)
      this.$store.commit('searchProjectPhase', addForm)
    },
    getNextPage () {
      this.$store.commit('getProjectPhaseList', {
        currentPage: ++this.currentPage
      })
    },
    getPrevPage () {
      this.$store.commit('getProjectPhaseList', {
        currentPage: --this.currentPage
      })
    },
    getCurrentPage (val) {
      this.currentPage = val
      this.$store.commit('getProjectPhaseList', {
        currentPage: this.currentPage
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .project-phase-container{
    position: relative;
    .test{
      color: #F56C6C;
      font-weight: bold;
    }
    .isOver{
      color: #67C23A;
      font-weight: bold;
    }
    .isDev{
      color: #409EFF;
      font-weight: bold;
    }
    .isInit{
      color: #F56C6C;
      font-weight: bold;
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
  }
</style>
