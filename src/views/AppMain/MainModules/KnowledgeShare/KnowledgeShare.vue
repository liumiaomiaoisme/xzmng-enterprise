<template>
  <div class="share-container">
    <!-- 分享搜索-->
    <el-form :model="shareSearchForm" class="search-container" size="mini" ref="shareSearchForm">
      <el-form-item prop="tecShareTitle">
        <el-input v-model="shareSearchForm.tecShareTitle" prefix-icon="el-icon-search" placeholder="请输入分享标题"></el-input>
      </el-form-item>
      <el-form-item prop="tecShareFounderName">
        <el-input  v-model="shareSearchForm.tecShareFounderName" prefix-icon="el-icon-search" placeholder="请输入分享创建人"></el-input>
      </el-form-item>
      <el-form-item>
        <el-select placeholder="请选择分享类型" v-model="shareSearchForm.shareType" clearable>
          <el-option :label="item.tyName" :value="item.tyId" v-for="item in this.$store.state.shareTypeDate" :key="item.tyId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="tecShareLabel">
        <el-input  v-model="shareSearchForm.tecShareLabel" prefix-icon="el-icon-search" placeholder="请输入分享标签"></el-input>
      </el-form-item>
      <el-form-item class="date-form" prop="createDate">
        <el-date-picker
          v-model="shareSearchForm.createDate" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd hh:mm:ss" type="daterange" range-separator="至" start-placeholder="分享创建日期范围起" end-placeholder="分享创建日期范围止">
        </el-date-picker>
      </el-form-item>
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchShare" plain>查询</el-button>
      <el-button type="info" size="mini" icon="el-icon-refresh" plain @click="resetSearch('shareSearchForm')">重置</el-button>
    </el-form>
    <!-- 分享列表-->
    <el-button @click="openAddShareDialog" type="primary" size="mini" icon="el-icon-circle-plus">添加</el-button>
    <el-table :data="this.$store.state.shareListData" stripe border fit v-loading="this.$store.state.loading">
      <el-table-column type="expand" label="详情" width="60">
        <template slot-scope="props">
          <div class="ql-container ql-snow">
              <div class="ql-editor" v-html='props.row.tecShareContent'></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="tecShareTitle" label="分享的标题"></el-table-column>
      <el-table-column prop="tecShareFounderName" label="分享创建人"></el-table-column>
      <el-table-column prop="tecShareTypeName" label="分享的类型"></el-table-column>
      <el-table-column prop="tecShareLabel" label="分享的标签"></el-table-column>
      <el-table-column prop="tecShareStatus" label="分享的状态"></el-table-column>
      <el-table-column prop="tecShareViewsCount" label="分享的浏览次数"></el-table-column>
      <el-table-column prop="tecShareCreateDate" label="分享创建日期"></el-table-column>
      <el-table-column fixed="right" label="操作" width="96">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="small" @click="openEditShare(scope.row.tecShareId)"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small" @click="deleteShare(scope.row.tecShareId)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background :page-size="this.$store.state.sharePageSize"
      layout="total, prev, pager, next, jumper"
      :total="this.$store.state.shareListTotalCount"
      @next-click="getNextPage" @prev-click="getPrevPage" @current-change="getCurrentPage">
    </el-pagination>
    <add-share></add-share>
    <edit-share></edit-share>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import AddShare from '@/views/AppMain/MainModules/KnowledgeShare/component/addShare.vue'
import EditShare from '@/views/AppMain/MainModules/KnowledgeShare/component/editShare.vue'
export default {
  data () {
    return {
      shareSearchForm: {}
    }
  },
  components: {
    'add-share': AddShare,
    'edit-share': EditShare
  },
  created () {
    this.$store.commit('getShareList', {
      currentPage: 1
    })
    this.$store.commit('getShareType')
  },
  methods: {
    getNextPage () {
      this.$store.commit('getShareList', {
        currentPage: ++this.currentPage
      })
    },
    getPrevPage () {
      this.$store.commit('getShareList', {
        currentPage: --this.currentPage
      })
    },
    getCurrentPage (val) {
      this.currentPage = val
      this.$store.commit('getShareList', {
        currentPage: this.currentPage
      })
    },
    openEditShare (id) {
      this.$store.commit('openEditShare', id)
    },
    openAddShareDialog () {
      this.$store.commit('openAddShare')
    },
    searchShare () {
      let searchForm = { ...this.shareSearchForm }
      if (searchForm.createDate) {
        searchForm.createDateStart = searchForm.createDate[0]
        searchForm.createDateEnd = searchForm.createDate[1]
      }
      if (searchForm.shareType) {
        switch (searchForm.shareType) {
          case 1:
            searchForm.shareType = '前端'
            break
          case 2:
            searchForm.shareType = '后端'
            break
          case 3:
            searchForm.shareType = 'UI'
            break
          case 4:
            searchForm.shareType = '测试'
            break
        }
      }
      delete searchForm.createDate
      this.$store.commit('searchShare', searchForm)
    },
    resetSearch (formName) {
      this.$refs[formName].resetFields()
      this.$store.commit('getShareList', {
        currentPage: this.currentPage
      })
    },
    deleteShare (id) {
      this.$store.commit('deleteShare', id)
    }
  }

}
</script>
<style lang="scss" scoped>
.share-container{
  .search-container{
    margin-bottom: 10px;
    .el-form-item{
      display: inline-block;
      width:172px;
      margin-right: 6px;
      margin-bottom: 4px;
      &.date-form{
        width:350px;
      }
    }
  }
  .el-table{
    margin-top: 10px;
  }
  .el-pagination{
    position: absolute;
    left:50%;
    transform: translateX(-50%);
    bottom: -50px;
    margin-top: 10px;
  }
}
</style>
