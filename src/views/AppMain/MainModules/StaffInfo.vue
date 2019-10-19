<template>
    <div>
        <el-row :gutter="15">
            <el-col :span="3"><time-choser></time-choser></el-col>
            <el-col :span="12"><search></search></el-col>
        </el-row>
        <br>
        <el-row :gutter="90">
            <el-col :span="1">
                <batch-delete></batch-delete>
            </el-col>
            <el-col :span="1">
                <add-button></add-button>
            </el-col>
        </el-row>
        <br>
        <el-row>
            <staff-list :tableData = 'this.staffList'></staff-list>
        </el-row>
        <br/>
        <el-row class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            @prev-click="handlePrevClick"
            @next-click="handleNextClick"
            :current-page.sync="currentPage"
            :page-size="10"
            layout="sizes, prev, pager, next, jumper"
            :total="this.total"
            :page-sizes="[10, 30, 50, 100]">
          </el-pagination>
        </el-row>
    </div>
</template>

<script>
import StaffList from '@/components/StaffList/StaffList'
import Search from '@/components/public/Search'
import TimeChoser from '@/components/public/TimeChoser'
import AddButton from '@/components/public/AddButton'
import BatchDelete from '@/components/public/BatchDelete'

export default {
  data () {
    return {
      staffList: [],
      pageNum: 0,
      currentPage: 1,
      pageSize: 0,
      total: 0
    }
  },
  components: {
    StaffList,
    Search,
    TimeChoser,
    AddButton,
    BatchDelete
  },
  methods: {
    updateList (pageNum) {
      this.$axios.fetchGet('http://47.100.56.42:8069/api/emp/findAll', {
        pageNum: pageNum,
        Authorization: this.$store.state.token.accessToken
      }).then((res) => {
        if (res.data.statuscode === 200) {
          let list = res.data.content.list
          list.forEach((item) => {
            item.empEntryTime = this.timeFormat(item.empEntryTime)
          })
          this.staffList = list
          this.pageSize = res.data.content.size
          this.total = res.data.content.total
        }
      })
    },
    timeFormat (str) {
      let year = new Date(str).getFullYear()
      let month = new Date(str).getMonth() + 1
      let day = new Date(str).getDate()
      return `${year}-${month}-${day}`
    },
    handleSizeChange (val) {
      this.pageSize = val
      console.log(this.pageSize)
    },
    handleCurrentChange (val) {
      this.updateList(val)
    },
    handlePrevClick () {
      this.pageNum--
      if (!this.pageNum) this.pageNum = 0
      this.updateList(this.pageNum)
    },
    handleNextClick () {
      this.pageNum++
      if (this.pageNum >= 5) this.pageNum = 5
      this.updateList(this.pageNum)
    }
  },
  mounted () {
    this.updateList(this.pageNum)
  }
}
</script>

<style lang="scss" scoped>
  .pagination.el-row{
    text-align: center;
  }
</style>
