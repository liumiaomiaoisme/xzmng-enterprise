<template>
  <div class="salesDemand-container">
    <!--  表单查询  -->
    <el-form :model="searchForm" class="search-container" size="mini" ref="searchForm">
      <el-form-item prop="demandName">
        <el-input v-model="searchForm.demandName" prefix-icon="el-icon-search" placeholder="请输入需求名称"></el-input>
      </el-form-item>
      <el-form-item prop="severity">
        <el-select v-model="searchForm.severity" placeholder="请选择严重程度" clearable>
          <el-option label="严重" value=0></el-option>
          <el-option label="不严重" value=1></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="modifierName">
        <el-input v-model="searchForm.modifierName" prefix-icon="el-icon-search" placeholder="请输入修改人或组"></el-input>
      </el-form-item>
      <el-form-item prop="tecFeedbackStatus">
        <el-select v-model="searchForm.tecFeedbackStatus" placeholder="请选择反馈状态" clearable>
          <el-option label="已完成" value=0></el-option>
          <el-option label="进行中" value=1></el-option>
          <el-option label="未分配" value=2></el-option>
          <el-option label="已驳回" value=3></el-option>
        </el-select>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchDeamnd" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('searchForm')">重置</el-button>
    </el-form>
    <!--  列表  -->
    <el-table  :data="this.$store.state.SalesDemandData" stripe border fit v-loading="this.$store.state.loading">
      <el-table-column prop="demandName" label="需求名称" fixed width="180"></el-table-column>
      <el-table-column prop="demandProjectName" label="所属项目"></el-table-column>
      <el-table-column prop="demandType" label="需求类型" width="96"></el-table-column>
      <el-table-column prop="demandStatus" label="需求状态" width="106"></el-table-column>
      <el-table-column prop="demandSource" label="需求来源"></el-table-column>
      <el-table-column prop="demandSponsorName" label="发起人"></el-table-column>
      <el-table-column prop="demandStartTime" label="发起时间" width="106"></el-table-column>
      <el-table-column prop="demandSeverity" label="严重程度">
        <template slot-scope="scope">
          <span :class="{dangerColor:scope.row.demandSeverity=== '严重'}">{{scope.row.demandSeverity}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="demandCuatomerFeedback" label="客户意见">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="客户意见" width="200" trigger="hover" :content="scope.row.demandCuatomerFeedback">
            <el-button slot="reference" class="tips-btn">查看意见</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="demandModifierName" label="修改人或组" width="96"></el-table-column>
      <el-table-column prop="demandExpectedRepair" label="期望修复时间" width="106"></el-table-column>
      <el-table-column prop="demandSuperiorReviewerName" label="审核人"></el-table-column>
      <el-table-column prop="demandSuperiorReviewTime" label="审核时间" width="100"></el-table-column>
      <el-table-column prop="demandSuperiorRevieweOpinion" label="审核意见">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="审核意见" width="200" trigger="hover" :content="scope.row.demandSuperiorRevieweOpinion">
            <el-button slot="reference" class="tips-btn">查看意见</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="demandSuperiorReviewStatus" label="审核状态"></el-table-column>
      <el-table-column prop="demandFeedbackTime" label="反馈时间" width="100"></el-table-column>
      <el-table-column prop="demandFeedbackOpinion" label="反馈意见">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="反馈意见" width="200" trigger="hover" :content="scope.row.demandFeedbackOpinion">
            <el-button slot="reference" class="tips-btn">查看意见</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="demandFeedbackStatus" label="反馈状态">
        <template slot-scope="scope">
           <span :class="{init:scope.row.init,ing:scope.row.ing,over:scope.row.over, reject:scope.row.reject}">{{scope.row.demandFeedbackStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="demandFile" label="附件">
        <template slot-scope="scope">
          <el-image v-for="i in scope.row.imgList" :src="i" :key='i' :preview-src-list="scope.row.imgList"></el-image>
          <el-link v-for="(item, i) in scope.row.docList" :href="item" :key='item'>附件{{i+1}}</el-link>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="94">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.init" icon="el-icon-caret-right" round size="mini" @click="receiveDemand(scope.row.demandId)">领取</el-button>
          <el-button class='btn-status' v-if="scope.row.init" type="danger" icon="el-icon-close" round size="mini" @click="rejectDemand(scope.row.demandId)">驳回</el-button>
          <el-button type="primary" v-if="scope.row.ing" icon="el-icon-finished" round size="mini" @click="overDemand(scope.row.demandId)">完成</el-button>
          <el-button type="info" v-if="scope.row.over" :disabled="true" round size="mini">已完成</el-button>
          <el-button type="info" v-if="scope.row.reject" :disabled="true" round size="mini">已驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        background :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="this.$store.state.SalesDemandTotalcount"
        @next-click="getNextPage" @prev-click="getPrevPage" @current-change="getCurrentPage">
    </el-pagination>
    <editDemand></editDemand>
    <operateDemand :overId="demandId" :dowhat="dowhat" :group="group" isResouceGet="isResouceGet"></operateDemand>
  </div>
</template>

<script>
import editDemand from '@/views/AppMain/MainModules/SalesDemand/component/editDemand.vue'
import operateDemand from '@/views/AppMain/MainModules/SalesDemand/component/operateDemand.vue'
export default {
  components: {
    editDemand,
    operateDemand
  },
  created () {
    this.$store.commit('getSalesDemand', {
      currentPage: 1
    })
    this.$store.commit('getAllStaff')
    this.$store.commit('getTeamOption')
    this.$store.commit('getProjectsForRequire')
  },
  data () {
    return {
      searchForm: {},
      demandId: 0,
      dowhat: 0,
      group: [],
      isResouceGet: 0
    }
  },
  methods: {
    searchDeamnd () {
      let searchForm = { ...this.searchForm }
      if (searchForm.severity) {
        searchForm.severity = parseInt(searchForm.severity)
      }
      if (searchForm.tecFeedbackStatus) {
        searchForm.tecFeedbackStatus = parseInt(searchForm.tecFeedbackStatus)
      }
      searchForm.currentPage = 1
      this.$store.commit('searchDemand', searchForm)
    },
    resetSearch (formName) {
      this.$refs[formName].resetFields()
      this.$store.commit('getSalesDemand', {
        currentPage: 1
      })
    },
    overDemand (id) {
      this.demandId = id
      this.dowhat = 0 // 完成
      this.$store.state.overDemandvisible = true
    },
    rejectDemand (id) {
      this.demandId = id
      this.dowhat = 1 // 驳回
      this.$store.state.overDemandvisible = true
    },
    receiveDemand (id) {
      this.$axios.fetchGet('/api/demand/group')
        .then(res => {
          if (res.data.statuscode === 200) {
            let groupTmp = res.data.content
            groupTmp.forEach(item => {
              let obj = {}
              obj.value = item.tecGroupId
              obj.label = item.tecGroupName
              this.group.push(obj)
            })
          } else if (res.data.statuscode === 200 && res.data.msg === '暂无小组信息') {
            this.group = null
          }
          this.demandId = id
          this.dowhat = 2 // 领取
          this.$store.state.overDemandvisible = true
          this.isResouceGet++
          console.log(this.isResouceGet)
        })
    },
    getNextPage () {
      this.$store.commit('getSalesDemand', {
        currentPage: ++this.currentPage
      })
    },
    getPrevPage () {
      this.$store.commit('getSalesDemand', {
        currentPage: --this.currentPage
      })
    },
    getCurrentPage (val) {
      this.currentPage = val
      this.$store.commit('getSalesDemand', {
        currentPage: this.currentPage
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .salesDemand-container {
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
    .init{
      color: #F56C6C;
      font-weight: bold;
    }
    .ing{
      color: #409EFF;
      font-weight: bold;
    }
    .over{
      color: #67C23A;
      font-weight: bold;
    }
    .reject{
      /*color: #F56C6C;*/
      /*font-weight: bold;*/
    }
    .dangerColor{
      color: #F56C6C;
      font-weight: bold;
    }
    .el-pagination {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -50px;
    }
    .tips-btn{
      width: 60px;
      padding: 6px 0px;
      font-size: 12px;
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
    .el-button+.btn-status.el-button {
      margin-left: 0px!important;
      margin-top: 4px!important;
    }
  }
</style>
