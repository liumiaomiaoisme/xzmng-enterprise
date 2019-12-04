<template>
  <div class="meeting-container">
     <!-- meeting-search-form   -->
    <el-form :model="meetingSearchForm" class="search-container" size="mini" ref="meetingSearchForm">
      <el-form-item prop="tecMeetingName">
        <el-input v-model="meetingSearchForm.tecMeetingName" prefix-icon="el-icon-search" placeholder="请输入会议名称"></el-input>
      </el-form-item>
      <el-form-item prop="meetHostName">
        <el-input  v-model="meetingSearchForm.meetHostName" prefix-icon="el-icon-search" placeholder="请输入会议主持人"></el-input>
      </el-form-item>
      <el-form-item prop="tecMeetingSolveProblem">
        <el-select placeholder="请选择是否解决问题" v-model="meetingSearchForm.tecMeetingSolveProblem" clearable>
          <el-option :label="item.typeName" :value="item.typeId" v-for="item in MeetingSolveProblem" :key="item.typeId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="tecMeetingStatus">
        <el-select placeholder="请选择会议状态" v-model="meetingSearchForm.tecMeetingStatus" clearable>
          <el-option label="未开始" value=0></el-option>
          <el-option label="进行中" value=1></el-option>
          <el-option label="已结束" value=2></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="date-form" prop="startDate">
        <el-date-picker
          v-model="meetingSearchForm.startDate" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" type="daterange" range-separator="至" start-placeholder="会议开始日期范围起" end-placeholder="会议开始日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchMeeting" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('meetingSearchForm')">重置</el-button>
    </el-form>
    <!--meeting table-->
    <el-button @click="openAddMeetingDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
    <el-table :data="this.$store.state.meetingTableData" stripe border fit  width="150" v-loading="this.$store.state.loading">
      <el-table-column prop="tecMeetingName" label="会议名称" fixed width="180"></el-table-column>
      <el-table-column prop="tecMeetingStartDate" label="会议开始时间" width="140">
        <template slot-scope="scope">
           <span v-html="scope.row.tecMeetingStartDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecMeetingEndDate" label="会议结束时间" width="140">
        <template slot-scope="scope">
           <span v-html="scope.row.tecMeetingEndDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="meetHostName" label="会议主持人" width="96"></el-table-column>
      <el-table-column prop="members" label="会议成员">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="会议成员" trigger="hover" :content="scope.row.members">
            <el-button slot="reference" class="tips-btn">查看成员</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tecMeetingSpirit" label="会议精神">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="会议精神" trigger="hover" :content="scope.row.tecMeetingSpirit">
            <el-button slot="reference" class="tips-btn">查看精神</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="tecMeetingSolveProblem" label="是否解决问题" width="106">
        <template slot-scope="scope">
          <span :class='{resolved:scope.row.resolve}'>{{scope.row.tecMeetingSolveProblem}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tecMeetingStatus" label="会议状态">
        <template slot-scope="scope">
          <span :class='{
          int:scope.row.tecMeetingStatus === "未开始",
          ing:scope.row.tecMeetingStatus === "进行中",
          over:scope.row.tecMeetingStatus === "已结束"}'>{{scope.row.tecMeetingStatus}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tecMeetingSummary" label="会议总结">
        <template slot-scope="scope" v-if="scope.row.isOver">
          <el-popover placement="top-start" title="会议总结" width="200" trigger="hover" :content="scope.row.tecMeetingSummary">
            <el-button slot="reference" class="tips-btn">查看总结</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="总结操作" width="96">
        <template slot-scope="scope" v-if="scope.row.isOver">
          <el-button type="primary" icon="el-icon-tickets" round size="mini" @click="editEnd(scope.row.tecMeetingId)">总结</el-button>
        </template>
      </el-table-column>
      <el-table-column label="会议状态操作" width="106">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.started" type="primary" icon="el-icon-caret-right" round size="mini" @click="handleStart(scope.row.tecMeetingId)">开始</el-button>
          <el-button v-else type="success" :disabled="scope.row.isOver" icon="el-icon-finished" round size="mini" @click="handleOver(scope.row.tecMeetingId)">{{scope.row.isOver === true ?"已结束" :"结束"}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="88">
        <template slot-scope="scope">
          <el-button type="primary" :disabled="scope.row.isOver" icon="el-icon-edit" circle size="mini" @click="openEditMeeting(scope.row.tecMeetingId)"></el-button>
          <el-button type="danger" :disabled="scope.row.started" icon="el-icon-delete" circle size="mini" @click="deleteMeeting(scope.row.tecMeetingId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background :page-size="this.$store.state.meetingPageSize"
      layout="total, prev, pager, next, jumper"
      :total="this.$store.state.meetingTotalCount"
      @next-click="getNextPage" @prev-click="getPrevPage" @current-change="getCurrentPage">
    </el-pagination>
    <add-meeting></add-meeting>
    <edit-meeting></edit-meeting>
    <edit-end-meeting></edit-end-meeting>
  </div>
</template>
<script>
import addMeeting from '@/views/AppMain/MainModules/MeetingList/component/addMeeting.vue'
import editMeeting from '@/views/AppMain/MainModules/MeetingList/component/editMeeting.vue'
import editEndMeeting from '@/views/AppMain/MainModules/MeetingList/component/editEndMeeting.vue'
import { dateKeyClear, clearEmptyKey } from '@/util/utils.js'
export default {
  components: {
    'add-meeting': addMeeting,
    'edit-meeting': editMeeting,
    'edit-end-meeting': editEndMeeting
  },
  data () {
    return {
      meetingSearchForm: {
        tecMeetingName: '',
        meetHostName: '',
        tecMeetingSolveProblem: null,
        startDate: '',
        endDate: ''
      },
      MeetingSolveProblem: [{
        typeId: 0,
        typeName: '未解决'
      }, {
        typeId: 1,
        typeName: '已解决'
      }],
      timer: null
    }
  },
  created () {
    this.$store.commit('getMeetingList', {
      currentPage: 1
    })
  },
  methods: {
    editEnd (id) {
      this.$store.commit('editEndMeeting', id)
    },
    handleStart (id) {
      this.$store.commit('startMeeting', id)
    },
    handleOver (id) {
      this.$confirm('该操作将结束会议，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('overMeeting', id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消结束会议操作！'
        })
      })
    },
    searchMeeting () {
      let searchForm = { ...this.meetingSearchForm }
      parseInt(searchForm.tecMeetingStatus)
      dateKeyClear(searchForm, 'startDate', 'startDateStart', 'startDateEnd')
      dateKeyClear(searchForm, 'endDate', 'endDateStart', 'endDateEnd')
      clearEmptyKey(searchForm)
      console.log(searchForm.tecMeetingStatus)
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.$store.commit('searchMeeting', searchForm)
      }, 500)
    },
    resetSearch (formName) {
      this.$store.commit('getMeetingList', {
        currentPage: 1
      })
      this.$refs[formName].resetFields()
    },
    openEditMeeting (id) {
      this.$store.commit('openEditMeeting', id)
    },
    openAddMeetingDialog () {
      this.$store.commit('openAddMeetingDialog')
    },
    deleteMeeting (id) {
      this.$confirm('此操作将永久删除该会议, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('deleteMeeting', id)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getNextPage () {
      this.$store.commit('getMeetingList', {
        currentPage: ++this.currentPage
      })
    },
    getPrevPage () {
      this.$store.commit('getMeetingList', {
        currentPage: --this.currentPage
      })
    },
    getCurrentPage (val) {
      this.currentPage = val
      this.$store.commit('getMeetingList', {
        currentPage: this.currentPage
      })
    }
  }
}
</script>
<style lang="scss">
  .meeting-container {
    position: relative;
    .resolved{
      color:#4e504a;
      font-weight: bolder;
    }
    .ing{
      color:#4e504a;
      font-weight: bolder;
    }
    .int{
      color: #ff4850;
      font-weight: bolder;
    }
    .over{
      color:#999;
    }
    .el-table {
      margin-top: 10px;
    }

    .el-table th > .cell {
      white-space: pre-line;
      word-wrap: break-word;
    }
    .MeetingSpirit .tips-btn {
      width: 86px;
    }
    .tips-btn {
      width: 60px;
      padding: 6px 0px;
      font-size: 12px;
    }

    .el-pagination {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: -50px;
    }

    .search-container {
      .el-form-item {
        display: inline-block;
        width: 172px;
        margin-right: 6px;
        margin-bottom: 4px;

        &.date-form {
          width: 350px;
        }
      }

      margin-bottom: 10px;
    }

    .el-table td, .el-table th {
      padding: 10px 0;
    }
  }
</style>
