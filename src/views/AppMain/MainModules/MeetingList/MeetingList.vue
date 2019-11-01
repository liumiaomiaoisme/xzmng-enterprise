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
      <el-form-item class="date-form" prop="startDate">
        <el-date-picker
          v-model="meetingSearchForm.startDate" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss" type="daterange" range-separator="至" start-placeholder="会议开始日期范围起" end-placeholder="会议开始日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="date-form" prop="endDate">
        <el-date-picker
          v-model="meetingSearchForm.endDate" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss" type="daterange" range-separator="至" start-placeholder="会议结束日期范围起" end-placeholder="会议结束日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchMeeting" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('meetingSearchForm')">重置</el-button>
    </el-form>
    <!--meeting table-->
    <el-button @click="openAddMeetingDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
    <el-table :data="this.$store.state.meetingTableData" stripe border fit  width="150" v-loading="this.$store.state.loading">
      <el-table-column prop="tecMeetingName" label="会议名称" fixed ></el-table-column>
      <el-table-column prop="tecMeetingStartDate" label="会议开始时间" width="106" >
        <template slot-scope="scope">
           <span v-html="scope.row.tecMeetingStartDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="tecMeetingEndDate" label="会议结束时间" width="106">
        <template slot-scope="scope">
           <span v-html="scope.row.tecMeetingEndDate"></span>
        </template>
      </el-table-column>
      <el-table-column prop="meetHostName" label="会议主持人"></el-table-column>
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
      <el-table-column prop="tecMeetingSolveProblem" label="是否解决问题"></el-table-column>
      <el-table-column prop="tecMeetingSummary" label="会议总结">
        <template slot-scope="scope">
          <el-popover placement="top-start" title="会议总结" width="200" trigger="hover" :content="scope.row.tecMeetingSummary">
            <el-button slot="reference" class="tips-btn">查看总结</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="96">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="small" @click="openEditMeeting(scope.row.tecMeetingId)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteMeeting(scope.row.tecMeetingId)"></el-button>
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
  </div>
</template>
<script>
import addMeeting from '@/views/AppMain/MainModules/MeetingList/component/addMeeting.vue'
import editMeeting from '@/views/AppMain/MainModules/MeetingList/component/editMeeting.vue'
import { dateKeyClear, clearEmptyKey } from '@/util/utils.js'
export default {
  components: {
    'add-meeting': addMeeting,
    'edit-meeting': editMeeting
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
    searchMeeting () {
      let searchForm = { ...this.meetingSearchForm }
      dateKeyClear(searchForm, 'startDate', 'startDateStart', 'startDateEnd')
      dateKeyClear(searchForm, 'endDate', 'endDateStart', 'endDateEnd')
      clearEmptyKey(searchForm)
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
      this.$store.commit('deleteMeeting', id)
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
