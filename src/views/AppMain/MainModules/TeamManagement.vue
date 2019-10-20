<template>
  <div class="Team-menagement-container">
    <el-button type="primary" size="small" icon="el-icon-circle-plus">添加</el-button>
    <el-button type="danger" size="small" icon="el-icon-delete-solid">批量删除</el-button>
    <el-table
      ref="multipleTable"
      :data="tableData"
      stripe
      border
      fit
      style="width: 100%">
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
        prop="groupTypeName"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="tecGroupExpiredDate"
        label="组过期时间">
        <template slot-scope="scope">
           <span v-html="scope.row.tecGroupExpiredDate"></span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template>
        <!--<template slot-scope="scope">
          <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>-->
          <el-button type="primary" icon="el-icon-edit" circle size="small"></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="small"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="totalItem">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data () {
    return {
      tableData: [],
      totalItem: 100
    }
  },
  created () {
    this.getTeamList()
  },
  methods: {
    getTeamList () {
      this.$axios.fetchGet('http://47.100.56.42:8068/group/lists')
        .then(res => {
          console.log(res)
          if (res.data.statuscode === 200) {
            let resList = res.data.content.list
            console.log(resList)
            for (let i of resList) {
              console.log(i)
              i.tecGroupCreateDate = i.tecGroupCreateDate.replace(/\s/g, '<br>')
              i.tecGroupExpiredDate = i.tecGroupExpiredDate.replace(/\s/g, '<br>')
            }
            this.tableData = resList
            // this.totalItem = res.data.content.totalCount
            console.log(this.totalItem)
          }
        })
    }
  }
}

</script>

<style lang="scss">
  .Team-menagement-container{
    position: relative;
    .el-table{
      margin-top:20px;
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
  }

</style>
