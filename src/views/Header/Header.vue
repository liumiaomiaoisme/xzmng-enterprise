<template>
  <el-row class="header-container">
    <el-row type="flex" class="header-inner" justify="space-between">
      <el-col :span="12">
        <h3 class="system-name">技术管理系统</h3>
        <span>{{'【' + this.$store.state.depName + ' - ' + this.$store.state.posName + ' - ' + this.$store.state.userName + '】'}}</span>
      </el-col>
      <el-col :span="6" class="text-push-right">
        <a href="#" @click="logout" class="logout">退出</a>
<!--        <el-avatar :size="30" :src="circleUrl"></el-avatar>-->
<!--        <span class="username">{{this.$store.state.userName}}</span>-->
<!--        <el-dropdown>-->
<!--          <span class="el-dropdown-link text-lg text-color">-->
<!--            <i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--          </span>-->
<!--          <el-dropdown-menu slot="dropdown">-->
<!--            <el-dropdown-item>-->
<!--              <a href="#">个人信息</a>-->
<!--            </el-dropdown-item>-->
<!--            <el-dropdown-item>-->
<!--              -->
<!--            </el-dropdown-item>-->
<!--          </el-dropdown-menu>-->
<!--        </el-dropdown>-->
      </el-col>
    </el-row>
  </el-row>
</template>

<style lang="scss">
  .header-container{
    height: 40px;
    .el-avatar{
      margin-top: -5px;
      vertical-align: middle;
    }
    .username{
      color: #fff;
      line-height: 40px;
      padding:0 10px;
      font-size: 14px;
    }
    .el-icon-arrow-down{
      vertical-align: middle;
      color:#409EFF;
    }
    .el-dropdown,
    .header-inner{
      height: 40px;
    }
    .system-name{
      display: inline-block;
      padding-right: 20px;
    }
    .logout{
      color: #fff;
      font-size: 12px;
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
  created () {
    this.$store.commit('getUserInfo')
  },
  methods: {
    logout () {
      this.$store.commit('logout')
      this.$router.push({ path: '/TechLogin' })
    }
  }
}
</script>
