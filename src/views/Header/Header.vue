<template>
  <el-row class="header-container">
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="6"><h3>技术管理系统</h3></el-col>
      <el-col :span="6" class="text-push-right">
        <el-avatar :size="36" :src="circleUrl"></el-avatar>
        <span class="username">{{this.$store.state.username}}</span>
        <el-dropdown>
          <span class="el-dropdown-link text-lg text-color">
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <a href="#">个人信息</a>
            </el-dropdown-item>
            <el-dropdown-item>
              <a href="#" @click="logout">退出</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-row>
</template>

<style lang="scss">
  .header-container{
    .el-avatar{
      vertical-align: middle;
    }
    .username{
      color: #fff;
      vertical-align: middle;
      padding:0 10px;
    }
    .el-icon-arrow-down{
      vertical-align: middle;
      color:#409EFF;
    }
  }
</style>

<script>
export default {
  data () {
    return {
      activeIndex: '1',
      circleUrl: ''
    }
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.$router.push({ path: '/Tech/TechLogin' })
    }
  }
}
</script>
