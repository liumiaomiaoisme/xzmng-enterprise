<template>
  <div class="project-phase-container">
    <!-- project-phase-search-->
    <el-form :model="projectPhaseSearchForm" class="search-container" size="mini" ref="projectPhaseSearchForm">
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
          v-model="projectPhaseSearchForm.receiveDate" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss" type="daterange" range-separator="至" start-placeholder="项目领取日期范围起" end-placeholder="项目领取日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form" prop="estimatedDate">
        <el-date-picker
          v-model="projectPhaseSearchForm.estimatedDate" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss" type="daterange" range-separator="至" start-placeholder="预期结束日期范围起" end-placeholder="预期结束日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchProjectPhase" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('projectPhaseSearchForm')">重置</el-button>
    </el-form>
    <!-- project-phase-table-->
    <el-button @click="openAddPhaseDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
    <el-button @click="deleteMultipleProjectPhase" type="danger" size="mini" icon="el-icon-delete-solid">批量删除</el-button>
    <el-table ref="multipleTable" :data="this.$store.state.projectPhaseList" stripe border fit
              v-loading="this.$store.state.loading" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="stageType" label="阶段名称" fixed></el-table-column>
      <el-table-column prop="tecProjectName" label="所属项目"></el-table-column>
      <el-table-column prop="devPrincipalName" label="开发负责人"></el-table-column>
      <el-table-column prop="principalName" label="项目负责人"></el-table-column>
      <el-table-column prop="tecStageStatus" label="阶段状态"></el-table-column>
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
      <el-table-column prop="tecStageTestStatus" label="测试状态"></el-table-column>
      <el-table-column prop="tecStageFeedback" label="测试反馈意见">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="测试反馈意见" trigger="hover" :content="scope.row.tecStageFeedback">
            <el-button slot="reference" class="tips-btn">查看反馈</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="96">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="small" @click="openEditPhaseDialog(scope.row.tecStageId)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteProjectPhase(scope.row.tecStageId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background :page-size="this.$store.state.projectPhaseListPageSize"
      layout="total, prev, pager, next, jumper"
      :total="this.$store.state.projectPhaseListTotalCount"
      @next-click="getNextPage" @prev-click="getPrevPage" @current-change="getCurrentPage">
    </el-pagination>
    <add-project-phase :stageTestStatus="stageTestStatus" :stageStatus="stageStatus"></add-project-phase>
    <edit-project-phase :stageTestStatus="stageTestStatus" :stageStatus="stageStatus"></edit-project-phase>
  </div>
</template>

<script>
import addDialog from '@/views/AppMain/MainModules/ProjectPhaseList/component/addPhase.vue'
import editDialog from '@/views/AppMain/MainModules/ProjectPhaseList/component/editPhase.vue'
export default {
  components: {
    'add-project-phase': addDialog,
    'edit-project-phase': editDialog
  },
  data () {
    return {
      stageTestStatus: [{
        StatusId: 0,
        StatusName: '未通过'
      }, {
        StatusId: 1,
        StatusName: '通过'
      }, {
        StatusId: 2,
        StatusName: '有BUG'
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
      projectPhaseSearchForm: {}
    }
  },
  created () {
    this.$store.commit('getProjectPhaseList', {
      currentPage: 1
    })
  },
  methods: {
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    deleteMultipleProjectPhase () {
      let idsArr = []
      for (let item of this.multipleSelection) {
        idsArr.push(item.tecStageId)
      }
      let ids = idsArr.toString()
      this.$store.commit('deleteMultipleProjectPhase', ids)
    },
    deleteProjectPhase (id) {
      this.$store.commit('deleteProjectPhase', id)
    },
    openEditPhaseDialog (id) {
      this.$store.commit('openEditProjectPhase', id)
    },
    openAddPhaseDialog () {
      this.$store.commit('openAddProjectPhase')
      this.$store.commit('getAllMember')
      this.$store.commit('getProjectsList')
    },
    resetSearch (formName) {
      this.$refs[formName].resetFields()
      this.$store.commit('getProjectPhaseList', {
        currentPage: 1
      })
    },
    searchProjectPhase () {
      for (let key in this.projectPhaseSearchForm) {
        if (this.projectPhaseSearchForm[key] === '') {
          delete this.projectPhaseSearchForm[key]
        }
        if (this.projectPhaseSearchForm[key] === null) {
          delete this.projectPhaseSearchForm[key]
        }
      }
      // this.$store.commit('dateKeyClear', {
      //   mDate: this.projectPhaseSearchForm.receiveDate,
      //   sDateStart: this.projectPhaseSearchForm.receiveDateStart,
      //   sDateEnd: this.projectPhaseSearchForm.receiveDateEnd
      // })
      // this.$store.commit('dateKeyClear', {
      //   mDate: this.projectPhaseSearchForm.estimatedDate,
      //   sDateStart: this.projectPhaseSearchForm.estimatedStart,
      //   sDateEnd: this.projectPhaseSearchForm.estimatedEnd
      // })
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
      dateKeyClear(this.projectPhaseSearchForm, 'receiveDate', 'receiveDateStart', 'receiveDateEnd')
      dateKeyClear(this.projectPhaseSearchForm, 'estimatedDate', 'estimatedStart', 'estimatedEnd')
      this.$store.commit('searchProjectPhase', this.projectPhaseSearchForm)
    },
    getNextPage () {
      this.$store.commit('getProductList', {
        currentPage: ++this.currentPage
      })
    },
    getPrevPage () {
      this.$store.commit('getProductList', {
        currentPage: --this.currentPage
      })
    },
    getCurrentPage (val) {
      this.currentPage = val
      this.$store.commit('getProductList', {
        currentPage: this.currentPage
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .project-phase-container{
    position: relative;
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
